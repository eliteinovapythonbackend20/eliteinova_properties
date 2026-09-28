// src/pages/loan/LoanPageShell.jsx
import React, { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Users2,
  Wallet,
  Users,
  Building2,
  Landmark,
  Briefcase,
  Star,
  MapPin,
  Percent,
  Clock,
  Award,
} from "lucide-react";
import {
  loanProviders,
  defaultProviders,
} from "../../data/loan/loanCategories";
import { getIcon } from "../../data/loan/loanIcons.jsx";

/* ══════════════════════════════════════════════════════════════
   SINGLE PROVIDER CARD — used for every group
   ══════════════════════════════════════════════════════════════ */
const ProviderCard = ({ provider, accent, featured }) => (
  <div
    className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-white transition-all duration-500 hover:-translate-y-0.5 group"
    style={{ boxShadow: "0 1px 2px rgba(16,36,31,0.04), 0 0 0 1px rgba(16,36,31,0.06)" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = `0 1px 2px rgba(16,36,31,0.04), 0 0 0 1px ${accent}33, 0 24px 48px -20px rgba(16,36,31,0.30)`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow =
        "0 1px 2px rgba(16,36,31,0.04), 0 0 0 1px rgba(16,36,31,0.06)";
    }}
  >
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
      {/* LEFT: image panel */}
      <div className="relative h-40 md:h-auto md:min-h-[280px] overflow-hidden">
        <img
          src={
            provider.image ||
            "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80"
          }
          alt={provider.institution}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
        />

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${accent}99 0%, rgba(11,59,51,0.15) 35%, rgba(11,59,51,0.75) 78%, rgba(11,59,51,0.94) 100%)`,
          }}
        />

        <div
          className="absolute -right-16 -top-16 w-44 h-44 rounded-full opacity-30 pointer-events-none mix-blend-screen"
          style={{ background: "radial-gradient(circle, #C9A227 0%, transparent 70%)" }}
        />

        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {featured ? (
          <div
            className="absolute top-3 md:top-4 left-3 md:left-4 z-10 flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg backdrop-blur-sm"
            style={{ background: "linear-gradient(135deg, #E4C661, #C9A227)" }}
          >
            <Award className="w-3 h-3 text-[#10241F]" />
            <span className="text-[8px] md:text-[9px] font-bold tracking-[0.14em] uppercase text-[#10241F]">
              Top Rated
            </span>
          </div>
        ) : (
          <div className="absolute top-3 md:top-4 left-3 md:left-4 z-10 flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/60">
            <ShieldCheck className="w-3 h-3" style={{ color: accent }} />
            <span
              className="text-[8px] md:text-[9px] font-bold tracking-[0.14em] uppercase"
              style={{ color: accent }}
            >
              Verified
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/65 font-medium mb-1.5 md:mb-2">
            {provider.institutionType}
          </p>
          <h3 className="loanpage-display text-[19px] md:text-[24px] font-medium text-white leading-[1.15] mb-2 md:mb-3">
            {provider.institution}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3"
                  style={{
                    fill: i < Math.round(provider.rating) ? "#C9A227" : "transparent",
                    color:
                      i < Math.round(provider.rating)
                        ? "#C9A227"
                        : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-white">
              {provider.rating}
              <span className="text-white/50 font-normal ml-1">/ 5</span>
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: terms, highlights, contact, CTA */}
      <div className="p-4 md:p-7 flex flex-col">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 mb-5 md:mb-6">
          <div>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1 md:mb-1.5">
              Interest rate
            </p>
            <p className="text-[13px] md:text-[15px] font-semibold text-[#10241F] flex items-center gap-1">
              <Percent className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" style={{ color: accent }} />
              <span className="truncate">{provider.rateRange}</span>
            </p>
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1 md:mb-1.5">
              Processing fee
            </p>
            <p className="text-[13px] md:text-[15px] font-semibold text-[#10241F] truncate">
              {provider.processingFee}
            </p>
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1 md:mb-1.5">
              Max tenure
            </p>
            <p className="text-[13px] md:text-[15px] font-semibold text-[#10241F] flex items-center gap-1">
              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" style={{ color: accent }} />
              {provider.maxTenure}
            </p>
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1 md:mb-1.5">
              Location
            </p>
            <p className="text-[13px] md:text-[15px] font-semibold text-[#10241F] flex items-center gap-1">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" style={{ color: accent }} />
              <span className="truncate">{provider.city}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5 md:mb-6">
          {provider.highlights.map((h, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-medium text-[#3B4A41] rounded-full px-2 md:px-2.5 py-1"
              style={{ backgroundColor: `${accent}0D`, border: `1px solid ${accent}22` }}
            >
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: accent }} />
              {h}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 pt-4 md:pt-5 border-t border-[#EDF1EE]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
              style={{
                backgroundColor: `${accent}14`,
                color: accent,
                border: `1px solid ${accent}22`,
              }}
            >
              {provider.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] md:text-[10px] uppercase tracking-wide text-[#9AA79E] font-medium leading-none mb-1">
                Point of contact
              </p>
              <p className="text-[12px] md:text-[13px] text-[#3B4A41] font-semibold truncate">
                {provider.name}
                <span className="text-[#8A968F] font-normal"> · {provider.role}</span>
              </p>
            </div>
          </div>

          <button
            className="group/btn relative w-full sm:w-auto px-5 py-2.5 text-white text-[13px] font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] whitespace-nowrap flex-shrink-0 inline-flex items-center justify-center gap-1.5 overflow-hidden"
            style={{
              background: `linear-gradient(120deg, ${accent} 0%, #26A69A 100%)`,
              boxShadow: `0 10px 24px -12px ${accent}99`,
            }}
          >
            <span className="relative z-10">Connect with agent</span>
            <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN SHELL
   ══════════════════════════════════════════════════════════════ */
const LoanPageShell = ({
  loanId,
  bannerImage,
  title,
  description,
  accent = "#00695C",
  aboutTitle = "About this loan",
  aboutText,
  goodForTitle = "What it's good for",
  features = [],
  eligibility = [],
  documents = [],
  extras = null,
}) => {
  const navigate = useNavigate();
  const partnersRef = useRef(null);

  const [activePartnerGroup, setActivePartnerGroup] = useState("bankers");

  const providers = loanProviders[loanId] || defaultProviders;

  const partnerPool = useMemo(() => {
    const base = providers && providers.length ? providers : defaultProviders;
    const cycled = [];
    for (let i = 0; i < 12; i++) {
      const src = base[i % base.length];
      cycled.push({ ...src, id: `${src.id}-${i}` });
    }
    return cycled;
  }, [providers]);

  const groupedPartners = useMemo(
    () => ({
      bankers: partnerPool.slice(0, 3),
      corporate: partnerPool.slice(3, 6),
      dsa: partnerPool.slice(6, 9),
      others: partnerPool.slice(9, 12),
    }),
    [partnerPool]
  );

  const PARTNER_GROUPS = [
    {
      key: "bankers",
      label: "Bankers",
      icon: <Landmark className="w-4 h-4" />,
      count: groupedPartners.bankers.length,
    },
    {
      key: "corporate",
      label: "Corporate Banks",
      icon: <Building2 className="w-4 h-4" />,
      count: groupedPartners.corporate.length,
    },
    {
      key: "dsa",
      label: "DSA Agents",
      icon: <Users className="w-4 h-4" />,
      count: groupedPartners.dsa.length,
    },
    {
      key: "others",
      label: "Others",
      icon: <Briefcase className="w-4 h-4" />,
      count: groupedPartners.others.length,
    },
  ];

  const activeProviders = groupedPartners[activePartnerGroup] || providers;

  const scrollToPartners = () => {
    partnersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#F6F8F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .loanpage-root { font-family: 'Inter', system-ui, sans-serif; }
        .loanpage-display { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      <div className="loanpage-root">
        {/* ══════ BANNER ══════ */}
        {/* Minimal banner — heading, one-line description, CTA.
            Slightly taller than the last version for more breathing room. */}
        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage: bannerImage
              ? `linear-gradient(180deg, rgba(11,59,51,0.50) 0%, rgba(11,59,51,0.25) 45%, rgba(11,59,51,0.72) 100%), url(${bannerImage})`
              : `linear-gradient(150deg, ${accent} 0%, #0B3B33 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-5 md:px-6 pt-5 md:pt-10 pb-14 md:pb-20">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white transition-colors mb-6 md:mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to loans
            </button>

            <div className="max-w-3xl">
              <h1 className="loanpage-display text-[28px] leading-[1.15] md:text-4xl lg:text-5xl font-medium text-white mb-3 md:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {title}
              </h1>

              <p className="text-white/90 text-[13px] md:text-base leading-relaxed max-w-2xl mb-6 md:mb-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
                {description}
              </p>

              <button
                onClick={scrollToPartners}
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-white text-[13px] md:text-sm font-semibold rounded-full transition-transform duration-200 hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(120deg, ${accent}, #26A69A)`,
                  boxShadow: "0 10px 24px -12px rgba(0,0,0,0.55)",
                }}
              >
                View lending partners
                <ArrowRight className="w-4 h-4 rotate-90" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-[#F6F8F7] to-transparent" />
        </div>

        {/* ══════ PARTNER GROUP FILTER BUTTONS ══════ */}
        <div className="max-w-5xl mx-auto px-5 md:px-6 -mt-6 md:-mt-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mb-8 md:mb-10">
            {PARTNER_GROUPS.map((group) => {
              const active = activePartnerGroup === group.key;
              return (
                <button
                  key={group.key}
                  onClick={() => setActivePartnerGroup(group.key)}
                  className={`w-full inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 py-3 md:py-3.5 rounded-full text-[12px] md:text-[13px] font-semibold transition-all duration-300 border ${
                    active
                      ? "text-white shadow-lg border-transparent"
                      : "bg-white text-[#3B4A41] border-[#E3E9E4] hover:border-[#00695C]/40"
                  }`}
                  style={
                    active
                      ? {
                          background: `linear-gradient(120deg, ${accent} 0%, #26A69A 100%)`,
                          boxShadow: `0 10px 24px -12px ${accent}99`,
                        }
                      : undefined
                  }
                >
                  <span
                    className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: active
                        ? "rgba(255,255,255,0.2)"
                        : `${accent}14`,
                      color: active ? "#ffffff" : accent,
                    }}
                  >
                    {group.icon}
                  </span>
                  <span className="truncate">{group.label}</span>
                  <span
                    className={`hidden sm:inline text-[10px] md:text-[11px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#F3F6F4] text-[#6B7B70]"
                    }`}
                  >
                    {group.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════ CONTENT ══════ */}
        <div className="max-w-5xl mx-auto px-5 md:px-6 pb-12 md:pb-14">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 md:gap-12">
            <div>
              {aboutText && (
                <section className="mb-8 md:mb-10">
                  <h2 className="loanpage-display text-lg md:text-xl font-medium text-[#10241F] mb-2.5 md:mb-3">
                    {aboutTitle}
                  </h2>
                  <p className="text-[#3B4A41] text-[13px] md:text-sm leading-relaxed whitespace-pre-line">
                    {aboutText}
                  </p>
                </section>
              )}

              {features.length > 0 && (
                <section className="mb-8 md:mb-10">
                  <h2 className="loanpage-display text-lg md:text-xl font-medium text-[#10241F] mb-3 md:mb-4">
                    {goodForTitle}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                    {features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 text-[13px] md:text-sm text-[#3B4A41] bg-white rounded-xl px-3.5 md:px-4 py-2.5 md:py-3 border border-[#E3E9E4]"
                      >
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: accent }}
                        />
                        {feature}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {eligibility.length > 0 && (
                <section className="mb-8 md:mb-10">
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <Users2 className="w-4 h-4" style={{ color: accent }} />
                    <h2 className="loanpage-display text-lg md:text-xl font-medium text-[#10241F]">
                      Who can apply
                    </h2>
                  </div>
                  <ul className="flex flex-col gap-2 md:gap-2.5">
                    {eligibility.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[13px] md:text-sm text-[#3B4A41]"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: accent }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {documents.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <FileText className="w-4 h-4" style={{ color: accent }} />
                    <h2 className="loanpage-display text-lg md:text-xl font-medium text-[#10241F]">
                      Documents you'll need
                    </h2>
                  </div>
                  <ul className="flex flex-col gap-2 md:gap-2.5">
                    {documents.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[13px] md:text-sm text-[#3B4A41]"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: accent }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {extras}
            </div>
          </div>
        </div>

        {/* ══════ AGENT CARDS ══════ */}
        <div
          ref={partnersRef}
          className="max-w-5xl mx-auto px-5 md:px-6 pb-14 md:pb-16 scroll-mt-24"
        >
          <div className="flex items-start sm:items-center justify-between gap-3 md:gap-4 mb-5 md:mb-6">
            <div className="min-w-0">
              <h2 className="loanpage-display text-lg md:text-2xl font-medium text-[#10241F] mb-1">
                Choose your{" "}
                {PARTNER_GROUPS.find((g) => g.key === activePartnerGroup)?.label}
              </h2>
              <p className="text-[11px] md:text-xs text-[#8A968F] leading-relaxed">
                Every partner below is verified and processes{" "}
                {title.toLowerCase()} applications directly.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#6B7B70] flex-shrink-0">
              <ShieldCheck className="w-4 h-4" style={{ color: accent }} />
              <span>{activeProviders.length} partners</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-5">
            {activeProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                accent={accent}
                featured={
                  provider.rating ===
                  Math.max(...activeProviders.map((p) => p.rating))
                }
              />
            ))}
          </div>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white border border-[#EDF1EE] p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${accent}14`, color: accent }}
              >
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#10241F] leading-tight">
                  Not sure which one fits?
                </p>
                <p className="text-[11px] text-[#8A968F]">
                  Talk to a loan expert and get matched to the right partner.
                </p>
              </div>
            </div>
            <button
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-white text-[13px] font-semibold whitespace-nowrap transition-transform duration-300 hover:scale-[1.03]"
              style={{
                background: `linear-gradient(120deg, ${accent} 0%, #26A69A 100%)`,
                boxShadow: `0 10px 24px -12px ${accent}99`,
              }}
            >
              Talk to an expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPageShell;