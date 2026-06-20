export interface HomepageCaseStudy {
  id: string;
  label: string;
  title: string;
  summary: string;
  tags: [string, string, string];
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

export interface HomepageProofPoint {
  title: string;
  body: string;
}

export const HOMEPAGE_HERO_NAME = "Ali Pajand";
export const HOMEPAGE_HERO_EYEBROW = "Senior Frontend Engineer · Product Engineer · Design Systems";
export const HOMEPAGE_HERO_TITLE =
  "Senior frontend engineer building product-quality React, Next.js, and TypeScript interfaces.";
export const HOMEPAGE_HERO_BODY =
  "I work at the intersection of product and engineering — designing and shipping complex UI that stays usable, accessible, and reliable. 9+ years across SaaS products, enterprise dashboards, design systems, and AI-assisted workflows.";
export const HOMEPAGE_HERO_PRIMARY_CTA_LABEL = "View case studies";
export const HOMEPAGE_HERO_PRIMARY_CTA_HREF = "/portfolio";
export const HOMEPAGE_HERO_SECONDARY_CTA_LABEL = "Get in touch";
export const HOMEPAGE_HERO_SECONDARY_CTA_HREF = "/#contact";

export const HOMEPAGE_PROOF_POINTS: HomepageProofPoint[] = [
  {
    title: "Frontend Architecture",
    body: "React, Next.js App Router, TypeScript. Complex product workflows, state management, API contracts, and server/client component boundaries.",
  },
  {
    title: "Design Systems",
    body: "Shared component libraries with Storybook, design tokens, accessible component APIs, and consistent loading, error, and empty states across product surfaces.",
  },
  {
    title: "AI Product UI",
    body: "Human-in-the-loop review flows, async extraction states, and UI patterns that make the boundary between AI-suggested and user-confirmed data explicit.",
  },
  {
    title: "Dashboards & Performance",
    body: "D3.js data visualizations, rendering optimization, production error monitoring, and dashboard UX tuned for large datasets and embedded contexts.",
  },
];

export const HOMEPAGE_CASE_STUDIES_HEADING = "Selected Work";
export const HOMEPAGE_CASE_STUDIES_LEDE =
  "A recruiter-friendly preview of production work across AI-assisted workflows, design systems, enterprise dashboards, startup delivery, and developer tooling.";
export const HOMEPAGE_CASE_STUDIES: HomepageCaseStudy[] = [
  {
    id: "ledgerguard",
    label: "Senior Product Engineer · 2026–Present",
    title: "LedgerGuard — AI Contract Intelligence SaaS",
    summary:
      "AI-powered contract review platform built solo. Next.js App Router, TypeScript, tenant-aware dashboard flows, human-in-the-loop review UI, and async AI extraction states.",
    tags: ["Next.js App Router", "AI review UI", "TypeScript"],
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
      "Shared React component library, Storybook documentation, accessibility improvements, and CI quality automation across a consumer game marketplace.",
    tags: ["Storybook", "Accessibility", "Marketplace UI"],
    href: "/portfolio/alwaysgeeky",
    image: {
      src: "/portfolio-media/alwaysgeeky-marketplace.png",
      alt: "AlwaysGeeky marketplace interface built on shared design-system components.",
      caption: "Marketplace surface",
    },
  },
  // {
  //   id: "emplifi",
  //   label: "Senior Frontend Engineer · 2022–2023",
  //   title: "Emplifi — Enterprise Analytics Dashboards",
  //   summary:
  //     "D3.js dashboard modules for enterprise analytics data. Rendering optimization across desktop and mobile webview contexts, with production UX monitoring through Sentry and Hotjar.",
  //   tags: ["D3.js", "Performance", "Analytics dashboards"],
  //   href: "/portfolio/emplifi",
  //   illustrativeLabel: "Dashboard engineering",
  //   illustrativeBody:
  //     "Metric-heavy dashboard views, chart interactions, and performance tuning for embedded and mobile webview contexts.",
  // },
  // {
  //   id: "controltech",
  //   label: "Frontend Engineer · 2018–2022",
  //   title: "ControlTech — Startup Studio Frontend Delivery",
  //   summary:
  //     "PWAs, dashboards, and workflow-heavy tools across multiple early-stage SaaS products. Test automation and CI/CD from MVP through production.",
  //   tags: ["PWA", "Testing", "CI/CD"],
  //   href: "/portfolio/controltech",
  //   illustrativeLabel: "Startup delivery",
  //   illustrativeBody:
  //     "Workflow-heavy frontend delivery across multiple products with validation, async state handling, and release quality checks.",
  // },
  // {
  //   id: "agent-tooling",
  //   label: "Independent · Ongoing",
  //   title: "Agent Tooling & Open Source",
  //   summary:
  //     "Tooling for AI coding agent readiness, PR review automation, and developer experience.",
  //   tags: ["Developer experience", "AI tooling", "Automation"],
  //   href: "/portfolio/agent-tooling",
  //   illustrativeLabel: "Tooling & DX",
  //   illustrativeBody:
  //     "Small, focused tools for agent context quality, structured PR feedback, and repository readiness.",
  // },
];

export const HOMEPAGE_WRITING_HEADING = "Writing";
