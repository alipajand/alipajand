export const PORTFOLIO_ROLE_FIT_ARIA_LABEL = "Portfolio role fit";

export const PORTFOLIO_ROLE_FIT_LABELS = [
  "Frontend architecture",
  "Technical direction",
  "React / Next.js / TypeScript",
  "Design systems",
  "Shared standards",
  "Mentoring",
  "Accessibility",
  "Rendering performance",
  "Node.js APIs & PostgreSQL",
  "Async & background workflows",
  "Developer experience",
] as const;

export const PORTFOLIO_LOOK_FOR_HEADING = "What to look for";

export const PORTFOLIO_LOOK_FOR_LEDE =
  "Four things run through the case studies below. If you're hiring for frontend architecture, technical direction, or end-to-end ownership, these are the parts worth reading closely.";

export interface PortfolioLookForCard {
  title: string;
  body: string;
}

export const PORTFOLIO_LOOK_FOR_CARDS: PortfolioLookForCard[] = [
  {
    title: "Architecture decisions, with their costs",
    body: "Each case study names the decision, why it was made, and what it cost. Component boundaries, client/server splits, deterministic versus probabilistic separation. The trade-offs are stated because that's the part worth interviewing me about.",
  },
  {
    title: "Systems other engineers build on",
    body: "Shared component libraries, typed API contracts, Storybook documentation, and CI gates, plus the part that makes them stick: design docs, migration paths with deprecation instead of abrupt removal, and working directly with the engineers adopting them.",
  },
  {
    title: "Complex product states",
    body: "Loading, empty, error, validation, partial data, low confidence, and review-required, designed as real states rather than afterthoughts. This is most of the work in data-heavy and AI-assisted interfaces.",
  },
  {
    title: "Ownership past the browser",
    body: "In my professional roles I worked through API contracts with the backend engineers who owned them. In independent products, LedgerGuard and TallyFolio, I built the API, the schema, the auth, and the queue behind the interface myself.",
  },
];
