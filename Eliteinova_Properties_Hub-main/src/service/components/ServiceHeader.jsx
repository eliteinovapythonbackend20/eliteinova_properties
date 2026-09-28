// src/service/components/ServiceHeader.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, X, Home, Wrench, Info, Sparkles } from "lucide-react";
import logo from "../../assets/logo1.png";

const ServiceHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/service", icon: <Home className="w-4 h-4" /> },
    { name: "Services", path: "/service/all", icon: <Wrench className="w-4 h-4" /> },
    { name: "About", path: "/service/about", icon: <Info className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-gradient-to-r from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl shadow-2xl shadow-[#00695C]/20"
            : "bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C]"
        }`}
      >
        {/* Particle Background */}
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
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
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

        {/* Main Row */}
        <div className="h-[72px] md:h-[84px] w-full px-3 md:px-6 flex items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03] animate-sweep" />

          <div className="flex items-center justify-between w-full relative z-10">
            {/* LEFT: Mobile Menu Toggle + Logo + Brand */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
              </button>

              {/* Logo */}
              <div
                onClick={() => navigate("/service")}
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
                    style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}
                  />
                </div>
              </div>

              {/* Brand Name */}
              <div
                onClick={() => navigate("/service")}
                className="cursor-pointer group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#00FF88]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <h1
                  className="text-lg md:text-2xl lg:text-3xl font-light leading-tight relative tracking-wide"
                  style={{
                    fontFamily: "Pacifico, cursive",
                    color: "#E8F5E9",
                    textShadow: "0 2px 16px rgba(0, 229, 255, 0.2)",
                    fontWeight: 150,
                  }}
                >
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-500">
                    Eliteinova{" "}
                    <span className="text-[0.75em]">
                      Services (Vendor to Customer)
                    </span>
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

            {/* RIGHT: Back Button + Book a Service + Mobile Toggle */}
            <div className="flex items-center gap-1.5 md:gap-3">
              {/* Back to Properties */}
              <button
                onClick={() => navigate("/")}
                title="Back to Main Site"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Properties
              </button>

              {/* Book a Service CTA */}
              <Link
                to="/service/all"
                className="hidden md:block px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold text-[#00695C] bg-gradient-to-r from-[#FFEB3B] to-[#FF9800] hover:from-[#FFD54F] hover:to-[#FFA726] transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30"
              >
                Book a Service
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Second Row Nav (desktop) */}
        <nav className="hidden md:flex h-12 items-center relative bg-gradient-to-r from-[#004D40]/90 via-[#00796B]/90 to-[#004D40]/90 backdrop-blur-sm border-t border-white/5">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow" />
          </div>

          <div className="flex items-center h-full relative z-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`group relative px-5 h-full text-white font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden flex items-center gap-2 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-white/10 to-transparent"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="flex items-center gap-2 relative z-10">
                  {link.icon}
                  {link.name}
                </span>

                {isActive(link.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse-glow" />
                )}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[55] animate-fade"
          onClick={() => setMobileMenuOpen(false)}
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
                  <p className="text-white/50 text-[10px]">Service Portal</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <div className="px-4 pb-32 pt-4">
              {/* Back to Properties */}
              <button
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item flex items-center gap-2"
                style={{ animationDelay: "0ms" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Properties
              </button>

              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item flex items-center gap-2 ${
                    isActive(link.path) ? "text-[#FFD93D]" : ""
                  }`}
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <Link
                to="/service/all"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center mt-4 px-4 py-3 rounded-lg text-sm font-semibold text-[#00695C] bg-gradient-to-r from-[#FFEB3B] to-[#FF9800]"
              >
                Book a Service
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(15px) rotate(90deg); opacity: 0.5; }
          50% { transform: translateY(-12px) translateX(-12px) rotate(180deg); opacity: 0.7; }
          75% { transform: translateY(12px) translateX(18px) rotate(270deg); opacity: 0.3; }
        }
        .animate-float-particle { animation: float-particle 10s ease-in-out infinite; }

        @keyframes wave-slow {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(40px) scaleY(1.2); }
          100% { transform: translateX(80px) scaleY(1); }
        }
        .animate-wave-slow { animation: wave-slow 8s ease-in-out infinite; }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 3s linear infinite; }

        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-slow { animation: shimmer-slow 8s linear infinite; }

        @keyframes sweep {
          0%, 100% { background-position: 0% 50%; opacity: 0.3; }
          50% { background-position: 100% 50%; opacity: 0.6; }
        }
        .animate-sweep { background-size: 200% 200%; animation: sweep 4s ease infinite; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }

        @keyframes sparkle-glow {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        .animate-sparkle-glow { animation: sparkle-glow 2s ease-in-out infinite; }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-glow { animation: pulse-glow 1.5s ease-in-out infinite; }

        @keyframes slide-item {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-item { animation: slide-item 0.3s ease-out forwards; }

        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade { animation: fade 0.25s ease-out forwards; }

        @keyframes backdrop {
          from { backdrop-filter: blur(0); opacity: 0; }
          to { backdrop-filter: blur(10px); opacity: 1; }
        }
        .animate-backdrop { animation: backdrop 0.25s ease-out forwards; }

        @keyframes slide {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide { animation: slide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </>
  );
};

export default ServiceHeader;