import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const HomeConstructionLoanPage = () => (
  <LoanPageShell
    loanId="home-construction-loan"
    bannerImage={bannerImage}
    categoryLabel="Home Construction"
    title="Home Construction Loan"
    subtitle="Build the home you've always imagined"
    description="Finance the construction of your dream home on a plot you already own. Funds are released in stages based on construction progress, at home-loan interest rates."
    icon="construction"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "8.50% p.a." },
      { label: "Disbursement", value: "Staged" },
      { label: "Max tenure", value: "25 years" },
      { label: "Interest on", value: "Disbursed only" },
    ]}
  />
);

export default HomeConstructionLoanPage;