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
export const HOMEPAGE_HERO_EYEBROW = "Full-Stack Web Developer · Product Engineer";
export const HOMEPAGE_HERO_TITLE =
  "I build complete web products, from accessible interfaces to APIs, data workflows, and reliable delivery.";
export const HOMEPAGE_HERO_BODY =
  "Full-stack product engineer with 9+ years shipping React, Next.js, TypeScript, and Node.js applications across SaaS, analytics, and AI products. I combine deep frontend expertise with practical backend delivery, product judgment, and AI-assisted engineering.";
export const HOMEPAGE_HERO_LOCATION = "Based in Montreal, Quebec, Canada";
export const HOMEPAGE_HERO_PRIMARY_CTA_LABEL = "View selected work";
export const HOMEPAGE_HERO_PRIMARY_CTA_HREF = "/portfolio";
export const HOMEPAGE_HERO_SECONDARY_CTA_LABEL = "Discuss a role";
export const HOMEPAGE_HERO_SECONDARY_CTA_HREF = "/#contact";

export const HOMEPAGE_CASE_STUDIES_HEADING = "Selected Work";
export const HOMEPAGE_CASE_STUDIES_LEDE =
  "End-to-end product work across SaaS, design systems, enterprise analytics, and AI-assisted engineering.";
export const HOMEPAGE_CASE_STUDIES: HomepageCaseStudy[] = [
  {
    id: "ledgerguard",
    label: "Senior Product Engineer · 2026–Present",
    title: "LedgerGuard — Full-Stack AI Contract Intelligence",
    summary:
      "Designed and built a multi-tenant SaaS product across a Next.js frontend, Node.js/Fastify API, PostgreSQL, authentication, background workers, document processing, billing, Docker, and CI/CD.",
    supportingLine:
      "AI extraction is separated from deterministic, user-confirmed contract data through evidence-based human review.",
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
    title: "AlwaysGeeky Games — Design System & Product Workflows",
    summary:
      "Built a shared React and TypeScript design system used across four product surfaces, while shipping marketplace, authentication, product, and account workflows in Next.js.",
    supportingLine:
      "Improved accessibility, responsive behavior, API integration, testing standards, and AI-assisted development workflows.",
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
