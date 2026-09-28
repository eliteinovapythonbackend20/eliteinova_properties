// src/pages/insurance/InsurancePage.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Shield, CheckCircle, ArrowRight, X,
  Users2, Briefcase,
} from "lucide-react";
import {
  insuranceCategories,
  insuranceCategoryGrid,
} from "../../data/insurance/insuranceCategories";
import { getIcon } from "../../data/insurance/insuranceIcons";
import bannerImage from "../../assets/insurance.png";

// ✅ Import the two registration forms
import BankInsurancePartnerRegistrationForm from "../../components/Forms/insurance/BankInsurancePartnerRegistrationForm";
import InsuranceAgentRegistrationForm from "../../components/Forms/insurance/InsuranceAgentRegistrationForm";

// ═══════════════════════════════════════════════
// 🎨 UNIFIED THEME COLOR — all cards use this
// ═══════════════════════════════════════════════
const THEME_ACCENT = "#00695C";

const InsurancePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef(null);
  const navigate = useNavigate();

  // ── Registration popups ──
  const [showAgentTypePopup, setShowAgentTypePopup] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showAgentForm, setShowAgentForm] = useState(false);

  const openAgentPopup = () => setShowAgentTypePopup(true);

  const pickAgentType = (type) => {
    setShowAgentTypePopup(false);
    if (type === "agent") setShowAgentForm(true);
    else if (type === "bank") setShowBankForm(true);
    // broker / corporate → wire to their own forms later
  };

  const goToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleApplyNow = (category) => {
    navigate(`/insurance/${category.id}`, { state: { category } });
  };

  const filteredCategories = insuranceCategories.filter((category) => {
    const matchesCategory =
      activeCategory === "all" || category.id === activeCategory;
    const matchesSearch =
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayCategories = filteredCategories;

  const renderInsuranceCard = (category) => {
    // ✅ Every card uses the same green accent now
    const accent = THEME_ACCENT;

    return (
      <div
        key={category.id}
        className="grid grid-cols-1 md:grid-cols-[220px_1fr] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="relative h-44 md:h-full">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.style.background = `linear-gradient(135deg, ${accent}1A, ${accent}33)`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-base leading-snug">
              {category.emoji} {category.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accent}14`, color: accent }}
              >
                {getIcon(category.icon, { className: "w-5 h-5" })}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pt-1.5">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {category.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-gray-700 bg-gray-50 rounded-lg px-2.5 py-2"
                >
                  <CheckCircle
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    style={{ color: accent }}
                  />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button
              onClick={() => handleApplyNow(category)}
              className="px-5 py-2 text-white font-medium rounded-full text-xs flex items-center gap-1.5 transition-transform duration-200 hover:scale-[1.03]"
              style={{
                background: `linear-gradient(120deg, ${accent}, #26A69A)`,
              }}
            >
              Get quote
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ All pills use the same green accent
  const categoryPills = [
    { id: "all", title: "All insurance", icon: null, accent: THEME_ACCENT },
    ...insuranceCategories.map((c) => ({
      id: c.id,
      title: c.title,
      icon: c.icon,
      accent: THEME_ACCENT,
    })),
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .insurancepage-root { font-family: 'Inter', system-ui, sans-serif; }
        .insurancepage-display { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      <div className="insurancepage-root">
        {/* ══════ BANNER ══════ */}
        <div
          className="relative"
          style={{
            backgroundImage: `linear-gradient(160deg, rgba(6,32,27,0.72), rgba(6,32,27,0.55)), url(${bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 md:px-3.5 py-1 md:py-1.5 rounded-full mb-4 md:mb-6 border border-white/15">
                <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#A5D6A7]" />
                <span className="text-white text-[10px] md:text-xs font-medium tracking-wide">
                  Trusted insurance partners
                </span>
              </div>

              <h1 className="insurancepage-display text-[28px] leading-[1.15] md:text-4xl md:leading-[1.1] lg:text-5xl font-medium text-white mb-3 md:mb-4">
                Protect what{" "}
                <span style={{ color: "#A5D6A7" }}>matters</span>
              </h1>

              <p className="text-[13px] md:text-base text-white/85 leading-relaxed max-w-lg">
                Comprehensive insurance plans for your home, property, and
                buildings — from trusted partners, at competitive premiums.
              </p>
            </div>
          </div>
        </div>

        {/* ══════ CATEGORY PILLS + REGISTRATION BOX ══════ */}
        <div className="max-w-6xl mx-auto px-5 md:px-6">
          <div className="-mt-5 md:-mt-7 relative z-10 bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-100 p-3">
            {/* Desktop row */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categoryPills.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={
                    activeCategory === category.id
                      ? { backgroundColor: category.accent }
                      : undefined
                  }
                >
                  {category.icon &&
                    getIcon(category.icon, { className: "w-5 h-5" })}
                  <span>{category.title}</span>
                </button>
              ))}
            </div>

            {/* Mobile marquee */}
            <div className="md:hidden overflow-hidden relative insurance-marquee-mask">
              <div className="flex items-center gap-2 insurance-marquee-track">
                {categoryPills.map((category, idx) => (
                  <button
                    key={`a-${category.id}-${idx}`}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                      activeCategory === category.id
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                    style={
                      activeCategory === category.id
                        ? { backgroundColor: category.accent }
                        : { backgroundColor: "#F6F8F7" }
                    }
                  >
                    {category.icon &&
                      getIcon(category.icon, { className: "w-4 h-4" })}
                    <span>{category.title}</span>
                  </button>
                ))}
                {categoryPills.map((category, idx) => (
                  <button
                    key={`b-${category.id}-${idx}`}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                      activeCategory === category.id
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                    style={
                      activeCategory === category.id
                        ? { backgroundColor: category.accent }
                        : { backgroundColor: "#F6F8F7" }
                    }
                    aria-hidden="true"
                  >
                    {category.icon &&
                      getIcon(category.icon, { className: "w-4 h-4" })}
                    <span>{category.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══════ INSURANCE PARTNER BOX ══════ */}
          <div className="mt-4 md:mt-5 rounded-2xl border border-[#E3E9E4] bg-white p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5 md:gap-4">
              <div
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#00695C14", color: "#00695C" }}
              >
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[14px] md:text-[15px] font-semibold text-[#10241F] leading-tight mb-1">
                  Become an insurance partner
                </h3>
                <p className="text-[12px] md:text-[13px] text-[#6B7B70] leading-relaxed max-w-md">
                  Register as an insurance agent, broker, or corporate partner
                  to offer our insurance products to your customers.
                </p>
              </div>
            </div>
            <button
              onClick={openAgentPopup}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-white text-[13px] font-semibold whitespace-nowrap transition-transform duration-300 hover:scale-[1.03] flex-shrink-0"
              style={{
                background: "linear-gradient(120deg, #00695C 0%, #26A69A 100%)",
                boxShadow: "0 10px 24px -12px #00695C99",
              }}
            >
              Registration Form
            </button>
          </div>
        </div>

        {/* ══════ MAIN CARDS ══════ */}
        <div
          ref={listRef}
          className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-12 scroll-mt-24"
        >
          <div className="grid grid-cols-1 gap-4">
            {displayCategories.map((category) =>
              renderInsuranceCard(category)
            )}
          </div>

          {displayCategories.length === 0 && (
            <div className="text-center py-16">
              <h3 className="insurancepage-display text-xl font-medium text-gray-800 mb-1">
                No insurance plans found
              </h3>
              <p className="text-gray-500 text-sm">
                Try a different category or search term.
              </p>
            </div>
          )}
        </div>

        {/* ══════ CATEGORY GRID ══════ */}
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-5 md:px-6 py-12 md:py-16">
            <div className="max-w-xl mb-8 md:mb-10">
              <h2 className="insurancepage-display text-xl md:text-3xl font-medium text-gray-900 mb-2">
                Insurance, grouped by what you need
              </h2>
              <p className="text-gray-500 text-[13px] md:text-sm">
                Pick a category to jump straight to it.
              </p>
            </div>

            <div className="max-w-4xl border-t border-gray-200">
              {insuranceCategoryGrid.map((category, i) => {
                // ✅ Same green accent for the grid too
                const accent = THEME_ACCENT;
                const categoryId = insuranceCategories[i]?.id;
                return (
                  <button
                    key={category.title}
                    onClick={() => goToCategory(categoryId)}
                    className="group w-full text-left grid grid-cols-1 md:grid-cols-[2.5rem_12rem_1fr_1.25rem] items-center gap-x-5 gap-y-2 py-4 md:py-5 border-b border-gray-200 transition-colors duration-200 hover:bg-gray-50/80"
                  >
                    <span
                      className="hidden md:flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${accent}14`, color: accent }}
                    >
                      {getIcon(category.icon, { className: "w-5 h-5" })}
                    </span>

                    <span className="flex items-center gap-3 md:contents">
                      <span
                        className="md:hidden flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${accent}14`,
                          color: accent,
                        }}
                      >
                        {getIcon(category.icon, { className: "w-5 h-5" })}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-[15px] md:text-base">
                        {category.title}
                      </h3>
                    </span>

                    <p className="text-[13px] md:text-sm text-gray-500 leading-relaxed pl-11 md:pl-0">
                      {category.description}
                    </p>

                    <ChevronRight className="hidden md:block w-4 h-4 text-gray-300 justify-self-end transition-all duration-200 group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 md:mt-10 flex justify-center">
              <button className="px-6 py-2.5 bg-[#00695C] text-white font-medium rounded-full inline-flex items-center gap-2 text-sm transition-transform duration-200 hover:scale-[1.02]">
                Talk to an insurance expert
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ PARTNER TYPE POPUP — 3 TYPES ONLY ══════ */}
      {showAgentTypePopup && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade"
          onClick={() => setShowAgentTypePopup(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 md:px-6 pt-5 md:pt-6 pb-1 flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <Users2 className="w-4 h-4 md:w-5 md:h-5 text-[#00695C] mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-[16px] md:text-[18px] font-bold text-[#10241F] leading-tight mb-1">
                    Choose your registration type
                  </h2>
                  <p className="text-[12px] md:text-[13px] text-[#8A968F]">
                    Select the category that best describes your role.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAgentTypePopup(false)}
                className="p-1.5 rounded-full hover:bg-[#F6F8F7] transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-[#8A968F]" />
              </button>
            </div>

            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {[
                {
                  key: "agent",
                  label: "Insurance Agent",
                  desc: "Register as a licensed insurance agent",
                  emoji: "🧑‍💼",
                  color: "#00695C",
                  bg: "#E6F4F1",
                  border: "#B2DFDB",
                },
                {
                  key: "bank",
                  label: "Bank Insurance Partner",
                  desc: "Register as a bank insurance partner",
                  emoji: "🏦",
                  color: "#6A1B9A",
                  bg: "#F5EBFA",
                  border: "#E1BEE7",
                },
                {
                  key: "broker",
                  label: "Corporate Partner",
                  desc: "Register as a corporate insurance partner",
                  emoji: "📄",
                  color: "#E65100",
                  bg: "#FFF3E0",
                  border: "#FFCC80",
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => pickAgentType(opt.key)}
                  className="group flex flex-col items-center text-center p-4 md:p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    backgroundColor: opt.bg,
                    borderColor: opt.border,
                  }}
                >
                  <div className="text-[28px] md:text-[32px] leading-none mb-2.5">
                    {opt.emoji}
                  </div>
                  <h3
                    className="text-[14px] md:text-[15px] font-bold mb-1 leading-tight"
                    style={{ color: opt.color }}
                  >
                    {opt.label}
                  </h3>
                  <p className="text-[10.5px] md:text-[11px] text-[#6B7B70] leading-snug">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════ REGISTRATION FORMS ══════ */}
      <BankInsurancePartnerRegistrationForm
        isOpen={showBankForm}
        onClose={() => setShowBankForm(false)}
      />
      <InsuranceAgentRegistrationForm
        isOpen={showAgentForm}
        onClose={() => setShowAgentForm(false)}
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes insurance-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .insurance-marquee-track {
          animation: insurance-marquee 28s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .insurance-marquee-track:active {
          animation-play-state: paused;
        }
        .insurance-marquee-mask {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 24px,
            #000 calc(100% - 24px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0,
            #000 24px,
            #000 calc(100% - 24px),
            transparent 100%
          );
        }

        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade {
          animation: fade 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InsurancePage; 