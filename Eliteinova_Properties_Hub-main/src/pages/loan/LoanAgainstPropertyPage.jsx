import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const LoanAgainstPropertyPage = () => (
  <LoanPageShell
    loanId="loan-against-property"
    bannerImage={bannerImage}
    categoryLabel="Loan Against Property"
    title="Loan Against Property"
    subtitle="Unlock the value of your property"
    description="Get a loan against your residential or commercial property at attractive interest rates. Higher loan amounts, longer tenures, and no end-use restrictions."
    icon="property"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "9.00% p.a." },
      { label: "Max amount", value: "Up to ₹10 Cr" },
      { label: "Max tenure", value: "20 years" },
      { label: "End-use", value: "No restriction" },
    ]}
  />
);

export default LoanAgainstPropertyPage;