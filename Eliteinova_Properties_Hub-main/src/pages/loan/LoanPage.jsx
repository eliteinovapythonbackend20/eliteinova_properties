// src/pages/loan/LoanPage.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Shield, CheckCircle, ArrowRight, X,
  User, Building2, Users2, Briefcase,
} from "lucide-react";
import { loanCategories, loanCategoryGrid } from "../../data/loan/loanCategories";
import { getIcon } from "../../data/loan/loanIcons";
import bannerImage from "../../assets/loanimage.png";
import {
  BankEmployeeRegistrationForm,
  DsaAgentRegistrationForm,
  NbfcEmployeeRegistrationForm,
  CorporateCompanyRegistrationForm,
} from "../../components/Forms/loans";

const LoanPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const loansListRef = useRef(null);
  const navigate = useNavigate();

  // ── Registration popups ──
  const [showAgentTypePopup, setShowAgentTypePopup] = useState(false);
  const [showBankEmployeeForm, setShowBankEmployeeForm] = useState(false);
  const [showDsaAgentForm, setShowDsaAgentForm] = useState(false);
  const [showCorporateForm, setShowCorporateForm] = useState(false);
  const [showNbfcForm, setShowNbfcForm] = useState(false);

  const openAgentPopup = () => setShowAgentTypePopup(true);

  const pickAgentType = (type) => {
    setShowAgentTypePopup(false);
    if (type === "bank") setShowBankEmployeeForm(true);
    else if (type === "dsa") setShowDsaAgentForm(true);
    else if (type === "corporate") setShowCorporateForm(true);
    else if (type === "nbfc") setShowNbfcForm(true);
  };

  const goToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    loansListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Apply now -> go to this loan's OWN detail page (/loans/home-loan,
  // /loans/plot-loan, ...). We still pass loan + category as router state
  // so the next page renders instantly; the URL alone is enough on refresh.
  const handleApplyNow = (loan, category) => {
    navigate(`/loans/${loan.id}`, { state: { loan, category } });
  };

  const filteredCategories = loanCategories
    .map((category) => ({
      ...category,
      loans: category.loans.filter(
        (loan) =>
          loan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loan.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        (activeCategory === "all" || category.id === activeCategory) &&
        category.loans.length > 0
    );

  const allLoans = loanCategories.flatMap((category) =>
    category.loans.map((loan) => ({
      ...loan,
      category: category.title,
      categoryId: category.id,
    }))
  );

  const displayLoans = activeCategory === "all" ? allLoans : filteredCategories[0]?.loans || [];

  const renderLoanCard = (loan, category) => {
    const accent = category.accent || "#00695C";

    return (
      <div
        key={loan.id}
        className="grid grid-cols-1 md:grid-cols-[220px_1fr] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="relative h-44 md:h-full">
          <img
            src={loan.image}
            alt={loan.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.style.background = `linear-gradient(135deg, ${accent}1A, ${accent}33)`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-base leading-snug">{loan.title}</h3>
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accent}14`, color: accent }}
              >
                {getIcon(loan.icon, { className: "w-5 h-5" })}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pt-1.5">{loan.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              {loan.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-gray-700 bg-gray-50 rounded-lg px-2.5 py-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button
              onClick={() => handleApplyNow(loan, category)}
              className="px-5 py-2 text-white font-medium rounded-full text-xs flex items-center gap-1.5 transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: `linear-gradient(120deg, ${accent}, #26A69A)` }}
            >
              Apply now
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCategorySection = (category) => {
    const filteredLoans = category.loans.filter(
      (loan) =>
        loan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredLoans.length === 0) return null;

    return (
      <section key={category.id} className="mb-14 last:mb-0">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${category.accent}14`, color: category.accent }}
          >
            {getIcon(category.icon, { className: "w-5 h-5" })}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {category.emoji} {category.title}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">{category.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredLoans.map((loan) => renderLoanCard(loan, category))}
        </div>
      </section>
    );
  };

  // Build the pills data once so both the desktop row and mobile marquee
  // render from the same source.
  const categoryPills = [
    { id: "all", title: "All loans", icon: null, accent: "#00695C" },
    ...loanCategories.map((c) => ({
      id: c.id,
      title: c.title,
      icon: c.icon,
      accent: c.accent,
    })),
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .loanpage-root { font-family: 'Inter', system-ui, sans-serif; }
        .loanpage-display { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      <div className="loanpage-root">
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
                  Trusted loan partners
                </span>
              </div>

              <h1 className="loanpage-display text-[28px] leading-[1.15] md:text-4xl md:leading-[1.1] lg:text-5xl font-medium text-white mb-3 md:mb-4">
                Find your perfect{" "}
                <span style={{ color: "#A5D6A7" }}>loan</span>
              </h1>

              <p className="text-[13px] md:text-base text-white/85 leading-relaxed max-w-lg">
                Competitive rates across every stage of property ownership — from your first plot to
                your next construction milestone.
              </p>
            </div>
          </div>
        </div>

        {/* ══════ CATEGORY PILLS + REGISTRATION BOX ══════ */}
        <div className="max-w-6xl mx-auto px-5 md:px-6">
          <div className="-mt-5 md:-mt-7 relative z-10 bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-100 p-3">
            {/* ── Desktop: normal row ── */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categoryPills.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                    activeCategory === category.id ? "text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={
                    activeCategory === category.id
                      ? { backgroundColor: category.accent }
                      : undefined
                  }
                >
                  {category.icon && getIcon(category.icon, { className: "w-5 h-5" })}
                  <span>{category.title}</span>
                </button>
              ))}
            </div>

            {/* ── Mobile: auto-scrolling marquee ── */}
            <div className="md:hidden overflow-hidden relative loan-marquee-mask">
              <div className="flex items-center gap-2 loan-marquee-track">
                {categoryPills.map((category, idx) => (
                  <button
                    key={`a-${category.id}-${idx}`}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                      activeCategory === category.id ? "text-white" : "text-gray-600"
                    }`}
                    style={
                      activeCategory === category.id
                        ? { backgroundColor: category.accent }
                        : { backgroundColor: "#F6F8F7" }
                    }
                  >
                    {category.icon && getIcon(category.icon, { className: "w-4 h-4" })}
                    <span>{category.title}</span>
                  </button>
                ))}
                {categoryPills.map((category, idx) => (
                  <button
                    key={`b-${category.id}-${idx}`}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                      activeCategory === category.id ? "text-white" : "text-gray-600"
                    }`}
                    style={
                      activeCategory === category.id
                        ? { backgroundColor: category.accent }
                        : { backgroundColor: "#F6F8F7" }
                    }
                    aria-hidden="true"
                  >
                    {category.icon && getIcon(category.icon, { className: "w-4 h-4" })}
                    <span>{category.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══════ LOAN REGISTRATION BOX ══════ */}
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
                  Become a loan partner
                </h3>
                <p className="text-[12px] md:text-[13px] text-[#6B7B70] leading-relaxed max-w-md">
                  Register as a bank employee, DSA agent, corporate partner, or NBFC employee to offer our loan products to your customers.
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

        <div ref={loansListRef} className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-12 scroll-mt-24">
          {activeCategory === "all"
            ? loanCategories.map((category) => renderCategorySection(category))
            : filteredCategories.map((category) => renderCategorySection(category))}

          {displayLoans.length === 0 && (
            <div className="text-center py-16">
              <h3 className="loanpage-display text-xl font-medium text-gray-800 mb-1">No loans found</h3>
              <p className="text-gray-500 text-sm">Try a different category or search term.</p>
            </div>
          )}
        </div>

        <div className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-5 md:px-6 py-12 md:py-16">
            <div className="max-w-xl mb-8 md:mb-10">
              <h2 className="loanpage-display text-xl md:text-3xl font-medium text-gray-900 mb-2">
                Loans, grouped by what you need
              </h2>
              <p className="text-gray-500 text-[13px] md:text-sm">
                Every loan we offer falls under one of these seven categories — pick one to jump straight to it.
              </p>
            </div>

            <div className="max-w-4xl border-t border-gray-200">
              {loanCategoryGrid.map((category, i) => {
                const accent = loanCategories[i]?.accent || "#00695C";
                const categoryId = loanCategories[i]?.id;
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
                        style={{ backgroundColor: `${accent}14`, color: accent }}
                      >
                        {getIcon(category.icon, { className: "w-5 h-5" })}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-[15px] md:text-base">
                        {category.title}
                      </h3>
                    </span>

                    <p className="text-[13px] md:text-sm text-gray-500 leading-relaxed pl-11 md:pl-0">
                      {category.loans.join(" · ")}
                    </p>

                    <ChevronRight className="hidden md:block w-4 h-4 text-gray-300 justify-self-end transition-all duration-200 group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 md:mt-10 flex justify-center">
              <button className="px-6 py-2.5 bg-[#00695C] text-white font-medium rounded-full inline-flex items-center gap-2 text-sm transition-transform duration-200 hover:scale-[1.02]">
                Talk to a loan expert
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ AGENT TYPE POPUP — 4 CATEGORIES (2×2 GRID) ══════ */}
      {showAgentTypePopup && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade"
          onClick={() => setShowAgentTypePopup(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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

            {/* Options — 2×2 grid */}
            <div className="p-4 md:p-6 grid grid-cols-2 gap-3 md:gap-4">
              {[
                {
                  key: "bank",
                  label: "Bank Employee",
                  desc: "Register as an employee of a bank or NBFC",
                  emoji: "🏛️",
                  color: "#00695C",
                  bg: "#E6F4F1",
                  border: "#B2DFDB",
                },
                {
                  key: "dsa",
                  label: "DSA Agent",
                  desc: "Register as a Direct Selling Agent or agency",
                  emoji: "💰",
                  color: "#6A1B9A",
                  bg: "#F5EBFA",
                  border: "#E1BEE7",
                },
                {
                  key: "corporate",
                  label: "Corporate Partner",
                  desc: "Register as a corporate loan partner",
                  emoji: "📄",
                  color: "#E65100",
                  bg: "#FFF3E0",
                  border: "#FFCC80",
                },
                {
                  key: "nbfc",
                  label: "NBFC Employee",
                  desc: "Register as an NBFC employee or agent",
                  emoji: "🏦",
                  color: "#0277BD",
                  bg: "#E1F0FA",
                  border: "#B3E5FC",
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

      {/* ══════ FORMS ══════ */}
      <BankEmployeeRegistrationForm
        isOpen={showBankEmployeeForm}
        onClose={() => setShowBankEmployeeForm(false)}
      />
      <DsaAgentRegistrationForm
        isOpen={showDsaAgentForm}
        onClose={() => setShowDsaAgentForm(false)}
      />
      <NbfcEmployeeRegistrationForm
        isOpen={showNbfcForm}
        onClose={() => setShowNbfcForm(false)}
      />
      <CorporateCompanyRegistrationForm
        isOpen={showCorporateForm}
        onClose={() => setShowCorporateForm(false)}
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── Mobile auto-scrolling category marquee ── */
        @keyframes loan-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .loan-marquee-track {
          animation: loan-marquee 28s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .loan-marquee-track:active {
          animation-play-state: paused;
        }
        .loan-marquee-mask {
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

export default LoanPage;