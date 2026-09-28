import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const LandPurchaseLoanPage = () => (
  <LoanPageShell
    loanId="land-purchase-loan"
    bannerImage={bannerImage}
    categoryLabel="Land Purchase"
    title="Land Purchase Loan"
    subtitle="Invest in land with confidence"
    description="Finance the purchase of agricultural, commercial, or residential land with a dedicated land purchase loan. Competitive rates and flexible repayment options."
    icon="land"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "9.50% p.a." },
      { label: "Max LTV", value: "Up to 70%" },
      { label: "Land types", value: "3 accepted" },
      { label: "Lending partners", value: "8 verified" },
    ]}
  />
);

export default LandPurchaseLoanPage;