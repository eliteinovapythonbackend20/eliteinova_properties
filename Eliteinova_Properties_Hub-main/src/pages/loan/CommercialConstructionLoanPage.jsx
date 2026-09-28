import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const CommercialConstructionLoanPage = () => (
  <LoanPageShell
    loanId="commercial-construction-loan"
    bannerImage={bannerImage}
    categoryLabel="Commercial Construction"
    title="Commercial Construction Loan"
    subtitle="Build your business address"
    description="Fund the construction of office buildings, retail complexes, or industrial facilities on land you already own. Staged disbursement based on construction milestones."
    icon="construction"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "9.75% p.a." },
      { label: "Financing", value: "Up to 70%" },
      { label: "Moratorium", value: "During build" },
      { label: "Interest on", value: "Disbursed only" },
    ]}
  />
);

export default CommercialConstructionLoanPage;