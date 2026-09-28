// src/components/data/loan/loanCategories.js

import bannerImage from "../../assets/loanimage.png";

const img = bannerImage;

export const loanCategories = [
  {
    id: "residential",
    icon: "HomeIcon",
    title: "Residential",
    emoji: "🏠",
    description: "Loans for buying, building, or renovating your dream home",
    accent: "#1B5E20",
    loans: [
      {
        id: "home-loan",
        title: "Home Loan",
        description:
          "Buy a new house or flat, purchase a resale property, or construct a house on your own plot",
        icon: "Home",
        image: img,
        features: [
          "Buy a new house or flat",
          "Purchase a resale property",
          "Construct a house on your own plot",
        ],
      },
      {
        id: "construction-loan",
        title: "Home Construction Loan",
        description:
          "For constructing a house on land you already own. The loan may be released in stages based on construction progress.",
        icon: "Building",
        image: img,
        features: [
          "Construct on own land",
          "Stage-wise disbursement",
          "Based on construction progress",
        ],
      },
      {
        id: "renovation-loan",
        title: "Home Renovation / Improvement Loan",
        description:
          "For house renovation, repairs, extension, kitchen/bathroom upgrades, and structural improvements",
        icon: "Building2",
        image: img,
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
    icon: "Trees",
    title: "Land",
    emoji: "🌳",
    description: "Purchase residential plots or land for future development",
    accent: "#558B2F",
    loans: [
      {
        id: "plot-loan",
        title: "Plot / Land Loan",
        description:
          "Used to purchase a residential plot or land for future house construction.",
        icon: "Trees",
        image: img,
        features: [
          "Buy residential plot",
          "Future house construction",
          "Investment in land",
        ],
      },
      {
        id: "land-purchase-loan",
        title: "Land Purchase Loan",
        description:
          "Financing specifically for purchasing an existing residential or commercial property.",
        icon: "Landmark",
        image: img,
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
    icon: "Building2",
    title: "Commercial",
    emoji: "🏢",
    description: "Finance for shops, offices, showrooms, and commercial buildings",
    accent: "#2E7D32",
    loans: [
      {
        id: "commercial-property-loan",
        title: "Commercial Property Loan",
        description:
          "Used to purchase commercial properties such as shops, offices, showrooms, and commercial buildings.",
        icon: "Building2",
        image: img,
        features: [
          "Buy shops & offices",
          "Purchase showrooms",
          "Acquire commercial buildings",
        ],
      },
      {
        id: "commercial-construction-loan",
        title: "Commercial Property Construction Loan",
        description:
          "For constructing a commercial building, office, shop complex, warehouse, etc.",
        icon: "Building",
        image: img,
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
    icon: "DollarSign",
    title: "Property Finance",
    emoji: "💰",
    description: "Leverage your existing property for various financial needs",
    accent: "#00897B",
    loans: [
      {
        id: "loan-against-property",
        title: "Loan Against Property (LAP or Mortgage)",
        description:
          "You mortgage an existing residential or commercial property and receive funds. It can be used for business, education, medical expenses, or other needs.",
        icon: "Wallet",
        image: img,
        features: [
          "Business funding",
          "Education & medical expenses",
          "Any personal need",
        ],
      },
      {
        id: "top-up-loan",
        title: "Top-Up Loan on Property",
        description:
          "An additional loan taken on an existing home/property loan, subject to lender eligibility and property value.",
        icon: "TrendingUp",
        image: img,
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
    icon: "RefreshCcw",
    title: "Loan Transfer",
    emoji: "🔄",
    description: "Transfer your existing loans for better rates and terms",
    accent: "#00695C",
    loans: [
      {
        id: "balance-transfer",
        title: "Balance Transfer / Property Loan Transfer",
        description:
          "Transfer an existing home or property loan from one lender to another, usually to obtain a lower interest rate or better terms.",
        icon: "RefreshCw",
        image: img,
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
    icon: "Users",
    title: "Rental Income",
    emoji: "🏘️",
    description: "Loans based on future rental income from your property",
    accent: "#33691E",
    loans: [
      {
        id: "rental-discounting",
        title: "Rental Discounting Loan",
        description:
          "A loan against future rental income from a commercial property. The lender considers the expected rental cash flow while determining eligibility.",
        icon: "Users",
        image: img,
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
    icon: "Globe",
    title: "NRI",
    emoji: "🇮🇳",
    description: "Special property financing for Non-Resident Indians",
    accent: "#388E3C",
    loans: [
      {
        id: "nri-property-loan",
        title: "NRI Property Loan",
        description:
          "Property financing specifically designed for eligible Non-Resident Indians (NRIs) purchasing or constructing property in India.",
        icon: "Globe",
        image: img,
        features: [
          "Purchase property in India",
          "Construct property",
          "Special NRI terms",
        ],
      },
    ],
  },
];

// Category -> loan-type groupings for the "at a glance" grid on LoanPage.
// Derived from loanCategories so the two views can never drift apart.
export const loanCategoryGrid = loanCategories.map((category) => ({
  title: category.title,
  icon: category.icon,
  loans: category.loans.map((loan) => loan.title),
}));

// Flat lookup: loanId -> { ...loan, categoryId, categoryTitle, categoryEmoji, accent }
export const getLoanById = (loanId) => {
  for (const category of loanCategories) {
    const loan = category.loans.find((l) => l.id === loanId);

    if (loan) {
      return {
        ...loan,
        categoryId: category.id,
        categoryTitle: category.title,
        categoryEmoji: category.emoji,
        accent: category.accent,
      };
    }
  }

  return null;
};

export const loanProviders = {
  "home-loan": [
    {
      id: "p1",
      name: "Suresh Menon",
      institution: "Canara Bank",
      institutionType: "Public Sector Bank",
      rating: 4.7,
      city: "Chennai, Tamil Nadu",
      role: "Home Loan Manager",
      rateRange: "8.40% – 9.10%",
      processingFee: "0.35% of loan amount",
      maxTenure: "30 years",
      highlights: [
        "Doorstep documentation",
        "Fast-track approval for salaried",
        "No prepayment penalty",
      ],
    },
    {
      id: "p2",
      name: "Anitha Rajagopal",
      institution: "HDFC Bank",
      institutionType: "Private Bank",
      rating: 4.8,
      city: "Chennai, Tamil Nadu",
      role: "Senior Loan Officer",
      rateRange: "8.55% – 9.35%",
      processingFee: "0.50% of loan amount",
      maxTenure: "25 years",
      highlights: [
        "Digital approval in 48 hrs",
        "Balance transfer top-up available",
        "Dedicated relationship manager",
      ],
    },
    {
      id: "p3",
      name: "Karthik Iyer",
      institution: "LIC Housing Finance",
      institutionType: "Housing Finance Company",
      rating: 4.6,
      city: "Coimbatore, Tamil Nadu",
      role: "Branch Credit Head",
      rateRange: "8.65% – 9.50%",
      processingFee: "0.25% of loan amount",
      maxTenure: "30 years",
      highlights: [
        "Special rate for women co-applicants",
        "Flexible EMI holidays",
        "Pan-India processing",
      ],
    },
  ],
};

export const defaultProviders = [
  {
    id: "d1",
    name: "Vikram Nair",
    institution: "State Bank of India",
    institutionType: "Public Sector Bank",
    rating: 4.6,
    city: "Chennai, Tamil Nadu",
    role: "Loan Relationship Manager",
    rateRange: "8.45% – 9.20%",
    processingFee: "0.35% of loan amount",
    maxTenure: "20 years",
    highlights: [
      "Wide branch network",
      "Government scheme linkage",
      "Transparent fee structure",
    ],
  },
  {
    id: "d2",
    name: "Fathima Zohra",
    institution: "Axis Bank",
    institutionType: "Private Bank",
    rating: 4.7,
    city: "Chennai, Tamil Nadu",
    role: "Senior Credit Manager",
    rateRange: "8.60% – 9.40%",
    processingFee: "0.45% of loan amount",
    maxTenure: "20 years",
    highlights: [
      "Quick eligibility check",
      "Minimal paperwork",
      "Online tracking",
    ],
  },
  {
    id: "d3",
    name: "Ramesh Pillai",
    institution: "Bajaj Finserv",
    institutionType: "NBFC",
    rating: 4.5,
    city: "Coimbatore, Tamil Nadu",
    role: "Regional Loan Head",
    rateRange: "9.00% – 10.20%",
    processingFee: "0.60% of loan amount",
    maxTenure: "15 years",
    highlights: [
      "Same-day sanction letter",
      "Flexible eligibility norms",
      "Doorstep service",
    ],
  },
];
