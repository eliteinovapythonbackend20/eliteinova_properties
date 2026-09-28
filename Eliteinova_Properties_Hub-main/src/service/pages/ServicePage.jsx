// src/service/pages/ServicePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  Phone,
  Users,
  Award,
  MapPin,
} from "lucide-react";

/* ==================== LOCAL IMAGE IMPORTS ==================== */
import bannerImg from "../../assets/banner1.jpg";
import constructionImg from "../../assets/banner1.jpg";
import paintingImg from "../../assets/banner1.jpg";
import interiorImg from "../../assets/banner1.jpg";
import plumbingImg from "../../assets/banner1.jpg";
import cleaningImg from "../../assets/banner1.jpg";

/* ---------------- SERVICE CATEGORIES ---------------- */
const serviceCategories = [
  {
    id: 1,
    title: "Construction",
    subtitle: "Build your dream project",
    description:
      "End-to-end construction services for residential and commercial projects — from foundation to finish.",
    image: constructionImg,
    icon: "🏗️",
    path: "/service/construction",
    rating: 4.9,
    jobs: "1.2K+",
    pros: "150+",
    responseTime: "2 hrs",
    popular: true,
  },
  {
    id: 2,
    title: "Painting",
    subtitle: "Color your world",
    description:
      "Professional interior and exterior painting services for homes, offices, and commercial spaces.",
    image: paintingImg,
    icon: "🖌️",
    path: "/service/painting",
    rating: 4.9,
    jobs: "2.4K+",
    pros: "220+",
    responseTime: "30 mins",
    popular: true,
  },
  {
    id: 3,
    title: "Interior",
    subtitle: "Design your space",
    description:
      "Modern interior design solutions tailored to your taste, space, and budget — from concept to completion.",
    image: interiorImg,
    icon: "🎨",
    path: "/service/interior",
    rating: 4.8,
    jobs: "850+",
    pros: "95+",
    responseTime: "1 hr",
    popular: true,
  },
  {
    id: 4,
    title: "Plumbing",
    subtitle: "Fix it right, first time",
    description:
      "Reliable plumbing installation, repair, and maintenance services by certified professionals.",
    image: plumbingImg,
    icon: "🔧",
    path: "/service/plumbing",
    rating: 4.7,
    jobs: "3.1K+",
    pros: "310+",
    responseTime: "45 mins",
    popular: false,
  },
  {
    id: 5,
    title: "Cleaning",
    subtitle: "Sparkling clean, every time",
    description:
      "Deep cleaning and regular maintenance for residential and commercial properties with eco-friendly products.",
    image: cleaningImg,
    icon: "🧹",
    path: "/service/cleaning",
    rating: 4.9,
    jobs: "5.6K+",
    pros: "420+",
    responseTime: "1 hr",
    popular: true,
  },
];

/* ---------------- COMPONENT ---------------- */
const ServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] via-white to-[#F0FDF4]">
      {/* ==================== BANNER ==================== */}
      <section className="relative overflow-hidden text-white">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={bannerImg}
            alt="Services banner"
            className="w-full h-full object-cover"
          />
          {/* ✅ Black overlay removed — image shows in full brightness */}
        </div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)",
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#FFD93D]" />
            <span className="text-sm font-medium">Explore Our Services</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
            Professional Property Services
            <span className="block text-[#FFD93D]">For Every Need</span>
          </h1>

          <p className="text-white/90 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-8 drop-shadow-md">
            From construction to cleaning — connect with verified professionals
            for every property service you need. Trusted by 10,000+ customers
            across India.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: <ShieldCheck className="w-4 h-4" />, text: "Verified Pros" },
              { icon: <CheckCircle2 className="w-4 h-4" />, text: "Quality Guaranteed" },
              { icon: <Clock className="w-4 h-4" />, text: "Fast Response" },
              { icon: <TrendingUp className="w-4 h-4" />, text: "Best Prices" },
            ].map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
              >
                <span className="text-[#FFD93D]">{chip.icon}</span>
                {chip.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users className="w-5 h-5" />, value: "10K+", label: "Happy Clients" },
            { icon: <Award className="w-5 h-5" />, value: "500+", label: "Verified Pros" },
            { icon: <Star className="w-5 h-5" />, value: "4.9", label: "Avg Rating" },
            { icon: <MapPin className="w-5 h-5" />, value: "50+", label: "Cities" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F0FDF4] transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-[#00695C]">
                  {stat.value}
                </div>
                <div className="text-[11px] text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SECTION HEADING ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-[#00695C]" />
          <span className="text-sm font-medium text-[#00695C]">
            Our Services
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Choose Your Service
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Click on any service to explore its subcategories and find the perfect
          professional for your needs.
        </p>
      </section>

      {/* ==================== SERVICE CARDS ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {serviceCategories.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(service.path)}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 relative overflow-hidden cursor-pointer flex flex-col"
            >
              {/* Popular badge */}
              {service.popular && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#FFD93D] text-[#00695C] text-[11px] font-bold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  POPULAR
                </div>
              )}

              {/* Rating badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-white/50">
                <Star className="w-3 h-3 text-[#FFD93D] fill-[#FFD93D]" />
                <span className="text-xs font-bold text-gray-800">
                  {service.rating}
                </span>
              </div>

              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Neutral dark gradient only at bottom for text readability (no green tint) */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Icon */}
                <div className="absolute bottom-4 left-4 w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {service.icon}
                </div>

                {/* Subtitle on image */}
                <div className="absolute bottom-5 right-4 text-right">
                  <div className="text-[10px] uppercase tracking-wider text-white/80 font-semibold">
                    Service
                  </div>
                  <div className="text-sm font-bold text-white">
                    {service.subtitle}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 relative">
                {/* Top color accent — brand teal only */}
                <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-[#00695C] to-[#26A69A] transition-all duration-500 group-hover:left-0 group-hover:right-0" />

                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-[#00695C] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed flex-1">
                  {service.description}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-5">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#26A69A]" />
                    {service.jobs} bookings
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#26A69A]" />
                    {service.pros} pros
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#26A69A]" />
                    {service.responseTime}
                  </span>
                </div>

                {/* CTA Button — brand gradient only */}
                <button className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-[#00695C] to-[#26A69A]">
                  View Service
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}

          {/* Custom service card */}
          <div className="group bg-gradient-to-br from-[#00695C] via-[#00897B] to-[#26A69A] rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden cursor-pointer flex flex-col text-white">
            {/* Decorative blurs — brand colors */}
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#26A69A] blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#00E5FF] blur-3xl" />
            </div>

            <div className="relative p-8 flex flex-col items-center justify-center text-center flex-1 min-h-[420px]">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                ✨
              </div>

              <h3 className="text-2xl font-bold mb-3">Need Something Else?</h3>
              <p className="text-white/80 text-sm mb-6 max-w-xs leading-relaxed">
                Looking for a custom service not listed here? Tell us your
                requirement and we'll connect you with the right professional.
              </p>

              <button className="px-6 py-3 rounded-xl bg-[#FFD93D] text-[#00695C] font-bold flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg group-hover:gap-3">
                <Phone className="w-4 h-4" />
                Contact Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ANIMATIONS ==================== */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(15px) rotate(90deg); opacity: 0.5; }
          50% { transform: translateY(-12px) translateX(-12px) rotate(180deg); opacity: 0.7; }
          75% { transform: translateY(12px) translateX(18px) rotate(270deg); opacity: 0.3; }
        }
        .animate-float-particle { animation: float-particle 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ServicePage;