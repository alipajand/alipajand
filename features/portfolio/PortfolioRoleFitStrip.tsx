import { PORTFOLIO_ROLE_FIT_ARIA_LABEL, PORTFOLIO_ROLE_FIT_LABELS } from "data/portfolioFit";

export function PortfolioRoleFitStrip() {
  return (
    <ul
      aria-label={PORTFOLIO_ROLE_FIT_ARIA_LABEL}
      className="mt-6 flex flex-wrap gap-2 list-none p-0"
    >
      {PORTFOLIO_ROLE_FIT_LABELS.map((label) => (
        <li
          key={label}
          className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm text-foreground/90"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}
