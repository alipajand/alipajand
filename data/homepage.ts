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
  "I build web products end to end, with deep expertise in frontend architecture.";
export const HOMEPAGE_HERO_BODY =
  "I'm a Montreal-based software engineer with 9+ years building production web applications. My strongest background is React, TypeScript, Next.js, and frontend architecture. I've also built full-stack products using Node.js/Fastify, PostgreSQL, Redis/BullMQ, and Python workers. My work spans shared design systems at AlwaysGeeky Games, enterprise analytics at Emplifi, and independently developed products such as LedgerGuard.";
export const HOMEPAGE_HERO_LOCATION = "Based in Montreal, Quebec, Canada";
export const HOMEPAGE_HERO_PRIMARY_CTA_LABEL = "View engineering work";
export const HOMEPAGE_HERO_PRIMARY_CTA_HREF = "/portfolio";
export const HOMEPAGE_HERO_SECONDARY_CTA_LABEL = "Contact me";
export const HOMEPAGE_HERO_SECONDARY_CTA_HREF = "/#contact";

export const HOMEPAGE_CASE_STUDIES_HEADING =
  "Engineering work, from interfaces to backend systems.";
export const HOMEPAGE_CASE_STUDIES_LEDE =
  "Three projects show different parts of my experience: independent full-stack delivery, shared frontend architecture across products, and performance engineering in enterprise applications.";
export const HOMEPAGE_CASE_STUDIES: HomepageCaseStudy[] = [
  {
    id: "ledgerguard",
    label: "Independent product · 2026–Present",
    title: "LedgerGuard — Independent Full-Stack Product",
    summary:
      "Designed and developed a multi-tenant contract-intelligence application across Next.js, Node.js/Fastify, PostgreSQL, and queue-backed processing. Built the document ingestion and review workflow so AI-extracted information remains unconfirmed until a person reviews its source evidence.",
    tags: ["Next.js", "TypeScript", "Node.js", "Fastify", "PostgreSQL", "Redis/BullMQ", "Python"],
    href: "/portfolio/ledgerguard",
  },
  {
    id: "alwaysgeeky",
    label: "Senior Frontend Engineer · 2024–2026",
    title: "AlwaysGeeky Games — Shared Frontend Architecture",
    summary:
      "Owned a React and TypeScript component library used across four product surfaces. Built shared component APIs, documented conventions, supported adoption across engineering teams, and maintained quality through code review, accessibility standards, and CI checks.",
    tags: ["React", "Next.js", "TypeScript", "Storybook", "Accessibility", "CI/CD"],
    href: "/portfolio/alwaysgeeky",
  },
  {
    id: "emplifi",
    label: "Senior Frontend Engineer · 2022–2023",
    title: "Emplifi — Enterprise Analytics & Performance",
    summary:
      "Developed React and TypeScript analytics interfaces with D3.js for desktop and embedded environments. Profiled and optimized rendering behavior in mobile webviews, with measurable performance improvements, and contributed reusable components and engineering mentorship.",
    tags: ["React", "TypeScript", "D3.js", "Performance", "Accessibility"],
    href: "/portfolio/emplifi",
  },
];

export const HOMEPAGE_WRITING_HEADING = "Writing";

export const HOMEPAGE_DISPLAY_WORDS = ["Ali", "Pajand"] as const;

export const HOMEPAGE_PROOF_ARIA_LABEL = "At a glance";

export const HOME_STRATA_LAYERS = [
  { name: "Interface", stack: "React · Next.js · TypeScript" },
  { name: "Design system", stack: "Component APIs · a11y · Storybook" },
  { name: "API", stack: "Node.js · Fastify · REST and GraphQL" },
  { name: "Data", stack: "PostgreSQL · Prisma · auth" },
  { name: "Workers", stack: "Redis/BullMQ · background jobs" },
] as const;

export const HOMEPAGE_CAPABILITY_TICKER = [
  "Frontend engineering",
  "Full-stack product development",
  "Engineering quality",
  "Technical leadership",
] as const;

export const HOMEPAGE_TOOLING_TICKER = [
  "Deterministic rules",
  "Human review in charge",
  "CLIs · CI · MCP · editor plugins",
  "Checks you run, not assume",
] as const;

export const HOMEPAGE_ABOUT_EYEBROW = "[ About ]";

export const HOMEPAGE_ABOUT_LABELS = ["Start", "Scope", "Strength", "Leadership"] as const;

export const HOMEPAGE_ABOUT_PULL_INDEX = 2;

export const HOMEPAGE_CONTACT_EYEBROW = "[ Contact ]";

export const homepageCaseCount = (shown: number, total: number): string =>
  `${shown} of ${total} case studies`;

export const homepageToolCount = (shown: number, total: number): string =>
  `${shown} of ${total} tools`;

export const homepageCapabilityCount = (count: number): string => `${count} areas`;
