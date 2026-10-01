// import React, { useState, useMemo, useRef } from "react";
// import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Grid3X3, LayoutGrid, Hotel, HomeIcon, Building as BuildingIcon, Castle, Crown, Instagram, Globe, Phone } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import useNavigation from "../../hooks/useNavigation";
// import { usePropertyFilter } from "../../hooks/usePropertyFilter";

// // Import images from assets
// import individualImg from "../../assets/individualcat.jpg";
// import commercialImg from "../../assets/commercialcat.jpg";
// import landPlotsImg from "../../assets/landcat.jpg";
// import hostelImg from "../../assets/hostelcat.jpg";
// import bannerImg from "../../assets/Apartmentban.jpg";

// // Import category images for apartment types
// import rentalApartmentImg from "../../assets/rentalapart.jpg";
// import servicedApartmentImg from "../../assets/servicedapart.jpg";
// import leaseApartmentImg from "../../assets/leaseapart.jpg";
// import residentialApartmentImg from "../../assets/residentialapart.jpg";
// import gatedCommunityImg from "../../assets/gatedapart.jpg";
// import studioApartmentImg from "../../assets/studioapar.jpg";
// import duplexApartmentImg from "../../assets/duplexapar.jpg";
// import luxuryApartmentImg from "../../assets/luxuryapar.jpg";
// import condominiumImg from "../../assets/condoapar.jpg";
// import penthouseApartmentImg from "../../assets/penthouseapar.jpg";

// import PropertyList from "../../components/propertycard/PropertyList";
// import Pagination from "../../components/common/Pagination";
// import { usePagination } from "../../hooks/usePagination";

// const ApartmentPage = () => {
//   const navigate = useNavigate();
  
//   // ✅ USE CENTRALIZED NAVIGATION HOOK
//   const { 
//     data, 
//     loading, 
//     activeApartmentType, 
//     handleNavigation 
//   } = useNavigation();
  
//   // ✅ USE CENTRALIZED FILTER HOOK
//   const { 
//     filteredData, 
//     filterLoading, 
//     appliedFilters, 
//     handleFilterChange 
//   } = usePropertyFilter('apartment');

//   // ─── Combine Data from Both Hooks ────────────────────────────────────
//   const properties = useMemo(() => {
//     if (appliedFilters && filteredData.length > 0) {
//       return filteredData;
//     }
//     return data;
//   }, [data, filteredData, appliedFilters]);

//   const isLoading = loading || filterLoading;

//   // ─── Pagination — client-side over the current properties list ────────
//   const resultsRef = useRef(null);
//   const {
//     currentPage,
//     totalPages,
//     paginatedItems: paginatedProperties,
//     goToPage
//   } = usePagination({ items: properties, pageSize: 10, scrollRef: resultsRef });

//   const [activeButton, setActiveButton] = useState("Rent");
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [hoveredFilter, setHoveredFilter] = useState(null);
//   const [showFilterModal, setShowFilterModal] = useState(false);

//   const propertyCategories = [
//     { name: "Individual", path: "/individual", icon: <Building className="w-4 h-4" /> },
//     { name: "Commercial", path: "/commercial", icon: <Landmark className="w-4 h-4" /> },
//     { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
//     { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
//   ];

//   // Property type categories with images for round display - includes "All"
//   const propertyTypeCategories = [
//     { 
//       name: "All", 
//       path: "/apartment", 
//       image: null,
//       icon: <Home className="w-6 h-6" />,
//       isAll: true,
//       displayName: "All",
//       subText: ""
//     },
//     { 
//       name: "Rental", 
//       path: "/apartment/rental-apartment", 
//       image: rentalApartmentImg,
//       icon: <Building className="w-5 h-5" />,
//       displayName: "Rental",
//       subText: "Apartment"
//     },
//     { 
//       name: "Serviced", 
//       path: "/apartment/serviced-apartment", 
//       image: servicedApartmentImg,
//       icon: <Hotel className="w-5 h-5" />,
//       displayName: "Serviced",
//       subText: "Apartment"
//     },
//     { 
//       name: "Lease", 
//       path: "/apartment/lease-apartment", 
//       image: leaseApartmentImg,
//       icon: <Building2 className="w-5 h-5" />,
//       displayName: "Lease",
//       subText: "Apartment"
//     },
//     { 
//       name: "Residential", 
//       path: "/apartment/residential-apartments", 
//       image: residentialApartmentImg,
//       icon: <Building className="w-5 h-5" />,
//       displayName: "Residential",
//       subText: "Apartment"
//     },
//     { 
//       name: "Gated", 
//       path: "/apartment/gated-community-apartment", 
//       image: gatedCommunityImg,
//       icon: <Hotel className="w-5 h-5" />,
//       displayName: "Gated",
//       subText: "Community"
//     },
//     { 
//       name: "Studio", 
//       path: "/apartment/studio-apartment", 
//       image: studioApartmentImg,
//       icon: <LayoutGrid className="w-5 h-5" />,
//       displayName: "Studio",
//       subText: "Apartment"
//     },
//     { 
//       name: "Duplex", 
//       path: "/apartment/duplex-apartment", 
//       image: duplexApartmentImg,
//       icon: <Grid3X3 className="w-5 h-5" />,
//       displayName: "Duplex",
//       subText: "Apartment"
//     },
//     { 
//       name: "Luxury", 
//       path: "/apartment/luxury-apartment", 
//       image: luxuryApartmentImg,
//       icon: <Crown className="w-5 h-5" />,
//       displayName: "Luxury",
//       subText: "Apartment"
//     },
//     { 
//       name: "Condo", 
//       path: "/apartment/condominium", 
//       image: condominiumImg,
//       icon: <BuildingIcon className="w-5 h-5" />,
//       displayName: "Condo",
//       subText: "Apartment"
//     },
//     { 
//       name: "Penthouse", 
//       path: "/apartment/penthouse-apartment", 
//       image: penthouseApartmentImg,
//       icon: <Castle className="w-5 h-5" />,
//       displayName: "Penthouse",
//       subText: "Apartment"
//     }
//   ];

//   // Apartment types based on the image provided
//   const apartmentTypes = [
//     { name: "All", path: "/apartment", component: "ApartmentPage" },
//     { name: "Rental Apartment", path: "/apartment/rental-apartment", component: "RentalApartmentPage" },
//     { name: "Serviced Apartment", path: "/apartment/serviced-apartment", component: "ServicedApartmentPage" },
//     { name: "Lease Apartment", path: "/apartment/lease-apartment", component: "LeaseApartmentPage" },
//     { name: "Residential Apartment", path: "/apartment/residential-apartments", component: "ResidentialApartmentPage" },
//     { name: "Gated Community Apartment", path: "/apartment/gated-community-apartment", component: "GatedCommunityApartmentPage" },
//     { name: "Studio Apartment", path: "/apartment/studio-apartment", component: "StudioApartmentPage" },
//     { name: "Duplex Apartment", path: "/apartment/duplex-apartment", component: "DuplexApartmentPage" },
//     { name: "Luxury Apartment", path: "/apartment/luxury-apartment", component: "LuxuryApartmentPage" },
//     { name: "Condominium (Condo)", path: "/apartment/condominium", component: "CondominiumPage" },
//     { name: "Penthouse Apartment", path: "/apartment/penthouse-apartment", component: "PenthouseApartmentPage" }
//   ];

//   // Diamond collage entries with imported images
//   const bannerDiamonds = [
//     {
//       label: "Individual",
//       path: "/individual",
//       image: individualImg,
//       position: "top"
//     },
//     {
//       label: "Commercial",
//       path: "/commercial",
//       image: commercialImg,
//       position: "left"
//     },
//     {
//       label: "Land & Plots",
//       path: "/land-plots",
//       image: landPlotsImg,
//       position: "right"
//     },
//     {
//       label: "Hostels",
//       path: "/hostel",
//       image: hostelImg,
//       position: "bottom"
//     }
//   ];

//   // ❌ REMOVED: Local useEffect - Hook handles this automatically
//   // useEffect(() => {
//   //   const currentPath = location.pathname;
//   //   const activeType = apartmentTypes.find(type => type.path === currentPath);
//   //   if (activeType) {
//   //     setActiveApartmentType(activeType.name);
//   //   } else if (currentPath === "/apartment" || currentPath === "/apartment/") {
//   //     setActiveApartmentType("All");
//   //   }
//   // }, [location.pathname]);

//   // ❌ REMOVED: Local handleNavigation - Using hook's handleNavigation
//   // const handleNavigation = (path, typeName = null) => {
//   //   if (typeName) {
//   //     setActiveApartmentType(typeName);
//   //   }
//   //   navigate(path);
//   // };

//   const handlePropertyCategoryNavigation = (path) => {
//     navigate(path);
//   };

//   // Diamond click handler
//   const handleDiamondClick = (path) => {
//     navigate(path);
//   };

//   // ❌ REMOVED: Local handleFilterChange - Using hook's handleFilterChange
//   // const handleFilterChange = (filters) => {
//   //   setAppliedFilters(filters);
//   //   console.log("Applied Filters:", filters);
//   // };

//   /* ─── Single category pill ─── */
//   const CategoryPill = ({ category, mobile = false, isActive = false }) => (
//     <div
//       className={`group cursor-pointer flex flex-col items-center transition-all duration-300 hover:scale-105 flex-shrink-0 ${
//         mobile ? "active:scale-95" : ""
//       }`}
//       onClick={() => handlePropertyCategoryNavigation(category.path)}
//     >
//       <div
//         className={`relative ${
//           mobile
//             ? "w-9 h-9 xs:w-10 xs:h-10 border-2"
//             : "w-12 h-12 sm:w-14 sm:h-14 md:w-17 md:h-17 border-[3px]"
//         } rounded-full overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg ${
//           isActive
//             ? 'border-[#00695C] shadow-[0_0_18px_rgba(0,105,92,0.3)]'
//             : 'border-gray-300 hover:border-[#00695C]'
//         }`}
//       >
//         {category.isAll ? (
//           <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
//             isActive ? 'bg-[#00695C]' : 'bg-gray-100 group-hover:bg-[#D1E2DB]'
//           }`}>
//             <Home className={`${mobile ? 'w-3.5 h-3.5' : 'w-5 h-5 md:w-5.5 md:h-5.5'} transition-colors duration-300 ${
//               isActive ? 'text-white' : 'text-[#00695C]'
//             }`} />
//           </div>
//         ) : (
//           <>
//             <img
//               src={category.image}
//               alt={category.name}
//               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
//           </>
//         )}
//       </div>

//       <div className="flex flex-col items-center mt-0.5">
//         <span className={`${
//           mobile ? "text-[7px]" : "text-[8px] sm:text-[9px] md:text-[11px]"
//         } font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
//           isActive ? 'text-[#00695C]' : 'text-[#143B35] group-hover:text-[#00695C]'
//         }`}>
//           {category.displayName || category.name}
//         </span>
//         {category.subText && (
//           <span className={`${
//             mobile ? "text-[7px]" : "text-[8px] sm:text-[9px] md:text-[11px]"
//           } font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
//             isActive ? 'text-[#00695C]' : 'text-[#143B35] group-hover:text-[#00695C]'
//           }`}>
//             {category.subText}
//           </span>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="w-full min-h-screen relative bg-gradient-to-b from-teal-50 via-white to-teal-50">
//       <div className="relative z-10">
//         {/* ===================== BANNER - RESPONSIVE ===================== */}
//         <section className="relative overflow-hidden bg-[#E7EFEA]">
//           {/* Decorative top shape */}
//           <div className="absolute top-0 left-0 w-[130px] h-[45px] rounded-br-[35px] sm:w-[170px] sm:h-[58px] sm:rounded-br-[50px] md:w-[210px] md:h-[72px] md:rounded-br-[60px] lg:w-[250px] lg:h-[85px] lg:rounded-br-[70px] bg-[#D6E4DE]" />

//           <div className="max-w-[1600px] mx-auto">
//             <div className="flex flex-row min-h-[170px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[330px]">

//               {/* LEFT CONTENT */}
//               <div className="flex flex-col justify-center w-[38%] sm:w-[37%] md:w-[36%] lg:w-[35%] shrink-0 px-2.5 sm:px-5 md:px-6 lg:px-10 py-2.5 sm:py-4 md:py-6 lg:py-7 z-20">

//                 <h1 className="leading-none">
//                   <span className="block text-[11px] sm:text-[15px] md:text-[20px] lg:text-[28px] font-light text-[#042F2A]">
//                     MODERN
//                   </span>

//                   <span className="block text-[16px] sm:text-[24px] md:text-[36px] lg:text-[50px] font-black text-[#012D29] leading-tight">
//                     APARTMENTS
//                   </span>

//                   <span className="block text-[12px] sm:text-[17px] md:text-[23px] lg:text-[30px] font-bold text-[#012D29] leading-tight">
//                     FOR SALE
//                   </span>
//                 </h1>

//                 <p className="mt-1 sm:mt-2 md:mt-2.5 lg:mt-3 max-w-[120px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px] text-[#31544E] text-[8px] sm:text-[10px] md:text-xs lg:text-sm leading-snug lg:leading-relaxed">
//                   Discover premium villas, apartments,
//                   plots and commercial spaces in prime
//                   locations.
//                 </p>

//                 <button
//                   className="mt-1.5 sm:mt-2.5 md:mt-3 lg:mt-4 w-fit px-2.5 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-1.5 lg:px-6 lg:py-2 rounded-md lg:rounded-lg text-white font-bold shadow-md lg:shadow-xl text-[7px] sm:text-[9px] md:text-[11px] lg:text-sm"
//                   style={{
//                     background: "linear-gradient(135deg,#00695C,#26A69A)"
//                   }}
//                 >
//                   EXPLORE NOW
//                 </button>
//               </div>

//               {/* RIGHT COLLAGE */}
//               <div className="relative overflow-hidden flex-1" style={{ aspectRatio: '16/8' }}>
//                 <img
//                   src={bannerImg}
//                   alt="Building"
//                   className="absolute inset-0 w-full h-full object-cover object-top brightness-75"
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-r from-[#E7EFEA] via-transparent to-transparent" />

//                 <div className="absolute inset-0 flex items-center justify-start pl-2 sm:pl-4 md:pl-6 lg:pl-7 z-20">
//                   <div className="relative w-[260px] h-[260px] scale-[0.42] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-left transition-transform duration-300">

//                     {/* TOP DIAMOND - Individual */}
//                     <div
//                       className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30"
//                       style={{
//                         width: "100px",
//                         height: "100px",
//                         top: "0px",
//                         left: "80px",
//                       }}
//                       onClick={() => handleDiamondClick(bannerDiamonds[0].path)}
//                     >
//                       <div
//                         className="relative w-full h-full overflow-hidden shadow-xl"
//                         style={{
//                           transform: "rotate(45deg)",
//                           borderRadius: "18px",
//                           border: "3px solid rgba(255,255,255,0.85)",
//                           boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
//                         }}
//                       >
//                         <img
//                           src={bannerDiamonds[0].image}
//                           alt="Individual"
//                           className="absolute inset-0 w-full h-full object-cover"
//                           style={{
//                             transform: "rotate(-45deg) scale(1.3)",
//                             transformOrigin: "center",
//                           }}
//                         />
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
//                           }}
//                         />
//                       </div>
//                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                         <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10">
//                           Individual
//                         </span>
//                       </div>
//                     </div>

//                     {/* LEFT DIAMOND - Commercial */}
//                     <div
//                       className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30"
//                       style={{
//                         width: "100px",
//                         height: "100px",
//                         top: "80px",
//                         left: "0px",
//                       }}
//                       onClick={() => handleDiamondClick(bannerDiamonds[1].path)}
//                     >
//                       <div
//                         className="relative w-full h-full overflow-hidden shadow-xl"
//                         style={{
//                           transform: "rotate(45deg)",
//                           borderRadius: "18px",
//                           border: "3px solid rgba(255,255,255,0.85)",
//                           boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
//                         }}
//                       >
//                         <img
//                           src={bannerDiamonds[1].image}
//                           alt="Commercial"
//                           className="absolute inset-0 w-full h-full object-cover"
//                           style={{
//                             transform: "rotate(-45deg) scale(1.5)",
//                             transformOrigin: "center",
//                           }}
//                         />
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
//                           }}
//                         />
//                       </div>
//                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                         <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10">
//                           Commercial
//                         </span>
//                       </div>
//                     </div>

//                     {/* RIGHT DIAMOND - Land & Plots */}
//                     <div
//                       className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30"
//                       style={{
//                         width: "100px",
//                         height: "100px",
//                         top: "80px",
//                         left: "160px",
//                       }}
//                       onClick={() => handleDiamondClick(bannerDiamonds[2].path)}
//                     >
//                       <div
//                         className="relative w-full h-full overflow-hidden shadow-xl"
//                         style={{
//                           transform: "rotate(45deg)",
//                           borderRadius: "18px",
//                           border: "3px solid rgba(255,255,255,0.85)",
//                           boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
//                         }}
//                       >
//                         <img
//                           src={bannerDiamonds[2].image}
//                           alt="Land & Plots"
//                           className="absolute inset-0 w-full h-full object-cover"
//                           style={{
//                             transform: "rotate(-45deg) scale(1.5)",
//                             transformOrigin: "center",
//                           }}
//                         />
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
//                           }}
//                         />
//                       </div>
//                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                         <span className="text-white font-bold text-[10px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center leading-tight z-10">
//                           Land & Plots
//                         </span>
//                       </div>
//                     </div>

//                     {/* BOTTOM DIAMOND - Hostels */}
//                     <div
//                       className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30"
//                       style={{
//                         width: "100px",
//                         height: "100px",
//                         top: "160px",
//                         left: "80px",
//                       }}
//                       onClick={() => handleDiamondClick(bannerDiamonds[3].path)}
//                     >
//                       <div
//                         className="relative w-full h-full overflow-hidden shadow-xl"
//                         style={{
//                           transform: "rotate(45deg)",
//                           borderRadius: "18px",
//                           border: "3px solid rgba(255,255,255,0.85)",
//                           boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
//                         }}
//                       >
//                         <img
//                           src={bannerDiamonds[3].image}
//                           alt="Hostels"
//                           className="absolute inset-0 w-full h-full object-cover"
//                           style={{
//                             transform: "rotate(-45deg) scale(1.5)",
//                             transformOrigin: "center",
//                           }}
//                         />
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
//                           }}
//                         />
//                       </div>
//                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                         <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10">
//                           Hostels
//                         </span>
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* =================== MENU =================== */}
//         <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500">
//           <div className="max-w-none mx-auto px-6 py-3.5">
//             <div className="hidden md:block space-y-3.5">
//               <div className="flex gap-3.5 items-center">
//                 <div className="relative">
//                   <button
//                     onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
//                     className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
//                     style={{
//                       background: "linear-gradient(135deg, #00695C, #26A69A)",
//                       backgroundSize: "200% 200%"
//                     }}
//                   >
//                     <div className="absolute inset-0 animate-gradient-shift-slow"></div>
//                     <Home className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//                     <span className="relative z-10 text-sm">{activeButton}</span>
//                     <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
//                     <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
//                   </button>

//                   {openDropdown === "toggle" && (
//                     <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[170px] border border-teal-200/30 animate-slide-down-fast">
//                       <button
//                         onClick={() => {
//                           handleNavigation("/buy");
//                           setActiveButton("Buy");
//                           setOpenDropdown(null);
//                         }}
//                         className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
//                       >
//                         <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                           <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
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
//                         className="w-full px-5 py-3 text-left text-sm font-semibold transition-all duration-300 group"
//                         style={{ color: "#00695C", backgroundColor: "#e0f2f1" }}
//                       >
//                         <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                           <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
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
//                         className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
//                       >
//                         <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                           <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
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
//                         className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
//                       >
//                         <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                           <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
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
//                     className="w-full pl-9 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
//                   />
//                   <MapPin className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
//                 </div>

//                 <button
//                   onClick={() => setShowFilterModal(true)}
//                   className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden"
//                   style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
//                 >
//                   <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
//                   <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//                   <span className="relative z-10 text-sm">Advanced Filters</span>
//                   {appliedFilters && (
//                     <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
//                   )}
//                 </button>
//               </div>

//               {/* ====== PROPERTY TYPE CATEGORIES - MODERATE SIZE (DESKTOP) ====== */}
//               <div className="flex flex-wrap items-center justify-center gap-3.5 md:gap-5 pt-1.5">
//                 {propertyTypeCategories.map((category) => {
//                   const isActive = activeApartmentType === category.name;
//                   return (
//                     <CategoryPill key={category.name} category={category} isActive={isActive} />
//                   );
//                 })}
//               </div>
//             </div>

//             {/* =================== MOBILE MENU =================== */}
//             <div className="md:hidden space-y-3">
//               <div className="flex gap-2.5 items-center">
//                 <div className="relative">
//                   <button
//                     onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
//                     className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl"
//                     style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
//                   >
//                     <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
//                     <Home className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//                     <span className="relative z-10 text-sm">{activeButton}</span>
//                     <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
//                   </button>

//                   {openDropdown === "toggle" && (
//                     <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[170px] border border-teal-200/30 animate-slide-down-fast">
//                       {["Buy", "Rent", "Lease", "Sell"].map((item, idx, arr) => (
//                         <React.Fragment key={item}>
//                           <button
//                             onClick={() => { handleNavigation(`/${item.toLowerCase()}`); setActiveButton(item); setOpenDropdown(null); }}
//                             className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
//                             style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
//                           >
//                             <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                               <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
//                               {item}
//                             </div>
//                           </button>
//                           {idx < arr.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>}
//                         </React.Fragment>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="relative flex-1 group">
//                   <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
//                   <input
//                     type="text"
//                     placeholder="Search apartments..."
//                     className="w-full pl-9 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
//                   />
//                 </div>

//                 <button
//                   onClick={() => setShowFilterModal(true)}
//                   className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl flex-shrink-0"
//                   style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
//                 >
//                   <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
//                   <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//                   <span className="relative z-10 hidden sm:inline text-sm">Filters</span>
//                 </button>
//               </div>

//               {/* ====== PROPERTY TYPE CATEGORIES - MOBILE ====== */}
//               <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
//                 {propertyTypeCategories.map((category) => {
//                   const isActive = activeApartmentType === category.name;
//                   return (
//                     <CategoryPill key={category.name} category={category} mobile isActive={isActive} />
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* =================== FILTER MODAL =================== */}
//         {showFilterModal && (
//           <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[120px] px-4 pb-4 bg-black/50 backdrop-blur-sm animate-fade-in">
//             <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
//               <div className="bg-gradient-to-b from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 border border-teal-200/30">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
//                     <Filter className="w-5 h-5 text-teal-600" />
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                       Advanced Filters
//                     </span>
//                   </h3>
//                   <button
//                     onClick={() => setShowFilterModal(false)}
//                     className="p-2 hover:bg-teal-100 rounded-full transition-all duration-300"
//                   >
//                     <X className="w-5 h-5 text-teal-600" />
//                   </button>
//                 </div>

//                 <div className="mb-4">
//                   <label className="text-sm font-semibold text-teal-800 mb-2 block">Price Range</label>
//                   <div className="flex gap-3">
//                     <input type="number" placeholder="Min" className="w-1/2 px-3 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500" />
//                     <input type="number" placeholder="Max" className="w-1/2 px-3 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500" />
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="text-sm font-semibold text-teal-800 mb-2 block">BHK Type</label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk) => (
//                       <label key={bhk} className="flex items-center gap-2 p-2 rounded-xl border-2 border-teal-200/50 cursor-pointer">
//                         <input type="checkbox" className="w-3.5 h-3.5 rounded border-teal-300 text-teal-600" />
//                         <span className="text-xs text-teal-800">{bhk}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4 border-t border-teal-200/30">
//                   <button className="flex-1 px-4 py-2 rounded-xl border-2 border-teal-200/50 text-sm font-medium text-teal-700 hover:bg-teal-50 transition-all duration-300">
//                     Clear All
//                   </button>
//                   <button className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-xl hover:shadow-[0_0_25px_rgba(0,105,92,0.4)] transition-all duration-300"
//                     style={{ background: "linear-gradient(135deg, #00695C, #26A69A)" }}>
//                     Apply Filters
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* =================== MAIN CONTENT =================== */}
//         <div className="max-w-none mx-auto px-6 py-7 lg:py-11">
//           <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
//             <div className="lg:w-2/3">
//               <section ref={resultsRef} className="scroll-mt-40 lg:scroll-mt-48">
//                 {isLoading ? (
//                   <div className="flex justify-center items-center py-20">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//                   </div>
//                 ) : (
//                   <>
//                     <PropertyList
//                       properties={paginatedProperties}
//                       emptyMessage={
//                         activeApartmentType !== "All"
//                           ? `We don't have any ${activeApartmentType.toLowerCase()} available at the moment.`
//                           : "We're currently adding exclusive apartment listings to our database."
//                       }
//                       emptyIcon="🏢"
//                       emptyTitle={`No ${activeApartmentType !== "All" ? `${activeApartmentType} ` : ""}Apartments Found`}
//                     />
//                     <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
//                   </>
//                 )}
//               </section>
//             </div>

//             <div className="hidden lg:block lg:w-1/3 lg:relative">
//               <div className="lg:sticky lg:top-[110px] lg:max-h-[calc(100vh-130px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
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
//                         Price Range
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
//                       <span className="text-xl animate-bounce-slow">🏠</span>
//                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                         BHK Type
//                       </span>
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk, index) => (
//                         <label
//                           key={bhk}
//                           onMouseEnter={() => setHoveredFilter(`bhk-${index}`)}
//                           onMouseLeave={() => setHoveredFilter(null)}
//                           className={`flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group animate-fade-in-up ${
//                             hoveredFilter === `bhk-${index}` ? 'scale-[1.02]' : ''
//                           }`}
//                           style={{ animationDelay: `${index * 50}ms` }}
//                         >
//                           <input
//                             type="checkbox"
//                             className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300"
//                           />
//                           <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
//                             {bhk}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="mb-6 animate-fade-in-up delay-300">
//                     <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
//                       <span className="text-xl animate-bounce-slow">📐</span>
//                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                         Area (sq ft)
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
//                   </div>

//                   <div className="mb-6 animate-fade-in-up delay-400">
//                     <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
//                       <span className="text-xl animate-bounce-slow">🏢</span>
//                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                         Amenities
//                       </span>
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       {["Parking", "Gym", "Swimming Pool", "Security", "Elevator", "Balcony"].map((amenity) => (
//                         <label
//                           key={amenity}
//                           className="flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group"
//                         >
//                           <input
//                             type="checkbox"
//                             className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300"
//                           />
//                           <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
//                             {amenity}
//                           </span>
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
//         @keyframes gradient-shift {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-gradient-shift {
//           background-size: 200% 200%;
//           animation: gradient-shift 2s linear infinite;
//         }
//         .animate-gradient-shift-slow {
//           background-size: 200% 200%;
//           animation: gradient-shift 4s linear infinite;
//         }
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up {
//           animation: fade-in-up 0.6s ease-out forwards;
//         }
//         @keyframes slide-down {
//           from { transform: translateY(-20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
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
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out forwards;
//         }
//         .animate-rotate-slow {
//           animation: spin 10s linear infinite;
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
//         @keyframes gradient-text {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-gradient-text-slow {
//           background-size: 300% 300%;
//           animation: gradient-text 5s ease infinite;
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

// export default ApartmentPage;










import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Grid3X3, LayoutGrid, Hotel, HomeIcon, Building as BuildingIcon, Castle, Crown, Instagram, Globe, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useNavigation from "../../hooks/useNavigation";
import { usePropertyFilter } from "../../hooks/usePropertyFilter";
import { searchPropertiesSimple } from "../../services/filterService";

// Import images from assets
import individualImg from "../../assets/individualcat.jpg";
import commercialImg from "../../assets/commercialcat.jpg";
import landPlotsImg from "../../assets/landcat.jpg";
import hostelImg from "../../assets/hostelcat.jpg";
import bannerImg from "../../assets/apartban1.png";

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
import allCategoryImg from "../../assets/Apartmentban.jpg";

import PropertyList from "../../components/propertycard/PropertyList";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";

const ApartmentPage = () => {
const navigate = useNavigate();

// ✅ USE CENTRALIZED NAVIGATION HOOK
const {
data,
loading,
activeApartmentType,
handleNavigation
} = useNavigation();

// ✅ USE CENTRALIZED FILTER HOOK
const {
filteredData,
filterLoading,
appliedFilters,
handleFilterChange
} = usePropertyFilter('apartment');

// ─── Listing-purpose filter (Buy/Rent/Lease pill, combined with this
// page's own taxonomy — stays on this page instead of navigating away
// to a separate /buy, /rent, /lease route). This overview page always
// shows "All" apartment types, so the combined filter uses property_category
// instead of a specific property_type. ─────────────────────────────────
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
const taxonomyParams = activeApartmentType && activeApartmentType !== "All"
? { property_type: activeApartmentType }
: { property_category: "APARTMENT" };
searchPropertiesSimple({
...taxonomyParams,
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
}, [listingPurpose, activeApartmentType]);

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
const [showFilterModal, setShowFilterModal] = useState(false);

const propertyCategories = [
{ name: "Individual", path: "/individual", icon: <Building className="w-4 h-4" /> },
{ name: "Commercial", path: "/commercial", icon: <Landmark className="w-4 h-4" /> },
{ name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
{ name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
];

// Property type categories with images for round display - includes "All"
const propertyTypeCategories = [
{
name: "All",
path: "/apartment",
image: allCategoryImg,
icon: <Home className="w-6 h-6" />,
isAll: true,
displayName: "All",
subText: ""
},
{
name: "Rental",
path: "/apartment/rental-apartment",
image: rentalApartmentImg,
icon: <Building className="w-5 h-5" />,
displayName: "Rental",
subText: "Apartment"
},
{
name: "Serviced",
path: "/apartment/serviced-apartment",
image: servicedApartmentImg,
icon: <Hotel className="w-5 h-5" />,
displayName: "Serviced",
subText: "Apartment"
},
{
name: "Lease",
path: "/apartment/lease-apartment",
image: leaseApartmentImg,
icon: <Building2 className="w-5 h-5" />,
displayName: "Lease",
subText: "Apartment"
},
{
name: "Residential",
path: "/apartment/residential-apartments",
image: residentialApartmentImg,
icon: <Building className="w-5 h-5" />,
displayName: "Residential",
subText: "Apartment"
},
{
name: "Gated",
path: "/apartment/gated-community-apartment",
image: gatedCommunityImg,
icon: <Hotel className="w-5 h-5" />,
displayName: "Gated",
subText: "Community"
},
{
name: "Studio",
path: "/apartment/studio-apartment",
image: studioApartmentImg,
icon: <LayoutGrid className="w-5 h-5" />,
displayName: "Studio",
subText: "Apartment"
},
{
name: "Duplex",
path: "/apartment/duplex-apartment",
image: duplexApartmentImg,
icon: <Grid3X3 className="w-5 h-5" />,
displayName: "Duplex",
subText: "Apartment"
},
{
name: "Luxury",
path: "/apartment/luxury-apartment",
image: luxuryApartmentImg,
icon: <Crown className="w-5 h-5" />,
displayName: "Luxury",
subText: "Apartment"
},
{
name: "Condo",
path: "/apartment/condominium",
image: condominiumImg,
icon: <BuildingIcon className="w-5 h-5" />,
displayName: "Condo",
subText: "Apartment"
},
{
name: "Penthouse",
path: "/apartment/penthouse-apartment",
image: penthouseApartmentImg,
icon: <Castle className="w-5 h-5" />,
displayName: "Penthouse",
subText: "Apartment"
}
];

// Apartment types based on the image provided
const apartmentTypes = [
{ name: "All", path: "/apartment", component: "ApartmentPage" },
{ name: "Rental Apartment", path: "/apartment/rental-apartment", component: "RentalApartmentPage" },
{ name: "Serviced Apartment", path: "/apartment/serviced-apartment", component: "ServicedApartmentPage" },
{ name: "Lease Apartment", path: "/apartment/lease-apartment", component: "LeaseApartmentPage" },
{ name: "Residential Apartment", path: "/apartment/residential-apartments", component: "ResidentialApartmentPage" },
{ name: "Gated Community Apartment", path: "/apartment/gated-community-apartment", component: "GatedCommunityApartmentPage" },
{ name: "Studio Apartment", path: "/apartment/studio-apartment", component: "StudioApartmentPage" },
{ name: "Duplex Apartment", path: "/apartment/duplex-apartment", component: "DuplexApartmentPage" },
{ name: "Luxury Apartment", path: "/apartment/luxury-apartment", component: "LuxuryApartmentPage" },
{ name: "Condominium (Condo)", path: "/apartment/condominium", component: "CondominiumPage" },
{ name: "Penthouse Apartment", path: "/apartment/penthouse-apartment", component: "PenthouseApartmentPage" }
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

// ❌ REMOVED: Local useEffect - Hook handles this automatically
// useEffect(() => {
//   const currentPath = location.pathname;
//   const activeType = apartmentTypes.find(type => type.path === currentPath);
//   if (activeType) {
//     setActiveApartmentType(activeType.name);
//   } else if (currentPath === "/apartment" || currentPath === "/apartment/") {
//     setActiveApartmentType("All");
//   }
// }, [location.pathname]);

// ❌ REMOVED: Local handleNavigation - Using hook's handleNavigation
// const handleNavigation = (path, typeName = null) => {
//   if (typeName) {
//     setActiveApartmentType(typeName);
//   }
//   navigate(path);
// };

const handlePropertyCategoryNavigation = (path) => {
navigate(path);
};

// Diamond click handler
const handleDiamondClick = (path) => {
navigate(path);
};

// ❌ REMOVED: Local handleFilterChange - Using hook's handleFilterChange
// const handleFilterChange = (filters) => {
//   setAppliedFilters(filters);
//   console.log("Applied Filters:", filters);
// };

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-teal-50 via-white to-teal-50">
      <div className="relative z-10">
        {/* ===================== BANNER — SAME AS HOSTEL PAGE ===================== */}
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
                    APARTMENTS
                  </span>

                  <span className="block text-[12px] sm:text-[17px] md:text-[23px] lg:text-[30px] font-bold text-[#012D29] leading-tight">
                    FOR SALE
                  </span>
                </h1>

                <p className="mt-1 sm:mt-2 md:mt-2.5 lg:mt-3 max-w-[120px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px] text-[#31544E] text-[8px] sm:text-[10px] md:text-xs lg:text-sm leading-snug lg:leading-relaxed">
                  Discover premium villas, apartments,
                  plots and commercial spaces in prime
                  locations.
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
                {/* Main Building Background — VIVID (same as hostel pages) */}
                <img
                  src={bannerImg}
                  alt="Building"
                  className="absolute inset-0 w-full h-full object-cover object-top contrast-105 saturate-110"
                />

                {/* Soft overlay — 60% opacity (same as hostel pages) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#E7EFEA]/60 via-transparent to-transparent" />

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

                    {/* LEFT DIAMOND - Commercial */}
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
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10 transition-all duration-300 group-hover/diamond:scale-110">
                          Commercial
                        </span>
                      </div>
                      
                      <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#C9A227] opacity-0 group-hover/diamond:opacity-100 group-hover/diamond:animate-ping" />
                    </div>

                    {/* RIGHT DIAMOND - Land & Plots */}
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
                        <span className="text-white font-bold text-[10px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center leading-tight z-10 transition-all duration-300 group-hover/diamond:scale-110">
                          Land & Plots
                        </span>
                      </div>
                      
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C9A227] opacity-0 group-hover/diamond:opacity-100 group-hover/diamond:animate-ping" />
                    </div>

                    {/* BOTTOM DIAMOND - Hostels */}
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
                          alt="Hostels"
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
                          Hostels
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

        {/* =================== MENU =================== */}
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

              {/* ====== PROPERTY TYPE CATEGORIES - MODERATE SIZE (DESKTOP) ====== */}
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
                      <div 
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-17 md:h-17 rounded-full overflow-hidden border-[3px] transition-all duration-300 shadow-md hover:shadow-lg ${
                          isActive 
                            ? 'border-[#00695C] shadow-[0_0_18px_rgba(0,105,92,0.3)]' 
                            : 'border-gray-300 hover:border-[#00695C]'
                        }`}
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        {category.isAll && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <span className="text-white text-[9px] sm:text-[10px] md:text-[12px] font-extrabold tracking-wider drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                              ALL
                            </span>
                          </div>
                        )}
                      </div>
                      
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

            {/* =================== MOBILE MENU =================== */}
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
                    placeholder="Search apartments..."
                    className="w-full pl-9 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
                  />
                </div>

                <button
                  onClick={() => setShowFilterModal(true)}
                  className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
                >
                  <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
                  <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10 hidden sm:inline text-sm">Filters</span>
                </button>
              </div>

              {/* ====== PROPERTY TYPE CATEGORIES - MOBILE ====== */}
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
                      <div
                        className={`relative w-9 h-9 xs:w-10 xs:h-10 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm ${
                          isActive
                            ? 'border-[#00695C] shadow-[0_0_10px_rgba(0,105,92,0.3)]'
                            : 'border-gray-300'
                        }`}
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        {category.isAll && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="text-white text-[7px] font-extrabold tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                              ALL
                            </span>
                          </div>
                        )}
                      </div>

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

        {/* =================== MOBILE FILTER MODAL =================== */}
        {showFilterModal && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4 pb-4 bg-black/50 backdrop-blur-sm animate-fade-in lg:hidden">
            <div className="relative w-full max-w-2xl max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 rounded-full bg-white shadow-lg hover:bg-teal-50 transition-all duration-300"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5 text-teal-600" />
                </button>
              </div>
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
                      <span className="text-xl animate-bounce-slow">🏠</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        BHK Type
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk, index) => (
                        <label
                          key={bhk}
                          onMouseEnter={() => setHoveredFilter(`bhk-${index}`)}
                          onMouseLeave={() => setHoveredFilter(null)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group animate-fade-in-up ${
                            hoveredFilter === `bhk-${index}` ? 'scale-[1.02]' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300"
                          />
                          <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
                            {bhk}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-300">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">📐</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Area (sq ft)
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
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-400">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">🏢</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Amenities
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Parking", "Gym", "Swimming Pool", "Security", "Elevator", "Balcony"].map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300"
                          />
                          <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
                            {amenity}
                          </span>
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
        )}

        {/* =================== MAIN CONTENT =================== */}
        <div className="max-w-none mx-auto px-6 py-7 lg:py-11">
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
                        activeApartmentType !== "All"
                          ? `We don't have any ${activeApartmentType.toLowerCase()} available at the moment.`
                          : "We're currently adding exclusive apartment listings to our database."
                      }
                      emptyIcon="🏢"
                      emptyTitle={`No ${activeApartmentType !== "All" ? `${activeApartmentType} ` : ""}Apartments Found`}
                    />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                  </>
                )}
              </section>
            </div>

            <div className="hidden lg:block lg:w-1/3 lg:relative">
              <div className="lg:sticky lg:top-[110px] lg:max-h-[calc(100vh-130px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
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
                      <span className="text-xl animate-bounce-slow">🏠</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        BHK Type
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk, index) => (
                        <label
                          key={bhk}
                          onMouseEnter={() => setHoveredFilter(`bhk-${index}`)}
                          onMouseLeave={() => setHoveredFilter(null)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group animate-fade-in-up ${
                            hoveredFilter === `bhk-${index}` ? 'scale-[1.02]' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300"
                          />
                          <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
                            {bhk}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-300">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">📐</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Area (sq ft)
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
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-400">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">🏢</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Amenities
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Parking", "Gym", "Swimming Pool", "Security", "Elevator", "Balcony"].map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300"
                          />
                          <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
                            {amenity}
                          </span>
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

export default ApartmentPage;