export interface HomepageCaseStudy {
  id: string;
  label: string;
  title: string;
  summary: string;
  supportingLine?: string;
  tags: string[];
  href: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
    illustrative?: false;
  };
  illustrativeLabel?: string;
  illustrativeBody?: string;
}

export const HOMEPAGE_HERO_NAME = "Ali Pajand";
export const HOMEPAGE_HERO_EYEBROW = "Senior Product Engineer";
export const HOMEPAGE_HERO_TITLE =
  "I build product systems from the interface down: frontend architecture, design systems, and the APIs behind them.";
export const HOMEPAGE_HERO_BODY =
  "Nine-plus years in React, TypeScript, and Next.js, mostly on SaaS, analytics, and marketplace products. I own frontend architecture and the standards around it: component APIs, accessibility, rendering performance, and review conventions. When a product needs more than the interface, I build the Node.js APIs, data models, auth, and background workers behind it.";
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
    image: {
      src: "/portfolio-media/ledgerguard-dashboard.png",
      alt: "LedgerGuard dashboard showing contract status, renewal risk, and review workflows.",
      caption: "Product screenshot",
    },
  },
  {
    id: "alwaysgeeky",
    label: "Senior Frontend Engineer · 2024–2026",
    title: "AlwaysGeeky Games — Shared Design System & Frontend Standards",
    summary:
      "Helped build and maintain the React and TypeScript component library four product surfaces were built on, documented in Storybook, while shipping marketplace, authentication, and account workflows in Next.js.",
    supportingLine:
      "Component APIs, accessibility, TypeScript and code-review conventions, and CI gates that kept the four surfaces from drifting apart.",
    tags: ["React", "Next.js", "TypeScript", "Storybook", "GraphQL", "Accessibility"],
    href: "/portfolio/alwaysgeeky",
    image: {
      src: "/portfolio-media/alwaysgeeky-marketplace.png",
      alt: "AlwaysGeeky marketplace interface built on shared design-system components.",
      caption: "Marketplace surface",
    },
  },
];

export const HOMEPAGE_WRITING_HEADING = "Writing";
