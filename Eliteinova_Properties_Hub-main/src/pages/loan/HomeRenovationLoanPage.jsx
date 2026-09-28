import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const HomeRenovationLoanPage = () => (
  <LoanPageShell
    loanId="home-renovation-loan"
    bannerImage={bannerImage}
    categoryLabel="Home Renovation"
    title="Home Renovation Loan"
    subtitle="Give your home the upgrade it deserves"
    description="Fund your home makeover, interior renovation, or extension with flexible renovation loans. Quick approvals, minimal documentation, and no end-use restrictions."
    icon="renovation"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "9.25% p.a." },
      { label: "Max amount", value: "Up to ₹25 L" },
      { label: "Approval speed", value: "24 hrs" },
      { label: "End-use", value: "No restriction" },
    ]}
  />
);

export default HomeRenovationLoanPage;