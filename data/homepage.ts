export interface HomepageCaseStudy {
  id: string;
  label: string;
  title: string;
  summary: string;
  supportingLine?: string;
  tags: string[];
  href: string;
}

export const HOMEPAGE_HERO_NAME = "Ali Pajand";
export const HOMEPAGE_HERO_EYEBROW = "Senior Software Engineer";
export const HOMEPAGE_HERO_TITLE =
  "I build product systems from the interface down: frontend architecture, design systems, and the APIs behind them.";
export const HOMEPAGE_HERO_BODY =
  "Nine-plus years building production web applications, most recently in React, TypeScript, and Next.js, mostly on SaaS, analytics, and marketplace products. I own frontend architecture and the standards around it: component APIs, accessibility, rendering performance, and review conventions, written up as design docs, taught through mentoring, and enforced in CI. When a product needs more than the interface, I build the Node.js APIs, data models, auth, and background workers behind it.";
export const HOMEPAGE_HERO_LOCATION = "Based in Montreal, Quebec, Canada";
export const HOMEPAGE_HERO_PRIMARY_CTA_LABEL = "View selected work";
export const HOMEPAGE_HERO_PRIMARY_CTA_HREF = "/portfolio";
export const HOMEPAGE_HERO_SECONDARY_CTA_LABEL = "Discuss a role";
export const HOMEPAGE_HERO_SECONDARY_CTA_HREF = "/#contact";

export const HOMEPAGE_CASE_STUDIES_HEADING = "Selected Work";
export const HOMEPAGE_CASE_STUDIES_LEDE =
  "Two projects that show the range: one product I own end to end, and one shared frontend system four product surfaces were built on.";
export const HOMEPAGE_CASE_STUDIES: HomepageCaseStudy[] = [
  {
    id: "ledgerguard",
    label: "Senior Product Engineer · 2026–Present",
    title: "LedgerGuard — Full-Stack AI Contract Intelligence",
    summary:
      "A multi-tenant contract-intelligence SaaS I designed and built alone: Next.js App Router product, Node.js/Fastify API, PostgreSQL data model, authentication, billing, and a queue-backed document pipeline.",
    supportingLine:
      "The hard part wasn't the model call. It was keeping probabilistic extraction from ever becoming confirmed contract data without a human reviewing the evidence.",
    tags: ["Next.js", "TypeScript", "Node.js", "Fastify", "PostgreSQL", "Redis/BullMQ", "AI"],
    href: "/portfolio/ledgerguard",
  },
  {
    id: "alwaysgeeky",
    label: "Senior Frontend Engineer · 2024–2026",
    title: "AlwaysGeeky Games — Shared Design System & Frontend Standards",
    summary:
      "Built and owned the React and TypeScript component library four product surfaces were built on, documented in Storybook, while shipping marketplace, authentication, and account workflows in Next.js.",
    supportingLine:
      "Component APIs, accessibility, TypeScript and code-review conventions, and CI gates that kept the four surfaces from drifting apart.",
    tags: ["React", "Next.js", "TypeScript", "Storybook", "GraphQL", "Accessibility"],
    href: "/portfolio/alwaysgeeky",
  },
];

export const HOMEPAGE_WRITING_HEADING = "Writing";

/** Display line under the navigation. The `<h1>` stays the positioning line above. */
export const HOMEPAGE_DISPLAY_WORDS = ["Ali", "Pajand"] as const;

export const HOMEPAGE_PROOF_ARIA_LABEL = "At a glance";

/** Layers drawn in the hero cross-section, top to bottom. */
export const HOME_STRATA_LAYERS = [
  { name: "Interface", stack: "React · Next.js · TypeScript" },
  { name: "Design system", stack: "Component APIs · a11y · Storybook" },
  { name: "API", stack: "Node.js · Fastify · REST and GraphQL" },
  { name: "Data", stack: "PostgreSQL · Prisma · auth" },
  { name: "Workers", stack: "Redis/BullMQ · background jobs" },
] as const;

/** Phrases in the ticker under the proof row: the five capability areas. */
export const HOMEPAGE_CAPABILITY_TICKER = [
  "Frontend architecture",
  "Design systems & UI engineering",
  "Full-stack & product systems",
  "Quality & developer experience",
  "Performance & observability",
] as const;

/** Phrases in the ticker above the open-source section. */
export const HOMEPAGE_TOOLING_TICKER = [
  "Deterministic rules",
  "Human review in charge",
  "CLIs · CI · MCP · editor plugins",
  "Checks you run, not assume",
] as const;

export const HOMEPAGE_ABOUT_EYEBROW = "[ About ]";

/** Labels above each About paragraph, in order. */
export const HOMEPAGE_ABOUT_LABELS = ["Start", "Scope", "Strength", "Leadership"] as const;

/** Index of the About paragraph repeated as the pull quote. */
export const HOMEPAGE_ABOUT_PULL_INDEX = 2;

export const HOMEPAGE_CONTACT_EYEBROW = "[ Contact ]";

export const homepageCaseCount = (shown: number, total: number): string =>
  `${shown} of ${total} case studies`;

export const homepageToolCount = (shown: number, total: number): string =>
  `${shown} of ${total} tools`;

export const homepageCapabilityCount = (count: number): string => `${count} areas`;
