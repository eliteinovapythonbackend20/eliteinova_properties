// Own style card

// src/components/PropertyCard.jsx
// import { useState, useEffect } from 'react';
// import { createPortal } from 'react-dom';
// import {
//   MapPin,
//   Play,
//   Phone,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   CheckCircle2,
//   Building2,
//   BedDouble,
//   Bath,
//   Ruler,
//   Car,
//   Sparkles,
//   Home,
//   ShieldCheck,
//   Tag,
//   ArrowRight,
//   Images,
// } from 'lucide-react';

// // ============================================
// // PORTAL HOOK — escapes stacking contexts
// // ============================================
// const usePortal = (id = 'modal-root') => {
//   const [container, setContainer] = useState(null);
//   useEffect(() => {
//     let el = document.getElementById(id);
//     if (!el) {
//       el = document.createElement('div');
//       el.id = id;
//       document.body.appendChild(el);
//     }
//     setContainer(el);
//   }, [id]);
//   return container;
// };

// // ============================================
// // DESIGN TOKENS
// // ============================================
// const CARD_BORDER = 'border border-slate-200';
// const CARD_RADIUS = 'rounded-2xl';
// const CARD_SHADOW_IDLE =
//   '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)';
// const CARD_SHADOW_HOVER =
//   '0 16px 36px -12px rgba(13,148,136,0.22), 0 4px 12px -4px rgba(15,23,42,0.08)';

// const PropertyCard = ({ property, onContactClick }) => {
//   const [activeImg, setActiveImg] = useState(0);
//   const [showFullGallery, setShowFullGallery] = useState(false);
//   const [galleryActiveImg, setGalleryActiveImg] = useState(0);
//   const [logoError, setLogoError] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [mapConfirm, setMapConfirm] = useState({ show: false, location: '' });
//   const [showVideoModal, setShowVideoModal] = useState(false);

//   const portalRoot = usePortal();

//   // ============================================
//   // HELPERS
//   // ============================================
//   const formatPriceAmount = (amount) => {
//     if (!amount) return '₹0';
//     const num = parseFloat(amount);
//     if (isNaN(num)) return '₹0';
//     if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
//     if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
//     if (num >= 1000) return `₹${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
//     return `₹${num}`;
//   };

//   // "2" → "2 BHK" · "3BHK" → "3 BHK" · "1 RK" → "1 RK" · "Studio" → "Studio"
//   const extractBHK = (bedrooms) => {
//     if (bedrooms === undefined || bedrooms === null || bedrooms === '') return '';
//     const str = String(bedrooms).trim();
//     const match = str.match(/(\d+)\s*(BHK|RK)/i);
//     if (match) return match[0].replace(/\s+/g, ' ').toUpperCase();
//     const numMatch = str.match(/^\d+(\.\d+)?$/);
//     if (numMatch) return `${str} BHK`;
//     return str;
//   };

//   const getImages = () => {
//     if (!property.images) return [];
//     return property.images
//       .filter(
//         (m) => m.fileUrl && m.mediaType !== 'video' && !m.fileUrl.includes('video')
//       )
//       .map((m) => m.fileUrl);
//   };

//   const getVideo = () => {
//     if (!property.images) return null;
//     const video = property.images.find(
//       (m) => m.mediaType === 'video' || m.fileUrl?.includes('video')
//     );
//     return video ? video.fileUrl : null;
//   };

//   const getProfileImage = () =>
//     property?.postedBy?.profilePhotoUrl || property?.ownerDetails?.profilePhotoUrl;

//   const getTag = () => {
//     const purpose = property.listingPurpose?.toUpperCase();
//     const tagMap = {
//       BUY: { label: 'For Sale', tone: 'sale' },
//       SELL: { label: 'For Sale', tone: 'sale' },
//       RENT: { label: 'For Rent', tone: 'rent' },
//       LEASE: { label: 'For Lease', tone: 'lease' },
//     };
//     return tagMap[purpose] || { label: purpose || 'For Rent', tone: 'rent' };
//   };

//   const getRoleTitle = () => {
//     const postedBy = property.postedAs?.toUpperCase();
//     if (postedBy === 'AGENT') return 'Real Estate Agent';
//     if (postedBy === 'BUILDER') return 'Builder / Developer';
//     if (postedBy === 'PROPERTY_MANAGEMENT') return 'Property Management';
//     return 'Property Owner';
//   };

//   const getAmenities = () => {
//     if (Array.isArray(property.amenities)) return property.amenities;
//     if (typeof property.amenities === 'string')
//       return property.amenities.split(',').map((a) => a.trim()).filter(Boolean);
//     return [];
//   };

//   const getNearbyAccess = () => {
//     const nearby = property.nearbyPlaces ?? property.nearbyAccess;
//     if (Array.isArray(nearby)) return nearby;
//     if (typeof nearby === 'string')
//       return nearby.split(',').map((a) => a.trim()).filter(Boolean);
//     return [];
//   };

//   const getAppliances = () => {
//     if (Array.isArray(property.applianceIncluded)) return property.applianceIncluded;
//     if (typeof property.applianceIncluded === 'string')
//       return property.applianceIncluded.split(',').map((a) => a.trim()).filter(Boolean);
//     return [];
//   };

//   const getInteriorFeatures = () => {
//     if (Array.isArray(property.interiorFeatures)) return property.interiorFeatures;
//     if (typeof property.interiorFeatures === 'string')
//       return property.interiorFeatures.split(',').map((a) => a.trim()).filter(Boolean);
//     return [];
//   };

//   const getAddress = () =>
//     property.propertyAddress || property.city || property.location || '';

//   const getPricePerSqft = () => {
//     const area = parseFloat(property.builtUpArea || property.carpetArea);
//     const price = parseFloat(property.expectedPrice);
//     if (!area || !price) return null;
//     return Math.round(price / area);
//   };

//   // Styled highlight chips with icons + tinted backgrounds
//   const getHighlights = () => {
//     const items = [];
//     if (property.furnishingStatus)
//       items.push({ icon: Sparkles, label: property.furnishingStatus, tone: 'teal' });
//     if (property.readyToBuy?.toLowerCase() === 'yes')
//       items.push({ icon: ShieldCheck, label: 'Ready to Move', tone: 'emerald' });
//     if (property.parking?.toLowerCase() === 'yes')
//       items.push({ icon: Car, label: 'Parking', tone: 'indigo' });
//     if (property.petFriendly?.toLowerCase() === 'yes')
//       items.push({ icon: Home, label: 'Pet Friendly', tone: 'amber' });
//     if (property.hasBalcony?.toLowerCase() === 'yes')
//       items.push({ icon: Home, label: 'Balcony', tone: 'sky' });
//     if (property.hasTerrace?.toLowerCase() === 'yes')
//       items.push({ icon: Home, label: 'Terrace', tone: 'rose' });
//     if (property.propertyCondition)
//       items.push({ icon: CheckCircle2, label: property.propertyCondition, tone: 'slate' });
//     return items.slice(0, 3);
//   };

//   const openInMaps = (location) => setMapConfirm({ show: true, location });

//   const getDisplayName = () => {
//     const postedAs = property.postedAs?.toUpperCase();
//     if (property.postedBy?.displayName) return property.postedBy.displayName;
//     if (postedAs === 'AGENT')
//       return property.agentDetails?.agentName || property.ownerName || 'Agent';
//     if (postedAs === 'BUILDER')
//       return property.builderDetails?.name || property.ownerName || 'Builder';
//     if (postedAs === 'PROPERTY_MANAGEMENT')
//       return property.pmDetails?.name || property.ownerName || 'Property Management';
//     return property.userName || property.postedAs || 'Property Owner';
//   };

//   const getDisplaySubText = () => {
//     const postedAs = property.postedAs?.toUpperCase();
//     if (property.postedBy?.organisationName) return property.postedBy.organisationName;
//     if (postedAs === 'AGENT') return property.agentDetails?.agencyName || '';
//     if (postedAs === 'BUILDER') return property.builderDetails?.companyName || '';
//     if (postedAs === 'PROPERTY_MANAGEMENT') return property.pmDetails?.companyName || '';
//     return '';
//   };

//   // ============================================
//   // IMAGE NAV
//   // ============================================
//   const carouselImages = getImages();
//   const totalCarouselImages = carouselImages.length;
//   const videoUrl = getVideo();
//   const displayName = getDisplayName();
//   const displaySubText = getDisplaySubText();

//   if (totalCarouselImages === 0) carouselImages.push('');

//   const nextGalleryImg = (e) => {
//     e.stopPropagation();
//     setGalleryActiveImg((prev) => (prev + 1) % totalCarouselImages);
//   };
//   const prevGalleryImg = (e) => {
//     e.stopPropagation();
//     setGalleryActiveImg((prev) => (prev - 1 + totalCarouselImages) % totalCarouselImages);
//   };
//   const handleImageDoubleClick = (idx, e) => {
//     e.stopPropagation();
//     setGalleryActiveImg(idx);
//     setShowFullGallery(true);
//   };

//   // ============================================
//   // DERIVED VALUES
//   // ============================================
//   const tag = getTag();
//   const bhk = extractBHK(property.bedrooms);
//   const formattedPrice = formatPriceAmount(property.expectedPrice);
//   const profileImage = getProfileImage();
//   const address = getAddress();
//   const amenities = getAmenities();
//   const nearbyAccess = getNearbyAccess();
//   const appliances = getAppliances();
//   const pricePerSqft = getPricePerSqft();
//   const highlights = getHighlights();
//   const interiorFeatures = getInteriorFeatures();

//   // ============================================
//   // CHIP TONE MAP
//   // ============================================
//   const TONE = {
//     teal:    { bg: 'bg-teal-50',    text: 'text-teal-700',    icon: 'text-teal-600',    ring: 'ring-teal-100' },
//     emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-600', ring: 'ring-emerald-100' },
//     indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  icon: 'text-indigo-600',  ring: 'ring-indigo-100' },
//     amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: 'text-amber-600',   ring: 'ring-amber-100' },
//     sky:     { bg: 'bg-sky-50',     text: 'text-sky-700',     icon: 'text-sky-600',     ring: 'ring-sky-100' },
//     rose:    { bg: 'bg-rose-50',    text: 'text-rose-700',    icon: 'text-rose-600',    ring: 'ring-rose-100' },
//     slate:   { bg: 'bg-slate-50',   text: 'text-slate-700',   icon: 'text-slate-600',   ring: 'ring-slate-100' },
//   };

//   const tagTone =
//     tag.tone === 'sale'
//       ? 'bg-gradient-to-r from-rose-500 to-orange-500'
//       : tag.tone === 'lease'
//       ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
//       : 'bg-gradient-to-r from-teal-600 to-emerald-600';

//   // ============================================
//   // DETAIL FORMATTERS
//   // ============================================
//   const isPresent = (v) =>
//     v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
//   const fmtText = (v) => (isPresent(v) ? String(v) : null);
//   const fmtList = (v) =>
//     Array.isArray(v) ? (v.length ? v.join(', ') : null) : fmtText(v);
//   const fmtMoney = (v) =>
//     isPresent(v) && Number(v) > 0 ? `₹${Number(v).toLocaleString('en-IN')}` : null;
//   const fmtYesNo = (v) => {
//     if (!isPresent(v)) return null;
//     const s = String(v).toLowerCase();
//     if (s === 'yes' || s === 'true') return 'Yes';
//     if (s === 'no' || s === 'false') return 'No';
//     return String(v);
//   };
//   const fmtFeet = (v) => {
//     if (!isPresent(v)) return null;
//     const s = String(v);
//     return /ft|feet/i.test(s) ? s : `${s} ft`;
//   };
//   const fmtRange = (min, max, fmt) => {
//     const lo = fmt(min);
//     const hi = fmt(max);
//     if (lo && hi && lo !== hi) return `${lo} - ${hi}`;
//     return lo || hi;
//   };
//   const fmtDate = (v) => {
//     if (!isPresent(v)) return null;
//     const d = new Date(v);
//     return isNaN(d)
//       ? null
//       : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
//   };

//   // ============================================
//   // DETAIL ROWS
//   // ============================================
//   const generalRows = [
//     ['Sub Category', fmtText(property.subCategory)],
//     ['City', property.propertyAddress ? fmtText(property.city) : null],
//     ['Area', fmtText(property.area)],
//     ['District', fmtText(property.district)],
//     ['Landmark', fmtText(property.landmark)],
//     ['Nearby Connectivity', fmtText(property.nearbyConnectivity)],
//     ['Corner Unit', fmtYesNo(property.cornerUnit)],
//     ['Listed On', fmtDate(property.createdAt)],
//   ];
//   const pricingRows = [
//     ['Security Deposit', fmtMoney(property.securityDeposit ?? property.securityDepositMin)],
//     ['Maintenance Charges', fmtMoney(property.maintenance)],
//     ['Maintenance Included', fmtYesNo(property.maintenanceIncluded)],
//     ['Price Range', fmtRange(property.priceMin, property.priceMax, fmtMoney)],
//     ['Property Tax', fmtYesNo(property.propertyTax)],
//   ];
//   const tenancyRows = [
//     ['Tenant Type', fmtList(property.tenantType)],
//     ['Smoking Allowed', fmtYesNo(property.smokingAllowed)],
//     ['Dietary Preference', fmtText(property.dietaryPreference)],
//     ['Immediate Move-in', fmtYesNo(property.immediateMoveIn)],
//     ['Rental Term', fmtText(property.rentalTerm)],
//     ['Rental Frequency', fmtText(property.rentalFrequency)],
//     ['Minimum Stay', fmtText(property.minimumStayDuration)],
//   ];
//   const saleLegalRows = [
//     ['Loan Outstanding', fmtYesNo(property.loanOutstanding)],
//     ['RERA Approved', fmtYesNo(property.reraApproved)],
//     ['Title Deed Verified', fmtYesNo(property.titleDeedVerify)],
//     ['Construction Status', fmtText(property.constructionStatus)],
//     ['Under Construction', fmtYesNo(property.underConstruction)],
//     ['Possession Timeline', fmtText(property.possessionTimeline)],
//     ['Immediate Possession', fmtYesNo(property.immediatePossession)],
//     ['Ready to Move', fmtYesNo(property.readyToBuy)],
//     ['Lease Type', fmtText(property.leaseType)],
//     ['Lease Terms', fmtText(property.leaseTerms)],
//     ['Renewable Option', fmtYesNo(property.renewableOption)],
//   ];
//   const commercialRows = [
//     ['Commercial Type', fmtText(property.commercialType)],
//     ['Business Type', fmtText(property.businessType)],
//     ['Estimated Footfall', fmtText(property.estimatedFootfall)],
//     ['Operating Hours', fmtText(property.operatingHours)],
//     ['Zoning Type', fmtText(property.zoningType)],
//     ['Fit-out', fmtText(property.fitOut)],
//     ['Frontage Width', fmtFeet(property.frontageWidth)],
//     ['Ceiling Height', fmtFeet(property.ceilingHeight)],
//     ['Power Load Capacity', fmtText(property.powerLoadCapacity)],
//   ];
//   const hostelRows = [
//     ['Hostel Type', fmtText(property.hostelType)],
//     ['Hostel Category', fmtText(property.hostelCategory)],
//     ['Gender', fmtText(property.genderType)],
//     ['Room Type', fmtList(property.roomType)],
//     ['Sharing Type', fmtList(property.sharingType)],
//     ['Total Capacity', fmtText(property.totalCapacity)],
//     ['Bathroom Type', fmtText(property.bathroomType)],
//     ['Food Included', fmtYesNo(property.foodIncluded)],
//     ['Food Type', fmtText(property.foodType)],
//     ['Meals Provided', fmtText(property.mealsPerDay)],
//     ['Kitchen Access', fmtYesNo(property.kitchenAccess)],
//     ['Utilities Included', fmtYesNo(property.utilitiesIncluded)],
//     ['Alcohol Allowed', fmtYesNo(property.alcoholAllowed)],
//     ['Payment Frequency', fmtText(property.paymentFrequency)],
//     ['Payment Mode', fmtText(property.paymentMode)],
//   ];
//   const landUnit = property.areaUnit || 'sq.ft';
//   const landAreaRange = fmtRange(property.landAreaMin, property.landAreaMax, fmtText);
//   const landRows = [
//     [
//       'Land Area',
//       isPresent(property.landArea)
//         ? `${property.landArea} ${landUnit}`
//         : landAreaRange
//         ? `${landAreaRange} ${landUnit}`
//         : null,
//     ],
//     ['Land Shape', fmtText(property.landShape)],
//     ['Road Width', fmtFeet(property.roadWidth)],
//     ['Water Source', fmtText(property.waterSource)],
//     ['Soil Type', fmtText(property.soilType)],
//     ['Electricity Available', fmtYesNo(property.electricityAvailable)],
//   ];
//   const selectedFeatures = Array.isArray(property.selectedFeature)
//     ? property.selectedFeature
//     : [];

//   const renderDetailSection = (title, rows) => {
//     const visible = rows.filter(
//       ([, value]) => value !== null && value !== undefined && value !== ''
//     );
//     if (visible.length === 0) return null;
//     return (
//       <div className="mb-5">
//         <div className="flex items-center gap-2 mb-2">
//           <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
//           <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
//             {title}
//           </h4>
//         </div>
//         <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 ring-1 ring-slate-100">
//           {visible.map(([label, value]) => (
//             <Row key={label} label={label} value={value} />
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <>
//       {/* ============================================ */}
//       {/* CARD */}
//       {/* ============================================ */}
//       <div
//         className={`relative w-full bg-white ${CARD_RADIUS} ${CARD_BORDER} overflow-hidden mb-5`}
//         style={{
//           transition: 'box-shadow 0.3s ease, transform 0.3s ease',
//           boxShadow: isHovered ? CARD_SHADOW_HOVER : CARD_SHADOW_IDLE,
//           transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Top accent strip */}
//         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-600 opacity-90" />

//         <div className="p-4 md:p-5 pt-5">
//           <div className="flex flex-col lg:flex-row gap-5 items-stretch">
//             {/* ---------- IMAGE ---------- */}
//             <div
//               className="w-full lg:w-[38%] xl:w-[36%]"
//               style={{ position: 'relative', height: '240px' }}
//             >
//               <div
//                 className="flex flex-row bg-slate-100 rounded-xl overflow-hidden ring-1 ring-slate-200/70"
//                 style={{ position: 'absolute', inset: 0 }}
//               >
//                 <div
//                   className="relative cursor-pointer overflow-hidden flex-1 group"
//                   onDoubleClick={(e) => handleImageDoubleClick(activeImg, e)}
//                 >
//                   <img
//                     src={carouselImages[activeImg] || profileImage}
//                     alt="Property"
//                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                     onError={(e) => {
//                       e.target.src = '';
//                     }}
//                   />

//                   <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

//                   <div className="absolute top-3 left-3 z-10">
//                     <span
//                       className={`inline-flex items-center gap-1.5 ${tagTone} text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md shadow-lg`}
//                     >
//                       <Tag className="w-3 h-3" />
//                       {tag.label}
//                     </span>
//                   </div>

//                   {totalCarouselImages > 1 && (
//                     <div className="absolute top-3 right-3 z-10">
//                       <span className="inline-flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-md">
//                         <Images className="w-3 h-3" />
//                         {totalCarouselImages}
//                       </span>
//                     </div>
//                   )}

//                   {videoUrl && (
//                     <button
//                       className="absolute bottom-3 left-3 z-10 bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-all shadow-lg hover:scale-105"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setShowVideoModal(true);
//                       }}
//                     >
//                       <span className="w-4 h-4 rounded-full bg-teal-600 flex items-center justify-center">
//                         <Play className="w-2.5 h-2.5 fill-white text-white" />
//                       </span>
//                       Watch Video
//                     </button>
//                   )}
//                 </div>

//                 <div
//                   className="flex flex-col gap-1 p-1 bg-white/40 backdrop-blur-sm"
//                   style={{ width: '64px' }}
//                 >
//                   {carouselImages.slice(0, 4).map((img, idx) => (
//                     <div
//                       key={idx}
//                       className={`relative overflow-hidden rounded-md cursor-pointer transition-all ${
//                         activeImg === idx
//                           ? 'ring-2 ring-teal-500 ring-offset-1'
//                           : 'opacity-75 hover:opacity-100'
//                       }`}
//                       style={{ height: '50px' }}
//                       onClick={() => setActiveImg(idx)}
//                       onDoubleClick={(e) => handleImageDoubleClick(idx, e)}
//                     >
//                       <img
//                         src={img}
//                         className="w-full h-full object-cover"
//                         alt="thumb"
//                         onError={(e) => {
//                           e.target.src = '';
//                         }}
//                       />
//                       {idx === 3 && totalCarouselImages > 4 && (
//                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-[11px]">
//                           +{totalCarouselImages - 4}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ---------- CONTENT ---------- */}
//             <div className="flex-1 flex flex-col">
//               {/* Price + BHK + Type */}
//               <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
//                 <span className="font-black text-slate-900 text-2xl md:text-[30px] leading-tight tracking-tight">
//                   {formattedPrice}
//                 </span>
//                 {(bhk || property.propertyType) && (
//                   <>
//                     <span className="text-slate-300 text-lg">·</span>
//                     <span className="font-semibold text-slate-700 text-sm md:text-base">
//                       {[bhk, property.propertyType].filter(Boolean).join(' ')}
//                     </span>
//                   </>
//                 )}
//               </div>

//               {/* Location */}
//               {address && (
//                 <button
//                   onClick={() => openInMaps(address)}
//                   className="flex items-center gap-1.5 mt-1.5 text-left group w-fit"
//                   title="View on Google Maps"
//                 >
//                   <span className="w-4 h-4 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
//                     <MapPin className="w-2.5 h-2.5 text-teal-600" />
//                   </span>
//                   <span className="text-slate-600 text-sm font-medium group-hover:text-teal-700 group-hover:underline transition-colors">
//                     {address}
//                   </span>
//                 </button>
//               )}

//               {/* Title */}
//               {property.propertyTitle && (
//                 <h3 className="text-slate-800 font-semibold text-sm mt-2 line-clamp-1">
//                   {property.propertyTitle}
//                 </h3>
//               )}

//               {/* Highlights */}
//               {(highlights.length > 0 || pricePerSqft) && (
//                 <div className="flex flex-wrap items-center gap-1.5 mt-3">
//                   {highlights.map((h, i) => {
//                     const tone = TONE[h.tone] || TONE.slate;
//                     const Icon = h.icon;
//                     return (
//                       <span
//                         key={i}
//                         className={`inline-flex items-center gap-1 ${tone.bg} ${tone.text} ring-1 ${tone.ring} text-[11px] font-semibold px-2 py-1 rounded-md`}
//                       >
//                         <Icon className={`w-3 h-3 ${tone.icon}`} />
//                         {h.label}
//                       </span>
//                     );
//                   })}
//                   {pricePerSqft && (
//                     <span className="inline-flex items-center gap-1 bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 ring-1 ring-teal-100 text-[11px] font-bold px-2 py-1 rounded-md">
//                       ₹{pricePerSqft.toLocaleString('en-IN')}
//                       <span className="text-teal-500 font-medium">/sqft</span>
//                     </span>
//                   )}
//                 </div>
//               )}

//               <div className="flex-1" />

//               {/* Footer */}
//               <div className="pt-3 mt-3 border-t border-slate-100">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                   <div className="flex items-center gap-3 min-w-0">
//                     <div className="relative shrink-0">
//                       <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 p-[2px]">
//                         <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-700 font-bold overflow-hidden">
//                           {profileImage && !logoError ? (
//                             <img
//                               src={profileImage}
//                               alt="profile"
//                               className="w-full h-full object-cover rounded-full"
//                               onError={() => setLogoError(true)}
//                             />
//                           ) : (
//                             <span className="text-sm">
//                               {displayName?.charAt(0)?.toUpperCase() || 'U'}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <CheckCircle2 className="w-4 h-4 text-teal-600 fill-white absolute -bottom-0.5 -right-0.5" />
//                     </div>

//                     <div className="min-w-0">
//                       <p className="font-bold text-slate-800 text-sm truncate">
//                         {displayName}
//                       </p>
//                       <p className="text-[11px] text-slate-500 font-medium truncate">
//                         {[getRoleTitle(), displaySubText].filter(Boolean).join(' · ')}
//                       </p>
//                     </div>
//                   </div>

//                   <button
//                     onClick={onContactClick}
//                     className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-lg px-4 py-2.5 transition-all shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 hover:-translate-y-0.5 shrink-0"
//                   >
//                     <Phone className="w-3.5 h-3.5" />
//                     Contact
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => setShowDetailsModal(true)}
//                   className="mt-3 inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 text-xs font-semibold group transition-colors"
//                 >
//                   <Eye className="w-3.5 h-3.5" />
//                   View full details
//                   <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ============================================ */}
//       {/* PORTAL-ED MODALS */}
//       {/* ============================================ */}

//       {/* ---------- VIDEO MODAL ---------- */}
//       {portalRoot &&
//         showVideoModal &&
//         videoUrl &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/90 backdrop-blur-md z-[1200] flex items-center justify-center p-4 animate-fadeIn"
//             onClick={() => setShowVideoModal(false)}
//           >
//             <div
//               className={`bg-black ${CARD_RADIUS} shadow-2xl max-w-4xl w-full overflow-hidden ring-1 ring-white/10`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="bg-slate-900 border-b border-white/10 p-4 flex justify-between items-center">
//                 <div>
//                   <h3 className="text-white font-bold text-base md:text-lg truncate max-w-[200px] md:max-w-xs">
//                     {property.propertyTitle ||
//                       address?.split(',')[0] ||
//                       'Property Video'}
//                   </h3>
//                   <p className="text-white/60 text-xs">
//                     Click outside or press ESC to close
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setShowVideoModal(false)}
//                   className="text-white/80 hover:text-white transition-colors shrink-0"
//                   aria-label="Close"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="p-4 bg-black">
//                 <div className="relative" style={{ paddingBottom: '56.25%' }}>
//                   <video
//                     controls
//                     controlsList="nodownload noremoteplayback"
//                     disablePictureInPicture
//                     className="absolute inset-0 w-full h-full rounded-lg"
//                     style={{ backgroundColor: '#000' }}
//                     playsInline
//                     preload="metadata"
//                   >
//                     <source src={videoUrl} type="video/mp4" />
//                     <source src={videoUrl} type="video/webm" />
//                     <source src={videoUrl} type="video/ogg" />
//                     Your browser does not support the video tag.
//                   </video>
//                 </div>
//               </div>
//             </div>
//           </div>,
//           portalRoot
//         )}

//       {/* ---------- MAP CONFIRM MODAL ---------- */}
//       {portalRoot &&
//         mapConfirm.show &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fadeIn"
//             onClick={() => setMapConfirm({ show: false, location: '' })}
//           >
//             <div
//               className={`bg-white ${CARD_RADIUS} ${CARD_BORDER} shadow-2xl max-w-sm w-full p-6`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
//                 <MapPin className="w-7 h-7 text-white" />
//               </div>
//               <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
//                 Open in Maps?
//               </h3>
//               <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed">
//                 {mapConfirm.location}
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setMapConfirm({ show: false, location: '' })}
//                   className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     const query = encodeURIComponent(mapConfirm.location);
//                     window.open(
//                       `https://www.google.com/maps/search/?api=1&query=${query}`,
//                       '_blank'
//                     );
//                     setMapConfirm({ show: false, location: '' });
//                   }}
//                   className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-teal-600/20"
//                 >
//                   Open
//                 </button>
//               </div>
//             </div>
//           </div>,
//           portalRoot
//         )}

//       {/* ---------- DETAILS MODAL ---------- */}
//       {portalRoot &&
//         showDetailsModal &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/60 backdrop-blur-md z-[900] flex items-start justify-center p-4 pt-16 md:pt-20 animate-fadeIn"
//             onClick={() => setShowDetailsModal(false)}
//           >
//             {/* Scoped styles — hide scrollbar only for this modal */}
//             <style>{`
//               .property-details-scroll {
//                 -ms-overflow-style: none;
//                 scrollbar-width: none;
//               }
//               .property-details-scroll::-webkit-scrollbar {
//                 display: none;
//               }
//             `}</style>

//             <div
//               className={`property-details-scroll bg-white ${CARD_RADIUS} ${CARD_BORDER} max-w-[95%] sm:max-w-lg md:max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Header */}
//               <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-4 flex justify-between items-center rounded-t-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
//                     <Building2 className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-white font-bold text-lg">Property Details</h3>
//                     <p className="text-white/80 text-xs">
//                       {property.postedAs || getRoleTitle()}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="text-white/80 hover:text-white transition-colors shrink-0"
//                   aria-label="Close"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="p-5">
//                 {/* Poster card */}
//                 <div className="flex items-center gap-4 pb-4 border-b border-slate-100 mb-5">
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 p-[2px] shrink-0">
//                     <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-700 font-bold text-xl overflow-hidden">
//                       {profileImage && !logoError ? (
//                         <img
//                           src={profileImage}
//                           alt="profile"
//                           className="w-full h-full object-cover rounded-full"
//                           onError={() => setLogoError(true)}
//                         />
//                       ) : (
//                         <span>{displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-xs text-slate-500 font-medium">{getRoleTitle()}</p>
//                     <p className="text-lg font-bold text-slate-800 truncate">
//                       {displayName}
//                     </p>
//                     {displaySubText && (
//                       <p className="text-sm text-slate-500 truncate">{displaySubText}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Quick stats */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
//                   {bhk && <QuickStat icon={BedDouble} label="Bedrooms" value={bhk} />}
//                   {property.bathrooms && (
//                     <QuickStat icon={Bath} label="Bathrooms" value={property.bathrooms} />
//                   )}
//                   {(property.builtUpArea || property.carpetArea) && (
//                     <QuickStat
//                       icon={Ruler}
//                       label="Area"
//                       value={`${property.builtUpArea || property.carpetArea} sqft`}
//                     />
//                   )}
//                   {property.furnishingStatus && (
//                     <QuickStat
//                       icon={Sparkles}
//                       label="Furnishing"
//                       value={property.furnishingStatus}
//                     />
//                   )}
//                 </div>

//                 {/* Overview */}
//                 <div className="mb-5">
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
//                     <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
//                       Overview
//                     </h4>
//                   </div>
//                   <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 ring-1 ring-slate-100">
//                     {property.propertyTitle && (
//                       <Row label="Title" value={property.propertyTitle} />
//                     )}
//                     {property.propertyType && (
//                       <Row label="Type" value={property.propertyType} />
//                     )}
//                     {property.propertyCategory && (
//                       <Row label="Category" value={property.propertyCategory} />
//                     )}
//                     {property.listingPurpose && (
//                       <Row label="Purpose" value={property.listingPurpose} />
//                     )}
//                     <Row label="Listed Price" value={formattedPrice} />
//                     {property.isNegotiable && (
//                       <Row label="Price Type" value={property.isNegotiable} />
//                     )}
//                     {bhk && <Row label="Bedrooms" value={bhk} />}
//                     {property.bathrooms && (
//                       <Row label="Bathrooms" value={property.bathrooms} />
//                     )}
//                     {property.builtUpArea && (
//                       <Row
//                         label="Built-up Area"
//                         value={`${property.builtUpArea} sq.ft`}
//                       />
//                     )}
//                     {property.carpetArea && (
//                       <Row
//                         label="Carpet Area"
//                         value={`${property.carpetArea} sq.ft`}
//                       />
//                     )}
//                     {property.furnishingStatus && (
//                       <Row label="Furnishing" value={property.furnishingStatus} />
//                     )}
//                     {property.ownershipType && (
//                       <Row label="Ownership" value={property.ownershipType} />
//                     )}
//                     {property.propertyCondition && (
//                       <Row label="Condition" value={property.propertyCondition} />
//                     )}
//                     {(property.propertyAgeRange || property.propertyAge) && (
//                       <Row
//                         label="Property Age"
//                         value={property.propertyAgeRange || `${property.propertyAge} years`}
//                       />
//                     )}
//                     {property.facing && <Row label="Facing" value={property.facing} />}
//                     {property.floorNumber && property.totalFloors && (
//                       <Row
//                         label="Floor"
//                         value={`${property.floorNumber} / ${property.totalFloors}`}
//                       />
//                     )}
//                     {property.status && (
//                       <Row
//                         label="Status"
//                         value={property.propertyStatus || 'Available'}
//                       />
//                     )}
//                     {address && <Row label="Location" value={address} />}
//                     {property.pincode && (
//                       <Row label="Pincode" value={property.pincode} />
//                     )}
//                     {property.state && <Row label="State" value={property.state} />}
//                     {generalRows
//                       .filter(([, value]) => value)
//                       .map(([label, value]) => (
//                         <Row key={label} label={label} value={value} />
//                       ))}
//                   </div>
//                 </div>

//                 {/* Description */}
//                 {property.propertyDescription && (
//                   <div className="mb-5">
//                     <div className="flex items-center gap-2 mb-2">
//                       <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
//                       <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
//                         Description
//                       </h4>
//                     </div>
//                     <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 ring-1 ring-slate-100">
//                       <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
//                         {property.propertyDescription}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {renderDetailSection('Pricing & Charges', pricingRows)}
//                 {renderDetailSection('Rent & Tenancy', tenancyRows)}
//                 {renderDetailSection('Sale, Lease & Legal', saleLegalRows)}
//                 {renderDetailSection('Commercial Details', commercialRows)}
//                 {renderDetailSection('Hostel Details', hostelRows)}
//                 {renderDetailSection('Land & Plot Details', landRows)}

//                 {selectedFeatures.length > 0 && (
//                   <ChipSection title="Features" items={selectedFeatures} tone="teal" />
//                 )}
//                 {amenities.length > 0 && (
//                   <ChipSection
//                     title={`Amenities (${amenities.length})`}
//                     items={amenities}
//                     tone="emerald"
//                   />
//                 )}
//                 {interiorFeatures.length > 0 && (
//                   <ChipSection
//                     title="Interior Features"
//                     items={interiorFeatures}
//                     tone="indigo"
//                   />
//                 )}
//                 {appliances.length > 0 && (
//                   <ChipSection
//                     title="Appliances Included"
//                     items={appliances}
//                     tone="amber"
//                   />
//                 )}
//                 {nearbyAccess.length > 0 && (
//                   <ChipSection
//                     title="Nearby Access"
//                     items={nearbyAccess}
//                     tone="sky"
//                   />
//                 )}

//                 {/* Photos */}
//                 <div className="mb-5">
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
//                     <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
//                       Photos ({totalCarouselImages})
//                     </h4>
//                   </div>
//                   <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 ring-1 ring-slate-100">
//                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
//                       {carouselImages.map((img, idx) => (
//                         <div
//                           key={idx}
//                           className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all ring-1 ring-slate-100"
//                           onClick={() => {
//                             setGalleryActiveImg(idx);
//                             setShowFullGallery(true);
//                             setShowDetailsModal(false);
//                           }}
//                         >
//                           <img
//                             src={img}
//                             alt={`property-${idx + 1}`}
//                             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                             onError={(e) => {
//                               e.target.src = '';
//                             }}
//                           />
//                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
//                             <Eye className="w-4 h-4 text-white" />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     {videoUrl && (
//                       <div className="mt-3 text-center">
//                         <button
//                           onClick={() => {
//                             setShowDetailsModal(false);
//                             setShowVideoModal(true);
//                           }}
//                           className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 text-xs font-semibold hover:underline"
//                         >
//                           <Play className="w-3.5 h-3.5" />
//                           Watch Property Video
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Footer actions */}
//                 <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
//                   <button
//                     onClick={() => {
//                       setShowDetailsModal(false);
//                       onContactClick();
//                     }}
//                     className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-teal-600/20 hover:shadow-lg"
//                   >
//                     <Phone className="w-4 h-4" />
//                     Contact Now
//                   </button>
//                   <button
//                     onClick={() => setShowDetailsModal(false)}
//                     className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold text-sm transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>,
//           portalRoot
//         )}

//       {/* ---------- FULL GALLERY ---------- */}
//       {portalRoot &&
//         showFullGallery &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/95 z-[1100] flex flex-col animate-fadeIn"
//             onClick={() => setShowFullGallery(false)}
//           >
//             <div className="bg-gradient-to-r from-teal-700/40 to-emerald-700/40 backdrop-blur-sm border-b border-white/10 p-3 md:p-4 flex justify-between items-center px-4 md:px-6">
//               <div className="pr-2">
//                 <h3 className="text-white font-semibold text-sm md:text-lg truncate max-w-[200px] md:max-w-none">
//                   {property.propertyTitle ||
//                     address?.split(',')[0] ||
//                     'Property Gallery'}
//                 </h3>
//                 <p className="text-white/60 text-[11px] md:text-xs mt-0.5">
//                   Click outside or press ESC to close
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowFullGallery(false)}
//                 className="text-white/80 hover:text-white transition-colors shrink-0"
//                 aria-label="Close"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div
//               className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 pb-2"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="relative w-full max-w-4xl">
//                 <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/50 ring-1 ring-white/10">
//                   <img
//                     src={carouselImages[galleryActiveImg]}
//                     alt="Gallery main"
//                     className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain"
//                     onError={(e) => {
//                       e.target.src = '';
//                     }}
//                   />
//                 </div>
//                 {totalCarouselImages > 1 && (
//                   <>
//                     <button
//                       onClick={prevGalleryImg}
//                       className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ring-1 ring-white/20"
//                       aria-label="Previous"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={nextGalleryImg}
//                       className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ring-1 ring-white/20"
//                       aria-label="Next"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </>
//                 )}
//               </div>

//               <div className="mt-3 inline-flex items-center gap-2 text-white/80 text-xs md:text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full ring-1 ring-white/15">
//                 <Images className="w-3.5 h-3.5" />
//                 {galleryActiveImg + 1} / {totalCarouselImages}
//               </div>

//               <div className="w-full max-w-5xl mt-4 md:mt-6 px-2">
//                 <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
//                   {carouselImages.map((img, idx) => (
//                     <div
//                       key={idx}
//                       className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${
//                         galleryActiveImg === idx
//                           ? 'ring-2 ring-teal-400 opacity-100 scale-105'
//                           : 'opacity-60 hover:opacity-100 ring-1 ring-white/10'
//                       }`}
//                       onClick={() => setGalleryActiveImg(idx)}
//                     >
//                       <img
//                         src={img}
//                         alt="thumb"
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.src = '';
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>,
//           portalRoot
//         )}
//     </>
//   );
// };

// // ============================================
// // HELPER COMPONENTS
// // ============================================
// const Row = ({ label, value }) => (
//   <div className="flex justify-between gap-3 text-sm py-0.5">
//     <span className="text-slate-500">{label}</span>
//     <span className="text-slate-800 font-semibold text-right">{value}</span>
//   </div>
// );

// const QuickStat = ({ icon: Icon, label, value }) => (
//   <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-xl p-3 ring-1 ring-teal-100/70">
//     <div className="flex items-center gap-1.5 mb-1">
//       <Icon className="w-3.5 h-3.5 text-teal-600" />
//       <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
//         {label}
//       </span>
//     </div>
//     <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
//   </div>
// );

// const ChipSection = ({ title, items, tone = 'teal' }) => {
//   const toneClasses = {
//     teal: 'bg-teal-50 text-teal-700 ring-teal-100',
//     emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
//     indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
//     amber: 'bg-amber-50 text-amber-700 ring-amber-100',
//     sky: 'bg-sky-50 text-sky-700 ring-sky-100',
//   };
//   const cls = toneClasses[tone] || toneClasses.teal;

//   return (
//     <div className="mb-5">
//       <div className="flex items-center gap-2 mb-2">
//         <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
//         <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
//           {title}
//         </h4>
//       </div>
//       <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 ring-1 ring-slate-100 flex flex-wrap gap-2">
//         {items.map((item, i) => (
//           <span
//             key={i}
//             className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ring-1 ${cls}`}
//           >
//             <Sparkles className="w-3 h-3 opacity-70" />
//             {item}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;
























// Styles are inherited from the original PropertyCard.jsx file, but the code has been commented out to prevent execution. The component is designed to display property details, including images, videos, and various attributes, with modals for full gallery and video viewing.



// // src/components/PropertyCard.jsx
// import { useState, useEffect } from 'react';
// import { createPortal } from 'react-dom';
// import {
//   MapPin,
//   Play,
//   Phone,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   CheckCircle2,
//   Building2,
//   BedDouble,
//   Bath,
//   Ruler,
//   Car,
//   Sparkles,
//   Home,
//   ShieldCheck,
//   Tag,
//   ArrowRight,
//   Images,
// } from 'lucide-react';

// // ============================================
// // PORTAL HOOK — escapes stacking contexts
// // ============================================
// const usePortal = (id = 'modal-root') => {
//   const [container, setContainer] = useState(null);
//   useEffect(() => {
//     let el = document.getElementById(id);
//     if (!el) {
//       el = document.createElement('div');
//       el.id = id;
//       document.body.appendChild(el);
//     }
//     setContainer(el);
//   }, [id]);
//   return container;
// };

// // ============================================
// // DESIGN TOKENS
// // ============================================
// const CARD_BORDER = 'border border-teal-100';
// const CARD_RADIUS = 'rounded-2xl';
// const CARD_SHADOW_IDLE =
//   '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)';
// const CARD_SHADOW_HOVER =
//   '0 25px 40px -12px rgba(0,105,92,0.4), 0 0 0 1px rgba(0,105,92,0.1)';



// const PropertyCard = ({ property, onContactClick }) => {
//   const [activeImg, setActiveImg] = useState(0);
//   const [showFullGallery, setShowFullGallery] = useState(false);
//   const [galleryActiveImg, setGalleryActiveImg] = useState(0);
//   const [logoError, setLogoError] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isContactHovered, setIsContactHovered] = useState(false);
//   const [mapConfirm, setMapConfirm] = useState({ show: false, location: '' });
//   const [showVideoModal, setShowVideoModal] = useState(false);

//   const portalRoot = usePortal();

//   // ============================================
//   // HELPERS
//   // ============================================
//   const formatPriceAmount = (amount) => {
//     if (!amount) return '₹0';
//     const num = parseFloat(amount);
//     if (isNaN(num)) return '₹0';
//     if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
//     if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
//     if (num >= 1000) return `₹${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
//     return `₹${num}`;
//   };

//   const extractBHK = (bedrooms) => {
//     if (bedrooms === undefined || bedrooms === null || bedrooms === '') return '';
//     const str = String(bedrooms).trim();
//     const match = str.match(/(\d+)\s*(BHK|RK)/i);
//     if (match) return match[0].replace(/\s+/g, ' ').toUpperCase();
//     const numMatch = str.match(/^\d+(\.\d+)?$/);
//     if (numMatch) return `${str} BHK`;
//     return str;
//   };

//   const getImages = () => {
//     if (!Array.isArray(property.images)) return [];
//     return property.images
//       .map((m) => (typeof m === 'string' ? m : m?.fileUrl))
//       .filter((url) => url && !url.includes('video'));
//   };

//   const getVideo = () => {
//     if (!Array.isArray(property.images)) return null;
//     const v = property.images.find(
//       (m) =>
//         (typeof m === 'object' && m?.mediaType === 'video') ||
//         (typeof m === 'object' && m?.fileUrl?.includes('video'))
//     );
//     return v ? v.fileUrl : null;
//   };

//   const getProfileImage = () =>
//     property?.postedBy?.profilePhotoUrl ||
//     property?.ownerDetails?.profilePhotoUrl ||
//     property?.logo;

//   const getTag = () => {
//     const purpose = property.listingPurpose?.toUpperCase() || property.tag?.toUpperCase();
//     const tagMap = {
//       BUY: { label: 'BUY', tone: 'sale', icon: '💰' },
//       SELL: { label: 'SELL', tone: 'sale', icon: '🏷️' },
//       RENT: { label: 'RENT', tone: 'rent', icon: '🔑' },
//       LEASE: { label: 'LEASE', tone: 'lease', icon: '📄' },
//     };
//     return tagMap[purpose] || { label: purpose || 'RENT', tone: 'rent', icon: '🔑' };
//   };

//   const getRoleTitle = () => {
//     const p = property.postedAs?.toUpperCase();
//     if (p === 'AGENT') return 'Real Estate Agent';
//     if (p === 'BUILDER') return 'Builder / Developer';
//     if (p === 'PROPERTY_MANAGEMENT') return 'Property Management';
//     return 'Property Owner';
//   };

//   const getListedByText = () => {
//     const p = property.postedAs?.toUpperCase();
//     if (p === 'AGENT') return '🏢 Listed By (Agent)';
//     if (p === 'BUILDER') return '🏗️ Listed By (Builder)';
//     if (p === 'PROPERTY_MANAGEMENT') return '🏢 Listed By (PM)';
//     return '🏠 Listed By (Owner)';
//   };

//   const getAmenities = () => {
//     if (Array.isArray(property.amenities)) return property.amenities;
//     if (typeof property.amenities === 'string')
//       return property.amenities.split(',').map((a) => a.trim()).filter(Boolean);
//     return [];
//   };

//   const getNearbyAccess = () => {
//     const nearby = property.nearbyPlaces ?? property.nearbyAccess;
//     if (Array.isArray(nearby)) return nearby;
//     if (typeof nearby === 'string')
//       return nearby.split(',').map((a) => a.trim()).filter(Boolean);
//     return [];
//   };

//   const getAppliances = () => {
//     if (Array.isArray(property.applianceIncluded)) return property.applianceIncluded;
//     if (typeof property.applianceIncluded === 'string')
//       return property.applianceIncluded.split(',').map((a) => a.trim()).filter(Boolean);
//     return [];
//   };

//   const getInteriorFeatures = () => {
//     if (Array.isArray(property.interiorFeatures)) return property.interiorFeatures;
//     if (typeof property.interiorFeatures === 'string')
//       return property.interiorFeatures.split(',').map((a) => a.trim()).filter(Boolean);
//     return [];
//   };

//   const getAddress = () =>
//     property.propertyAddress || property.city || property.location || '';

//   const getPricePerSqft = () => {
//     const area = parseFloat(property.builtUpArea || property.carpetArea);
//     const price = parseFloat(property.expectedPrice);
//     if (!area || !price) return null;
//     return Math.round(price / area);
//   };

//   const getHighlights = () => {
//     if (typeof property.highlights === 'string' && property.highlights.includes('|')) {
//       return property.highlights.split('|').map((h) => h.trim()).filter(Boolean);
//     }
//     const items = [];
//     if (property.furnishingStatus) items.push(property.furnishingStatus);
//     if (property.readyToBuy?.toLowerCase() === 'yes') items.push('Ready to Move');
//     if (property.parking?.toLowerCase() === 'yes') items.push('Parking');
//     if (property.petFriendly?.toLowerCase() === 'yes') items.push('Pet Friendly');
//     if (property.hasBalcony?.toLowerCase() === 'yes') items.push('Balcony');
//     if (property.hasTerrace?.toLowerCase() === 'yes') items.push('Terrace');
//     if (property.propertyCondition) items.push(property.propertyCondition);
//     return items.slice(0, 8);
//   };

//   const openInMaps = (location) => setMapConfirm({ show: true, location });

//   const getDisplayName = () => {
//     const p = property.postedAs?.toUpperCase();
//     if (property.postedBy?.displayName) return property.postedBy.displayName;
//     if (p === 'AGENT')
//       return property.agentDetails?.agentName || property.ownerName || 'Agent';
//     if (p === 'BUILDER')
//       return property.builderDetails?.name || property.ownerName || 'Builder';
//     if (p === 'PROPERTY_MANAGEMENT')
//       return property.pmDetails?.name || property.ownerName || 'Property Management';
//     return property.userName || property.ownerName || 'Property Owner';
//   };

//   const getDisplaySubText = () => {
//     const p = property.postedAs?.toUpperCase();
//     if (property.postedBy?.organisationName) return property.postedBy.organisationName;
//     if (p === 'AGENT') return property.agentDetails?.agencyName || '';
//     if (p === 'BUILDER') return property.builderDetails?.companyName || '';
//     if (p === 'PROPERTY_MANAGEMENT') return property.pmDetails?.companyName || '';
//     return '';
//   };

//   // ============================================
//   // IMAGE NAV
//   // ============================================
//   const carouselImages = getImages();
//   const totalCarouselImages = carouselImages.length;
//   const videoUrl = getVideo();
//   const displayName = getDisplayName();
//   const displaySubText = getDisplaySubText();

//   if (totalCarouselImages === 0) carouselImages.push('');

//   const nextGalleryImg = (e) => {
//     e.stopPropagation();
//     setGalleryActiveImg((prev) => (prev + 1) % totalCarouselImages);
//   };
//   const prevGalleryImg = (e) => {
//     e.stopPropagation();
//     setGalleryActiveImg((prev) => (prev - 1 + totalCarouselImages) % totalCarouselImages);
//   };
//   const handleImageDoubleClick = (idx, e) => {
//     e.stopPropagation();
//     setGalleryActiveImg(idx);
//     setShowFullGallery(true);
//   };

//   // ============================================
//   // DERIVED VALUES
//   // ============================================
//   const tag = getTag();
//   const bhk = extractBHK(property.bedrooms);
//   const formattedPrice = formatPriceAmount(property.expectedPrice);
//   const profileImage = getProfileImage();
//   const address = getAddress();
//   const amenities = getAmenities();
//   const nearbyAccess = getNearbyAccess();
//   const appliances = getAppliances();
//   const pricePerSqft = getPricePerSqft();
//   const highlights = getHighlights();
//   const interiorFeatures = getInteriorFeatures();

//   const tagGradient =
//     tag.tone === 'sale'
//       ? 'from-rose-500 to-orange-500'
//       : tag.tone === 'lease'
//       ? 'from-indigo-500 to-violet-500'
//       : 'from-[#00695C] to-[#26A69A]';

//   // ============================================
//   // DETAIL FORMATTERS
//   // ============================================
//   const isPresent = (v) =>
//     v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
//   const fmtText = (v) => (isPresent(v) ? String(v) : null);
//   const fmtList = (v) =>
//     Array.isArray(v) ? (v.length ? v.join(', ') : null) : fmtText(v);
//   const fmtMoney = (v) =>
//     isPresent(v) && Number(v) > 0 ? `₹${Number(v).toLocaleString('en-IN')}` : null;
//   const fmtYesNo = (v) => {
//     if (!isPresent(v)) return null;
//     const s = String(v).toLowerCase();
//     if (s === 'yes' || s === 'true') return 'Yes';
//     if (s === 'no' || s === 'false') return 'No';
//     return String(v);
//   };
//   const fmtFeet = (v) => {
//     if (!isPresent(v)) return null;
//     const s = String(v);
//     return /ft|feet/i.test(s) ? s : `${s} ft`;
//   };
//   const fmtRange = (min, max, fmt) => {
//     const lo = fmt(min);
//     const hi = fmt(max);
//     if (lo && hi && lo !== hi) return `${lo} - ${hi}`;
//     return lo || hi;
//   };
//   const fmtDate = (v) => {
//     if (!isPresent(v)) return null;
//     const d = new Date(v);
//     return isNaN(d)
//       ? null
//       : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
//   };

//   // ============================================
//   // DETAIL ROWS
//   // ============================================
//   const generalRows = [
//     ['Sub Category', fmtText(property.subCategory)],
//     ['City', property.propertyAddress ? fmtText(property.city) : null],
//     ['Area', fmtText(property.area)],
//     ['District', fmtText(property.district)],
//     ['Landmark', fmtText(property.landmark)],
//     ['Nearby Connectivity', fmtText(property.nearbyConnectivity)],
//     ['Corner Unit', fmtYesNo(property.cornerUnit)],
//     ['Listed On', fmtDate(property.createdAt)],
//   ];
//   const pricingRows = [
//     ['Security Deposit', fmtMoney(property.securityDeposit ?? property.securityDepositMin)],
//     ['Maintenance Charges', fmtMoney(property.maintenance)],
//     ['Maintenance Included', fmtYesNo(property.maintenanceIncluded)],
//     ['Price Range', fmtRange(property.priceMin, property.priceMax, fmtMoney)],
//     ['Property Tax', fmtYesNo(property.propertyTax)],
//   ];
//   const tenancyRows = [
//     ['Tenant Type', fmtList(property.tenantType)],
//     ['Smoking Allowed', fmtYesNo(property.smokingAllowed)],
//     ['Dietary Preference', fmtText(property.dietaryPreference)],
//     ['Immediate Move-in', fmtYesNo(property.immediateMoveIn)],
//     ['Rental Term', fmtText(property.rentalTerm)],
//     ['Rental Frequency', fmtText(property.rentalFrequency)],
//     ['Minimum Stay', fmtText(property.minimumStayDuration)],
//   ];
//   const saleLegalRows = [
//     ['Loan Outstanding', fmtYesNo(property.loanOutstanding)],
//     ['RERA Approved', fmtYesNo(property.reraApproved)],
//     ['Title Deed Verified', fmtYesNo(property.titleDeedVerify)],
//     ['Construction Status', fmtText(property.constructionStatus)],
//     ['Under Construction', fmtYesNo(property.underConstruction)],
//     ['Possession Timeline', fmtText(property.possessionTimeline)],
//     ['Immediate Possession', fmtYesNo(property.immediatePossession)],
//     ['Ready to Move', fmtYesNo(property.readyToBuy)],
//     ['Lease Type', fmtText(property.leaseType)],
//     ['Lease Terms', fmtText(property.leaseTerms)],
//     ['Renewable Option', fmtYesNo(property.renewableOption)],
//   ];
//   const commercialRows = [
//     ['Commercial Type', fmtText(property.commercialType)],
//     ['Business Type', fmtText(property.businessType)],
//     ['Estimated Footfall', fmtText(property.estimatedFootfall)],
//     ['Operating Hours', fmtText(property.operatingHours)],
//     ['Zoning Type', fmtText(property.zoningType)],
//     ['Fit-out', fmtText(property.fitOut)],
//     ['Frontage Width', fmtFeet(property.frontageWidth)],
//     ['Ceiling Height', fmtFeet(property.ceilingHeight)],
//     ['Power Load Capacity', fmtText(property.powerLoadCapacity)],
//   ];
//   const hostelRows = [
//     ['Hostel Type', fmtText(property.hostelType)],
//     ['Hostel Category', fmtText(property.hostelCategory)],
//     ['Gender', fmtText(property.genderType)],
//     ['Room Type', fmtList(property.roomType)],
//     ['Sharing Type', fmtList(property.sharingType)],
//     ['Total Capacity', fmtText(property.totalCapacity)],
//     ['Bathroom Type', fmtText(property.bathroomType)],
//     ['Food Included', fmtYesNo(property.foodIncluded)],
//     ['Food Type', fmtText(property.foodType)],
//     ['Meals Provided', fmtText(property.mealsPerDay)],
//     ['Kitchen Access', fmtYesNo(property.kitchenAccess)],
//     ['Utilities Included', fmtYesNo(property.utilitiesIncluded)],
//     ['Alcohol Allowed', fmtYesNo(property.alcoholAllowed)],
//     ['Payment Frequency', fmtText(property.paymentFrequency)],
//     ['Payment Mode', fmtText(property.paymentMode)],
//   ];
//   const landUnit = property.areaUnit || 'sq.ft';
//   const landAreaRange = fmtRange(property.landAreaMin, property.landAreaMax, fmtText);
//   const landRows = [
//     [
//       'Land Area',
//       isPresent(property.landArea)
//         ? `${property.landArea} ${landUnit}`
//         : landAreaRange
//         ? `${landAreaRange} ${landUnit}`
//         : null,
//     ],
//     ['Land Shape', fmtText(property.landShape)],
//     ['Road Width', fmtFeet(property.roadWidth)],
//     ['Water Source', fmtText(property.waterSource)],
//     ['Soil Type', fmtText(property.soilType)],
//     ['Electricity Available', fmtYesNo(property.electricityAvailable)],
//   ];
//   const selectedFeatures = Array.isArray(property.selectedFeature)
//     ? property.selectedFeature
//     : [];

//   // ----- ORIGINAL renderDetailSection (gradient bar + slate ring box) -----
//   const renderDetailSection = (title, rows) => {
//     const visible = rows.filter(
//       ([, value]) => value !== null && value !== undefined && value !== ''
//     );
//     if (visible.length === 0) return null;
//     return (
//       <div className="mb-5">
//         <div className="flex items-center gap-2 mb-2">
//           <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
//           <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
//             {title}
//           </h4>
//         </div>
//         <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 ring-1 ring-slate-100">
//           {visible.map(([label, value]) => (
//             <Row key={label} label={label} value={value} />
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <>
//       <style>{`
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
//         @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
//         @keyframes pulse-green { 0%, 100% { box-shadow: 0 0 5px rgba(34,197,94,0.5); transform: rotate(0deg); } 50% { box-shadow: 0 0 20px rgba(34,197,94,0.8); transform: rotate(5deg); } }
//         @keyframes rotate-slow { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
//         @keyframes blinkText { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.97); } }
//         .blink-text { animation: blinkText 0.8s ease-in-out infinite; display: inline-block; }
//         @keyframes tagJump {
//           0%, 100% { transform: translateY(0px) scale(1); box-shadow: 0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8); }
//           50% { transform: translateY(-7px) scale(1.05); box-shadow: 0 0 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,105,92,1), 0 5px 15px rgba(0,0,0,0.5); }
//         }
//         @keyframes contactPulse {
//           0%, 100% { box-shadow: 0 8px 20px rgba(0,105,92,0.3); }
//           50% { box-shadow: 0 8px 25px rgba(0,105,92,0.5), 0 0 0 3px rgba(38,166,154,0.2); }
//         }
//         .tag-animation { animation: tagJump 1.5s ease-in-out infinite; }
//         .contact-button { animation: contactPulse 2s ease-in-out infinite; position: relative; overflow: hidden; }
//         .contact-button::before { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgba(255,255,255,0.3); transform: translate(-50%,-50%); transition: width 0.6s, height 0.6s; }
//         .contact-button:hover::before { width: 300px; height: 300px; }
//         .contact-button:hover { animation: none; }
//         .pulse-green { animation: pulse-green 2s infinite; }
//         .rotate-slow { animation: rotate-slow 3s infinite; }
//         .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
//         .animate-slideIn { animation: slideIn 0.3s ease-out; }
//         .animate-scale-in { animation: scale-in 0.2s ease-out; }
//         .property-details-scroll { -ms-overflow-style: none; scrollbar-width: none; }
//         .property-details-scroll::-webkit-scrollbar { display: none; }
//       `}</style>

//       {/* ============================================ */}
//       {/* CARD                                          */}
//       {/* ============================================ */}
//       <div
//         className="w-full bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden transition-all duration-500 hover:shadow-3xl mb-6 hover:-translate-y-1"
//         style={{
//           transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//           boxShadow: isHovered
//             ? '0 25px 40px -12px rgba(0,105,92,0.4), 0 0 0 1px rgba(0,105,92,0.1)'
//             : '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div className="p-4 md:p-5">
//           <div className="flex flex-col lg:flex-row gap-5 items-stretch">

//             {/* IMAGE SECTION — same layout as the original card */}
//             <div
//               className="w-full lg:w-[35%] xl:w-[32%]"
//               style={{ position: 'relative', minHeight: '260px' }}
//             >
//               <div
//                 className="flex flex-row bg-gray-100 rounded-xl overflow-hidden shadow-lg"
//                 style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
//               >
//                 {/* Main Image */}
//                 <div
//                   className="relative cursor-pointer overflow-hidden flex-1"
//                   onDoubleClick={(e) => handleImageDoubleClick(activeImg, e)}
//                 >
//                   <img
//                     src={carouselImages[activeImg] || profileImage}
//                     alt="Property"
//                     style={{
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'cover',
//                     }}
//                     onError={(e) => {
//                       e.target.src =
//                         'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop';
//                     }}
//                   />

//                   {property.status && (
//                     <div className="absolute top-2 left-2 z-10">
//                       <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
//                         <span className="text-[10px]">✨</span>
//                         <span className="uppercase tracking-wider text-[9px]">
//                           {property.status}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {/* Keep dynamic media support without changing the original image layout */}
//                   {totalCarouselImages > 1 && (
//                     <div className="absolute top-2 right-2 z-10">
//                       <span className="inline-flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-md">
//                         <Images className="w-3 h-3" />
//                         {totalCarouselImages}
//                       </span>
//                     </div>
//                   )}

//                   {videoUrl && (
//                     <button
//                       type="button"
//                       className="absolute bottom-3 left-3 z-10 bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-all shadow-lg hover:scale-105"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setShowVideoModal(true);
//                       }}
//                     >
//                       <span className="w-4 h-4 rounded-full bg-[#00695C] flex items-center justify-center">
//                         <Play className="w-2.5 h-2.5 fill-white text-white" />
//                       </span>
//                       Watch Video
//                     </button>
//                   )}
//                 </div>

//                 {/* Thumbnails */}
//                 <div
//                   className="overflow-y-auto bg-white flex flex-col gap-1 p-1"
//                   style={{
//                     width:
//                       totalCarouselImages <= 2
//                         ? '70px'
//                         : totalCarouselImages <= 3
//                         ? '75px'
//                         : totalCarouselImages <= 4
//                         ? '80px'
//                         : '85px',
//                   }}
//                 >
//                   {carouselImages.map((img, idx) => (
//                     <div
//                       key={idx}
//                       className={`relative overflow-hidden rounded cursor-pointer transition-all duration-200 flex-shrink-0 ${
//                         activeImg === idx
//                           ? 'ring-2 ring-[#26A69A] shadow-md'
//                           : 'hover:shadow-md'
//                       }`}
//                       style={{
//                         height: `calc(100% / ${totalCarouselImages})`,
//                         minHeight: '50px',
//                       }}
//                       onClick={() => setActiveImg(idx)}
//                       onDoubleClick={(e) => handleImageDoubleClick(idx, e)}
//                     >
//                       <img
//                         src={img}
//                         className="w-full h-full object-cover"
//                         alt="thumb"
//                         onError={(e) => {
//                           e.target.src =
//                             'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop';
//                         }}
//                       />

//                       {totalCarouselImages > 5 && idx === 3 && (
//                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-[10px]">
//                           +{totalCarouselImages - 3}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* CONTENT SECTION — same structure/spacing as the original card */}
//             <div className="flex-1 flex flex-col gap-2">

//               {/* PRICE AND HEADER */}
//               <div className="flex flex-wrap justify-between items-start gap-2">
//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
//                     <span className="font-black text-slate-900 text-2xl md:text-3xl">
//                       {formattedPrice}
//                     </span>

//                     {bhk && (
//                       <span className="font-bold text-[#00695C] text-base md:text-lg ml-1">
//                         ({bhk})
//                       </span>
//                     )}

//                     {/* {property.propertyType && (
//                       <span className="font-semibold text-slate-700 text-sm md:text-base">
//                         {property.propertyType}
//                       </span>
//                     )} */}
//                   </div>

//                   <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
//                     {pricePerSqft && (
//                       <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm shadow-sm">
//                         ₹{pricePerSqft.toLocaleString('en-IN')}/sqft
//                       </span>
//                     )}

//                     {(property.builtUpArea || property.carpetArea) && (
//                       <span className="text-[#00695C] font-bold flex items-center gap-1 text-xs md:text-sm">
//                         <span className="text-[#26A69A] text-sm">🟩</span>
//                         {property.builtUpArea || property.carpetArea} sqft
//                       </span>
//                     )}

//                     {property.furnishingStatus && (
//                       <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm shadow-sm">
//                         ✨ {property.furnishingStatus}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex flex-col items-end gap-1 shrink-0">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className="font-black text-[#00695C] uppercase tracking-wide blink-text"
//                       style={{
//                         fontSize: '13px',
//                         letterSpacing: '0.7px',
//                         whiteSpace: 'nowrap',
//                         WebkitFontSmoothing: 'antialiased',
//                       }}
//                     >
//                       {property.propertyType}
//                     </span>
//                   </div>

//                   <div
//                     className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black tracking-wider uppercase flex items-center justify-center gap-1 whitespace-nowrap text-[10px] md:text-xs tag-animation"
//                     style={{
//                       clipPath:
//                         'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%, 8% 50%)',
//                       padding: '2px 10px',
//                       minWidth: '40px',
//                       animation: 'tagJump 1.5s ease-in-out infinite',
//                       boxShadow:
//                         '0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8)',
//                       filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
//                     }}
//                   >
//                     <span className="text-xs md:text-sm">{tag.icon}</span>
//                     <span>{tag.label}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* LOCATION */}
//               {address && (
//                 <div
//                   className="flex items-start gap-2 cursor-pointer group"
//                   onClick={() => openInMaps(address)}
//                   title="View on Google Maps"
//                 >
//                   <div className="bg-teal-100 p-1.5 rounded-lg text-[#00695C] shrink-0 shadow-sm group-hover:bg-teal-300 transition-colors duration-200">
//                     <MapPin className="h-4 w-4" />
//                   </div>
//                   <p className="text-slate-800 font-bold text-sm md:text-base leading-tight group-hover:text-[#00695C] group-hover:underline transition-colors duration-200">
//                     {address}
//                   </p>
//                 </div>
//               )}

//               {/* HIGHLIGHTS */}
//               {highlights.length > 0 && (
//                 <div>
//                   <p className="font-black text-[#004D40] uppercase tracking-wider mb-1.5 flex items-center gap-3 text-[10px] md:text-[11px]">
//                     <span className="w-5 h-px bg-[#004D40]"></span>
//                     Property Highlights
//                   </p>

//                   <div className="flex flex-wrap gap-1.5">
//                     {highlights.map((h, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-1 bg-gray-50 text-[#004D40] px-2 py-1 rounded-lg border border-gray-200 font-medium text-[10px] md:text-xs shadow-sm"
//                       >
//                         <span className="w-1 h-1 rounded-full bg-[#00695C] shrink-0"></span>
//                         <span>{h}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* POSTED BY SECTION */}
//               <div className="pt-2 border-t border-gray-100">
//                 <div className="flex flex-wrap items-center justify-between gap-2">

//                   <div className="flex items-center gap-3 flex-1 min-w-[180px]">
//                     <div
//                       className="rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg overflow-hidden shrink-0 w-10 h-10 md:w-12 md:h-12 text-base md:text-lg cursor-pointer hover:scale-110 hover:shadow-xl transition-all duration-200"
//                       onClick={() => openInMaps(address)}
//                       title="View on Google Maps"
//                     >
//                       {profileImage && !logoError ? (
//                         <img
//                           src={profileImage}
//                           alt="logo"
//                           className="w-full h-full object-cover"
//                           onError={() => setLogoError(true)}
//                         />
//                       ) : (
//                         <span>
//                           {displayName?.charAt(0)?.toUpperCase() || 'U'}
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex flex-col min-w-0">
//                       <p className="text-[#00695C] font-bold uppercase tracking-wider text-[8px] md:text-[9px] leading-tight">
//                         {getListedByText()}
//                       </p>

//                       <div className="flex items-baseline gap-4.5 flex-wrap">
//                         <p className="font-black text-slate-800 text-sm md:text-base leading-snug">
//                           {displayName}
//                         </p>

//                         <button
//                           type="button"
//                           onClick={() => setShowDetailsModal(true)}
//                           className="text-teal-500 hover:text-teal-700 underline flex items-center gap-0.7 transition-all duration-300 hover:translate-x-1 text-sm font-medium whitespace-nowrap"
//                         >
//                           📖 View Details →
//                         </button>
//                       </div>

//                       <span className="text-teal-600 font-medium text-[9px] md:text-[10px] leading-tight">
//                         {[getRoleTitle(), displaySubText]
//                           .filter(Boolean)
//                           .join(' · ')}
//                       </span>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={onContactClick}
//                     onMouseEnter={() => setIsContactHovered(true)}
//                     onMouseLeave={() => setIsContactHovered(false)}
//                     className="contact-button bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-bold rounded-lg flex items-center gap-1 whitespace-nowrap transition-all duration-300 shrink-0 px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm"
//                     style={{
//                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                       transform: isContactHovered
//                         ? 'translateY(-2px) scale(1.02)'
//                         : 'translateY(0) scale(1)',
//                       boxShadow: isContactHovered
//                         ? '0 12px 30px rgba(0,105,92,0.5), 0 0 0 3px rgba(38,166,154,0.3)'
//                         : '0 8px 20px rgba(0,105,92,0.3)',
//                     }}
//                   >
//                     <span
//                       className="text-xs md:text-sm transition-transform duration-300"
//                       style={{
//                         transform: isContactHovered
//                           ? 'scale(1.1) rotate(-5deg)'
//                           : 'scale(1) rotate(0)',
//                       }}
//                     >
//                       📞
//                     </span>
//                     Contact
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ============================================ */}
//       {/* PORTAL-ED MODALS                              */}
//       {/* ============================================ */}

//       {/* ---------- VIDEO MODAL ---------- */}
//       {portalRoot &&
//         showVideoModal &&
//         videoUrl &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/90 backdrop-blur-md z-[1200] flex items-center justify-center p-4 animate-fadeIn"
//             onClick={() => setShowVideoModal(false)}
//           >
//             <div
//               className={`bg-black ${CARD_RADIUS} shadow-2xl max-w-4xl w-full overflow-hidden ring-1 ring-white/10`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="bg-slate-900 border-b border-white/10 p-4 flex justify-between items-center">
//                 <div>
//                   <h3 className="text-white font-bold text-base md:text-lg truncate max-w-[200px] md:max-w-xs">
//                     {property.propertyTitle ||
//                       address?.split(',')[0] ||
//                       'Property Video'}
//                   </h3>
//                   <p className="text-white/60 text-xs">
//                     Click outside or press ESC to close
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setShowVideoModal(false)}
//                   className="text-white/80 hover:text-white transition-colors shrink-0"
//                   aria-label="Close"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="p-4 bg-black">
//                 <div className="relative" style={{ paddingBottom: '56.25%' }}>
//                   <video
//                     controls
//                     controlsList="nodownload noremoteplayback"
//                     disablePictureInPicture
//                     className="absolute inset-0 w-full h-full rounded-lg"
//                     style={{ backgroundColor: '#000' }}
//                     playsInline
//                     preload="metadata"
//                   >
//                     <source src={videoUrl} type="video/mp4" />
//                     <source src={videoUrl} type="video/webm" />
//                     <source src={videoUrl} type="video/ogg" />
//                     Your browser does not support the video tag.
//                   </video>
//                 </div>
//               </div>
//             </div>
//           </div>,
//           portalRoot
//         )}

//       {/* ---------- MAP CONFIRM MODAL ---------- */}
//       {portalRoot &&
//         mapConfirm.show &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fadeIn"
//             onClick={() => setMapConfirm({ show: false, location: '' })}
//           >
//             <div
//               className={`bg-white ${CARD_RADIUS} ${CARD_BORDER} shadow-2xl max-w-sm w-full p-6`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
//                 <MapPin className="w-7 h-7 text-white" />
//               </div>
//               <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
//                 Open in Maps?
//               </h3>
//               <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed">
//                 {mapConfirm.location}
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setMapConfirm({ show: false, location: '' })}
//                   className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     const query = encodeURIComponent(mapConfirm.location);
//                     window.open(
//                       `https://www.google.com/maps/search/?api=1&query=${query}`,
//                       '_blank'
//                     );
//                     setMapConfirm({ show: false, location: '' });
//                   }}
//                   className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-teal-600/20"
//                 >
//                   Open
//                 </button>
//               </div>
//             </div>
//           </div>,
//           portalRoot
//         )}

//       {/* ============================================ */}
//       {/* DETAILS MODAL — ORIGINAL CARD STYLE           */}
//       {/* ============================================ */}
//       {portalRoot &&
//         showDetailsModal &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-start justify-center p-4 pt-16 md:pt-20 animate-fadeIn"
//             onClick={() => setShowDetailsModal(false)}
//           >
//             <div
//               className="bg-white rounded-2xl max-w-[95%] sm:max-w-lg md:max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in mt-16 md:mt-20"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-5 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
//                     {tag.icon}
//                   </div>
//                   <div>
//                     <h3 className="text-white font-bold text-lg md:text-xl">Complete Details</h3>
//                     <p className="text-white/80 text-xs md:text-sm">
//                       {property.postedAs || getRoleTitle()}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="text-white hover:text-gray-200 text-3xl transition-transform hover:scale-110"
//                   aria-label="Close"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="p-5">
//                 {/* POSTER — original modal style */}
//                 <div className="flex items-center gap-4 pb-4 border-b border-teal-100 mb-4">
//                   <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg text-xl overflow-hidden">
//                     {profileImage && !logoError ? (
//                       <img
//                         src={profileImage}
//                         alt="logo"
//                         className="w-full h-full object-cover"
//                         onError={() => setLogoError(true)}
//                       />
//                     ) : (
//                       <span>{displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-[10px] text-[#00695C] font-bold uppercase tracking-wider">
//                       {getListedByText()}
//                     </p>
//                     <p className="text-xl md:text-2xl font-black text-slate-800">
//                       {displayName}
//                     </p>
//                     <p className="text-xs md:text-sm text-teal-600 font-medium mt-0.5">
//                       {getRoleTitle()}
//                       {displaySubText ? ` · ${displaySubText}` : ''}
//                     </p>
//                   </div>
//                 </div>

//                 {/* PROPERTY INFORMATION — original modal box style */}
//                 <div className="mb-4">
//                   <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                     <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                     Property Information
//                   </h4>
//                   <div className="bg-teal-50/50 rounded-xl p-4 space-y-2">
//                     {property.propertyId && (
//                       <p className="text-sm"><strong>Property ID:</strong> {property.propertyId}</p>
//                     )}
//                     {property.propertyTitle && (
//                       <p className="text-sm"><strong>Title:</strong> {property.propertyTitle}</p>
//                     )}
//                     {property.propertyType && (
//                       <p className="text-sm"><strong>Property Type:</strong> {property.propertyType}</p>
//                     )}
//                     {property.propertyCategory && (
//                       <p className="text-sm"><strong>Category:</strong> {property.propertyCategory}</p>
//                     )}
//                     <p className="text-sm">
//                       <strong>Listed Price:</strong> {formattedPrice}{bhk ? ` (${bhk})` : ''}
//                     </p>
//                     {(pricePerSqft || property.builtUpArea || property.carpetArea) && (
//                       <p className="text-sm">
//                         <strong>{pricePerSqft ? `₹${pricePerSqft.toLocaleString('en-IN')}/sqft` : ''}</strong>
//                         {pricePerSqft && ' • '}
//                         {property.builtUpArea || property.carpetArea
//                           ? `🟩 ${property.builtUpArea || property.carpetArea} sqft`
//                           : ''}
//                       </p>
//                     )}
//                     {property.furnishingStatus && (
//                       <p className="text-sm"><strong>Furnishing:</strong> {property.furnishingStatus}</p>
//                     )}
//                     {property.ownershipType && (
//                       <p className="text-sm"><strong>Ownership:</strong> {property.ownershipType}</p>
//                     )}
//                     {property.propertyCondition && (
//                       <p className="text-sm"><strong>Condition:</strong> {property.propertyCondition}</p>
//                     )}
//                     {address && (
//                       <p
//                         className="text-sm flex items-center gap-1 cursor-pointer hover:text-[#00695C] hover:underline transition-colors duration-200 w-fit"
//                         onClick={() => openInMaps(address)}
//                         title="View on Google Maps"
//                       >
//                         <strong>📍 Location:</strong> {address}
//                       </p>
//                     )}
//                     {property.pincode && (
//                       <p className="text-sm"><strong>Pincode:</strong> {property.pincode}</p>
//                     )}
//                     {property.state && (
//                       <p className="text-sm"><strong>State:</strong> {property.state}</p>
//                     )}
//                     {property.city && (
//                       <p className="text-sm"><strong>City:</strong> {property.city}</p>
//                     )}
//                     {property.area && (
//                       <p className="text-sm"><strong>Area:</strong> {property.area}</p>
//                     )}
//                     {property.landmark && (
//                       <p className="text-sm"><strong>Landmark:</strong> {property.landmark}</p>
//                     )}
//                     {property.nearbyConnectivity && (
//                       <p className="text-sm"><strong>Nearby Connectivity:</strong> {property.nearbyConnectivity}</p>
//                     )}
//                     {property.listingPurpose && (
//                       <p className="text-sm"><strong>Purpose:</strong> {property.listingPurpose}</p>
//                     )}
//                     {property.status && (
//                       <p className="text-sm"><strong>Status:</strong> {property.propertyStatus || property.status}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* HIGHLIGHTS — original modal style */}
//                 {highlights.length > 0 && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Property Highlights
//                     </h4>
//                     <div className="bg-teal-50/50 rounded-xl p-4">
//                       <div className="flex flex-wrap gap-2">
//                         {highlights.map((h, i) => (
//                           <span
//                             key={i}
//                             className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm"
//                           >
//                             ✨ {h}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* DESCRIPTION — original modal section style */}
//                 {property.propertyDescription && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Description
//                     </h4>
//                     <div className="bg-teal-50/50 rounded-xl p-4">
//                       <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
//                         {property.propertyDescription}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* ABOUT — original modal section style */}
//                 <div className="mb-4">
//                   <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                     <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                     About {getRoleTitle().replace('Real Estate ', '').replace(' / Developer', '').replace('Property ', '')}
//                   </h4>
//                   <div className="bg-teal-50/50 rounded-xl p-4">
//                     <p className="text-sm text-gray-700 leading-relaxed">
//                       {displaySubText || property.agentDetails || property.ownerDetails?.description || 'No additional details provided.'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* EXTRA DETAILS — same original section visual language */}
//                 {(pricingRows.some(([,v]) => isPresent(v)) ||
//                   tenancyRows.some(([,v]) => isPresent(v)) ||
//                   saleLegalRows.some(([,v]) => isPresent(v)) ||
//                   commercialRows.some(([,v]) => isPresent(v)) ||
//                   hostelRows.some(([,v]) => isPresent(v)) ||
//                   landRows.some(([,v]) => isPresent(v))) && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Additional Property Details
//                     </h4>
//                     <div className="bg-teal-50/50 rounded-xl p-4 space-y-2">
//                       {[...pricingRows, ...tenancyRows, ...saleLegalRows, ...commercialRows, ...hostelRows, ...landRows]
//                         .filter(([, value]) => isPresent(value))
//                         .map(([label, value]) => (
//                           <p key={label} className="text-sm">
//                             <strong>{label}:</strong> {value}
//                           </p>
//                         ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* FEATURES */}
//                 {selectedFeatures.length > 0 && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Features
//                     </h4>
//                     <div className="bg-teal-50/50 rounded-xl p-4">
//                       <div className="flex flex-wrap gap-2">
//                         {selectedFeatures.map((item, i) => (
//                           <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
//                             ✨ {item}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* AMENITIES */}
//                 {amenities.length > 0 && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Amenities ({amenities.length})
//                     </h4>
//                     <div className="bg-teal-50/50 rounded-xl p-4">
//                       <div className="flex flex-wrap gap-2">
//                         {amenities.map((item, i) => (
//                           <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
//                             ✨ {item}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* INTERIOR FEATURES */}
//                 {interiorFeatures.length > 0 && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Interior Features
//                     </h4>
//                     <div className="bg-teal-50/50 rounded-xl p-4">
//                       <div className="flex flex-wrap gap-2">
//                         {interiorFeatures.map((item, i) => (
//                           <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
//                             ✨ {item}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* APPLIANCES */}
//                 {appliances.length > 0 && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Appliances Included
//                     </h4>
//                     <div className="bg-teal-50/50 rounded-xl p-4">
//                       <div className="flex flex-wrap gap-2">
//                         {appliances.map((item, i) => (
//                           <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
//                             ✨ {item}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* NEARBY ACCESS */}
//                 {nearbyAccess.length > 0 && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Nearby Access
//                     </h4>
//                     <div className="bg-teal-50/50 rounded-xl p-4">
//                       <div className="flex flex-wrap gap-2">
//                         {nearbyAccess.map((item, i) => (
//                           <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
//                             ✨ {item}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* CONTACT INFORMATION — original modal style */}
//                 <div className="mb-4">
//                   <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                     <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                     Contact Information
//                   </h4>
//                   <div className="bg-gray-50 rounded-xl p-4 space-y-2">
//                     <p className="text-sm flex items-center gap-2 break-all">
//                       <span className="text-teal-600">📧</span>
//                       <span>
//                         {property.contactEmail ||
//                           (displayName || 'propertyowner').toLowerCase().replace(/\s/g, '') +
//                             '@example.com'}
//                       </span>
//                     </p>
//                     <p className="text-sm flex items-center gap-2">
//                       <span className="text-teal-600">📞</span>
//                       <span>{property.contactPhone || '+91 98765 43210'}</span>
//                     </p>
//                     {address && (
//                       <p
//                         className="text-sm flex items-center gap-2 cursor-pointer hover:text-[#00695C] hover:underline transition-colors duration-200 w-fit"
//                         onClick={() => openInMaps(address)}
//                         title="View on Google Maps"
//                       >
//                         <span className="text-teal-600">📍</span>
//                         <span>{address}</span>
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {(property.experience || property.achievements) && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                       <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                       Additional Information
//                     </h4>
//                     <div className="bg-teal-50/30 rounded-xl p-4 space-y-2">
//                       {property.experience && (
//                         <p className="text-sm flex items-center gap-2">
//                           <span className="text-teal-600">⭐</span>
//                           <span><strong>Experience:</strong> {property.experience}</span>
//                         </p>
//                       )}
//                       {property.achievements && (
//                         <p className="text-sm flex items-center gap-2">
//                           <span className="text-teal-600">🏆</span>
//                           <span><strong>Achievements:</strong> {property.achievements}</span>
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* PHOTOS — original modal style */}
//                 <div className="mb-4">
//                   <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                     <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
//                     Photos Uploaded ({totalCarouselImages} {totalCarouselImages === 1 ? 'Photo' : 'Photos'})
//                   </h4>
//                   <div className="bg-teal-50/40 rounded-xl p-4">
//                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
//                       {carouselImages.map((img, idx) => (
//                         <div
//                           key={idx}
//                           className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all hover:scale-105"
//                           onClick={() => {
//                             setGalleryActiveImg(idx);
//                             setShowFullGallery(true);
//                             setShowDetailsModal(false);
//                           }}
//                         >
//                           <img
//                             src={img}
//                             alt={`property-photo-${idx + 1}`}
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               e.target.src =
//                                 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop';
//                             }}
//                           />
//                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
//                             <span className="text-white text-[10px] bg-black/60 px-2 py-0.5 rounded-full">
//                               Click
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <p className="text-[10px] text-teal-600 mt-3 text-center">
//                       💡 Click on any photo to view larger gallery
//                     </p>
//                     {videoUrl && (
//                       <div className="text-center mt-3">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setShowDetailsModal(false);
//                             setShowVideoModal(true);
//                           }}
//                           className="text-[10px] text-teal-600 hover:text-teal-800 font-semibold hover:underline"
//                         >
//                           🎥 Watch Property Video
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* FOOTER — exact original modal visual language */}
//                 <div className="flex gap-3 mt-5 pt-4 border-t border-teal-100">
//                   <button
//                     onClick={() => {
//                       setShowDetailsModal(false);
//                       onContactClick();
//                     }}
//                     className="flex-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg"
//                   >
//                     📞 Contact Now
//                   </button>
//                   <button
//                     onClick={() => setShowDetailsModal(false)}
//                     className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-200 shadow-sm"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>,
//           portalRoot
//         )}

//       {/* ---------- FULL GALLERY ---------- */}
//       {portalRoot &&
//         showFullGallery &&
//         createPortal(
//           <div
//             className="fixed inset-0 bg-black/95 z-[1100] flex flex-col animate-fadeIn"
//             onClick={() => setShowFullGallery(false)}
//           >
//             <div className="bg-gradient-to-r from-teal-700/40 to-emerald-700/40 backdrop-blur-sm border-b border-white/10 p-3 md:p-4 flex justify-between items-center px-4 md:px-6">
//               <div className="pr-2">
//                 <h3 className="text-white font-semibold text-sm md:text-lg truncate max-w-[200px] md:max-w-none">
//                   {property.propertyTitle ||
//                     address?.split(',')[0] ||
//                     'Property Gallery'}
//                 </h3>
//                 <p className="text-white/60 text-[11px] md:text-xs mt-0.5">
//                   Click outside or press ESC to close
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowFullGallery(false)}
//                 className="text-white/80 hover:text-white transition-colors shrink-0"
//                 aria-label="Close"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div
//               className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 pb-2"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="relative w-full max-w-4xl">
//                 <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/50 ring-1 ring-white/10">
//                   <img
//                     src={carouselImages[galleryActiveImg]}
//                     alt="Gallery main"
//                     className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain"
//                     onError={(e) => {
//                       e.target.src =
//                         'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
//                     }}
//                   />
//                 </div>
//                 {totalCarouselImages > 1 && (
//                   <>
//                     <button
//                       onClick={prevGalleryImg}
//                       className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ring-1 ring-white/20"
//                       aria-label="Previous"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={nextGalleryImg}
//                       className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ring-1 ring-white/20"
//                       aria-label="Next"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </>
//                 )}
//               </div>

//               <div className="mt-3 inline-flex items-center gap-2 text-white/80 text-xs md:text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full ring-1 ring-white/15">
//                 <Images className="w-3.5 h-3.5" />
//                 {galleryActiveImg + 1} / {totalCarouselImages}
//               </div>

//               <div className="w-full max-w-5xl mt-4 md:mt-6 px-2">
//                 <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
//                   {carouselImages.map((img, idx) => (
//                     <div
//                       key={idx}
//                       className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${
//                         galleryActiveImg === idx
//                           ? 'ring-2 ring-teal-400 opacity-100 scale-105'
//                           : 'opacity-60 hover:opacity-100 ring-1 ring-white/10'
//                       }`}
//                       onClick={() => setGalleryActiveImg(idx)}
//                     >
//                       <img
//                         src={img}
//                         alt="thumb"
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.src =
//                             'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop';
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>,
//           portalRoot
//         )}
//     </>
//   );
// };

// // ============================================
// // HELPER COMPONENTS — restored to ORIGINAL versions
// // ============================================
// const Row = ({ label, value }) => (
//   <div className="flex justify-between gap-3 text-sm py-0.5">
//     <span className="text-slate-500">{label}</span>
//     <span className="text-slate-800 font-semibold text-right">{value}</span>
//   </div>
// );

// const QuickStat = ({ icon: Icon, label, value }) => (
//   <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-xl p-3 ring-1 ring-teal-100/70">
//     <div className="flex items-center gap-1.5 mb-1">
//       <Icon className="w-3.5 h-3.5 text-teal-600" />
//       <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
//         {label}
//       </span>
//     </div>
//     <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
//   </div>
// );

// const ChipSection = ({ title, items, tone = 'teal' }) => {
//   const toneClasses = {
//     teal: 'bg-teal-50 text-teal-700 ring-teal-100',
//     emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
//     indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
//     amber: 'bg-amber-50 text-amber-700 ring-amber-100',
//     sky: 'bg-sky-50 text-sky-700 ring-sky-100',
//   };
//   const cls = toneClasses[tone] || toneClasses.teal;

//   return (
//     <div className="mb-5">
//       <div className="flex items-center gap-2 mb-2">
//         <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
//         <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
//           {title}
//         </h4>
//       </div>
//       <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 ring-1 ring-slate-100 flex flex-wrap gap-2">
//         {items.map((item, i) => (
//           <span
//             key={i}
//             className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ring-1 ${cls}`}
//           >
//             <Sparkles className="w-3 h-3 opacity-70" />
//             {item}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;




















// src/components/PropertyCard.jsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin,
  Play,
  Phone,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Building2,
  BedDouble,
  Bath,
  Ruler,
  Car,
  Sparkles,
  Home,
  ShieldCheck,
  Tag,
  ArrowRight,
  Images,
} from 'lucide-react';

// ============================================
// PORTAL HOOK — escapes stacking contexts
// ============================================
const usePortal = (id = 'modal-root') => {
  const [container, setContainer] = useState(null);
  useEffect(() => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
    }
    setContainer(el);
  }, [id]);
  return container;
};

// ============================================
// DESIGN TOKENS
// ============================================
const CARD_BORDER = 'border border-teal-100';
const CARD_RADIUS = 'rounded-2xl';
const CARD_SHADOW_IDLE =
  '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)';
const CARD_SHADOW_HOVER =
  '0 25px 40px -12px rgba(0,105,92,0.4), 0 0 0 1px rgba(0,105,92,0.1)';



const PropertyCard = ({ property, onContactClick }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [galleryActiveImg, setGalleryActiveImg] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [mapConfirm, setMapConfirm] = useState({ show: false, location: '' });
  const [showVideoModal, setShowVideoModal] = useState(false);

  const portalRoot = usePortal();

  // ============================================
  // HELPERS
  // ============================================
  const formatPriceAmount = (amount) => {
    if (!amount) return '₹0';
    const num = parseFloat(amount);
    if (isNaN(num)) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
    return `₹${num}`;
  };

  const extractBHK = (bedrooms) => {
    if (bedrooms === undefined || bedrooms === null || bedrooms === '') return '';
    const str = String(bedrooms).trim();
    const match = str.match(/(\d+)\s*(BHK|RK)/i);
    if (match) return match[0].replace(/\s+/g, ' ').toUpperCase();
    const numMatch = str.match(/^\d+(\.\d+)?$/);
    if (numMatch) return `${str} BHK`;
    return str;
  };

  const getImages = () => {
    if (!Array.isArray(property.images)) return [];
    return property.images
      .map((m) => (typeof m === 'string' ? m : m?.fileUrl))
      .filter((url) => url && !url.includes('video'));
  };

  const getVideo = () => {
    if (!Array.isArray(property.images)) return null;
    const v = property.images.find(
      (m) =>
        (typeof m === 'object' && m?.mediaType === 'video') ||
        (typeof m === 'object' && m?.fileUrl?.includes('video'))
    );
    return v ? v.fileUrl : null;
  };

  const getProfileImage = () =>
    property?.postedBy?.profilePhotoUrl ||
    property?.ownerDetails?.profilePhotoUrl ||
    property?.logo;

  const getTag = () => {
    const purpose = property.listingPurpose?.toUpperCase() || property.tag?.toUpperCase();
    const tagMap = {
      BUY: { label: 'BUY', tone: 'sale', icon: '💰' },
      SELL: { label: 'SELL', tone: 'sale', icon: '🏷️' },
      RENT: { label: 'RENT', tone: 'rent', icon: '🔑' },
      LEASE: { label: 'LEASE', tone: 'lease', icon: '📄' },
    };
    return tagMap[purpose] || { label: purpose || 'RENT', tone: 'rent', icon: '🔑' };
  };

  const getRoleTitle = () => {
    const p = property.postedAs?.toUpperCase();
    if (p === 'AGENT') return 'Real Estate Agent';
    if (p === 'BUILDER') return 'Builder / Developer';
    if (p === 'PROPERTY_MANAGEMENT') return 'Property Management';
    return 'Property Owner';
  };

  const getListedByText = () => {
    const p = property.postedAs?.toUpperCase();
    if (p === 'AGENT') return '🏢 Listed By (Agent)';
    if (p === 'BUILDER') return '🏗️ Listed By (Builder)';
    if (p === 'PROPERTY_MANAGEMENT') return '🏢 Listed By (PM)';
    return '🏠 Listed By (Owner)';
  };

  const getAmenities = () => {
    if (Array.isArray(property.amenities)) return property.amenities;
    if (typeof property.amenities === 'string')
      return property.amenities.split(',').map((a) => a.trim()).filter(Boolean);
    return [];
  };

  const getNearbyAccess = () => {
    const nearby = property.nearbyPlaces ?? property.nearbyAccess;
    if (Array.isArray(nearby)) return nearby;
    if (typeof nearby === 'string')
      return nearby.split(',').map((a) => a.trim()).filter(Boolean);
    return [];
  };

  const getAppliances = () => {
    if (Array.isArray(property.applianceIncluded)) return property.applianceIncluded;
    if (typeof property.applianceIncluded === 'string')
      return property.applianceIncluded.split(',').map((a) => a.trim()).filter(Boolean);
    return [];
  };

  const getInteriorFeatures = () => {
    if (Array.isArray(property.interiorFeatures)) return property.interiorFeatures;
    if (typeof property.interiorFeatures === 'string')
      return property.interiorFeatures.split(',').map((a) => a.trim()).filter(Boolean);
    return [];
  };

  const getAddress = () =>
    property.propertyAddress || property.city || property.location || '';

  const getPricePerSqft = () => {
    const area = parseFloat(property.builtUpArea || property.carpetArea);
    const price = parseFloat(property.expectedPrice);
    if (!area || !price) return null;
    return Math.round(price / area);
  };

  const getHighlights = () => {
    if (typeof property.highlights === 'string' && property.highlights.includes('|')) {
      return property.highlights.split('|').map((h) => h.trim()).filter(Boolean);
    }
    const items = [];
    if (property.furnishingStatus) items.push(property.furnishingStatus);
    if (property.readyToBuy?.toLowerCase() === 'yes') items.push('Ready to Move');
    if (property.parking?.toLowerCase() === 'yes') items.push('Parking');
    if (property.petFriendly?.toLowerCase() === 'yes') items.push('Pet Friendly');
    if (property.hasBalcony?.toLowerCase() === 'yes') items.push('Balcony');
    if (property.hasTerrace?.toLowerCase() === 'yes') items.push('Terrace');
    if (property.propertyCondition) items.push(property.propertyCondition);
    return items.slice(0, 8);
  };

  const openInMaps = (location) => setMapConfirm({ show: true, location });

  const getDisplayName = () => {
    const p = property.postedAs?.toUpperCase();
    if (property.postedBy?.displayName) return property.postedBy.displayName;
    if (p === 'AGENT')
      return property.agentDetails?.agentName || property.ownerName || 'Agent';
    if (p === 'BUILDER')
      return property.builderDetails?.name || property.ownerName || 'Builder';
    if (p === 'PROPERTY_MANAGEMENT')
      return property.pmDetails?.name || property.ownerName || 'Property Management';
    return property.userName || property.ownerName || 'Property Owner';
  };

  const getDisplaySubText = () => {
    const p = property.postedAs?.toUpperCase();
    if (property.postedBy?.organisationName) return property.postedBy.organisationName;
    if (p === 'AGENT') return property.agentDetails?.agencyName || '';
    if (p === 'BUILDER') return property.builderDetails?.companyName || '';
    if (p === 'PROPERTY_MANAGEMENT') return property.pmDetails?.companyName || '';
    return '';
  };

  // ============================================
  // IMAGE NAV
  // ============================================
  const carouselImages = getImages();
  const totalCarouselImages = carouselImages.length;
  const videoUrl = getVideo();
  const displayName = getDisplayName();
  const displaySubText = getDisplaySubText();

  if (totalCarouselImages === 0) carouselImages.push('');

  const nextGalleryImg = (e) => {
    e.stopPropagation();
    setGalleryActiveImg((prev) => (prev + 1) % totalCarouselImages);
  };
  const prevGalleryImg = (e) => {
    e.stopPropagation();
    setGalleryActiveImg((prev) => (prev - 1 + totalCarouselImages) % totalCarouselImages);
  };
  const handleImageDoubleClick = (idx, e) => {
    e.stopPropagation();
    setGalleryActiveImg(idx);
    setShowFullGallery(true);
  };

  // ============================================
  // DERIVED VALUES
  // ============================================
  const tag = getTag();
  const bhk = extractBHK(property.bedrooms);
  const formattedPrice = formatPriceAmount(property.expectedPrice);
  const profileImage = getProfileImage();
  const address = getAddress();
  const amenities = getAmenities();
  const nearbyAccess = getNearbyAccess();
  const appliances = getAppliances();
  const pricePerSqft = getPricePerSqft();
  const highlights = getHighlights();
  const interiorFeatures = getInteriorFeatures();

  const tagGradient =
    tag.tone === 'sale'
      ? 'from-rose-500 to-orange-500'
      : tag.tone === 'lease'
      ? 'from-indigo-500 to-violet-500'
      : 'from-[#00695C] to-[#26A69A]';

  // ============================================
  // DETAIL FORMATTERS
  // ============================================
  const isPresent = (v) =>
    v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
  const fmtText = (v) => (isPresent(v) ? String(v) : null);
  const fmtList = (v) =>
    Array.isArray(v) ? (v.length ? v.join(', ') : null) : fmtText(v);
  const fmtMoney = (v) =>
    isPresent(v) && Number(v) > 0 ? `₹${Number(v).toLocaleString('en-IN')}` : null;
  const fmtYesNo = (v) => {
    if (!isPresent(v)) return null;
    const s = String(v).toLowerCase();
    if (s === 'yes' || s === 'true') return 'Yes';
    if (s === 'no' || s === 'false') return 'No';
    return String(v);
  };
  const fmtFeet = (v) => {
    if (!isPresent(v)) return null;
    const s = String(v);
    return /ft|feet/i.test(s) ? s : `${s} ft`;
  };
  const fmtRange = (min, max, fmt) => {
    const lo = fmt(min);
    const hi = fmt(max);
    if (lo && hi && lo !== hi) return `${lo} - ${hi}`;
    return lo || hi;
  };
  const fmtDate = (v) => {
    if (!isPresent(v)) return null;
    const d = new Date(v);
    return isNaN(d)
      ? null
      : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ============================================
  // DETAIL ROWS
  // ============================================
  const generalRows = [
    ['Sub Category', fmtText(property.subCategory)],
    ['City', property.propertyAddress ? fmtText(property.city) : null],
    ['Area', fmtText(property.area)],
    ['District', fmtText(property.district)],
    ['Landmark', fmtText(property.landmark)],
    ['Nearby Connectivity', fmtText(property.nearbyConnectivity)],
    ['Corner Unit', fmtYesNo(property.cornerUnit)],
    ['Listed On', fmtDate(property.createdAt)],
  ];
  const pricingRows = [
    ['Security Deposit', fmtMoney(property.securityDeposit ?? property.securityDepositMin)],
    ['Maintenance Charges', fmtMoney(property.maintenance)],
    ['Maintenance Included', fmtYesNo(property.maintenanceIncluded)],
    ['Price Range', fmtRange(property.priceMin, property.priceMax, fmtMoney)],
    ['Property Tax', fmtYesNo(property.propertyTax)],
  ];
  const tenancyRows = [
    ['Tenant Type', fmtList(property.tenantType)],
    ['Smoking Allowed', fmtYesNo(property.smokingAllowed)],
    ['Dietary Preference', fmtText(property.dietaryPreference)],
    ['Immediate Move-in', fmtYesNo(property.immediateMoveIn)],
    ['Rental Term', fmtText(property.rentalTerm)],
    ['Rental Frequency', fmtText(property.rentalFrequency)],
    ['Minimum Stay', fmtText(property.minimumStayDuration)],
  ];
  const saleLegalRows = [
    ['Loan Outstanding', fmtYesNo(property.loanOutstanding)],
    ['RERA Approved', fmtYesNo(property.reraApproved)],
    ['Title Deed Verified', fmtYesNo(property.titleDeedVerify)],
    ['Construction Status', fmtText(property.constructionStatus)],
    ['Under Construction', fmtYesNo(property.underConstruction)],
    ['Possession Timeline', fmtText(property.possessionTimeline)],
    ['Immediate Possession', fmtYesNo(property.immediatePossession)],
    ['Ready to Move', fmtYesNo(property.readyToBuy)],
    ['Lease Type', fmtText(property.leaseType)],
    ['Lease Terms', fmtText(property.leaseTerms)],
    ['Renewable Option', fmtYesNo(property.renewableOption)],
  ];
  const commercialRows = [
    ['Commercial Type', fmtText(property.commercialType)],
    ['Business Type', fmtText(property.businessType)],
    ['Estimated Footfall', fmtText(property.estimatedFootfall)],
    ['Operating Hours', fmtText(property.operatingHours)],
    ['Zoning Type', fmtText(property.zoningType)],
    ['Fit-out', fmtText(property.fitOut)],
    ['Frontage Width', fmtFeet(property.frontageWidth)],
    ['Ceiling Height', fmtFeet(property.ceilingHeight)],
    ['Power Load Capacity', fmtText(property.powerLoadCapacity)],
  ];
  const hostelRows = [
    ['Hostel Type', fmtText(property.hostelType)],
    ['Hostel Category', fmtText(property.hostelCategory)],
    ['Gender', fmtText(property.genderType)],
    ['Room Type', fmtList(property.roomType)],
    ['Sharing Type', fmtList(property.sharingType)],
    ['Total Capacity', fmtText(property.totalCapacity)],
    ['Bathroom Type', fmtText(property.bathroomType)],
    ['Food Included', fmtYesNo(property.foodIncluded)],
    ['Food Type', fmtText(property.foodType)],
    ['Meals Provided', fmtText(property.mealsPerDay)],
    ['Kitchen Access', fmtYesNo(property.kitchenAccess)],
    ['Utilities Included', fmtYesNo(property.utilitiesIncluded)],
    ['Alcohol Allowed', fmtYesNo(property.alcoholAllowed)],
    ['Payment Frequency', fmtText(property.paymentFrequency)],
    ['Payment Mode', fmtText(property.paymentMode)],
  ];
  const landUnit = property.areaUnit || 'sq.ft';
  const landAreaRange = fmtRange(property.landAreaMin, property.landAreaMax, fmtText);
  const landRows = [
    [
      'Land Area',
      isPresent(property.landArea)
        ? `${property.landArea} ${landUnit}`
        : landAreaRange
        ? `${landAreaRange} ${landUnit}`
        : null,
    ],
    ['Land Shape', fmtText(property.landShape)],
    ['Road Width', fmtFeet(property.roadWidth)],
    ['Water Source', fmtText(property.waterSource)],
    ['Soil Type', fmtText(property.soilType)],
    ['Electricity Available', fmtYesNo(property.electricityAvailable)],
  ];
  const selectedFeatures = Array.isArray(property.selectedFeature)
    ? property.selectedFeature
    : [];

  // ----- ORIGINAL renderDetailSection (gradient bar + slate ring box) -----
  const renderDetailSection = (title, rows) => {
    const visible = rows.filter(
      ([, value]) => value !== null && value !== undefined && value !== ''
    );
    if (visible.length === 0) return null;
    return (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {title}
          </h4>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 ring-1 ring-slate-100">
          {visible.map(([label, value]) => (
            <Row key={label} label={label} value={value} />
          ))}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse-green { 0%, 100% { box-shadow: 0 0 5px rgba(34,197,94,0.5); transform: rotate(0deg); } 50% { box-shadow: 0 0 20px rgba(34,197,94,0.8); transform: rotate(5deg); } }
        @keyframes rotate-slow { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
        @keyframes blinkText { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.97); } }
        .blink-text { animation: blinkText 0.8s ease-in-out infinite; display: inline-block; }
        @keyframes tagJump {
          0%, 100% { transform: translateY(0px) scale(1); box-shadow: 0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8); }
          50% { transform: translateY(-7px) scale(1.05); box-shadow: 0 0 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,105,92,1), 0 5px 15px rgba(0,0,0,0.5); }
        }
        @keyframes contactPulse {
          0%, 100% { box-shadow: 0 8px 20px rgba(0,105,92,0.3); }
          50% { box-shadow: 0 8px 25px rgba(0,105,92,0.5), 0 0 0 3px rgba(38,166,154,0.2); }
        }
        .tag-animation { animation: tagJump 1.5s ease-in-out infinite; }
        .contact-button { animation: contactPulse 2s ease-in-out infinite; position: relative; overflow: hidden; }
        .contact-button::before { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgba(255,255,255,0.3); transform: translate(-50%,-50%); transition: width 0.6s, height 0.6s; }
        .contact-button:hover::before { width: 300px; height: 300px; }
        .contact-button:hover { animation: none; }
        .pulse-green { animation: pulse-green 2s infinite; }
        .rotate-slow { animation: rotate-slow 3s infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        .property-details-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .property-details-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ============================================ */}
      {/* CARD                                          */}
      {/* ============================================ */}
      <div
        className="w-full bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden transition-all duration-500 hover:shadow-3xl mb-6 hover:-translate-y-1"
        style={{
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovered
            ? '0 25px 40px -12px rgba(0,105,92,0.4), 0 0 0 1px rgba(0,105,92,0.1)'
            : '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 md:p-5">
          <div className="flex flex-col lg:flex-row gap-5 items-stretch">

            {/* IMAGE SECTION — same layout as the original card */}
            <div
              className="w-full lg:w-[35%] xl:w-[32%]"
              style={{ position: 'relative', minHeight: '260px' }}
            >
              <div
                className="flex flex-row bg-gray-100 rounded-xl overflow-hidden shadow-lg"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              >
                {/* Main Image */}
                <div
                  className="relative cursor-pointer overflow-hidden flex-1"
                  onDoubleClick={(e) => handleImageDoubleClick(activeImg, e)}
                >
                  <img
                    src={carouselImages[activeImg] || profileImage}
                    alt="Property"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop';
                    }}
                  />

                  {property.status && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                        <span className="text-[10px]">✨</span>
                        <span className="uppercase tracking-wider text-[9px]">
                          {property.status}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Keep dynamic media support without changing the original image layout */}
                  {totalCarouselImages > 1 && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="inline-flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-md">
                        <Images className="w-3 h-3" />
                        {totalCarouselImages}
                      </span>
                    </div>
                  )}

                  {videoUrl && (
                    <button
                      type="button"
                      className="absolute bottom-3 left-3 z-10 bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-all shadow-lg hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVideoModal(true);
                      }}
                    >
                      <span className="w-4 h-4 rounded-full bg-[#00695C] flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-white text-white" />
                      </span>
                      Watch Video
                    </button>
                  )}
                </div>

                {/* Thumbnails */}
                <div
                  className="overflow-y-auto bg-white flex flex-col gap-1 p-1"
                  style={{
                    width:
                      totalCarouselImages <= 2
                        ? '70px'
                        : totalCarouselImages <= 3
                        ? '75px'
                        : totalCarouselImages <= 4
                        ? '80px'
                        : '85px',
                  }}
                >
                  {carouselImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded cursor-pointer transition-all duration-200 flex-shrink-0 ${
                        activeImg === idx
                          ? 'ring-2 ring-[#26A69A] shadow-md'
                          : 'hover:shadow-md'
                      }`}
                      style={{
                        height: `calc(100% / ${totalCarouselImages})`,
                        minHeight: '50px',
                      }}
                      onClick={() => setActiveImg(idx)}
                      onDoubleClick={(e) => handleImageDoubleClick(idx, e)}
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt="thumb"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop';
                        }}
                      />

                      {totalCarouselImages > 5 && idx === 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-[10px]">
                          +{totalCarouselImages - 3}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CONTENT SECTION — same structure/spacing as the original card */}
            <div className="flex-1 flex flex-col gap-2">

              {/* PRICE AND HEADER */}
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                    <span className="font-black text-slate-900 text-2xl md:text-3xl">
                      {formattedPrice}
                    </span>

                    {bhk && (
                      <span className="font-bold text-[#00695C] text-base md:text-lg ml-1">
                        ({bhk})
                      </span>
                    )}

                    {/* {property.propertyType && (
                      <span className="font-semibold text-slate-700 text-sm md:text-base">
                        {property.propertyType}
                      </span>
                    )} */}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    {pricePerSqft && (
                      <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm shadow-sm">
                        ₹{pricePerSqft.toLocaleString('en-IN')}/sqft
                      </span>
                    )}

                    {(property.builtUpArea || property.carpetArea) && (
                      <span className="text-[#00695C] font-bold flex items-center gap-1 text-xs md:text-sm">
                        <span className="text-[#26A69A] text-sm">🟩</span>
                        {property.builtUpArea || property.carpetArea} sqft
                      </span>
                    )}

                    {property.furnishingStatus && (
                      <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm shadow-sm">
                        ✨ {property.furnishingStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-black text-[#00695C] uppercase tracking-wide blink-text"
                      style={{
                        fontSize: '13px',
                        letterSpacing: '0.7px',
                        whiteSpace: 'nowrap',
                        WebkitFontSmoothing: 'antialiased',
                      }}
                    >
                      {property.propertyType}
                    </span>
                  </div>

                  <div
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black tracking-wider uppercase flex items-center justify-center gap-1 whitespace-nowrap text-[10px] md:text-xs tag-animation"
                    style={{
                      clipPath:
                        'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%, 8% 50%)',
                      padding: '2px 10px',
                      minWidth: '40px',
                      animation: 'tagJump 1.5s ease-in-out infinite',
                      boxShadow:
                        '0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8)',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                    }}
                  >
                    <span className="text-xs md:text-sm">{tag.icon}</span>
                    <span>{tag.label}</span>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              {address && (
                <div
                  className="flex items-start gap-2 cursor-pointer group"
                  onClick={() => openInMaps(address)}
                  title="View on Google Maps"
                >
                  <div className="bg-teal-100 p-1.5 rounded-lg text-[#00695C] shrink-0 shadow-sm group-hover:bg-teal-300 transition-colors duration-200">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <p className="text-slate-800 font-bold text-sm md:text-base leading-tight group-hover:text-[#00695C] group-hover:underline transition-colors duration-200">
                    {address}
                  </p>
                </div>
              )}

              {/* HIGHLIGHTS */}
              {highlights.length > 0 && (
                <div>
                  <p className="font-black text-[#004D40] uppercase tracking-wider mb-1.5 flex items-center gap-3 text-[10px] md:text-[11px]">
                    <span className="w-5 h-px bg-[#004D40]"></span>
                    Property Highlights
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 bg-gray-50 text-[#004D40] px-2 py-1 rounded-lg border border-gray-200 font-medium text-[10px] md:text-xs shadow-sm"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#00695C] shrink-0"></span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* POSTED BY SECTION */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-2">

                  <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                    <div
                      className="rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg overflow-hidden shrink-0 w-10 h-10 md:w-12 md:h-12 text-base md:text-lg cursor-pointer hover:scale-110 hover:shadow-xl transition-all duration-200"
                      onClick={() => openInMaps(address)}
                      title="View on Google Maps"
                    >
                      {profileImage && !logoError ? (
                        <img
                          src={profileImage}
                          alt="logo"
                          className="w-full h-full object-cover"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <span>
                          {displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="text-[#00695C] font-bold uppercase tracking-wider text-[8px] md:text-[9px] leading-tight">
                        {getListedByText()}
                      </p>

                      <div className="flex items-baseline gap-4.5 flex-wrap">
                        <p className="font-black text-slate-800 text-sm md:text-base leading-snug">
                          {displayName}
                        </p>

                        <button
                          type="button"
                          onClick={() => setShowDetailsModal(true)}
                          className="text-teal-500 hover:text-teal-700 underline flex items-center gap-0.7 transition-all duration-300 hover:translate-x-1 text-sm font-medium whitespace-nowrap"
                        >
                          📖 View Details →
                        </button>
                      </div>

                      <span className="text-teal-600 font-medium text-[9px] md:text-[10px] leading-tight">
                        {[getRoleTitle(), displaySubText]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onContactClick}
                    onMouseEnter={() => setIsContactHovered(true)}
                    onMouseLeave={() => setIsContactHovered(false)}
                    className="contact-button bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-bold rounded-lg flex items-center gap-1 whitespace-nowrap transition-all duration-300 shrink-0 px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isContactHovered
                        ? 'translateY(-2px) scale(1.02)'
                        : 'translateY(0) scale(1)',
                      boxShadow: isContactHovered
                        ? '0 12px 30px rgba(0,105,92,0.5), 0 0 0 3px rgba(38,166,154,0.3)'
                        : '0 8px 20px rgba(0,105,92,0.3)',
                    }}
                  >
                    <span
                      className="text-xs md:text-sm transition-transform duration-300"
                      style={{
                        transform: isContactHovered
                          ? 'scale(1.1) rotate(-5deg)'
                          : 'scale(1) rotate(0)',
                      }}
                    >
                      📞
                    </span>
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* PORTAL-ED MODALS                              */}
      {/* ============================================ */}

      {/* ---------- VIDEO MODAL ---------- */}
      {portalRoot &&
        showVideoModal &&
        videoUrl &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[1200] flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setShowVideoModal(false)}
          >
            <div
              className={`bg-black ${CARD_RADIUS} shadow-2xl max-w-4xl w-full overflow-hidden ring-1 ring-white/10`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-900 border-b border-white/10 p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-base md:text-lg truncate max-w-[200px] md:max-w-xs">
                    {property.propertyTitle ||
                      address?.split(',')[0] ||
                      'Property Video'}
                  </h3>
                  <p className="text-white/60 text-xs">
                    Click outside or press ESC to close
                  </p>
                </div>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-white/80 hover:text-white transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 bg-black">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <video
                    controls
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    className="absolute inset-0 w-full h-full rounded-lg"
                    style={{ backgroundColor: '#000' }}
                    playsInline
                    preload="metadata"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>,
          portalRoot
        )}

      {/* ---------- MAP CONFIRM MODAL ---------- */}
      {portalRoot &&
        mapConfirm.show &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setMapConfirm({ show: false, location: '' })}
          >
            <div
              className={`bg-white ${CARD_RADIUS} ${CARD_BORDER} shadow-2xl max-w-sm w-full p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                Open in Maps?
              </h3>
              <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed">
                {mapConfirm.location}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setMapConfirm({ show: false, location: '' })}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const query = encodeURIComponent(mapConfirm.location);
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${query}`,
                      '_blank'
                    );
                    setMapConfirm({ show: false, location: '' });
                  }}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-teal-600/20"
                >
                  Open
                </button>
              </div>
            </div>
          </div>,
          portalRoot
        )}

      {/* ============================================ */}
      {/* DETAILS MODAL — ORIGINAL CARD STYLE           */}
      {/* ============================================ */}
      {portalRoot &&
        showDetailsModal &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-start justify-center p-4 pt-16 md:pt-20 animate-fadeIn"
            onClick={() => setShowDetailsModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-[95%] sm:max-w-lg md:max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in mt-16 md:mt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-5 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                    {tag.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg md:text-xl">Complete Details</h3>
                    <p className="text-white/80 text-xs md:text-sm">
                      {property.postedAs || getRoleTitle()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:text-gray-200 text-3xl transition-transform hover:scale-110"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">
                {/* PROPERTY INFORMATION — property-only; contact-person details are handled by onContactClick */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Property Information
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4 space-y-2">
                    {property.propertyId && (
                      <p className="text-sm"><strong>Property ID:</strong> {property.propertyId}</p>
                    )}
                    {property.propertyTitle && (
                      <p className="text-sm"><strong>Title:</strong> {property.propertyTitle}</p>
                    )}
                    {property.propertyType && (
                      <p className="text-sm"><strong>Property Type:</strong> {property.propertyType}</p>
                    )}
                    {property.propertyCategory && (
                      <p className="text-sm"><strong>Category:</strong> {property.propertyCategory}</p>
                    )}
                    <p className="text-sm">
                      <strong>Listed Price:</strong> {formattedPrice}{bhk ? ` (${bhk})` : ''}
                    </p>
                    {(pricePerSqft || property.builtUpArea || property.carpetArea) && (
                      <p className="text-sm">
                        <strong>{pricePerSqft ? `₹${pricePerSqft.toLocaleString('en-IN')}/sqft` : ''}</strong>
                        {pricePerSqft && ' • '}
                        {property.builtUpArea || property.carpetArea
                          ? `🟩 ${property.builtUpArea || property.carpetArea} sqft`
                          : ''}
                      </p>
                    )}
                    {property.furnishingStatus && (
                      <p className="text-sm"><strong>Furnishing:</strong> {property.furnishingStatus}</p>
                    )}
                    {property.ownershipType && (
                      <p className="text-sm"><strong>Ownership:</strong> {property.ownershipType}</p>
                    )}
                    {property.propertyCondition && (
                      <p className="text-sm"><strong>Condition:</strong> {property.propertyCondition}</p>
                    )}
                    {address && (
                      <p
                        className="text-sm flex items-center gap-1 cursor-pointer hover:text-[#00695C] hover:underline transition-colors duration-200 w-fit"
                        onClick={() => openInMaps(address)}
                        title="View on Google Maps"
                      >
                        <strong>📍 Location:</strong> {address}
                      </p>
                    )}
                    {property.pincode && (
                      <p className="text-sm"><strong>Pincode:</strong> {property.pincode}</p>
                    )}
                    {property.state && (
                      <p className="text-sm"><strong>State:</strong> {property.state}</p>
                    )}
                    {property.city && (
                      <p className="text-sm"><strong>City:</strong> {property.city}</p>
                    )}
                    {property.area && (
                      <p className="text-sm"><strong>Area:</strong> {property.area}</p>
                    )}
                    {property.landmark && (
                      <p className="text-sm"><strong>Landmark:</strong> {property.landmark}</p>
                    )}
                    {property.nearbyConnectivity && (
                      <p className="text-sm"><strong>Nearby Connectivity:</strong> {property.nearbyConnectivity}</p>
                    )}
                    {property.listingPurpose && (
                      <p className="text-sm"><strong>Purpose:</strong> {property.listingPurpose}</p>
                    )}
                    {property.status && (
                      <p className="text-sm"><strong>Status:</strong> {property.propertyStatus || property.status}</p>
                    )}
                  </div>
                </div>

                {/* HIGHLIGHTS — original modal style */}
                {highlights.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      Property Highlights
                    </h4>
                    <div className="bg-teal-50/50 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {highlights.map((h, i) => (
                          <span
                            key={i}
                            className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm"
                          >
                            ✨ {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* DESCRIPTION — original modal section style */}
                {property.propertyDescription && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      Description
                    </h4>
                    <div className="bg-teal-50/50 rounded-xl p-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {property.propertyDescription}
                      </p>
                    </div>
                  </div>
                )}

                {/* EXTRA DETAILS — same original section visual language */}
                {(pricingRows.some(([,v]) => isPresent(v)) ||
                  tenancyRows.some(([,v]) => isPresent(v)) ||
                  saleLegalRows.some(([,v]) => isPresent(v)) ||
                  commercialRows.some(([,v]) => isPresent(v)) ||
                  hostelRows.some(([,v]) => isPresent(v)) ||
                  landRows.some(([,v]) => isPresent(v))) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      Additional Property Details
                    </h4>
                    <div className="bg-teal-50/50 rounded-xl p-4 space-y-2">
                      {[...pricingRows, ...tenancyRows, ...saleLegalRows, ...commercialRows, ...hostelRows, ...landRows]
                        .filter(([, value]) => isPresent(value))
                        .map(([label, value]) => (
                          <p key={label} className="text-sm">
                            <strong>{label}:</strong> {value}
                          </p>
                        ))}
                    </div>
                  </div>
                )}

                {/* FEATURES */}
                {selectedFeatures.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      Features
                    </h4>
                    <div className="bg-teal-50/50 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedFeatures.map((item, i) => (
                          <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
                            ✨ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AMENITIES */}
                {amenities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      Amenities ({amenities.length})
                    </h4>
                    <div className="bg-teal-50/50 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((item, i) => (
                          <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
                            ✨ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERIOR FEATURES */}
                {interiorFeatures.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      Interior Features
                    </h4>
                    <div className="bg-teal-50/50 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {interiorFeatures.map((item, i) => (
                          <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
                            ✨ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* APPLIANCES */}
                {appliances.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      Appliances Included
                    </h4>
                    <div className="bg-teal-50/50 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {appliances.map((item, i) => (
                          <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
                            ✨ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* NEARBY ACCESS */}
                {nearbyAccess.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                      Nearby Access
                    </h4>
                    <div className="bg-teal-50/50 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {nearbyAccess.map((item, i) => (
                          <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
                            ✨ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* PHOTOS — original modal style */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Photos Uploaded ({totalCarouselImages} {totalCarouselImages === 1 ? 'Photo' : 'Photos'})
                  </h4>
                  <div className="bg-teal-50/40 rounded-xl p-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {carouselImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all hover:scale-105"
                          onClick={() => {
                            setGalleryActiveImg(idx);
                            setShowFullGallery(true);
                            setShowDetailsModal(false);
                          }}
                        >
                          <img
                            src={img}
                            alt={`property-photo-${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-[10px] bg-black/60 px-2 py-0.5 rounded-full">
                              Click
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-teal-600 mt-3 text-center">
                      💡 Click on any photo to view larger gallery
                    </p>
                    {videoUrl && (
                      <div className="text-center mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowDetailsModal(false);
                            setShowVideoModal(true);
                          }}
                          className="text-[10px] text-teal-600 hover:text-teal-800 font-semibold hover:underline"
                        >
                          🎥 Watch Property Video
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* FOOTER — exact original modal visual language */}
                <div className="flex gap-3 mt-5 pt-4 border-t border-teal-100">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      onContactClick();
                    }}
                    className="flex-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg"
                  >
                    📞 Contact Now
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-200 shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          portalRoot
        )}

      {/* ---------- FULL GALLERY ---------- */}
      {portalRoot &&
        showFullGallery &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/95 z-[1100] flex flex-col animate-fadeIn"
            onClick={() => setShowFullGallery(false)}
          >
            <div className="bg-gradient-to-r from-teal-700/40 to-emerald-700/40 backdrop-blur-sm border-b border-white/10 p-3 md:p-4 flex justify-between items-center px-4 md:px-6">
              <div className="pr-2">
                <h3 className="text-white font-semibold text-sm md:text-lg truncate max-w-[200px] md:max-w-none">
                  {property.propertyTitle ||
                    address?.split(',')[0] ||
                    'Property Gallery'}
                </h3>
                <p className="text-white/60 text-[11px] md:text-xs mt-0.5">
                  Click outside or press ESC to close
                </p>
              </div>
              <button
                onClick={() => setShowFullGallery(false)}
                className="text-white/80 hover:text-white transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div
              className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 pb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-4xl">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/50 ring-1 ring-white/10">
                  <img
                    src={carouselImages[galleryActiveImg]}
                    alt="Gallery main"
                    className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                    }}
                  />
                </div>
                {totalCarouselImages > 1 && (
                  <>
                    <button
                      onClick={prevGalleryImg}
                      className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ring-1 ring-white/20"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextGalleryImg}
                      className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ring-1 ring-white/20"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-3 inline-flex items-center gap-2 text-white/80 text-xs md:text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full ring-1 ring-white/15">
                <Images className="w-3.5 h-3.5" />
                {galleryActiveImg + 1} / {totalCarouselImages}
              </div>

              <div className="w-full max-w-5xl mt-4 md:mt-6 px-2">
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
                  {carouselImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        galleryActiveImg === idx
                          ? 'ring-2 ring-teal-400 opacity-100 scale-105'
                          : 'opacity-60 hover:opacity-100 ring-1 ring-white/10'
                      }`}
                      onClick={() => setGalleryActiveImg(idx)}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
};

// ============================================
// HELPER COMPONENTS — restored to ORIGINAL versions
// ============================================
const Row = ({ label, value }) => (
  <div className="flex justify-between gap-3 text-sm py-0.5">
    <span className="text-slate-500">{label}</span>
    <span className="text-slate-800 font-semibold text-right">{value}</span>
  </div>
);

const QuickStat = ({ icon: Icon, label, value }) => (
  <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-xl p-3 ring-1 ring-teal-100/70">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="w-3.5 h-3.5 text-teal-600" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
        {label}
      </span>
    </div>
    <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
  </div>
);

const ChipSection = ({ title, items, tone = 'teal' }) => {
  const toneClasses = {
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  };
  const cls = toneClasses[tone] || toneClasses.teal;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {title}
        </h4>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl p-4 ring-1 ring-slate-100 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ring-1 ${cls}`}
          >
            <Sparkles className="w-3 h-3 opacity-70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PropertyCard;