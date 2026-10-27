import { PORTFOLIO_ROLE_FIT_ARIA_LABEL, PORTFOLIO_ROLE_FIT_LABELS } from "data/portfolioFit";

export function PortfolioRoleFitStrip() {
  return (
    <ul aria-label={PORTFOLIO_ROLE_FIT_ARIA_LABEL}>
      {PORTFOLIO_ROLE_FIT_LABELS.map((label) => (
        <li key={label}>{label}</li>
      ))}
    </ul>
  );
}
