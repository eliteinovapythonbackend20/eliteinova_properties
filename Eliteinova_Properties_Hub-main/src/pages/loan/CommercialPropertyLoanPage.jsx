import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const CommercialPropertyLoanPage = () => (
  <LoanPageShell
    loanId="commercial-property-loan"
    bannerImage={bannerImage}
    categoryLabel="Commercial Property"
    title="Commercial Property Loan"
    subtitle="Finance your business real estate"
    description="Purchase or refinance office space, retail shops, warehouses, or industrial property with competitive commercial property loans tailored to your business."
    icon="commercial"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "9.25% p.a." },
      { label: "Max LTV", value: "Up to 75%" },
      { label: "Max tenure", value: "15 years" },
      { label: "Min operations", value: "3 years" },
    ]}
  />
);

export default CommercialPropertyLoanPage;