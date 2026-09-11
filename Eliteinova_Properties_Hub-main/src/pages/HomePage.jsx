import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, X, Building, Home, Landmark, MapPin,
  Hammer, PaintBucket, Droplets, Sparkles, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import images from assets
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

// ============ OWNER FORMS ============
import {
  IndRentForm, IndSellForm, IndLeaseForm,
  ApartRentForm, ApartSellForm, ApartLeaseForm,
  ComRentForm, ComSellForm, ComLeaseForm,
  RentLPForm, SellLPForm, LeaseLPForm,
  HostelRentForm, HostelSellForm, HostelLeaseForm
} from "../components/Forms/Owner/Index.js";

// ============ AGENT FORMS ============
import {
  RentAgentIndForm, SellAgentIndForm, LeaseAgentIndForm,
  RentAgentApartForm, SellAgentApartForm, LeaseAgentApartForm,
  RentAgentComForm, SellAgentComForm, LeaseAgentComForm,
  RentAgentLPForm, SellAgentLPForm, LeaseAgentLPForm,
  RentAgentHostelForm, SellAgentHostelForm, LeaseAgentHostelForm
} from "../components/Forms/Agent/Index.js";

// ============ BUILDER FORMS ============
import {
  RentBuilderIndForm, SellBuilderIndForm, LeaseBuilderIndForm,
  RentBuilderApartForm, SellBuilderApartForm, LeaseBuilderApartForm,
  RentBuilderComForm, SellBuilderComForm, LeaseBuilderComForm,
  RentBuilderLPForm, SellBuilderLPForm, LeaseBuilderLPForm,
  RentBuilderHostelForm, SellBuilderHostelForm, LeaseBuilderHostelForm
} from "../components/Forms/Builder/Index.js";

// ============ PROPERTY MANAGEMENT FORMS ============
import {
  RentPMIndForm, SellPMIndForm, LeasePMIndForm,
  RentPMApartForm, SellPMApartForm, LeasePMApartForm,
  RentPMComForm, SellPMComForm, LeasePMComForm,
  RentPMLPForm, SellPMLPForm, LeasePMLPForm,
  RentPMHostelForm, SellPMHostelForm, LeasePMHostelForm
} from "../components/Forms/PropertyManagement/Index.js";


const slidesData = [
  {
    title: "Apartments",
    subtitle: "Where Comfort Meets Convenience",
    images: [apartment1, apartment2, apartment3, apartment4, apartment5]
  },
  {
    title: "Commercial Buildings",
    subtitle: "Elevate Your Business Address",
    images: [commercial1, commercial2, commercial3, commercial4, commercial5]
  },
  {
    title: "Hostels",
    subtitle: "Your Home Away From Home",
    images: [hostel1, hostel2, hostel3, hostel4, hostel5]
  },
  {
    title: "Individual Villas",
    subtitle: "Your Space. Your Sanctuary.",
    images: [villa1, villa2, villa3, villa4, villa5]
  },
  {
    title: "Land and Plots",
    subtitle: "Build Your Dream Home",
    images: [land1, land2, land3, land4, land5]
  }
];

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
/*                      POST YOUR PROPERTY                            */
/* ------------------------------------------------------------------ */

const postPropertyRoles = ["Owner", "Agent", "Builder", "Property Management"];

// Four shades from the olive + teal family, plus one pastel green, so the
// four roles read as a cohesive but distinguishable set. Each entry carries
// its own "textOnBg" since the pastel shade is too light for white text.
// Owner = Deep Teal | Agent = Spruce/Forest Green | Builder = Dark Moss Olive | PM = Deep Bottle Green
const roleColorSchemes = {
  Owner: {
    bg: "#0F766E",         // Deep Teal
    lightBg: "#CCFBF1",    // Pale Teal
    text: "#0F766E",
    textOnBg: "#FFFFFF",
    hoverBg: "#0F766E",
    hoverText: "#FFFFFF",
    border: "#0F766E"
  },
  Agent: {
    bg: "#2F6844",         // Spruce / Forest Green
    lightBg: "#D6E8DA",    // Pale Spruce
    text: "#2F6844",
    textOnBg: "#FFFFFF",
    hoverBg: "#2F6844",
    hoverText: "#FFFFFF",
    border: "#2F6844"
  },
  Builder: {
    bg: "#3F5B2E",         // Dark Moss Olive
    lightBg: "#DCE6D2",    // Pale Moss
    text: "#3F5B2E",
    textOnBg: "#FFFFFF",
    hoverBg: "#3F5B2E",
    hoverText: "#FFFFFF",
    border: "#3F5B2E"
  },
  "Property Management": {
    bg: "#1B4D3E",         // Deep Bottle Green
    lightBg: "#D6E6E0",    // Pale Bottle Green
    text: "#1B4D3E",
    textOnBg: "#FFFFFF",
    hoverBg: "#1B4D3E",
    hoverText: "#FFFFFF",
    border: "#1B4D3E"
  }
};

const formRegistry = {
  Owner: {
    Individual: { Rent: IndRentForm, Sell: IndSellForm, Lease: IndLeaseForm },
    Apartment: { Rent: ApartRentForm, Sell: ApartSellForm, Lease: ApartLeaseForm },
    Commercial: { Rent: ComRentForm, Sell: ComSellForm, Lease: ComLeaseForm },
    "Land & Plots": { Rent: RentLPForm, Sell: SellLPForm, Lease: LeaseLPForm },
    Hostel: { Rent: HostelRentForm, Sell: HostelSellForm, Lease: HostelLeaseForm }
  },
  Agent: {
    Individual: { Rent: RentAgentIndForm, Sell: SellAgentIndForm, Lease: LeaseAgentIndForm },
    Apartment: { Rent: RentAgentApartForm, Sell: SellAgentApartForm, Lease: LeaseAgentApartForm },
    Commercial: { Rent: RentAgentComForm, Sell: SellAgentComForm, Lease: LeaseAgentComForm },
    "Land & Plots": { Rent: RentAgentLPForm, Sell: SellAgentLPForm, Lease: LeaseAgentLPForm },
    Hostel: { Rent: RentAgentHostelForm, Sell: SellAgentHostelForm, Lease: LeaseAgentHostelForm }
  },
  Builder: {
    Individual: { Rent: RentBuilderIndForm, Sell: SellBuilderIndForm, Lease: LeaseBuilderIndForm },
    Apartment: { Rent: RentBuilderApartForm, Sell: SellBuilderApartForm, Lease: LeaseBuilderApartForm },
    Commercial: { Rent: RentBuilderComForm, Sell: SellBuilderComForm, Lease: LeaseBuilderComForm },
    "Land & Plots": { Rent: RentBuilderLPForm, Sell: SellBuilderLPForm, Lease: LeaseBuilderLPForm },
    Hostel: { Rent: RentBuilderHostelForm, Sell: SellBuilderHostelForm, Lease: LeaseBuilderHostelForm }
  },
  "Property Management": {
    Individual: { Rent: RentPMIndForm, Sell: SellPMIndForm, Lease: LeasePMIndForm },
    Apartment: { Rent: RentPMApartForm, Sell: SellPMApartForm, Lease: LeasePMApartForm },
    Commercial: { Rent: RentPMComForm, Sell: SellPMComForm, Lease: LeasePMComForm },
    "Land & Plots": { Rent: RentPMLPForm, Sell: SellPMLPForm, Lease: LeasePMLPForm },
    Hostel: { Rent: RentPMHostelForm, Sell: SellPMHostelForm, Lease: LeasePMHostelForm }
  }
};

/* ------------------------------------------------------------------ */
/*                Property-related ad content - 4 ads each           */
/* ------------------------------------------------------------------ */

const browseAds = [
  {
    title: "Home Loans up to ₹5 Cr",
    subtitle: "Get pre-approved in 24 hours, rates starting at 8.35%*",
    cta: "Check Eligibility",
    image: commercial2,
    route: "/find-loan"
  },
  {
    title: "Zero Brokerage Rentals",
    subtitle: "Rent apartments & villas directly from verified owners",
    cta: "Browse Rentals",
    image: apartment4,
    route: "/apartment/rental-apartment"
  },
  {
    title: "Free Property Valuation",
    subtitle: "Know your property's true market value in minutes",
    cta: "Get Valuation",
    image: land3,
    route: "/services"
  },
  {
    title: "Instant Home Sale",
    subtitle: "Get cash offer for your property in 48 hours",
    cta: "Sell Now",
    image: villa1,
    route: "/services"
  }
];

const postingAds = [
  {
    title: "List Your Property Free",
    subtitle: "No listing fees for owners in your first 30 days",
    cta: "Start Listing",
    image: villa4,
    route: "#post-property"
  },
  {
    title: "Professional Photography",
    subtitle: "Get your property shot by certified photographers",
    cta: "Book a Shoot",
    image: hostel2,
    route: "/services"
  },
  {
    title: "Verified Owner Badge",
    subtitle: "Build trust with a verified badge on your listing",
    cta: "Get Verified",
    image: commercial5,
    route: "/services"
  },
  {
    title: "Premium Listing Boost",
    subtitle: "Get 5x more views with featured property status",
    cta: "Boost Now",
    image: apartment2,
    route: "/services"
  }
];

/* ------------------------------------------------------------------ */
/*  FIND YOUR LOAN — matches Header.jsx's loanMenu (5 items)           */
/* ------------------------------------------------------------------ */

const loanOptions = [
  {
    icon: Home,
    image: villa1,
    title: "Home Loan",
    tagline: "Buy your dream home",
    description: "Finance new or resale homes with rates starting at 8.35%* and tenures up to 30 years.",
    cta: "Check Eligibility",
    route: "/find-loan/home-loan"
  },
  {
    icon: Building,
    image: commercial1,
    title: "Property Loan",
    tagline: "Unlock property value",
    description: "Borrow against a property you already own for business, education, or any personal need.",
    cta: "Apply Now",
    route: "/find-loan/property-loan"
  },
  {
    icon: Hammer,
    image: land2,
    title: "Construction Loan",
    tagline: "Build from the ground up",
    description: "Staged disbursements released as construction progresses, so you only pay interest on what's drawn.",
    cta: "Get Started",
    route: "/find-loan/construction-loan"
  },
  {
    icon: MapPin,
    image: land1,
    title: "Plot Loan",
    tagline: "Secure your land first",
    description: "Purchase residential land now and build later, with flexible repayment options.",
    cta: "Explore Plot Loans",
    route: "/find-loan/plot-loan"
  },
  {
    icon: Landmark,
    image: commercial3,
    title: "Commercial Loan",
    tagline: "Grow your business",
    description: "Fund an office, retail space, or warehouse purchase with financing built for business needs.",
    cta: "Apply Now",
    route: "/find-loan/commercial-loan"
  }
];

/* ------------------------------------------------------------------ */
/*  SERVICES — matches Header.jsx's servicesMenu (5 items)             */
/* ------------------------------------------------------------------ */

const serviceOptions = [
  {
    icon: Hammer,
    image: land4,
    title: "Construction",
    tagline: "Ground-up building",
    description: "End-to-end construction — from foundation to finishing — managed by vetted contractors.",
    cta: "Get a Quote",
    route: "/services/construction"
  },
  {
    icon: Home,
    image: apartment2,
    title: "Interior",
    tagline: "Design & furnishing",
    description: "Custom interior design, modular furniture, and space planning tailored to your style.",
    cta: "Book Consultation",
    route: "/services/interior"
  },
  {
    icon: PaintBucket,
    image: villa4,
    title: "Painting",
    tagline: "Fresh, flawless finish",
    description: "Interior and exterior painting with premium finishes and clean, on-time execution.",
    cta: "Get a Quote",
    route: "/services/painting"
  },
  {
    icon: Droplets,
    image: hostel3,
    title: "Plumbing",
    tagline: "Installation & repair",
    description: "Reliable plumbing installation, leak fixes, and fittings from licensed professionals.",
    cta: "Book a Visit",
    route: "/services/plumbing"
  },
  {
    icon: Sparkles,
    image: apartment5,
    title: "Cleaning",
    tagline: "Deep clean, move-in ready",
    description: "Thorough deep-cleaning and regular maintenance for homes and commercial spaces.",
    cta: "Schedule Cleaning",
    route: "/services/cleaning"
  }
];

const loanAds = [
  {
    title: "Pre-Approved in 24 Hours",
    subtitle: "Skip the paperwork — get instant eligibility on select loans",
    cta: "Check Now",
    image: commercial2,
    route: "/find-loan"
  },
  {
    title: "0% Processing Fee This Month",
    subtitle: "Limited-time offer on Home and Plot loans",
    cta: "Claim Offer",
    image: villa2,
    route: "/find-loan/home-loan"
  },
  {
    title: "Free EMI Calculator",
    subtitle: "Plan your monthly budget before you borrow",
    cta: "Calculate Now",
    image: land5,
    route: "/find-loan"
  },
  {
    title: "Balance Transfer Facility",
    subtitle: "Switch your existing home loan for better rates",
    cta: "Transfer Now",
    image: commercial4,
    route: "/find-loan"
  }
];

const serviceAds = [
  {
    title: "Bundle & Save 15%",
    subtitle: "Book Construction + Interior together and save",
    cta: "Bundle Now",
    image: apartment3,
    route: "/services"
  },
  {
    title: "Same-Day Plumbing",
    subtitle: "Emergency repairs available in your area today",
    cta: "Book Now",
    image: hostel4,
    route: "/services/plumbing"
  },
  {
    title: "Rate Your Last Service",
    subtitle: "Help us match you with better pros next time",
    cta: "Leave Feedback",
    image: commercial5,
    route: "/services"
  },
  {
    title: "Free Site Inspection",
    subtitle: "Get a free consultation for your renovation project",
    cta: "Book Inspection",
    image: villa3,
    route: "/services"
  }
];

/* ------------------------------------------------------------------ */
/*  Reusable pieces                                                    */
/* ------------------------------------------------------------------ */

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

// A single "heading + horizontally scrollable card row + arrow buttons" block
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

// Rent / Sell / Lease chooser popup — mirrors the Header.jsx action popups
const ActionPopup = ({ isOpen, onClose, title, subtitle, onAction }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#1E7A6E] flex items-center gap-2">
            <Building className="w-5 h-5" />
            {title}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">{subtitle}</p>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onAction("Rent")}
            className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
          >
            <div className="text-2xl mb-1">🏠</div>
            <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
          </button>

          <button
            onClick={() => onAction("Sell")}
            className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
          >
            <div className="text-2xl mb-1">💰</div>
            <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
          </button>

          <button
            onClick={() => onAction("Lease")}
            className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
          >
            <div className="text-2xl mb-1">📄</div>
            <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
          </button>
        </div>
      </div>
    </div>
  );
};

const FlipCard = ({ icon: Icon, image, title, tagline, description, cta, flipped, onToggle, onCtaClick }) => (
  <div
    className="group [perspective:1200px] h-[230px] xs:h-[250px] sm:h-[280px] cursor-pointer"
    onClick={onToggle}
  >
    <div
      className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${
        flipped ? "[transform:rotateY(180deg)]" : ""
      }`}
    >
      {/* FRONT — full-bleed image with icon badge + title/tagline overlay */}
      <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden shadow-lg border border-[#D1E2DB]">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

        <div className="relative z-10 h-full flex flex-col justify-between p-3.5 sm:p-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md self-start">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E7A6E]" />
          </div>

          <div>
            <h4 className="text-white font-black text-sm sm:text-base uppercase tracking-wide drop-shadow-md leading-tight">
              {title}
            </h4>
            <p className="text-white/85 text-[10px] sm:text-xs font-semibold mt-0.5">{tagline}</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[9px] sm:text-[10px] text-[#9FE6D6] font-bold tracking-widest uppercase">
              Tap to view <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* BACK — description + CTA on a solid green panel */}
      <div
        className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden shadow-lg flex flex-col justify-between p-4 sm:p-5 text-left"
        style={{ background: "linear-gradient(145deg, #14534B, #1E7A6E)" }}
      >
        <div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 flex items-center justify-center mb-2.5 sm:mb-3">
            <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
          </div>
          <h4 className="text-white font-black text-sm sm:text-base uppercase tracking-wide mb-1.5 sm:mb-2">
            {title}
          </h4>
          <p className="text-white/85 text-[11px] sm:text-xs leading-relaxed">{description}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCtaClick();
          }}
          className="mt-3 inline-flex items-center justify-center gap-1.5 bg-white text-[#14534B] font-bold text-[10px] sm:text-xs px-3 sm:px-4 py-2 rounded-sm tracking-wide hover:bg-[#EAF2EF] transition-colors shadow"
        >
          {cta}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  };

  const handleAdNavigate = (route) => {
    if (route.startsWith("#")) {
      document.getElementById(route.slice(1))?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(route);
  };

  /* ---------------- Customer Portal scroll + navigation ---------------- */
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

  
  const handleCardClick = (item) => {
    navigate(item.path);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Heading click -> the category's "All" landing page, then jump to the top.
  const handleHeadingClick = (category) => {
    navigate(category.route);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  /* ---------------- Post Your Property — Owner / Agent / Builder / PM ---------------- */
  const [postRole, setPostRole] = useState("Owner");
  const [popupCategory, setPopupCategory] = useState(null); // e.g. "Individual"
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // { role, category, action }

  // Step 1: choose a property type to post, as the currently selected role
  const handlePostTypeClick = (heading) => {
    setPopupCategory(heading);
    setShowActionPopup(true);
  };

  // Step 2: choose Rent / Sell / Lease -> opens the matching form for role+category+action
  const handleActionSelect = (action) => {
    setShowActionPopup(false);
    setActiveForm({ role: postRole, category: popupCategory, action });
  };

  const ActiveFormComponent =
    activeForm && formRegistry[activeForm.role]?.[activeForm.category]?.[activeForm.action];

  /* ---------------- Find Your Loan / Services flip cards ---------------- */
  const [flippedCards, setFlippedCards] = useState(new Set());

  const toggleFlipped = (key) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="w-full bg-[#F4F7F6] font-sans antialiased mt-0 pt-0">
      {/* Hide scrollbars for the Customer Portal card rows */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none;}`}</style>

      {/* Main Banner Housing Container */}
      <div className="relative w-full overflow-hidden h-[260px] xs:h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] bg-[#D1E2DB] top-0 mt-0">

        {/* Render Slides Loop */}
        {slidesData.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.title}
              className={`absolute inset-0 w-full h-full flex flex-row transition-all duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >

              {/* Left Text Block - Rich Geometric Accent Settings */}
              <div
                className="w-[40%] sm:w-[40%] md:w-[40%] lg:w-[36%] h-full bg-[#D1E2DB] text-[#2C3E35] relative flex flex-col justify-center px-3 xs:px-4 sm:px-8 md:pl-12 lg:pl-16 pr-3 sm:pr-8 shrink-0 z-30 overflow-hidden [clip-path:polygon(0_0,100%_0,78%_100%,0_100%)] sm:[clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] md:[clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]"
              >
                {/* BACKGROUND DIAMOND GEOMETRY GRAPHICS */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.25] z-0">
                  <div className="absolute top-4 left-6 w-12 h-12 border border-[#1E7A6E] transform rotate-45" />
                  <div className="hidden sm:block absolute top-12 left-20 w-6 h-6 border border-[#1E7A6E] bg-[#1E7A6E]/10 transform rotate-45" />
                  <div className="absolute top-24 -left-8 w-24 h-24 border-2 border-dashed border-[#1E7A6E] transform rotate-45" />
                  <div className="hidden sm:block absolute top-1/3 right-8 w-12 h-12 border border-[#1E7A6E] transform rotate-45" />
                  <div className="absolute top-[45%] left-1/4 w-10 h-10 border border-[#1E7A6E] bg-[#1E7A6E]/20 transform rotate-45" />
                  <div className="absolute bottom-8 left-16 w-20 h-20 border border-[#1E7A6E]/60 transform rotate-45" />
                  <div className="hidden sm:block absolute bottom-2 right-16 w-14 h-14 border-2 border-[#1E7A6E] transform rotate-45" />
                  <div className="hidden sm:block absolute bottom-24 -right-10 w-28 h-28 border border-dashed border-[#1E7A6E]/40 transform rotate-45" />
                </div>

                {/* Content Container */}
                <div className={`relative z-10 transition-all duration-500 transform ${isActive ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}>
                  <span className="text-[8px] xs:text-[9px] sm:text-[11px] lg:text-[14px] font-black tracking-[2px] sm:tracking-[4px] lg:tracking-[5px] text-[#1E7A6E] block mb-1">
                    LUXURY
                  </span>

                  <h2 className="text-base xs:text-lg sm:text-2xl lg:text-[46px] font-black tracking-tight leading-[0.95] uppercase text-[#1C2D24]">
                    {slide.title.split(" ")[0]}
                    <span className="block text-[#556B60] font-light text-xs xs:text-sm sm:text-base lg:text-[34px] tracking-tight mt-1 lowercase first-letter:uppercase">
                      {slide.title.split(" ").slice(1).join(" ")}
                    </span>
                  </h2>

                  <div className="w-6 sm:w-10 lg:w-14 h-[2px] sm:h-[3px] bg-[#1E7A6E] my-2 sm:my-4" />

                  <p className="text-[#4A5D54] text-[8px] xs:text-[9px] sm:text-xs lg:text-[16px] font-bold leading-snug mb-2 sm:mb-6 max-w-[130px] sm:max-w-none">
                    {slide.subtitle}
                  </p>

                  <button className="w-[70px] xs:w-[85px] sm:w-[120px] lg:w-[155px] h-[24px] xs:h-[28px] sm:h-[38px] lg:h-[48px] bg-[#1E7A6E] text-white font-extrabold text-[7px] xs:text-[8px] sm:text-[10px] lg:text-xs rounded-sm tracking-widest hover:bg-[#14534B] transition-colors shadow-md">
                    EXPLORE NOW
                  </button>
                </div>
              </div>

              {/* Right Side Photo Grid Matrix */}
              <div className="w-[60%] sm:w-[60%] md:w-[60%] lg:w-[64%] h-full relative z-10 grid grid-cols-2 grid-rows-2 gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-[#D1E2DB]">

                <div className="relative w-full h-full overflow-hidden">
                  <img src={slide.images[0]} alt="Property Highlight 1" className="w-full h-full object-cover" />
                </div>

                <div className="relative w-full h-full overflow-hidden">
                  <img src={slide.images[1]} alt="Property Highlight 2" className="w-full h-full object-cover" />
                </div>

                <div className="relative w-full h-full overflow-hidden">
                  <img src={slide.images[2]} alt="Property Highlight 3" className="w-full h-full object-cover" />
                </div>

                <div className="relative w-full h-full overflow-hidden">
                  <img src={slide.images[3]} alt="Property Highlight 4" className="w-full h-full object-cover" />
                </div>

                {/* Central Intersecting Diamond Windows Frame */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                  <div className="w-[70px] h-[70px] xs:w-[85px] xs:h-[85px] sm:w-[130px] sm:h-[130px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] transform rotate-45 shadow-2xl border-[3px] xs:border-[4px] md:border-[6px] border-[#D1E2DB] overflow-hidden bg-[#D1E2DB]">
                    <div className="w-full h-full transform -rotate-45 scale-[1.42]">
                      <img
                        src={slide.images[4]}
                        alt="Featured Central Highlight"
                        className="w-full h-full object-cover pointer-events-auto"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}

        {/* Slide Carousel Arrow Overlays */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1 sm:p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-40"
          aria-label="Previous Banner Slide"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={handleNextSlide}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1 sm:p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-40"
          aria-label="Next Banner Slide"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        {/* Indicator Pagination Strip */}
        <div className="absolute bottom-2 sm:bottom-4 right-3 sm:left-auto sm:right-8 flex gap-1 sm:gap-2 z-40">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-4 sm:w-6 bg-[#1E7A6E]" : "w-1.5 sm:w-2 bg-[#1C2D24]/30 hover:bg-[#1C2D24]/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Access Categories Navigation Grid - Parallelogram Buttons */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Customer Portal", "Post Your Property", "Find Your Loan", "Services"].map(
          (label) => (
            <button
              key={label}
              className="text-white font-bold py-3 rounded-none text-sm tracking-wider shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 relative"
              style={{
                background: "linear-gradient(135deg, #14534B, #1E7A6E)",
                clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                padding: "12px 24px",
              }}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* ================================================================ */}
      {/*  CUSTOMER PORTAL SECTION                                          */}
      {/* ================================================================ */}
      <div className="w-full bg-[#EAF2EF] py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-[#1C2D24] font-black text-xl xs:text-2xl sm:text-4xl tracking-tight uppercase mb-2">
            Customer Portal
          </h2>
          <p className="text-center text-[#556B60] text-[11px] xs:text-xs sm:text-sm mb-8 sm:mb-12">
            Browse properties by category — tap a card to view that type
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
      </div>

      {/* ================================================================ */}
      {/*  ADS SECTION — property related offers (4 ads)                   */}
      {/* ================================================================ */}
      <AdsSection ads={browseAds} heading="Offers For You" onNavigate={handleAdNavigate} />

      {/* ================================================================ */}
      {/*  POST YOUR PROPERTY SECTION                                       */}
      {/* ================================================================ */}
      <div id="post-property" className="w-full bg-white py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-[#1C2D24] font-black text-xl xs:text-2xl sm:text-4xl tracking-tight uppercase mb-2">
            Post Your Property
          </h2>
          <p className="text-center text-[#556B60] text-[11px] xs:text-xs sm:text-sm mb-6 sm:mb-8">
            Select who you're posting as, then choose a property type to get started.
          </p>

          {/* Role selector: Owner / Agent / Builder / Property Management */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {postPropertyRoles.map((role) => {
              const colors = roleColorSchemes[role];
              const isActive = postRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setPostRole(role)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-[11px] xs:text-xs sm:text-sm tracking-wide transition-all duration-300 border-2"
                  style={
                    isActive
                      ? { backgroundColor: colors.bg, borderColor: colors.bg, color: colors.textOnBg }
                      : { backgroundColor: "#FFFFFF", color: colors.bg, borderColor: colors.bg }
                  }
                >
                  {role}
                </button>
              );
            })}
          </div>

          {/* Property type grid for the selected role with four unique green shades */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {customerPortalCategories.map((category) => {
              const colors = roleColorSchemes[postRole];
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => handlePostTypeClick(category.heading)}
                  className="flex flex-col items-center gap-2 p-4 sm:p-5 rounded-lg border-2 transition-all duration-300 group hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: colors.lightBg,
                    borderColor: colors.bg,
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bg;
                    const textEl = e.currentTarget.querySelector('span');
                    if (textEl) textEl.style.color = colors.textOnBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.lightBg;
                    const textEl = e.currentTarget.querySelector('span');
                    if (textEl) textEl.style.color = colors.bg;
                  }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={category.items[0].image}
                      alt={category.heading}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span 
                    className="font-bold text-[11px] xs:text-xs sm:text-sm text-center transition-colors duration-300"
                    style={{ color: colors.bg }}
                  >
                    {category.heading}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action popup: Rent / Sell / Lease chooser, for the selected role + property type */}
      <ActionPopup
        isOpen={showActionPopup}
        onClose={() => setShowActionPopup(false)}
        title={`${postRole} - ${popupCategory || ""}`}
        subtitle="How would you like to proceed?"
        onAction={handleActionSelect}
      />

      {ActiveFormComponent && (
        <ActiveFormComponent isOpen={true} onClose={() => setActiveForm(null)} />
      )}

      {/* ================================================================ */}
      {/*  ADS SECTION (after Post Property) - 4 ads                      */}
      {/* ================================================================ */}
      <AdsSection ads={postingAds} heading="Grow Your Listing" onNavigate={handleAdNavigate} />

      {/* ================================================================ */}
      {/*  FIND YOUR LOAN SECTION — flip cards                              */}
      {/* ================================================================ */}
      <div className="w-full bg-[#EAF2EF] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-[#1C2D24] font-black text-xl xs:text-2xl sm:text-4xl tracking-tight uppercase mb-2">
            Find Your Loan
          </h2>
          <p className="text-center text-[#556B60] text-[11px] xs:text-xs sm:text-sm mb-8 sm:mb-12">
            Hover or tap a card to see details
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {loanOptions.map((loan, idx) => {
              const key = `loan-${idx}`;
              return (
                <FlipCard
                  key={key}
                  icon={loan.icon}
                  image={loan.image}
                  title={loan.title}
                  tagline={loan.tagline}
                  description={loan.description}
                  cta={loan.cta}
                  flipped={flippedCards.has(key)}
                  onToggle={() => toggleFlipped(key)}
                  onCtaClick={() => navigate(loan.route)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  ADS SECTION (after Find Your Loan) - 4 ads                     */}
      {/* ================================================================ */}
      <AdsSection ads={loanAds} heading="Loan Offers" onNavigate={handleAdNavigate} />

      {/* ================================================================ */}
      {/*  SERVICES SECTION — flip cards                                    */}
      {/* ================================================================ */}
      <div className="w-full bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-[#1C2D24] font-black text-xl xs:text-2xl sm:text-4xl tracking-tight uppercase mb-2">
            Services
          </h2>
          <p className="text-center text-[#556B60] text-[11px] xs:text-xs sm:text-sm mb-8 sm:mb-12">
            Hover or tap a card to see details
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {serviceOptions.map((service, idx) => {
              const key = `service-${idx}`;
              return (
                <FlipCard
                  key={key}
                  icon={service.icon}
                  image={service.image}
                  title={service.title}
                  tagline={service.tagline}
                  description={service.description}
                  cta={service.cta}
                  flipped={flippedCards.has(key)}
                  onToggle={() => toggleFlipped(key)}
                  onCtaClick={() => navigate(service.route)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  ADS SECTION (after Services) - 4 ads                           */}
      {/* ================================================================ */}
      <AdsSection ads={serviceAds} heading="Service Offers" onNavigate={handleAdNavigate} />
    </div>
  );
};

export default HomePage;




























// import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// // Import images from assets
// import apartment1 from "../assets/Apartmenthomeban1.jpg";
// import apartment2 from "../assets/Apartmenthomeban2.jpg";
// import apartment3 from "../assets/Apartmenthomeban3.jpg";
// import apartment4 from "../assets/Apartmenthomeban4.jpg";
// import apartment5 from "../assets/Apartmenthomeban5.jpg";

// import commercial1 from "../assets/Commercialhomeban1.jpg";
// import commercial2 from "../assets/Commercialhomeban2.jpg";
// import commercial3 from "../assets/Commercialhomeban3.jpg";
// import commercial4 from "../assets/Commercialhomeban4.jpg";
// import commercial5 from "../assets/Commercialhomeban5.jpg";

// import hostel1 from "../assets/hostelhomeban1.jpg";
// import hostel2 from "../assets/hostelhomeban2.jpg";
// import hostel3 from "../assets/hostelhomeban3.jpg";
// import hostel4 from "../assets/hostelhomeban4.jpg";
// import hostel5 from "../assets/hostelhomeban5.jpg";

// import villa1 from "../assets/Individualhomeban1.jpg";
// import villa2 from "../assets/Individualhomeban2.jpg";
// import villa3 from "../assets/Individualhomeban3.jpg";
// import villa4 from "../assets/Individualhomeban4.jpg";
// import villa5 from "../assets/Individualhomeban5.jpg";

// import land1 from "../assets/landhomeban1.jpg";
// import land2 from "../assets/landhomeban2.jpg";
// import land3 from "../assets/landhomeban3.jpg";
// import land4 from "../assets/landhomeban4.jpg";
// import land5 from "../assets/landhomeban5.jpg";

// const slidesData = [
//   {
//     title: "Apartments",
//     subtitle: "Where Comfort Meets Convenience",
//     images: [apartment1, apartment2, apartment3, apartment4, apartment5]
//   },
//   {
//     title: "Commercial Buildings",
//     subtitle: "Elevate Your Business Address",
//     images: [commercial1, commercial2, commercial3, commercial4, commercial5]
//   },
//   {
//     title: "Hostels",
//     subtitle: "Your Home Away From Home",
//     images: [hostel1, hostel2, hostel3, hostel4, hostel5]
//   },
//   {
//     title: "Individual Villas",
//     subtitle: "Your Space. Your Sanctuary.",
//     images: [villa1, villa2, villa3, villa4, villa5]
//   },
//   {
//     title: "Land and Plots",
//     subtitle: "Build Your Dream Home",
//     images: [land1, land2, land3, land4, land5]
//   }
// ];

// const HomePage = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slidesData.length);
//     }, 6000);
//     return () => clearInterval(timer);
//   }, []);

//   const handlePrevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
//   };

//   const handleNextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slidesData.length);
//   };

//   return (
//     <div className="w-full bg-[#F4F7F6] font-sans antialiased mt-0 pt-0">

//       {/* Main Banner Housing Container */}
//       <div className="relative w-full overflow-hidden h-[260px] xs:h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] bg-[#D1E2DB] top-0 mt-0">

//         {/* Render Slides Loop */}
//         {slidesData.map((slide, index) => {
//           const isActive = index === currentSlide;
//           return (
//             <div
//               key={slide.title}
//               className={`absolute inset-0 w-full h-full flex flex-row transition-all duration-700 ease-in-out ${
//                 isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
//               }`}
//             >

//               {/* Left Text Block - Rich Geometric Accent Settings */}
//               <div
//                 className="w-[40%] sm:w-[40%] md:w-[40%] lg:w-[36%] h-full bg-[#D1E2DB] text-[#2C3E35] relative flex flex-col justify-center px-3 xs:px-4 sm:px-8 md:pl-12 lg:pl-16 pr-3 sm:pr-8 shrink-0 z-30 overflow-hidden [clip-path:polygon(0_0,100%_0,78%_100%,0_100%)] sm:[clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] md:[clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]"
//               >
//                 {/* BACKGROUND DIAMOND GEOMETRY GRAPHICS */}
//                 <div className="absolute inset-0 pointer-events-none opacity-[0.25] z-0">
//                   <div className="absolute top-4 left-6 w-12 h-12 border border-[#1E7A6E] transform rotate-45" />
//                   <div className="hidden sm:block absolute top-12 left-20 w-6 h-6 border border-[#1E7A6E] bg-[#1E7A6E]/10 transform rotate-45" />
//                   <div className="absolute top-24 -left-8 w-24 h-24 border-2 border-dashed border-[#1E7A6E] transform rotate-45" />
//                   <div className="hidden sm:block absolute top-1/3 right-8 w-12 h-12 border border-[#1E7A6E] transform rotate-45" />
//                   <div className="absolute top-[45%] left-1/4 w-10 h-10 border border-[#1E7A6E] bg-[#1E7A6E]/20 transform rotate-45" />
//                   <div className="absolute bottom-8 left-16 w-20 h-20 border border-[#1E7A6E]/60 transform rotate-45" />
//                   <div className="hidden sm:block absolute bottom-2 right-16 w-14 h-14 border-2 border-[#1E7A6E] transform rotate-45" />
//                   <div className="hidden sm:block absolute bottom-24 -right-10 w-28 h-28 border border-dashed border-[#1E7A6E]/40 transform rotate-45" />
//                 </div>

//                 {/* Content Container */}
//                 <div className={`relative z-10 transition-all duration-500 transform ${isActive ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}>
//                   <span className="text-[8px] xs:text-[9px] sm:text-[11px] lg:text-[14px] font-black tracking-[2px] sm:tracking-[4px] lg:tracking-[5px] text-[#1E7A6E] block mb-1">
//                     LUXURY
//                   </span>

//                   <h2 className="text-base xs:text-lg sm:text-2xl lg:text-[46px] font-black tracking-tight leading-[0.95] uppercase text-[#1C2D24]">
//                     {slide.title.split(" ")[0]}
//                     <span className="block text-[#556B60] font-light text-xs xs:text-sm sm:text-base lg:text-[34px] tracking-tight mt-1 lowercase first-letter:uppercase">
//                       {slide.title.split(" ").slice(1).join(" ")}
//                     </span>
//                   </h2>

//                   <div className="w-6 sm:w-10 lg:w-14 h-[2px] sm:h-[3px] bg-[#1E7A6E] my-2 sm:my-4" />

//                   <p className="text-[#4A5D54] text-[8px] xs:text-[9px] sm:text-xs lg:text-[16px] font-bold leading-snug mb-2 sm:mb-6 max-w-[130px] sm:max-w-none">
//                     {slide.subtitle}
//                   </p>

//                   <button className="w-[70px] xs:w-[85px] sm:w-[120px] lg:w-[155px] h-[24px] xs:h-[28px] sm:h-[38px] lg:h-[48px] bg-[#1E7A6E] text-white font-extrabold text-[7px] xs:text-[8px] sm:text-[10px] lg:text-xs rounded-sm tracking-widest hover:bg-[#14534B] transition-colors shadow-md">
//                     EXPLORE NOW
//                   </button>
//                 </div>
//               </div>

//               {/* Right Side Photo Grid Matrix */}
//               <div className="w-[60%] sm:w-[60%] md:w-[60%] lg:w-[64%] h-full relative z-10 grid grid-cols-2 grid-rows-2 gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-[#D1E2DB]">

//                 <div className="relative w-full h-full overflow-hidden">
//                   <img src={slide.images[0]} alt="Property Highlight 1" className="w-full h-full object-cover" />
//                 </div>

//                 <div className="relative w-full h-full overflow-hidden">
//                   <img src={slide.images[1]} alt="Property Highlight 2" className="w-full h-full object-cover" />
//                 </div>

//                 <div className="relative w-full h-full overflow-hidden">
//                   <img src={slide.images[2]} alt="Property Highlight 3" className="w-full h-full object-cover" />
//                 </div>

//                 <div className="relative w-full h-full overflow-hidden">
//                   <img src={slide.images[3]} alt="Property Highlight 4" className="w-full h-full object-cover" />
//                 </div>

//                 {/* Central Intersecting Diamond Windows Frame */}
//                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
//                   <div className="w-[70px] h-[70px] xs:w-[85px] xs:h-[85px] sm:w-[130px] sm:h-[130px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] transform rotate-45 shadow-2xl border-[3px] xs:border-[4px] md:border-[6px] border-[#D1E2DB] overflow-hidden bg-[#D1E2DB]">
//                     <div className="w-full h-full transform -rotate-45 scale-[1.42]">
//                       <img
//                         src={slide.images[4]}
//                         alt="Featured Central Highlight"
//                         className="w-full h-full object-cover pointer-events-auto"
//                       />
//                     </div>
//                   </div>
//                 </div>

//               </div>

//             </div>
//           );
//         })}

//         {/* Slide Carousel Arrow Overlays */}
//         <button
//           onClick={handlePrevSlide}
//           className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1 sm:p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-40"
//           aria-label="Previous Banner Slide"
//         >
//           <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
//         </button>

//         <button
//           onClick={handleNextSlide}
//           className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1 sm:p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-40"
//           aria-label="Next Banner Slide"
//         >
//           <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
//         </button>

//         {/* Indicator Pagination Strip */}
//         <div className="absolute bottom-2 sm:bottom-4 right-3 sm:left-auto sm:right-8 flex gap-1 sm:gap-2 z-40">
//           {slidesData.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
//                 index === currentSlide ? "w-4 sm:w-6 bg-[#1E7A6E]" : "w-1.5 sm:w-2 bg-[#1C2D24]/30 hover:bg-[#1C2D24]/60"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Quick Access Categories Navigation Grid - Parallelogram Buttons */}
//       <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {["Customer Portal", "Post Your Property", "Find Your Loan", "Services"].map(
//           (label) => (
//             <button
//               key={label}
//               className="text-white font-bold py-3 rounded-none text-sm tracking-wider shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 relative"
//               style={{
//                 background: "linear-gradient(135deg, #14534B, #1E7A6E)",
//                 clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
//                 padding: "12px 24px",
//               }}
//             >
//               {label}
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;