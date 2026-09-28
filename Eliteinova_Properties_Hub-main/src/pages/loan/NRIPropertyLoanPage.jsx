import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const NRIPropertyLoanPage = () => (
  <LoanPageShell
    loanId="nri-property-loan"
    bannerImage={bannerImage}
    categoryLabel="NRI Property Loan"
    title="NRI Property Loan"
    subtitle="Invest in Indian property from anywhere"
    description="NRI-friendly home loans with competitive rates, simplified documentation, and expert guidance for purchasing property back in India."
    icon="nri"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "8.60% p.a." },
      { label: "Eligibility", value: "NRI / PIO" },
      { label: "Max LTV", value: "Up to 80%" },
      { label: "Lending partners", value: "7 verified" },
    ]}
  />
);

export default NRIPropertyLoanPage;