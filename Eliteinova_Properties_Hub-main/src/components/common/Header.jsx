// import React, { useState, useEffect, useRef } from "react";
// import { User, Menu, ChevronDown, X, Sparkles, Bell, Search, HelpCircle, Settings, LogOut, Home, Building, Landmark, Warehouse, TrendingUp, Shield, DollarSign, Wrench, PaintBucket, Droplets, Heart, Star, Zap, CheckCircle, Award, MapPin, Globe, Phone, Mail, Calendar, Clock, Briefcase } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// // Import Individual Forms (Owner)
// import { IndRentForm, IndSellForm, IndLeaseForm } from "../Forms/Owner/Index.js";

// // Import Apartment Forms (Owner)
// import { ApartRentForm, ApartSellForm, ApartLeaseForm } from "../Forms/Owner/Index.js";

// // Import Commercial Forms (Owner)
// import { ComRentForm, ComSellForm, ComLeaseForm } from "../Forms/Owner/Index.js";

// // Import Agent Forms
// import { RentAgentIndForm, SellAgentIndForm, LeaseAgentIndForm } from "../Forms/Agent/Index.js";

// // Import Agent Apartment Forms
// import { RentAgentApartForm, SellAgentApartForm, LeaseAgentApartForm } from "../Forms/Agent/Index.js";

// // Import Agent Commercial Forms
// import { RentAgentComForm, SellAgentComForm, LeaseAgentComForm } from "../Forms/Agent/Index.js";

// // Import Builder Forms
// import { RentBuilderIndForm, SellBuilderIndForm, LeaseBuilderIndForm } from "../Forms/Builder/Index.js";

// // Import Builder Apartment Forms
// import { RentBuilderApartForm, SellBuilderApartForm, LeaseBuilderApartForm } from "../Forms/Builder/Index.js";

// // Import Builder Commercial Forms
// import { RentBuilderComForm, SellBuilderComForm, LeaseBuilderComForm } from "../Forms/Builder/Index.js";

// // Import Property Management Forms
// import { RentPMIndForm, SellPMIndForm, LeasePMIndForm } from "../Forms/PropertyManagement/Index.js";

// // Import Property Management Apartment Forms
// import { RentPMApartForm, SellPMApartForm, LeasePMApartForm } from "../Forms/PropertyManagement/Index.js";

// // Import Property Management Commercial Forms
// import { RentPMComForm, SellPMComForm, LeasePMComForm } from "../Forms/PropertyManagement/Index.js";

// const Header = ({ onPostPropertyClick }) => {
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(3);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("home");
  
//   // State for Role Selection (only for Individual)
//   const [showRoleSelectionPopup, setShowRoleSelectionPopup] = useState(false);
  
//   // State for Owner forms
//   const [showOwnerActionPopup, setShowOwnerActionPopup] = useState(false);
//   const [showOwnerRentForm, setShowOwnerRentForm] = useState(false);
//   const [showOwnerSellForm, setShowOwnerSellForm] = useState(false);
//   const [showOwnerLeaseForm, setShowOwnerLeaseForm] = useState(false);

//   // State for Apartment forms (Owner)
//   const [showApartActionPopup, setShowApartActionPopup] = useState(false);
//   const [showApartRentForm, setShowApartRentForm] = useState(false);
//   const [showApartSellForm, setShowApartSellForm] = useState(false);
//   const [showApartLeaseForm, setShowApartLeaseForm] = useState(false);

//   // State for Commercial forms (Owner)
//   const [showComActionPopup, setShowComActionPopup] = useState(false);
//   const [showComRentForm, setShowComRentForm] = useState(false);
//   const [showComSellForm, setShowComSellForm] = useState(false);
//   const [showComLeaseForm, setShowComLeaseForm] = useState(false);

//   // State for Agent forms
//   const [showAgentActionPopup, setShowAgentActionPopup] = useState(false);
//   const [showAgentRentForm, setShowAgentRentForm] = useState(false);
//   const [showAgentSellForm, setShowAgentSellForm] = useState(false);
//   const [showAgentLeaseForm, setShowAgentLeaseForm] = useState(false);

//   // State for Agent Apartment forms
//   const [showAgentApartActionPopup, setShowAgentApartActionPopup] = useState(false);
//   const [showAgentApartRentForm, setShowAgentApartRentForm] = useState(false);
//   const [showAgentApartSellForm, setShowAgentApartSellForm] = useState(false);
//   const [showAgentApartLeaseForm, setShowAgentApartLeaseForm] = useState(false);

//   // State for Agent Commercial forms
//   const [showAgentComActionPopup, setShowAgentComActionPopup] = useState(false);
//   const [showAgentComRentForm, setShowAgentComRentForm] = useState(false);
//   const [showAgentComSellForm, setShowAgentComSellForm] = useState(false);
//   const [showAgentComLeaseForm, setShowAgentComLeaseForm] = useState(false);

//   // State for Builder forms
//   const [showBuilderActionPopup, setShowBuilderActionPopup] = useState(false);
//   const [showBuilderRentForm, setShowBuilderRentForm] = useState(false);
//   const [showBuilderSellForm, setShowBuilderSellForm] = useState(false);
//   const [showBuilderLeaseForm, setShowBuilderLeaseForm] = useState(false);

//   // State for Builder Apartment forms
//   const [showBuilderApartActionPopup, setShowBuilderApartActionPopup] = useState(false);
//   const [showBuilderApartRentForm, setShowBuilderApartRentForm] = useState(false);
//   const [showBuilderApartSellForm, setShowBuilderApartSellForm] = useState(false);
//   const [showBuilderApartLeaseForm, setShowBuilderApartLeaseForm] = useState(false);

//   // State for Builder Commercial forms
//   const [showBuilderComActionPopup, setShowBuilderComActionPopup] = useState(false);
//   const [showBuilderComRentForm, setShowBuilderComRentForm] = useState(false);
//   const [showBuilderComSellForm, setShowBuilderComSellForm] = useState(false);
//   const [showBuilderComLeaseForm, setShowBuilderComLeaseForm] = useState(false);

//   // State for Property Management forms
//   const [showPMActionPopup, setShowPMActionPopup] = useState(false);
//   const [showPMRentForm, setShowPMRentForm] = useState(false);
//   const [showPMSellForm, setShowPMSellForm] = useState(false);
//   const [showPMLeaseForm, setShowPMLeaseForm] = useState(false);

//   // State for Property Management Apartment forms
//   const [showPMApartActionPopup, setShowPMApartActionPopup] = useState(false);
//   const [showPMApartRentForm, setShowPMApartRentForm] = useState(false);
//   const [showPMApartSellForm, setShowPMApartSellForm] = useState(false);
//   const [showPMApartLeaseForm, setShowPMApartLeaseForm] = useState(false);

//   // State for Property Management Commercial forms
//   const [showPMComActionPopup, setShowPMComActionPopup] = useState(false);
//   const [showPMComRentForm, setShowPMComRentForm] = useState(false);
//   const [showPMComSellForm, setShowPMComSellForm] = useState(false);
//   const [showPMComLeaseForm, setShowPMComLeaseForm] = useState(false);

//   const [selectedRole, setSelectedRole] = useState("");
//   const [selectedPropertyType, setSelectedPropertyType] = useState("");

//   const [mobileDropdowns, setMobileDropdowns] = useState({
//     customer: false,
//     post: false,
//     loan: false,
//     services: false,
//     customerSub: {},
//     postSub: {}
//   });
  
//   const navigate = useNavigate();
//   const searchRef = useRef(null);

//   const customerPortalMenu = {
//     "Individual": ["Rent", "Buy", "Lease", "Sell"],
//     "Apartment": ["Rent", "Buy", "Lease", "Sell"],
//     "Commercial": ["Rent", "Buy", "Lease", "Sell"],
//     "Land & Plots": ["Rent", "Buy", "Lease", "Sell"],
//     "Hostel": ["Rent", "Buy", "Lease", "Sell"],
//   };

//   const postPropertyMenu = {
//     "Owner": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Agent": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Builder": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Property Management": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//   };

//   const loanMenu = [
//     "Home Loan",
//     "Property Loan",
//     "Construction Loan",
//     "Plot Loan",
//     "Commercial Loan"
//   ];

//   const servicesMenu = [
//     "Construction",
//     "Interior",
//     "Painting",
//     "Plumbing",
//     "Cleaning"
//   ];

//   const userMenuItems = [
//     { name: "👤 Profile", icon: <User className="w-4 h-4" /> },
//     { name: "⚙️ Settings", icon: <Settings className="w-4 h-4" /> },
//     { name: "❓ Help & Support", icon: <HelpCircle className="w-4 h-4" /> },
//     { name: "🚪 Logout", icon: <LogOut className="w-4 h-4" /> },
//   ];

  // const profileMenu = [
  //   { label: "Owner", icon: "👤", path: "/profile/owner" },
  //   { label: "Agent", icon: "🏢", path: "/profile/agent" },
  //   { label: "Builder", icon: "🏗️", path: "/profile/builder" },
  //   { label: "Property Management", icon: "🏢", path: "/profile/property-management" }
  // ];

  // const adminMenu = [
  //   { 
  //     label: "Admin", 
  //     icon: <Users className="w-4 h-4" />, 
  //     path: "/admin",
  //     description: "Admin Panel"
  //   },
  //   { 
  //     label: "Office", 
  //     icon: <OfficeIcon className="w-4 h-4" />, 
  //     path: "/office",
  //     description: "Office Dashboard"
  //   }
  // ];


//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle Post Property submenu click
//   const handlePostSubmenuClick = (role, propertyType) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
//     setSelectedRole(role);
//     setSelectedPropertyType(propertyType);

//     if (propertyType === "Individual") {
//       if (role === "Agent") {
//         setShowAgentActionPopup(true);
//       } else if (role === "Owner") {
//         setShowOwnerActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else if (propertyType === "Apartment") {
//       if (role === "Agent") {
//         setShowAgentApartActionPopup(true);
//       } else if (role === "Owner") {
//         setShowApartActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderApartActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMApartActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else if (propertyType === "Commercial") {
//       if (role === "Owner") {
//         setShowComActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentComActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderComActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMComActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else {
//       // Land & Plots, Hostel - show role selection
//       setShowRoleSelectionPopup(true);
//     }
//   };

//   const handleRoleSelect = (role) => {
//     setShowRoleSelectionPopup(false);
//     setSelectedRole(role);
    
//     if (selectedPropertyType === "Individual") {
//       if (role === "Owner") {
//         setShowOwnerActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMActionPopup(true);
//       }
//     } else if (selectedPropertyType === "Apartment") {
//       if (role === "Owner") {
//         setShowApartActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentApartActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderApartActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMApartActionPopup(true);
//       }
//     } else if (selectedPropertyType === "Commercial") {
//       if (role === "Owner") {
//         setShowComActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentComActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderComActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMComActionPopup(true);
//       }
//     } else {
//       // Land & Plots, Hostel
//       alert(`${selectedPropertyType} - ${role} form coming soon!`);
//     }
//   };

//   // Handle Owner action button clicks (Rent, Sell, Lease)
//   const handleOwnerActionClick = (action) => {
//     setShowOwnerActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowOwnerRentForm(true);
//         break;
//       case "Sell":
//         setShowOwnerSellForm(true);
//         break;
//       case "Lease":
//         setShowOwnerLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Apartment action button clicks (Rent, Sell, Lease)
//   const handleApartActionClick = (action) => {
//     setShowApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowApartRentForm(true);
//         break;
//       case "Sell":
//         setShowApartSellForm(true);
//         break;
//       case "Lease":
//         setShowApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Commercial action button clicks (Rent, Sell, Lease)
//   const handleComActionClick = (action) => {
//     setShowComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowComRentForm(true);
//         break;
//       case "Sell":
//         setShowComSellForm(true);
//         break;
//       case "Lease":
//         setShowComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent action button clicks (Rent, Sell, Lease)
//   const handleAgentActionClick = (action) => {
//     setShowAgentActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent Apartment action button clicks (Rent, Sell, Lease)
//   const handleAgentApartActionClick = (action) => {
//     setShowAgentApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentApartRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentApartSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent Commercial action button clicks (Rent, Sell, Lease)
//   const handleAgentComActionClick = (action) => {
//     setShowAgentComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentComRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentComSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder action button clicks (Rent, Sell, Lease)
//   const handleBuilderActionClick = (action) => {
//     setShowBuilderActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder Apartment action button clicks (Rent, Sell, Lease)
//   const handleBuilderApartActionClick = (action) => {
//     setShowBuilderApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderApartRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderApartSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder Commercial action button clicks (Rent, Sell, Lease)
//   const handleBuilderComActionClick = (action) => {
//     setShowBuilderComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderComRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderComSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management action button clicks (Rent, Sell, Lease)
//   const handlePMActionClick = (action) => {
//     setShowPMActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMRentForm(true);
//         break;
//       case "Sell":
//         setShowPMSellForm(true);
//         break;
//       case "Lease":
//         setShowPMLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management Apartment action button clicks (Rent, Sell, Lease)
//   const handlePMApartActionClick = (action) => {
//     setShowPMApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMApartRentForm(true);
//         break;
//       case "Sell":
//         setShowPMApartSellForm(true);
//         break;
//       case "Lease":
//         setShowPMApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management Commercial action button clicks (Rent, Sell, Lease)
//   const handlePMComActionClick = (action) => {
//     setShowPMComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMComRentForm(true);
//         break;
//       case "Sell":
//         setShowPMComSellForm(true);
//         break;
//       case "Lease":
//         setShowPMComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleCustomerPortalClick = (type) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
    
//     const typeKey = type.toLowerCase().replace(/\s+/g, '-');
    
//     if (typeKey === "individual") {
//       navigate("/individual");
//     } else if (typeKey === "rent") {
//       navigate("/rent");
//     } else if (typeKey === "buy") {
//       navigate("/buy");
//     } else if (typeKey === "lease") {
//       navigate("/lease");
//     } else if (typeKey === "sell") {
//       navigate("/sell");
//     } else if (typeKey === "apartment") {
//       navigate("/apartment");
//     } else if (typeKey === "commercial") {
//       navigate("/commercial");
//     } else if (typeKey === "land-&-plots") {
//       navigate("/land-plots");
//     } else if (typeKey === "hostel") {
//       navigate("/hostel");
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchOpen(false);
//       setSearchQuery("");
//     }
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//     if (!mobileMenuOpen) {
//       setMobileDropdowns({
//         customer: false,
//         post: false,
//         loan: false,
//         services: false,
//         customerSub: {},
//         postSub: {}
//       });
//     }
//   };

//   const toggleMobileDropdown = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       [key]: !prev[key],
//       ...(key !== 'customerSub' && key !== 'postSub' && Object.keys(prev).reduce((acc, k) => {
//         if (k !== key && k !== 'customerSub' && k !== 'postSub') acc[k] = false;
//         return acc;
//       }, {}))
//     }));
//   };

//   const toggleCustomerSub = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       customerSub: {
//         ...prev.customerSub,
//         [key]: !prev.customerSub[key]
//       }
//     }));
//   };

//   const togglePostSub = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       postSub: {
//         ...prev.postSub,
//         [key]: !prev.postSub[key]
//       }
//     }));
//   };

//   return (
//     <>
//       <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         scrolled 
//           ? 'bg-gradient-to-r from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl shadow-2xl shadow-[#00695C]/20' 
//           : 'bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C]'
//       }`}>
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full animate-float-particle"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 width: `${Math.random() * 2 + 1}px`,
//                 height: `${Math.random() * 2 + 1}px`,
//                 background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${6 + Math.random() * 12}s`,
//               }}
//             />
//           ))}
          
//           <div className="absolute bottom-0 left-0 right-0 h-8">
//             <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent animate-wave-slow" />
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

//         <div className="h-[72px] md:h-[84px] w-full px-3 md:px-6 flex items-center relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03] animate-sweep" />
          
//           <div className="flex items-center justify-between w-full relative z-10">
//             <div className="flex items-center gap-2 md:gap-4">
//               <button
//                 onClick={toggleMobileMenu}
//                 className="md:hidden p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 group relative"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//                 <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
//               </button>

//               <div
//                 onClick={() => navigate("/")}
//                 className="cursor-pointer group relative"
//               >
//                 <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
//                 <div className="relative w-13 h-13 md:w-[76px] md:h-[76px] rounded-full overflow-hidden flex items-center justify-center">
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#004D40] to-[#00695C] opacity-80" />
//                   <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#26A69A]/20 to-transparent" />
//                   <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 via-transparent to-[#00FF88]/20 animate-spin-slow rounded-full" />
                  
//                   <img
//                     src={logo}
//                     alt="Eliteinova Properties Logo"
//                     className="w-11 h-11 md:w-[60px] md:h-[60px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
//                     style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
//                   />
//                 </div>
//               </div>

//               <div 
//                 onClick={() => navigate("/")} 
//                 className="cursor-pointer group relative"
//               >
//                 <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#00FF88]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
//                 <h1
//                   className="text-lg md:text-2xl lg:text-3xl font-light leading-tight relative tracking-wide"
//                   style={{
//                     fontFamily: "Pacifico, cursive",
//                     color: "#E8F5E9",
//                     textShadow: '0 2px 16px rgba(0, 229, 255, 0.2)',
//                     fontWeight: 150,
//                   }}
//                 >
//                   <span className="relative inline-block group-hover:scale-105 transition-transform duration-500">
//                     Eliteinova <span className="text-[0.75em]">Properties</span>
//                     <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00E5FF]/20 via-[#00FF88]/20 to-[#00E5FF]/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700" />
//                   </span>
//                 </h1>
                
//                 <p 
//                   className="text-[11px] md:text-sm lg:text-base font-light leading-tight mt-0 flex items-center gap-2"
//                   style={{
//                     fontFamily: "Pacifico, cursive",
//                     color: "#C8E6C9",
//                     fontWeight: 300,
//                   }}
//                 >
//                   <span className="relative whitespace-nowrap">
//                     No Brokerage
//                     <Sparkles className="absolute -right-5 -top-0.5 w-3 h-3 text-yellow-300 animate-sparkle-glow" />
//                   </span>
//                   <span className="text-[8px] md:text-[10px] bg-gradient-to-r from-[#00FF88]/20 to-[#00E5FF]/20 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-sm">
//                     ⭐ Trusted
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-1.5 md:gap-3">
//               <div ref={searchRef} className="relative">
//                 <button
//                   onClick={() => setSearchOpen(!searchOpen)}
//                   className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center relative group transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#00695C]/30"
//                   style={{
//                     background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
//                     boxShadow: '0 3px 12px rgba(0,105,92,0.2)',
//                   }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#00695C] via-[#26A69A] to-[#00695C] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full" />
//                   <Search className="w-5 h-5 text-[#00695C] group-hover:text-[#004D40] transition-colors duration-300" />
//                 </button>

//                 {searchOpen && (
//                   <div className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 border border-white/30 animate-dropdown">
//                     <form onSubmit={handleSearch} className="p-3">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
//                         <input
//                           type="text"
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           placeholder="Search properties..."
//                           className="w-full pl-9 pr-3 py-2 text-sm bg-[#E8F5E9]/50 rounded-lg border border-[#26A69A]/20 focus:outline-none focus:ring-2 focus:ring-[#26A69A]/40 focus:border-transparent text-gray-800 placeholder-gray-500"
//                           autoFocus
//                         />
//                       </div>
//                       <div className="mt-2 flex gap-1.5 flex-wrap">
//                         <button
//                           type="button"
//                           onClick={() => setSearchQuery("Mumbai")}
//                           className="text-[10px] bg-gradient-to-r from-[#26A69A]/10 to-[#00695C]/10 hover:from-[#26A69A]/20 hover:to-[#00695C]/20 text-[#00695C] px-2 py-1 rounded-lg transition-all duration-300"
//                         >
//                           🏙️ Mumbai
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => setSearchQuery("Bangalore")}
//                           className="text-[10px] bg-gradient-to-r from-[#26A69A]/10 to-[#00695C]/10 hover:from-[#26A69A]/20 hover:to-[#00695C]/20 text-[#00695C] px-2 py-1 rounded-lg transition-all duration-300"
//                         >
//                           🏡 Bangalore
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => setSearchQuery("Commercial")}
//                           className="text-[10px] bg-gradient-to-r from-[#26A69A]/10 to-[#00695C]/10 hover:from-[#26A69A]/20 hover:to-[#00695C]/20 text-[#00695C] px-2 py-1 rounded-lg transition-all duration-300"
//                         >
//                           🏪 Commercial
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}
//               </div>

//               <button className="relative group">
//                 <div className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center relative transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30"
//                   style={{
//                     background: 'linear-gradient(135deg, #FFEB3B, #FF9800)',
//                     boxShadow: '0 3px 12px rgba(255,152,0,0.2)',
//                   }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full" />
//                   <Bell className="w-5 h-5 text-[#E65100] group-hover:text-[#BF360C] transition-colors duration-300" />
//                 </div>
//                 {notificationCount > 0 && (
//                   <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-ring">
//                     <span className="text-white text-[8px] font-bold">{notificationCount}</span>
//                   </div>
//                 )}
//               </button>

//               <div className="relative">
//                 <button 
//                   onClick={() => setUserMenuOpen(!userMenuOpen)}
//                   className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center relative group transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#00695C]/30"
//                   style={{
//                     background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
//                     boxShadow: '0 3px 12px rgba(0,105,92,0.2)',
//                   }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#00695C] via-[#26A69A] to-[#00695C] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full" />
//                   <div className="absolute -inset-0.5 rounded-full border border-white/20 animate-spin-slow" />
                  
//                   <User className="w-5 h-5 md:w-6 md:h-6 text-[#00695C] group-hover:text-[#004D40] transition-colors duration-300 relative z-10" />
                  
//                   <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse border-2 border-white" />
//                 </button>

//                 {userMenuOpen && (
//                   <div className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 border border-white/30 animate-dropdown">
//                     <div className="p-3 border-b border-[#E8F5E9]">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-md">
//                           <User className="w-4 h-4 text-white" />
//                         </div>
//                         <div>
//                           <p className="font-semibold text-sm text-gray-800">John Doe</p>
//                           <p className="text-[8px] text-[#26A69A] font-medium">⭐ Premium</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-1.5">
//                       {userMenuItems.map((item, index) => (
//                         <button
//                           key={item.name}
//                           className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 rounded-lg animate-slide-item"
//                           style={{ animationDelay: `${index * 50}ms` }}
//                           onClick={() => {
//                             setUserMenuOpen(false);
//                             if (item.name === "🚪 Logout") {
//                               // Handle logout
//                             } else {
//                               navigate(`/${item.name.toLowerCase().replace(/[👤⚙️❓🚪]/g, '').trim()}`);
//                             }
//                           }}
//                         >
//                           <span className="text-[#26A69A]">{item.icon}</span>
//                           <span>{item.name}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <nav className="hidden md:flex h-12 items-center relative bg-gradient-to-r from-[#004D40]/90 via-[#00796B]/90 to-[#004D40]/90 backdrop-blur-sm border-t border-white/5">
//           <div className="absolute inset-0 opacity-[0.03]">
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow" />
//           </div>
          
//           <div className="flex items-center h-full relative z-10">
//             <button
//               onClick={() => {
//                 navigate("/");
//                 setActiveTab("home");
//               }}
//               className={`group relative px-5 h-full text-white font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden ${
//                 activeTab === "home" 
//                   ? 'bg-gradient-to-r from-white/10 to-transparent' 
//                   : 'hover:bg-white/5'
//               }`}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
//               <span className="flex items-center gap-2 relative z-10">
//                 <Home className="w-4 h-4" />
//                 Home
//               </span>
              
//               {activeTab === "home" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse-glow" />
//               )}
//             </button>

//             <div
//               className="relative h-full"
//               onMouseEnter={() => setActiveDropdown("customer")}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button 
//                 onClick={() => navigate("/customer-portal")}
//                 className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
//               >
//                 <Building className="w-4 h-4" />
//                 <span>Customer Portal</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "customer" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "customer" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
//                   {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                     <div key={key} className="relative group/item">
//                       <button 
//                         onClick={() => handleCustomerPortalClick(key)}
//                         className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 capitalize"
//                       >
//                         {key}
//                       </button>
//                       <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[160px] z-50 border border-white/30 animate-dropdown-nested">
//                         {submenu.map((item) => (
//                           <button
//                             key={item}
//                             onClick={() => handleCustomerPortalClick(item.toLowerCase())}
//                             className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                           >
//                             {item}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div
//               className="relative h-full"
//               onMouseEnter={() => setActiveDropdown("post")}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button
//                 onClick={() => navigate("/post-property")}
//                 className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 <span>Post Property</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "post" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "post" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[190px] border border-white/30 animate-dropdown">
//                   {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                     <div key={role} className="relative group/item">
//                       <button
//                         className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 flex items-center justify-between gap-3"
//                       >
//                         {role}
//                         <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-gray-400" />
//                       </button>
//                       <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[170px] z-50 border border-white/30 animate-dropdown-nested">
//                         {submenu.map((propertyType) => (
//                           <button
//                             key={propertyType}
//                             onClick={() => handlePostSubmenuClick(role, propertyType)}
//                             className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                           >
//                             {propertyType}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div
//               className="relative h-full"
//               onMouseEnter={() => setActiveDropdown("loan")}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
//                 <Landmark className="w-4 h-4" />
//                 <span>Find Loan</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "loan" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "loan" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
//                   {loanMenu.map((item) => (
//                     <button
//                       key={item}
//                       className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div
//               className="relative h-full"
//               onMouseEnter={() => setActiveDropdown("services")}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
//                 <Settings className="w-4 h-4" />
//                 <span>Services</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "services" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "services" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[160px] border border-white/30 animate-dropdown">
//                   {servicesMenu.map((item) => (
//                     <button
//                       key={item}
//                       className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div> 
//         </nav>
//       </header>

//       {/* Role Selection Popup */}
//       {showRoleSelectionPopup && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowRoleSelectionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Select Role
//               </h2>
//               <button 
//                 onClick={() => setShowRoleSelectionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedPropertyType} Property: Who is listing this property?
//             </p>

//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 onClick={() => handleRoleSelect("Owner")}
//                 className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">👤</div>
//                 <div className="font-bold text-emerald-700 group-hover:text-emerald-900">Owner</div>
//                 <div className="text-[10px] text-gray-500">Individual owner</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Agent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Agent</div>
//                 <div className="text-[10px] text-gray-500">Professional agent</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Builder")}
//                 className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏗️</div>
//                 <div className="font-bold text-amber-700 group-hover:text-amber-900">Builder</div>
//                 <div className="text-[10px] text-gray-500">Builder/Developer</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Property Management")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Property Management</div>
//                 <div className="text-[10px] text-gray-500">Property management company</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Owner Individual Action Popup */}
//       {showOwnerActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowOwnerActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Owner - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowOwnerActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleOwnerActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleOwnerActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleOwnerActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Owner Apartment Action Popup */}
//       {showApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Owner Commercial Action Popup */}
//       {showComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Agent Individual Action Popup */}
//       {showAgentActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Agent Apartment Action Popup */}
//       {showAgentApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Agent Commercial Action Popup */}
//       {showAgentComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Builder Individual Action Popup */}
//       {showBuilderActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Builder Apartment Action Popup */}
//       {showBuilderApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Builder Commercial Action Popup */}
//       {showBuilderComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Property Management Individual Action Popup */}
//       {showPMActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Property Management Apartment Action Popup */}
//       {showPMApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Property Management Commercial Action Popup */}
//       {showPMComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Owner Forms */}
//       <IndRentForm isOpen={showOwnerRentForm} onClose={() => setShowOwnerRentForm(false)} />
//       <IndSellForm isOpen={showOwnerSellForm} onClose={() => setShowOwnerSellForm(false)} />
//       <IndLeaseForm isOpen={showOwnerLeaseForm} onClose={() => setShowOwnerLeaseForm(false)} />

//       <ApartRentForm isOpen={showApartRentForm} onClose={() => setShowApartRentForm(false)} />
//       <ApartSellForm isOpen={showApartSellForm} onClose={() => setShowApartSellForm(false)} />
//       <ApartLeaseForm isOpen={showApartLeaseForm} onClose={() => setShowApartLeaseForm(false)} />

//       <ComRentForm isOpen={showComRentForm} onClose={() => setShowComRentForm(false)} />
//       <ComSellForm isOpen={showComSellForm} onClose={() => setShowComSellForm(false)} />
//       <ComLeaseForm isOpen={showComLeaseForm} onClose={() => setShowComLeaseForm(false)} />

//       {/* Agent Forms */}
//       <RentAgentIndForm isOpen={showAgentRentForm} onClose={() => setShowAgentRentForm(false)} />
//       <SellAgentIndForm isOpen={showAgentSellForm} onClose={() => setShowAgentSellForm(false)} />
//       <LeaseAgentIndForm isOpen={showAgentLeaseForm} onClose={() => setShowAgentLeaseForm(false)} />

//       <RentAgentApartForm isOpen={showAgentApartRentForm} onClose={() => setShowAgentApartRentForm(false)} />
//       <SellAgentApartForm isOpen={showAgentApartSellForm} onClose={() => setShowAgentApartSellForm(false)} />
//       <LeaseAgentApartForm isOpen={showAgentApartLeaseForm} onClose={() => setShowAgentApartLeaseForm(false)} />

//       <RentAgentComForm isOpen={showAgentComRentForm} onClose={() => setShowAgentComRentForm(false)} />
//       <SellAgentComForm isOpen={showAgentComSellForm} onClose={() => setShowAgentComSellForm(false)} />
//       <LeaseAgentComForm isOpen={showAgentComLeaseForm} onClose={() => setShowAgentComLeaseForm(false)} />

//       {/* Builder Forms */}
//       <RentBuilderIndForm isOpen={showBuilderRentForm} onClose={() => setShowBuilderRentForm(false)} />
//       <SellBuilderIndForm isOpen={showBuilderSellForm} onClose={() => setShowBuilderSellForm(false)} />
//       <LeaseBuilderIndForm isOpen={showBuilderLeaseForm} onClose={() => setShowBuilderLeaseForm(false)} />

//       <RentBuilderApartForm isOpen={showBuilderApartRentForm} onClose={() => setShowBuilderApartRentForm(false)} />
//       <SellBuilderApartForm isOpen={showBuilderApartSellForm} onClose={() => setShowBuilderApartSellForm(false)} />
//       <LeaseBuilderApartForm isOpen={showBuilderApartLeaseForm} onClose={() => setShowBuilderApartLeaseForm(false)} />

//       <RentBuilderComForm isOpen={showBuilderComRentForm} onClose={() => setShowBuilderComRentForm(false)} />
//       <SellBuilderComForm isOpen={showBuilderComSellForm} onClose={() => setShowBuilderComSellForm(false)} />
//       <LeaseBuilderComForm isOpen={showBuilderComLeaseForm} onClose={() => setShowBuilderComLeaseForm(false)} />

//       {/* Property Management Forms */}
//       <RentPMIndForm isOpen={showPMRentForm} onClose={() => setShowPMRentForm(false)} />
//       <SellPMIndForm isOpen={showPMSellForm} onClose={() => setShowPMSellForm(false)} />
//       <LeasePMIndForm isOpen={showPMLeaseForm} onClose={() => setShowPMLeaseForm(false)} />

//       <RentPMApartForm isOpen={showPMApartRentForm} onClose={() => setShowPMApartRentForm(false)} />
//       <SellPMApartForm isOpen={showPMApartSellForm} onClose={() => setShowPMApartSellForm(false)} />
//       <LeasePMApartForm isOpen={showPMApartLeaseForm} onClose={() => setShowPMApartLeaseForm(false)} />

//       <RentPMComForm isOpen={showPMComRentForm} onClose={() => setShowPMComRentForm(false)} />
//       <SellPMComForm isOpen={showPMComSellForm} onClose={() => setShowPMComSellForm(false)} />
//       <LeasePMComForm isOpen={showPMComLeaseForm} onClose={() => setShowPMComLeaseForm(false)} />

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div 
//           className="md:hidden fixed inset-0 z-50 animate-fade"
//           onClick={toggleMobileMenu}
//         >
//           <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl animate-backdrop" />
          
//           <div 
//             className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#00695C] to-[#26A69A] shadow-2xl shadow-[#00695C]/50 overflow-y-auto animate-slide"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between p-4 border-b border-white/10">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
//                   <Menu className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-white font-bold text-sm">Menu</h2>
//                   <p className="text-white/50 text-[10px]">Welcome back!</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={toggleMobileMenu} 
//                 className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
//               >
//                 <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
//               </button>
//             </div>
            
//             <div className="p-4">
//               <form onSubmit={handleSearch} className="mb-3">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search..."
//                     className="w-full pl-9 pr-3 py-2 text-sm bg-white/10 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-white/40"
//                   />
//                 </div>
//               </form>
//             </div>
            
//             <div className="px-4 pb-32">
//               <button 
//                 onClick={() => {
//                   navigate('/');
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '0ms' }}
//               >
//                 🏠 Home
//               </button>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '50ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('customer')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🏢 Customer Portal</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.customer ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.customer && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                       <div key={key} className="border-l border-white/10 pl-3">
//                         <div 
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => toggleCustomerSub(key)}
//                         >
//                           <span className="text-white/90 text-sm capitalize">{key}</span>
//                           <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.customerSub[key] ? 'rotate-180' : ''}`} />
//                         </div>
                        
//                         {mobileDropdowns.customerSub[key] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((item) => (
//                               <button 
//                                 key={item} 
//                                 onClick={() => {
//                                   handleCustomerPortalClick(item.toLowerCase());
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {item}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '100ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('post')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">📊 Post Property</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.post ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.post && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                       <div key={role} className="border-l border-white/10 pl-3">
//                         <div
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => togglePostSub(role)}
//                         >
//                           <span className="text-white/90 text-sm">{role}</span>
//                           <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.postSub[role] ? 'rotate-180' : ''}`} />
//                         </div>

//                         {mobileDropdowns.postSub[role] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((propertyType) => (
//                               <button
//                                 key={propertyType}
//                                 onClick={() => {
//                                   handlePostSubmenuClick(role, propertyType);
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {propertyType}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '150ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('loan')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">💰 Find Loan</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.loan ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.loan && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {loanMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '200ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('services')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🛠️ Services</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.services ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.services && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {servicesMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={() => {
//                   navigate("/profile");
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '250ms' }}
//               >
//                 👤 Profile
//               </button>

//               <button
//                 onClick={() => {
//                   navigate("/notifications");
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '300ms' }}
//               >
//                 🔔 Notifications
//               </button>

//               <button
//                 onClick={() => {
//                   navigate("/help");
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 text-sm animate-slide-item"
//                 style={{ animationDelay: '350ms' }}
//               >
//                 ❓ Help
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes float-particle {
//           0%, 100% { 
//             transform: translateY(0) translateX(0) rotate(0deg); 
//             opacity: 0.2;
//           }
//           25% { 
//             transform: translateY(-20px) translateX(15px) rotate(90deg); 
//             opacity: 0.5;
//           }
//           50% { 
//             transform: translateY(-12px) translateX(-12px) rotate(180deg); 
//             opacity: 0.7;
//           }
//           75% { 
//             transform: translateY(12px) translateX(18px) rotate(270deg); 
//             opacity: 0.3;
//           }
//         }
//         .animate-float-particle {
//           animation: float-particle 10s ease-in-out infinite;
//         }

//         @keyframes wave-slow {
//           0% { transform: translateX(0) scaleY(1); }
//           50% { transform: translateX(40px) scaleY(1.2); }
//           100% { transform: translateX(80px) scaleY(1); }
//         }
//         .animate-wave-slow {
//           animation: wave-slow 8s ease-in-out infinite;
//         }

//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s linear infinite;
//         }

//         @keyframes shimmer-slow {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer-slow {
//           animation: shimmer-slow 8s linear infinite;
//         }

//         @keyframes sweep {
//           0%, 100% { 
//             background-position: 0% 50%; 
//             opacity: 0.3;
//           }
//           50% { 
//             background-position: 100% 50%; 
//             opacity: 0.6;
//           }
//         }
//         .animate-sweep {
//           background-size: 200% 200%;
//           animation: sweep 4s ease infinite;
//         }

//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-spin-slow {
//           animation: spin-slow 6s linear infinite;
//         }

//         @keyframes sparkle-glow {
//           0%, 100% { 
//             opacity: 0.3;
//             transform: scale(0.8) rotate(0deg);
//           }
//           50% { 
//             opacity: 1;
//             transform: scale(1.2) rotate(180deg);
//           }
//         }
//         .animate-sparkle-glow {
//           animation: sparkle-glow 2s ease-in-out infinite;
//         }

//         @keyframes pulse-ring {
//           0%, 100% {
//             transform: scale(1);
//             box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
//           }
//           50% {
//             transform: scale(1.1);
//             box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
//           }
//         }
//         .animate-pulse-ring {
//           animation: pulse-ring 1.5s ease-out infinite;
//         }

//         @keyframes pulse-glow {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.7; }
//         }
//         .animate-pulse-glow {
//           animation: pulse-glow 1.5s ease-in-out infinite;
//         }

//         @keyframes dropdown {
//           from {
//             opacity: 0;
//             transform: translateY(-6px) scale(0.96);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//         .animate-dropdown {
//           animation: dropdown 0.2s ease-out forwards;
//         }

//         @keyframes dropdown-nested {
//           from {
//             opacity: 0;
//             transform: translateX(-6px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-dropdown-nested {
//           animation: dropdown-nested 0.15s ease-out forwards;
//         }

//         @keyframes slide-item {
//           from {
//             opacity: 0;
//             transform: translateX(12px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-slide-item {
//           animation: slide-item 0.3s ease-out forwards;
//         }

//         @keyframes fade {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade {
//           animation: fade 0.25s ease-out forwards;
//         }

//         @keyframes backdrop {
//           from {
//             backdrop-filter: blur(0);
//             opacity: 0;
//           }
//           to {
//             backdrop-filter: blur(10px);
//             opacity: 1;
//           }
//         }
//         .animate-backdrop {
//           animation: backdrop 0.25s ease-out forwards;
//         }

//         @keyframes slide {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide {
//           animation: slide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Header;



















// import React, { useState, useEffect, useRef } from "react";
// import { User, Menu, ChevronDown, X, Sparkles, Settings, LogOut, Home, Building, Landmark, Warehouse, TrendingUp, Shield, DollarSign, Wrench, PaintBucket, Droplets, Heart, Star, Zap, CheckCircle, Award, MapPin, Globe, Phone, Mail, Calendar, Clock, Briefcase, Users, Briefcase as OfficeIcon, Menu as MenuIcon } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// // Import Individual Forms (Owner)
// import { IndRentForm, IndSellForm, IndLeaseForm } from "../Forms/Owner/Index.js";

// // Import Apartment Forms (Owner)
// import { ApartRentForm, ApartSellForm, ApartLeaseForm } from "../Forms/Owner/Index.js";

// // Import Agent Forms
// import { RentAgentIndForm, SellAgentIndForm, LeaseAgentIndForm } from "../Forms/Agent/Index.js";

// // Import Agent Apartment Forms
// import { RentAgentApartForm, SellAgentApartForm, LeaseAgentApartForm } from "../Forms/Agent/Index.js";

// // Import Builder Forms
// import { RentBuilderIndForm, SellBuilderIndForm, LeaseBuilderIndForm } from "../Forms/Builder/Index.js";

// // Import Builder Apartment Forms
// import { RentBuilderApartForm, SellBuilderApartForm, LeaseBuilderApartForm } from "../Forms/Builder/Index.js";

// // Import Property Management Forms
// import { RentPMIndForm, SellPMIndForm, LeasePMIndForm } from "../Forms/PropertyManagement/Index.js";

// // Import Property Management Apartment Forms
// import { RentPMApartForm, SellPMApartForm, LeasePMApartForm } from "../Forms/PropertyManagement/Index.js";
// import { storage } from "../../utils/storage.js";
// import { jwtDecode } from "jwt-decode";

// const Header = ({ onPostPropertyClick }) => {
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [activeTab, setActiveTab] = useState("home");
  
//   // State for Role Selection (only for Individual)
//   const [showRoleSelectionPopup, setShowRoleSelectionPopup] = useState(false);
  
//   // State for Owner forms
//   const [showOwnerActionPopup, setShowOwnerActionPopup] = useState(false);
//   const [showOwnerRentForm, setShowOwnerRentForm] = useState(false);
//   const [showOwnerSellForm, setShowOwnerSellForm] = useState(false);
//   const [showOwnerLeaseForm, setShowOwnerLeaseForm] = useState(false);

//   // State for Apartment forms (Owner)
//   const [showApartActionPopup, setShowApartActionPopup] = useState(false);
//   const [showApartRentForm, setShowApartRentForm] = useState(false);
//   const [showApartSellForm, setShowApartSellForm] = useState(false);
//   const [showApartLeaseForm, setShowApartLeaseForm] = useState(false);

//   // State for Agent forms
//   const [showAgentActionPopup, setShowAgentActionPopup] = useState(false);
//   const [showAgentRentForm, setShowAgentRentForm] = useState(false);
//   const [showAgentSellForm, setShowAgentSellForm] = useState(false);
//   const [showAgentLeaseForm, setShowAgentLeaseForm] = useState(false);

//   // State for Agent Apartment forms
//   const [showAgentApartActionPopup, setShowAgentApartActionPopup] = useState(false);
//   const [showAgentApartRentForm, setShowAgentApartRentForm] = useState(false);
//   const [showAgentApartSellForm, setShowAgentApartSellForm] = useState(false);
//   const [showAgentApartLeaseForm, setShowAgentApartLeaseForm] = useState(false);

//   // State for Builder forms
//   const [showBuilderActionPopup, setShowBuilderActionPopup] = useState(false);
//   const [showBuilderRentForm, setShowBuilderRentForm] = useState(false);
//   const [showBuilderSellForm, setShowBuilderSellForm] = useState(false);
//   const [showBuilderLeaseForm, setShowBuilderLeaseForm] = useState(false);

//   // State for Builder Apartment forms
//   const [showBuilderApartActionPopup, setShowBuilderApartActionPopup] = useState(false);
//   const [showBuilderApartRentForm, setShowBuilderApartRentForm] = useState(false);
//   const [showBuilderApartSellForm, setShowBuilderApartSellForm] = useState(false);
//   const [showBuilderApartLeaseForm, setShowBuilderApartLeaseForm] = useState(false);

//   // State for Property Management forms
//   const [showPMActionPopup, setShowPMActionPopup] = useState(false);
//   const [showPMRentForm, setShowPMRentForm] = useState(false);
//   const [showPMSellForm, setShowPMSellForm] = useState(false);
//   const [showPMLeaseForm, setShowPMLeaseForm] = useState(false);

//   // State for Property Management Apartment forms
//   const [showPMApartActionPopup, setShowPMApartActionPopup] = useState(false);
//   const [showPMApartRentForm, setShowPMApartRentForm] = useState(false);
//   const [showPMApartSellForm, setShowPMApartSellForm] = useState(false);
//   const [showPMApartLeaseForm, setShowPMApartLeaseForm] = useState(false);

//   const [selectedRole, setSelectedRole] = useState("");
//   const [selectedPropertyType, setSelectedPropertyType] = useState("");

//   const jwt = storage.get("access_token");
//   const decodedJwt = jwt ? jwtDecode(jwt): "";

//   // console.log("decode: ",decodedJwt);

//   const role = decodedJwt? decodedJwt?.role: "";

//   // console.log(role);

//   const [mobileDropdowns, setMobileDropdowns] = useState({
//     customer: false,
//     post: false,
//     loan: false,
//     services: false,
//     profile: false,
//     admin: false,
//     customerSub: {},
//     postSub: {}
//   });
  
//   // Refs for dropdown containers
//   const dropdownRefs = {
//     admin: useRef(null),
//     profile: useRef(null),
//     customer: useRef(null),
//     post: useRef(null),
//     loan: useRef(null),
//     services: useRef(null)
//   };
  
//   // Timer refs for hover delay
//   const hoverTimerRef = useRef(null);
  
//   const navigate = useNavigate();

//   const customerPortalMenu = {
//     "Individual": ["Rent", "Buy", "Lease", "Sell"],
//     "Apartment": ["Rent", "Buy", "Lease", "Sell"],
//     "Commercial": ["Rent", "Buy", "Lease", "Sell"],
//     "Land & Plots": ["Rent", "Buy", "Lease", "Sell"],
//     "Hostel": ["Rent", "Buy", "Lease", "Sell"],
//   };

//   const postPropertyMenu = {
//     "Owner": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Agent": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Builder": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Property Management": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//   };

//   const loanMenu = [
//     "Home Loan",
//     "Property Loan",
//     "Construction Loan",
//     "Plot Loan",
//     "Commercial Loan"
//   ];

//   const servicesMenu = [
//     "Construction",
//     "Interior",
//     "Painting",
//     "Plumbing",
//     "Cleaning"
//   ];

//   const profileMenu = [
//     { label: "Owner", icon: "👤", path: "/profile/owner" },
//     { label: "Agent", icon: "🏢", path: "/profile/agent" },
//     { label: "Builder", icon: "🏗️", path: "/profile/builder" },
//     { label: "Property Management", icon: "🏢", path: "/profile/property-management" }
//   ];

//   const adminMenu = [
//     { 
//       label: "Admin", 
//       icon: <Users className="w-4 h-4" />, 
//       path: "/admin",
//       description: "Admin Panel"
//     },
//     { 
//       label: "Office", 
//       icon: <OfficeIcon className="w-4 h-4" />, 
//       path: "/office",
//       description: "Office Dashboard"
//     }
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Click outside handler for dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Check if click is outside all dropdown containers
//       const isOutsideAll = Object.values(dropdownRefs).every(ref => 
//         ref.current && !ref.current.contains(event.target)
//       );
      
//       if (isOutsideAll && activeDropdown) {
//         setActiveDropdown(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [activeDropdown]);

//   // Clean up hover timer
//   useEffect(() => {
//     return () => {
//       if (hoverTimerRef.current) {
//         clearTimeout(hoverTimerRef.current);
//       }
//     };
//   }, []);

//   // Handle profile navigation
//   const handleProfileNavigation = (path) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
//     navigate(path);
//   };

//   // Handle admin navigation
//   const handleAdminNavigation = (path) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
//     navigate(path);
//   };

//   // Handle Post Property submenu click
//   const handlePostSubmenuClick = (role, propertyType) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
//     setSelectedRole(role);
//     setSelectedPropertyType(propertyType);

//     if (propertyType === "Individual" || propertyType === "Apartment") {
//       if (role === "Agent") {
//         if (propertyType === "Apartment") {
//           setShowAgentApartActionPopup(true);
//         } else {
//           setShowAgentActionPopup(true);
//         }
//       } else if (role === "Owner") {
//         if (propertyType === "Apartment") {
//           setShowApartActionPopup(true);
//         } else {
//           setShowOwnerActionPopup(true);
//         }
//       } else if (role === "Builder") {
//         if (propertyType === "Apartment") {
//           setShowBuilderApartActionPopup(true);
//         } else {
//           setShowBuilderActionPopup(true);
//         }
//       } else if (role === "Property Management") {
//         if (propertyType === "Apartment") {
//           setShowPMApartActionPopup(true);
//         } else {
//           setShowPMActionPopup(true);
//         }
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else {
//       if (onPostPropertyClick) {
//         onPostPropertyClick(role, propertyType);
//       }
//     }
//   };

//   const handleRoleSelect = (role) => {
//     setShowRoleSelectionPopup(false);
//     setSelectedRole(role);
    
//     if (role === "Owner") {
//       if (selectedPropertyType === "Apartment") {
//         setShowApartActionPopup(true);
//       } else {
//         setShowOwnerActionPopup(true);
//       }
//     } else if (role === "Agent") {
//       if (selectedPropertyType === "Apartment") {
//         setShowAgentApartActionPopup(true);
//       } else {
//         setShowAgentActionPopup(true);
//       }
//     } else if (role === "Builder") {
//       if (selectedPropertyType === "Apartment") {
//         setShowBuilderApartActionPopup(true);
//       } else {
//         setShowBuilderActionPopup(true);
//       }
//     } else if (role === "Property Management") {
//       if (selectedPropertyType === "Apartment") {
//         setShowPMApartActionPopup(true);
//       } else {
//         setShowPMActionPopup(true);
//       }
//     }
//   };

//   // Handle Owner action button clicks (Rent, Sell, Lease)
//   const handleOwnerActionClick = (action) => {
//     setShowOwnerActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowOwnerRentForm(true);
//         break;
//       case "Sell":
//         setShowOwnerSellForm(true);
//         break;
//       case "Lease":
//         setShowOwnerLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Apartment action button clicks (Rent, Sell, Lease)
//   const handleApartActionClick = (action) => {
//     setShowApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowApartRentForm(true);
//         break;
//       case "Sell":
//         setShowApartSellForm(true);
//         break;
//       case "Lease":
//         setShowApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent action button clicks (Rent, Sell, Lease)
//   const handleAgentActionClick = (action) => {
//     setShowAgentActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent Apartment action button clicks (Rent, Sell, Lease)
//   const handleAgentApartActionClick = (action) => {
//     setShowAgentApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentApartRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentApartSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder action button clicks (Rent, Sell, Lease)
//   const handleBuilderActionClick = (action) => {
//     setShowBuilderActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder Apartment action button clicks (Rent, Sell, Lease)
//   const handleBuilderApartActionClick = (action) => {
//     setShowBuilderApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderApartRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderApartSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management action button clicks (Rent, Sell, Lease)
//   const handlePMActionClick = (action) => {
//     setShowPMActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMRentForm(true);
//         break;
//       case "Sell":
//         setShowPMSellForm(true);
//         break;
//       case "Lease":
//         setShowPMLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management Apartment action button clicks (Rent, Sell, Lease)
//   const handlePMApartActionClick = (action) => {
//     setShowPMApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMApartRentForm(true);
//         break;
//       case "Sell":
//         setShowPMApartSellForm(true);
//         break;
//       case "Lease":
//         setShowPMApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleCustomerPortalClick = (type) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
    
//     const typeKey = type.toLowerCase().replace(/\s+/g, '-');
    
//     if (typeKey === "individual") {
//       navigate("/individual");
//     } else if (typeKey === "rent") {
//       navigate("/rent");
//     } else if (typeKey === "buy") {
//       navigate("/buy");
//     } else if (typeKey === "lease") {
//       navigate("/lease");
//     } else if (typeKey === "sell") {
//       navigate("/sell");
//     } else if (typeKey === "apartment") {
//       navigate("/apartment");
//     } else if (typeKey === "commercial") {
//       navigate("/commercial");
//     } else if (typeKey === "land-&-plots") {
//       navigate("/land-plots");
//     } else if (typeKey === "hostel") {
//       navigate("/hostel");
//     }
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//     if (!mobileMenuOpen) {
//       setMobileDropdowns({
//         customer: false,
//         post: false,
//         loan: false,
//         services: false,
//         profile: false,
//         admin: false,
//         customerSub: {},
//         postSub: {}
//       });
//     }
//   };

//   const toggleMobileDropdown = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const toggleCustomerSub = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       customerSub: {
//         ...prev.customerSub,
//         [key]: !prev.customerSub[key]
//       }
//     }));
//   };

//   const togglePostSub = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       postSub: {
//         ...prev.postSub,
//         [key]: !prev.postSub[key]
//       }
//     }));
//   };

//   // Dropdown handlers with improved logic
//   const handleDropdownToggle = (dropdown) => {
//     setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
//   };

//   const handleDropdownEnter = (dropdown) => {
//     if (hoverTimerRef.current) {
//       clearTimeout(hoverTimerRef.current);
//       hoverTimerRef.current = null;
//     }
//     setActiveDropdown(dropdown);
//   };

//   const handleDropdownLeave = (e, dropdown) => {
//     // Check if the mouse is moving to the dropdown content
//     const relatedTarget = e.relatedTarget;
//     const currentRef = dropdownRefs[dropdown];
    
//     if (currentRef && currentRef.current && relatedTarget) {
//       if (currentRef.current.contains(relatedTarget)) {
//         return;
//       }
//     }
    
//     // Use a small delay to prevent accidental closing
//     hoverTimerRef.current = setTimeout(() => {
//       setActiveDropdown(null);
//       hoverTimerRef.current = null;
//     }, 100);
//   };

//   return (
//     <>
//       <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         scrolled 
//           ? 'bg-gradient-to-r from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl shadow-2xl shadow-[#00695C]/20' 
//           : 'bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C]'
//       }`}>
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full animate-float-particle"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 width: `${Math.random() * 2 + 1}px`,
//                 height: `${Math.random() * 2 + 1}px`,
//                 background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${6 + Math.random() * 12}s`,
//               }}
//             />
//           ))}
          
//           <div className="absolute bottom-0 left-0 right-0 h-8">
//             <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent animate-wave-slow" />
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

//         <div className="h-[72px] md:h-[84px] w-full px-3 md:px-6 flex items-center relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03] animate-sweep" />
          
//           <div className="flex items-center justify-between w-full relative z-10">
//             <div className="flex items-center gap-2 md:gap-4">
//               <button
//                 onClick={toggleMobileMenu}
//                 className="md:hidden p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 group relative"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//                 <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
//               </button>

//               <div
//                 onClick={() => navigate("/")}
//                 className="cursor-pointer group relative"
//               >
//                 <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
//                 <div className="relative w-13 h-13 md:w-[76px] md:h-[76px] rounded-full overflow-hidden flex items-center justify-center">
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#004D40] to-[#00695C] opacity-80" />
//                   <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#26A69A]/20 to-transparent" />
//                   <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 via-transparent to-[#00FF88]/20 animate-spin-slow rounded-full" />
                  
//                   <img
//                     src={logo}
//                     alt="Eliteinova Properties Logo"
//                     className="w-11 h-11 md:w-[60px] md:h-[60px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
//                     style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
//                   />
//                 </div>
//               </div>

//               <div 
//                 onClick={() => navigate("/")} 
//                 className="cursor-pointer group relative"
//               >
//                 <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#00FF88]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
//                 <h1
//                   className="text-lg md:text-2xl lg:text-3xl font-light leading-tight relative tracking-wide"
//                   style={{
//                     fontFamily: "Pacifico, cursive",
//                     color: "#E8F5E9",
//                     textShadow: '0 2px 16px rgba(0, 229, 255, 0.2)',
//                     fontWeight: 150,
//                   }}
//                 >
//                   <span className="relative inline-block group-hover:scale-105 transition-transform duration-500">
//                     Eliteinova <span className="text-[0.75em]">Properties</span>
//                     <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00E5FF]/20 via-[#00FF88]/20 to-[#00E5FF]/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700" />
//                   </span>
//                 </h1>
                
//                 <p 
//                   className="text-[11px] md:text-sm lg:text-base font-light leading-tight mt-0 flex items-center gap-2"
//                   style={{
//                     fontFamily: "Pacifico, cursive",
//                     color: "#C8E6C9",
//                     fontWeight: 300,
//                   }}
//                 >
//                   <span className="relative whitespace-nowrap">
//                     No Brokerage
//                     <Sparkles className="absolute -right-5 -top-0.5 w-3 h-3 text-yellow-300 animate-sparkle-glow" />
//                   </span>
//                   <span className="text-[8px] md:text-[10px] bg-gradient-to-r from-[#00FF88]/20 to-[#00E5FF]/20 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-sm">
//                     ⭐ Trusted
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* Profile Section - Desktop */}
//             <div className="hidden md:flex items-center gap-3">
//               {/* Admin Hamburger Dropdown */}
//               {role === "admin" && <div
//                 ref={dropdownRefs.admin}
//                 className="relative"
//                 onMouseEnter={() => handleDropdownEnter("admin")}
//                 onMouseLeave={(e) => handleDropdownLeave(e, "admin")}
//               >
//                 <button 
//                   className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-[#26A69A]/30 backdrop-blur-sm hover:bg-[#26A69A]/50 transition-all duration-300 border border-white/20 hover:border-white/40"
//                   onClick={() => handleDropdownToggle("admin")}
//                 >
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30 group-hover:scale-110 transition-transform duration-300">
//                     <MenuIcon className="w-4 h-4 text-white" />
//                   </div>
//                 </button>

//                 {activeDropdown === "admin" && (
//                   <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[200px] border border-white/30 animate-dropdown overflow-hidden">
//                     <div className="p-2">
//                       {adminMenu.map((item, index) => (
//                         <button
//                           key={index}
//                           onClick={() => handleAdminNavigation(item.path)}
//                           className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 group"
//                         >
//                           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex items-center justify-center text-[#00695C] group-hover:scale-110 transition-transform duration-300">
//                             {item.icon}
//                           </div>
//                           <div className="flex flex-col items-start">
//                             <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00695C] transition-colors">
//                               {item.label}
//                             </span>
//                             <span className="text-[10px] text-gray-500">{item.description}</span>
//                           </div>
//                           <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-[#00695C] transition-colors -rotate-90" />
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>}

//               {/* Profile Dropdown */}
//               {role === "vendor"  && 
//                 <div
//                   ref={dropdownRefs.profile}
//                   className="relative"
//                   onMouseEnter={() => handleDropdownEnter("profile")}
//                   onMouseLeave={(e) => handleDropdownLeave(e, "profile")}
//                 >
//                   <button 
//                     className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
//                     onClick={() => handleDropdownToggle("profile")}
//                   >
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
//                       <User className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="text-white font-medium text-sm">Profile</span>
//                     <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${activeDropdown === "profile" ? 'rotate-180' : ''}`} />
//                   </button>

//                   {activeDropdown === "profile" && (
//                     <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[220px] border border-white/30 animate-dropdown overflow-hidden">
//                       <div className="p-2">
//                         {profileMenu.map((item, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handleProfileNavigation(item.path)}
//                             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 group"
//                           >
//                             <span className="text-xl">{item.icon}</span>
//                             <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00695C] transition-colors">
//                               {item.label}
//                             </span>
//                             <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-[#00695C] transition-colors -rotate-90" />
//                           </button>
//                         ))}
                        
//                         <div className="border-t border-gray-200/50 my-1"></div>
                        
//                         <button
//                           onClick={() => {
//                             setActiveDropdown(null);
//                             navigate("/logout");
//                           }}
//                           className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-red-50 to-pink-50 transition-all duration-300 group"
//                         >
//                           <LogOut className="w-5 h-5 text-red-500" />
//                           <span className="text-sm font-semibold text-red-600">Logout</span>
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               }
//             </div>
//           </div>
//         </div>

//         <nav className="hidden md:flex h-12 items-center relative bg-gradient-to-r from-[#004D40]/90 via-[#00796B]/90 to-[#004D40]/90 backdrop-blur-sm border-t border-white/5">
//           <div className="absolute inset-0 opacity-[0.03]">
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow" />
//           </div>
          
//           <div className="flex items-center h-full relative z-10">
//             <button
//               onClick={() => {
//                 navigate("/");
//                 setActiveTab("home");
//               }}
//               className={`group relative px-5 h-full text-white font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden ${
//                 activeTab === "home" 
//                   ? 'bg-gradient-to-r from-white/10 to-transparent' 
//                   : 'hover:bg-white/5'
//               }`}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
//               <span className="flex items-center gap-2 relative z-10">
//                 <Home className="w-4 h-4" />
//                 Home
//               </span>
              
//               {activeTab === "home" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse-glow" />
//               )}
//             </button>

//             <div
//               ref={dropdownRefs.customer}
//               className="relative h-full"
//               onMouseEnter={() => handleDropdownEnter("customer")}
//               onMouseLeave={(e) => handleDropdownLeave(e, "customer")}
//             >
//               <button 
//                 onClick={() => navigate("/customer-portal")}
//                 className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
//               >
//                 <Building className="w-4 h-4" />
//                 <span>Customer Portal</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "customer" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "customer" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
//                   {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                     <div key={key} className="relative group/item">
//                       <button 
//                         onClick={() => handleCustomerPortalClick(key)}
//                         className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 capitalize"
//                       >
//                         {key}
//                       </button>
//                       <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[160px] z-50 border border-white/30 animate-dropdown-nested">
//                         {submenu.map((item) => (
//                           <button
//                             key={item}
//                             onClick={() => handleCustomerPortalClick(item.toLowerCase())}
//                             className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                           >
//                             {item}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {(role === "vendor" ||  role === "admin") && 
//             <div
//               ref={dropdownRefs.post}
//               className="relative h-full"
//               onMouseEnter={() => handleDropdownEnter("post")}
//               onMouseLeave={(e) => handleDropdownLeave(e, "post")}
//             >
//               <button
//                 onClick={() => navigate("/post-property")}
//                 className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 <span>Post Property</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "post" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "post" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[190px] border border-white/30 animate-dropdown">
//                   {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                     <div key={role} className="relative group/item">
//                       <button
//                         className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 flex items-center justify-between gap-3"
//                       >
//                         {role}
//                         <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-gray-400" />
//                       </button>
//                       <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[170px] z-50 border border-white/30 animate-dropdown-nested">
//                         {submenu.map((propertyType) => (
//                           <button
//                             key={propertyType}
//                             onClick={() => handlePostSubmenuClick(role, propertyType)}
//                             className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                           >
//                             {propertyType}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             }

//             <div
//               ref={dropdownRefs.loan}
//               className="relative h-full"
//               onMouseEnter={() => handleDropdownEnter("loan")}
//               onMouseLeave={(e) => handleDropdownLeave(e, "loan")}
//             >
//               <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
//                 <Landmark className="w-4 h-4" />
//                 <span>Find Loan</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "loan" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "loan" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
//                   {loanMenu.map((item) => (
//                     <button
//                       key={item}
//                       className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div
//               ref={dropdownRefs.services}
//               className="relative h-full"
//               onMouseEnter={() => handleDropdownEnter("services")}
//               onMouseLeave={(e) => handleDropdownLeave(e, "services")}
//             >
//               <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
//                 <Settings className="w-4 h-4" />
//                 <span>Services</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "services" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "services" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[160px] border border-white/30 animate-dropdown">
//                   {servicesMenu.map((item) => (
//                     <button
//                       key={item}
//                       className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div> 
//         </nav>
//       </header>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div 
//           className="md:hidden fixed inset-0 z-50 animate-fade"
//           onClick={toggleMobileMenu}
//         >
//           <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl animate-backdrop" />
          
//           <div 
//             className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#00695C] to-[#26A69A] shadow-2xl shadow-[#00695C]/50 overflow-y-auto animate-slide"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between p-4 border-b border-white/10">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
//                   <Menu className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-white font-bold text-sm">Menu</h2>
//                   <p className="text-white/50 text-[10px]">Welcome back!</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={toggleMobileMenu} 
//                 className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
//               >
//                 <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
//               </button>
//             </div>
            
//             {/* Admin Section in Mobile */}
//             <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '0ms' }}>
//               <div 
//                 className="flex items-center gap-3 cursor-pointer"
//                 onClick={() => toggleMobileDropdown('admin')}
//               >
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30">
//                   <MenuIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-white font-semibold text-sm">Admin Panel</p>
//                   <p className="text-white/60 text-xs">Manage admin & office</p>
//                 </div>
//                 <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.admin ? 'rotate-180' : ''}`} />
//               </div>
              
//               {mobileDropdowns.admin && (
//                 <div className="mt-2 space-y-1 pl-3">
//                   {adminMenu.map((item, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         handleAdminNavigation(item.path);
//                         toggleMobileMenu();
//                       }}
//                       className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
//                     >
//                       <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center text-[#00695C]">
//                         {item.icon}
//                       </div>
//                       <div className="flex flex-col items-start flex-1">
//                         <span className="text-white text-sm font-medium">{item.label}</span>
//                         <span className="text-white/50 text-[10px]">{item.description}</span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             {/* Profile Section in Mobile */}
//             <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '50ms' }}>
//               <div 
//                 className="flex items-center gap-3 cursor-pointer"
//                 onClick={() => toggleMobileDropdown('profile')}
//               >
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-white font-semibold text-sm">Profile</p>
//                   <p className="text-white/60 text-xs">Select your role</p>
//                 </div>
//                 <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.profile ? 'rotate-180' : ''}`} />
//               </div>
              
//               {mobileDropdowns.profile && (
//                 <div className="mt-2 space-y-1 pl-3">
//                   {profileMenu.map((item, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         handleProfileNavigation(item.path);
//                         toggleMobileMenu();
//                       }}
//                       className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
//                     >
//                       <span className="text-xl">{item.icon}</span>
//                       <span className="text-white text-sm font-medium">{item.label}</span>
//                     </button>
//                   ))}
                  
//                   <button
//                     onClick={() => {
//                       navigate("/logout");
//                       toggleMobileMenu();
//                     }}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 mt-1"
//                   >
//                     <LogOut className="w-4 h-4 text-red-400" />
//                     <span className="text-red-400 text-sm font-medium">Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
            
//             <div className="px-4 pb-32">
//               <button 
//                 onClick={() => {
//                   navigate('/');
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '100ms' }}
//               >
//                 🏠 Home
//               </button>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '150ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('customer')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🏢 Customer Portal</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.customer ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.customer && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                       <div key={key} className="border-l border-white/10 pl-3">
//                         <div 
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => toggleCustomerSub(key)}
//                         >
//                           <span className="text-white/90 text-sm capitalize">{key}</span>
//                           <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.customerSub[key] ? 'rotate-180' : ''}`} />
//                         </div>
                        
//                         {mobileDropdowns.customerSub[key] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((item) => (
//                               <button 
//                                 key={item} 
//                                 onClick={() => {
//                                   handleCustomerPortalClick(item.toLowerCase());
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {item}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '200ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('post')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">📊 Post Property</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.post ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.post && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                       <div key={role} className="border-l border-white/10 pl-3">
//                         <div
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => togglePostSub(role)}
//                         >
//                           <span className="text-white/90 text-sm">{role}</span>
//                           <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform duration-300 ${mobileDropdowns.postSub[role] ? 'rotate-180' : ''}`} />
//                         </div>

//                         {mobileDropdowns.postSub[role] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((propertyType) => (
//                               <button
//                                 key={propertyType}
//                                 onClick={() => {
//                                   handlePostSubmenuClick(role, propertyType);
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {propertyType}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '250ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('loan')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">💰 Find Loan</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.loan ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.loan && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {loanMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '300ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('services')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🛠️ Services</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.services ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.services && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {servicesMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* All Popup Modals and Forms remain the same */}
//       {showRoleSelectionPopup && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowRoleSelectionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Select Role
//               </h2>
//               <button 
//                 onClick={() => setShowRoleSelectionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → {selectedPropertyType} Property: Who is listing this property?
//             </p>

//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 onClick={() => handleRoleSelect("Owner")}
//                 className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">👤</div>
//                 <div className="font-bold text-emerald-700 group-hover:text-emerald-900">Owner</div>
//                 <div className="text-[10px] text-gray-500">Individual owner</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Agent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Agent</div>
//                 <div className="text-[10px] text-gray-500">Professional agent</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Builder")}
//                 className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏗️</div>
//                 <div className="font-bold text-amber-700 group-hover:text-amber-900">Builder</div>
//                 <div className="text-[10px] text-gray-500">Builder/Developer</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Property Management")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Property Management</div>
//                 <div className="text-[10px] text-gray-500">Property management company</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showOwnerActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowOwnerActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Owner - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowOwnerActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleOwnerActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleOwnerActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleOwnerActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Apartment - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showAgentActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showAgentApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showBuilderActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showBuilderApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showPMActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showPMApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedRole} → Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <IndRentForm isOpen={showOwnerRentForm} onClose={() => setShowOwnerRentForm(false)} />
//       <IndSellForm isOpen={showOwnerSellForm} onClose={() => setShowOwnerSellForm(false)} />
//       <IndLeaseForm isOpen={showOwnerLeaseForm} onClose={() => setShowOwnerLeaseForm(false)} />

//       <ApartRentForm isOpen={showApartRentForm} onClose={() => setShowApartRentForm(false)} />
//       <ApartSellForm isOpen={showApartSellForm} onClose={() => setShowApartSellForm(false)} />
//       <ApartLeaseForm isOpen={showApartLeaseForm} onClose={() => setShowApartLeaseForm(false)} />

//       <RentAgentIndForm isOpen={showAgentRentForm} onClose={() => setShowAgentRentForm(false)} />
//       <SellAgentIndForm isOpen={showAgentSellForm} onClose={() => setShowAgentSellForm(false)} />
//       <LeaseAgentIndForm isOpen={showAgentLeaseForm} onClose={() => setShowAgentLeaseForm(false)} />

//       <RentAgentApartForm isOpen={showAgentApartRentForm} onClose={() => setShowAgentApartRentForm(false)} />
//       <SellAgentApartForm isOpen={showAgentApartSellForm} onClose={() => setShowAgentApartSellForm(false)} />
//       <LeaseAgentApartForm isOpen={showAgentApartLeaseForm} onClose={() => setShowAgentApartLeaseForm(false)} />

//       <RentBuilderIndForm isOpen={showBuilderRentForm} onClose={() => setShowBuilderRentForm(false)} />
//       <SellBuilderIndForm isOpen={showBuilderSellForm} onClose={() => setShowBuilderSellForm(false)} />
//       <LeaseBuilderIndForm isOpen={showBuilderLeaseForm} onClose={() => setShowBuilderLeaseForm(false)} />

//       <RentBuilderApartForm isOpen={showBuilderApartRentForm} onClose={() => setShowBuilderApartRentForm(false)} />
//       <SellBuilderApartForm isOpen={showBuilderApartSellForm} onClose={() => setShowBuilderApartSellForm(false)} />
//       <LeaseBuilderApartForm isOpen={showBuilderApartLeaseForm} onClose={() => setShowBuilderApartLeaseForm(false)} />

//       <RentPMIndForm isOpen={showPMRentForm} onClose={() => setShowPMRentForm(false)} />
//       <SellPMIndForm isOpen={showPMSellForm} onClose={() => setShowPMSellForm(false)} />
//       <LeasePMIndForm isOpen={showPMLeaseForm} onClose={() => setShowPMLeaseForm(false)} />

//       <RentPMApartForm isOpen={showPMApartRentForm} onClose={() => setShowPMApartRentForm(false)} />
//       <SellPMApartForm isOpen={showPMApartSellForm} onClose={() => setShowPMApartSellForm(false)} />
//       <LeasePMApartForm isOpen={showPMApartLeaseForm} onClose={() => setShowPMApartLeaseForm(false)} />

//       <style>{`
//         @keyframes float-particle {
//           0%, 100% { 
//             transform: translateY(0) translateX(0) rotate(0deg); 
//             opacity: 0.2;
//           }
//           25% { 
//             transform: translateY(-20px) translateX(15px) rotate(90deg); 
//             opacity: 0.5;
//           }
//           50% { 
//             transform: translateY(-12px) translateX(-12px) rotate(180deg); 
//             opacity: 0.7;
//           }
//           75% { 
//             transform: translateY(12px) translateX(18px) rotate(270deg); 
//             opacity: 0.3;
//           }
//         }
//         .animate-float-particle {
//           animation: float-particle 10s ease-in-out infinite;
//         }

//         @keyframes wave-slow {
//           0% { transform: translateX(0) scaleY(1); }
//           50% { transform: translateX(40px) scaleY(1.2); }
//           100% { transform: translateX(80px) scaleY(1); }
//         }
//         .animate-wave-slow {
//           animation: wave-slow 8s ease-in-out infinite;
//         }

//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s linear infinite;
//         }

//         @keyframes shimmer-slow {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer-slow {
//           animation: shimmer-slow 8s linear infinite;
//         }

//         @keyframes sweep {
//           0%, 100% { 
//             background-position: 0% 50%; 
//             opacity: 0.3;
//           }
//           50% { 
//             background-position: 100% 50%; 
//             opacity: 0.6;
//           }
//         }
//         .animate-sweep {
//           background-size: 200% 200%;
//           animation: sweep 4s ease infinite;
//         }

//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-spin-slow {
//           animation: spin-slow 6s linear infinite;
//         }

//         @keyframes sparkle-glow {
//           0%, 100% { 
//             opacity: 0.3;
//             transform: scale(0.8) rotate(0deg);
//           }
//           50% { 
//             opacity: 1;
//             transform: scale(1.2) rotate(180deg);
//           }
//         }
//         .animate-sparkle-glow {
//           animation: sparkle-glow 2s ease-in-out infinite;
//         }

//         @keyframes pulse-ring {
//           0%, 100% {
//             transform: scale(1);
//             box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
//           }
//           50% {
//             transform: scale(1.1);
//             box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
//           }
//         }
//         .animate-pulse-ring {
//           animation: pulse-ring 1.5s ease-out infinite;
//         }

//         @keyframes pulse-glow {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.7; }
//         }
//         .animate-pulse-glow {
//           animation: pulse-glow 1.5s ease-in-out infinite;
//         }

//         @keyframes dropdown {
//           from {
//             opacity: 0;
//             transform: translateY(-6px) scale(0.96);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//         .animate-dropdown {
//           animation: dropdown 0.2s ease-out forwards;
//         }

//         @keyframes dropdown-nested {
//           from {
//             opacity: 0;
//             transform: translateX(-6px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-dropdown-nested {
//           animation: dropdown-nested 0.15s ease-out forwards;
//         }

//         @keyframes slide-item {
//           from {
//             opacity: 0;
//             transform: translateX(12px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-slide-item {
//           animation: slide-item 0.3s ease-out forwards;
//         }

//         @keyframes fade {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade {
//           animation: fade 0.25s ease-out forwards;
//         }

//         @keyframes backdrop {
//           from {
//             backdrop-filter: blur(0);
//             opacity: 0;
//           }
//           to {
//             backdrop-filter: blur(10px);
//             opacity: 1;
//           }
//         }
//         .animate-backdrop {
//           animation: backdrop 0.25s ease-out forwards;
//         }

//         @keyframes slide {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide {
//           animation: slide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Header;

















// import React, { useState, useEffect, useRef } from "react";
// import { User, Menu, ChevronDown, X, Sparkles, Bell, Search, HelpCircle, Settings, LogOut, Home, Building, Landmark, Warehouse, TrendingUp, Shield, DollarSign, Wrench, PaintBucket, Droplets, Heart, Star, Zap, CheckCircle, Award, MapPin, Globe, Phone, Mail, Calendar, Clock, Briefcase, } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// // Import Individual Forms (Owner)
// import { IndRentForm, IndSellForm, IndLeaseForm } from "../Forms/Owner/Index.js";

// // Import Apartment Forms (Owner)
// import { ApartRentForm, ApartSellForm, ApartLeaseForm } from "../Forms/Owner/Index.js";

// // Import Commercial Forms (Owner)
// import { ComRentForm, ComSellForm, ComLeaseForm } from "../Forms/Owner/Index.js";

// // ============ IMPORT LAND & PLOTS FORMS (OWNER) ============
// import { RentLPForm, SellLPForm, LeaseLPForm } from "../Forms/Owner/Index.js";

// // ============ IMPORT HOSTEL FORMS (OWNER) ============
// import { HostelRentForm, HostelSellForm, HostelLeaseForm } from "../Forms/Owner/Index.js";

// // Import Agent Forms
// import { RentAgentIndForm, SellAgentIndForm, LeaseAgentIndForm } from "../Forms/Agent/Index.js";

// // Import Agent Apartment Forms
// import { RentAgentApartForm, SellAgentApartForm, LeaseAgentApartForm } from "../Forms/Agent/Index.js";

// // Import Agent Commercial Forms
// import { RentAgentComForm, SellAgentComForm, LeaseAgentComForm } from "../Forms/Agent/Index.js";

// // ============ IMPORT AGENT LAND & PLOTS FORMS ============
// import { RentAgentLPForm, SellAgentLPForm, LeaseAgentLPForm } from "../Forms/Agent/Index.js";

// // ============ IMPORT AGENT HOSTEL FORMS ============
// import { RentAgentHostelForm, SellAgentHostelForm, LeaseAgentHostelForm } from "../Forms/Agent/Index.js";

// // Import Builder Forms
// import { RentBuilderIndForm, SellBuilderIndForm, LeaseBuilderIndForm } from "../Forms/Builder/Index.js";

// // Import Builder Apartment Forms
// import { RentBuilderApartForm, SellBuilderApartForm, LeaseBuilderApartForm } from "../Forms/Builder/Index.js";

// // Import Builder Commercial Forms
// import { RentBuilderComForm, SellBuilderComForm, LeaseBuilderComForm } from "../Forms/Builder/Index.js";

// // ============ IMPORT BUILDER LAND & PLOTS FORMS ============
// import { RentBuilderLPForm, SellBuilderLPForm, LeaseBuilderLPForm } from "../Forms/Builder/Index.js";

// // ============ IMPORT BUILDER HOSTEL FORMS ============
// import { RentBuilderHostelForm, SellBuilderHostelForm, LeaseBuilderHostelForm } from "../Forms/Builder/Index.js";

// // Import Property Management Forms
// import { RentPMIndForm, SellPMIndForm, LeasePMIndForm } from "../Forms/PropertyManagement/Index.js";

// // Import Property Management Apartment Forms
// import { RentPMApartForm, SellPMApartForm, LeasePMApartForm } from "../Forms/PropertyManagement/Index.js";

// // Import Property Management Commercial Forms
// import { RentPMComForm, SellPMComForm, LeasePMComForm } from "../Forms/PropertyManagement/Index.js";

// // ============ IMPORT PROPERTY MANAGEMENT LAND & PLOTS FORMS ============
// import { RentPMLPForm, SellPMLPForm, LeasePMLPForm } from "../Forms/PropertyManagement/Index.js";

// // ============ IMPORT PROPERTY MANAGEMENT HOSTEL FORMS ============
// import { RentPMHostelForm, SellPMHostelForm, LeasePMHostelForm } from "../Forms/PropertyManagement/Index.js";

// import {Briefcase as Users} from 'lucide-react';
// import {Briefcase as OfficeIcon} from 'lucide-react';

// const Header = ({ onPostPropertyClick }) => {
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(3);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("home");
  
//   // State for Role Selection
//   const [showRoleSelectionPopup, setShowRoleSelectionPopup] = useState(false);
  
//   // State for Owner forms
//   const [showOwnerActionPopup, setShowOwnerActionPopup] = useState(false);
//   const [showOwnerRentForm, setShowOwnerRentForm] = useState(false);
//   const [showOwnerSellForm, setShowOwnerSellForm] = useState(false);
//   const [showOwnerLeaseForm, setShowOwnerLeaseForm] = useState(false);

//   // State for Apartment forms (Owner)
//   const [showApartActionPopup, setShowApartActionPopup] = useState(false);
//   const [showApartRentForm, setShowApartRentForm] = useState(false);
//   const [showApartSellForm, setShowApartSellForm] = useState(false);
//   const [showApartLeaseForm, setShowApartLeaseForm] = useState(false);

//   // State for Commercial forms (Owner)
//   const [showComActionPopup, setShowComActionPopup] = useState(false);
//   const [showComRentForm, setShowComRentForm] = useState(false);
//   const [showComSellForm, setShowComSellForm] = useState(false);
//   const [showComLeaseForm, setShowComLeaseForm] = useState(false);

//   // ============ LAND & PLOTS FORM STATES (OWNER) ============
//   const [showLPActionPopup, setShowLPActionPopup] = useState(false);
//   const [showLPRentForm, setShowLPRentForm] = useState(false);
//   const [showLPSellForm, setShowLPSellForm] = useState(false);
//   const [showLPLeaseForm, setShowLPLeaseForm] = useState(false);

//   // ============ HOSTEL FORM STATES (OWNER) ============
//   const [showHostelActionPopup, setShowHostelActionPopup] = useState(false);
//   const [showHostelRentForm, setShowHostelRentForm] = useState(false);
//   const [showHostelSellForm, setShowHostelSellForm] = useState(false);
//   const [showHostelLeaseForm, setShowHostelLeaseForm] = useState(false);

//   // ============ LAND & PLOTS FORM STATES (AGENT) ============
//   const [showAgentLPActionPopup, setShowAgentLPActionPopup] = useState(false);
//   const [showAgentLPRentForm, setShowAgentLPRentForm] = useState(false);
//   const [showAgentLPSellForm, setShowAgentLPSellForm] = useState(false);
//   const [showAgentLPLeaseForm, setShowAgentLPLeaseForm] = useState(false);

//   // ============ HOSTEL FORM STATES (AGENT) ============
//   const [showAgentHostelActionPopup, setShowAgentHostelActionPopup] = useState(false);
//   const [showAgentHostelRentForm, setShowAgentHostelRentForm] = useState(false);
//   const [showAgentHostelSellForm, setShowAgentHostelSellForm] = useState(false);
//   const [showAgentHostelLeaseForm, setShowAgentHostelLeaseForm] = useState(false);

//   // ============ LAND & PLOTS FORM STATES (BUILDER) ============
//   const [showBuilderLPActionPopup, setShowBuilderLPActionPopup] = useState(false);
//   const [showBuilderLPRentForm, setShowBuilderLPRentForm] = useState(false);
//   const [showBuilderLPSellForm, setShowBuilderLPSellForm] = useState(false);
//   const [showBuilderLPLeaseForm, setShowBuilderLPLeaseForm] = useState(false);

//   // ============ HOSTEL FORM STATES (BUILDER) ============
//   const [showBuilderHostelActionPopup, setShowBuilderHostelActionPopup] = useState(false);
//   const [showBuilderHostelRentForm, setShowBuilderHostelRentForm] = useState(false);
//   const [showBuilderHostelSellForm, setShowBuilderHostelSellForm] = useState(false);
//   const [showBuilderHostelLeaseForm, setShowBuilderHostelLeaseForm] = useState(false);

//   // ============ LAND & PLOTS FORM STATES (PROPERTY MANAGEMENT) ============
//   const [showPMLPActionPopup, setShowPMLPActionPopup] = useState(false);
//   const [showPMLPRentForm, setShowPMLPRentForm] = useState(false);
//   const [showPMLPSellForm, setShowPMLPSellForm] = useState(false);
//   const [showPMLPLeaseForm, setShowPMLPLeaseForm] = useState(false);

//   // ============ HOSTEL FORM STATES (PROPERTY MANAGEMENT) ============
//   const [showPMHostelActionPopup, setShowPMHostelActionPopup] = useState(false);
//   const [showPMHostelRentForm, setShowPMHostelRentForm] = useState(false);
//   const [showPMHostelSellForm, setShowPMHostelSellForm] = useState(false);
//   const [showPMHostelLeaseForm, setShowPMHostelLeaseForm] = useState(false);

//   // State for Agent forms
//   const [showAgentActionPopup, setShowAgentActionPopup] = useState(false);
//   const [showAgentRentForm, setShowAgentRentForm] = useState(false);
//   const [showAgentSellForm, setShowAgentSellForm] = useState(false);
//   const [showAgentLeaseForm, setShowAgentLeaseForm] = useState(false);

//   // State for Agent Apartment forms
//   const [showAgentApartActionPopup, setShowAgentApartActionPopup] = useState(false);
//   const [showAgentApartRentForm, setShowAgentApartRentForm] = useState(false);
//   const [showAgentApartSellForm, setShowAgentApartSellForm] = useState(false);
//   const [showAgentApartLeaseForm, setShowAgentApartLeaseForm] = useState(false);

//   // State for Agent Commercial forms
//   const [showAgentComActionPopup, setShowAgentComActionPopup] = useState(false);
//   const [showAgentComRentForm, setShowAgentComRentForm] = useState(false);
//   const [showAgentComSellForm, setShowAgentComSellForm] = useState(false);
//   const [showAgentComLeaseForm, setShowAgentComLeaseForm] = useState(false);

//   // State for Builder forms
//   const [showBuilderActionPopup, setShowBuilderActionPopup] = useState(false);
//   const [showBuilderRentForm, setShowBuilderRentForm] = useState(false);
//   const [showBuilderSellForm, setShowBuilderSellForm] = useState(false);
//   const [showBuilderLeaseForm, setShowBuilderLeaseForm] = useState(false);

//   // State for Builder Apartment forms
//   const [showBuilderApartActionPopup, setShowBuilderApartActionPopup] = useState(false);
//   const [showBuilderApartRentForm, setShowBuilderApartRentForm] = useState(false);
//   const [showBuilderApartSellForm, setShowBuilderApartSellForm] = useState(false);
//   const [showBuilderApartLeaseForm, setShowBuilderApartLeaseForm] = useState(false);

//   // State for Builder Commercial forms
//   const [showBuilderComActionPopup, setShowBuilderComActionPopup] = useState(false);
//   const [showBuilderComRentForm, setShowBuilderComRentForm] = useState(false);
//   const [showBuilderComSellForm, setShowBuilderComSellForm] = useState(false);
//   const [showBuilderComLeaseForm, setShowBuilderComLeaseForm] = useState(false);

//   // State for Property Management forms
//   const [showPMActionPopup, setShowPMActionPopup] = useState(false);
//   const [showPMRentForm, setShowPMRentForm] = useState(false);
//   const [showPMSellForm, setShowPMSellForm] = useState(false);
//   const [showPMLeaseForm, setShowPMLeaseForm] = useState(false);

//   // State for Property Management Apartment forms
//   const [showPMApartActionPopup, setShowPMApartActionPopup] = useState(false);
//   const [showPMApartRentForm, setShowPMApartRentForm] = useState(false);
//   const [showPMApartSellForm, setShowPMApartSellForm] = useState(false);
//   const [showPMApartLeaseForm, setShowPMApartLeaseForm] = useState(false);

//   // State for Property Management Commercial forms
//   const [showPMComActionPopup, setShowPMComActionPopup] = useState(false);
//   const [showPMComRentForm, setShowPMComRentForm] = useState(false);
//   const [showPMComSellForm, setShowPMComSellForm] = useState(false);
//   const [showPMComLeaseForm, setShowPMComLeaseForm] = useState(false);

//   const [selectedRole, setSelectedRole] = useState("");
//   const [selectedPropertyType, setSelectedPropertyType] = useState("");

//   const [mobileDropdowns, setMobileDropdowns] = useState({
//     customer: false,
//     post: false,
//     loan: false,
//     services: false,
//     profile: false,
//     admin: false,
//     customerSub: {},
//     postSub: {}
//   });
  
//   const navigate = useNavigate();
//   const searchRef = useRef(null);

//   const customerPortalMenu = {
//     "Individual": ["Rent", "Buy", "Lease", "Sell"],
//     "Apartment": ["Rent", "Buy", "Lease", "Sell"],
//     "Commercial": ["Rent", "Buy", "Lease", "Sell"],
//     "Land & Plots": ["Rent", "Buy", "Lease", "Sell"],
//     "Hostel": ["Rent", "Buy", "Lease", "Sell"],
//   };

//   const postPropertyMenu = {
//     "Owner": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Agent": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Builder": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Property Management": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//   };

//   const loanMenu = [
//     "Home Loan",
//     "Property Loan",
//     "Construction Loan",
//     "Plot Loan",
//     "Commercial Loan"
//   ];

//   const servicesMenu = [
//     "Construction",
//     "Interior",
//     "Painting",
//     "Plumbing",
//     "Cleaning"
//   ];

//   const userMenuItems = [
//     { name: "👤 Profile", icon: <User className="w-4 h-4" /> },
//     { name: "⚙️ Settings", icon: <Settings className="w-4 h-4" /> },
//     { name: "❓ Help & Support", icon: <HelpCircle className="w-4 h-4" /> },
//     { name: "🚪 Logout", icon: <LogOut className="w-4 h-4" /> },
//   ];

//   const profileMenu = [
//     { label: "Owner", icon: "👤", path: "/profile/owner" },
//     { label: "Agent", icon: "🏢", path: "/profile/agent" },
//     { label: "Builder", icon: "🏗️", path: "/profile/builder" },
//     { label: "Property Management", icon: "🏢", path: "/profile/property-management" }
//   ];

//   const adminMenu = [
//     { 
//       label: "Admin", 
//       icon: <Users className="w-4 h-4" />, 
//       path: "/admin",
//       description: "Admin Panel"
//     },
//     { 
//       label: "Office", 
//       icon: <OfficeIcon className="w-4 h-4" />, 
//       path: "/office",
//       description: "Office Dashboard"
//     }
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setSearchOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ============ LAND & PLOTS HANDLERS (OWNER) ============
//   const handleLPActionClick = (action) => {
//     setShowLPActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowLPRentForm(true);
//         break;
//       case "Sell":
//         setShowLPSellForm(true);
//         break;
//       case "Lease":
//         setShowLPLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ LAND & PLOTS HANDLERS (AGENT) ============
//   const handleAgentLPActionClick = (action) => {
//     setShowAgentLPActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentLPRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentLPSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentLPLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ LAND & PLOTS HANDLERS (BUILDER) ============
//   const handleBuilderLPActionClick = (action) => {
//     setShowBuilderLPActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderLPRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderLPSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderLPLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ LAND & PLOTS HANDLERS (PROPERTY MANAGEMENT) ============
//   const handlePMLPActionClick = (action) => {
//     setShowPMLPActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMLPRentForm(true);
//         break;
//       case "Sell":
//         setShowPMLPSellForm(true);
//         break;
//       case "Lease":
//         setShowPMLPLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ HOSTEL HANDLERS (OWNER) ============
//   const handleHostelActionClick = (action) => {
//     setShowHostelActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowHostelRentForm(true);
//         break;
//       case "Sell":
//         setShowHostelSellForm(true);
//         break;
//       case "Lease":
//         setShowHostelLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ HOSTEL HANDLERS (AGENT) ============
//   const handleAgentHostelActionClick = (action) => {
//     setShowAgentHostelActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentHostelRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentHostelSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentHostelLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ HOSTEL HANDLERS (BUILDER) ============
//   const handleBuilderHostelActionClick = (action) => {
//     setShowBuilderHostelActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderHostelRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderHostelSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderHostelLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ HOSTEL HANDLERS (PROPERTY MANAGEMENT) ============
//   const handlePMHostelActionClick = (action) => {
//     setShowPMHostelActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMHostelRentForm(true);
//         break;
//       case "Sell":
//         setShowPMHostelSellForm(true);
//         break;
//       case "Lease":
//         setShowPMHostelLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Post Property submenu click
//   const handlePostSubmenuClick = (role, propertyType) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
//     setSelectedRole(role);
//     setSelectedPropertyType(propertyType);

//     // ============ LAND & PLOTS HANDLING ============
//     if (propertyType === "Land & Plots") {
//       if (role === "Owner") {
//         setShowLPActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentLPActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderLPActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMLPActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//       return;
//     }

//     // ============ HOSTEL HANDLING ============
//     if (propertyType === "Hostel") {
//       if (role === "Owner") {
//         setShowHostelActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentHostelActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderHostelActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMHostelActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//       return;
//     }

//     // Existing property type handling...
//     if (propertyType === "Individual") {
//       if (role === "Agent") {
//         setShowAgentActionPopup(true);
//       } else if (role === "Owner") {
//         setShowOwnerActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else if (propertyType === "Apartment") {
//       if (role === "Agent") {
//         setShowAgentApartActionPopup(true);
//       } else if (role === "Owner") {
//         setShowApartActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderApartActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMApartActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else if (propertyType === "Commercial") {
//       if (role === "Owner") {
//         setShowComActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentComActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderComActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMComActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else {
//       // Fallback
//       setShowRoleSelectionPopup(true);
//     }
//   };

//   const handleRoleSelect = (role) => {
//     setShowRoleSelectionPopup(false);
//     setSelectedRole(role);
    
//     // ============ LAND & PLOTS HANDLING ============
//     if (selectedPropertyType === "Land & Plots") {
//       if (role === "Owner") {
//         setShowLPActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentLPActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderLPActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMLPActionPopup(true);
//       }
//       return;
//     }

//     // ============ HOSTEL HANDLING ============
//     if (selectedPropertyType === "Hostel") {
//       if (role === "Owner") {
//         setShowHostelActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentHostelActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderHostelActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMHostelActionPopup(true);
//       }
//       return;
//     }

//     // Existing role handling...
//     if (selectedPropertyType === "Individual") {
//       if (role === "Owner") {
//         setShowOwnerActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMActionPopup(true);
//       }
//     } else if (selectedPropertyType === "Apartment") {
//       if (role === "Owner") {
//         setShowApartActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentApartActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderApartActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMApartActionPopup(true);
//       }
//     } else if (selectedPropertyType === "Commercial") {
//       if (role === "Owner") {
//         setShowComActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentComActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderComActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMComActionPopup(true);
//       }
//     }
//   };

//   // Handle Owner action button clicks (Rent, Sell, Lease)
//   const handleOwnerActionClick = (action) => {
//     setShowOwnerActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowOwnerRentForm(true);
//         break;
//       case "Sell":
//         setShowOwnerSellForm(true);
//         break;
//       case "Lease":
//         setShowOwnerLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Apartment action button clicks (Rent, Sell, Lease)
//   const handleApartActionClick = (action) => {
//     setShowApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowApartRentForm(true);
//         break;
//       case "Sell":
//         setShowApartSellForm(true);
//         break;
//       case "Lease":
//         setShowApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Commercial action button clicks (Rent, Sell, Lease)
//   const handleComActionClick = (action) => {
//     setShowComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowComRentForm(true);
//         break;
//       case "Sell":
//         setShowComSellForm(true);
//         break;
//       case "Lease":
//         setShowComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent action button clicks (Rent, Sell, Lease)
//   const handleAgentActionClick = (action) => {
//     setShowAgentActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent Apartment action button clicks (Rent, Sell, Lease)
//   const handleAgentApartActionClick = (action) => {
//     setShowAgentApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentApartRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentApartSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent Commercial action button clicks (Rent, Sell, Lease)
//   const handleAgentComActionClick = (action) => {
//     setShowAgentComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentComRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentComSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder action button clicks (Rent, Sell, Lease)
//   const handleBuilderActionClick = (action) => {
//     setShowBuilderActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder Apartment action button clicks (Rent, Sell, Lease)
//   const handleBuilderApartActionClick = (action) => {
//     setShowBuilderApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderApartRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderApartSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder Commercial action button clicks (Rent, Sell, Lease)
//   const handleBuilderComActionClick = (action) => {
//     setShowBuilderComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderComRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderComSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management action button clicks (Rent, Sell, Lease)
//   const handlePMActionClick = (action) => {
//     setShowPMActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMRentForm(true);
//         break;
//       case "Sell":
//         setShowPMSellForm(true);
//         break;
//       case "Lease":
//         setShowPMLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management Apartment action button clicks (Rent, Sell, Lease)
//   const handlePMApartActionClick = (action) => {
//     setShowPMApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMApartRentForm(true);
//         break;
//       case "Sell":
//         setShowPMApartSellForm(true);
//         break;
//       case "Lease":
//         setShowPMApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management Commercial action button clicks (Rent, Sell, Lease)
//   const handlePMComActionClick = (action) => {
//     setShowPMComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMComRentForm(true);
//         break;
//       case "Sell":
//         setShowPMComSellForm(true);
//         break;
//       case "Lease":
//         setShowPMComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleCustomerPortalClick = (type) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
    
//     const typeKey = type.toLowerCase().replace(/\s+/g, '-');
    
//     if (typeKey === "individual") {
//       navigate("/individual");
//     } else if (typeKey === "rent") {
//       navigate("/rent");
//     } else if (typeKey === "buy") {
//       navigate("/buy");
//     } else if (typeKey === "lease") {
//       navigate("/lease");
//     } else if (typeKey === "sell") {
//       navigate("/sell");
//     } else if (typeKey === "apartment") {
//       navigate("/apartment");
//     } else if (typeKey === "commercial") {
//       navigate("/commercial");
//     } else if (typeKey === "land-&-plots") {
//       navigate("/land-plots");
//     } else if (typeKey === "hostel") {
//       navigate("/hostel");
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchOpen(false);
//       setSearchQuery("");
//     }
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//     if (!mobileMenuOpen) {
//       setMobileDropdowns({
//         customer: false,
//         post: false,
//         loan: false,
//         services: false,
//         profile: false,
//         admin: false,
//         customerSub: {},
//         postSub: {}
//       });
//     }
//   };

//   const toggleMobileDropdown = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       [key]: !prev[key],
//       ...(key !== 'customerSub' && key !== 'postSub' && Object.keys(prev).reduce((acc, k) => {
//         if (k !== key && k !== 'customerSub' && k !== 'postSub') acc[k] = false;
//         return acc;
//       }, {}))
//     }));
//   };

//   const toggleCustomerSub = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       customerSub: {
//         ...prev.customerSub,
//         [key]: !prev.customerSub[key]
//       }
//     }));
//   };

//   const togglePostSub = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       postSub: {
//         ...prev.postSub,
//         [key]: !prev.postSub[key]
//       }
//     }));
//   };

//   return (
//     <>
//       <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         scrolled 
//           ? 'bg-gradient-to-r from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl shadow-2xl shadow-[#00695C]/20' 
//           : 'bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C]'
//       }`}>
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full animate-float-particle"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 width: `${Math.random() * 2 + 1}px`,
//                 height: `${Math.random() * 2 + 1}px`,
//                 background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${6 + Math.random() * 12}s`,
//               }}
//             />
//           ))}
          
//           <div className="absolute bottom-0 left-0 right-0 h-8">
//             <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent animate-wave-slow" />
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

//         <div className="h-[72px] md:h-[84px] w-full px-3 md:px-6 flex items-center relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03] animate-sweep" />
          
//           <div className="flex items-center justify-between w-full relative z-10">
//             <div className="flex items-center gap-2 md:gap-4">
//               <button
//                 onClick={toggleMobileMenu}
//                 className="md:hidden p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 group relative"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//                 <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
//               </button>

//               <div
//                 onClick={() => navigate("/")}
//                 className="cursor-pointer group relative"
//               >
//                 <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
//                 <div className="relative w-13 h-13 md:w-[76px] md:h-[76px] rounded-full overflow-hidden flex items-center justify-center">
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#004D40] to-[#00695C] opacity-80" />
//                   <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#26A69A]/20 to-transparent" />
//                   <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 via-transparent to-[#00FF88]/20 animate-spin-slow rounded-full" />
                  
//                   <img
//                     src={logo}
//                     alt="Eliteinova Properties Logo"
//                     className="w-11 h-11 md:w-[60px] md:h-[60px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
//                     style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
//                   />
//                 </div>
//               </div>

//               <div 
//                 onClick={() => navigate("/")} 
//                 className="cursor-pointer group relative"
//               >
//                 <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#00FF88]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
//                 <h1
//                   className="text-lg md:text-2xl lg:text-3xl font-light leading-tight relative tracking-wide"
//                   style={{
//                     fontFamily: "Pacifico, cursive",
//                     color: "#E8F5E9",
//                     textShadow: '0 2px 16px rgba(0, 229, 255, 0.2)',
//                     fontWeight: 150,
//                   }}
//                 >
//                   <span className="relative inline-block group-hover:scale-105 transition-transform duration-500">
//                     Eliteinova <span className="text-[0.75em]">Properties (Vendor to Customer)</span>
//                     <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00E5FF]/20 via-[#00FF88]/20 to-[#00E5FF]/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700" />
//                   </span>
//                 </h1>
                
//                 <p 
//                   className="text-[11px] md:text-sm lg:text-base font-light leading-tight mt-0 flex items-center gap-2"
//                   style={{
//                     fontFamily: "Pacifico, cursive",
//                     color: "#C8E6C9",
//                     fontWeight: 300,
//                   }}
//                 >
//                   <span className="relative whitespace-nowrap">
//                     No Brokerage
//                     <Sparkles className="absolute -right-5 -top-0.5 w-3 h-3 text-yellow-300 animate-sparkle-glow" />
//                   </span>
//                   <span className="text-[8px] md:text-[10px] bg-gradient-to-r from-[#00FF88]/20 to-[#00E5FF]/20 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-sm">
//                     ⭐ Trusted
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-1.5 md:gap-3">
//               <div ref={searchRef} className="relative">
//                 <button
//                   onClick={() => setSearchOpen(!searchOpen)}
//                   className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center relative group transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#00695C]/30"
//                   style={{
//                     background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
//                     boxShadow: '0 3px 12px rgba(0,105,92,0.2)',
//                   }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#00695C] via-[#26A69A] to-[#00695C] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full" />
//                   <Search className="w-5 h-5 text-[#00695C] group-hover:text-[#004D40] transition-colors duration-300" />
//                 </button>

//                 {searchOpen && (
//                   <div className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 border border-white/30 animate-dropdown">
//                     <form onSubmit={handleSearch} className="p-3">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
//                         <input
//                           type="text"
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           placeholder="Search properties..."
//                           className="w-full pl-9 pr-3 py-2 text-sm bg-[#E8F5E9]/50 rounded-lg border border-[#26A69A]/20 focus:outline-none focus:ring-2 focus:ring-[#26A69A]/40 focus:border-transparent text-gray-800 placeholder-gray-500"
//                           autoFocus
//                         />
//                       </div>
//                       <div className="mt-2 flex gap-1.5 flex-wrap">
//                         <button
//                           type="button"
//                           onClick={() => setSearchQuery("Mumbai")}
//                           className="text-[10px] bg-gradient-to-r from-[#26A69A]/10 to-[#00695C]/10 hover:from-[#26A69A]/20 hover:to-[#00695C]/20 text-[#00695C] px-2 py-1 rounded-lg transition-all duration-300"
//                         >
//                           🏙️ Mumbai
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => setSearchQuery("Bangalore")}
//                           className="text-[10px] bg-gradient-to-r from-[#26A69A]/10 to-[#00695C]/10 hover:from-[#26A69A]/20 hover:to-[#00695C]/20 text-[#00695C] px-2 py-1 rounded-lg transition-all duration-300"
//                         >
//                           🏡 Bangalore
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => setSearchQuery("Commercial")}
//                           className="text-[10px] bg-gradient-to-r from-[#26A69A]/10 to-[#00695C]/10 hover:from-[#26A69A]/20 hover:to-[#00695C]/20 text-[#00695C] px-2 py-1 rounded-lg transition-all duration-300"
//                         >
//                           🏪 Commercial
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}
//               </div>

//               <button className="relative group">
//                 <div className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center relative transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30"
//                   style={{
//                     background: 'linear-gradient(135deg, #FFEB3B, #FF9800)',
//                     boxShadow: '0 3px 12px rgba(255,152,0,0.2)',
//                   }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full" />
//                   <Bell className="w-5 h-5 text-[#E65100] group-hover:text-[#BF360C] transition-colors duration-300" />
//                 </div>
//                 {notificationCount > 0 && (
//                   <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-ring">
//                     <span className="text-white text-[8px] font-bold">{notificationCount}</span>
//                   </div>
//                 )}
//               </button>

//               <div className="relative">
//                 <button 
//                   onClick={() => setUserMenuOpen(!userMenuOpen)}
//                   className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center relative group transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#00695C]/30"
//                   style={{
//                     background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
//                     boxShadow: '0 3px 12px rgba(0,105,92,0.2)',
//                   }}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#00695C] via-[#26A69A] to-[#00695C] opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full" />
//                   <div className="absolute -inset-0.5 rounded-full border border-white/20 animate-spin-slow" />
                  
//                   <User className="w-5 h-5 md:w-6 md:h-6 text-[#00695C] group-hover:text-[#004D40] transition-colors duration-300 relative z-10" />
                  
//                   <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse border-2 border-white" />
//                 </button>

//                 {userMenuOpen && (
//                   <div className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 border border-white/30 animate-dropdown">
//                     <div className="p-3 border-b border-[#E8F5E9]">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-md">
//                           <User className="w-4 h-4 text-white" />
//                         </div>
//                         <div>
//                           <p className="font-semibold text-sm text-gray-800">John Doe</p>
//                           <p className="text-[8px] text-[#26A69A] font-medium">⭐ Premium</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-1.5">
//                       {userMenuItems.map((item, index) => (
//                         <button
//                           key={item.name}
//                           className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 rounded-lg animate-slide-item"
//                           style={{ animationDelay: `${index * 50}ms` }}
//                           onClick={() => {
//                             setUserMenuOpen(false);
//                             if (item.name === "🚪 Logout") {
//                               // Handle logout
//                             } else {
//                               navigate(`/${item.name.toLowerCase().replace(/[👤⚙️❓🚪]/g, '').trim()}`);
//                             }
//                           }}
//                         >
//                           <span className="text-[#26A69A]">{item.icon}</span>
//                           <span>{item.name}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <nav className="hidden md:flex h-12 items-center relative bg-gradient-to-r from-[#004D40]/90 via-[#00796B]/90 to-[#004D40]/90 backdrop-blur-sm border-t border-white/5">
//           <div className="absolute inset-0 opacity-[0.03]">
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow" />
//           </div>
          
//           <div className="flex items-center h-full relative z-10">
//             <button
//               onClick={() => {
//                 navigate("/");
//                 setActiveTab("home");
//               }}
//               className={`group relative px-5 h-full text-white font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden ${
//                 activeTab === "home" 
//                   ? 'bg-gradient-to-r from-white/10 to-transparent' 
//                   : 'hover:bg-white/5'
//               }`}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
//               <span className="flex items-center gap-2 relative z-10">
//                 <Home className="w-4 h-4" />
//                 Home
//               </span>
              
//               {activeTab === "home" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse-glow" />
//               )}
//             </button>

//             <div
//               className="relative h-full"
//               onMouseEnter={() => setActiveDropdown("customer")}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button 
//                 onClick={() => navigate("/customer-portal")}
//                 className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
//               >
//                 <Building className="w-4 h-4" />
//                 <span>Customer Portal</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "customer" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "customer" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
//                   {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                     <div key={key} className="relative group/item">
//                       <button 
//                         onClick={() => handleCustomerPortalClick(key)}
//                         className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 capitalize"
//                       >
//                         {key}
//                       </button>
//                       <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[160px] z-50 border border-white/30 animate-dropdown-nested">
//                         {submenu.map((item) => (
//                           <button
//                             key={item}
//                             onClick={() => handleCustomerPortalClick(item.toLowerCase())}
//                             className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                           >
//                             {item}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div
//               className="relative h-full"
//               onMouseEnter={() => setActiveDropdown("post")}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button
//                 onClick={() => navigate("/post-property")}
//                 className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 <span>Post Property</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "post" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "post" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[190px] border border-white/30 animate-dropdown">
//                   {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                     <div key={role} className="relative group/item">
//                       <button
//                         className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 flex items-center justify-between gap-3"
//                       >
//                         {role}
//                         <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-gray-400" />
//                       </button>
//                       <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[170px] z-50 border border-white/30 animate-dropdown-nested">
//                         {submenu.map((propertyType) => (
//                           <button
//                             key={propertyType}
//                             onClick={() => handlePostSubmenuClick(role, propertyType)}
//                             className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                           >
//                             {propertyType}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div
//               className="relative h-full"
//               onMouseEnter={() => setActiveDropdown("loan")}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
//                 <Landmark className="w-4 h-4" />
//                 <span>Find Loan</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "loan" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "loan" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
//                   {loanMenu.map((item) => (
//                     <button
//                       key={item}
//                       className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div
//               className="relative h-full"
//               onMouseEnter={() => setActiveDropdown("services")}
//               onMouseLeave={() => setActiveDropdown(null)}
//             >
//               <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
//                 <Settings className="w-4 h-4" />
//                 <span>Services</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "services" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "services" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[160px] border border-white/30 animate-dropdown">
//                   {servicesMenu.map((item) => (
//                     <button
//                       key={item}
//                       className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div> 
//         </nav>
//       </header>

//       {/* ============ ROLE SELECTION POPUP ============ */}
//       {showRoleSelectionPopup && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowRoleSelectionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Select Role
//               </h2>
//               <button 
//                 onClick={() => setShowRoleSelectionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedPropertyType} Property: Who is listing this property?
//             </p>

//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 onClick={() => handleRoleSelect("Owner")}
//                 className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">👤</div>
//                 <div className="font-bold text-emerald-700 group-hover:text-emerald-900">Owner</div>
//                 <div className="text-[10px] text-gray-500">Individual owner</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Agent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Agent</div>
//                 <div className="text-[10px] text-gray-500">Professional agent</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Builder")}
//                 className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏗️</div>
//                 <div className="font-bold text-amber-700 group-hover:text-amber-900">Builder</div>
//                 <div className="text-[10px] text-gray-500">Builder/Developer</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Property Management")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Property Management</div>
//                 <div className="text-[10px] text-gray-500">Property management company</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ OWNER INDIVIDUAL ACTION POPUP ============ */}
//       {showOwnerActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowOwnerActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Owner - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowOwnerActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleOwnerActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleOwnerActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleOwnerActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ OWNER APARTMENT ACTION POPUP ============ */}
//       {showApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ OWNER COMMERCIAL ACTION POPUP ============ */}
//       {showComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ LAND & PLOTS ACTION POPUP (OWNER) ============ */}
//       {showLPActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowLPActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Land & Plots Action
//               </h2>
//               <button 
//                 onClick={() => setShowLPActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Land & Plots Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleLPActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏞️</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleLPActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleLPActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ LAND & PLOTS ACTION POPUP (AGENT) ============ */}
//       {showAgentLPActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentLPActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Land & Plots Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentLPActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Land & Plots Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentLPActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏞️</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentLPActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentLPActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ LAND & PLOTS ACTION POPUP (BUILDER) ============ */}
//       {showBuilderLPActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderLPActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Land & Plots Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderLPActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Land & Plots Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderLPActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏞️</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderLPActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderLPActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ LAND & PLOTS ACTION POPUP (PROPERTY MANAGEMENT) ============ */}
//       {showPMLPActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMLPActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Land & Plots Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMLPActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Land & Plots Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMLPActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏞️</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMLPActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMLPActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ HOSTEL ACTION POPUP (OWNER) ============ */}
//       {showHostelActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowHostelActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Hostel Action
//               </h2>
//               <button 
//                 onClick={() => setShowHostelActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Hostel Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleHostelActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏨</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleHostelActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleHostelActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ HOSTEL ACTION POPUP (AGENT) ============ */}
//       {showAgentHostelActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentHostelActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Hostel Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentHostelActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Hostel Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentHostelActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏨</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentHostelActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentHostelActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ HOSTEL ACTION POPUP (BUILDER) ============ */}
//       {showBuilderHostelActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderHostelActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Hostel Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderHostelActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Hostel Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderHostelActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏨</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderHostelActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderHostelActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ HOSTEL ACTION POPUP (PROPERTY MANAGEMENT) ============ */}
//       {showPMHostelActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMHostelActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Hostel Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMHostelActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Hostel Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMHostelActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏨</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMHostelActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMHostelActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ AGENT INDIVIDUAL ACTION POPUP ============ */}
//       {showAgentActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ AGENT APARTMENT ACTION POPUP ============ */}
//       {showAgentApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ AGENT COMMERCIAL ACTION POPUP ============ */}
//       {showAgentComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ BUILDER INDIVIDUAL ACTION POPUP ============ */}
//       {showBuilderActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ BUILDER APARTMENT ACTION POPUP ============ */}
//       {showBuilderApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ BUILDER COMMERCIAL ACTION POPUP ============ */}
//       {showBuilderComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ PROPERTY MANAGEMENT INDIVIDUAL ACTION POPUP ============ */}
//       {showPMActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ PROPERTY MANAGEMENT APARTMENT ACTION POPUP ============ */}
//       {showPMApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ PROPERTY MANAGEMENT COMMERCIAL ACTION POPUP ============ */}
//       {showPMComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ RENDER ALL FORMS ============ */}
      
//       {/* Owner Forms */}
//       <IndRentForm isOpen={showOwnerRentForm} onClose={() => setShowOwnerRentForm(false)} />
//       <IndSellForm isOpen={showOwnerSellForm} onClose={() => setShowOwnerSellForm(false)} />
//       <IndLeaseForm isOpen={showOwnerLeaseForm} onClose={() => setShowOwnerLeaseForm(false)} />

//       <ApartRentForm isOpen={showApartRentForm} onClose={() => setShowApartRentForm(false)} />
//       <ApartSellForm isOpen={showApartSellForm} onClose={() => setShowApartSellForm(false)} />
//       <ApartLeaseForm isOpen={showApartLeaseForm} onClose={() => setShowApartLeaseForm(false)} />

//       <ComRentForm isOpen={showComRentForm} onClose={() => setShowComRentForm(false)} />
//       <ComSellForm isOpen={showComSellForm} onClose={() => setShowComSellForm(false)} />
//       <ComLeaseForm isOpen={showComLeaseForm} onClose={() => setShowComLeaseForm(false)} />

//       {/* ============ LAND & PLOTS FORMS (OWNER) ============ */}
//       <RentLPForm isOpen={showLPRentForm} onClose={() => setShowLPRentForm(false)} />
//       <SellLPForm isOpen={showLPSellForm} onClose={() => setShowLPSellForm(false)} />
//       <LeaseLPForm isOpen={showLPLeaseForm} onClose={() => setShowLPLeaseForm(false)} />

//       {/* ============ LAND & PLOTS FORMS (AGENT) ============ */}
//       <RentAgentLPForm isOpen={showAgentLPRentForm} onClose={() => setShowAgentLPRentForm(false)} />
//       <SellAgentLPForm isOpen={showAgentLPSellForm} onClose={() => setShowAgentLPSellForm(false)} />
//       <LeaseAgentLPForm isOpen={showAgentLPLeaseForm} onClose={() => setShowAgentLPLeaseForm(false)} />

//       {/* ============ LAND & PLOTS FORMS (BUILDER) ============ */}
//       <RentBuilderLPForm isOpen={showBuilderLPRentForm} onClose={() => setShowBuilderLPRentForm(false)} />
//       <SellBuilderLPForm isOpen={showBuilderLPSellForm} onClose={() => setShowBuilderLPSellForm(false)} />
//       <LeaseBuilderLPForm isOpen={showBuilderLPLeaseForm} onClose={() => setShowBuilderLPLeaseForm(false)} />

//       {/* ============ LAND & PLOTS FORMS (PROPERTY MANAGEMENT) ============ */}
//       <RentPMLPForm isOpen={showPMLPRentForm} onClose={() => setShowPMLPRentForm(false)} />
//       <SellPMLPForm isOpen={showPMLPSellForm} onClose={() => setShowPMLPSellForm(false)} />
//       <LeasePMLPForm isOpen={showPMLPLeaseForm} onClose={() => setShowPMLPLeaseForm(false)} />

//       {/* ============ HOSTEL FORMS (OWNER) ============ */}
//       <HostelRentForm isOpen={showHostelRentForm} onClose={() => setShowHostelRentForm(false)} />
//       <HostelSellForm isOpen={showHostelSellForm} onClose={() => setShowHostelSellForm(false)} />
//       <HostelLeaseForm isOpen={showHostelLeaseForm} onClose={() => setShowHostelLeaseForm(false)} />

//       {/* ============ HOSTEL FORMS (AGENT) ============ */}
//       <RentAgentHostelForm isOpen={showAgentHostelRentForm} onClose={() => setShowAgentHostelRentForm(false)} />
//       <SellAgentHostelForm isOpen={showAgentHostelSellForm} onClose={() => setShowAgentHostelSellForm(false)} />
//       <LeaseAgentHostelForm isOpen={showAgentHostelLeaseForm} onClose={() => setShowAgentHostelLeaseForm(false)} />

//       {/* ============ HOSTEL FORMS (BUILDER) ============ */}
//       <RentBuilderHostelForm isOpen={showBuilderHostelRentForm} onClose={() => setShowBuilderHostelRentForm(false)} />
//       <SellBuilderHostelForm isOpen={showBuilderHostelSellForm} onClose={() => setShowBuilderHostelSellForm(false)} />
//       <LeaseBuilderHostelForm isOpen={showBuilderHostelLeaseForm} onClose={() => setShowBuilderHostelLeaseForm(false)} />

//       {/* ============ HOSTEL FORMS (PROPERTY MANAGEMENT) ============ */}
//       <RentPMHostelForm isOpen={showPMHostelRentForm} onClose={() => setShowPMHostelRentForm(false)} />
//       <SellPMHostelForm isOpen={showPMHostelSellForm} onClose={() => setShowPMHostelSellForm(false)} />
//       <LeasePMHostelForm isOpen={showPMHostelLeaseForm} onClose={() => setShowPMHostelLeaseForm(false)} />

//       {/* Agent Forms */}
//       <RentAgentIndForm isOpen={showAgentRentForm} onClose={() => setShowAgentRentForm(false)} />
//       <SellAgentIndForm isOpen={showAgentSellForm} onClose={() => setShowAgentSellForm(false)} />
//       <LeaseAgentIndForm isOpen={showAgentLeaseForm} onClose={() => setShowAgentLeaseForm(false)} />

//       <RentAgentApartForm isOpen={showAgentApartRentForm} onClose={() => setShowAgentApartRentForm(false)} />
//       <SellAgentApartForm isOpen={showAgentApartSellForm} onClose={() => setShowAgentApartSellForm(false)} />
//       <LeaseAgentApartForm isOpen={showAgentApartLeaseForm} onClose={() => setShowAgentApartLeaseForm(false)} />

//       <RentAgentComForm isOpen={showAgentComRentForm} onClose={() => setShowAgentComRentForm(false)} />
//       <SellAgentComForm isOpen={showAgentComSellForm} onClose={() => setShowAgentComSellForm(false)} />
//       <LeaseAgentComForm isOpen={showAgentComLeaseForm} onClose={() => setShowAgentComLeaseForm(false)} />

//       {/* Builder Forms */}
//       <RentBuilderIndForm isOpen={showBuilderRentForm} onClose={() => setShowBuilderRentForm(false)} />
//       <SellBuilderIndForm isOpen={showBuilderSellForm} onClose={() => setShowBuilderSellForm(false)} />
//       <LeaseBuilderIndForm isOpen={showBuilderLeaseForm} onClose={() => setShowBuilderLeaseForm(false)} />

//       <RentBuilderApartForm isOpen={showBuilderApartRentForm} onClose={() => setShowBuilderApartRentForm(false)} />
//       <SellBuilderApartForm isOpen={showBuilderApartSellForm} onClose={() => setShowBuilderApartSellForm(false)} />
//       <LeaseBuilderApartForm isOpen={showBuilderApartLeaseForm} onClose={() => setShowBuilderApartLeaseForm(false)} />

//       <RentBuilderComForm isOpen={showBuilderComRentForm} onClose={() => setShowBuilderComRentForm(false)} />
//       <SellBuilderComForm isOpen={showBuilderComSellForm} onClose={() => setShowBuilderComSellForm(false)} />
//       <LeaseBuilderComForm isOpen={showBuilderComLeaseForm} onClose={() => setShowBuilderComLeaseForm(false)} />

//       {/* Property Management Forms */}
//       <RentPMIndForm isOpen={showPMRentForm} onClose={() => setShowPMRentForm(false)} />
//       <SellPMIndForm isOpen={showPMSellForm} onClose={() => setShowPMSellForm(false)} />
//       <LeasePMIndForm isOpen={showPMLeaseForm} onClose={() => setShowPMLeaseForm(false)} />

//       <RentPMApartForm isOpen={showPMApartRentForm} onClose={() => setShowPMApartRentForm(false)} />
//       <SellPMApartForm isOpen={showPMApartSellForm} onClose={() => setShowPMApartSellForm(false)} />
//       <LeasePMApartForm isOpen={showPMApartLeaseForm} onClose={() => setShowPMApartLeaseForm(false)} />

//       <RentPMComForm isOpen={showPMComRentForm} onClose={() => setShowPMComRentForm(false)} />
//       <SellPMComForm isOpen={showPMComSellForm} onClose={() => setShowPMComSellForm(false)} />
//       <LeasePMComForm isOpen={showPMComLeaseForm} onClose={() => setShowPMComLeaseForm(false)} />

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div 
//           className="md:hidden fixed inset-0 z-50 animate-fade"
//           onClick={toggleMobileMenu}
//         >
//           <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl animate-backdrop" />
          
//           <div 
//             className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#00695C] to-[#26A69A] shadow-2xl shadow-[#00695C]/50 overflow-y-auto animate-slide"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between p-4 border-b border-white/10">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
//                   <Menu className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-white font-bold text-sm">Menu</h2>
//                   <p className="text-white/50 text-[10px]">Welcome back!</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={toggleMobileMenu} 
//                 className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
//               >
//                 <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
//               </button>
//             </div>
            
//             {/* Admin Section in Mobile */}
//             <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '0ms' }}>
//               <div 
//                 className="flex items-center gap-3 cursor-pointer"
//                 onClick={() => toggleMobileDropdown('admin')}
//               >
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30">
//                   <MenuIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-white font-semibold text-sm">Admin Panel</p>
//                   <p className="text-white/60 text-xs">Manage admin & office</p>
//                 </div>
//                 <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.admin ? 'rotate-180' : ''}`} />
//               </div>
              
//               {mobileDropdowns.admin && (
//                 <div className="mt-2 space-y-1 pl-3">
//                   {adminMenu.map((item, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         handleAdminNavigation(item.path);
//                         toggleMobileMenu();
//                       }}
//                       className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
//                     >
//                       <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center text-[#00695C]">
//                         {item.icon}
//                       </div>
//                       <div className="flex flex-col items-start flex-1">
//                         <span className="text-white text-sm font-medium">{item.label}</span>
//                         <span className="text-white/50 text-[10px]">{item.description}</span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             {/* Profile Section in Mobile */}
//             <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '50ms' }}>
//               <div 
//                 className="flex items-center gap-3 cursor-pointer"
//                 onClick={() => toggleMobileDropdown('profile')}
//               >
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-white font-semibold text-sm">Profile</p>
//                   <p className="text-white/60 text-xs">Select your role</p>
//                 </div>
//                 <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.profile ? 'rotate-180' : ''}`} />
//               </div>
              
//               {mobileDropdowns.profile && (
//                 <div className="mt-2 space-y-1 pl-3">
//                   {profileMenu.map((item, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         handleProfileNavigation(item.path);
//                         toggleMobileMenu();
//                       }}
//                       className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
//                     >
//                       <span className="text-xl">{item.icon}</span>
//                       <span className="text-white text-sm font-medium">{item.label}</span>
//                     </button>
//                   ))}
                  
//                   <button
//                     onClick={() => {
//                       navigate("/logout");
//                       toggleMobileMenu();
//                     }}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 mt-1"
//                   >
//                     <LogOut className="w-4 h-4 text-red-400" />
//                     <span className="text-red-400 text-sm font-medium">Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
            
//             <div className="px-4 pb-32">
//               <button 
//                 onClick={() => {
//                   navigate('/');
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '100ms' }}
//               >
//                 🏠 Home
//               </button>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '150ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('customer')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🏢 Customer Portal</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.customer ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.customer && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                       <div key={key} className="border-l border-white/10 pl-3">
//                         <div 
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => toggleCustomerSub(key)}
//                         >
//                           <span className="text-white/90 text-sm capitalize">{key}</span>
//                           <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.customerSub[key] ? 'rotate-180' : ''}`} />
//                         </div>
                        
//                         {mobileDropdowns.customerSub[key] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((item) => (
//                               <button 
//                                 key={item} 
//                                 onClick={() => {
//                                   handleCustomerPortalClick(item.toLowerCase());
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {item}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '200ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('post')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">📊 Post Property</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.post ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.post && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                       <div key={role} className="border-l border-white/10 pl-3">
//                         <div
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => togglePostSub(role)}
//                         >
//                           <span className="text-white/90 text-sm">{role}</span>
//                           <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform duration-300 ${mobileDropdowns.postSub[role] ? 'rotate-180' : ''}`} />
//                         </div>

//                         {mobileDropdowns.postSub[role] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((propertyType) => (
//                               <button
//                                 key={propertyType}
//                                 onClick={() => {
//                                   handlePostSubmenuClick(role, propertyType);
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {propertyType}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '250ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('loan')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">💰 Find Loan</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.loan ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.loan && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {loanMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '300ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('services')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🛠️ Services</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.services ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.services && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {servicesMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div 
//             className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#00695C] to-[#26A69A] shadow-2xl shadow-[#00695C]/50 overflow-y-auto animate-slide"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between p-4 border-b border-white/10">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
//                   <Menu className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-white font-bold text-sm">Menu</h2>
//                   <p className="text-white/50 text-[10px]">Welcome back!</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={toggleMobileMenu} 
//                 className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
//               >
//                 <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
//               </button>
//             </div>
            
//             <div className="p-4">
//               <form onSubmit={handleSearch} className="mb-3">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search..."
//                     className="w-full pl-9 pr-3 py-2 text-sm bg-white/10 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-white/40"
//                   />
//                 </div>
//               </form>
//             </div>
            
//             <div className="px-4 pb-32">
//               <button 
//                 onClick={() => {
//                   navigate('/');
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '0ms' }}
//               >
//                 🏠 Home
//               </button>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '50ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('customer')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🏢 Customer Portal</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.customer ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.customer && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                       <div key={key} className="border-l border-white/10 pl-3">
//                         <div 
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => toggleCustomerSub(key)}
//                         >
//                           <span className="text-white/90 text-sm capitalize">{key}</span>
//                           <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.customerSub[key] ? 'rotate-180' : ''}`} />
//                         </div>
                        
//                         {mobileDropdowns.customerSub[key] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((item) => (
//                               <button 
//                                 key={item} 
//                                 onClick={() => {
//                                   handleCustomerPortalClick(item.toLowerCase());
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {item}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '100ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('post')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">📊 Post Property</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.post ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.post && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                       <div key={role} className="border-l border-white/10 pl-3">
//                         <div
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => togglePostSub(role)}
//                         >
//                           <span className="text-white/90 text-sm">{role}</span>
//                           <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.postSub[role] ? 'rotate-180' : ''}`} />
//                         </div>

//                         {mobileDropdowns.postSub[role] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((propertyType) => (
//                               <button
//                                 key={propertyType}
//                                 onClick={() => {
//                                   handlePostSubmenuClick(role, propertyType);
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {propertyType}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '150ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('loan')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">💰 Find Loan</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.loan ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.loan && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {loanMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '200ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('services')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🛠️ Services</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.services ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.services && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {servicesMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={() => {
//                   navigate("/profile");
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '250ms' }}
//               >
//                 👤 Profile
//               </button>

//               <button
//                 onClick={() => {
//                   navigate("/notifications");
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '300ms' }}
//               >
//                 🔔 Notifications
//               </button>

//               <button
//                 onClick={() => {
//                   navigate("/help");
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 text-sm animate-slide-item"
//                 style={{ animationDelay: '350ms' }}
//               >
//                 ❓ Help
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

      

//       <style>{`
//         @keyframes float-particle {
//           0%, 100% { 
//             transform: translateY(0) translateX(0) rotate(0deg); 
//             opacity: 0.2;
//           }
//           25% { 
//             transform: translateY(-20px) translateX(15px) rotate(90deg); 
//             opacity: 0.5;
//           }
//           50% { 
//             transform: translateY(-12px) translateX(-12px) rotate(180deg); 
//             opacity: 0.7;
//           }
//           75% { 
//             transform: translateY(12px) translateX(18px) rotate(270deg); 
//             opacity: 0.3;
//           }
//         }
//         .animate-float-particle {
//           animation: float-particle 10s ease-in-out infinite;
//         }

//         @keyframes wave-slow {
//           0% { transform: translateX(0) scaleY(1); }
//           50% { transform: translateX(40px) scaleY(1.2); }
//           100% { transform: translateX(80px) scaleY(1); }
//         }
//         .animate-wave-slow {
//           animation: wave-slow 8s ease-in-out infinite;
//         }

//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s linear infinite;
//         }

//         @keyframes shimmer-slow {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer-slow {
//           animation: shimmer-slow 8s linear infinite;
//         }

//         @keyframes sweep {
//           0%, 100% { 
//             background-position: 0% 50%; 
//             opacity: 0.3;
//           }
//           50% { 
//             background-position: 100% 50%; 
//             opacity: 0.6;
//           }
//         }
//         .animate-sweep {
//           background-size: 200% 200%;
//           animation: sweep 4s ease infinite;
//         }

//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-spin-slow {
//           animation: spin-slow 6s linear infinite;
//         }

//         @keyframes sparkle-glow {
//           0%, 100% { 
//             opacity: 0.3;
//             transform: scale(0.8) rotate(0deg);
//           }
//           50% { 
//             opacity: 1;
//             transform: scale(1.2) rotate(180deg);
//           }
//         }
//         .animate-sparkle-glow {
//           animation: sparkle-glow 2s ease-in-out infinite;
//         }

//         @keyframes pulse-ring {
//           0%, 100% {
//             transform: scale(1);
//             box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
//           }
//           50% {
//             transform: scale(1.1);
//             box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
//           }
//         }
//         .animate-pulse-ring {
//           animation: pulse-ring 1.5s ease-out infinite;
//         }

//         @keyframes pulse-glow {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.7; }
//         }
//         .animate-pulse-glow {
//           animation: pulse-glow 1.5s ease-in-out infinite;
//         }

//         @keyframes dropdown {
//           from {
//             opacity: 0;
//             transform: translateY(-6px) scale(0.96);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//         .animate-dropdown {
//           animation: dropdown 0.2s ease-out forwards;
//         }

//         @keyframes dropdown-nested {
//           from {
//             opacity: 0;
//             transform: translateX(-6px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-dropdown-nested {
//           animation: dropdown-nested 0.15s ease-out forwards;
//         }

//         @keyframes slide-item {
//           from {
//             opacity: 0;
//             transform: translateX(12px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-slide-item {
//           animation: slide-item 0.3s ease-out forwards;
//         }

//         @keyframes fade {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade {
//           animation: fade 0.25s ease-out forwards;
//         }

//         @keyframes backdrop {
//           from {
//             backdrop-filter: blur(0);
//             opacity: 0;
//           }
//           to {
//             backdrop-filter: blur(10px);
//             opacity: 1;
//           }
//         }
//         .animate-backdrop {
//           animation: backdrop 0.25s ease-out forwards;
//         }

//         @keyframes slide {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide {
//           animation: slide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Header;


































// import React, { useState, useEffect, useRef } from "react";
// import { 
//   User, Menu, ChevronDown, X, Sparkles, Bell, Search, HelpCircle, 
//   Settings, LogOut, Home, Building, Landmark, TrendingUp, Shield, 
//   DollarSign, Wrench, PaintBucket, Droplets, Heart, Star, Zap, 
//   CheckCircle, Award, MapPin, Globe, Phone, Mail, Calendar, Clock, 
//   Briefcase, Users, Briefcase as OfficeIcon, Menu as MenuIcon 
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import logo from "../../assets/logo1.png";

// // Import Owner Forms
// import { 
//   IndRentForm, IndSellForm, IndLeaseForm,
//   ApartRentForm, ApartSellForm, ApartLeaseForm,
//   ComRentForm, ComSellForm, ComLeaseForm,
//   RentLPForm, SellLPForm, LeaseLPForm,
//   HostelRentForm, HostelSellForm, HostelLeaseForm 
// } from "../Forms/Owner/Index.js";

// // Import Agent Forms
// import { 
//   RentAgentIndForm, SellAgentIndForm, LeaseAgentIndForm,
//   RentAgentApartForm, SellAgentApartForm, LeaseAgentApartForm,
//   RentAgentComForm, SellAgentComForm, LeaseAgentComForm,
//   RentAgentLPForm, SellAgentLPForm, LeaseAgentLPForm,
//   RentAgentHostelForm, SellAgentHostelForm, LeaseAgentHostelForm 
// } from "../Forms/Agent/Index.js";

// // Import Builder Forms
// import { 
//   RentBuilderIndForm, SellBuilderIndForm, LeaseBuilderIndForm,
//   RentBuilderApartForm, SellBuilderApartForm, LeaseBuilderApartForm,
//   RentBuilderComForm, SellBuilderComForm, LeaseBuilderComForm,
//   RentBuilderLPForm, SellBuilderLPForm, LeaseBuilderLPForm,
//   RentBuilderHostelForm, SellBuilderHostelForm, LeaseBuilderHostelForm 
// } from "../Forms/Builder/Index.js";

// // Import Property Management Forms
// import { 
//   RentPMIndForm, SellPMIndForm, LeasePMIndForm,
//   RentPMApartForm, SellPMApartForm, LeasePMApartForm,
//   RentPMComForm, SellPMComForm, LeasePMComForm,
//   RentPMLPForm, SellPMLPForm, LeasePMLPForm,
//   RentPMHostelForm, SellPMHostelForm, LeasePMHostelForm 
// } from "../Forms/PropertyManagement/Index.js";

// // Storage utility (you'll need to implement this or import from your existing utils)
// const storage = {
//   get: (key) => {
//     try {
//       return localStorage.getItem(key);
//     } catch (error) {
//       console.error('Error reading from storage:', error);
//       return null;
//     }
//   }
// };

// const Header = ({ onPostPropertyClick }) => {
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(3);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("home");
//   const [userData, setUserData] = useState(null);
//   const [userRole, setUserRole] = useState(null);
  
//   // State for Role Selection
//   const [showRoleSelectionPopup, setShowRoleSelectionPopup] = useState(false);
  
//   // State for Owner forms
//   const [showOwnerActionPopup, setShowOwnerActionPopup] = useState(false);
//   const [showOwnerRentForm, setShowOwnerRentForm] = useState(false);
//   const [showOwnerSellForm, setShowOwnerSellForm] = useState(false);
//   const [showOwnerLeaseForm, setShowOwnerLeaseForm] = useState(false);

//   // State for Apartment forms (Owner)
//   const [showApartActionPopup, setShowApartActionPopup] = useState(false);
//   const [showApartRentForm, setShowApartRentForm] = useState(false);
//   const [showApartSellForm, setShowApartSellForm] = useState(false);
//   const [showApartLeaseForm, setShowApartLeaseForm] = useState(false);

//   // State for Commercial forms (Owner)
//   const [showComActionPopup, setShowComActionPopup] = useState(false);
//   const [showComRentForm, setShowComRentForm] = useState(false);
//   const [showComSellForm, setShowComSellForm] = useState(false);
//   const [showComLeaseForm, setShowComLeaseForm] = useState(false);

//   // Land & Plots FORM STATES
//   const [showLPActionPopup, setShowLPActionPopup] = useState(false);
//   const [showLPRentForm, setShowLPRentForm] = useState(false);
//   const [showLPSellForm, setShowLPSellForm] = useState(false);
//   const [showLPLeaseForm, setShowLPLeaseForm] = useState(false);

//   // Hostel FORM STATES
//   const [showHostelActionPopup, setShowHostelActionPopup] = useState(false);
//   const [showHostelRentForm, setShowHostelRentForm] = useState(false);
//   const [showHostelSellForm, setShowHostelSellForm] = useState(false);
//   const [showHostelLeaseForm, setShowHostelLeaseForm] = useState(false);

//   // Agent Land & Plots
//   const [showAgentLPActionPopup, setShowAgentLPActionPopup] = useState(false);
//   const [showAgentLPRentForm, setShowAgentLPRentForm] = useState(false);
//   const [showAgentLPSellForm, setShowAgentLPSellForm] = useState(false);
//   const [showAgentLPLeaseForm, setShowAgentLPLeaseForm] = useState(false);

//   // Agent Hostel
//   const [showAgentHostelActionPopup, setShowAgentHostelActionPopup] = useState(false);
//   const [showAgentHostelRentForm, setShowAgentHostelRentForm] = useState(false);
//   const [showAgentHostelSellForm, setShowAgentHostelSellForm] = useState(false);
//   const [showAgentHostelLeaseForm, setShowAgentHostelLeaseForm] = useState(false);

//   // Builder Land & Plots
//   const [showBuilderLPActionPopup, setShowBuilderLPActionPopup] = useState(false);
//   const [showBuilderLPRentForm, setShowBuilderLPRentForm] = useState(false);
//   const [showBuilderLPSellForm, setShowBuilderLPSellForm] = useState(false);
//   const [showBuilderLPLeaseForm, setShowBuilderLPLeaseForm] = useState(false);

//   // Builder Hostel
//   const [showBuilderHostelActionPopup, setShowBuilderHostelActionPopup] = useState(false);
//   const [showBuilderHostelRentForm, setShowBuilderHostelRentForm] = useState(false);
//   const [showBuilderHostelSellForm, setShowBuilderHostelSellForm] = useState(false);
//   const [showBuilderHostelLeaseForm, setShowBuilderHostelLeaseForm] = useState(false);

//   // Property Management Land & Plots
//   const [showPMLPActionPopup, setShowPMLPActionPopup] = useState(false);
//   const [showPMLPRentForm, setShowPMLPRentForm] = useState(false);
//   const [showPMLPSellForm, setShowPMLPSellForm] = useState(false);
//   const [showPMLPLeaseForm, setShowPMLPLeaseForm] = useState(false);

//   // Property Management Hostel
//   const [showPMHostelActionPopup, setShowPMHostelActionPopup] = useState(false);
//   const [showPMHostelRentForm, setShowPMHostelRentForm] = useState(false);
//   const [showPMHostelSellForm, setShowPMHostelSellForm] = useState(false);
//   const [showPMHostelLeaseForm, setShowPMHostelLeaseForm] = useState(false);

//   // Agent forms
//   const [showAgentActionPopup, setShowAgentActionPopup] = useState(false);
//   const [showAgentRentForm, setShowAgentRentForm] = useState(false);
//   const [showAgentSellForm, setShowAgentSellForm] = useState(false);
//   const [showAgentLeaseForm, setShowAgentLeaseForm] = useState(false);

//   // Agent Apartment forms
//   const [showAgentApartActionPopup, setShowAgentApartActionPopup] = useState(false);
//   const [showAgentApartRentForm, setShowAgentApartRentForm] = useState(false);
//   const [showAgentApartSellForm, setShowAgentApartSellForm] = useState(false);
//   const [showAgentApartLeaseForm, setShowAgentApartLeaseForm] = useState(false);

//   // Agent Commercial forms
//   const [showAgentComActionPopup, setShowAgentComActionPopup] = useState(false);
//   const [showAgentComRentForm, setShowAgentComRentForm] = useState(false);
//   const [showAgentComSellForm, setShowAgentComSellForm] = useState(false);
//   const [showAgentComLeaseForm, setShowAgentComLeaseForm] = useState(false);

//   // Builder forms
//   const [showBuilderActionPopup, setShowBuilderActionPopup] = useState(false);
//   const [showBuilderRentForm, setShowBuilderRentForm] = useState(false);
//   const [showBuilderSellForm, setShowBuilderSellForm] = useState(false);
//   const [showBuilderLeaseForm, setShowBuilderLeaseForm] = useState(false);

//   // Builder Apartment forms
//   const [showBuilderApartActionPopup, setShowBuilderApartActionPopup] = useState(false);
//   const [showBuilderApartRentForm, setShowBuilderApartRentForm] = useState(false);
//   const [showBuilderApartSellForm, setShowBuilderApartSellForm] = useState(false);
//   const [showBuilderApartLeaseForm, setShowBuilderApartLeaseForm] = useState(false);

//   // Builder Commercial forms
//   const [showBuilderComActionPopup, setShowBuilderComActionPopup] = useState(false);
//   const [showBuilderComRentForm, setShowBuilderComRentForm] = useState(false);
//   const [showBuilderComSellForm, setShowBuilderComSellForm] = useState(false);
//   const [showBuilderComLeaseForm, setShowBuilderComLeaseForm] = useState(false);

//   // Property Management forms
//   const [showPMActionPopup, setShowPMActionPopup] = useState(false);
//   const [showPMRentForm, setShowPMRentForm] = useState(false);
//   const [showPMSellForm, setShowPMSellForm] = useState(false);
//   const [showPMLeaseForm, setShowPMLeaseForm] = useState(false);

//   // Property Management Apartment forms
//   const [showPMApartActionPopup, setShowPMApartActionPopup] = useState(false);
//   const [showPMApartRentForm, setShowPMApartRentForm] = useState(false);
//   const [showPMApartSellForm, setShowPMApartSellForm] = useState(false);
//   const [showPMApartLeaseForm, setShowPMApartLeaseForm] = useState(false);

//   // Property Management Commercial forms
//   const [showPMComActionPopup, setShowPMComActionPopup] = useState(false);
//   const [showPMComRentForm, setShowPMComRentForm] = useState(false);
//   const [showPMComSellForm, setShowPMComSellForm] = useState(false);
//   const [showPMComLeaseForm, setShowPMComLeaseForm] = useState(false);

//   const [selectedRole, setSelectedRole] = useState("");
//   const [selectedPropertyType, setSelectedPropertyType] = useState("");

//   const [mobileDropdowns, setMobileDropdowns] = useState({
//     customer: false,
//     post: false,
//     loan: false,
//     services: false,
//     profile: false,
//     admin: false,
//     customerSub: {},
//     postSub: {}
//   });
  
//   // Refs for dropdown containers
//   const dropdownRefs = {
//     admin: useRef(null),
//     profile: useRef(null),
//     customer: useRef(null),
//     post: useRef(null),
//     loan: useRef(null),
//     services: useRef(null)
//   };
  
//   // Timer refs for hover delay
//   const hoverTimerRef = useRef(null);
  
//   const navigate = useNavigate();
//   const searchRef = useRef(null);

//   // Decode JWT token and set user data
//   useEffect(() => {
//     const token = storage.get("accessToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUserData(decoded);
//         setUserRole(decoded?.role || null);
//         console.log("User Role:", decoded?.role);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         setUserRole(null);
//       }
//     } else {
//       setUserRole(null);
//     }
//   }, []);

//   const customerPortalMenu = {
//     "Individual": ["Rent", "Buy", "Lease", "Sell"],
//     "Apartment": ["Rent", "Buy", "Lease", "Sell"],
//     "Commercial": ["Rent", "Buy", "Lease", "Sell"],
//     "Land & Plots": ["Rent", "Buy", "Lease", "Sell"],
//     "Hostel": ["Rent", "Buy", "Lease", "Sell"],
//   };

//   const postPropertyMenu = {
//     "Owner": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Agent": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Builder": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//     "Property Management": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
//   };

//   const loanMenu = [
//     "Home Loan",
//     "Property Loan",
//     "Construction Loan",
//     "Plot Loan",
//     "Commercial Loan"
//   ];

//   const servicesMenu = [
//     "Construction",
//     "Interior",
//     "Painting",
//     "Plumbing",
//     "Cleaning"
//   ];

//   const profileMenu = [
//     { label: "Owner", icon: "👤", path: "/profile/owner" },
//     { label: "Agent", icon: "🏢", path: "/profile/agent" },
//     { label: "Builder", icon: "🏗️", path: "/profile/builder" },
//     { label: "Property Management", icon: "🏢", path: "/profile/property-management" }
//   ];

//   const adminMenu = [
//     { 
//       label: "Admin", 
//       icon: <Users className="w-4 h-4" />, 
//       path: "/admin",
//       description: "Admin Panel"
//     },
//     { 
//       label: "Office", 
//       icon: <OfficeIcon className="w-4 h-4" />, 
//       path: "/office",
//       description: "Office Dashboard"
//     }
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Click outside handler for dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const isOutsideAll = Object.values(dropdownRefs).every(ref => 
//         ref.current && !ref.current.contains(event.target)
//       );
      
//       if (isOutsideAll && activeDropdown) {
//         setActiveDropdown(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [activeDropdown]);

//   // Clean up hover timer
//   useEffect(() => {
//     return () => {
//       if (hoverTimerRef.current) {
//         clearTimeout(hoverTimerRef.current);
//       }
//     };
//   }, []);

//   // Handle profile navigation
//   const handleProfileNavigation = (path) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
//     navigate(path);
//   };

//   // Handle admin navigation
//   const handleAdminNavigation = (path) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
//     navigate(path);
//   };

//   // ============ LAND & PLOTS HANDLERS (OWNER) ============
//   const handleLPActionClick = (action) => {
//     setShowLPActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowLPRentForm(true);
//         break;
//       case "Sell":
//         setShowLPSellForm(true);
//         break;
//       case "Lease":
//         setShowLPLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ LAND & PLOTS HANDLERS (AGENT) ============
//   const handleAgentLPActionClick = (action) => {
//     setShowAgentLPActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentLPRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentLPSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentLPLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ LAND & PLOTS HANDLERS (BUILDER) ============
//   const handleBuilderLPActionClick = (action) => {
//     setShowBuilderLPActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderLPRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderLPSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderLPLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ LAND & PLOTS HANDLERS (PROPERTY MANAGEMENT) ============
//   const handlePMLPActionClick = (action) => {
//     setShowPMLPActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMLPRentForm(true);
//         break;
//       case "Sell":
//         setShowPMLPSellForm(true);
//         break;
//       case "Lease":
//         setShowPMLPLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ HOSTEL HANDLERS (OWNER) ============
//   const handleHostelActionClick = (action) => {
//     setShowHostelActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowHostelRentForm(true);
//         break;
//       case "Sell":
//         setShowHostelSellForm(true);
//         break;
//       case "Lease":
//         setShowHostelLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ HOSTEL HANDLERS (AGENT) ============
//   const handleAgentHostelActionClick = (action) => {
//     setShowAgentHostelActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentHostelRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentHostelSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentHostelLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ HOSTEL HANDLERS (BUILDER) ============
//   const handleBuilderHostelActionClick = (action) => {
//     setShowBuilderHostelActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderHostelRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderHostelSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderHostelLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // ============ HOSTEL HANDLERS (PROPERTY MANAGEMENT) ============
//   const handlePMHostelActionClick = (action) => {
//     setShowPMHostelActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMHostelRentForm(true);
//         break;
//       case "Sell":
//         setShowPMHostelSellForm(true);
//         break;
//       case "Lease":
//         setShowPMHostelLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Post Property submenu click
//   const handlePostSubmenuClick = (role, propertyType) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
//     setSelectedRole(role);
//     setSelectedPropertyType(propertyType);

//     // ============ LAND & PLOTS HANDLING ============
//     if (propertyType === "Land & Plots") {
//       if (role === "Owner") {
//         setShowLPActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentLPActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderLPActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMLPActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//       return;
//     }

//     // ============ HOSTEL HANDLING ============
//     if (propertyType === "Hostel") {
//       if (role === "Owner") {
//         setShowHostelActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentHostelActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderHostelActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMHostelActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//       return;
//     }

//     // Existing property type handling...
//     if (propertyType === "Individual") {
//       if (role === "Agent") {
//         setShowAgentActionPopup(true);
//       } else if (role === "Owner") {
//         setShowOwnerActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else if (propertyType === "Apartment") {
//       if (role === "Agent") {
//         setShowAgentApartActionPopup(true);
//       } else if (role === "Owner") {
//         setShowApartActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderApartActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMApartActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else if (propertyType === "Commercial") {
//       if (role === "Owner") {
//         setShowComActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentComActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderComActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMComActionPopup(true);
//       } else {
//         setShowRoleSelectionPopup(true);
//       }
//     } else {
//       // Fallback
//       setShowRoleSelectionPopup(true);
//     }
//   };

//   const handleRoleSelect = (role) => {
//     setShowRoleSelectionPopup(false);
//     setSelectedRole(role);
    
//     // ============ LAND & PLOTS HANDLING ============
//     if (selectedPropertyType === "Land & Plots") {
//       if (role === "Owner") {
//         setShowLPActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentLPActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderLPActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMLPActionPopup(true);
//       }
//       return;
//     }

//     // ============ HOSTEL HANDLING ============
//     if (selectedPropertyType === "Hostel") {
//       if (role === "Owner") {
//         setShowHostelActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentHostelActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderHostelActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMHostelActionPopup(true);
//       }
//       return;
//     }

//     // Existing role handling...
//     if (selectedPropertyType === "Individual") {
//       if (role === "Owner") {
//         setShowOwnerActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMActionPopup(true);
//       }
//     } else if (selectedPropertyType === "Apartment") {
//       if (role === "Owner") {
//         setShowApartActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentApartActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderApartActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMApartActionPopup(true);
//       }
//     } else if (selectedPropertyType === "Commercial") {
//       if (role === "Owner") {
//         setShowComActionPopup(true);
//       } else if (role === "Agent") {
//         setShowAgentComActionPopup(true);
//       } else if (role === "Builder") {
//         setShowBuilderComActionPopup(true);
//       } else if (role === "Property Management") {
//         setShowPMComActionPopup(true);
//       }
//     }
//   };

//   // Handle Owner action button clicks (Rent, Sell, Lease)
//   const handleOwnerActionClick = (action) => {
//     setShowOwnerActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowOwnerRentForm(true);
//         break;
//       case "Sell":
//         setShowOwnerSellForm(true);
//         break;
//       case "Lease":
//         setShowOwnerLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Apartment action button clicks (Rent, Sell, Lease)
//   const handleApartActionClick = (action) => {
//     setShowApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowApartRentForm(true);
//         break;
//       case "Sell":
//         setShowApartSellForm(true);
//         break;
//       case "Lease":
//         setShowApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Commercial action button clicks (Rent, Sell, Lease)
//   const handleComActionClick = (action) => {
//     setShowComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowComRentForm(true);
//         break;
//       case "Sell":
//         setShowComSellForm(true);
//         break;
//       case "Lease":
//         setShowComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent action button clicks (Rent, Sell, Lease)
//   const handleAgentActionClick = (action) => {
//     setShowAgentActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent Apartment action button clicks (Rent, Sell, Lease)
//   const handleAgentApartActionClick = (action) => {
//     setShowAgentApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentApartRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentApartSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Agent Commercial action button clicks (Rent, Sell, Lease)
//   const handleAgentComActionClick = (action) => {
//     setShowAgentComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowAgentComRentForm(true);
//         break;
//       case "Sell":
//         setShowAgentComSellForm(true);
//         break;
//       case "Lease":
//         setShowAgentComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder action button clicks (Rent, Sell, Lease)
//   const handleBuilderActionClick = (action) => {
//     setShowBuilderActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder Apartment action button clicks (Rent, Sell, Lease)
//   const handleBuilderApartActionClick = (action) => {
//     setShowBuilderApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderApartRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderApartSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Builder Commercial action button clicks (Rent, Sell, Lease)
//   const handleBuilderComActionClick = (action) => {
//     setShowBuilderComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowBuilderComRentForm(true);
//         break;
//       case "Sell":
//         setShowBuilderComSellForm(true);
//         break;
//       case "Lease":
//         setShowBuilderComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management action button clicks (Rent, Sell, Lease)
//   const handlePMActionClick = (action) => {
//     setShowPMActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMRentForm(true);
//         break;
//       case "Sell":
//         setShowPMSellForm(true);
//         break;
//       case "Lease":
//         setShowPMLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management Apartment action button clicks (Rent, Sell, Lease)
//   const handlePMApartActionClick = (action) => {
//     setShowPMApartActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMApartRentForm(true);
//         break;
//       case "Sell":
//         setShowPMApartSellForm(true);
//         break;
//       case "Lease":
//         setShowPMApartLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle Property Management Commercial action button clicks (Rent, Sell, Lease)
//   const handlePMComActionClick = (action) => {
//     setShowPMComActionPopup(false);
//     switch(action) {
//       case "Rent":
//         setShowPMComRentForm(true);
//         break;
//       case "Sell":
//         setShowPMComSellForm(true);
//         break;
//       case "Lease":
//         setShowPMComLeaseForm(true);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleCustomerPortalClick = (type) => {
//     setActiveDropdown(null);
//     setMobileMenuOpen(false);
    
//     const typeKey = type.toLowerCase().replace(/\s+/g, '-');
    
//     if (typeKey === "individual") {
//       navigate("/individual");
//     } else if (typeKey === "rent") {
//       navigate("/rent");
//     } else if (typeKey === "buy") {
//       navigate("/buy");
//     } else if (typeKey === "lease") {
//       navigate("/lease");
//     } else if (typeKey === "sell") {
//       navigate("/sell");
//     } else if (typeKey === "apartment") {
//       navigate("/apartment");
//     } else if (typeKey === "commercial") {
//       navigate("/commercial");
//     } else if (typeKey === "land-&-plots") {
//       navigate("/land-plots");
//     } else if (typeKey === "hostel") {
//       navigate("/hostel");
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchOpen(false);
//       setSearchQuery("");
//     }
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//     if (!mobileMenuOpen) {
//       setMobileDropdowns({
//         customer: false,
//         post: false,
//         loan: false,
//         services: false,
//         profile: false,
//         admin: false,
//         customerSub: {},
//         postSub: {}
//       });
//     }
//   };

//   const toggleMobileDropdown = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const toggleCustomerSub = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       customerSub: {
//         ...prev.customerSub,
//         [key]: !prev.customerSub[key]
//       }
//     }));
//   };

//   const togglePostSub = (key) => {
//     setMobileDropdowns(prev => ({
//       ...prev,
//       postSub: {
//         ...prev.postSub,
//         [key]: !prev.postSub[key]
//       }
//     }));
//   };

//   // Dropdown handlers with improved logic
//   const handleDropdownToggle = (dropdown) => {
//     setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
//   };

//   const handleDropdownEnter = (dropdown) => {
//     if (hoverTimerRef.current) {
//       clearTimeout(hoverTimerRef.current);
//       hoverTimerRef.current = null;
//     }
//     setActiveDropdown(dropdown);
//   };

//   const handleDropdownLeave = (e, dropdown) => {
//     const relatedTarget = e.relatedTarget;
//     const currentRef = dropdownRefs[dropdown];
    
//     if (currentRef && currentRef.current && relatedTarget) {
//       if (currentRef.current.contains(relatedTarget)) {
//         return;
//       }
//     }
    
//     hoverTimerRef.current = setTimeout(() => {
//       setActiveDropdown(null);
//       hoverTimerRef.current = null;
//     }, 100);
//   };

//   // Determine if user is logged in and their role
//   const isLoggedIn = !!userRole;
//   const isVendor = userRole === "vendor";
//   const isAdmin = userRole === "admin";
//   const isUser = userRole === "user";

//   return (
//     <>
//       <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         scrolled 
//           ? 'bg-gradient-to-r from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl shadow-2xl shadow-[#00695C]/20' 
//           : 'bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C]'
//       }`}>
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full animate-float-particle"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 width: `${Math.random() * 2 + 1}px`,
//                 height: `${Math.random() * 2 + 1}px`,
//                 background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${6 + Math.random() * 12}s`,
//               }}
//             />
//           ))}
          
//           <div className="absolute bottom-0 left-0 right-0 h-8">
//             <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent animate-wave-slow" />
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

//         <div className="h-[72px] md:h-[84px] w-full px-3 md:px-6 flex items-center relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03] animate-sweep" />
          
//           <div className="flex items-center justify-between w-full relative z-10">
//             <div className="flex items-center gap-2 md:gap-4">
//               <button
//                 onClick={toggleMobileMenu}
//                 className="md:hidden p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 group relative"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
//                 <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
//               </button>

//               <div
//                 onClick={() => navigate("/")}
//                 className="cursor-pointer group relative"
//               >
//                 <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
//                 <div className="relative w-13 h-13 md:w-[76px] md:h-[76px] rounded-full overflow-hidden flex items-center justify-center">
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#004D40] to-[#00695C] opacity-80" />
//                   <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#26A69A]/20 to-transparent" />
//                   <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 via-transparent to-[#00FF88]/20 animate-spin-slow rounded-full" />
                  
//                   <img
//                     src={logo}
//                     alt="Eliteinova Properties Logo"
//                     className="w-11 h-11 md:w-[60px] md:h-[60px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
//                     style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
//                   />
//                 </div>
//               </div>

//               <div 
//                 onClick={() => navigate("/")} 
//                 className="cursor-pointer group relative"
//               >
//                 <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#00FF88]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
//                 <h1
//                   className="text-lg md:text-2xl lg:text-3xl font-light leading-tight relative tracking-wide"
//                   style={{
//                     fontFamily: "Pacifico, cursive",
//                     color: "#E8F5E9",
//                     textShadow: '0 2px 16px rgba(0, 229, 255, 0.2)',
//                     fontWeight: 150,
//                   }}
//                 >
//                   <span className="relative inline-block group-hover:scale-105 transition-transform duration-500">
//                     Eliteinova <span className="text-[0.75em]">Properties</span>
//                     <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00E5FF]/20 via-[#00FF88]/20 to-[#00E5FF]/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700" />
//                   </span>
//                 </h1>
                
//                 <p 
//                   className="text-[11px] md:text-sm lg:text-base font-light leading-tight mt-0 flex items-center gap-2"
//                   style={{
//                     fontFamily: "Pacifico, cursive",
//                     color: "#C8E6C9",
//                     fontWeight: 300,
//                   }}
//                 >
//                   <span className="relative whitespace-nowrap">
//                     No Brokerage
//                     <Sparkles className="absolute -right-5 -top-0.5 w-3 h-3 text-yellow-300 animate-sparkle-glow" />
//                   </span>
//                   <span className="text-[8px] md:text-[10px] bg-gradient-to-r from-[#00FF88]/20 to-[#00E5FF]/20 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-sm">
//                     ⭐ Trusted
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* Profile Section - Desktop */}
//             <div className="hidden md:flex items-center gap-3">
//               {/* Admin Hamburger Dropdown - Only visible to admin */}
//               {isAdmin && (
//                 <div
//                   ref={dropdownRefs.admin}
//                   className="relative"
//                   onMouseEnter={() => handleDropdownEnter("admin")}
//                   onMouseLeave={(e) => handleDropdownLeave(e, "admin")}
//                 >
//                   <button 
//                     className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-[#26A69A]/30 backdrop-blur-sm hover:bg-[#26A69A]/50 transition-all duration-300 border border-white/20 hover:border-white/40"
//                     onClick={() => handleDropdownToggle("admin")}
//                   >
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30 group-hover:scale-110 transition-transform duration-300">
//                       <MenuIcon className="w-4 h-4 text-white" />
//                     </div>
//                   </button>

//                   {activeDropdown === "admin" && (
//                     <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[200px] border border-white/30 animate-dropdown overflow-hidden">
//                       <div className="p-2">
//                         {adminMenu.map((item, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handleAdminNavigation(item.path)}
//                             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 group"
//                           >
//                             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex items-center justify-center text-[#00695C] group-hover:scale-110 transition-transform duration-300">
//                               {item.icon}
//                             </div>
//                             <div className="flex flex-col items-start">
//                               <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00695C] transition-colors">
//                                 {item.label}
//                               </span>
//                               <span className="text-[10px] text-gray-500">{item.description}</span>
//                             </div>
//                             <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-[#00695C] transition-colors -rotate-90" />
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Profile Dropdown - Only visible to vendors (logged in users) */}
//               {(isVendor || isAdmin || isUser) && (
//                 <div
//                   ref={dropdownRefs.profile}
//                   className="relative"
//                   onMouseEnter={() => handleDropdownEnter("profile")}
//                   onMouseLeave={(e) => handleDropdownLeave(e, "profile")}
//                 >
//                   <button 
//                     className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
//                     onClick={() => handleDropdownToggle("profile")}
//                   >
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
//                       <User className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="text-white font-medium text-sm">
//                       {isVendor ? "Vendor" : isAdmin ? "Admin" : "User"}
//                     </span>
//                     <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${activeDropdown === "profile" ? 'rotate-180' : ''}`} />
//                   </button>

//                   {activeDropdown === "profile" && (
//                     <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[220px] border border-white/30 animate-dropdown overflow-hidden">
//                       <div className="p-2">
//                         {/* Show user info at top */}
//                         <div className="px-4 py-2 mb-1 border-b border-gray-100">
//                           <p className="text-sm font-semibold text-gray-800">
//                             {userData?.name || "User"}
//                           </p>
//                           <p className="text-xs text-gray-500 capitalize">
//                             Role: {userRole}
//                           </p>
//                         </div>

//                         {isVendor && (
//                           <>
//                             {profileMenu.map((item, index) => (
//                               <button
//                                 key={index}
//                                 onClick={() => handleProfileNavigation(item.path)}
//                                 className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 group"
//                               >
//                                 <span className="text-xl">{item.icon}</span>
//                                 <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00695C] transition-colors">
//                                   {item.label}
//                                 </span>
//                                 <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-[#00695C] transition-colors -rotate-90" />
//                               </button>
//                             ))}
//                           </>
//                         )}
                        
//                         <div className="border-t border-gray-200/50 my-1"></div>
                        
//                         <button
//                           onClick={() => {
//                             setActiveDropdown(null);
//                             navigate("/logout");
//                           }}
//                           className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-red-50 to-pink-50 transition-all duration-300 group"
//                         >
//                           <LogOut className="w-5 h-5 text-red-500" />
//                           <span className="text-sm font-semibold text-red-600">Logout</span>
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <nav className="hidden md:flex h-12 items-center relative bg-gradient-to-r from-[#004D40]/90 via-[#00796B]/90 to-[#004D40]/90 backdrop-blur-sm border-t border-white/5">
//           <div className="absolute inset-0 opacity-[0.03]">
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow" />
//           </div>
          
//           <div className="flex items-center h-full relative z-10">
//             <button
//               onClick={() => {
//                 navigate("/");
//                 setActiveTab("home");
//               }}
//               className={`group relative px-5 h-full text-white font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden ${
//                 activeTab === "home" 
//                   ? 'bg-gradient-to-r from-white/10 to-transparent' 
//                   : 'hover:bg-white/5'
//               }`}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
//               <span className="flex items-center gap-2 relative z-10">
//                 <Home className="w-4 h-4" />
//                 Home
//               </span>
              
//               {activeTab === "home" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse-glow" />
//               )}
//             </button>

//             <div
//               ref={dropdownRefs.customer}
//               className="relative h-full"
//               onMouseEnter={() => handleDropdownEnter("customer")}
//               onMouseLeave={(e) => handleDropdownLeave(e, "customer")}
//             >
//               <button 
//                 onClick={() => navigate("/customer-portal")}
//                 className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
//               >
//                 <Building className="w-4 h-4" />
//                 <span>Customer Portal</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "customer" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "customer" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
//                   {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                     <div key={key} className="relative group/item">
//                       <button 
//                         onClick={() => handleCustomerPortalClick(key)}
//                         className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 capitalize"
//                       >
//                         {key}
//                       </button>
//                       <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[160px] z-50 border border-white/30 animate-dropdown-nested">
//                         {submenu.map((item) => (
//                           <button
//                             key={item}
//                             onClick={() => handleCustomerPortalClick(item.toLowerCase())}
//                             className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                           >
//                             {item}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Post Property - Only visible to vendors and admins */}
//             {(isVendor || isAdmin) && (
//               <div
//                 ref={dropdownRefs.post}
//                 className="relative h-full"
//                 onMouseEnter={() => handleDropdownEnter("post")}
//                 onMouseLeave={(e) => handleDropdownLeave(e, "post")}
//               >
//                 <button
//                   onClick={() => navigate("/post-property")}
//                   className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
//                 >
//                   <TrendingUp className="w-4 h-4" />
//                   <span>Post Property</span>
//                   <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "post" ? 'rotate-180' : ''}`} />
//                 </button>

//                 {activeDropdown === "post" && (
//                   <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[190px] border border-white/30 animate-dropdown">
//                     {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                       <div key={role} className="relative group/item">
//                         <button
//                           className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 flex items-center justify-between gap-3"
//                         >
//                           {role}
//                           <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-gray-400" />
//                         </button>
//                         <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[170px] z-50 border border-white/30 animate-dropdown-nested">
//                           {submenu.map((propertyType) => (
//                             <button
//                               key={propertyType}
//                               onClick={() => handlePostSubmenuClick(role, propertyType)}
//                               className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                             >
//                               {propertyType}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div
//               ref={dropdownRefs.loan}
//               className="relative h-full"
//               onMouseEnter={() => handleDropdownEnter("loan")}
//               onMouseLeave={(e) => handleDropdownLeave(e, "loan")}
//             >
//               <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
//                 <Landmark className="w-4 h-4" />
//                 <span>Find Loan</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "loan" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "loan" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
//                   {loanMenu.map((item) => (
//                     <button
//                       key={item}
//                       className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div
//               ref={dropdownRefs.services}
//               className="relative h-full"
//               onMouseEnter={() => handleDropdownEnter("services")}
//               onMouseLeave={(e) => handleDropdownLeave(e, "services")}
//             >
//               <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
//                 <Settings className="w-4 h-4" />
//                 <span>Services</span>
//                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "services" ? 'rotate-180' : ''}`} />
//               </button>

//               {activeDropdown === "services" && (
//                 <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[160px] border border-white/30 animate-dropdown">
//                   {servicesMenu.map((item) => (
//                     <button
//                       key={item}
//                       className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div> 
//         </nav>
//       </header>

//       {/* ============ ROLE SELECTION POPUP ============ */}
//       {showRoleSelectionPopup && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowRoleSelectionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Select Role
//               </h2>
//               <button 
//                 onClick={() => setShowRoleSelectionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               {selectedPropertyType} Property: Who is listing this property?
//             </p>

//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 onClick={() => handleRoleSelect("Owner")}
//                 className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">👤</div>
//                 <div className="font-bold text-emerald-700 group-hover:text-emerald-900">Owner</div>
//                 <div className="text-[10px] text-gray-500">Individual owner</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Agent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Agent</div>
//                 <div className="text-[10px] text-gray-500">Professional agent</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Builder")}
//                 className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏗️</div>
//                 <div className="font-bold text-amber-700 group-hover:text-amber-900">Builder</div>
//                 <div className="text-[10px] text-gray-500">Builder/Developer</div>
//               </button>

//               <button
//                 onClick={() => handleRoleSelect("Property Management")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Property Management</div>
//                 <div className="text-[10px] text-gray-500">Property management company</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ OWNER INDIVIDUAL ACTION POPUP ============ */}
//       {showOwnerActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowOwnerActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Owner - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowOwnerActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleOwnerActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleOwnerActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleOwnerActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ OWNER APARTMENT ACTION POPUP ============ */}
//       {showApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ OWNER COMMERCIAL ACTION POPUP ============ */}
//       {showComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ LAND & PLOTS ACTION POPUP (OWNER) ============ */}
//       {showLPActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowLPActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Land & Plots Action
//               </h2>
//               <button 
//                 onClick={() => setShowLPActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Land & Plots Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleLPActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏞️</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleLPActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleLPActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ LAND & PLOTS ACTION POPUP (AGENT) ============ */}
//       {showAgentLPActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentLPActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Land & Plots Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentLPActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Land & Plots Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentLPActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏞️</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentLPActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentLPActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ LAND & PLOTS ACTION POPUP (BUILDER) ============ */}
//       {showBuilderLPActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderLPActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Land & Plots Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderLPActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Land & Plots Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderLPActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏞️</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderLPActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderLPActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ LAND & PLOTS ACTION POPUP (PROPERTY MANAGEMENT) ============ */}
//       {showPMLPActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMLPActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Land & Plots Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMLPActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Land & Plots Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMLPActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏞️</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMLPActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMLPActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ HOSTEL ACTION POPUP (OWNER) ============ */}
//       {showHostelActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowHostelActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Owner - Hostel Action
//               </h2>
//               <button 
//                 onClick={() => setShowHostelActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Hostel Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleHostelActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏨</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleHostelActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleHostelActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ HOSTEL ACTION POPUP (AGENT) ============ */}
//       {showAgentHostelActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentHostelActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Hostel Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentHostelActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Hostel Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentHostelActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏨</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentHostelActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentHostelActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ HOSTEL ACTION POPUP (BUILDER) ============ */}
//       {showBuilderHostelActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderHostelActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Hostel Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderHostelActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Hostel Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderHostelActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏨</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderHostelActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderHostelActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ HOSTEL ACTION POPUP (PROPERTY MANAGEMENT) ============ */}
//       {showPMHostelActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMHostelActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Hostel Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMHostelActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Hostel Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMHostelActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏨</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMHostelActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMHostelActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ AGENT INDIVIDUAL ACTION POPUP ============ */}
//       {showAgentActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ AGENT APARTMENT ACTION POPUP ============ */}
//       {showAgentApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ AGENT COMMERCIAL ACTION POPUP ============ */}
//       {showAgentComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Agent - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowAgentComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleAgentComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleAgentComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleAgentComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ BUILDER INDIVIDUAL ACTION POPUP ============ */}
//       {showBuilderActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ BUILDER APARTMENT ACTION POPUP ============ */}
//       {showBuilderApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ BUILDER COMMERCIAL ACTION POPUP ============ */}
//       {showBuilderComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Builder - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowBuilderComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handleBuilderComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handleBuilderComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ PROPERTY MANAGEMENT INDIVIDUAL ACTION POPUP ============ */}
//       {showPMActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Choose Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Individual Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ PROPERTY MANAGEMENT APARTMENT ACTION POPUP ============ */}
//       {showPMApartActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMApartActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Apartment Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMApartActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Apartment: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMApartActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏠</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMApartActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMApartActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ PROPERTY MANAGEMENT COMMERCIAL ACTION POPUP ============ */}
//       {showPMComActionPopup && (
//         <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMComActionPopup(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Property Management - Commercial Action
//               </h2>
//               <button 
//                 onClick={() => setShowPMComActionPopup(false)}
//                 className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             <p className="text-sm text-gray-600 mb-6">
//               Commercial Property: How would you like to proceed?
//             </p>

//             <div className="grid grid-cols-3 gap-3">
//               <button
//                 onClick={() => handlePMComActionClick("Rent")}
//                 className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">🏢</div>
//                 <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
//               </button>

//               <button
//                 onClick={() => handlePMComActionClick("Sell")}
//                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">💰</div>
//                 <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
//               </button>

//               <button
//                 onClick={() => handlePMComActionClick("Lease")}
//                 className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
//               >
//                 <div className="text-2xl mb-1">📄</div>
//                 <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ RENDER ALL FORMS ============ */}
      
//       {/* Owner Forms */}
//       <IndRentForm isOpen={showOwnerRentForm} onClose={() => setShowOwnerRentForm(false)} />
//       <IndSellForm isOpen={showOwnerSellForm} onClose={() => setShowOwnerSellForm(false)} />
//       <IndLeaseForm isOpen={showOwnerLeaseForm} onClose={() => setShowOwnerLeaseForm(false)} />

//       <ApartRentForm isOpen={showApartRentForm} onClose={() => setShowApartRentForm(false)} />
//       <ApartSellForm isOpen={showApartSellForm} onClose={() => setShowApartSellForm(false)} />
//       <ApartLeaseForm isOpen={showApartLeaseForm} onClose={() => setShowApartLeaseForm(false)} />

//       <ComRentForm isOpen={showComRentForm} onClose={() => setShowComRentForm(false)} />
//       <ComSellForm isOpen={showComSellForm} onClose={() => setShowComSellForm(false)} />
//       <ComLeaseForm isOpen={showComLeaseForm} onClose={() => setShowComLeaseForm(false)} />

//       {/* LAND & PLOTS FORMS (OWNER) */}
//       <RentLPForm isOpen={showLPRentForm} onClose={() => setShowLPRentForm(false)} />
//       <SellLPForm isOpen={showLPSellForm} onClose={() => setShowLPSellForm(false)} />
//       <LeaseLPForm isOpen={showLPLeaseForm} onClose={() => setShowLPLeaseForm(false)} />

//       {/* LAND & PLOTS FORMS (AGENT) */}
//       <RentAgentLPForm isOpen={showAgentLPRentForm} onClose={() => setShowAgentLPRentForm(false)} />
//       <SellAgentLPForm isOpen={showAgentLPSellForm} onClose={() => setShowAgentLPSellForm(false)} />
//       <LeaseAgentLPForm isOpen={showAgentLPLeaseForm} onClose={() => setShowAgentLPLeaseForm(false)} />

//       {/* LAND & PLOTS FORMS (BUILDER) */}
//       <RentBuilderLPForm isOpen={showBuilderLPRentForm} onClose={() => setShowBuilderLPRentForm(false)} />
//       <SellBuilderLPForm isOpen={showBuilderLPSellForm} onClose={() => setShowBuilderLPSellForm(false)} />
//       <LeaseBuilderLPForm isOpen={showBuilderLPLeaseForm} onClose={() => setShowBuilderLPLeaseForm(false)} />

//       {/* LAND & PLOTS FORMS (PROPERTY MANAGEMENT) */}
//       <RentPMLPForm isOpen={showPMLPRentForm} onClose={() => setShowPMLPRentForm(false)} />
//       <SellPMLPForm isOpen={showPMLPSellForm} onClose={() => setShowPMLPSellForm(false)} />
//       <LeasePMLPForm isOpen={showPMLPLeaseForm} onClose={() => setShowPMLPLeaseForm(false)} />

//       {/* HOSTEL FORMS (OWNER) */}
//       <HostelRentForm isOpen={showHostelRentForm} onClose={() => setShowHostelRentForm(false)} />
//       <HostelSellForm isOpen={showHostelSellForm} onClose={() => setShowHostelSellForm(false)} />
//       <HostelLeaseForm isOpen={showHostelLeaseForm} onClose={() => setShowHostelLeaseForm(false)} />

//       {/* HOSTEL FORMS (AGENT) */}
//       <RentAgentHostelForm isOpen={showAgentHostelRentForm} onClose={() => setShowAgentHostelRentForm(false)} />
//       <SellAgentHostelForm isOpen={showAgentHostelSellForm} onClose={() => setShowAgentHostelSellForm(false)} />
//       <LeaseAgentHostelForm isOpen={showAgentHostelLeaseForm} onClose={() => setShowAgentHostelLeaseForm(false)} />

//       {/* HOSTEL FORMS (BUILDER) */}
//       <RentBuilderHostelForm isOpen={showBuilderHostelRentForm} onClose={() => setShowBuilderHostelRentForm(false)} />
//       <SellBuilderHostelForm isOpen={showBuilderHostelSellForm} onClose={() => setShowBuilderHostelSellForm(false)} />
//       <LeaseBuilderHostelForm isOpen={showBuilderHostelLeaseForm} onClose={() => setShowBuilderHostelLeaseForm(false)} />

//       {/* HOSTEL FORMS (PROPERTY MANAGEMENT) */}
//       <RentPMHostelForm isOpen={showPMHostelRentForm} onClose={() => setShowPMHostelRentForm(false)} />
//       <SellPMHostelForm isOpen={showPMHostelSellForm} onClose={() => setShowPMHostelSellForm(false)} />
//       <LeasePMHostelForm isOpen={showPMHostelLeaseForm} onClose={() => setShowPMHostelLeaseForm(false)} />

//       {/* Agent Forms */}
//       <RentAgentIndForm isOpen={showAgentRentForm} onClose={() => setShowAgentRentForm(false)} />
//       <SellAgentIndForm isOpen={showAgentSellForm} onClose={() => setShowAgentSellForm(false)} />
//       <LeaseAgentIndForm isOpen={showAgentLeaseForm} onClose={() => setShowAgentLeaseForm(false)} />

//       <RentAgentApartForm isOpen={showAgentApartRentForm} onClose={() => setShowAgentApartRentForm(false)} />
//       <SellAgentApartForm isOpen={showAgentApartSellForm} onClose={() => setShowAgentApartSellForm(false)} />
//       <LeaseAgentApartForm isOpen={showAgentApartLeaseForm} onClose={() => setShowAgentApartLeaseForm(false)} />

//       <RentAgentComForm isOpen={showAgentComRentForm} onClose={() => setShowAgentComRentForm(false)} />
//       <SellAgentComForm isOpen={showAgentComSellForm} onClose={() => setShowAgentComSellForm(false)} />
//       <LeaseAgentComForm isOpen={showAgentComLeaseForm} onClose={() => setShowAgentComLeaseForm(false)} />

//       {/* Builder Forms */}
//       <RentBuilderIndForm isOpen={showBuilderRentForm} onClose={() => setShowBuilderRentForm(false)} />
//       <SellBuilderIndForm isOpen={showBuilderSellForm} onClose={() => setShowBuilderSellForm(false)} />
//       <LeaseBuilderIndForm isOpen={showBuilderLeaseForm} onClose={() => setShowBuilderLeaseForm(false)} />

//       <RentBuilderApartForm isOpen={showBuilderApartRentForm} onClose={() => setShowBuilderApartRentForm(false)} />
//       <SellBuilderApartForm isOpen={showBuilderApartSellForm} onClose={() => setShowBuilderApartSellForm(false)} />
//       <LeaseBuilderApartForm isOpen={showBuilderApartLeaseForm} onClose={() => setShowBuilderApartLeaseForm(false)} />

//       <RentBuilderComForm isOpen={showBuilderComRentForm} onClose={() => setShowBuilderComRentForm(false)} />
//       <SellBuilderComForm isOpen={showBuilderComSellForm} onClose={() => setShowBuilderComSellForm(false)} />
//       <LeaseBuilderComForm isOpen={showBuilderComLeaseForm} onClose={() => setShowBuilderComLeaseForm(false)} />

//       {/* Property Management Forms */}
//       <RentPMIndForm isOpen={showPMRentForm} onClose={() => setShowPMRentForm(false)} />
//       <SellPMIndForm isOpen={showPMSellForm} onClose={() => setShowPMSellForm(false)} />
//       <LeasePMIndForm isOpen={showPMLeaseForm} onClose={() => setShowPMLeaseForm(false)} />

//       <RentPMApartForm isOpen={showPMApartRentForm} onClose={() => setShowPMApartRentForm(false)} />
//       <SellPMApartForm isOpen={showPMApartSellForm} onClose={() => setShowPMApartSellForm(false)} />
//       <LeasePMApartForm isOpen={showPMApartLeaseForm} onClose={() => setShowPMApartLeaseForm(false)} />

//       <RentPMComForm isOpen={showPMComRentForm} onClose={() => setShowPMComRentForm(false)} />
//       <SellPMComForm isOpen={showPMComSellForm} onClose={() => setShowPMComSellForm(false)} />
//       <LeasePMComForm isOpen={showPMComLeaseForm} onClose={() => setShowPMComLeaseForm(false)} />

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div 
//           className="md:hidden fixed inset-0 z-50 animate-fade"
//           onClick={toggleMobileMenu}
//         >
//           <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl animate-backdrop" />
          
//           <div 
//             className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#00695C] to-[#26A69A] shadow-2xl shadow-[#00695C]/50 overflow-y-auto animate-slide"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between p-4 border-b border-white/10">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
//                   <Menu className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-white font-bold text-sm">Menu</h2>
//                   <p className="text-white/50 text-[10px]">Welcome back!</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={toggleMobileMenu} 
//                 className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
//               >
//                 <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
//               </button>
//             </div>
            
//             {/* Admin Section in Mobile - Only visible to admin */}
//             {isAdmin && (
//               <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '0ms' }}>
//                 <div 
//                   className="flex items-center gap-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('admin')}
//                 >
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30">
//                     <MenuIcon className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-white font-semibold text-sm">Admin Panel</p>
//                     <p className="text-white/60 text-xs">Manage admin & office</p>
//                   </div>
//                   <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.admin ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.admin && (
//                   <div className="mt-2 space-y-1 pl-3">
//                     {adminMenu.map((item, index) => (
//                       <button
//                         key={index}
//                         onClick={() => {
//                           handleAdminNavigation(item.path);
//                           toggleMobileMenu();
//                         }}
//                         className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
//                       >
//                         <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center text-[#00695C]">
//                           {item.icon}
//                         </div>
//                         <div className="flex flex-col items-start flex-1">
//                           <span className="text-white text-sm font-medium">{item.label}</span>
//                           <span className="text-white/50 text-[10px]">{item.description}</span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {/* Profile Section in Mobile */}
//             {(isVendor || isAdmin || isUser) && (
//               <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '50ms' }}>
//                 <div 
//                   className="flex items-center gap-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('profile')}
//                 >
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
//                     <User className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-white font-semibold text-sm">
//                       {isVendor ? "Vendor" : isAdmin ? "Admin" : "User"}
//                     </p>
//                     <p className="text-white/60 text-xs">
//                       {userData?.name || "Profile"}
//                     </p>
//                   </div>
//                   <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.profile ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.profile && (
//                   <div className="mt-2 space-y-1 pl-3">
//                     {isVendor && (
//                       <>
//                         {profileMenu.map((item, index) => (
//                           <button
//                             key={index}
//                             onClick={() => {
//                               handleProfileNavigation(item.path);
//                               toggleMobileMenu();
//                             }}
//                             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
//                           >
//                             <span className="text-xl">{item.icon}</span>
//                             <span className="text-white text-sm font-medium">{item.label}</span>
//                           </button>
//                         ))}
//                       </>
//                     )}
                    
//                     <button
//                       onClick={() => {
//                         navigate("/logout");
//                         toggleMobileMenu();
//                       }}
//                       className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 mt-1"
//                     >
//                       <LogOut className="w-4 h-4 text-red-400" />
//                       <span className="text-red-400 text-sm font-medium">Logout</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             <div className="px-4 pb-32">
//               <button 
//                 onClick={() => {
//                   navigate('/');
//                   toggleMobileMenu();
//                 }}
//                 className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
//                 style={{ animationDelay: '100ms' }}
//               >
//                 🏠 Home
//               </button>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '150ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('customer')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🏢 Customer Portal</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.customer ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.customer && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {Object.entries(customerPortalMenu).map(([key, submenu]) => (
//                       <div key={key} className="border-l border-white/10 pl-3">
//                         <div 
//                           className="flex items-center justify-between py-2 cursor-pointer"
//                           onClick={() => toggleCustomerSub(key)}
//                         >
//                           <span className="text-white/90 text-sm capitalize">{key}</span>
//                           <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.customerSub[key] ? 'rotate-180' : ''}`} />
//                         </div>
                        
//                         {mobileDropdowns.customerSub[key] && (
//                           <div className="pl-3 pb-1 space-y-1">
//                             {submenu.map((item) => (
//                               <button 
//                                 key={item} 
//                                 onClick={() => {
//                                   handleCustomerPortalClick(item.toLowerCase());
//                                   toggleMobileMenu();
//                                 }}
//                                 className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                               >
//                                 {item}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               {/* Post Property in Mobile - Only visible to vendors and admins */}
//               {(isVendor || isAdmin) && (
//                 <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '200ms' }}>
//                   <div 
//                     className="flex items-center justify-between py-3 cursor-pointer"
//                     onClick={() => toggleMobileDropdown('post')}
//                   >
//                     <div className="flex items-center gap-2">
//                       <span className="text-white font-medium text-sm">📊 Post Property</span>
//                     </div>
//                     <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.post ? 'rotate-180' : ''}`} />
//                   </div>
                  
//                   {mobileDropdowns.post && (
//                     <div className="pl-4 pb-2 space-y-1">
//                       {Object.entries(postPropertyMenu).map(([role, submenu]) => (
//                         <div key={role} className="border-l border-white/10 pl-3">
//                           <div
//                             className="flex items-center justify-between py-2 cursor-pointer"
//                             onClick={() => togglePostSub(role)}
//                           >
//                             <span className="text-white/90 text-sm">{role}</span>
//                             <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform duration-300 ${mobileDropdowns.postSub[role] ? 'rotate-180' : ''}`} />
//                           </div>

//                           {mobileDropdowns.postSub[role] && (
//                             <div className="pl-3 pb-1 space-y-1">
//                               {submenu.map((propertyType) => (
//                                 <button
//                                   key={propertyType}
//                                   onClick={() => {
//                                     handlePostSubmenuClick(role, propertyType);
//                                     toggleMobileMenu();
//                                   }}
//                                   className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
//                                 >
//                                   {propertyType}
//                                 </button>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '250ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('loan')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">💰 Find Loan</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.loan ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.loan && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {loanMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '300ms' }}>
//                 <div 
//                   className="flex items-center justify-between py-3 cursor-pointer"
//                   onClick={() => toggleMobileDropdown('services')}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-white font-medium text-sm">🛠️ Services</span>
//                   </div>
//                   <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.services ? 'rotate-180' : ''}`} />
//                 </div>
                
//                 {mobileDropdowns.services && (
//                   <div className="pl-4 pb-2 space-y-1">
//                     {servicesMenu.map((item) => (
//                       <button 
//                         key={item} 
//                         onClick={() => {
//                           toggleMobileMenu();
//                         }}
//                         className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
//                       >
//                         {item}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes float-particle {
//           0%, 100% { 
//             transform: translateY(0) translateX(0) rotate(0deg); 
//             opacity: 0.2;
//           }
//           25% { 
//             transform: translateY(-20px) translateX(15px) rotate(90deg); 
//             opacity: 0.5;
//           }
//           50% { 
//             transform: translateY(-12px) translateX(-12px) rotate(180deg); 
//             opacity: 0.7;
//           }
//           75% { 
//             transform: translateY(12px) translateX(18px) rotate(270deg); 
//             opacity: 0.3;
//           }
//         }
//         .animate-float-particle {
//           animation: float-particle 10s ease-in-out infinite;
//         }

//         @keyframes wave-slow {
//           0% { transform: translateX(0) scaleY(1); }
//           50% { transform: translateX(40px) scaleY(1.2); }
//           100% { transform: translateX(80px) scaleY(1); }
//         }
//         .animate-wave-slow {
//           animation: wave-slow 8s ease-in-out infinite;
//         }

//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s linear infinite;
//         }

//         @keyframes shimmer-slow {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer-slow {
//           animation: shimmer-slow 8s linear infinite;
//         }

//         @keyframes sweep {
//           0%, 100% { 
//             background-position: 0% 50%; 
//             opacity: 0.3;
//           }
//           50% { 
//             background-position: 100% 50%; 
//             opacity: 0.6;
//           }
//         }
//         .animate-sweep {
//           background-size: 200% 200%;
//           animation: sweep 4s ease infinite;
//         }

//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-spin-slow {
//           animation: spin-slow 6s linear infinite;
//         }

//         @keyframes sparkle-glow {
//           0%, 100% { 
//             opacity: 0.3;
//             transform: scale(0.8) rotate(0deg);
//           }
//           50% { 
//             opacity: 1;
//             transform: scale(1.2) rotate(180deg);
//           }
//         }
//         .animate-sparkle-glow {
//           animation: sparkle-glow 2s ease-in-out infinite;
//         }

//         @keyframes pulse-ring {
//           0%, 100% {
//             transform: scale(1);
//             box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
//           }
//           50% {
//             transform: scale(1.1);
//             box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
//           }
//         }
//         .animate-pulse-ring {
//           animation: pulse-ring 1.5s ease-out infinite;
//         }

//         @keyframes pulse-glow {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.7; }
//         }
//         .animate-pulse-glow {
//           animation: pulse-glow 1.5s ease-in-out infinite;
//         }

//         @keyframes dropdown {
//           from {
//             opacity: 0;
//             transform: translateY(-6px) scale(0.96);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//         .animate-dropdown {
//           animation: dropdown 0.2s ease-out forwards;
//         }

//         @keyframes dropdown-nested {
//           from {
//             opacity: 0;
//             transform: translateX(-6px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-dropdown-nested {
//           animation: dropdown-nested 0.15s ease-out forwards;
//         }

//         @keyframes slide-item {
//           from {
//             opacity: 0;
//             transform: translateX(12px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-slide-item {
//           animation: slide-item 0.3s ease-out forwards;
//         }

//         @keyframes fade {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade {
//           animation: fade 0.25s ease-out forwards;
//         }

//         @keyframes backdrop {
//           from {
//             backdrop-filter: blur(0);
//             opacity: 0;
//           }
//           to {
//             backdrop-filter: blur(10px);
//             opacity: 1;
//           }
//         }
//         .animate-backdrop {
//           animation: backdrop 0.25s ease-out forwards;
//         }

//         @keyframes slide {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide {
//           animation: slide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Header;


















import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  User, Menu, ChevronDown, X, Sparkles, Bell, Search, HelpCircle,
  Settings, LogOut, Home, Building, Landmark, TrendingUp, Shield,
  DollarSign, Wrench, PaintBucket, Droplets, Heart, Star, Zap,
  CheckCircle, Award, MapPin, Globe, Phone, Mail, Calendar, Clock,
  Briefcase, Users, Briefcase as OfficeIcon, Menu as MenuIcon, LogIn, UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../../assets/logo1.png";

// Login & Register Components - lazy: only ever needed after the user
// clicks Login/Register, never on first paint.
const CustomerLogin = lazy(() => import("../login/CustomerLogin.jsx"));
const CustomerRegister = lazy(() => import('../login/CustomerRegister'));
const VendorLogin = lazy(() => import('../login/VendorLogin'));
const VendorRegister = lazy(() => import('../login/VendorRegister'));

// Posting forms (60 total, one per role/category/action) - lazy: each is
// only needed after the user picks that exact role+category+action from the
// popups below, never on first paint. Previously these were all imported
// eagerly here, which put every form's code in the app's initial bundle.

// Owner Forms
const IndRentForm = lazy(() => import("../Forms/Owner/Individual/IndRentForm.jsx"));
const IndSellForm = lazy(() => import("../Forms/Owner/Individual/IndSellForm.jsx"));
const IndLeaseForm = lazy(() => import("../Forms/Owner/Individual/IndLeaseForm.jsx"));
const ApartRentForm = lazy(() => import("../Forms/Owner/Apartment/ApartRentForm.jsx"));
const ApartSellForm = lazy(() => import("../Forms/Owner/Apartment/ApartSellForm.jsx"));
const ApartLeaseForm = lazy(() => import("../Forms/Owner/Apartment/ApartLeaseForm.jsx"));
const ComRentForm = lazy(() => import("../Forms/Owner/Commercial/ComRentForm.jsx"));
const ComSellForm = lazy(() => import("../Forms/Owner/Commercial/ComSellForm.jsx"));
const ComLeaseForm = lazy(() => import("../Forms/Owner/Commercial/ComLeaseForm.jsx"));
const RentLPForm = lazy(() => import("../Forms/Owner/LandAndPlots/RentLPForm.jsx"));
const SellLPForm = lazy(() => import("../Forms/Owner/LandAndPlots/SellLPForm.jsx"));
const LeaseLPForm = lazy(() => import("../Forms/Owner/LandAndPlots/LeaseLPForm.jsx"));
const HostelRentForm = lazy(() => import("../Forms/Owner/Hostel/HostelRentForm.jsx"));
const HostelSellForm = lazy(() => import("../Forms/Owner/Hostel/HostelSellForm.jsx"));
const HostelLeaseForm = lazy(() => import("../Forms/Owner/Hostel/HostelLeaseForm.jsx"));

// Agent Forms
const RentAgentIndForm = lazy(() => import("../Forms/Agent/Individual/RentAgentIndForm.jsx"));
const SellAgentIndForm = lazy(() => import("../Forms/Agent/Individual/SellAgentIndForm.jsx"));
const LeaseAgentIndForm = lazy(() => import("../Forms/Agent/Individual/LeaseAgentIndForm.jsx"));
const RentAgentApartForm = lazy(() => import("../Forms/Agent/Apartment/RentAgentApartForm.jsx"));
const SellAgentApartForm = lazy(() => import("../Forms/Agent/Apartment/SellAgentApartForm.jsx"));
const LeaseAgentApartForm = lazy(() => import("../Forms/Agent/Apartment/LeaseAgentApartForm.jsx"));
const RentAgentComForm = lazy(() => import("../Forms/Agent/Commercial/RentAgentComForm.jsx"));
const SellAgentComForm = lazy(() => import("../Forms/Agent/Commercial/SellAgentComForm.jsx"));
const LeaseAgentComForm = lazy(() => import("../Forms/Agent/Commercial/LeaseAgentComForm.jsx"));
const RentAgentLPForm = lazy(() => import("../Forms/Agent/LandAndPlots/RentAgentLPForm.jsx"));
const SellAgentLPForm = lazy(() => import("../Forms/Agent/LandAndPlots/SellAgentLPForm.jsx"));
const LeaseAgentLPForm = lazy(() => import("../Forms/Agent/LandAndPlots/LeaseAgentLPForm.jsx"));
const RentAgentHostelForm = lazy(() => import("../Forms/Agent/Hostel/RentAgentHostelForm.jsx"));
const SellAgentHostelForm = lazy(() => import("../Forms/Agent/Hostel/SellAgentHostelForm.jsx"));
const LeaseAgentHostelForm = lazy(() => import("../Forms/Agent/Hostel/LeaseAgentHostelForm.jsx"));

// Builder Forms
const RentBuilderIndForm = lazy(() => import("../Forms/Builder/Individual/RentBuilderIndForm.jsx"));
const SellBuilderIndForm = lazy(() => import("../Forms/Builder/Individual/SellBuilderIndForm.jsx"));
const LeaseBuilderIndForm = lazy(() => import("../Forms/Builder/Individual/LeaseBuilderIndForm.jsx"));
const RentBuilderApartForm = lazy(() => import("../Forms/Builder/Apartment/RentBuilderApartForm.jsx"));
const SellBuilderApartForm = lazy(() => import("../Forms/Builder/Apartment/SellBuilderApartForm.jsx"));
const LeaseBuilderApartForm = lazy(() => import("../Forms/Builder/Apartment/LeaseBuilderApartForm.jsx"));
const RentBuilderComForm = lazy(() => import("../Forms/Builder/Commercial/RentBuilderComForm.jsx"));
const SellBuilderComForm = lazy(() => import("../Forms/Builder/Commercial/SellBuilderComForm.jsx"));
const LeaseBuilderComForm = lazy(() => import("../Forms/Builder/Commercial/LeaseBuilderComForm.jsx"));
const RentBuilderLPForm = lazy(() => import("../Forms/Builder/LandAndPlots/RentBuilderLPForm.jsx"));
const SellBuilderLPForm = lazy(() => import("../Forms/Builder/LandAndPlots/SellBuilderLPForm.jsx"));
const LeaseBuilderLPForm = lazy(() => import("../Forms/Builder/LandAndPlots/LeaseBuilderLPForm.jsx"));
const RentBuilderHostelForm = lazy(() => import("../Forms/Builder/Hostel/RentBuilderHostelForm.jsx"));
const SellBuilderHostelForm = lazy(() => import("../Forms/Builder/Hostel/SellBuilderHostelForm.jsx"));
const LeaseBuilderHostelForm = lazy(() => import("../Forms/Builder/Hostel/LeaseBuilderHostelForm.jsx"));

// Property Management Forms
const RentPMIndForm = lazy(() => import("../Forms/PropertyManagement/Individual/RentPMIndForm.jsx"));
const SellPMIndForm = lazy(() => import("../Forms/PropertyManagement/Individual/SellPMIndForm.jsx"));
const LeasePMIndForm = lazy(() => import("../Forms/PropertyManagement/Individual/LeasePMIndForm.jsx"));
const RentPMApartForm = lazy(() => import("../Forms/PropertyManagement/Apartment/RentPMApartForm.jsx"));
const SellPMApartForm = lazy(() => import("../Forms/PropertyManagement/Apartment/SellPMApartForm.jsx"));
const LeasePMApartForm = lazy(() => import("../Forms/PropertyManagement/Apartment/LeasePMApartForm.jsx"));
const RentPMComForm = lazy(() => import("../Forms/PropertyManagement/Commercial/RentPMComForm.jsx"));
const SellPMComForm = lazy(() => import("../Forms/PropertyManagement/Commercial/SellPMComForm.jsx"));
const LeasePMComForm = lazy(() => import("../Forms/PropertyManagement/Commercial/LeasePMComForm.jsx"));
const RentPMLPForm = lazy(() => import("../Forms/PropertyManagement/LandAndPlots/RentPMLPForm.jsx"));
const SellPMLPForm = lazy(() => import("../Forms/PropertyManagement/LandAndPlots/SellPMLPForm.jsx"));
const LeasePMLPForm = lazy(() => import("../Forms/PropertyManagement/LandAndPlots/LeasePMLPForm.jsx"));
const RentPMHostelForm = lazy(() => import("../Forms/PropertyManagement/Hostel/RentPMHostelForm.jsx"));
const SellPMHostelForm = lazy(() => import("../Forms/PropertyManagement/Hostel/SellPMHostelForm.jsx"));
const LeasePMHostelForm = lazy(() => import("../Forms/PropertyManagement/Hostel/LeasePMHostelForm.jsx"));

import {storage} from "../../utils/storage.js";

const Header = ({ onPostPropertyClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  // ============ LOGIN & REGISTER STATES ============
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [loginType, setLoginType] = useState(null);
  const [registerType, setRegisterType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCustomerLogin, setShowCustomerLogin] = useState(false);
  const [showCustomerRegister, setShowCustomerRegister] = useState(false);
  const [showVendorLogin, setShowVendorLogin] = useState(false);
  const [showVendorRegister, setShowVendorRegister] = useState(false);
  
  // State for Role Selection
  const [showRoleSelectionPopup, setShowRoleSelectionPopup] = useState(false);
  
  // State for Owner forms
  const [showOwnerActionPopup, setShowOwnerActionPopup] = useState(false);
  const [showOwnerRentForm, setShowOwnerRentForm] = useState(false);
  const [showOwnerSellForm, setShowOwnerSellForm] = useState(false);
  const [showOwnerLeaseForm, setShowOwnerLeaseForm] = useState(false);

  // State for Apartment forms (Owner)
  const [showApartActionPopup, setShowApartActionPopup] = useState(false);
  const [showApartRentForm, setShowApartRentForm] = useState(false);
  const [showApartSellForm, setShowApartSellForm] = useState(false);
  const [showApartLeaseForm, setShowApartLeaseForm] = useState(false);

  // State for Commercial forms (Owner)
  const [showComActionPopup, setShowComActionPopup] = useState(false);
  const [showComRentForm, setShowComRentForm] = useState(false);
  const [showComSellForm, setShowComSellForm] = useState(false);
  const [showComLeaseForm, setShowComLeaseForm] = useState(false);

  // Land & Plots FORM STATES
  const [showLPActionPopup, setShowLPActionPopup] = useState(false);
  const [showLPRentForm, setShowLPRentForm] = useState(false);
  const [showLPSellForm, setShowLPSellForm] = useState(false);
  const [showLPLeaseForm, setShowLPLeaseForm] = useState(false);

  // Hostel FORM STATES
  const [showHostelActionPopup, setShowHostelActionPopup] = useState(false);
  const [showHostelRentForm, setShowHostelRentForm] = useState(false);
  const [showHostelSellForm, setShowHostelSellForm] = useState(false);
  const [showHostelLeaseForm, setShowHostelLeaseForm] = useState(false);

  // Agent Land & Plots
  const [showAgentLPActionPopup, setShowAgentLPActionPopup] = useState(false);
  const [showAgentLPRentForm, setShowAgentLPRentForm] = useState(false);
  const [showAgentLPSellForm, setShowAgentLPSellForm] = useState(false);
  const [showAgentLPLeaseForm, setShowAgentLPLeaseForm] = useState(false);

  // Agent Hostel
  const [showAgentHostelActionPopup, setShowAgentHostelActionPopup] = useState(false);
  const [showAgentHostelRentForm, setShowAgentHostelRentForm] = useState(false);
  const [showAgentHostelSellForm, setShowAgentHostelSellForm] = useState(false);
  const [showAgentHostelLeaseForm, setShowAgentHostelLeaseForm] = useState(false);

  // Builder Land & Plots
  const [showBuilderLPActionPopup, setShowBuilderLPActionPopup] = useState(false);
  const [showBuilderLPRentForm, setShowBuilderLPRentForm] = useState(false);
  const [showBuilderLPSellForm, setShowBuilderLPSellForm] = useState(false);
  const [showBuilderLPLeaseForm, setShowBuilderLPLeaseForm] = useState(false);

  // Builder Hostel
  const [showBuilderHostelActionPopup, setShowBuilderHostelActionPopup] = useState(false);
  const [showBuilderHostelRentForm, setShowBuilderHostelRentForm] = useState(false);
  const [showBuilderHostelSellForm, setShowBuilderHostelSellForm] = useState(false);
  const [showBuilderHostelLeaseForm, setShowBuilderHostelLeaseForm] = useState(false);

  // Property Management Land & Plots
  const [showPMLPActionPopup, setShowPMLPActionPopup] = useState(false);
  const [showPMLPRentForm, setShowPMLPRentForm] = useState(false);
  const [showPMLPSellForm, setShowPMLPSellForm] = useState(false);
  const [showPMLPLeaseForm, setShowPMLPLeaseForm] = useState(false);

  // Property Management Hostel
  const [showPMHostelActionPopup, setShowPMHostelActionPopup] = useState(false);
  const [showPMHostelRentForm, setShowPMHostelRentForm] = useState(false);
  const [showPMHostelSellForm, setShowPMHostelSellForm] = useState(false);
  const [showPMHostelLeaseForm, setShowPMHostelLeaseForm] = useState(false);

  // Agent forms
  const [showAgentActionPopup, setShowAgentActionPopup] = useState(false);
  const [showAgentRentForm, setShowAgentRentForm] = useState(false);
  const [showAgentSellForm, setShowAgentSellForm] = useState(false);
  const [showAgentLeaseForm, setShowAgentLeaseForm] = useState(false);

  // Agent Apartment forms
  const [showAgentApartActionPopup, setShowAgentApartActionPopup] = useState(false);
  const [showAgentApartRentForm, setShowAgentApartRentForm] = useState(false);
  const [showAgentApartSellForm, setShowAgentApartSellForm] = useState(false);
  const [showAgentApartLeaseForm, setShowAgentApartLeaseForm] = useState(false);

  // Agent Commercial forms
  const [showAgentComActionPopup, setShowAgentComActionPopup] = useState(false);
  const [showAgentComRentForm, setShowAgentComRentForm] = useState(false);
  const [showAgentComSellForm, setShowAgentComSellForm] = useState(false);
  const [showAgentComLeaseForm, setShowAgentComLeaseForm] = useState(false);

  // Builder forms
  const [showBuilderActionPopup, setShowBuilderActionPopup] = useState(false);
  const [showBuilderRentForm, setShowBuilderRentForm] = useState(false);
  const [showBuilderSellForm, setShowBuilderSellForm] = useState(false);
  const [showBuilderLeaseForm, setShowBuilderLeaseForm] = useState(false);

  // Builder Apartment forms
  const [showBuilderApartActionPopup, setShowBuilderApartActionPopup] = useState(false);
  const [showBuilderApartRentForm, setShowBuilderApartRentForm] = useState(false);
  const [showBuilderApartSellForm, setShowBuilderApartSellForm] = useState(false);
  const [showBuilderApartLeaseForm, setShowBuilderApartLeaseForm] = useState(false);

  // Builder Commercial forms
  const [showBuilderComActionPopup, setShowBuilderComActionPopup] = useState(false);
  const [showBuilderComRentForm, setShowBuilderComRentForm] = useState(false);
  const [showBuilderComSellForm, setShowBuilderComSellForm] = useState(false);
  const [showBuilderComLeaseForm, setShowBuilderComLeaseForm] = useState(false);

  // Property Management forms
  const [showPMActionPopup, setShowPMActionPopup] = useState(false);
  const [showPMRentForm, setShowPMRentForm] = useState(false);
  const [showPMSellForm, setShowPMSellForm] = useState(false);
  const [showPMLeaseForm, setShowPMLeaseForm] = useState(false);

  // Property Management Apartment forms
  const [showPMApartActionPopup, setShowPMApartActionPopup] = useState(false);
  const [showPMApartRentForm, setShowPMApartRentForm] = useState(false);
  const [showPMApartSellForm, setShowPMApartSellForm] = useState(false);
  const [showPMApartLeaseForm, setShowPMApartLeaseForm] = useState(false);

  // Property Management Commercial forms
  const [showPMComActionPopup, setShowPMComActionPopup] = useState(false);
  const [showPMComRentForm, setShowPMComRentForm] = useState(false);
  const [showPMComSellForm, setShowPMComSellForm] = useState(false);
  const [showPMComLeaseForm, setShowPMComLeaseForm] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");

  const [mobileDropdowns, setMobileDropdowns] = useState({
    customer: false,
    post: false,
    loan: false,
    services: false,
    profile: false,
    admin: false,
    customerSub: {},
    postSub: {}
  });
  
  // Refs for dropdown containers
  const dropdownRefs = {
    admin: useRef(null),
    profile: useRef(null),
    customer: useRef(null),
    post: useRef(null),
    loan: useRef(null),
    services: useRef(null)
  };
  
  // Timer refs for hover delay
  const hoverTimerRef = useRef(null);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const customerPortalMenu = {
    "Individual": ["Rent", "Buy", "Lease", "Sell"],
    "Apartment": ["Rent", "Buy", "Lease", "Sell"],
    "Commercial": ["Rent", "Buy", "Lease", "Sell"],
    "Land & Plots": ["Rent", "Buy", "Lease", "Sell"],
    "Hostel": ["Rent", "Buy", "Lease", "Sell"],
  };

  const postPropertyMenu = {
    "Owner": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
    "Agent": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
    "Builder": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
    "Property Management": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
  };

  const loanMenu = [
    "Home Loan",
    "Property Loan",
    "Construction Loan",
    "Plot Loan",
    "Commercial Loan"
  ];

  const servicesMenu = [
    "Construction",
    "Interior",
    "Painting",
    "Plumbing",
    "Cleaning"
  ];

  const profileMenu = [
    { label: "Owner", icon: "👤", path: "/profile/owner" },
    { label: "Agent", icon: "🏢", path: "/profile/agent" },
    { label: "Builder", icon: "🏗️", path: "/profile/builder" },
    { label: "Property Management", icon: "🏢", path: "/profile/property-management" }
  ];

  const adminMenu = [
    { 
      label: "Admin", 
      icon: <Users className="w-4 h-4" />, 
      path: "/admin",
      description: "Admin Panel"
    },
    { 
      label: "Office", 
      icon: <OfficeIcon className="w-4 h-4" />, 
      path: "/office",
      description: "Office Dashboard"
    }
  ];

  // Decode JWT token and set user data
  useEffect(() => {
    const token = storage.get("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
        setUserRole(decoded?.role || null);
        setIsLoggedIn(true);
        console.log("User Role:", decoded?.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole(null);
        setIsLoggedIn(false);
      }
    } else {
      setUserRole(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideAll = Object.values(dropdownRefs).every(ref => 
        ref.current && !ref.current.contains(event.target)
      );
      
      if (isOutsideAll && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Clean up hover timer
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  // ============ LOGIN & REGISTER HANDLERS ============
  const handleLoginClick = () => {
    setShowLoginPopup(true);
    setUserMenuOpen(false);
  };

  const handleRegisterClick = () => {
    setShowRegisterPopup(true);
    setUserMenuOpen(false);
  };

  const handleLoginTypeSelect = (type) => {
    setLoginType(type);
    setShowLoginPopup(false);
    if (type === 'customer') {
      setShowCustomerLogin(true);
    } else if (type === 'vendor') {
      setShowVendorLogin(true);
    }
  };

  const handleRegisterTypeSelect = (type) => {
    setRegisterType(type);
    setShowRegisterPopup(false);
    if (type === 'customer') {
      setShowCustomerRegister(true);
    } else if (type === 'vendor') {
      setShowVendorRegister(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUserRole(null);
    setUserData(null);
    navigate('/');
  };

  // Handle profile navigation
  const handleProfileNavigation = (path) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Handle admin navigation
  const handleAdminNavigation = (path) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigate(path);
  };

  // ============ LAND & PLOTS HANDLERS (OWNER) ============
  const handleLPActionClick = (action) => {
    setShowLPActionPopup(false);
    switch(action) {
      case "Rent":
        setShowLPRentForm(true);
        break;
      case "Sell":
        setShowLPSellForm(true);
        break;
      case "Lease":
        setShowLPLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // ============ LAND & PLOTS HANDLERS (AGENT) ============
  const handleAgentLPActionClick = (action) => {
    setShowAgentLPActionPopup(false);
    switch(action) {
      case "Rent":
        setShowAgentLPRentForm(true);
        break;
      case "Sell":
        setShowAgentLPSellForm(true);
        break;
      case "Lease":
        setShowAgentLPLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // ============ LAND & PLOTS HANDLERS (BUILDER) ============
  const handleBuilderLPActionClick = (action) => {
    setShowBuilderLPActionPopup(false);
    switch(action) {
      case "Rent":
        setShowBuilderLPRentForm(true);
        break;
      case "Sell":
        setShowBuilderLPSellForm(true);
        break;
      case "Lease":
        setShowBuilderLPLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // ============ LAND & PLOTS HANDLERS (PROPERTY MANAGEMENT) ============
  const handlePMLPActionClick = (action) => {
    setShowPMLPActionPopup(false);
    switch(action) {
      case "Rent":
        setShowPMLPRentForm(true);
        break;
      case "Sell":
        setShowPMLPSellForm(true);
        break;
      case "Lease":
        setShowPMLPLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // ============ HOSTEL HANDLERS (OWNER) ============
  const handleHostelActionClick = (action) => {
    setShowHostelActionPopup(false);
    switch(action) {
      case "Rent":
        setShowHostelRentForm(true);
        break;
      case "Sell":
        setShowHostelSellForm(true);
        break;
      case "Lease":
        setShowHostelLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // ============ HOSTEL HANDLERS (AGENT) ============
  const handleAgentHostelActionClick = (action) => {
    setShowAgentHostelActionPopup(false);
    switch(action) {
      case "Rent":
        setShowAgentHostelRentForm(true);
        break;
      case "Sell":
        setShowAgentHostelSellForm(true);
        break;
      case "Lease":
        setShowAgentHostelLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // ============ HOSTEL HANDLERS (BUILDER) ============
  const handleBuilderHostelActionClick = (action) => {
    setShowBuilderHostelActionPopup(false);
    switch(action) {
      case "Rent":
        setShowBuilderHostelRentForm(true);
        break;
      case "Sell":
        setShowBuilderHostelSellForm(true);
        break;
      case "Lease":
        setShowBuilderHostelLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // ============ HOSTEL HANDLERS (PROPERTY MANAGEMENT) ============
  const handlePMHostelActionClick = (action) => {
    setShowPMHostelActionPopup(false);
    switch(action) {
      case "Rent":
        setShowPMHostelRentForm(true);
        break;
      case "Sell":
        setShowPMHostelSellForm(true);
        break;
      case "Lease":
        setShowPMHostelLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Post Property submenu click
  const handlePostSubmenuClick = (role, propertyType) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setSelectedRole(role);
    setSelectedPropertyType(propertyType);

    // ============ LAND & PLOTS HANDLING ============
    if (propertyType === "Land & Plots") {
      if (role === "Owner") {
        setShowLPActionPopup(true);
      } else if (role === "Agent") {
        setShowAgentLPActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderLPActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMLPActionPopup(true);
      } else {
        setShowRoleSelectionPopup(true);
      }
      return;
    }

    // ============ HOSTEL HANDLING ============
    if (propertyType === "Hostel") {
      if (role === "Owner") {
        setShowHostelActionPopup(true);
      } else if (role === "Agent") {
        setShowAgentHostelActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderHostelActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMHostelActionPopup(true);
      } else {
        setShowRoleSelectionPopup(true);
      }
      return;
    }

    // Existing property type handling...
    if (propertyType === "Individual") {
      if (role === "Agent") {
        setShowAgentActionPopup(true);
      } else if (role === "Owner") {
        setShowOwnerActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMActionPopup(true);
      } else {
        setShowRoleSelectionPopup(true);
      }
    } else if (propertyType === "Apartment") {
      if (role === "Agent") {
        setShowAgentApartActionPopup(true);
      } else if (role === "Owner") {
        setShowApartActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderApartActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMApartActionPopup(true);
      } else {
        setShowRoleSelectionPopup(true);
      }
    } else if (propertyType === "Commercial") {
      if (role === "Owner") {
        setShowComActionPopup(true);
      } else if (role === "Agent") {
        setShowAgentComActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderComActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMComActionPopup(true);
      } else {
        setShowRoleSelectionPopup(true);
      }
    } else {
      // Fallback
      setShowRoleSelectionPopup(true);
    }
  };

  const handleRoleSelect = (role) => {
    setShowRoleSelectionPopup(false);
    setSelectedRole(role);
    
    // ============ LAND & PLOTS HANDLING ============
    if (selectedPropertyType === "Land & Plots") {
      if (role === "Owner") {
        setShowLPActionPopup(true);
      } else if (role === "Agent") {
        setShowAgentLPActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderLPActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMLPActionPopup(true);
      }
      return;
    }

    // ============ HOSTEL HANDLING ============
    if (selectedPropertyType === "Hostel") {
      if (role === "Owner") {
        setShowHostelActionPopup(true);
      } else if (role === "Agent") {
        setShowAgentHostelActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderHostelActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMHostelActionPopup(true);
      }
      return;
    }

    // Existing role handling...
    if (selectedPropertyType === "Individual") {
      if (role === "Owner") {
        setShowOwnerActionPopup(true);
      } else if (role === "Agent") {
        setShowAgentActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMActionPopup(true);
      }
    } else if (selectedPropertyType === "Apartment") {
      if (role === "Owner") {
        setShowApartActionPopup(true);
      } else if (role === "Agent") {
        setShowAgentApartActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderApartActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMApartActionPopup(true);
      }
    } else if (selectedPropertyType === "Commercial") {
      if (role === "Owner") {
        setShowComActionPopup(true);
      } else if (role === "Agent") {
        setShowAgentComActionPopup(true);
      } else if (role === "Builder") {
        setShowBuilderComActionPopup(true);
      } else if (role === "Property Management") {
        setShowPMComActionPopup(true);
      }
    }
  };

  // Handle Owner action button clicks (Rent, Sell, Lease)
  const handleOwnerActionClick = (action) => {
    setShowOwnerActionPopup(false);
    switch(action) {
      case "Rent":
        setShowOwnerRentForm(true);
        break;
      case "Sell":
        setShowOwnerSellForm(true);
        break;
      case "Lease":
        setShowOwnerLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Apartment action button clicks (Rent, Sell, Lease)
  const handleApartActionClick = (action) => {
    setShowApartActionPopup(false);
    switch(action) {
      case "Rent":
        setShowApartRentForm(true);
        break;
      case "Sell":
        setShowApartSellForm(true);
        break;
      case "Lease":
        setShowApartLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Commercial action button clicks (Rent, Sell, Lease)
  const handleComActionClick = (action) => {
    setShowComActionPopup(false);
    switch(action) {
      case "Rent":
        setShowComRentForm(true);
        break;
      case "Sell":
        setShowComSellForm(true);
        break;
      case "Lease":
        setShowComLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Agent action button clicks (Rent, Sell, Lease)
  const handleAgentActionClick = (action) => {
    setShowAgentActionPopup(false);
    switch(action) {
      case "Rent":
        setShowAgentRentForm(true);
        break;
      case "Sell":
        setShowAgentSellForm(true);
        break;
      case "Lease":
        setShowAgentLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Agent Apartment action button clicks (Rent, Sell, Lease)
  const handleAgentApartActionClick = (action) => {
    setShowAgentApartActionPopup(false);
    switch(action) {
      case "Rent":
        setShowAgentApartRentForm(true);
        break;
      case "Sell":
        setShowAgentApartSellForm(true);
        break;
      case "Lease":
        setShowAgentApartLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Agent Commercial action button clicks (Rent, Sell, Lease)
  const handleAgentComActionClick = (action) => {
    setShowAgentComActionPopup(false);
    switch(action) {
      case "Rent":
        setShowAgentComRentForm(true);
        break;
      case "Sell":
        setShowAgentComSellForm(true);
        break;
      case "Lease":
        setShowAgentComLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Builder action button clicks (Rent, Sell, Lease)
  const handleBuilderActionClick = (action) => {
    setShowBuilderActionPopup(false);
    switch(action) {
      case "Rent":
        setShowBuilderRentForm(true);
        break;
      case "Sell":
        setShowBuilderSellForm(true);
        break;
      case "Lease":
        setShowBuilderLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Builder Apartment action button clicks (Rent, Sell, Lease)
  const handleBuilderApartActionClick = (action) => {
    setShowBuilderApartActionPopup(false);
    switch(action) {
      case "Rent":
        setShowBuilderApartRentForm(true);
        break;
      case "Sell":
        setShowBuilderApartSellForm(true);
        break;
      case "Lease":
        setShowBuilderApartLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Builder Commercial action button clicks (Rent, Sell, Lease)
  const handleBuilderComActionClick = (action) => {
    setShowBuilderComActionPopup(false);
    switch(action) {
      case "Rent":
        setShowBuilderComRentForm(true);
        break;
      case "Sell":
        setShowBuilderComSellForm(true);
        break;
      case "Lease":
        setShowBuilderComLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Property Management action button clicks (Rent, Sell, Lease)
  const handlePMActionClick = (action) => {
    setShowPMActionPopup(false);
    switch(action) {
      case "Rent":
        setShowPMRentForm(true);
        break;
      case "Sell":
        setShowPMSellForm(true);
        break;
      case "Lease":
        setShowPMLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Property Management Apartment action button clicks (Rent, Sell, Lease)
  const handlePMApartActionClick = (action) => {
    setShowPMApartActionPopup(false);
    switch(action) {
      case "Rent":
        setShowPMApartRentForm(true);
        break;
      case "Sell":
        setShowPMApartSellForm(true);
        break;
      case "Lease":
        setShowPMApartLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Property Management Commercial action button clicks (Rent, Sell, Lease)
  const handlePMComActionClick = (action) => {
    setShowPMComActionPopup(false);
    switch(action) {
      case "Rent":
        setShowPMComRentForm(true);
        break;
      case "Sell":
        setShowPMComSellForm(true);
        break;
      case "Lease":
        setShowPMComLeaseForm(true);
        break;
      default:
        break;
    }
  };

  const handleCustomerPortalClick = (type) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    
    const typeKey = type.toLowerCase().replace(/\s+/g, '-');
    
    if (typeKey === "individual") {
      navigate("/individual");
    } else if (typeKey === "rent") {
      navigate("/rent");
    } else if (typeKey === "buy") {
      navigate("/buy");
    } else if (typeKey === "lease") {
      navigate("/lease");
    } else if (typeKey === "sell") {
      navigate("/sell");
    } else if (typeKey === "apartment") {
      navigate("/apartment");
    } else if (typeKey === "commercial") {
      navigate("/commercial");
    } else if (typeKey === "land-&-plots") {
      navigate("/land-plots");
    } else if (typeKey === "hostel") {
      navigate("/hostel");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setMobileDropdowns({
        customer: false,
        post: false,
        loan: false,
        services: false,
        profile: false,
        admin: false,
        customerSub: {},
        postSub: {}
      });
    }
  };

  const toggleMobileDropdown = (key) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleCustomerSub = (key) => {
    setMobileDropdowns(prev => ({
      ...prev,
      customerSub: {
        ...prev.customerSub,
        [key]: !prev.customerSub[key]
      }
    }));
  };

  const togglePostSub = (key) => {
    setMobileDropdowns(prev => ({
      ...prev,
      postSub: {
        ...prev.postSub,
        [key]: !prev.postSub[key]
      }
    }));
  };

  // Dropdown handlers with improved logic
  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownEnter = (dropdown) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = (e, dropdown) => {
    const relatedTarget = e.relatedTarget;
    const currentRef = dropdownRefs[dropdown];
    
    if (currentRef && currentRef.current && relatedTarget) {
      if (currentRef.current.contains(relatedTarget)) {
        return;
      }
    }
    
    hoverTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
      hoverTimerRef.current = null;
    }, 100);
  };

  // Determine if user is logged in and their role
  const isVendor = userRole === "vendor";
  const isAdmin = userRole === "admin";
  const isUser = userRole === "user";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-gradient-to-r from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl shadow-2xl shadow-[#00695C]/20' 
          : 'bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C]'
      }`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 12}s`,
              }}
            />
          ))}
          
          <div className="absolute bottom-0 left-0 right-0 h-8">
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent animate-wave-slow" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

        <div className="h-[72px] md:h-[84px] w-full px-3 md:px-6 flex items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03] animate-sweep" />
          
          <div className="flex items-center justify-between w-full relative z-10">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
              </button>

              <div
                onClick={() => navigate("/")}
                className="cursor-pointer group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative w-13 h-13 md:w-[76px] md:h-[76px] rounded-full overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#004D40] to-[#00695C] opacity-80" />
                  <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#26A69A]/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 via-transparent to-[#00FF88]/20 animate-spin-slow rounded-full" />
                  
                  <img
                    src={logo}
                    alt="Eliteinova Properties Logo"
                    className="w-11 h-11 md:w-[60px] md:h-[60px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                  />
                </div>
              </div>

              <div 
                onClick={() => navigate("/")} 
                className="cursor-pointer group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#00FF88]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <h1
                  className="text-lg md:text-2xl lg:text-3xl font-light leading-tight relative tracking-wide"
                  style={{
                    fontFamily: "Pacifico, cursive",
                    color: "#E8F5E9",
                    textShadow: '0 2px 16px rgba(0, 229, 255, 0.2)',
                    fontWeight: 150,
                  }}
                >
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-500">
                    Eliteinova <span className="text-[0.75em]">Properties</span>
                    <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00E5FF]/20 via-[#00FF88]/20 to-[#00E5FF]/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700" />
                  </span>
                </h1>
                
                <p 
                  className="text-[11px] md:text-sm lg:text-base font-light leading-tight mt-0 flex items-center gap-2"
                  style={{
                    fontFamily: "Pacifico, cursive",
                    color: "#C8E6C9",
                    fontWeight: 300,
                  }}
                >
                  <span className="relative whitespace-nowrap">
                    No Brokerage
                    <Sparkles className="absolute -right-5 -top-0.5 w-3 h-3 text-yellow-300 animate-sparkle-glow" />
                  </span>
                  <span className="text-[8px] md:text-[10px] bg-gradient-to-r from-[#00FF88]/20 to-[#00E5FF]/20 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-sm">
                    ⭐ Trusted
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
              <div ref={searchRef} className="relative">
                {/* Search button - commented out but can be enabled */}
              </div>

              {/* ============ LOGIN & REGISTER BUTTONS ============ */}
              {!isLoggedIn ? (
                <div className="flex items-center gap-1.5 md:gap-2">
                  <button
                    onClick={handleLoginClick}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium text-white bg-gradient-to-r from-[#00E5FF]/20 to-[#00FF88]/20 hover:from-[#00E5FF]/40 hover:to-[#00FF88]/40 border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-1.5 hover:scale-105 shadow-lg shadow-[#00E5FF]/10"
                  >
                    <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Login
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium text-[#00695C] bg-gradient-to-r from-[#FFEB3B] to-[#FF9800] hover:from-[#FFD54F] hover:to-[#FFA726] transition-all duration-300 flex items-center gap-1.5 hover:scale-105 shadow-lg shadow-orange-500/30"
                  >
                    <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Register
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Admin Hamburger Dropdown - Only visible to admin */}
                  {isAdmin && (
                    <div
                      ref={dropdownRefs.admin}
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter("admin")}
                      onMouseLeave={(e) => handleDropdownLeave(e, "admin")}
                    >
                      <button 
                        className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-[#26A69A]/30 backdrop-blur-sm hover:bg-[#26A69A]/50 transition-all duration-300 border border-white/20 hover:border-white/40"
                        onClick={() => handleDropdownToggle("admin")}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30 group-hover:scale-110 transition-transform duration-300">
                          <MenuIcon className="w-4 h-4 text-white" />
                        </div>
                      </button>

                      {activeDropdown === "admin" && (
                        <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[200px] border border-white/30 animate-dropdown overflow-hidden">
                          <div className="p-2">
                            {adminMenu.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleAdminNavigation(item.path)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex items-center justify-center text-[#00695C] group-hover:scale-110 transition-transform duration-300">
                                  {item.icon}
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00695C] transition-colors">
                                    {item.label}
                                  </span>
                                  <span className="text-[10px] text-gray-500">{item.description}</span>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-[#00695C] transition-colors -rotate-90" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Profile Dropdown - Only visible to logged in users */}
                  <div
                    ref={dropdownRefs.profile}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter("profile")}
                    onMouseLeave={(e) => handleDropdownLeave(e, "profile")}
                  >
                    <button 
                      className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
                      onClick={() => handleDropdownToggle("profile")}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium text-sm">
                        {isVendor ? "Vendor" : isAdmin ? "Admin" : "User"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${activeDropdown === "profile" ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === "profile" && (
                      <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[220px] border border-white/30 animate-dropdown overflow-hidden">
                        <div className="p-2">
                          {/* Show user info at top */}
                          <div className="px-4 py-2 mb-1 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">
                              {userData?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              Role: {userRole}
                            </p>
                          </div>

                          {isVendor && (
                            <>
                              {profileMenu.map((item, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleProfileNavigation(item.path)}
                                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 group"
                                >
                                  <span className="text-xl">{item.icon}</span>
                                  <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00695C] transition-colors">
                                    {item.label}
                                  </span>
                                  <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-[#00695C] transition-colors -rotate-90" />
                                </button>
                              ))}
                            </>
                          )}
                          
                          <div className="border-t border-gray-200/50 my-1"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-red-50 to-pink-50 transition-all duration-300 group"
                          >
                            <LogOut className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-semibold text-red-600">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="hidden md:flex h-12 items-center relative bg-gradient-to-r from-[#004D40]/90 via-[#00796B]/90 to-[#004D40]/90 backdrop-blur-sm border-t border-white/5">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow" />
          </div>
          
          <div className="flex items-center h-full relative z-10">
            <button
              onClick={() => {
                navigate("/");
                setActiveTab("home");
              }}
              className={`group relative px-5 h-full text-white font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden ${
                activeTab === "home" 
                  ? 'bg-gradient-to-r from-white/10 to-transparent' 
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="flex items-center gap-2 relative z-10">
                <Home className="w-4 h-4" />
                Home
              </span>
              
              {activeTab === "home" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse-glow" />
              )}
            </button>

            <div
              ref={dropdownRefs.customer}
              className="relative h-full"
              onMouseEnter={() => handleDropdownEnter("customer")}
              onMouseLeave={(e) => handleDropdownLeave(e, "customer")}
            >
              <button 
                onClick={() => navigate("/customer-portal")}
                className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
              >
                <Building className="w-4 h-4" />
                <span>Customer Portal</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "customer" ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === "customer" && (
                <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
                  {Object.entries(customerPortalMenu).map(([key, submenu]) => (
                    <div key={key} className="relative group/item">
                      <button 
                        onClick={() => handleCustomerPortalClick(key)}
                        className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 capitalize"
                      >
                        {key}
                      </button>
                      <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[160px] z-50 border border-white/30 animate-dropdown-nested">
                        {submenu.map((item) => (
                          <button
                            key={item}
                            onClick={() => handleCustomerPortalClick(item.toLowerCase())}
                            className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post Property - Only visible to vendors and admins */}
            {(isVendor || isAdmin) && (
              <div
                ref={dropdownRefs.post}
                className="relative h-full"
                onMouseEnter={() => handleDropdownEnter("post")}
                onMouseLeave={(e) => handleDropdownLeave(e, "post")}
              >
                <button
                  onClick={() => navigate("/post-property")}
                  className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Post Property</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "post" ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === "post" && (
                  <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[190px] border border-white/30 animate-dropdown">
                    {Object.entries(postPropertyMenu).map(([role, submenu]) => (
                      <div key={role} className="relative group/item">
                        <button
                          className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 flex items-center justify-between gap-3"
                        >
                          {role}
                          <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-gray-400" />
                        </button>
                        <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[170px] z-50 border border-white/30 animate-dropdown-nested">
                          {submenu.map((propertyType) => (
                            <button
                              key={propertyType}
                              onClick={() => handlePostSubmenuClick(role, propertyType)}
                              className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
                            >
                              {propertyType}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div
              ref={dropdownRefs.loan}
              className="relative h-full"
              onMouseEnter={() => handleDropdownEnter("loan")}
              onMouseLeave={(e) => handleDropdownLeave(e, "loan")}
            >
              <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
                <Landmark className="w-4 h-4" />
                <span>Find Loan</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "loan" ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === "loan" && (
                <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
                  {loanMenu.map((item) => (
                    <button
                      key={item}
                      className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              ref={dropdownRefs.services}
              className="relative h-full"
              onMouseEnter={() => handleDropdownEnter("services")}
              onMouseLeave={(e) => handleDropdownLeave(e, "services")}
            >
              <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
                <Settings className="w-4 h-4" />
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "services" ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === "services" && (
                <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[160px] border border-white/30 animate-dropdown">
                  {servicesMenu.map((item) => (
                    <button
                      key={item}
                      className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div> 
        </nav>
      </header>

      {/* ============ LOGIN POPUP ============ */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowLoginPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Login as
              </h2>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Choose your role to continue
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleLoginTypeSelect('customer')}
                className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Customer</div>
                <div className="text-xs text-gray-500 mt-1">Looking for properties</div>
              </button>

              <button
                onClick={() => handleLoginTypeSelect('vendor')}
                className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 transition-all duration-300 group"
              >
                <div className="text-3xl mb-2">🏢</div>
                <div className="font-bold text-emerald-700 group-hover:text-emerald-900">Vendor</div>
                <div className="text-xs text-gray-500 mt-1">Sell or rent properties</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ REGISTER POPUP ============ */}
      {showRegisterPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowRegisterPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Register as
              </h2>
              <button
                onClick={() => setShowRegisterPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Choose your role to get started
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRegisterTypeSelect('customer')}
                className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Customer</div>
                <div className="text-xs text-gray-500 mt-1">Find your dream property</div>
              </button>

              <button
                onClick={() => handleRegisterTypeSelect('vendor')}
                className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 transition-all duration-300 group"
              >
                <div className="text-3xl mb-2">🏢</div>
                <div className="font-bold text-emerald-700 group-hover:text-emerald-900">Vendor</div>
                <div className="text-xs text-gray-500 mt-1">List your properties</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ LOGIN / REGISTER MODALS ============
          Lazy + conditionally mounted: each modal's chunk is only fetched
          once the user actually opens it, not on every page load. */}
      <Suspense fallback={null}>
        {showCustomerLogin && (
          <CustomerLogin
            isOpen={showCustomerLogin}
            onClose={() => setShowCustomerLogin(false)}
            onSwitchToRegister={() => {
              setShowCustomerLogin(false);
              setShowCustomerRegister(true);
            }}
          />
        )}

        {showCustomerRegister && (
          <CustomerRegister
            isOpen={showCustomerRegister}
            onClose={() => setShowCustomerRegister(false)}
            onSwitchToLogin={() => {
              setShowCustomerRegister(false);
              setShowCustomerLogin(true);
            }}
          />
        )}

        {showVendorLogin && (
          <VendorLogin
            isOpen={showVendorLogin}
            onClose={() => setShowVendorLogin(false)}
            onSwitchToRegister={() => {
              setShowVendorLogin(false);
              setShowVendorRegister(true);
            }}
          />
        )}

        {showVendorRegister && (
          <VendorRegister
            isOpen={showVendorRegister}
            onClose={() => setShowVendorRegister(false)}
            onSwitchToLogin={() => {
              setShowVendorRegister(false);
              setShowVendorLogin(true);
            }}
          />
        )}
      </Suspense>

      {/* ============ ROLE SELECTION POPUP ============ */}
      {showRoleSelectionPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowRoleSelectionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Select Role
              </h2>
              <button
                onClick={() => setShowRoleSelectionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedPropertyType} Property: Who is listing this property?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleRoleSelect("Owner")}
                className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">👤</div>
                <div className="font-bold text-emerald-700 group-hover:text-emerald-900">Owner</div>
                <div className="text-[10px] text-gray-500">Individual owner</div>
              </button>

              <button
                onClick={() => handleRoleSelect("Agent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Agent</div>
                <div className="text-[10px] text-gray-500">Professional agent</div>
              </button>

              <button
                onClick={() => handleRoleSelect("Builder")}
                className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏗️</div>
                <div className="font-bold text-amber-700 group-hover:text-amber-900">Builder</div>
                <div className="text-[10px] text-gray-500">Builder/Developer</div>
              </button>

              <button
                onClick={() => handleRoleSelect("Property Management")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Property Management</div>
                <div className="text-[10px] text-gray-500">Property management company</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ OWNER INDIVIDUAL ACTION POPUP ============ */}
      {showOwnerActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowOwnerActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <User className="w-5 h-5" />
                Owner - Choose Action
              </h2>
              <button
                onClick={() => setShowOwnerActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Individual Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleOwnerActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleOwnerActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleOwnerActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ OWNER APARTMENT ACTION POPUP ============ */}
      {showApartActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowApartActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Owner - Apartment Action
              </h2>
              <button
                onClick={() => setShowApartActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Apartment: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleApartActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleApartActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleApartActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ OWNER COMMERCIAL ACTION POPUP ============ */}
      {showComActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowComActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Owner - Commercial Action
              </h2>
              <button
                onClick={() => setShowComActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Commercial Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleComActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleComActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleComActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ LAND & PLOTS ACTION POPUP (OWNER) ============ */}
      {showLPActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowLPActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Owner - Land & Plots Action
              </h2>
              <button
                onClick={() => setShowLPActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Land & Plots Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleLPActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏞️</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleLPActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleLPActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ LAND & PLOTS ACTION POPUP (AGENT) ============ */}
      {showAgentLPActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentLPActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Agent - Land & Plots Action
              </h2>
              <button
                onClick={() => setShowAgentLPActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Land & Plots Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAgentLPActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏞️</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleAgentLPActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleAgentLPActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ LAND & PLOTS ACTION POPUP (BUILDER) ============ */}
      {showBuilderLPActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderLPActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Builder - Land & Plots Action
              </h2>
              <button
                onClick={() => setShowBuilderLPActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Land & Plots Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleBuilderLPActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏞️</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleBuilderLPActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleBuilderLPActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ LAND & PLOTS ACTION POPUP (PROPERTY MANAGEMENT) ============ */}
      {showPMLPActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMLPActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Management - Land & Plots Action
              </h2>
              <button
                onClick={() => setShowPMLPActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Land & Plots Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePMLPActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏞️</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handlePMLPActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handlePMLPActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ HOSTEL ACTION POPUP (OWNER) ============ */}
      {showHostelActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowHostelActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Owner - Hostel Action
              </h2>
              <button
                onClick={() => setShowHostelActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Hostel Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleHostelActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏨</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleHostelActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleHostelActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ HOSTEL ACTION POPUP (AGENT) ============ */}
      {showAgentHostelActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentHostelActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Agent - Hostel Action
              </h2>
              <button
                onClick={() => setShowAgentHostelActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Hostel Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAgentHostelActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏨</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleAgentHostelActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleAgentHostelActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ HOSTEL ACTION POPUP (BUILDER) ============ */}
      {showBuilderHostelActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderHostelActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Builder - Hostel Action
              </h2>
              <button
                onClick={() => setShowBuilderHostelActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Hostel Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleBuilderHostelActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏨</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleBuilderHostelActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleBuilderHostelActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ HOSTEL ACTION POPUP (PROPERTY MANAGEMENT) ============ */}
      {showPMHostelActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMHostelActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Management - Hostel Action
              </h2>
              <button
                onClick={() => setShowPMHostelActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Hostel Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePMHostelActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏨</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handlePMHostelActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handlePMHostelActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ AGENT INDIVIDUAL ACTION POPUP ============ */}
      {showAgentActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Agent - Choose Action
              </h2>
              <button
                onClick={() => setShowAgentActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Individual Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAgentActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleAgentActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleAgentActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ AGENT APARTMENT ACTION POPUP ============ */}
      {showAgentApartActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentApartActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Agent - Apartment Action
              </h2>
              <button
                onClick={() => setShowAgentApartActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Apartment: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAgentApartActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleAgentApartActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleAgentApartActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ AGENT COMMERCIAL ACTION POPUP ============ */}
      {showAgentComActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentComActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Agent - Commercial Action
              </h2>
              <button
                onClick={() => setShowAgentComActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Commercial Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAgentComActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleAgentComActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleAgentComActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ BUILDER INDIVIDUAL ACTION POPUP ============ */}
      {showBuilderActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Builder - Choose Action
              </h2>
              <button
                onClick={() => setShowBuilderActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Individual Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleBuilderActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleBuilderActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleBuilderActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ BUILDER APARTMENT ACTION POPUP ============ */}
      {showBuilderApartActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderApartActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Builder - Apartment Action
              </h2>
              <button
                onClick={() => setShowBuilderApartActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Apartment: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleBuilderApartActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleBuilderApartActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleBuilderApartActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ BUILDER COMMERCIAL ACTION POPUP ============ */}
      {showBuilderComActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderComActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Builder - Commercial Action
              </h2>
              <button
                onClick={() => setShowBuilderComActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Commercial Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleBuilderComActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleBuilderComActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleBuilderComActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ PROPERTY MANAGEMENT INDIVIDUAL ACTION POPUP ============ */}
      {showPMActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Management - Choose Action
              </h2>
              <button
                onClick={() => setShowPMActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Individual Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePMActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handlePMActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handlePMActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ PROPERTY MANAGEMENT APARTMENT ACTION POPUP ============ */}
      {showPMApartActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMApartActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Management - Apartment Action
              </h2>
              <button
                onClick={() => setShowPMApartActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Apartment: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePMApartActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handlePMApartActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handlePMApartActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ PROPERTY MANAGEMENT COMMERCIAL ACTION POPUP ============ */}
      {showPMComActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMComActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Management - Commercial Action
              </h2>
              <button
                onClick={() => setShowPMComActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Commercial Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePMComActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handlePMComActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handlePMComActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ RENDER ALL FORMS ============
          Lazy + conditionally mounted: only the one form the user actually
          picked from the popups above ever gets its chunk fetched/mounted. */}
      <Suspense fallback={null}>
      {/* Owner Forms */}
      {showOwnerRentForm && <IndRentForm isOpen onClose={() => setShowOwnerRentForm(false)} />}
      {showOwnerSellForm && <IndSellForm isOpen onClose={() => setShowOwnerSellForm(false)} />}
      {showOwnerLeaseForm && <IndLeaseForm isOpen onClose={() => setShowOwnerLeaseForm(false)} />}

      {showApartRentForm && <ApartRentForm isOpen onClose={() => setShowApartRentForm(false)} />}
      {showApartSellForm && <ApartSellForm isOpen onClose={() => setShowApartSellForm(false)} />}
      {showApartLeaseForm && <ApartLeaseForm isOpen onClose={() => setShowApartLeaseForm(false)} />}

      {showComRentForm && <ComRentForm isOpen onClose={() => setShowComRentForm(false)} />}
      {showComSellForm && <ComSellForm isOpen onClose={() => setShowComSellForm(false)} />}
      {showComLeaseForm && <ComLeaseForm isOpen onClose={() => setShowComLeaseForm(false)} />}

      {/* LAND & PLOTS FORMS (OWNER) */}
      {showLPRentForm && <RentLPForm isOpen onClose={() => setShowLPRentForm(false)} />}
      {showLPSellForm && <SellLPForm isOpen onClose={() => setShowLPSellForm(false)} />}
      {showLPLeaseForm && <LeaseLPForm isOpen onClose={() => setShowLPLeaseForm(false)} />}

      {/* LAND & PLOTS FORMS (AGENT) */}
      {showAgentLPRentForm && <RentAgentLPForm isOpen onClose={() => setShowAgentLPRentForm(false)} />}
      {showAgentLPSellForm && <SellAgentLPForm isOpen onClose={() => setShowAgentLPSellForm(false)} />}
      {showAgentLPLeaseForm && <LeaseAgentLPForm isOpen onClose={() => setShowAgentLPLeaseForm(false)} />}

      {/* LAND & PLOTS FORMS (BUILDER) */}
      {showBuilderLPRentForm && <RentBuilderLPForm isOpen onClose={() => setShowBuilderLPRentForm(false)} />}
      {showBuilderLPSellForm && <SellBuilderLPForm isOpen onClose={() => setShowBuilderLPSellForm(false)} />}
      {showBuilderLPLeaseForm && <LeaseBuilderLPForm isOpen onClose={() => setShowBuilderLPLeaseForm(false)} />}

      {/* LAND & PLOTS FORMS (PROPERTY MANAGEMENT) */}
      {showPMLPRentForm && <RentPMLPForm isOpen onClose={() => setShowPMLPRentForm(false)} />}
      {showPMLPSellForm && <SellPMLPForm isOpen onClose={() => setShowPMLPSellForm(false)} />}
      {showPMLPLeaseForm && <LeasePMLPForm isOpen onClose={() => setShowPMLPLeaseForm(false)} />}

      {/* HOSTEL FORMS (OWNER) */}
      {showHostelRentForm && <HostelRentForm isOpen onClose={() => setShowHostelRentForm(false)} />}
      {showHostelSellForm && <HostelSellForm isOpen onClose={() => setShowHostelSellForm(false)} />}
      {showHostelLeaseForm && <HostelLeaseForm isOpen onClose={() => setShowHostelLeaseForm(false)} />}

      {/* HOSTEL FORMS (AGENT) */}
      {showAgentHostelRentForm && <RentAgentHostelForm isOpen onClose={() => setShowAgentHostelRentForm(false)} />}
      {showAgentHostelSellForm && <SellAgentHostelForm isOpen onClose={() => setShowAgentHostelSellForm(false)} />}
      {showAgentHostelLeaseForm && <LeaseAgentHostelForm isOpen onClose={() => setShowAgentHostelLeaseForm(false)} />}

      {/* HOSTEL FORMS (BUILDER) */}
      {showBuilderHostelRentForm && <RentBuilderHostelForm isOpen onClose={() => setShowBuilderHostelRentForm(false)} />}
      {showBuilderHostelSellForm && <SellBuilderHostelForm isOpen onClose={() => setShowBuilderHostelSellForm(false)} />}
      {showBuilderHostelLeaseForm && <LeaseBuilderHostelForm isOpen onClose={() => setShowBuilderHostelLeaseForm(false)} />}

      {/* HOSTEL FORMS (PROPERTY MANAGEMENT) */}
      {showPMHostelRentForm && <RentPMHostelForm isOpen onClose={() => setShowPMHostelRentForm(false)} />}
      {showPMHostelSellForm && <SellPMHostelForm isOpen onClose={() => setShowPMHostelSellForm(false)} />}
      {showPMHostelLeaseForm && <LeasePMHostelForm isOpen onClose={() => setShowPMHostelLeaseForm(false)} />}

      {/* Agent Forms */}
      {showAgentRentForm && <RentAgentIndForm isOpen onClose={() => setShowAgentRentForm(false)} />}
      {showAgentSellForm && <SellAgentIndForm isOpen onClose={() => setShowAgentSellForm(false)} />}
      {showAgentLeaseForm && <LeaseAgentIndForm isOpen onClose={() => setShowAgentLeaseForm(false)} />}

      {showAgentApartRentForm && <RentAgentApartForm isOpen onClose={() => setShowAgentApartRentForm(false)} />}
      {showAgentApartSellForm && <SellAgentApartForm isOpen onClose={() => setShowAgentApartSellForm(false)} />}
      {showAgentApartLeaseForm && <LeaseAgentApartForm isOpen onClose={() => setShowAgentApartLeaseForm(false)} />}

      {showAgentComRentForm && <RentAgentComForm isOpen onClose={() => setShowAgentComRentForm(false)} />}
      {showAgentComSellForm && <SellAgentComForm isOpen onClose={() => setShowAgentComSellForm(false)} />}
      {showAgentComLeaseForm && <LeaseAgentComForm isOpen onClose={() => setShowAgentComLeaseForm(false)} />}

      {/* Builder Forms */}
      {showBuilderRentForm && <RentBuilderIndForm isOpen onClose={() => setShowBuilderRentForm(false)} />}
      {showBuilderSellForm && <SellBuilderIndForm isOpen onClose={() => setShowBuilderSellForm(false)} />}
      {showBuilderLeaseForm && <LeaseBuilderIndForm isOpen onClose={() => setShowBuilderLeaseForm(false)} />}

      {showBuilderApartRentForm && <RentBuilderApartForm isOpen onClose={() => setShowBuilderApartRentForm(false)} />}
      {showBuilderApartSellForm && <SellBuilderApartForm isOpen onClose={() => setShowBuilderApartSellForm(false)} />}
      {showBuilderApartLeaseForm && <LeaseBuilderApartForm isOpen onClose={() => setShowBuilderApartLeaseForm(false)} />}

      {showBuilderComRentForm && <RentBuilderComForm isOpen onClose={() => setShowBuilderComRentForm(false)} />}
      {showBuilderComSellForm && <SellBuilderComForm isOpen onClose={() => setShowBuilderComSellForm(false)} />}
      {showBuilderComLeaseForm && <LeaseBuilderComForm isOpen onClose={() => setShowBuilderComLeaseForm(false)} />}

      {/* Property Management Forms */}
      {showPMRentForm && <RentPMIndForm isOpen onClose={() => setShowPMRentForm(false)} />}
      {showPMSellForm && <SellPMIndForm isOpen onClose={() => setShowPMSellForm(false)} />}
      {showPMLeaseForm && <LeasePMIndForm isOpen onClose={() => setShowPMLeaseForm(false)} />}

      {showPMApartRentForm && <RentPMApartForm isOpen onClose={() => setShowPMApartRentForm(false)} />}
      {showPMApartSellForm && <SellPMApartForm isOpen onClose={() => setShowPMApartSellForm(false)} />}
      {showPMApartLeaseForm && <LeasePMApartForm isOpen onClose={() => setShowPMApartLeaseForm(false)} />}

      {showPMComRentForm && <RentPMComForm isOpen onClose={() => setShowPMComRentForm(false)} />}
      {showPMComSellForm && <SellPMComForm isOpen onClose={() => setShowPMComSellForm(false)} />}
      {showPMComLeaseForm && <LeasePMComForm isOpen onClose={() => setShowPMComLeaseForm(false)} />}
      </Suspense>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 animate-fade"
          onClick={toggleMobileMenu}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl animate-backdrop" />
          
          <div 
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#00695C] to-[#26A69A] shadow-2xl shadow-[#00695C]/50 overflow-y-auto animate-slide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Menu className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">Menu</h2>
                  <p className="text-white/50 text-[10px]">Welcome back!</p>
                </div>
              </div>
              <button 
                onClick={toggleMobileMenu} 
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
            
            {/* Admin Section in Mobile - Only visible to admin */}
            {isAdmin && (
              <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '0ms' }}>
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('admin')}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30">
                    <MenuIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">Admin Panel</p>
                    <p className="text-white/60 text-xs">Manage admin & office</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.admin ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.admin && (
                  <div className="mt-2 space-y-1 pl-3">
                    {adminMenu.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleAdminNavigation(item.path);
                          toggleMobileMenu();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center text-[#00695C]">
                          {item.icon}
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className="text-white text-sm font-medium">{item.label}</span>
                          <span className="text-white/50 text-[10px]">{item.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Profile Section in Mobile */}
            {isLoggedIn && (
              <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '50ms' }}>
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('profile')}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">
                      {isVendor ? "Vendor" : isAdmin ? "Admin" : "User"}
                    </p>
                    <p className="text-white/60 text-xs">
                      {userData?.name || "Profile"}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.profile ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.profile && (
                  <div className="mt-2 space-y-1 pl-3">
                    {isVendor && (
                      <>
                        {profileMenu.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              handleProfileNavigation(item.path);
                              toggleMobileMenu();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                          >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-white text-sm font-medium">{item.label}</span>
                          </button>
                        ))}
                      </>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Login/Register in Mobile */}
            {!isLoggedIn && (
              <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '50ms' }}>
                <button
                  onClick={() => {
                    setShowLoginPopup(true);
                    toggleMobileMenu();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Login</span>
                </button>
                <button
                  onClick={() => {
                    setShowRegisterPopup(true);
                    toggleMobileMenu();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 mt-1"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Register</span>
                </button>
              </div>
            )}
            
            <div className="px-4 pb-32">
              <button 
                onClick={() => {
                  navigate('/');
                  toggleMobileMenu();
                }}
                className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
                style={{ animationDelay: '100ms' }}
              >
                🏠 Home
              </button>
              
              <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '150ms' }}>
                <div 
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('customer')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">🏢 Customer Portal</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.customer ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.customer && (
                  <div className="pl-4 pb-2 space-y-1">
                    {Object.entries(customerPortalMenu).map(([key, submenu]) => (
                      <div key={key} className="border-l border-white/10 pl-3">
                        <div 
                          className="flex items-center justify-between py-2 cursor-pointer"
                          onClick={() => toggleCustomerSub(key)}
                        >
                          <span className="text-white/90 text-sm capitalize">{key}</span>
                          <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.customerSub[key] ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {mobileDropdowns.customerSub[key] && (
                          <div className="pl-3 pb-1 space-y-1">
                            {submenu.map((item) => (
                              <button 
                                key={item} 
                                onClick={() => {
                                  handleCustomerPortalClick(item.toLowerCase());
                                  toggleMobileMenu();
                                }}
                                className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Post Property in Mobile - Only visible to vendors and admins */}
              {(isVendor || isAdmin) && (
                <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '200ms' }}>
                  <div 
                    className="flex items-center justify-between py-3 cursor-pointer"
                    onClick={() => toggleMobileDropdown('post')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">📊 Post Property</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.post ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {mobileDropdowns.post && (
                    <div className="pl-4 pb-2 space-y-1">
                      {Object.entries(postPropertyMenu).map(([role, submenu]) => (
                        <div key={role} className="border-l border-white/10 pl-3">
                          <div
                            className="flex items-center justify-between py-2 cursor-pointer"
                            onClick={() => togglePostSub(role)}
                          >
                            <span className="text-white/90 text-sm">{role}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform duration-300 ${mobileDropdowns.postSub[role] ? 'rotate-180' : ''}`} />
                          </div>

                          {mobileDropdowns.postSub[role] && (
                            <div className="pl-3 pb-1 space-y-1">
                              {submenu.map((propertyType) => (
                                <button
                                  key={propertyType}
                                  onClick={() => {
                                    handlePostSubmenuClick(role, propertyType);
                                    toggleMobileMenu();
                                  }}
                                  className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
                                >
                                  {propertyType}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '250ms' }}>
                <div 
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('loan')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">💰 Find Loan</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.loan ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.loan && (
                  <div className="pl-4 pb-2 space-y-1">
                    {loanMenu.map((item) => (
                      <button 
                        key={item} 
                        onClick={() => {
                          toggleMobileMenu();
                        }}
                        className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '300ms' }}>
                <div 
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('services')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">🛠️ Services</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.services ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.services && (
                  <div className="pl-4 pb-2 space-y-1">
                    {servicesMenu.map((item) => (
                      <button 
                        key={item} 
                        onClick={() => {
                          toggleMobileMenu();
                        }}
                        className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0) translateX(0) rotate(0deg); 
            opacity: 0.2;
          }
          25% { 
            transform: translateY(-20px) translateX(15px) rotate(90deg); 
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-12px) translateX(-12px) rotate(180deg); 
            opacity: 0.7;
          }
          75% { 
            transform: translateY(12px) translateX(18px) rotate(270deg); 
            opacity: 0.3;
          }
        }
        .animate-float-particle {
          animation: float-particle 10s ease-in-out infinite;
        }

        @keyframes wave-slow {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(40px) scaleY(1.2); }
          100% { transform: translateX(80px) scaleY(1); }
        }
        .animate-wave-slow {
          animation: wave-slow 8s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-slow {
          animation: shimmer-slow 8s linear infinite;
        }

        @keyframes sweep {
          0%, 100% { 
            background-position: 0% 50%; 
            opacity: 0.3;
          }
          50% { 
            background-position: 100% 50%; 
            opacity: 0.6;
          }
        }
        .animate-sweep {
          background-size: 200% 200%;
          animation: sweep 4s ease infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }

        @keyframes sparkle-glow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }
        .animate-sparkle-glow {
          animation: sparkle-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 1.5s ease-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }

        @keyframes dropdown-nested {
          from {
            opacity: 0;
            transform: translateX(-6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-dropdown-nested {
          animation: dropdown-nested 0.15s ease-out forwards;
        }

        @keyframes slide-item {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-item {
          animation: slide-item 0.3s ease-out forwards;
        }

        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade {
          animation: fade 0.25s ease-out forwards;
        }

        @keyframes backdrop {
          from {
            backdrop-filter: blur(0);
            opacity: 0;
          }
          to {
            backdrop-filter: blur(10px);
            opacity: 1;
          }
        }
        .animate-backdrop {
          animation: backdrop 0.25s ease-out forwards;
        }

        @keyframes slide {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide {
          animation: slide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default Header;