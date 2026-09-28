import React from "react";
import LoanPageShell from "./LoanPageShell";
import bannerImage from "../../assets/loanimage.png";

const RentalDiscountingLoanPage = () => (
  <LoanPageShell
    loanId="rental-discounting-loan"
    bannerImage={bannerImage}
    categoryLabel="Rental Discounting"
    title="Rental Discounting Loan"
    subtitle="Turn future rent into today's capital"
    description="Get a lump-sum loan against the future rental income from your commercial property. Ideal for landlords looking to unlock liquidity without selling."
    icon="rental"
    accent="#00695C"
    metrics={[
      { label: "Starting rate", value: "8.75% p.a." },
      { label: "Min lease left", value: "3 years" },
      { label: "Structure", value: "Overdraft" },
      { label: "Property", value: "Commercial" },
    ]}
  />
);

export default RentalDiscountingLoanPage;