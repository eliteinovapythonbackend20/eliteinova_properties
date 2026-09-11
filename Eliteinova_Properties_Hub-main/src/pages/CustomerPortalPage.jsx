import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Tag, User, UserCog, HardHat, Building2, Landmark, Star, Phone, Hammer, Home, PaintBucket, Droplets, Sparkles, Zap, Bug, Leaf, ShieldCheck, Truck } from "lucide-react";
import customerPortalBanner from "../assets/customerPortalBanner.jpg";

// Import images from assets (same assets HomePage.jsx uses)
import apartment1 from "../assets/Apartmenthomeban1.jpg";
import apartment2 from "../assets/Apartmenthomeban2.jpg";
import apartment3 from "../assets/Apartmenthomeban3.jpg";
import apartment4 from "../assets/Apartmenthomeban4.jpg";
import apartment5 from "../assets/Apartmenthomeban5.jpg";

import commercial1 from "../assets/Commercialhomeban1.jpg";
import commercial2 from "../assets/Commercialhomeban2.jpg";
import commercial3 from "../assets/Commercialhomeban3.jpg";
import commercial4 from "../assets/Commercialhomeban4.jpg";
import commercial5 from "../assets/Commercialhomeban5.jpg";

import hostel1 from "../assets/hostelhomeban1.jpg";
import hostel2 from "../assets/hostelhomeban2.jpg";
import hostel3 from "../assets/hostelhomeban3.jpg";
import hostel4 from "../assets/hostelhomeban4.jpg";
import hostel5 from "../assets/hostelhomeban5.jpg";

import villa1 from "../assets/Individualhomeban1.jpg";
import villa2 from "../assets/Individualhomeban2.jpg";
import villa3 from "../assets/Individualhomeban3.jpg";
import villa4 from "../assets/Individualhomeban4.jpg";
import villa5 from "../assets/Individualhomeban5.jpg";

import land1 from "../assets/landhomeban1.jpg";
import land2 from "../assets/landhomeban2.jpg";
import land3 from "../assets/landhomeban3.jpg";
import land4 from "../assets/landhomeban4.jpg";
import land5 from "../assets/landhomeban5.jpg";

/* ------------------------------------------------------------------ */
/*  CUSTOMER PORTAL — category data                                    */ 
/* ------------------------------------------------------------------ */

const individualItems = [
  { label: "Independent House", image: villa1, path: "/individual/independent-house" },
  { label: "Independent Villa", image: villa2, path: "/individual/independent-villa" },
  { label: "Duplex Unit", image: villa3, path: "/individual/duplex-residential-unit" }
];

const apartmentImages = [apartment1, apartment2, apartment3, apartment4, apartment5];
const apartmentSubTypes = [
  { label: "Rental Apartment", path: "/apartment/rental-apartment" },
  { label: "Serviced Apartment", path: "/apartment/serviced-apartment" },
  { label: "Lease Apartment", path: "/apartment/lease-apartment" },
  { label: "Residential Apartment", path: "/apartment/residential-apartments" },
  { label: "Gated Community", path: "/apartment/gated-community-apartment" },
  { label: "Studio Apartment", path: "/apartment/studio-apartment" },
  { label: "Duplex Apartment", path: "/apartment/duplex-apartment" },
  { label: "Luxury Apartment", path: "/apartment/luxury-apartment" },
  { label: "Condo Apartment", path: "/apartment/condominium" },
  { label: "Penthouse Apartment", path: "/apartment/penthouse-apartment" }
];
const apartmentItems = apartmentSubTypes.map((item, i) => ({
  ...item,
  image: apartmentImages[i % apartmentImages.length]
}));

const commercialImages = [commercial1, commercial2, commercial3, commercial4, commercial5];
const commercialSubTypes = [
  { label: "Office Space", path: "/commercial/office-space" },
  { label: "Retail Shop", path: "/commercial/retail-shop" },
  { label: "Showroom", path: "/commercial/showroom" },
  { label: "Warehouse / Godown", path: "/commercial/warehouse-godown" },
  { label: "Industrial Property / Factory", path: "/commercial/industrial-property-factory" },
  { label: "Co-working Space", path: "/commercial/co-working-space" },
  { label: "Business Center", path: "/commercial/business-center" },
  { label: "Shopping Mall Space", path: "/commercial/shopping-mall-space" },
  { label: "Commercial Complex", path: "/commercial/commercial-complex" },
  { label: "Restaurant / Café Space", path: "/commercial/restaurant-cafe-space" },
  { label: "Hotel / Lodge / Resort Property", path: "/commercial/hotel-lodge-resort-property" },
  { label: "Clinic / Hospital Space", path: "/commercial/clinic-hospital-space" },
  { label: "Educational Institution Property", path: "/commercial/educational-institution-property" },
  { label: "IT Park / Tech Park Space", path: "/commercial/it-park-tech-park-space" },
  { label: "Multiplex / Entertainment Space", path: "/commercial/multiplex-entertainment-space" },
  { label: "Petrol Bunk / Fuel Station", path: "/commercial/petrol-bunk-fuel-station" },
  { label: "Cold Storage / Logistics Hub", path: "/commercial/cold-storage-logistics-hub" },
  { label: "Mixed-use Commercial Property", path: "/commercial/mixed-use-commercial-property" },
  { label: "Agricultural Commercial Property", path: "/commercial/agricultural-commercial-property" }
];
const commercialItems = commercialSubTypes.map((item, i) => ({
  ...item,
  image: commercialImages[i % commercialImages.length]
}));

const landImages = [land1, land2, land3, land4, land5];
const landSubTypes = [
  { label: "Residential Land / Plots", path: "/land-plots/residential-land-plots" },
  { label: "Commercial Land / Plots", path: "/land-plots/commercial-land-plots" },
  { label: "Agricultural Land / Plots", path: "/land-plots/agricultural-land-plots" },
  { label: "Industrial Land", path: "/land-plots/industrial-land-plots" },
  { label: "Mixed-Use Land", path: "/land-plots/mixed-use-land-plots" },
  { label: "Institutional Land", path: "/land-plots/institutional-land-plots" },
  { label: "Investment & Special Purpose Land", path: "/land-plots/investment-land-plots" }
];
const landItems = landSubTypes.map((item, i) => ({
  ...item,
  image: landImages[i % landImages.length]
}));

const hostelImages = [hostel1, hostel2, hostel3, hostel4, hostel5];
const hostelSubTypes = [
  { label: "Girls Hostel", path: "/hostel/girls-hostel" },
  { label: "Boys Hostel", path: "/hostel/boys-hostel" },
  { label: "Co Living Space", path: "/hostel/co-living-space" },
  { label: "Working Professional Hostel", path: "/hostel/working-professional-hostel" }
];
const hostelItems = hostelSubTypes.map((item, i) => ({
  ...item,
  image: hostelImages[i % hostelImages.length]
}));

const customerPortalCategories = [
  { key: "individual", heading: "Individual", route: "/individual", items: individualItems, scrollable: false },
  { key: "apartment", heading: "Apartment", route: "/apartment", items: apartmentItems, scrollable: true },
  { key: "commercial", heading: "Commercial", route: "/commercial", items: commercialItems, scrollable: true },
  { key: "land", heading: "Land & Plots", route: "/land-plots", items: landItems, scrollable: true },
  { key: "hostel", heading: "Hostel", route: "/hostel", items: hostelItems, scrollable: false }
];

/* ------------------------------------------------------------------ */
/*  PROPERTIES BY POSTER — 12 sample listings for each poster type     */
/* ------------------------------------------------------------------ */

const posterThemes = {
  Owner: { icon: User, accent: "#1E7A6E", badgeBg: "#E4F3EF" },
  Agent: { icon: UserCog, accent: "#14534B", badgeBg: "#DCEBE7" },
  Builder: { icon: HardHat, accent: "#2F9C87", badgeBg: "#E2F5F0" },
  "Property Management": { icon: Building2, accent: "#0B3D33", badgeBg: "#D8E9E4" }
};

// All property images in an array for cycling
const allPropertyImages = [
  apartment1, apartment2, apartment3, apartment4, apartment5,
  commercial1, commercial2, commercial3, commercial4, commercial5,
  hostel1, hostel2, hostel3, hostel4, hostel5,
  villa1, villa2, villa3, villa4, villa5,
  land1, land2, land3, land4, land5
];

const locations = [
  "ECR, Chennai", "Anna Nagar, Chennai", "OMR, Chennai", "Sriperumbudur",
  "Adyar, Chennai", "Velachery, Chennai", "Sholinganallur, Chennai",
  "Perungudi, Chennai", "Porur, Chennai", "Guduvancheri", "Guindy, Chennai",
  "Thiruporur", "Nungambakkam, Chennai", "Tambaram, Chennai", "T. Nagar, Chennai",
  "Mogappair, Chennai", "Kodambakkam, Chennai", "Mylapore, Chennai",
  "Besant Nagar, Chennai", "Royapettah, Chennai"
];

const propertyTitles = {
  Owner: [
    "3BHK Independent Villa", "2BHK Rental Apartment", "Commercial Showroom",
    "Residential Plot — 2400 sq.ft", "4BHK Luxury Villa", "1BHK Studio Apartment",
    "Retail Shop Space", "Agricultural Land — 5 Acres", "Independent House with Garden",
    "Duplex Residential Unit", "Gated Community Villa", "Corner Plot — 1800 sq.ft"
  ],
  Agent: [
    "Luxury Penthouse Apartment", "Duplex Residential Unit", "IT Park Office Space",
    "Co-Living Space", "Premium Independent Villa", "Commercial Complex Unit",
    "Residential Apartment — 3BHK", "Industrial Warehouse", "Beachfront Villa",
    "Office Space with Cabin", "Studio Apartment", "Retail Showroom"
  ],
  Builder: [
    "Gated Community Apartment", "New Launch Independent Villas", "Business Center Units",
    "DTCP Approved Plots", "Luxury Apartment Complex", "Premium Villa Project",
    "Commercial Tower Space", "Residential Township Plots", "Smart Home Apartments",
    "Eco-Friendly Villas", "Mixed-Use Development", "Affordable Housing Units"
  ],
  "Property Management": [
    "Fully Managed Studio Apartment", "Managed Working Professional Hostel",
    "Serviced Commercial Complex", "Maintained Independent House",
    "Managed Luxury Apartment", "Co-Living Managed Space", "Serviced Office Suites",
    "Managed Retail Outlets", "Maintained Villa Community", "Managed Hostel Facility",
    "Serviced Business Center", "Managed Residential Tower"
  ]
};

const priceRanges = {
  Owner: [
    "₹1.85 Cr", "₹28,000 / mo", "₹95,000 / mo", "₹62 Lakh", "₹2.4 Cr",
    "₹18,000 / mo", "₹75,000 / mo", "₹45 Lakh", "₹1.2 Cr", "₹1.6 Cr",
    "₹2.1 Cr", "₹55 Lakh"
  ],
  Agent: [
    "₹3.2 Cr", "₹1.4 Cr", "₹1.5L / mo", "₹12,500 / mo", "₹4.5 Cr",
    "₹2.8 Cr", "₹85 Lakh", "₹1.8 Cr", "₹6.2 Cr", "₹1.2L / mo",
    "₹22,000 / mo", "₹1.1L / mo"
  ],
  Builder: [
    "₹78 Lakh onwards", "₹1.1 Cr onwards", "₹2.1 Cr onwards", "₹1,850 / sq.ft",
    "₹1.6 Cr onwards", "₹2.8 Cr onwards", "₹3.2 Cr onwards", "₹2,100 / sq.ft",
    "₹95 Lakh onwards", "₹3.5 Cr onwards", "₹4.1 Cr onwards", "₹65 Lakh onwards"
  ],
  "Property Management": [
    "₹22,000 / mo", "₹9,500 / mo", "₹1.2L / mo", "₹1.05 Cr",
    "₹35,000 / mo", "₹14,000 / mo", "₹85,000 / mo", "₹65,000 / mo",
    "₹2.3 Cr", "₹11,000 / mo", "₹95,000 / mo", "₹1.8 Cr"
  ]
};

const typeOptions = ["Sale", "Rent", "Lease", "Sale", "Sale", "Rent", "Lease", "Sale", "Sale", "Rent", "Lease", "Sale"];

// Generate 12 properties for each poster type
const generateProperties = (posterKey) => {
  const titles = propertyTitles[posterKey];
  const prices = priceRanges[posterKey];
  
  return Array.from({ length: 12 }, (_, i) => ({
    title: titles[i % titles.length],
    location: locations[i % locations.length],
    price: prices[i % prices.length],
    type: typeOptions[i % typeOptions.length],
    image: allPropertyImages[i % allPropertyImages.length]
  }));
};

const ownerProperties = generateProperties("Owner");
const agentProperties = generateProperties("Agent");
const builderProperties = generateProperties("Builder");
const pmProperties = generateProperties("Property Management");

const propertiesByPoster = [
  { key: "owner", poster: "Owner", properties: ownerProperties },
  { key: "agent", poster: "Agent", properties: agentProperties },
  { key: "builder", poster: "Builder", properties: builderProperties },
  { key: "pm", poster: "Property Management", properties: pmProperties }
];

// 4 ads for each section
const preListingAds = [
  {
    title: "Zero Brokerage, Always",
    subtitle: "Every listing below is direct from the poster — no commission",
    cta: "Learn More",
    image: commercial1,
    route: "/services"
  },
  {
    title: "Verified Listings Only",
    subtitle: "Every property is checked before it goes live",
    cta: "See How",
    image: land3,
    route: "/services"
  },
  {
    title: "Free Site Visits",
    subtitle: "Book a guided visit for any property below, at no cost",
    cta: "Book a Visit",
    image: villa3,
    route: "/services"
  },
  {
    title: "Instant Property Alerts",
    subtitle: "Get notified when new properties match your criteria",
    cta: "Set Alerts",
    image: apartment4,
    route: "/services"
  }
];

const postListingAds = [
  {
    title: "List Your Property Free",
    subtitle: "No listing fees for owners in your first 30 days",
    cta: "Start Listing",
    image: apartment2,
    route: "/#post-property"
  },
  {
    title: "Become a Verified Agent",
    subtitle: "Get more inquiries with a verified agent badge",
    cta: "Get Verified",
    image: commercial4,
    route: "/services"
  },
  {
    title: "Partner as a Builder",
    subtitle: "Reach thousands of buyers for your new launches",
    cta: "Partner With Us",
    image: land5,
    route: "/services"
  },
  {
    title: "Featured Listing Boost",
    subtitle: "Get 5x more visibility with featured property status",
    cta: "Boost Now",
    image: villa4,
    route: "/services"
  }
];

/* ------------------------------------------------------------------ */
/*  REGISTERED BANKS & LOAN ADVISORS                                    */
/* ------------------------------------------------------------------ */

const registeredLenders = [
  {
    name: "HDFC Bank",
    type: "Bank",
    specialties: "Home Loans • Property Loans",
    detail: "Rates from 8.35%*",
    icon: Landmark
  },
  {
    name: "State Bank of India",
    type: "Bank",
    specialties: "Home Loans • Plot Loans",
    detail: "Rates from 8.40%*",
    icon: Landmark
  },
  {
    name: "ICICI Bank",
    type: "Bank",
    specialties: "Commercial Loans • Home Loans",
    detail: "Rates from 8.50%*",
    icon: Landmark
  },
  {
    name: "Axis Bank",
    type: "Bank",
    specialties: "Construction Loans",
    detail: "Rates from 8.60%*",
    icon: Landmark
  },
  {
    name: "Rajesh Kumar",
    type: "Loan Advisor",
    specialties: "Home & Plot Loan Specialist",
    detail: "12 yrs experience",
    icon: User
  },
  {
    name: "Priya Sharma",
    type: "Loan Advisor",
    specialties: "Commercial Loan Specialist",
    detail: "8 yrs experience",
    icon: User
  },
  {
    name: "Kotak Mahindra Bank",
    type: "Bank",
    specialties: "Home Loans • Balance Transfer",
    detail: "Rates from 8.45%*",
    icon: Landmark
  },
  {
    name: "Punjab National Bank",
    type: "Bank",
    specialties: "Home Loans • Plot Loans",
    detail: "Rates from 8.40%*",
    icon: Landmark
  },
  {
    name: "Bank of Baroda",
    type: "Bank",
    specialties: "Property Loans • Construction Loans",
    detail: "Rates from 8.55%*",
    icon: Landmark
  },
  {
    name: "LIC Housing Finance",
    type: "Bank",
    specialties: "Home Loans Specialist",
    detail: "Rates from 8.65%*",
    icon: Landmark
  },
  {
    name: "Anitha Reddy",
    type: "Loan Advisor",
    specialties: "Plot & Land Loan Specialist",
    detail: "6 yrs experience",
    icon: User
  },
  {
    name: "Vikram Singh",
    type: "Loan Advisor",
    specialties: "NRI Home Loan Specialist",
    detail: "10 yrs experience",
    icon: User
  }
];

// 4 ads for loan providers
const loanProviderAds = [
  {
    title: "Compare Rates in One Place",
    subtitle: "See offers from every registered bank side by side",
    cta: "Compare Now",
    image: commercial3,
    route: "/find-loan"
  },
  {
    title: "Talk to a Loan Advisor Free",
    subtitle: "Get matched with an advisor who knows your requirement",
    cta: "Talk Now",
    image: apartment1,
    route: "/find-loan"
  },
  {
    title: "Banks: Register With Us",
    subtitle: "List your loan products in front of active property buyers",
    cta: "Register Now",
    image: land2,
    route: "/services"
  },
  {
    title: "Pre-Approved Loans",
    subtitle: "Get pre-approved for a loan before you start house hunting",
    cta: "Get Pre-Approved",
    image: commercial5,
    route: "/find-loan"
  }
];

/* ------------------------------------------------------------------ */
/*  REGISTERED SERVICE PROVIDERS                                        */
/* ------------------------------------------------------------------ */

const registeredServiceProviders = [
  {
    name: "BuildRight Constructions",
    service: "Construction",
    icon: Hammer,
    image: land4,
    description: "Full-scale residential & commercial construction, foundation to finishing.",
    rating: "4.8"
  },
  {
    name: "InteriorCraft Studio",
    service: "Interior",
    icon: Home,
    image: apartment2,
    description: "Custom interior design, modular furniture, and space planning.",
    rating: "4.7"
  },
  {
    name: "ColorPro Painters",
    service: "Painting",
    icon: PaintBucket,
    image: villa4,
    description: "Interior and exterior painting with premium, long-lasting finishes.",
    rating: "4.6"
  },
  {
    name: "FlowFix Plumbing",
    service: "Plumbing",
    icon: Droplets,
    image: hostel3,
    description: "Licensed plumbing installation, leak fixes, and fittings.",
    rating: "4.9"
  },
  {
    name: "SparkleClean Services",
    service: "Cleaning",
    icon: Sparkles,
    image: apartment5,
    description: "Deep cleaning and regular maintenance for homes and offices.",
    rating: "4.7"
  },
  {
    name: "VoltSafe Electricals",
    service: "Electrical",
    icon: Zap,
    image: commercial4,
    description: "Wiring, fittings, and safety inspections by licensed electricians.",
    rating: "4.8"
  },
  {
    name: "PestShield Solutions",
    service: "Pest Control",
    icon: Bug,
    image: villa3,
    description: "Termite, rodent, and general pest control for homes and offices.",
    rating: "4.6"
  },
  {
    name: "GreenScape Landscaping",
    service: "Landscaping",
    icon: Leaf,
    image: land5,
    description: "Garden design, lawn care, and outdoor landscaping services.",
    rating: "4.7"
  },
  {
    name: "SecureNest CCTV & Security",
    service: "Security",
    icon: ShieldCheck,
    image: commercial5,
    description: "CCTV installation, smart locks, and home security systems.",
    rating: "4.8"
  },
  {
    name: "MoveEasy Packers & Movers",
    service: "Packers & Movers",
    icon: Truck,
    image: hostel4,
    description: "Safe, insured relocation for homes and offices, local or long-distance.",
    rating: "4.6"
  }
];

// 4 ads for service providers
const serviceProviderAds = [
  {
    title: "Bundle & Save 15%",
    subtitle: "Book Construction + Interior together and save",
    cta: "Bundle Now",
    image: hostel3,
    route: "/services"
  },
  {
    title: "Same-Day Service Slots",
    subtitle: "Plumbing and cleaning available in your area today",
    cta: "Book Now",
    image: apartment3,
    route: "/services"
  },
  {
    title: "Providers: Join the Directory",
    subtitle: "Get discovered by property owners who need your service",
    cta: "Register Now",
    image: commercial2,
    route: "/services"
  },
  {
    title: "Free Consultation",
    subtitle: "Get expert advice for your home renovation project",
    cta: "Book Free Consult",
    image: villa2,
    route: "/services"
  }
];

const PolaroidCard = ({ image, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex-shrink-0 w-[170px] xs:w-[200px] sm:w-[240px] lg:w-[270px] bg-white p-3 sm:p-4 pb-5 sm:pb-7 rounded-sm shadow-md hover:shadow-xl border border-[#E3ECE8] relative -rotate-1 even:rotate-1 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 text-left cursor-pointer"
  >
    {/* Pin dot */}
    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1E7A6E] border-2 border-white shadow z-10" />

    <div className="w-full h-[130px] xs:h-[155px] sm:h-[185px] lg:h-[210px] overflow-hidden rounded-sm bg-[#D1E2DB]">
      <img
        src={image}
        alt={label}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>

    <p className="text-center text-[#14534B] font-serif italic font-semibold text-[12px] xs:text-sm sm:text-base mt-2.5 sm:mt-4 leading-snug">
      {label}
    </p>
  </button>
);

const CategoryScrollSection = ({ category, registerRef, onScroll, onCardClick, onHeadingClick }) => (
  <div className="mb-9 sm:mb-14 last:mb-0">
    <button
      type="button"
      onClick={() => onHeadingClick(category)}
      className="block mx-auto text-center text-[#1C2D24] hover:text-[#1E7A6E] font-black text-base xs:text-lg sm:text-2xl tracking-wide uppercase mb-1 transition-colors"
    >
      {category.heading}
    </button>
    <div className="w-8 sm:w-12 h-[2px] sm:h-[3px] bg-[#1E7A6E] mx-auto mb-4 sm:mb-6" />

    <div className="relative">
      {category.scrollable && (
        <button
          type="button"
          onClick={() => onScroll(category.key, "left")}
          className="absolute -left-1 xs:left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1.5 sm:p-2 rounded-full shadow-md border border-[#D1E2DB] transition-colors duration-300"
          aria-label={`Scroll ${category.heading} left`}
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>
      )}

      <div
        ref={(el) => registerRef(category.key, el)}
        className={`no-scrollbar overflow-x-auto scroll-smooth py-2 ${
          category.scrollable ? "px-8 sm:px-12" : "px-4"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-4 sm:gap-6 w-max mx-auto">
          {category.items.map((item, idx) => (
            <PolaroidCard
              key={`${category.key}-${idx}`}
              image={item.image}
              label={item.label}
              onClick={() => onCardClick(item)}
            />
          ))}
        </div>
      </div>

      {category.scrollable && (
        <button
          type="button"
          onClick={() => onScroll(category.key, "right")}
          className="absolute -right-1 xs:right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1.5 sm:p-2 rounded-full shadow-md border border-[#D1E2DB] transition-colors duration-300"
          aria-label={`Scroll ${category.heading} right`}
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  </div>
);

const PropertyCard = ({ property, poster }) => {
  const theme = posterThemes[poster];
  const PosterIcon = theme.icon;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-[#E3ECE8] hover:shadow-xl transition-shadow duration-300 group flex-shrink-0 w-[220px] xs:w-[250px] sm:w-[280px] lg:w-[300px]">
      <div className="relative h-[150px] xs:h-[170px] sm:h-[185px] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] xs:text-[10px] font-bold shadow"
          style={{ backgroundColor: theme.badgeBg, color: theme.accent }}
        >
          <PosterIcon className="w-3 h-3" />
          Posted by {poster}
        </span>
        <span
          className="absolute top-2 right-2 px-2 py-1 rounded-full text-[9px] xs:text-[10px] font-bold text-white shadow"
          style={{ backgroundColor: theme.accent }}
        >
          {property.type}
        </span>
      </div>

      <div className="p-3 sm:p-4">
        <h4 className="text-[#1C2D24] font-bold text-xs sm:text-sm leading-snug mb-1.5 line-clamp-2">
          {property.title}
        </h4>
        <p className="flex items-center gap-1 text-[#556B60] text-[10px] sm:text-xs mb-2">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          {property.location}
        </p>
        <p className="flex items-center gap-1 font-black text-sm sm:text-base" style={{ color: theme.accent }}>
          <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {property.price}
        </p>
      </div>
    </div>
  );
};

// A heading + accent divider + horizontally scrollable property cards with slide buttons
const PropertiesByPosterSection = ({ poster, properties }) => {
  const theme = posterThemes[poster];
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className="mb-10 sm:mb-14 last:mb-0">
      <h3
        className="text-center font-black text-lg xs:text-xl sm:text-2xl tracking-wide uppercase mb-1"
        style={{ color: theme.accent }}
      >
        {poster} Properties
      </h3>
      <p className="text-center text-[#556B60] text-[10px] xs:text-[11px] sm:text-xs mb-4 sm:mb-6">
        Posted by {poster}
      </p>
      <div className="w-10 sm:w-14 h-[3px] mx-auto mb-6 sm:mb-8" style={{ backgroundColor: theme.accent }} />

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-2 xs:left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1.5 sm:p-2 rounded-full shadow-md border border-[#D1E2DB] transition-colors duration-300"
          aria-label={`Scroll ${poster} properties left`}
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth px-8 sm:px-12 py-2"
          style={{ scrollbarWidth: "none" }}
        >
          {properties.map((property, idx) => (
            <PropertyCard key={idx} property={property} poster={poster} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-2 xs:right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1.5 sm:p-2 rounded-full shadow-md border border-[#D1E2DB] transition-colors duration-300"
          aria-label={`Scroll ${poster} properties right`}
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

// A single registered bank / loan advisor card
const LoanProviderCard = ({ provider }) => {
  const Icon = provider.icon;
  const isBank = provider.type === "Bank";
  return (
    <div className="bg-white rounded-lg shadow-md border border-[#E3ECE8] hover:shadow-xl transition-shadow duration-300 p-4 sm:p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EAF2EF] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E7A6E]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-[#1C2D24] font-bold text-xs sm:text-sm leading-snug truncate">
            {provider.name}
          </h4>
          <span
            className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold"
            style={{
              backgroundColor: isBank ? "#E4F3EF" : "#DCEBE7",
              color: isBank ? "#1E7A6E" : "#14534B"
            }}
          >
            {provider.type}
          </span>
        </div>
      </div>

      <p className="text-[#556B60] text-[10px] sm:text-xs leading-snug mb-3">{provider.specialties}</p>

      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-[#1E7A6E] font-black text-[11px] sm:text-xs">{provider.detail}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1 bg-[#1E7A6E] hover:bg-[#14534B] text-white font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-sm transition-colors shadow"
        >
          <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          Contact
        </button>
      </div>
    </div>
  );
};

// A single registered service-provider company card — full-bleed image
// with all content layered on top, matching the site's ad/flip-card style.
const ServiceProviderCard = ({ provider }) => {
  const Icon = provider.icon;
  return (
    <div className="group relative h-[220px] xs:h-[240px] sm:h-[270px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <img
        src={provider.image}
        alt={provider.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Top row: service tag + rating */}
      <div className="relative z-10 flex items-start justify-between p-3 sm:p-4">
        <span className="inline-flex items-center gap-1.5 bg-[#1E7A6E] px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold text-white shadow">
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          {provider.service}
        </span>
        <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-black text-[#1E7A6E] shadow">
          <Star className="w-3 h-3 fill-[#1E7A6E]" />
          {provider.rating}
        </span>
      </div>

      {/* Bottom: name, description, CTA */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
        <h4 className="text-white font-black text-xs sm:text-sm leading-snug mb-1 drop-shadow-md">
          {provider.name}
        </h4>
        <p className="text-white/85 text-[10px] sm:text-xs leading-relaxed mb-3 line-clamp-2">
          {provider.description}
        </p>
        <button
          type="button"
          className="w-full bg-white hover:bg-[#EAF2EF] text-[#14534B] font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-sm transition-colors shadow"
        >
          Get Quote
        </button>
      </div>
    </div>
  );
};

// Property-related ad strip - 4 ads with 2 columns on mobile
const AdsSection = ({ ads, heading, onNavigate }) => (
  <div className="w-full bg-[#1A3A32] py-8 sm:py-12">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <h3 className="text-white font-black text-base xs:text-lg sm:text-2xl uppercase tracking-wide">
          {heading}
        </h3>
        <span className="text-[#9FB8AE] text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[3px]">
          Sponsored
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-5">
        {ads.map((ad, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onNavigate(ad.route)}
            className="group relative text-left rounded-md overflow-hidden shadow-lg h-[110px] xs:h-[130px] sm:h-[150px] md:h-[190px]"
          >
            <img
              src={ad.image}
              alt={ad.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A32]/85 via-[#1A3A32]/40 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-2 xs:p-3 sm:p-4">
              <h4 className="text-white font-bold text-[10px] xs:text-xs sm:text-sm md:text-base leading-snug">{ad.title}</h4>
              <p className="text-white/80 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 mb-1 sm:mb-2 md:mb-3 leading-snug line-clamp-2">
                {ad.subtitle}
              </p>
              <span className="inline-flex items-center gap-1 text-[#9FE6D6] text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold tracking-wide">
                {ad.cta} →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const CustomerPortalPage = () => {
  const navigate = useNavigate();
  const scrollContainerRefs = useRef({});

  const registerScrollRef = (key, el) => {
    scrollContainerRefs.current[key] = el;
  };

  const scrollCategory = (key, direction) => {
    const container = scrollContainerRefs.current[key];
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  // Card click -> the exact sub-type route, then jump to the top of that page.
  const handleCardClick = (item) => {
    navigate(item.path);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Heading click -> the category's "All" landing page, then jump to the top.
  const handleHeadingClick = (category) => {
    navigate(category.route);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleAdNavigate = (route) => {
    if (route.startsWith("#")) {
      document.getElementById(route.slice(1))?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(route);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hide scrollbars for the Customer Portal card rows */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none;}`}</style>

      {/* Banner Section */}
      <section
        className="w-full py-12 md:py-20 px-4 flex flex-col items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${customerPortalBanner})`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-3 md:mb-4 drop-shadow-lg">
            Customer Portal
          </h1>
          <p className="text-white text-center text-base md:text-xl max-w-2xl px-4 drop-shadow-md">
            Find your dream property with us - No brokerage, No hassle
          </p>
        </div>
      </section>

      {/* Category Buttons Section — parallelogram shape, matching HomePage's quick-access buttons */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {customerPortalCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => navigate(category.route)}
              className="text-white font-bold py-3 rounded-none text-sm tracking-wider shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 relative"
              style={{
                background: "linear-gradient(135deg, #14534B, #1E7A6E)",
                clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                padding: "12px 24px",
              }}
            >
              {category.heading}
            </button>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/*  CUSTOMER PORTAL CARDS — same as HomePage.jsx's Customer Portal   */}
      {/* ================================================================ */}
      <section className="w-full bg-[#EAF2EF] py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-[#1C2D24] font-black text-xl xs:text-2xl sm:text-4xl tracking-tight uppercase mb-2">
            Browse By Type
          </h2>
          <p className="text-center text-[#556B60] text-[11px] xs:text-xs sm:text-sm mb-8 sm:mb-12">
            Tap a card to view that type
          </p>

          {customerPortalCategories.map((category) => (
            <CategoryScrollSection
              key={category.key}
              category={category}
              registerRef={registerScrollRef}
              onScroll={scrollCategory}
              onCardClick={handleCardClick}
              onHeadingClick={handleHeadingClick}
            />
          ))}
        </div>
      </section>
      
      <AdsSection ads={preListingAds} heading="Why Buyers Trust Us" onNavigate={handleAdNavigate} />

      {/* ================================================================ */}
      {/*  PROPERTIES BY POSTER — Owner / Agent / Builder / Property Mgmt   */}
      {/* ================================================================ */}
      <section className="w-full bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {propertiesByPoster.map((group) => (
            <PropertiesByPosterSection
              key={group.key}
              poster={group.poster}
              properties={group.properties}
            />
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/*  ADS SECTION (after Properties by Poster)                         */}
      {/* ================================================================ */}
      <AdsSection ads={postListingAds} heading="Post Your Own Listing" onNavigate={handleAdNavigate} />

      {/* ================================================================ */}
      {/*  REGISTERED BANKS & LOAN ADVISORS                                 */}
      {/* ================================================================ */}
      <section className="w-full bg-[#EAF2EF] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-[#1C2D24] font-black text-xl xs:text-2xl sm:text-4xl tracking-tight uppercase mb-2">
            Registered Banks &amp; Loan Advisors
          </h2>
          <p className="text-center text-[#556B60] text-[11px] xs:text-xs sm:text-sm mb-8 sm:mb-12">
            Compare offers from banks and loan advisors registered with us
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {registeredLenders.map((provider, idx) => (
              <LoanProviderCard key={idx} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  ADS SECTION (after Loan Providers)                               */}
      {/* ================================================================ */}
      <AdsSection ads={loanProviderAds} heading="Loan Offers" onNavigate={handleAdNavigate} />

      {/* ================================================================ */}
      {/*  REGISTERED SERVICE PROVIDERS                                     */}
      {/* ================================================================ */}
      <section className="w-full bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-[#1C2D24] font-black text-xl xs:text-2xl sm:text-4xl tracking-tight uppercase mb-2">
            Registered Service Providers
          </h2>
          <p className="text-center text-[#556B60] text-[11px] xs:text-xs sm:text-sm mb-8 sm:mb-12">
            Book trusted, verified companies for construction, interior, and more
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {registeredServiceProviders.map((provider, idx) => (
              <ServiceProviderCard key={idx} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  ADS SECTION (after Service Providers)                            */}
      {/* ================================================================ */}
      <AdsSection ads={serviceProviderAds} heading="Service Offers" onNavigate={handleAdNavigate} />

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto px-4 pb-8 md:pb-16 pt-8 md:pt-16">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
            Why Choose Eliteinova Properties?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #00695C, #26A69A)",
                }}
              >
                <span className="text-white font-bold text-xl md:text-2xl">1</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Zero Brokerage</h3>
              <p className="text-gray-600 text-sm">
                No hidden charges or commission fees
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #00695C, #26A69A)",
                }}
              >
                <span className="text-white font-bold text-xl md:text-2xl">2</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Verified Properties</h3>
              <p className="text-gray-600 text-sm">
                All properties are verified and genuine
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #00695C, #26A69A)",
                }}
              >
                <span className="text-white font-bold text-xl md:text-2xl">3</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2">Easy Process</h3>
              <p className="text-gray-600 text-sm">
                Simple and hassle-free property search
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerPortalPage;






























// import React from "react";
// import { useNavigate } from "react-router-dom";
// import customerPortalBanner from "../assets/customerPortalBanner.jpg";

// const CustomerPortalPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full min-h-screen bg-gray-50">
//       {/* Banner Section */}
//       <section
//         className="w-full py-12 md:py-20 px-4 flex flex-col items-center justify-center bg-cover bg-center relative"
//         style={{
//           backgroundImage: `url(${customerPortalBanner})`,
//         }}
//       >
//         {/* Dark overlay for better text readability */}
//         <div className="absolute inset-0 bg-black/40"></div>
        
//         <div className="relative z-10">
//           <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-3 md:mb-4 drop-shadow-lg">
//             Customer Portal
//           </h1>
//           <p className="text-white text-center text-base md:text-xl max-w-2xl px-4 drop-shadow-md">
//             Find your dream property with us - No brokerage, No hassle
//           </p>
//         </div>
//       </section>

//       {/* Three Buttons Section */}
//       <section className="max-w-4xl mx-auto px-4 py-8 md:py-16">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
//           <button
//             onClick={() => navigate("/individual")}
//             className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
//             style={{
//               background: "linear-gradient(135deg, #00695C, #26A69A)",
//             }}
//           >
//             Individual
//           </button>

//           <button
//             onClick={() => navigate("/apartment")}
//             className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
//             style={{
//               background: "linear-gradient(135deg, #00695C, #26A69A)",
//             }}
//           >
//            Apartment 
//           </button>

//           <button
//             onClick={() => navigate("/commercial")}
//             className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
//             style={{
//               background: "linear-gradient(135deg, #00695C, #26A69A)",
//             }}
//           >
//             Commercial
//           </button>
//           <button
//             onClick={() => navigate("/hostel")}
//             className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
//             style={{
//               background: "linear-gradient(135deg, #00695C, #26A69A)",
//             }}
//           >
//             Hostel
//           </button>
//           <button
//             onClick={() => navigate("/land-plots")}
//             className="h-16 md:h-20 rounded-xl text-white text-lg md:text-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
//             style={{
//               background: "linear-gradient(135deg, #00695C, #26A69A)",
//             }}
//           >
//             Land & Plots
//           </button>
//         </div>
//       </section>

//       {/* Why Choose Us Section */}
//       <section className="max-w-6xl mx-auto px-4 pb-8 md:pb-16">
//         <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
//             Why Choose Eliteinova Properties?
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
//             <div className="text-center">
//               <div
//                 className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
//                 style={{
//                   background: "linear-gradient(135deg, #00695C, #26A69A)",
//                 }}
//               >
//                 <span className="text-white font-bold text-xl md:text-2xl">1</span>
//               </div>
//               <h3 className="font-bold text-base md:text-lg mb-2">Zero Brokerage</h3>
//               <p className="text-gray-600 text-sm">
//                 No hidden charges or commission fees
//               </p>
//             </div>

//             <div className="text-center">
//               <div
//                 className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
//                 style={{
//                   background: "linear-gradient(135deg, #00695C, #26A69A)",
//                 }}
//               >
//                 <span className="text-white font-bold text-xl md:text-2xl">2</span>
//               </div>
//               <h3 className="font-bold text-base md:text-lg mb-2">Verified Properties</h3>
//               <p className="text-gray-600 text-sm">
//                 All properties are verified and genuine
//               </p>
//             </div>

//             <div className="text-center">
//               <div
//                 className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg"
//                 style={{
//                   background: "linear-gradient(135deg, #00695C, #26A69A)",
//                 }}
//               >
//                 <span className="text-white font-bold text-xl md:text-2xl">3</span>
//               </div>
//               <h3 className="font-bold text-base md:text-lg mb-2">Easy Process</h3>
//               <p className="text-gray-600 text-sm">
//                 Simple and hassle-free property search
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CustomerPortalPage;