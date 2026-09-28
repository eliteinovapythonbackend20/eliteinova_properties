// src/pages/loan/loanShared.jsx
// Shared building blocks used by every per-loan page. Keeping the card,
// metric tile, and small helpers here means each loan page only has to
// define its own banner image, headline copy, and detail content.
import React from "react";
import {
  Star,
  MapPin,
  Percent,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Award,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   PROVIDER CARD
   ══════════════════════════════════════════════════════════════ */
export const ProviderCard = ({ provider, accent, featured }) => (
  <div
    className="relative rounded-3xl overflow-hidden bg-white transition-all duration-500 hover:-translate-y-0.5 group"
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
      <div className="relative min-h-[240px] md:min-h-[280px] overflow-hidden">
        <img
          src={provider.image || "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80"}
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
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
            style={{ background: "linear-gradient(135deg, #E4C661, #C9A227)" }}
          >
            <Award className="w-3 h-3 text-[#10241F]" />
            <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-[#10241F]">
              Top Rated
            </span>
          </div>
        ) : (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/60">
            <ShieldCheck className="w-3 h-3" style={{ color: accent }} />
            <span className="text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
              Verified
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/65 font-medium mb-2">
            {provider.institutionType}
          </p>
          <h3 className="loanpage-display text-[22px] md:text-[24px] font-medium text-white leading-[1.15] mb-3">
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
                    color: i < Math.round(provider.rating) ? "#C9A227" : "rgba(255,255,255,0.35)",
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

      <div className="p-6 md:p-7 flex flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-4 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1.5">
              Interest rate
            </p>
            <p className="text-[15px] font-semibold text-[#10241F] flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" style={{ color: accent }} />
              {provider.rateRange}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1.5">
              Processing fee
            </p>
            <p className="text-[15px] font-semibold text-[#10241F]">{provider.processingFee}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1.5">
              Max tenure
            </p>
            <p className="text-[15px] font-semibold text-[#10241F] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" style={{ color: accent }} />
              {provider.maxTenure}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1.5">
              Location
            </p>
            <p className="text-[15px] font-semibold text-[#10241F] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" style={{ color: accent }} />
              {provider.city}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {provider.highlights.map((h, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#3B4A41] rounded-full px-2.5 py-1"
              style={{ backgroundColor: `${accent}0D`, border: `1px solid ${accent}22` }}
            >
              <CheckCircle2 className="w-3 h-3" style={{ color: accent }} />
              {h}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-[#EDF1EE]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
              style={{
                backgroundColor: `${accent}14`,
                color: accent,
                border: `1px solid ${accent}22`,
              }}
            >
              {provider.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-[#9AA79E] font-medium leading-none mb-1">
                Point of contact
              </p>
              <p className="text-[13px] text-[#3B4A41] font-semibold truncate">
                {provider.name}
                <span className="text-[#8A968F] font-normal"> · {provider.role}</span>
              </p>
            </div>
          </div>

          <button
            className="group/btn relative px-5 py-2.5 text-white text-[13px] font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 overflow-hidden"
            style={{
              background: `linear-gradient(120deg, ${accent} 0%, #26A69A 100%)`,
              boxShadow: `0 10px 24px -12px ${accent}99`,
            }}
          >
            <span className="relative z-10">Connect with agent</span>
            <ArrowUpRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   METRIC TILE
   ══════════════════════════════════════════════════════════════ */
export const MetricTile = ({ icon, label, value, accent }) => (
  <div className="rounded-2xl bg-white border border-[#EDF1EE] p-4 flex items-start gap-3">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${accent}14`, color: accent }}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-[#9AA79E] font-medium mb-1">
        {label}
      </p>
      <p className="text-[15px] font-semibold text-[#10241F] leading-tight">{value}</p>
    </div>
  </div>
);