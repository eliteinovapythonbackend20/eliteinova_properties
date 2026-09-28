import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const PlotLoanPage = () => (
  <LoanPageShell
    loanId="plot-loan"
    bannerImage={bannerImage}
    categoryLabel="Plot Loan"
    title="Plot Loan"
    subtitle="Buy land today, build tomorrow"
    description="Finance the purchase of a residential plot with a dedicated plot loan. Higher LTV than a home loan and the option to convert to a home loan when you start construction."
    icon="land"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "9.10% p.a." },
      { label: "Max LTV", value: "Up to 75%" },
      { label: "Lending partners", value: "9 verified" },
      { label: "Plot + construction", value: "Available" },
    ]}
  />
);

export default PlotLoanPage;