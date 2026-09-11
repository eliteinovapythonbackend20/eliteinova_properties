import { useState } from 'react';

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
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const formatPriceAmount = (amount) => {
    if (!amount) return '₹0';
    const num = parseFloat(amount);
    if (isNaN(num)) return '₹0';
    
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
    }
    return `₹${num}`;
  };

  const extractBHK = (bedrooms) => {
    if (!bedrooms) return '';
    const match = String(bedrooms).match(/(\d+)\s*BHK/i);
    return match ? match[0] : bedrooms;
  };

  // Get images from images array (camelCase)
  const getImages = () => {
    if (!property.images) return [];
    return property.images
      .filter(m => m.fileUrl)
      .map(m => m.fileUrl);
  };

  const getVideo = () => {
    if (!property.images) return null;
    const video = property.images.find(m => m.mediaType === 'video' || m.fileUrl?.includes('video'));
    return video ? video.fileUrl : null;
  };

  const getProfileImage = () => {
    return property?.postedBy?.profilePhotoUrl || property?.ownerDetails?.profilePhotoUrl;
  };

  const getCarouselImages = () => {
    const images = getImages();
    return images;
  };

  const getTag = () => {
    const purpose = property.listingPurpose?.toUpperCase();
    const tagMap = {
      'BUY': { label: 'BUY', icon: '💰' },
      'SELL': { label: 'SELL', icon: '🏷️' },
      'RENT': { label: 'RENT', icon: '🔑' },
      'LEASE': { label: 'LEASE', icon: '📄' },
    };
    return tagMap[purpose] || { label: purpose || 'RENT', icon: '🔑' };
  };

  const getRoleTitle = () => {
    const postedBy = property.postedAs?.toUpperCase();
    if (postedBy === 'AGENT') return 'Real Estate Agent';
    if (postedBy === 'BUILDER') return 'Builder / Developer';
    if (postedBy === 'PROPERTY_MANAGEMENT') return 'Property Management';
    return 'Property Owner';
  };

  const getListedByText = () => {
    const postedBy = property.postedAs?.toUpperCase();
    if (postedBy === 'AGENT') return '🏢 Listed By (Agent)';
    if (postedBy === 'BUILDER') return '🏗️ Listed By (Builder)';
    if (postedBy === 'PROPERTY_MANAGEMENT') return '📊 Listed By (Management)';
    return '🏠 Listed By (Owner)';
  };

  const getAmenities = () => {
    if (Array.isArray(property.amenities)) return property.amenities;
    if (typeof property.amenities === 'string') {
      return property.amenities.split(',').map(a => a.trim());
    }
    return [];
  };

  const getNearbyAccess = () => {
    if (Array.isArray(property.nearbyAccess)) return property.nearbyAccess;
    if (typeof property.nearbyAccess === 'string') {
      return property.nearbyAccess.split(',').map(a => a.trim());
    }
    return [];
  };

  const getAppliances = () => {
    if (Array.isArray(property.applianceIncluded)) return property.applianceIncluded;
    if (typeof property.applianceIncluded === 'string') {
      return property.applianceIncluded.split(',').map(a => a.trim());
    }
    return [];
  };

  const getInteriorFeatures = () => {
    if (Array.isArray(property.interiorFeatures)) return property.interiorFeatures;
    if (typeof property.interiorFeatures === 'string') {
      return property.interiorFeatures.split(',').map(a => a.trim());
    }
    return [];
  };

  const getAddress = () => {
    return property.propertyAddress || property.city || property.location || '';
  };

  const openInMaps = (location) => {
    setMapConfirm({ show: true, location });
  };

  // Get display name based on the public "listed by" block the API now returns
  // (property.postedBy = { role, displayName, organisationName, profilePhotoUrl }).
  // Falls back to the old nested *Details shape for any cached/older responses.
  const getDisplayName = () => {
    const postedAs = property.postedAs?.toUpperCase();
    if (property.postedBy?.displayName) return property.postedBy.displayName;
    if (postedAs === 'AGENT') {
      return property.agentDetails?.agentName || property.ownerName || property.postedAs || 'Agent';
    } else if (postedAs === 'BUILDER') {
      return property.builderDetails?.name || property.ownerName || property.postedAs || 'Builder';
    } else if (postedAs === 'PROPERTY_MANAGEMENT') {
      return property.pmDetails?.name || property.ownerName || property.postedAs || 'Property Management';
    }
    return property.userName || property.postedAs || 'Property Owner';
  };

  const getDisplaySubText = () => {
    const postedAs = property.postedAs?.toUpperCase();
    if (property.postedBy?.organisationName) return property.postedBy.organisationName;
    if (postedAs === 'AGENT') {
      return property.agentDetails?.agencyName || '';
    } else if (postedAs === 'BUILDER') {
      return property.builderDetails?.companyName || '';
    } else if (postedAs === 'PROPERTY_MANAGEMENT') {
      return property.pmDetails?.companyName || '';
    }
    return '';
  };

  // Contact details are intentionally not part of the public card/list response
  // (see PropertyService._to_card on the backend). Revealing them is a separate,
  // not-yet-built authenticated "leads" flow - this stays empty until that exists.
  const getContactDetails = () => {
    const postedAs = property.postedAs?.toUpperCase();
    if (postedAs === 'AGENT') {
      return { mobile: property.agentDetails?.mobile, email: property.agentDetails?.emailId };
    } else if (postedAs === 'BUILDER') {
      return { mobile: property.builderDetails?.mobile, email: property.builderDetails?.email };
    } else if (postedAs === 'PROPERTY_MANAGEMENT') {
      return { mobile: property.pmDetails?.mobile, email: property.pmDetails?.email };
    }
    return {
      mobile: property.ownerDetails?.mobile || property.contactNumber,
      email: property.ownerDetails?.emailId || property.emailId
    };
  };

  // ============================================
  // IMAGE NAVIGATION
  // ============================================

  const carouselImages = getCarouselImages();
  const totalCarouselImages = carouselImages.length;
  const videoUrl = getVideo();
  const displayName = getDisplayName();
  const displaySubText = getDisplaySubText();
  const contactDetails = getContactDetails();

  // Show placeholder if no images
  if (totalCarouselImages === 0) {
    carouselImages.push('');
  }

  const nextImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev + 1) % totalCarouselImages);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev - 1 + totalCarouselImages) % totalCarouselImages);
  };

  const nextGalleryImg = (e) => {
    e.stopPropagation();
    setGalleryActiveImg((prev) => (prev + 1) % totalCarouselImages);
  };

  const prevGalleryImg = (e) => {
    e.stopPropagation();
    setGalleryActiveImg((prev) => (prev - 1 + totalCarouselImages) % totalCarouselImages);
  };

  const handleGalleryThumbnailClick = (idx) => {
    setGalleryActiveImg(idx);
  };

  const handleImageDoubleClick = (idx, e) => {
    e.stopPropagation();
    setGalleryActiveImg(idx);
    setShowFullGallery(true);
  };

  // ============================================
  // RENDER
  // ============================================

  const tag = getTag();
  const bhk = extractBHK(property.bedrooms);
  const formattedPrice = formatPriceAmount(property.expectedPrice);
  const profileImage = getProfileImage();
  const address = getAddress();
  const amenities = getAmenities();
  const nearbyAccess = getNearbyAccess();
  const appliances = getAppliances();
  const interiorFeatures = getInteriorFeatures();

  return (
    <>
      <div
        className="w-full bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden transition-all duration-500 hover:shadow-3xl mb-6 hover:-translate-y-1"
        style={{
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovered
            ? '0 25px 40px -12px rgba(0,105,92,0.4), 0 0 0 1px rgba(0,105,92,0.1)'
            : '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 md:p-5">
          <div className="flex flex-col lg:flex-row gap-5 items-stretch">

            {/* ============================================ */}
            {/* IMAGE SECTION */}
            {/* ============================================ */}
            <div className="w-full lg:w-[35%] xl:w-[32%]" style={{ position: 'relative', minHeight: '260px' }}>
              <div
                className="flex flex-row bg-gray-100 rounded-xl overflow-hidden shadow-lg"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <div
                  className="relative cursor-pointer overflow-hidden flex-1"
                  onDoubleClick={(e) => handleImageDoubleClick(activeImg, e)}
                >
                  <img
                    src={carouselImages[activeImg] || profileImage}
                    alt="Property"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '';
                    }}
                  />
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black tracking-wider uppercase flex items-center justify-center gap-1 whitespace-nowrap text-[10px] md:text-xs tag-animation"
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%, 8% 50%)',
                        padding: '2px 10px',
                        minWidth: '40px',
                        animation: 'tagJump 1.5s ease-in-out infinite',
                        boxShadow: '0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8)',
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                      }}
                    >
                      <span className="text-xs md:text-sm">{tag.icon}</span>
                      <span>{tag.label}</span>
                    </div>
                  </div>

                  {videoUrl && (
                    <div 
                      className="absolute bottom-2 left-2 z-10 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVideoModal(true);
                      }}
                    >
                      <div className="bg-black/70 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-black/90 transition-all hover:scale-105">
                        <span className="text-sm">▶</span> Watch Video
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="overflow-y-auto bg-white flex flex-col gap-1 p-1"
                  style={{ width: totalCarouselImages <= 2 ? '70px' : totalCarouselImages <= 3 ? '75px' : totalCarouselImages <= 4 ? '80px' : '85px' }}
                >
                  {carouselImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded cursor-pointer transition-all duration-200 flex-shrink-0 ${activeImg === idx ? 'ring-2 ring-[#26A69A] shadow-md' : 'hover:shadow-md'}`}
                      style={{ height: `calc(100% / ${totalCarouselImages})`, minHeight: '50px' }}
                      onClick={() => setActiveImg(idx)}
                      onDoubleClick={(e) => handleImageDoubleClick(idx, e)}
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt="thumb"
                        onError={(e) => {
                          e.target.src = '';
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

            {/* ============================================ */}
            {/* CONTENT SECTION */}
            {/* ============================================ */}
            <div className="flex-1 flex flex-col gap-2">

              {/* PRICE AND HEADER */}
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                    <span className="font-black text-slate-900 text-2xl md:text-3xl">{formattedPrice}</span>
                    {property.isNegotiable && property.isNegotiable !== 'Fixed Price' && (
                      <span className="text-sm text-teal-600 font-medium">(Negotiable)</span>
                    )}
                    {bhk && <span className="font-bold text-[#00695C] text-base md:text-lg ml-1">({bhk})</span>}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    {property.builtUpArea && (
                      <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm shadow-sm">
                        🏗️ {property.builtUpArea} sq.ft
                      </span>
                    )}
                    {property.carpetArea && (
                      <span className="text-[#00695C] font-bold flex items-center gap-1 text-xs md:text-sm">
                        <span className="text-[#26A69A] text-sm">🟩</span> Carpet: {property.carpetArea} sq.ft
                      </span>
                    )}
                    {property.furnishingStatus && (
                      <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm shadow-sm">
                        🪑 {property.furnishingStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-black text-[#00695C] uppercase tracking-wide blink-text"
                      style={{ fontSize: '13px', letterSpacing: '0.7px', whiteSpace: 'nowrap', WebkitFontSmoothing: 'antialiased' }}
                    >
                      {property.propertyType || 'Property'}
                    </span>
                  </div>
                  <div
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black tracking-wider uppercase flex items-center justify-center gap-1 whitespace-nowrap text-[10px] md:text-xs tag-animation"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%, 8% 50%)',
                      padding: '2px 10px',
                      minWidth: '40px',
                      animation: 'tagJump 1.5s ease-in-out infinite',
                      boxShadow: '0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8)',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                    }}
                  >
                    <span className="text-xs md:text-sm">{tag.icon}</span>
                    <span>{tag.label}</span>
                  </div>
                </div>
              </div>

              {/* TITLE */}
              {property.propertyTitle && (
                <div className="mt-[-2px]">
                  <h3 className="text-slate-800 font-bold text-base md:text-lg leading-tight">
                    {property.propertyTitle}
                  </h3>
                </div>
              )}

              {/* LOCATION */}
              {address && (
                <div
                  className="flex items-start gap-2 cursor-pointer group"
                  onClick={() => openInMaps(address)}
                  title="View on Google Maps"
                >
                  <div className="bg-teal-100 p-1.5 rounded-lg text-[#00695C] shrink-0 shadow-sm group-hover:bg-teal-300 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-800 font-bold text-sm md:text-base leading-tight group-hover:text-[#00695C] group-hover:underline transition-colors duration-200">
                    {address}
                  </p>
                </div>
              )}

              {/* AMENITIES */}
              {amenities.length > 0 && (
                <div>
                  <p className="font-black text-[#004D40] uppercase tracking-wider mb-1.5 flex items-center gap-3 text-[10px] md:text-[11px]">
                    <span className="w-5 h-px bg-[#004D40]"></span>
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(showAllAmenities ? amenities : amenities.slice(0, 6)).map((amenity, i) => (
                      <div key={i} className="flex items-center gap-1 bg-gray-50 text-[#004D40] px-2 py-1 rounded-lg border border-gray-200 font-medium text-[10px] md:text-xs shadow-sm">
                        <span className="w-1 h-1 rounded-full bg-[#00695C] shrink-0"></span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                    {amenities.length > 6 && (
                      <button
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="text-teal-600 hover:text-teal-800 text-[10px] md:text-xs font-medium underline"
                      >
                        {showAllAmenities ? 'Show Less' : `+${amenities.length - 6} more`}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* INTERIOR FEATURES */}
              {interiorFeatures.length > 0 && (
                <div>
                  <p className="font-black text-[#004D40] uppercase tracking-wider mb-1.5 flex items-center gap-3 text-[10px] md:text-[11px]">
                    <span className="w-5 h-px bg-[#004D40]"></span>
                    Interior Features
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {interiorFeatures.slice(0, 6).map((feature, i) => (
                      <div key={i} className="flex items-center gap-1 bg-gray-50 text-[#004D40] px-2 py-1 rounded-lg border border-gray-200 font-medium text-[10px] md:text-xs shadow-sm">
                        <span className="w-1 h-1 rounded-full bg-[#00695C] shrink-0"></span>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {interiorFeatures.length > 6 && (
                      <span className="text-teal-600 text-[10px] md:text-xs font-medium">
                        +{interiorFeatures.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* APPLIANCES */}
              {appliances.length > 0 && (
                <div>
                  <p className="font-black text-[#004D40] uppercase tracking-wider mb-1.5 flex items-center gap-3 text-[10px] md:text-[11px]">
                    <span className="w-5 h-px bg-[#004D40]"></span>
                    Appliances Included
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {appliances.slice(0, 6).map((appliance, i) => (
                      <div key={i} className="flex items-center gap-1 bg-gray-50 text-[#004D40] px-2 py-1 rounded-lg border border-gray-200 font-medium text-[10px] md:text-xs shadow-sm">
                        <span className="w-1 h-1 rounded-full bg-[#00695C] shrink-0"></span>
                        <span>{appliance}</span>
                      </div>
                    ))}
                    {appliances.length > 6 && (
                      <span className="text-teal-600 text-[10px] md:text-xs font-medium">
                        +{appliances.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* NEARBY ACCESS */}
              {nearbyAccess.length > 0 && (
                <div>
                  <p className="font-black text-[#004D40] uppercase tracking-wider mb-1.5 flex items-center gap-3 text-[10px] md:text-[11px]">
                    <span className="w-5 h-px bg-[#004D40]"></span>
                    Nearby Access
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {nearbyAccess.slice(0, 6).map((place, i) => (
                      <div key={i} className="flex items-center gap-1 bg-gray-50 text-[#004D40] px-2 py-1 rounded-lg border border-gray-200 font-medium text-[10px] md:text-xs shadow-sm">
                        <span className="w-1 h-1 rounded-full bg-[#00695C] shrink-0"></span>
                        <span>{place}</span>
                      </div>
                    ))}
                    {nearbyAccess.length > 6 && (
                      <span className="text-teal-600 text-[10px] md:text-xs font-medium">
                        +{nearbyAccess.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* FEATURES - Additional details */}
              <div className="flex flex-wrap gap-2">
                {property.parking && property.parking.toLowerCase() === 'yes' && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">🅿️ Parking</span>
                )}
                {property.parkingSpaces && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    🅿️ {property.parkingSpaces} Spaces
                  </span>
                )}
                {property.petFriendly && property.petFriendly.toLowerCase() === 'yes' && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">🐾 Pet Friendly</span>
                )}
                {property.hasGarden && property.hasGarden.toLowerCase() === 'yes' && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">🌿 Garden</span>
                )}
                {property.hasTerrace && property.hasTerrace.toLowerCase() === 'yes' && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">🏠 Terrace</span>
                )}
                {property.hasBalcony && property.hasBalcony.toLowerCase() === 'yes' && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">🪟 Balcony</span>
                )}
                {property.hasSwimmingPool && property.hasSwimmingPool.toLowerCase() === 'yes' && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">🏊 Pool</span>
                )}
                {property.maintenance && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    Maintenance: ₹{property.maintenance}
                  </span>
                )}
                {property.securityDepositMin && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    Deposit: ₹{property.securityDepositMin}
                  </span>
                )}
                {property.availableFrom && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    Available: {new Date(property.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
                {property.facing && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    🧭 {property.facing}
                  </span>
                )}
                {property.floorNumber && property.totalFloors && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    📍 Floor {property.floorNumber}/{property.totalFloors}
                  </span>
                )}
                {property.propertyCondition && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    🔧 {property.propertyCondition}
                  </span>
                )}
                {property.propertyAge && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    🏛️ {property.propertyAge} years old
                  </span>
                )}
                {property.ownershipType && (
                  <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    📋 {property.ownershipType}
                  </span>
                )}
              </div>

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
                        <img src={profileImage} alt="profile" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
                      ) : (
                        <span>{displayName?.charAt(0) || 'U'}</span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="text-[#00695C] font-bold uppercase tracking-wider text-[8px] md:text-[9px] leading-tight">{getListedByText()}</p>
                      <div className="flex items-baseline gap-4.5 flex-wrap">
                        <p className="font-black text-slate-800 text-sm md:text-base leading-snug">
                          {displayName}
                        </p>
                        {displaySubText && (
                          <span className="text-teal-600 font-medium text-[10px] md:text-xs">
                            ({displaySubText})
                          </span>
                        )}
                        <button
                          onClick={() => setShowDetailsModal(true)}
                          className="text-teal-500 hover:text-teal-700 underline flex items-center gap-0.7 transition-all duration-300 hover:translate-x-1 text-sm font-medium whitespace-nowrap"
                        >
                          📖 View Details →
                        </button>
                      </div>
                      <span className="text-teal-600 font-medium text-[9px] md:text-[10px] leading-tight">{getRoleTitle()}</span>
                    </div>
                  </div>

                  <button
                    onClick={onContactClick}
                    onMouseEnter={() => setIsContactHovered(true)}
                    onMouseLeave={() => setIsContactHovered(false)}
                    className="bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-bold rounded-lg flex items-center gap-1 whitespace-nowrap transition-all duration-300 shrink-0 px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm contact-button"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isContactHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                      boxShadow: isContactHovered
                        ? '0 12px 30px rgba(0,105,92,0.5), 0 0 0 3px rgba(38,166,154,0.3)'
                        : '0 8px 20px rgba(0,105,92,0.3)',
                      animation: 'contactPulse 2s ease-in-out infinite'
                    }}
                  >
                    <span className="text-xs md:text-sm transition-transform duration-300" style={{
                      transform: isContactHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)'
                    }}>📞</span>
                    Contact
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* VIDEO PLAYER MODAL */}
      {/* ============================================ */}
      {showVideoModal && videoUrl && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[400] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-black rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-base md:text-lg truncate max-w-[180px] md:max-w-xs">
                  {property.propertyTitle || address?.split(',')[0] || 'Property Video'}
                </h3>
                <p className="text-white/70 text-xs">Click outside or press ESC to close</p>
              </div>
              <button 
                onClick={() => setShowVideoModal(false)} 
                className="text-white hover:text-gray-200 text-2xl md:text-3xl transition-transform hover:scale-110 shrink-0"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-black/95">
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
              <div className="mt-3 flex items-center justify-between text-white/60 text-xs">
                <span>▶ Click play to watch</span>
                <span>Video unavailable for download</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MAP CONFIRM MODAL */}
      {/* ============================================ */}
      {mapConfirm.show && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setMapConfirm({ show: false, location: '' })}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-slate-800 text-center mb-1">Open in Maps?</h3>
            <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed px-2">{mapConfirm.location}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setMapConfirm({ show: false, location: '' })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const query = encodeURIComponent(mapConfirm.location);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                  setMapConfirm({ show: false, location: '' });
                }}
                className="flex-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* DETAILS MODAL */}
      {/* ============================================ */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-start justify-center p-4 pt-16 md:pt-20 animate-fadeIn" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-2xl max-w-[95%] sm:max-w-lg md:max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in mt-16 md:mt-20" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-5 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  {tag.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg md:text-xl">Complete Details</h3>
                  <p className="text-white/80 text-xs md:text-sm">{property.postedAs || getRoleTitle()}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-white hover:text-gray-200 text-3xl transition-transform hover:scale-110">✕</button>
            </div>

            <div className="p-5">
              {/* Poster Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-teal-100 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg text-xl overflow-hidden">
                  {profileImage && !logoError ? (
                    <img src={profileImage} alt="profile" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
                  ) : (
                    <span>{displayName?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-[#00695C] font-bold uppercase tracking-wider">{getListedByText()}</p>
                  <p className="text-xl md:text-2xl font-black text-slate-800">{displayName}</p>
                  {displaySubText && (
                    <p className="text-xs md:text-sm text-teal-600 font-medium">{displaySubText}</p>
                  )}
                  <p className="text-xs md:text-sm text-teal-600 font-medium mt-0.5">{getRoleTitle()}</p>
                  {/* {contactDetails.mobile && ( 
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">📞 {contactDetails.mobile}</p>
                  )}
                  {contactDetails.email && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">📧 {contactDetails.email}</p>
                  )} */}
                </div>
              </div>

              {/* Property Information */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Property Information
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4 space-y-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                  {/* <p className="text-sm"><strong>Property ID:</strong> {property.id}</p> */}
                  {property.propertyTitle && <p className="text-sm"><strong>Title:</strong> {property.propertyTitle}</p>}
                  {property.propertyType && <p className="text-sm"><strong>Type:</strong> {property.propertyType}</p>}
                  {property.propertyCategory && <p className="text-sm"><strong>Category:</strong> {property.propertyCategory}</p>}
                  {property.listingPurpose && <p className="text-sm"><strong>Listing Purpose:</strong> {property.listingPurpose}</p>}
                  <p className="text-sm"><strong>Listed Price:</strong> {formattedPrice}</p>
                  {property.isNegotiable && <p className="text-sm"><strong>Price Type:</strong> {property.isNegotiable}</p>}
                  {property.bedrooms && <p className="text-sm"><strong>Bedrooms:</strong> {property.bedrooms}</p>}
                  {property.bathrooms && <p className="text-sm"><strong>Bathrooms:</strong> {property.bathrooms}</p>}
                  {property.builtUpArea && <p className="text-sm"><strong>Built-up Area:</strong> {property.builtUpArea} sq.ft</p>}
                  {property.carpetArea && <p className="text-sm"><strong>Carpet Area:</strong> {property.carpetArea} sq.ft</p>}
                  {property.furnishingStatus && <p className="text-sm"><strong>Furnishing:</strong> {property.furnishingStatus}</p>}
                  {property.ownershipType && <p className="text-sm"><strong>Ownership:</strong> {property.ownershipType}</p>}
                  {property.propertyCondition && <p className="text-sm"><strong>Condition:</strong> {property.propertyCondition}</p>}
                  {property.propertyAge && <p className="text-sm"><strong>Property Age:</strong> {property.propertyAge} years</p>}
                  {property.facing && <p className="text-sm"><strong>Facing:</strong> {property.facing}</p>}
                  {property.floorNumber && property.totalFloors && (
                    <p className="text-sm"><strong>Floor:</strong> {property.floorNumber} / {property.totalFloors}</p>
                  )}
                  {property.status && <p className="text-sm"><strong>Status:</strong> {property.propertyStatus || "Available"}</p>}
                  <p className="text-sm flex items-center gap-1 cursor-pointer hover:text-[#00695C] hover:underline transition-colors duration-200 w-fit" onClick={() => openInMaps(address)} title="View on Google Maps">
                    <strong>📍 Location:</strong> {address}
                  </p>
                  {property.pincode && <p className="text-sm"><strong>Pincode:</strong> {property.pincode}</p>}
                  {property.state && <p className="text-sm"><strong>State:</strong> {property.state}</p>}
                </div>
              </div>

              {/* Additional Features */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Additional Features
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {property.parking && property.parking.toLowerCase() === 'yes' && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🅿️ Parking</span>
                    )}
                    {property.parkingSpaces && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🅿️ {property.parkingSpaces} Spaces</span>
                    )}
                    {property.petFriendly && property.petFriendly.toLowerCase() === 'yes' && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🐾 Pet Friendly</span>
                    )}
                    {property.hasGarden && property.hasGarden.toLowerCase() === 'yes' && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🌿 Garden</span>
                    )}
                    {property.hasTerrace && property.hasTerrace.toLowerCase() === 'yes' && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🏠 Terrace</span>
                    )}
                    {property.hasBalcony && property.hasBalcony.toLowerCase() === 'yes' && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🪟 Balcony</span>
                    )}
                    {property.hasSwimmingPool && property.hasSwimmingPool.toLowerCase() === 'yes' && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🏊 Swimming Pool</span>
                    )}
                    {property.maintenance && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">Maintenance: ₹{property.maintenance}</span>
                    )}
                    {property.securityDepositMin && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">Deposit: ₹{property.securityDepositMin}</span>
                    )}
                    {property.occupancyType && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">👥 {property.occupancyType}</span>
                    )}
                    {property.rentalDuration && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">📅 {property.rentalDuration}</span>
                    )}
                    {property.availableFrom && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
                        Available: {new Date(property.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    {property.leaseDuration && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">📄 Lease: {property.leaseDuration}</span>
                    )}
                    {property.leaseBudgetMin && property.leaseBudgetMax && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">
                        💰 Lease Budget: ₹{property.leaseBudgetMin} - ₹{property.leaseBudgetMax}
                      </span>
                    )}
                    {property.homeLoanRequired && property.homeLoanRequired.toLowerCase() === 'yes' && (
                      <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🏦 Home Loan Available</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Amenities ({amenities.length})
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((amenity, i) => (
                        <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">✨ {amenity}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Interior Features */}
              {interiorFeatures.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Interior Features
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {interiorFeatures.map((feature, i) => (
                        <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🏠 {feature}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appliances */}
              {appliances.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Appliances Included
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {appliances.map((appliance, i) => (
                        <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">🔌 {appliance}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Nearby Access */}
              {nearbyAccess.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Nearby Access
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4">
                    <div className="flex flex-wrap gap-2">
                      {nearbyAccess.map((place, i) => (
                        <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">📍 {place}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Owner Details */}
              {/* {property.ownerDetails && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Owner Details
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.ownerDetails.ownerName && <p className="text-sm"><strong>Name:</strong> {property.ownerDetails.ownerName}</p>}
                    {property.ownerDetails.mobile && <p className="text-sm"><strong>Mobile:</strong> {property.ownerDetails.mobile}</p>}
                    {property.ownerDetails.emailId && <p className="text-sm"><strong>Email:</strong> {property.ownerDetails.emailId}</p>}
                    {property.ownerDetails.gender && <p className="text-sm"><strong>Gender:</strong> {property.ownerDetails.gender}</p>}
                    {property.ownerDetails.city && <p className="text-sm"><strong>City:</strong> {property.ownerDetails.city}</p>}
                    {property.ownerDetails.state && <p className="text-sm"><strong>State:</strong> {property.ownerDetails.state}</p>}
                    {property.ownerDetails.pincode && <p className="text-sm"><strong>Pincode:</strong> {property.ownerDetails.pincode}</p>}
                  </div>
                </div>
              )} */}

              {/* Agent Details */}
              {/* {property.agentDetails && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Agent Details
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.agentDetails.agentName && <p className="text-sm"><strong>Name:</strong> {property.agentDetails.agentName}</p>}
                    {property.agentDetails.agencyName && <p className="text-sm"><strong>Agency:</strong> {property.agentDetails.agencyName}</p>}
                    {property.agentDetails.mobile && <p className="text-sm"><strong>Mobile:</strong> {property.agentDetails.mobile}</p>}
                    {property.agentDetails.emailId && <p className="text-sm"><strong>Email:</strong> {property.agentDetails.emailId}</p>}
                    {property.agentDetails.experience && <p className="text-sm"><strong>Experience:</strong> {property.agentDetails.experience} years</p>}
                    {property.agentDetails.reraRegistrationNumber && <p className="text-sm"><strong>RERA:</strong> {property.agentDetails.reraRegistrationNumber}</p>}
                    {property.agentDetails.serviceArea && property.agentDetails.serviceArea.length > 0 && (
                      <p className="text-sm"><strong>Service Area:</strong> {property.agentDetails.serviceArea.join(', ')}</p>
                    )}
                  </div>
                </div>
              )} */}

              {/* Builder Details */}
              {/* {property.builderDetails && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Builder Details
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.builderDetails.name && <p className="text-sm"><strong>Name:</strong> {property.builderDetails.name}</p>}
                    {property.builderDetails.companyName && <p className="text-sm"><strong>Company:</strong> {property.builderDetails.companyName}</p>}
                    {property.builderDetails.mobile && <p className="text-sm"><strong>Mobile:</strong> {property.builderDetails.mobile}</p>}
                    {property.builderDetails.email && <p className="text-sm"><strong>Email:</strong> {property.builderDetails.email}</p>}
                    {property.builderDetails.experience && <p className="text-sm"><strong>Experience:</strong> {property.builderDetails.experience} years</p>}
                    {property.builderDetails.city && <p className="text-sm"><strong>City:</strong> {property.builderDetails.city}</p>}
                    {property.builderDetails.state && <p className="text-sm"><strong>State:</strong> {property.builderDetails.state}</p>}
                  </div>
                </div>
              )} */}

              {/* PM Details */}
              {/* {property.pmDetails && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Property Management Details
                  </h4>
                  <div className="bg-teal-50/50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.pmDetails.name && <p className="text-sm"><strong>Name:</strong> {property.pmDetails.name}</p>}
                    {property.pmDetails.companyName && <p className="text-sm"><strong>Company:</strong> {property.pmDetails.companyName}</p>}
                    {property.pmDetails.mobile && <p className="text-sm"><strong>Mobile:</strong> {property.pmDetails.mobile}</p>}
                    {property.pmDetails.email && <p className="text-sm"><strong>Email:</strong> {property.pmDetails.email}</p>}
                    {property.pmDetails.city && <p className="text-sm"><strong>City:</strong> {property.pmDetails.city}</p>}
                    {property.pmDetails.state && <p className="text-sm"><strong>State:</strong> {property.pmDetails.state}</p>}
                  </div>
                </div>
              )} */}

              {/* Photos */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Photos ({totalCarouselImages})
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
                        <img src={img} alt={`property-photo-${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = ''; }} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-white text-[10px] bg-black/60 px-2 py-0.5 rounded-full">Click</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {videoUrl && (
                    <div className="mt-3 text-center">
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          setShowVideoModal(true);
                        }}
                        className="text-teal-600 hover:text-teal-800 text-xs font-medium flex items-center gap-2 mx-auto hover:underline transition-all"
                      >
                        🎬 Watch Property Video →
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-teal-600 mt-3 text-center">💡 Click on any photo to view larger gallery</p>
                </div>
              </div>

              <div className="flex gap-3 mt-5 pt-4 border-t border-teal-100">
                <button onClick={() => { setShowDetailsModal(false); onContactClick(); }} className="flex-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg">📞 Contact Now</button>
                <button onClick={() => setShowDetailsModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-200 shadow-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* FULL GALLERY MODAL */}
      {/* ============================================ */}
      {showFullGallery && (
        <div className="fixed inset-0 bg-black/95 z-[150] flex flex-col animate-fadeIn" onClick={() => setShowFullGallery(false)}>
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 md:p-4 flex justify-between items-center px-4 md:px-6">
            <div className="pr-2">
              <h3 className="text-white font-bold text-sm md:text-lg truncate max-w-[180px] md:max-w-none">
                {property.propertyTitle || address?.split(',')[0] || 'Property Gallery'}
              </h3>
              <p className="text-white/80 text-[10px] md:text-xs mt-0.5">Click outside or press ESC to close</p>
            </div>
            <button onClick={() => setShowFullGallery(false)} className="text-white hover:text-gray-200 text-2xl md:text-3xl transition-transform hover:scale-110 shrink-0">✕</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 pb-2" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl">
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black/50">
                <img src={carouselImages[galleryActiveImg]} alt="Gallery main" className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain" onError={(e) => { e.target.src = ''; }} />
              </div>
              {totalCarouselImages > 1 && (
                <>
                  <button onClick={prevGalleryImg} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-10 md:h-10 rounded-full transition-all text-sm md:text-xl flex items-center justify-center backdrop-blur hover:scale-110 shadow-lg">❮</button>
                  <button onClick={nextGalleryImg} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-10 md:h-10 rounded-full transition-all text-sm md:text-xl flex items-center justify-center backdrop-blur hover:scale-110 shadow-lg">❯</button>
                </>
              )}
            </div>
            <div className="mt-2 text-white/80 text-xs md:text-sm">{galleryActiveImg + 1} / {totalCarouselImages}</div>
            <div className="w-full max-w-5xl mt-4 md:mt-6 px-2">
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
                {carouselImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${galleryActiveImg === idx ? 'ring-2 ring-[#26A69A] shadow-xl scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105 shadow-md'}`}
                    onClick={() => handleGalleryThumbnailClick(idx)}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" onError={(e) => { e.target.src = ''; }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center pb-2 text-white/40 text-[10px] md:text-xs">Click outside or press ESC to close</div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;