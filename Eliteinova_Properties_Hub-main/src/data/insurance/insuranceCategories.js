// src/components/data/insurance/insuranceCategories.js

import homeInsuranceImg from "../../assets/homeinsurance.jpg";
import propertyInsuranceImg from "../../assets/homeinsurance.jpg";
import buildingInsuranceImg from "../../assets/homeinsurance.jpg";

export const insuranceCategories = [
  {
    id: "home-insurance",
    title: "Home Insurance",
    emoji: "🏠",
    icon: "home",
    accent: "#00695C",
    description: "Protect your home and belongings from unforeseen events.",
    image: homeInsuranceImg,
    features: [
      "Structure + contents cover",
      "Fire & natural calamity",
      "Theft & burglary protection",
    ],
  },
  {
    id: "property-insurance",
    title: "Property Insurance",
    emoji: "🏢",
    icon: "building",
    accent: "#6A1B9A",
    description: "Safeguard your property investments from risks.",
    image: propertyInsuranceImg,
    features: [
      "Fire & special perils",
      "Flood & storm cover",
      "Theft & vandalism",
    ],
  },
  {
    id: "building-insurance",
    title: "Building Insurance",
    emoji: "🏗️",
    icon: "building2",
    accent: "#E65100",
    description: "Coverage for structures at every stage of construction.",
    image: buildingInsuranceImg,
    features: [
      "Structure coverage",
      "Fire & calamity",
      "Structural damage",
    ],
  },
];

// Category grid shown at the bottom of the page
export const insuranceCategoryGrid = [
  {
    title: "Home Insurance",
    icon: "home",
    description: "Protect your home and belongings from unforeseen events.",
  },
  {
    title: "Property Insurance",
    icon: "building",
    description: "Safeguard your property investments from risks.",
  },
  {
    title: "Building Insurance",
    icon: "building2",
    description: "Coverage for structures at every stage of construction.",
  },
];
