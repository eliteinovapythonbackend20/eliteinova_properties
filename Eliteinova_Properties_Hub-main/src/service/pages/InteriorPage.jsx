// src/service/pages/InteriorPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Star, Users, Clock } from "lucide-react";

const subcategories = [
  {
    id: 1,
    title: "Full Home Interior",
    description:
      "Complete home interiors including living, bedroom, kitchen, and more.",
    icon: "🏠",
    price: "From ₹1,299/sq.ft",
    projects: "240+",
  },
  {
    id: 2,
    title: "Modular Kitchen",
    description:
      "Custom modular kitchens with premium fittings and smart storage.",
    icon: "🍳",
    price: "From ₹1,20,000",
    projects: "380+",
  },
  {
    id: 3,
    title: "Wardrobe & Storage",
    description:
      "Sliding, hinged, and walk-in wardrobes with customized storage.",
    icon: "🚪",
    price: "From ₹55,000",
    projects: "520+",
  },
  {
    id: 4,
    title: "Living Room Design",
    description:
      "TV units, false ceilings, wall decor, and complete living space design.",
    icon: "🛋️",
    price: "From ₹85,000",
    projects: "310+",
  },
  {
    id: 5,
    title: "Office Interiors",
    description:
      "Corporate office interiors, workstations, cabins, and reception areas.",
    icon: "💼",
    price: "Custom Quote",
    projects: "140+",
  },
  {
    id: 6,
    title: "False Ceiling & Lighting",
    description:
      "Designer false ceilings with ambient, cove, and accent lighting.",
    icon: "💡",
    price: "From ₹75/sq.ft",
    projects: "400+",
  },
];

const InteriorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] via-white to-[#F0FDF4]">
      {/* ==================== BANNER ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00695C] via-[#26A69A] to-[#004D40] text-white">
        {/* Decorative blurs (brand colors only) */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#26A69A] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#00E5FF] blur-3xl" />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
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

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <button
            onClick={() => navigate("/service/all")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-sm font-medium mb-6 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/30">
              🎨
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 mb-2">
                <Sparkles className="w-3 h-3 text-[#FFD93D]" />
                <span className="text-xs font-medium">Interior</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold">
                Interior Design Services
              </h1>
            </div>
          </div>

          <p className="text-white/90 max-w-2xl text-lg">
            Transform your space with modern interior design — explore our
            subcategories.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: <Star className="w-3.5 h-3.5" />, text: "4.8 Rating" },
              { icon: <Users className="w-3.5 h-3.5" />, text: "95+ Pros" },
              { icon: <Clock className="w-3.5 h-3.5" />, text: "1 hr Response" },
            ].map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs md:text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
              >
                <span className="text-[#FFD93D]">{chip.icon}</span>
                {chip.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SUBCATEGORIES ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#00695C]" />
            <span className="text-sm font-medium text-[#00695C]">
              Subcategories
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Interior Subcategories
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Choose the interior design service you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((sub) => (
            <div
              key={sub.id}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 relative overflow-hidden cursor-pointer flex flex-col"
            >
              {/* Top accent bar — brand teal only */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] transition-all duration-500 group-hover:h-2" />

              <div className="relative z-10 flex flex-col flex-1">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-[#E8F5E9] group-hover:bg-gradient-to-br group-hover:from-[#00695C] group-hover:to-[#26A69A] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {sub.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#00695C] transition-colors">
                  {sub.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed flex-1">
                  {sub.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-400">
                      {sub.projects} projects
                    </div>
                    <div className="text-sm font-bold text-[#00695C]">
                      {sub.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#00695C] font-semibold text-sm group-hover:gap-2.5 transition-all">
                    Book
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
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

export default InteriorPage;