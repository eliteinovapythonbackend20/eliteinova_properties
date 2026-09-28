import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const TopUpLoanPage = () => (
  <LoanPageShell
    loanId="top-up-loan"
    bannerImage={bannerImage}
    categoryLabel="Top-Up Loan"
    title="Top-Up Loan"
    subtitle="Extra funds on your existing loan"
    description="Borrow additional funds on top of your existing home loan at the same interest rate. No new collateral, minimal paperwork, and quick disbursement."
    icon="topup"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "8.60% p.a." },
      { label: "Max amount", value: "Up to ₹50 L" },
      { label: "Collateral", value: "Not required" },
      { label: "Approval speed", value: "48–72 hrs" },
    ]}
  />
);

export default TopUpLoanPage;