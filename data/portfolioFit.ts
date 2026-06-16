export const PORTFOLIO_POSITIONING_PARAGRAPH =
  "I’m a Senior Product Engineer specializing in frontend architecture, design systems, and developer experience. These case studies focus on designing and shipping complex, reliable product workflows without sacrificing clarity, accessibility, or maintainability.";

export const PORTFOLIO_ROLE_FIT_ARIA_LABEL = "Portfolio role fit";

export const PORTFOLIO_ROLE_FIT_LABELS = [
  "Senior Product Engineer",
  "Complex product workflows",
  "Frontend architecture",
  "Design systems",
  "Product UI",
  "AI-assisted workflows",
  "Accessibility",
  "Developer experience",
  "React / Next.js / TypeScript",
] as const;

export const PORTFOLIO_LOOK_FOR_HEADING = "What to look for";

export const PORTFOLIO_LOOK_FOR_LEDE =
  "The work below is not only implementation. It highlights how I think through product states, visual hierarchy, design-system reuse, accessibility, performance, and the engineering boundaries that keep complex interfaces maintainable.";

export interface PortfolioLookForCard {
  title: string;
  body: string;
}

export const PORTFOLIO_LOOK_FOR_CARDS: PortfolioLookForCard[] = [
  {
    title: "Product UI from ambiguity",
    body: "I work from incomplete requirements and turn them into clear workflows, information hierarchy, responsive layouts, and production-ready React interfaces.",
  },
  {
    title: "Design systems that ship",
    body: "I build reusable component foundations, visual states, Storybook documentation, accessibility patterns, and design-to-code workflows that help teams move faster without creating UI drift.",
  },
  {
    title: "Complex frontend states",
    body: "I design and implement loading, empty, error, validation, confidence, partial-data, and review-required states for data-heavy and AI-assisted product experiences.",
  },
  {
    title: "Frontend quality and ownership",
    body: "I own work from problem definition through UX decisions, implementation, testing, release, production behavior, and iteration.",
  },
];

export const PORTFOLIO_META_TITLE = "Product Engineering Case Studies — Ali Pajand";

export const PORTFOLIO_META_DESCRIPTION =
  "Case studies covering product engineering, frontend architecture, design systems, complex workflows, and AI-assisted interfaces.";
