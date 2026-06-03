export interface HiringFitCard {
  id: string;
  title: string;
  body: string;
}

export const HIRING_FIT_HEADING = "For teams hiring senior frontend and product engineering";

export const HIRING_FIT_LEDE =
  "I'm strongest in senior frontend roles with product-engineering scope: frontend architecture, design systems, complex product UI, accessibility, developer experience, and AI-assisted workflows. I do not only implement screens — I help teams turn ambiguous product work into reliable systems that ship.";

export const HIRING_FIT_ROLE_STRIP = [
  "Senior Frontend Engineer",
  "Senior Product Engineer",
  "Frontend Platform",
  "Design Systems",
  "AI Product UI",
] as const;

export const HIRING_FIT_CARDS: HiringFitCard[] = [
  {
    id: "frontend-architecture",
    title: "Frontend architecture",
    body: "I design React, TypeScript, and Next.js product surfaces around clear boundaries, typed contracts, honest loading/error states, and maintainable component structure. The goal is product UI that stays understandable as complexity grows.",
  },
  {
    id: "design-systems",
    title: "Design systems",
    body: "I build shared UI foundations that improve consistency, accessibility, and delivery speed: tokens, components, Storybook documentation, usage patterns, and review habits that help teams stop rebuilding the same interface decisions.",
  },
  {
    id: "ai-product-workflows",
    title: "AI product workflows",
    body: "I separate probabilistic AI behavior from deterministic product truth. For AI-assisted interfaces, I care about provenance, human review, confidence states, correction loops, and making sure the UI does not overstate what the system actually knows.",
  },
  {
    id: "developer-experience-quality",
    title: "Developer experience & quality",
    body: "I improve the path from idea to production with type safety, CI gates, test coverage, observability, docs, and editor tooling. Faster shipping should come from better feedback loops, not from ignoring reliability.",
  },
];

export const HIRING_FIT_CTA_PRIMARY_LABEL = "View case studies";
export const HIRING_FIT_CTA_PRIMARY_HREF = "/portfolio";

export const HIRING_FIT_CTA_SECONDARY_LABEL = "Read engineering principles";
export const HIRING_FIT_CTA_SECONDARY_HREF = "/engineering-principles";
