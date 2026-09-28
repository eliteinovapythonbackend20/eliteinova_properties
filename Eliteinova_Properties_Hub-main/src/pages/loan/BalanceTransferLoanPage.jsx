import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const BalanceTransferLoanPage = () => (
  <LoanPageShell
    loanId="balance-transfer-loan"
    bannerImage={bannerImage}
    categoryLabel="Balance Transfer"
    title="Loan Balance Transfer"
    subtitle="Lower your EMI with a smarter transfer"
    description="Move your existing home, plot, or LAP loan to a lender offering lower rates. Reduce your EMI, extend your tenure, or unlock a top-up on your existing property."
    icon="balance"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "8.30% p.a." },
      { label: "Typical savings", value: "0.5–1.5%" },
      { label: "Top-up", value: "Available" },
      { label: "Min EMIs paid", value: "12 months" },
    ]}
  />
);

export default BalanceTransferLoanPage;