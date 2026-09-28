// src/service/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Users,
  Award,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Phone,
  Play,
  Quote,
  TrendingUp,
  MapPin,
  ThumbsUp,
} from "lucide-react";

const servicesList = [
  {
    id: 1,
    title: "Construction",
    description:
      "End-to-end construction services for residential and commercial projects.",
    icon: "🏗️",
    color: "#FF6B6B",
    price: "From ₹499/sq.ft",
    rating: 4.9,
    jobs: "1.2K+",
  },
  {
    id: 2,
    title: "Interior Design",
    description:
      "Modern interior design solutions tailored to your space and budget.",
    icon: "🎨",
    color: "#4ECDC4",
    price: "From ₹299/sq.ft",
    rating: 4.8,
    jobs: "850+",
  },
  {
    id: 3,
    title: "Painting",
    description:
      "Professional painting services for homes, offices, and commercial spaces.",
    icon: "🖌️",
    color: "#FFD93D",
    price: "From ₹18/sq.ft",
    rating: 4.9,
    jobs: "2.4K+",
  },
  {
    id: 4,
    title: "Plumbing",
    description:
      "Reliable plumbing installation, repair, and maintenance services.",
    icon: "🔧",
    color: "#6C5CE7",
    price: "From ₹199/visit",
    rating: 4.7,
    jobs: "3.1K+",
  },
  {
    id: 5,
    title: "Cleaning",
    description:
      "Deep cleaning and regular maintenance for residential and commercial properties.",
    icon: "🧹",
    color: "#00B894",
    price: "From ₹149/visit",
    rating: 4.9,
    jobs: "5.6K+",
  },
  {
    id: 6,
    title: "Electrical",
    description:
      "Certified electricians for wiring, repairs, and safety inspections.",
    icon: "⚡",
    color: "#FDCB6E",
    price: "From ₹249/visit",
    rating: 4.8,
    jobs: "2.8K+",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  /* Auto-cycle the "how it works" steps */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "10K+",
      label: "Happy Clients",
      color: "from-[#00695C] to-[#26A69A]",
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "500+",
      label: "Verified Pros",
      color: "from-[#FF9800] to-[#FFD93D]",
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: "4.9",
      label: "Avg Rating",
      color: "from-[#6C5CE7] to-[#4ECDC4]",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: "24/7",
      label: "Support",
      color: "from-[#4ECDC4] to-[#26A69A]",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Choose a Service",
      desc: "Browse our wide range of property services and pick what you need.",
      icon: "🔍",
    },
    {
      num: "02",
      title: "Book a Pro",
      desc: "Select a verified professional based on ratings, price, and availability.",
      icon: "📅",
    },
    {
      num: "03",
      title: "Relax & Enjoy",
      desc: "Sit back while our trusted experts handle everything end-to-end.",
      icon: "🎉",
    },
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Verified Professionals",
      desc: "Every partner is background-checked, certified, and insured.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Transparent Pricing",
      desc: "Upfront quotes with zero hidden charges. Ever.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Response",
      desc: "Get a professional at your doorstep within 60 minutes.",
    },
    {
      icon: <ThumbsUp className="w-6 h-6" />,
      title: "Quality Guarantee",
      desc: "100% satisfaction backed by our re-do guarantee.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] via-white to-[#F0FDF4]">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00695C] via-[#26A69A] to-[#004D40] text-white">
        {/* Decorative blurs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#FFD93D] blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-[#00E5FF] blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
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

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
                <Star className="w-4 h-4 text-[#FFD93D] fill-[#FFD93D]" />
                <span className="text-sm">Trusted by 10,000+ Customers</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                All Property Services
                <span className="block text-[#FFD93D]">Under One Roof</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                From construction to cleaning, we connect you with verified
                professionals for every property service you need.
              </p>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "No Brokerage",
                  "Verified Pros",
                  "Insured Work",
                  "Fast Response",
                ].map((chip, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs md:text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD93D]" />
                    {chip}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/service/all")}
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFEB3B] to-[#FF9800] text-[#00695C] font-bold hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-2"
                >
                  Explore Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate("/service/about")}
                  className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* RIGHT: Floating preview cards */}
            <div className="relative hidden lg:block">
              {/* Card 1: booking */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl mb-5 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD93D] to-[#FF9800] flex items-center justify-center text-2xl">
                    🧹
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">Deep Cleaning</div>
                    <div className="text-xs text-white/70">
                      Booking confirmed • Today 4:00 PM
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold border border-green-400/30">
                    ✓ Done
                  </div>
                </div>
              </div>

              {/* Card 2: pro info */}
              <div
                className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl mb-5 ml-12 animate-bounce-slow"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#26A69A] to-[#00695C] flex items-center justify-center text-white font-bold">
                    RK
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">Rajesh Kumar</div>
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <Star className="w-3 h-3 text-[#FFD93D] fill-[#FFD93D]" />
                      4.9 • 240 jobs • 5 yrs
                    </div>
                  </div>
                  <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                    <Phone className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Card 3: rating */}
              <div
                className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl animate-bounce-slow"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/70 mb-1">
                      Overall Rating
                    </div>
                    <div className="text-3xl font-bold text-white">4.9</div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 text-[#FFD93D] fill-[#FFD93D]"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF9800] flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent" />
      </section>

      {/* ==================== STATS ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-5 shadow-xl border border-gray-100 text-center hover:scale-105 hover:shadow-2xl transition-all duration-500"
            >
              <div
                className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
              >
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-[#00695C]">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#00695C]" />
            <span className="text-sm font-medium text-[#00695C]">
              Our Services
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Popular Services
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Choose from our wide range of professional services designed to make
            your life easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate("/service/all")}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${service.color}, transparent)`,
                }}
              />

              {/* Top color accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                style={{ backgroundColor: service.color }}
              />

              <div className="relative z-10">
                {/* Icon + Rating */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    {service.icon}
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
                    <Star className="w-3 h-3 text-[#FFD93D] fill-[#FFD93D]" />
                    <span className="text-xs font-semibold text-gray-700">
                      {service.rating}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#00695C] transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                {/* Footer: price + jobs + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-400">
                      {service.jobs} bookings
                    </div>
                    <div className="text-sm font-bold text-[#00695C]">
                      {service.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#00695C] font-semibold text-sm group-hover:gap-3 transition-all">
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/service/all")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00695C] text-white font-semibold hover:bg-[#004D40] transition-all duration-300 shadow-lg"
          >
            View All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="bg-[#F0FDF4] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#00695C] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#26A69A] blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-4 shadow-sm border border-gray-100">
              <Zap className="w-4 h-4 text-[#FF9800]" />
              <span className="text-sm font-medium text-[#00695C]">
                Simple Process
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Get your property service done in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#FFD93D] rounded-full" />

            {steps.map((step, i) => (
              <div
                key={i}
                onMouseEnter={() => setActiveStep(i)}
                className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-500 cursor-pointer ${
                  activeStep === i
                    ? "border-[#26A69A] shadow-2xl -translate-y-2"
                    : "border-gray-100 hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {/* Icon circle */}
                <div
                  className={`relative w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 transition-all duration-500 ${
                    activeStep === i
                      ? "bg-gradient-to-br from-[#00695C] to-[#26A69A] scale-110 shadow-lg"
                      : "bg-[#E8F5E9]"
                  }`}
                >
                  <span
                    className={`transition-transform duration-500 ${
                      activeStep === i ? "scale-110" : ""
                    }`}
                  >
                    {step.icon}
                  </span>

                  {/* Number badge */}
                  <div
                    className={`absolute -top-1 -right-1 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-500 ${
                      activeStep === i
                        ? "bg-[#FFD93D] text-[#00695C] scale-110"
                        : "bg-white text-[#00695C] border-2 border-[#E8F5E9]"
                    }`}
                  >
                    {step.num}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text + Features */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-full mb-4">
              <ShieldCheck className="w-4 h-4 text-[#00695C]" />
              <span className="text-sm font-medium text-[#00695C]">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              Trusted by Thousands,{" "}
              <span className="text-[#00695C]">Loved by All</span>
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We don't just provide services — we build trust. Here's what makes
              Eliteinova different.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group p-4 rounded-xl bg-white border border-gray-100 hover:border-[#26A69A]/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <div className="font-bold text-gray-800 mb-1 text-sm">
                    {f.title}
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Testimonial / Image block */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#00695C]/10 via-[#26A69A]/10 to-[#FFD93D]/10 rounded-3xl blur-2xl" />

            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              {/* Quote icon */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg mb-6">
                <Quote className="w-6 h-6 text-white" />
              </div>

              <p className="text-lg text-gray-700 italic leading-relaxed mb-6">
                "Eliteinova Services transformed how we handle property
                maintenance. Reliable professionals, transparent pricing, and
                outstanding support — exactly what we needed."
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FF9800] flex items-center justify-center text-white font-bold text-xl">
                  R
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">Rajesh Kumar</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Property Owner, Chennai
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#FFD93D] fill-[#FFD93D]"
                    />
                  ))}
                </div>
              </div>

              {/* Small floating card */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex items-center gap-2 animate-bounce-slow">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    Job Completed
                  </div>
                  <div className="text-[10px] text-gray-500">Just now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00695C] via-[#26A69A] to-[#004D40] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl">
          {/* Decorative blurs */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#FFD93D] blur-3xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#FFD93D]" />
              <span className="text-sm font-medium">Ready to Book?</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">
              Book a service today and experience the Eliteinova difference.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/service/all")}
                className="group px-8 py-4 rounded-xl bg-[#FFD93D] text-[#00695C] font-bold hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-2"
              >
                Book Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/service/about")}
                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Talk to Us
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { icon: <ShieldCheck className="w-4 h-4" />, text: "Verified Pros" },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: "Quality Guaranteed" },
                { icon: <Clock className="w-4 h-4" />, text: "24/7 Support" },
                { icon: <TrendingUp className="w-4 h-4" />, text: "Best Prices" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <span className="text-[#FFD93D]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
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

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default HomePage;