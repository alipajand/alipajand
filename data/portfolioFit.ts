export const PORTFOLIO_POSITIONING_PARAGRAPH =
  "I’m a full-stack product engineer with deep frontend expertise. My best work connects accessible interfaces, APIs, data workflows, background processing, and reliable production delivery while preserving strong design-system and developer-experience practices.";

export const PORTFOLIO_ROLE_FIT_ARIA_LABEL = "Portfolio role fit";

export const PORTFOLIO_ROLE_FIT_LABELS = [
  "Full-Stack Product Engineer",
  "Senior Frontend Engineer",
  "React / Next.js / TypeScript",
  "Design systems",
  "Product UI",
  "Dashboards",
  "AI-assisted workflows",
  "Accessibility",
  "Performance",
  "Developer experience",
] as const;

export const PORTFOLIO_LOOK_FOR_HEADING = "What to look for";

export const PORTFOLIO_LOOK_FOR_LEDE =
  "The work below highlights how I think through product states, API and data boundaries, visual hierarchy, design-system reuse, accessibility, performance, and the engineering constraints that keep complete web products maintainable.";

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
    title: "Complex product states",
    body: "I design and implement loading, empty, error, validation, confidence, partial-data, and review-required states across data-heavy interfaces and their supporting APIs.",
  },
  {
    title: "End-to-end quality and ownership",
    body: "I own work from problem definition through UX decisions, implementation, testing, release, production behavior, and iteration.",
  },
];
