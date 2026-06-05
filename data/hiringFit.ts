export interface HiringFitCard {
  id: string;
  title: string;
  body: string;
}

export const HIRING_FIT_HEADING = "What I bring to a team";

export const HIRING_FIT_LEDE =
  "Four areas where I add senior-level value: I turn ambiguous product work into reliable systems teams can ship, not just individual screens.";

export const HIRING_FIT_ROLE_STRIP = [
  "Senior Frontend Engineer",
  "Senior Product Engineer",
  "Frontend Platform Engineer",
  "Design Systems Engineer",
] as const;

export const HIRING_FIT_CARDS: HiringFitCard[] = [
  {
    id: "product-minded-frontend-ownership",
    title: "Product-minded frontend ownership",
    body: "Turns ambiguous workflows into clear, maintainable product surfaces.",
  },
  {
    id: "design-systems",
    title: "Design systems",
    body: "Builds reusable, accessible foundations that improve consistency and delivery speed.",
  },
  {
    id: "frontend-architecture",
    title: "Frontend architecture",
    body: "Designs typed state boundaries, async flows, performance strategies, and sustainable component structures.",
  },
  {
    id: "developer-experience",
    title: "Developer experience",
    body: "Improves tooling, documentation, review quality, testing, and release confidence.",
  },
];

export const HIRING_FIT_CTA_PRIMARY_LABEL = "View case studies";
export const HIRING_FIT_CTA_PRIMARY_HREF = "/portfolio";

export const HIRING_FIT_CTA_SECONDARY_LABEL = "Read engineering principles";
export const HIRING_FIT_CTA_SECONDARY_HREF = "/engineering-principles";
