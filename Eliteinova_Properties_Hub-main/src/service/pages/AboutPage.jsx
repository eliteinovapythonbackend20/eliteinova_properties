// src/service/pages/AboutPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Clock,
  Globe2,
  ArrowRight,
  Star,
  Quote,
} from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  /* ---------------- DATA ---------------- */
  const stats = [
    {
      icon: <Users className="w-7 h-7" />,
      value: "10K+",
      label: "Happy Customers",
      gradient: "from-[#00695C] to-[#26A69A]",
      text: "text-white",
    },
    {
      icon: <Award className="w-7 h-7" />,
      value: "500+",
      label: "Verified Pros",
      gradient: "from-[#FFD93D] to-[#FF9800]",
      text: "text-[#00695C]",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      value: "98%",
      label: "Success Rate",
      gradient: "from-[#4ECDC4] to-[#26A69A]",
      text: "text-white",
    },
    {
      icon: <Globe2 className="w-7 h-7" />,
      value: "50+",
      label: "Cities Covered",
      gradient: "from-[#6C5CE7] to-[#4ECDC4]",
      text: "text-white",
    },
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Our Mission",
      description:
        "To simplify property services by connecting customers with trusted professionals at transparent prices.",
      color: "#00695C",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Our Vision",
      description:
        "To become India's most trusted platform for all property-related services — from construction to care.",
      color: "#26A69A",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Our Values",
      description:
        "Integrity, quality, transparency, and a customer-first approach in every single interaction.",
      color: "#FF9800",
    },
  ];

  const highlights = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Verified Professionals",
      text: "Every partner is background-checked and certified.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: "Quality Guaranteed",
      text: "100% satisfaction or we make it right.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "24/7 Support",
      text: "Round-the-clock customer assistance.",
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "End-to-End",
      text: "From planning to execution under one roof.",
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
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#00E5FF] blur-3xl -translate-x-1/2 -translate-y-1/2" />
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

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#FFD93D]" />
            <span className="text-sm font-medium">About Eliteinova Services</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            We Make Property Services
            <span className="block text-[#FFD93D]">Simple & Trustworthy</span>
          </h1>

          <p className="text-white/80 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            We're on a mission to make property services accessible, reliable, and
            affordable for everyone — from individual homeowners to large businesses.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["Verified Pros", "Transparent Pricing", "Quality First", "Fast Response"].map(
              (chip, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD93D]" />
                  {chip}
                </span>
              )
            )}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent" />
      </section>

      {/* ==================== STATS ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 md:p-6 ${stat.text} shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] cursor-default`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className={`text-xs md:text-sm ${stat.text === "text-white" ? "text-white/80" : "text-[#00695C]/80"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== OUR STORY ==================== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#00695C]" />
              <span className="text-sm font-medium text-[#00695C]">Our Story</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Built to Solve a{" "}
              <span className="text-[#00695C]">Real Problem</span>
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Eliteinova Services was born out of a simple idea: property services
                shouldn't be complicated. We saw homeowners and businesses struggling
                to find reliable professionals for construction, renovation, and
                maintenance work.
              </p>
              <p>
                So we built a platform that connects you with verified,
                background-checked professionals who deliver quality work at
                transparent prices — no hidden charges, no middlemen.
              </p>
              <p>
                Today, we serve thousands of customers across India, helping them
                transform and maintain their properties with confidence.
              </p>
            </div>

            {/* Mini highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-[#26A69A]/30 transition-all duration-300"
                >
                  <div className="p-2 rounded-lg bg-[#E8F5E9] text-[#00695C] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual illustration */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#00695C]/10 via-[#26A69A]/10 to-[#FFD93D]/10 rounded-3xl blur-2xl" />

            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-3 flex-1 h-6 rounded-md bg-gray-100" />
              </div>

              {/* Fake dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">Property Services</div>
                      <div className="text-xs text-gray-500">Live dashboard</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    ● Active
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {["12", "48", "9"].map((v, i) => (
                    <div key={i} className="bg-[#F0FDF4] rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-[#00695C]">{v}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {["Active", "Done", "Pending"][i]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                <div className="space-y-3 pt-2">
                  {[
                    { label: "Customer Satisfaction", width: "98%", color: "#00695C" },
                    { label: "On-time Delivery", width: "94%", color: "#26A69A" },
                    { label: "Verified Partners", width: "100%", color: "#FF9800" },
                  ].map((bar, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{bar.label}</span>
                        <span className="font-semibold">{bar.width}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: bar.width, backgroundColor: bar.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3 animate-bounce-slow">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FF9800] flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">4.9 / 5.0</div>
                <div className="text-[10px] text-gray-500">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VALUES ==================== */}
      <section className="bg-[#F0FDF4] py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#00695C] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#26A69A] blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-4 shadow-sm border border-gray-100">
              <Heart className="w-4 h-4 text-[#FF9800]" />
              <span className="text-sm font-medium text-[#00695C]">
                Our Core Values
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Drives Us
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our core values shape everything we do — from how we select partners
              to how we serve every customer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center overflow-hidden border border-gray-100"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                  style={{ backgroundColor: value.color }}
                />
                <div
                  className="absolute -inset-1 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500"
                  style={{ backgroundColor: value.color }}
                />

                <div className="relative">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${value.color}, ${value.color}cc)`,
                    }}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIAL ==================== */}
      <section className="bg-[#F0FDF4] py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed mt-4 mb-6">
              "Eliteinova Services transformed how we handle property maintenance.
              Reliable professionals, transparent pricing, and outstanding support —
              exactly what we needed."
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FF9800] flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-800">Rajesh Kumar</div>
                <div className="text-xs text-gray-500">Property Owner, Chennai</div>
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-[#FFD93D] fill-[#FFD93D]"
                />
              ))}
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
              <span className="text-sm font-medium">Get Started Today</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Join Our Growing Family
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto text-lg">
              Experience the Eliteinova difference — quality service, transparent
              pricing, and trusted professionals.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/service/all")}
                className="group px-8 py-4 rounded-xl bg-[#FFD93D] text-[#00695C] font-bold hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-2"
              >
                Explore Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/service")}
                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Back to Home
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

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AboutPage;