import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const HomeLoanPage = () => (
  <LoanPageShell
    loanId="home-loan"
    bannerImage={bannerImage}
    categoryLabel="Home Loan"
    title="Home Loan"
    subtitle="Own your dream home with the best rates"
    description="Finance your first home, a resale property, or a self-construction project with competitive interest rates and flexible tenures from India's top lenders."
    icon="home"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "8.35% p.a." },
      { label: "Lending partners", value: "14 verified" },
      { label: "Max tenure", value: "30 years" },
      { label: "Approval speed", value: "24–48 hrs" },
    ]}
  />
);

export default HomeLoanPage;