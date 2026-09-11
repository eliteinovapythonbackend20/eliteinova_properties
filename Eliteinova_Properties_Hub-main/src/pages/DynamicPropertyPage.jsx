// // DynamicPropertyPage.jsx - ONE component for ALL property types
// // All styles preserved from your original IndependentVillaPage, IndividualPage, etc.
// import React, { useState, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { 
//   ChevronDown, Search, Home, MapPin, Star, Filter 
// } from "lucide-react";
// import useNavigation from "../../hooks/useNavigation";
// import PropertyList from "../../components/propertycard/PropertyList";
// import backgroundImage from "../../assets/ind1.jpg";

// // ============================================
// // CONFIGURATION FOR ALL PROPERTY TYPES
// // ============================================
// const PROPERTY_CONFIGS = {
//   // ===== INDIVIDUAL PROPERTIES =====
//   'independent-house': {
//     title: 'Independent House',
//     icon: '🏠',
//     emptyMessage: 'No independent houses available at the moment.',
//     category: 'individual',
//     parentCategory: 'Individual Properties'
//   },
//   'independent-villa': {
//     title: 'Independent Villa',
//     icon: '🏡',
//     emptyMessage: 'No independent villas available at the moment.',
//     category: 'individual',
//     parentCategory: 'Individual Properties'
//   },
//   'residential-apartment': {
//     title: 'Residential Apartment',
//     icon: '🏢',
//     emptyMessage: 'No residential apartments available at the moment.',
//     category: 'individual',
//     parentCategory: 'Individual Properties'
//   },
//   'duplex-residential-unit': {
//     title: 'Duplex Unit',
//     icon: '🏘️',
//     emptyMessage: 'No duplex residential units available at the moment.',
//     category: 'individual',
//     parentCategory: 'Individual Properties'
//   },
//   'row-house': {
//     title: 'Row House',
//     icon: '🏚️',
//     emptyMessage: 'No row houses available at the moment.',
//     category: 'individual',
//     parentCategory: 'Individual Properties'
//   },

//   // ===== APARTMENT PROPERTIES =====
//   'rental-apartment': {
//     title: 'Rental Apartment',
//     icon: '🏢',
//     emptyMessage: 'No rental apartments available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'serviced-apartment': {
//     title: 'Serviced Apartment',
//     icon: '🏨',
//     emptyMessage: 'No serviced apartments available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'lease-apartment': {
//     title: 'Lease Apartment',
//     icon: '📄',
//     emptyMessage: 'No lease apartments available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'residential-apartments': {
//     title: 'Residential Apartments',
//     icon: '🏢',
//     emptyMessage: 'No residential apartments available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'gated-community-apartment': {
//     title: 'Gated Community Apartment',
//     icon: '🏘️',
//     emptyMessage: 'No gated community apartments available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'studio-apartment': {
//     title: 'Studio Apartment',
//     icon: '🏠',
//     emptyMessage: 'No studio apartments available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'duplex-apartment': {
//     title: 'Duplex Apartment',
//     icon: '🏘️',
//     emptyMessage: 'No duplex apartments available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'luxury-apartment': {
//     title: 'Luxury Apartment',
//     icon: '💎',
//     emptyMessage: 'No luxury apartments available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'condominium': {
//     title: 'Condominium',
//     icon: '🏢',
//     emptyMessage: 'No condominiums available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },
//   'penthouse-apartment': {
//     title: 'Penthouse',
//     icon: '🌆',
//     emptyMessage: 'No penthouses available at the moment.',
//     category: 'apartment',
//     parentCategory: 'Apartments'
//   },

//   // ===== COMMERCIAL PROPERTIES =====
//   'office-space': {
//     title: 'Office Space',
//     icon: '🏢',
//     emptyMessage: 'No office spaces available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'retail-shop': {
//     title: 'Retail Shop',
//     icon: '🛍️',
//     emptyMessage: 'No retail shops available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'showroom': {
//     title: 'Showroom',
//     icon: '🚗',
//     emptyMessage: 'No showrooms available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'commercial-land-plot': {
//     title: 'Commercial Land Plot',
//     icon: '🏗️',
//     emptyMessage: 'No commercial land plots available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'warehouse-godown': {
//     title: 'Warehouse / Godown',
//     icon: '🏭',
//     emptyMessage: 'No warehouses available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'industrial-property-factory': {
//     title: 'Industrial Property / Factory',
//     icon: '🏭',
//     emptyMessage: 'No industrial properties available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'coworking-space': {
//     title: 'Co-working Space',
//     icon: '💻',
//     emptyMessage: 'No co-working spaces available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'business-center': {
//     title: 'Business Center',
//     icon: '🏛️',
//     emptyMessage: 'No business centers available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'shopping-mall-space': {
//     title: 'Shopping Mall Space',
//     icon: '🛒',
//     emptyMessage: 'No shopping mall spaces available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'commercial-complex': {
//     title: 'Commercial Complex',
//     icon: '🏬',
//     emptyMessage: 'No commercial complexes available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'restaurant-cafe-space': {
//     title: 'Restaurant / Café Space',
//     icon: '🍽️',
//     emptyMessage: 'No restaurant spaces available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'hotel-lodge-resort-property': {
//     title: 'Hotel / Resort Property',
//     icon: '🏨',
//     emptyMessage: 'No hotel properties available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'clinic-hospital-space': {
//     title: 'Clinic / Hospital Space',
//     icon: '🏥',
//     emptyMessage: 'No clinic spaces available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'educational-institution-property': {
//     title: 'Educational Institution',
//     icon: '🎓',
//     emptyMessage: 'No educational institutions available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'it-park-tech-park-space': {
//     title: 'IT / Tech Park Space',
//     icon: '💻',
//     emptyMessage: 'No IT park spaces available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'multiplex-entertainment-space': {
//     title: 'Multiplex / Entertainment Space',
//     icon: '🎬',
//     emptyMessage: 'No multiplex spaces available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'petrol-bunk-fuel-station': {
//     title: 'Petrol Bunk / Fuel Station',
//     icon: '⛽',
//     emptyMessage: 'No petrol bunks available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'cold-storage-logistics-hub': {
//     title: 'Cold Storage / Logistics Hub',
//     icon: '❄️',
//     emptyMessage: 'No cold storage available at the moment.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'mixed-use-commercial-property': {
//     title: 'Mixed-use Commercial',
//     icon: '🏗️',
//     emptyMessage: 'No mixed-use commercial properties available.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },
//   'agricultural-commercial-property': {
//     title: 'Agricultural Commercial',
//     icon: '🌾',
//     emptyMessage: 'No agricultural commercial properties available.',
//     category: 'commercial',
//     parentCategory: 'Commercial Properties'
//   },

//   // ===== LAND & PLOTS - Residential =====
//   'residential-plot': {
//     title: 'Residential Plot',
//     icon: '🏗️',
//     emptyMessage: 'No residential plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },
//   'dtcp-cmda-approved-plot': {
//     title: 'DTCP Approved Plot',
//     icon: '📋',
//     emptyMessage: 'No DTCP approved plots available.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },
//   'gated-community-plot': {
//     title: 'Gated Community Plot',
//     icon: '🏘️',
//     emptyMessage: 'No gated community plots available.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },
//   'villa-plot': {
//     title: 'Villa Plot',
//     icon: '🏡',
//     emptyMessage: 'No villa plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },
//   'farm-house-plot': {
//     title: 'Farm House Plot',
//     icon: '🌳',
//     emptyMessage: 'No farm house plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },
//   'common-plot': {
//     title: 'Common Plot',
//     icon: '🏗️',
//     emptyMessage: 'No common plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },
//   'independent-house-plot': {
//     title: 'Independent House Plot',
//     icon: '🏠',
//     emptyMessage: 'No independent house plots available.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },
//   'duplex-house-plot': {
//     title: 'Duplex House Plot',
//     icon: '🏘️',
//     emptyMessage: 'No duplex house plots available.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },
//   'row-house-plot': {
//     title: 'Row House Plot',
//     icon: '🏚️',
//     emptyMessage: 'No row house plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Residential Land'
//   },

//   // ===== LAND & PLOTS - Commercial =====
//   'commercial-plot': {
//     title: 'Commercial Plot',
//     icon: '🏗️',
//     emptyMessage: 'No commercial plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'office-space-land': {
//     title: 'Office Space Land',
//     icon: '🏢',
//     emptyMessage: 'No office space land available at the moment.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'retail-shop-plot': {
//     title: 'Retail Shop Plot',
//     icon: '🛍️',
//     emptyMessage: 'No retail shop plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'showroom-plot': {
//     title: 'Showroom Plot',
//     icon: '🚗',
//     emptyMessage: 'No showroom plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'shopping-complex-land': {
//     title: 'Shopping Complex Land',
//     icon: '🛒',
//     emptyMessage: 'No shopping complex land available.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'hotel-resort-land': {
//     title: 'Hotel / Resort Land',
//     icon: '🏨',
//     emptyMessage: 'No hotel resort land available.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'petrol-bunk-plot': {
//     title: 'Petrol Bunk Plot',
//     icon: '⛽',
//     emptyMessage: 'No petrol bunk plots available.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'it-park-land': {
//     title: 'IT Park Land',
//     icon: '💻',
//     emptyMessage: 'No IT park land available at the moment.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'warehouse-land': {
//     title: 'Warehouse Land',
//     icon: '🏭',
//     emptyMessage: 'No warehouse land available at the moment.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },
//   'industrial-commercial-plot': {
//     title: 'Industrial Commercial Plot',
//     icon: '🏭',
//     emptyMessage: 'No industrial commercial plots available.',
//     category: 'land',
//     parentCategory: 'Commercial Land'
//   },

//   // ===== LAND & PLOTS - Agricultural =====
//   'agricultural-land': {
//     title: 'Agricultural Land',
//     icon: '🌾',
//     emptyMessage: 'No agricultural land available at the moment.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },
//   'farm-land': {
//     title: 'Farm Land',
//     icon: '🚜',
//     emptyMessage: 'No farm land available at the moment.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },
//   'organic-farming-land': {
//     title: 'Organic Farming Land',
//     icon: '🌱',
//     emptyMessage: 'No organic farming land available.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },
//   'coconut-farm-land': {
//     title: 'Coconut Farm Land',
//     icon: '🥥',
//     emptyMessage: 'No coconut farm land available at the moment.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },
//   'mango-grove-land': {
//     title: 'Mango Grove Land',
//     icon: '🥭',
//     emptyMessage: 'No mango grove land available at the moment.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },
//   'tea-coffee-estate': {
//     title: 'Tea / Coffee Estate',
//     icon: '☕',
//     emptyMessage: 'No tea/coffee estates available.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },
//   'poultry-farm-land': {
//     title: 'Poultry Farm Land',
//     icon: '🐔',
//     emptyMessage: 'No poultry farm land available.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },
//   'dairy-farm-land': {
//     title: 'Dairy Farm Land',
//     icon: '🐄',
//     emptyMessage: 'No dairy farm land available at the moment.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },
//   'fisheries-aquaculture-land': {
//     title: 'Fisheries / Aquaculture Land',
//     icon: '🐟',
//     emptyMessage: 'No fisheries land available at the moment.',
//     category: 'land',
//     parentCategory: 'Agricultural Land'
//   },

//   // ===== LAND & PLOTS - Industrial =====
//   'industrial-plot': {
//     title: 'Industrial Plot',
//     icon: '🏭',
//     emptyMessage: 'No industrial plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Industrial Land'
//   },
//   'factory-land': {
//     title: 'Factory Land',
//     icon: '🏗️',
//     emptyMessage: 'No factory land available at the moment.',
//     category: 'land',
//     parentCategory: 'Industrial Land'
//   },
//   'manufacturing-unit-plot': {
//     title: 'Manufacturing Unit Plot',
//     icon: '⚙️',
//     emptyMessage: 'No manufacturing unit plots available.',
//     category: 'land',
//     parentCategory: 'Industrial Land'
//   },
//   'logistics-hub-land': {
//     title: 'Logistics Hub Land',
//     icon: '🚚',
//     emptyMessage: 'No logistics hub land available.',
//     category: 'land',
//     parentCategory: 'Industrial Land'
//   },
//   'warehouse-plot': {
//     title: 'Warehouse Plot',
//     icon: '🏭',
//     emptyMessage: 'No warehouse plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Industrial Land'
//   },
//   'cold-storage-land': {
//     title: 'Cold Storage Land',
//     icon: '❄️',
//     emptyMessage: 'No cold storage land available at the moment.',
//     category: 'land',
//     parentCategory: 'Industrial Land'
//   },
//   'sez-land': {
//     title: 'SEZ Land',
//     icon: '🏛️',
//     emptyMessage: 'No SEZ land available at the moment.',
//     category: 'land',
//     parentCategory: 'Industrial Land'
//   },

//   // ===== LAND & PLOTS - Mixed-Use =====
//   'residential-commercial-plot': {
//     title: 'Residential + Commercial Plot',
//     icon: '🏗️',
//     emptyMessage: 'No residential-commercial plots available.',
//     category: 'land',
//     parentCategory: 'Mixed-Use Land'
//   },
//   'commercial-industrial-land': {
//     title: 'Commercial + Industrial Land',
//     icon: '🏭',
//     emptyMessage: 'No commercial-industrial land available.',
//     category: 'land',
//     parentCategory: 'Mixed-Use Land'
//   },
//   'township-development-land': {
//     title: 'Township Development Land',
//     icon: '🏘️',
//     emptyMessage: 'No township development land available.',
//     category: 'land',
//     parentCategory: 'Mixed-Use Land'
//   },
//   'multi-purpose-development-land': {
//     title: 'Multi-purpose Development Land',
//     icon: '🏗️',
//     emptyMessage: 'No multi-purpose development land available.',
//     category: 'land',
//     parentCategory: 'Mixed-Use Land'
//   },

//   // ===== LAND & PLOTS - Institutional =====
//   'school-college-land': {
//     title: 'School / College Land',
//     icon: '🎓',
//     emptyMessage: 'No school/college land available.',
//     category: 'land',
//     parentCategory: 'Institutional Land'
//   },
//   'hospital-clinic-land': {
//     title: 'Hospital / Clinic Land',
//     icon: '🏥',
//     emptyMessage: 'No hospital/clinic land available.',
//     category: 'land',
//     parentCategory: 'Institutional Land'
//   },
//   'training-institute-plot': {
//     title: 'Training Institute Plot',
//     icon: '📚',
//     emptyMessage: 'No training institute plots available.',
//     category: 'land',
//     parentCategory: 'Institutional Land'
//   },
//   'religious-institution-land': {
//     title: 'Religious Institution Land',
//     icon: '⛪',
//     emptyMessage: 'No religious institution land available.',
//     category: 'land',
//     parentCategory: 'Institutional Land'
//   },

//   // ===== LAND & PLOTS - Investment =====
//   'highway-facing-plot': {
//     title: 'Highway Facing Plot',
//     icon: '🛣️',
//     emptyMessage: 'No highway facing plots available.',
//     category: 'land',
//     parentCategory: 'Investment Land'
//   },
//   'lake-view-plot': {
//     title: 'Lake View Plot',
//     icon: '🏞️',
//     emptyMessage: 'No lake view plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Investment Land'
//   },
//   'hill-view-plot': {
//     title: 'Hill View Plot',
//     icon: '⛰️',
//     emptyMessage: 'No hill view plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Investment Land'
//   },
//   'beach-side-plot': {
//     title: 'Beach Side Plot',
//     icon: '🏖️',
//     emptyMessage: 'No beach side plots available at the moment.',
//     category: 'land',
//     parentCategory: 'Investment Land'
//   },
//   'river-side-land': {
//     title: 'River Side Land',
//     icon: '🏞️',
//     emptyMessage: 'No river side land available at the moment.',
//     category: 'land',
//     parentCategory: 'Investment Land'
//   },
//   'eco-tourism-land': {
//     title: 'Eco Tourism Land',
//     icon: '🌿',
//     emptyMessage: 'No eco tourism land available at the moment.',
//     category: 'land',
//     parentCategory: 'Investment Land'
//   },
//   'layout-development-land': {
//     title: 'Layout Development Land',
//     icon: '📐',
//     emptyMessage: 'No layout development land available.',
//     category: 'land',
//     parentCategory: 'Investment Land'
//   },
//   'future-investment-plot': {
//     title: 'Future Investment Plot',
//     icon: '📈',
//     emptyMessage: 'No future investment plots available.',
//     category: 'land',
//     parentCategory: 'Investment Land'
//   },

//   // ===== HOSTEL =====
//   'girls-hostel': {
//     title: 'Girls Hostel',
//     icon: '👩',
//     emptyMessage: 'No girls hostels available at the moment.',
//     category: 'hostel',
//     parentCategory: 'Hostels'
//   },
//   'boys-hostel': {
//     title: 'Boys Hostel',
//     icon: '👨',
//     emptyMessage: 'No boys hostels available at the moment.',
//     category: 'hostel',
//     parentCategory: 'Hostels'
//   },
//   'co-living-space': {
//     title: 'Co-living Space',
//     icon: '🤝',
//     emptyMessage: 'No co-living spaces available at the moment.',
//     category: 'hostel',
//     parentCategory: 'Hostels'
//   },
//   'working-professional-hostel': {
//     title: 'Working Professional Hostel',
//     icon: '💼',
//     emptyMessage: 'No working professional hostels available.',
//     category: 'hostel',
//     parentCategory: 'Hostels'
//   }
// };

// // ============================================
// // MAIN COMPONENT
// // ============================================
// const DynamicPropertyPage = () => {
//   const { propertyType, category } = useParams();
  
//   // Get config for this property type
//   const config = PROPERTY_CONFIGS[propertyType];
  
//   // Use centralized navigation hook
//   const { 
//     data, 
//     loading, 
//     activeHouseType, 
//     handleNavigation 
//   } = useNavigation();
  
//   // State for filters - matching original
//   const [activeButton, setActiveButton] = useState("Rent");
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [filteredData, setFilteredData] = useState([]);
//   const [hoveredFilter, setHoveredFilter] = useState(null);
  
//   // Use filtered data if available, otherwise use all data
//   const properties = useMemo(() => {
//     return filteredData.length > 0 ? filteredData : data;
//   }, [data, filteredData]);

//   // Handle filter changes
//   const handleFilterChange = (filters) => {
//     const filtered = data.filter(item => {
//       // Your filter logic here
//       return true;
//     });
//     setFilteredData(filtered);
//   };

//   // If property type doesn't exist, show 404
//   if (!config) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-red-500">404</h1>
//           <p className="text-gray-600">Property type not found</p>
//         </div>
//       </div>
//     );
//   }

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
//         {/* ── HERO SECTION ── */}
//         <section className="w-full relative flex items-center justify-center group py-2 md:py-4">
//           <div className="absolute inset-0 bg-gradient-to-b animate-gradient-slow"></div>
//           <div className="max-w-none mx-auto px-4 sm:px-6 relative z-10 text-center w-full flex flex-col items-center justify-center gap-2">
//             <div className="hidden sm:inline-flex mb-1 items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-lg border border-teal-300/20 animate-float-glow shadow-[0_0_30px_rgba(0,105,92,0.3)]">
//               <Star className="w-4 h-4 text-teal-300 animate-spin-slow" fill="currentColor" />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 text-sm font-medium">
//                 {config.parentCategory} → {config.title}
//               </span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white animate-slide-up drop-shadow-[0_0_30px_rgba(0,105,92,0.5)]">
//               Find Your Perfect{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 animate-gradient-text">
//                 {config.title}
//               </span>
//             </h1>
//             <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed px-2">
//               Explore exclusive {config.title.toLowerCase()} properties with world-class amenities
//             </p>
//           </div>
//         </section>

//         {/* ── FILTER BAR ── */}
//         <FilterBar 
//           activeButton={activeButton}
//           setActiveButton={setActiveButton}
//           openDropdown={openDropdown}
//           setOpenDropdown={setOpenDropdown}
//           handleNavigation={handleNavigation}
//           onFilterClick={() => setShowFilterModal(true)}
//           config={config}
//         />

//         {/* ── MAIN CONTENT ── */}
//         <div className="max-w-none mx-auto px-4 sm:px-6 py-6 lg:py-12">
//           <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            
//             {/* ── Property Cards ── */}
//             <div className="w-full lg:w-2/3">
//               <section>
//                 {loading ? (
//                   <div className="flex justify-center items-center py-20">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//                   </div>
//                 ) : (
//                   <PropertyList 
//                     properties={properties}
//                     emptyMessage={config.emptyMessage}
//                     emptyIcon={config.icon}
//                     emptyTitle={`No ${config.title} Found`}
//                   />
//                 )}
//               </section>
//             </div>

//             {/* ── Sidebar Filter ── */}
//             <div className="hidden lg:block lg:w-1/3 lg:relative">
//               <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
//                 <SidebarFilter 
//                   setHoveredFilter={setHoveredFilter}
//                   hoveredFilter={hoveredFilter}
//                 />
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* ── FILTER MODAL (Mobile) ── */}
//       {showFilterModal && (
//         <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[140px] px-4 pb-4 bg-black/50 backdrop-blur-sm animate-fade-in">
//           <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
//             <div className="bg-white rounded-3xl shadow-2xl p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-teal-900">Filters</h3>
//                 <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
//                   ✕
//                 </button>
//               </div>
//               <SidebarFilter 
//                 setHoveredFilter={setHoveredFilter}
//                 hoveredFilter={hoveredFilter}
//                 isMobile
//               />
//               <button 
//                 onClick={() => setShowFilterModal(false)}
//                 className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-semibold shadow-lg hover:shadow-xl transition"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── STYLES ── */}
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

//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

//         @keyframes slide-up {
//           from { transform: translateY(30px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

//         @keyframes slide-down {
//           from { transform: translateY(-20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
//         .animate-slide-down-fast { animation: slide-down 0.2s ease-out forwards; }

//         @keyframes slide-in-right {
//           from { transform: translateX(30px); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }

//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-spin-slow { animation: spin-slow 20s linear infinite; }
//         .animate-rotate-slow { animation: spin-slow 10s linear infinite; }

//         @keyframes bounce-slow {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-5px); }
//         }
//         .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }

//         @keyframes progress {
//           0% { width: 0%; }
//           100% { width: 75%; }
//         }
//         .animate-progress { animation: progress 1.5s ease-out forwards; }

//         @keyframes pulse-slow {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.8; transform: scale(1.05); }
//         }
//         .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }

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

// // ============================================
// // FILTER BAR COMPONENT
// // ============================================
// const FilterBar = ({ 
//   activeButton, 
//   setActiveButton, 
//   openDropdown, 
//   setOpenDropdown, 
//   handleNavigation,
//   onFilterClick,
//   config
// }) => {
//   return (
//     <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
//       <div className="max-w-none mx-auto px-4 sm:px-6 py-3 md:py-4">
//         {/* Desktop Layout */}
//         <div className="hidden md:flex gap-4 items-center">
//           {/* Rent/Buy Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
//               className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
//               style={{
//                 background: "linear-gradient(135deg, #00695C, #26A69A)",
//                 backgroundSize: "200% 200%"
//               }}
//             >
//               <div className="absolute inset-0 animate-gradient-shift-slow"></div>
//               <Home className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//               <span className="relative z-10">{activeButton}</span>
//               <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "toggle" ? "rotate-180" : ""} relative z-10`} />
//               <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
//             </button>

//             {openDropdown === "toggle" && (
//               <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px] border border-teal-200/30 animate-slide-down-fast">
//                 {["Buy", "Rent", "Lease", "Sell"].map((item, idx, arr) => (
//                   <React.Fragment key={item}>
//                     <button
//                       onClick={() => {
//                         handleNavigation(`/${item.toLowerCase()}`);
//                         setActiveButton(item);
//                         setOpenDropdown(null);
//                       }}
//                       className={`w-full px-5 py-3.5 text-left text-base transition-all duration-300 text-teal-900 font-medium group ${
//                         activeButton === item ? "bg-teal-100/50" : "hover:bg-teal-100/50"
//                       }`}
//                       style={activeButton === item ? { color: "#00695C", fontWeight: 600 } : {}}
//                     >
//                       <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                         <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
//                         {item}
//                       </div>
//                     </button>
//                     {idx < arr.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>}
//                   </React.Fragment>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Search Bar */}
//           <div className="relative flex-1 group">
//             <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
//             <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
//             <input
//               type="text"
//               placeholder="Search by city, locality, or landmark"
//               className="w-full pl-10 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
//             />
//             <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
//           </div>

//           {/* Filter Button */}
//           <button
//             onClick={onFilterClick}
//             className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden"
//             style={{
//               background: "linear-gradient(135deg, #00897B, #26A69A)",
//               backgroundSize: "200% 200%"
//             }}
//           >
//             <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
//             <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//             <span className="relative z-10">Advanced Filters</span>
//           </button>
//         </div>

//         {/* Mobile Layout */}
//         <div className="md:hidden flex flex-col gap-3">
//           <div className="flex gap-2">
//             <button
//               onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
//               className="flex-1 px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2"
//               style={{ background: "linear-gradient(135deg, #00695C, #26A69A)" }}
//             >
//               <span>{activeButton}</span>
//               <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "toggle" ? "rotate-180" : ""}`} />
//             </button>
//             <button
//               onClick={onFilterClick}
//               className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00897B] to-[#26A69A] text-white font-semibold text-sm flex items-center justify-center gap-2"
//             >
//               <Filter className="w-4 h-4" />
//               Filters
//             </button>
//           </div>
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-full pl-11 pr-4 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================
// // SIDEBAR FILTER COMPONENT
// // ============================================
// const SidebarFilter = ({ setHoveredFilter, hoveredFilter, isMobile = false }) => {
//   return (
//     <div className={`bg-gradient-to-b from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-teal-200/30 hover:shadow-[0_0_40px_rgba(0,105,92,0.2)] transition-all duration-500 ${isMobile ? '' : ''}`}>
//       <h3 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-3">
//         <div className="p-2 rounded-xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 animate-pulse-slow">
//           <Filter className="w-5 h-5 animate-rotate-slow" style={{ color: "#00695C" }} />
//         </div>
//         <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//           Advanced Filters
//         </span>
//       </h3>

//       {/* Price Range */}
//       <div className="mb-6 animate-fade-in-up delay-100">
//         <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
//           <span className="text-xl animate-bounce-slow">💰</span> 
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//             Price Range
//           </span>
//         </label>
//         <div className="flex gap-3">
//           <input
//             type="number"
//             placeholder="Min"
//             className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
//           />
//           <input
//             type="number"
//             placeholder="Max"
//             className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
//           />
//         </div>
//         <div className="mt-3 h-2 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full overflow-hidden">
//           <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-progress"></div>
//         </div>
//       </div>

//       {/* BHK Type */}
//       <div className="mb-6 animate-fade-in-up delay-200">
//         <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
//           <span className="text-xl animate-bounce-slow">🏠</span>
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//             BHK Type
//           </span>
//         </label>
//         <div className="grid grid-cols-2 gap-2">
//           {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk, index) => (
//             <label 
//               key={bhk} 
//               onMouseEnter={() => setHoveredFilter(`bhk-${index}`)}
//               onMouseLeave={() => setHoveredFilter(null)}
//               className={`flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group animate-fade-in-up ${
//                 hoveredFilter === `bhk-${index}` ? 'scale-[1.02]' : ''
//               }`}
//               style={{ animationDelay: `${index * 50}ms` }}
//             >
//               <input 
//                 type="checkbox" 
//                 className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300" 
//               />
//               <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
//                 {bhk}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-3 pt-6 border-t border-teal-200/30 animate-fade-in-up delay-500">
//         <button className="flex-1 px-4 py-3 rounded-xl border-2 border-teal-200/50 text-sm font-medium text-teal-700 hover:bg-gradient-to-r from-teal-50 to-emerald-50 hover:border-teal-300 transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden group">
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
//           <span className="relative z-10">Clear All</span>
//         </button>
//         <button className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl hover:shadow-[0_0_25px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden"
//           style={{
//             background: "linear-gradient(135deg, #00695C, #26A69A)",
//             backgroundSize: "200% 200%"
//           }}
//         >
//           <div className="absolute inset-0 animate-gradient-shift"></div>
//           <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
//           <span className="relative z-10 flex items-center justify-center gap-2">
//             Apply Filters
//             <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DynamicPropertyPage;