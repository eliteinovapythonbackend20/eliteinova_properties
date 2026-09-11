// src/pages/loan/LoanPage.jsx
import React, { useState, useRef } from "react";
import {
  Home,
  Landmark,
  Building,
  Wallet,
  RefreshCw,
  TrendingUp,
  Globe,
  Home as HomeIcon,
  Trees,
  Building2,
  RefreshCcw,
  DollarSign,
  Users,
  ChevronRight,
  Shield,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Import your banner image - replace with your actual image path
import bannerImage from "../../assets/loanimage.jpg";

// Import loan images
import homeLoanImg from "../../assets/loanimage.jpg";
import constructionLoanImg from "../../assets/loanimage.jpg";
import renovationLoanImg from "../../assets/loanimage.jpg";
import plotLoanImg from "../../assets/loanimage.jpg";
import landPurchaseLoanImg from "../../assets/loanimage.jpg";
import commercialPropertyLoanImg from "../../assets/loanimage.jpg";
import commercialConstructionLoanImg from "../../assets/loanimage.jpg";
import loanAgainstPropertyImg from "../../assets/loanimage.jpg";
import topUpLoanImg from "../../assets/loanimage.jpg";
import balanceTransferImg from "../../assets/loanimage.jpg";
import rentalDiscountingImg from "../../assets/loanimage.jpg";
import nriLoanImg from "../../assets/loanimage.jpg";

const LoanPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const loansListRef = useRef(null);

  const goToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    loansListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Loan categories with their types
  const loanCategories = [
    {
      id: "residential",
      icon: <HomeIcon className="w-5 h-5" />,
      title: "Residential",
      emoji: "🏠",
      description: "Loans for buying, building, or renovating your dream home",
      accent: "#1B5E20",
      loans: [
        {
          id: "home-loan",
          title: "Home Loan",
          description: "Buy a new house or flat, purchase a resale property, or construct a house on your own plot",
          icon: <Home className="w-5 h-5" />,
          image: homeLoanImg,
          features: [
            "Buy a new house or flat",
            "Purchase a resale property",
            "Construct a house on your own plot",
          ],
        },
        {
          id: "construction-loan",
          title: "Home Construction Loan",
          description: "For constructing a house on land you already own. The loan may be released in stages based on construction progress.",
          icon: <Building className="w-5 h-5" />,
          image: constructionLoanImg,
          features: [
            "Construct on own land",
            "Stage-wise disbursement",
            "Based on construction progress",
          ],
        },
        {
          id: "renovation-loan",
          title: "Home Renovation / Improvement Loan",
          description: "For house renovation, repairs, extension, kitchen/bathroom upgrades, and structural improvements",
          icon: <Building2 className="w-5 h-5" />,
          image: renovationLoanImg,
          features: [
            "House renovation & repairs",
            "Kitchen/bathroom upgrades",
            "Structural improvements",
          ],
        },
      ],
    },
    {
      id: "land",
      icon: <Trees className="w-5 h-5" />,
      title: "Land",
      emoji: "🌳",
      description: "Purchase residential plots or land for future development",
      accent: "#558B2F",
      loans: [
        {
          id: "plot-loan",
          title: "Plot / Land Loan",
          description: "Used to purchase a residential plot or land for future house construction.",
          icon: <Trees className="w-5 h-5" />,
          image: plotLoanImg,
          features: [
            "Buy residential plot",
            "Future house construction",
            "Investment in land",
          ],
        },
        {
          id: "land-purchase-loan",
          title: "Land Purchase Loan",
          description: "Financing specifically for purchasing an existing residential or commercial property.",
          icon: <Landmark className="w-5 h-5" />,
          image: landPurchaseLoanImg,
          features: [
            "Purchase residential property",
            "Purchase commercial property",
            "Flexible repayment terms",
          ],
        },
      ],
    },
    {
      id: "commercial",
      icon: <Building2 className="w-5 h-5" />,
      title: "Commercial",
      emoji: "🏢",
      description: "Finance for shops, offices, showrooms, and commercial buildings",
      accent: "#2E7D32",
      loans: [
        {
          id: "commercial-property-loan",
          title: "Commercial Property Loan",
          description: "Used to purchase commercial properties such as shops, offices, showrooms, and commercial buildings.",
          icon: <Building2 className="w-5 h-5" />,
          image: commercialPropertyLoanImg,
          features: [
            "Buy shops & offices",
            "Purchase showrooms",
            "Acquire commercial buildings",
          ],
        },
        {
          id: "commercial-construction-loan",
          title: "Commercial Property Construction Loan",
          description: "For constructing a commercial building, office, shop complex, warehouse, etc.",
          icon: <Building className="w-5 h-5" />,
          image: commercialConstructionLoanImg,
          features: [
            "Construct office buildings",
            "Build shop complexes",
            "Warehouse construction",
          ],
        },
      ],
    },
    {
      id: "property-finance",
      icon: <DollarSign className="w-5 h-5" />,
      title: "Property Finance",
      emoji: "💰",
      description: "Leverage your existing property for various financial needs",
      accent: "#00897B",
      loans: [
        {
          id: "loan-against-property",
          title: "Loan Against Property (LAP or Mortgage)",
          description: "You mortgage an existing residential or commercial property and receive funds. It can be used for business, education, medical expenses, or other needs.",
          icon: <Wallet className="w-5 h-5" />,
          image: loanAgainstPropertyImg,
          features: [
            "Business funding",
            "Education & medical expenses",
            "Any personal need",
          ],
        },
        {
          id: "top-up-loan",
          title: "Top-Up Loan on Property",
          description: "An additional loan taken on an existing home/property loan, subject to lender eligibility and property value.",
          icon: <TrendingUp className="w-5 h-5" />,
          image: topUpLoanImg,
          features: [
            "Additional funding",
            "Based on property value",
            "Subject to lender eligibility",
          ],
        },
      ],
    },
    {
      id: "loan-transfer",
      icon: <RefreshCcw className="w-5 h-5" />,
      title: "Loan Transfer",
      emoji: "🔄",
      description: "Transfer your existing loans for better rates and terms",
      accent: "#00695C",
      loans: [
        {
          id: "balance-transfer",
          title: "Balance Transfer / Property Loan Transfer",
          description: "Transfer an existing home or property loan from one lender to another, usually to obtain a lower interest rate or better terms.",
          icon: <RefreshCw className="w-5 h-5" />,
          image: balanceTransferImg,
          features: [
            "Lower interest rates",
            "Better terms & conditions",
            "Switch lenders easily",
          ],
        },
      ],
    },
    {
      id: "rental-income",
      icon: <Users className="w-5 h-5" />,
      title: "Rental Income",
      emoji: "🏘️",
      description: "Loans based on future rental income from your property",
      accent: "#33691E",
      loans: [
        {
          id: "rental-discounting",
          title: "Rental Discounting Loan",
          description: "A loan against future rental income from a commercial property. The lender considers the expected rental cash flow while determining eligibility.",
          icon: <Users className="w-5 h-5" />,
          image: rentalDiscountingImg,
          features: [
            "Against rental cash flow",
            "Commercial property only",
            "Based on expected income",
          ],
        },
      ],
    },
    {
      id: "nri",
      icon: <Globe className="w-5 h-5" />,
      title: "NRI",
      emoji: "🇮🇳",
      description: "Special property financing for Non-Resident Indians",
      accent: "#388E3C",
      loans: [
        {
          id: "nri-property-loan",
          title: "NRI Property Loan",
          description: "Property financing specifically designed for eligible Non-Resident Indians (NRIs) purchasing or constructing property in India.",
          icon: <Globe className="w-5 h-5" />,
          image: nriLoanImg,
          features: [
            "Purchase property in India",
            "Construct property",
            "Special NRI terms",
          ],
        },
      ],
    },
  ];

  // Category → loan type groupings, for the at-a-glance grid box below.
  const loanCategoryGrid = [
    {
      title: "Residential",
      icon: <HomeIcon className="w-5 h-5" />,
      loans: ["Home Loan", "Home Construction Loan", "Home Renovation Loan"],
    },
    {
      title: "Land",
      icon: <Trees className="w-5 h-5" />,
      loans: ["Plot / Land Loan", "Land Purchase Loan"],
    },
    {
      title: "Commercial",
      icon: <Building2 className="w-5 h-5" />,
      loans: ["Commercial Property Loan", "Commercial Construction Loan"],
    },
    {
      title: "Property Finance",
      icon: <DollarSign className="w-5 h-5" />,
      loans: ["Loan Against Property", "Top-Up Loan"],
    },
    {
      title: "Loan Transfer",
      icon: <RefreshCcw className="w-5 h-5" />,
      loans: ["Balance Transfer / Property Loan Transfer"],
    },
    {
      title: "Rental Income",
      icon: <Users className="w-5 h-5" />,
      loans: ["Rental Discounting Loan"],
    },
    {
      title: "NRI",
      icon: <Globe className="w-5 h-5" />,
      loans: ["NRI Property Loan"],
    },
  ];

  // Filter loans based on search and category
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

  // Get all loans for the "all" category view
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
        {/* Image column — same position on every card for a steady scan line */}
        <div className="relative h-48 md:h-full">
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

        {/* Content column */}
        <div className="flex flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accent}14`, color: accent }}
              >
                {loan.icon}
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
            {category.icon}
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

  return (
    <div className="min-h-screen bg-[#F6F8F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .loanpage-root { font-family: 'Inter', system-ui, sans-serif; }
        .loanpage-display { font-family: 'Fraunces', Georgia, serif; }
      `}</style>

      <div className="loanpage-root">
        {/* Hero */}
        <div
          className="relative"
          style={{
            backgroundImage: `linear-gradient(160deg, rgba(6,32,27,0.72), rgba(6,32,27,0.55)), url(${bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full mb-6 border border-white/15">
                <Shield className="w-3.5 h-3.5 text-[#A5D6A7]" />
                <span className="text-white text-xs font-medium tracking-wide">Trusted loan partners</span>
              </div>
              <h1 className="loanpage-display text-4xl md:text-5xl font-medium text-white leading-[1.1] mb-4">
                Find your perfect <span style={{ color: "#A5D6A7" }}>loan</span>
              </h1>
              <p className="text-base text-white/85 leading-relaxed max-w-lg">
                Competitive rates across every stage of property ownership — from your first plot to
                your next construction milestone.
              </p>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="-mt-7 relative z-10 bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-100 p-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeCategory === "all"
                    ? "bg-[#00695C] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                All loans
              </button>
              {loanCategories.map((category) => (
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
                  {category.icon}
                  <span>{category.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loans list */}
        <div ref={loansListRef} className="max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
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

        {/* Category overview */}
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="max-w-xl mb-10">
              <h2 className="loanpage-display text-2xl md:text-3xl font-medium text-gray-900 mb-2">
                Loans, grouped by what you need
              </h2>
              <p className="text-gray-500 text-sm">
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
                    className="group w-full text-left grid grid-cols-1 md:grid-cols-[2.5rem_12rem_1fr_1.25rem] items-center gap-x-5 gap-y-2 py-5 border-b border-gray-200 transition-colors duration-200 hover:bg-gray-50/80"
                  >
                    <span
                      className="hidden md:flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${accent}14`, color: accent }}
                    >
                      {category.icon}
                    </span>

                    <span className="flex items-center gap-3 md:contents">
                      <span
                        className="md:hidden flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${accent}14`, color: accent }}
                      >
                        {category.icon}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-base">{category.title}</h3>
                    </span>

                    <p className="text-sm text-gray-500 leading-relaxed pl-11 md:pl-0">
                      {category.loans.join(" · ")}
                    </p>

                    <ChevronRight className="hidden md:block w-4 h-4 text-gray-300 justify-self-end transition-all duration-200 group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex justify-center">
              <button className="px-6 py-2.5 bg-[#00695C] text-white font-medium rounded-full inline-flex items-center gap-2 text-sm transition-transform duration-200 hover:scale-[1.02]">
                Talk to a loan expert
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LoanPage;