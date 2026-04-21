export interface CaseStudyBlock {
  problem: string;
  approach: string;
  result: string;
}

export interface BeforeAfter {
  label: string;
  before: string;
  after: string;
}

export interface ProjectMedia {
  src: string;
  caption: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export type ProjectBadge =
  | "Design systems"
  | "DX"
  | "AI"
  | "Performance"
  | "Data viz"
  | "Accessibility";

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  tech: string[];
  outcomes: string[];
  signalStack: string[];
  badges?: ProjectBadge[];
  bestFor?: string[];
  navLabel: string;
  image?: string;
  imageCaption?: string;
  secondaryMedia?: ProjectMedia;
  caseStudy?: CaseStudyBlock;
  beforeAfter?: BeforeAfter[];
  link?: string;
  links?: ProjectLink[];
}

export const PROJECTS: Project[] = [
  {
    id: "ledgerguard-deterministic-commitments-ledger",
    name: "Deterministic ledger + honest renewal read models",
    description:
      "Multi-tenant B2B SaaS that turns contracts into a commitments ledger finance can act on: renewal timing, notice windows, auto-renew risk, and clause-backed exposure—without treating probabilistic extraction as the system of record.",
    role: "Product & platform engineer · LedgerGuard",
    navLabel: "LedgerGuard",
    signalStack: [
      "Fastify API domain + worker internal callbacks",
      "Truth precedence across commitments & fields",
      "Zod/OpenAPI contracts (tenant + admin)",
    ],
    badges: ["AI", "DX"],
    bestFor: ["B2B SaaS architecture", "AI product engineering"],
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Fastify",
      "Python",
      "FastAPI",
      "BullMQ",
      "PostgreSQL",
      "Prisma",
      "Row-level security",
      "Zod",
      "OpenAPI",
      "Supabase Auth",
      "Stripe",
      "Sentry",
    ],
    outcomes: [
      "Separated probabilistic document intelligence (OCR, extraction, queue workers) from deterministic financial truth: workers propose via internal APIs; org-scoped domain rules decide what is stored and what renewals dashboards may claim.",
      "Documented and implemented a single truth-precedence stack so document list, detail, and renewal summary prefer grounded extraction fields when portfolio rows lag, drift, or sit in fields-only state—surfacing explicit warnings instead of silent green checks.",
      "End-to-end typed contracts for tenant and platform surfaces so web and admin reflect API decisions only, aligned with audit logging, feature gating, and multi-tenant isolation patterns described in the product architecture.",
    ],
    caseStudy: {
      problem:
        'Renewal and spend-at-risk readouts are only useful if finance trusts them. Contract PDFs flow through async, idempotent pipelines that can replay, partially fail, or land fields before synthesis catches up. If any UI prefers "whatever row got written first," you ship confident renewals off stale commitments—the exact failure mode that makes CFOs reject black-box contract AI.',
      approach:
        "Treated LedgerGuard as two systems: a deterministic API/domain layer (commitments, commitment_fields, truth_state, audit metadata) and a probabilistic worker layer that never writes tenant truth directly. Codified portfolio truth precedence (version skew, same-version drift, fields-only recovery) so read models align across routes, idempotent worker callbacks plan repair instead of clobbering newer synthesis, and human verify on synthesis-driving keys triggers realignment—or bounded honesty when realign cannot complete.",
      result:
        "Renewal drivers and contract value trace to explainable sources with explicit hints when the ledger is incomplete or skewed—aligned with the LedgerGuard positioning: structured extraction and review, not inferred terms presented as fact—so teams can act before auto-renew locks without the UI pretending the pipeline is more certain than it is.",
    },
    beforeAfter: [
      {
        label: "Source of renewal truth",
        before: "First persisted row wins",
        after: "API read model + drift/skew metadata",
      },
      {
        label: "Worker → database",
        before: "Risk of bypassing domain rules",
        after: "Validated internal callbacks only",
      },
      {
        label: "Confidence in UI",
        before: "Implied certainty",
        after: "Warnings when truth is partial",
      },
    ],
    link: "https://ledgerguard.io/",
  },
  {
    id: "mapbylaw-platform-ui-ai-reports",
    name: "Design system, typed AI & report platform",
    description:
      "Product engineering for the MapBylaw map-first property insights platform: shared @mapbylaw/ui across web and admin, OpenAPI + Zod contracts, typed React-PDF bilingual reports, and AI recommendations grounded in the same zoning rules, feasibility math, and datasets as the rest of the product.",
    role: "Senior product engineer · MapBylaw",
    navLabel: "MapBylaw",
    signalStack: [
      "@mapbylaw/ui + feature-based apps",
      "OpenAPI/Zod + typed React-PDF",
      "Policy-aligned AI recommendations",
    ],
    badges: ["Design systems", "DX", "AI", "Accessibility"],
    bestFor: ["Design systems", "AI product engineering", "Frontend architecture"],
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Fastify",
      "@mapbylaw/ui",
      "React-PDF",
      "Mapbox GL",
      "Tailwind",
      "Docling",
      "OpenAPI",
      "AWS",
      "WCAG",
      "Jest",
      "Playwright",
    ],
    outcomes: [
      "Single design system (@mapbylaw/ui), feature-based structure, and path aliases for web and admin—OpenAPI + Zod and typed React-PDF payloads keep the bilingual report, API, and UI in lockstep.",
      "AI recommendations as a strict typed service: narrow context from real zoning and feasibility inputs, one contract across Fastify, dashboard, and PDF, with malformed payloads failing fast instead of drifting from content policy.",
      "Rule and incentive changes flow through one orchestrator so validation, AI context, and report integrity evolve together—without hand-editing report copy or chasing fields across layers for audits.",
    ],
    caseStudy: {
      problem:
        "Web and admin needed a consistent design language and scalable feature layout while the API, bilingual PDF reports, consent-gated analytics, and internal tooling evolved in parallel. Early AI recommendations were generic and hard to trace; there was no single typed contract between the Fastify API, React dashboards, and React-PDF, which risked drift from MapBylaw's content policy (no fake or static data, no Montreal-only fallbacks pretending to be real).",
      approach:
        "Built @mapbylaw/ui for both apps with feature folders, barrel exports, and path aliases (components/, features/, utils/). Standardized OpenAPI 3.0 + Zod for API contracts and a typed React-PDF payload builder with shared report components so the 10-page bilingual report stays single-source. For AI, defined a strict TypeScript shape for ai_recommendations in the API and database, a narrow context builder fed only verified inputs (zoning, PUM 2050 sector, heritage/climate flags, feasibility scores, computed scenarios), tests so bad payloads fail fast, and living audits (REPORTS_DATA_AUDIT.md, ARCHITECTURE.md, IMPLEMENTATION_STATUS.md, API_AUDIT.md).",
      result:
        "One design language and predictable DX, with specific auditable recommendations that line up between dashboard and PDF (e.g., scenario-level zoning guidance) and evolve automatically as rules and incentives change—report content policy enforced by shared types and audit, not ad-hoc copy.",
    },
    beforeAfter: [
      { label: "UI across apps", before: "Separate stacks", after: "Shared @mapbylaw/ui" },
      { label: "AI interface", before: "Chatbot-style, generic", after: "Typed, scenario-specific service" },
      { label: "Context", before: "Loose, sometimes invented", after: "Narrow, policy-aligned, no fake data" },
      { label: "Schema & reports", before: "Scattered / ad-hoc", after: "Shared contract + typed PDF + audits" },
    ],
    links: [{ label: "Project", href: "https://mapbylaw.ca/" }],
  },
  {
    id: "design-system-marketplace-login-web3",
    name: "Design system, marketplace & login (web3)",
    description:
      "Built and maintained the design system for our Web3 products, then used it to ship the marketplace and login flows from design to production. Accessible (WCAG), consistent UI, solid API and auth, deployed on AWS.",
    role: "Lead / Senior frontend engineer · AlwaysGeeky Games",
    navLabel: "Web3 DS & apps",
    signalStack: [
      "Storybook + CI (visual/a11y)",
      "WCAG across products",
      "React / Next in production",
    ],
    badges: ["Design systems", "Accessibility"],
    bestFor: ["Design systems", "Frontend architecture"],
    tech: [
      "React",
      "TypeScript",
      "Next.js",
      "Storybook",
      "GitHub Actions",
      "Tailwind",
      "AWS",
      "Jest",
      "Playwright",
    ],
    outcomes: [
      "Unified look and accessibility across products so new features feel native no matter which Web3 surface they land on.",
      "CI catches visual and a11y regressions before merge, so teams can move quickly without breaking accessibility.",
      "Marketplace and login shipped on time, matched design, stayed stable under real traffic, and handled Web3 API/auth flows reliably in production.",
    ],
    caseStudy: {
      problem:
        "Teams were building their own components and we needed marketplace and login experiences that matched design, integrated with Web3 APIs, and felt fast—not fragile or inconsistent.",
      approach:
        "Established a Storybook-driven design system with WCAG-compliant components and wired CI (GitHub Actions) to run lint, visual diff, and a11y checks on every PR. Built marketplace and login in React/Next.js/Vite on top of that system, smoothing loading and error states and integrating cleanly with APIs and auth.",
      result:
        "A unified look and accessibility baseline across products. CI catches visual/a11y regressions before merge, and marketplace and login stayed stable under real Web3 traffic.",
    },
    beforeAfter: [
      { label: "Component reuse", before: "Ad-hoc", after: "Shared library" },
      { label: "A11y checks", before: "Manual", after: "Automated in CI" },
    ],
    links: [
      { label: "Marketplace", href: "https://market.voxies.io" },
      { label: "Login", href: "https://login.voxies.io/" },
    ],
  },
  {
    id: "data-dashboards-emplifi",
    name: "Data Dashboards & Motion",
    description:
      "Built data-heavy dashboards with smooth motion (GSAP) and D3.js charts, tuned to run well inside mobile webviews and embedded contexts.",
    role: "Senior frontend engineer · Emplifi",
    navLabel: "Emplifi dashboards",
    signalStack: ["D3.js", "GSAP + profiled React", "Embedded + webview performance"],
    badges: ["Data viz", "Performance"],
    bestFor: ["Performance", "Dashboards"],
    tech: ["React", "D3.js", "GSAP", "Figma"],
    outcomes: [
      "A/B tests and analytics showed better retention and a noticeably snappier UI.",
      "The same dashboards ran smoothly when embedded in other apps and mobile webviews.",
    ],
    caseStudy: {
      problem:
        "Dashboards had to look good, stay legible, and feel smooth inside mobile webviews and embedded surfaces, with real motion design instead of jank.",
      approach:
        "Used D3.js for charts and GSAP for motion, then profiled and tuned React so a single codebase ran well across webviews and embeds.",
      result:
        "A smoother embedded experience and more trustworthy visuals, with data showing better retention and fewer drop-offs.",
    },
    beforeAfter: [{ label: "Embedded performance", before: "Janky", after: "Smooth 60fps" }],
    links: [{ label: "Website", href: "https://emplifi.io" }],
  },
  {
    id: "pwa-performance-controltech",
    name: "PWA & Performance",
    description:
      "Built several startup products end to end, focusing on code splitting, lazy loading, and CDN-backed assets, plus PWAs with offline support and caching from scratch.",
    role: "Frontend engineer · ControlTech Startup Studio",
    navLabel: "ControlTech PWA",
    signalStack: ["Jest + Playwright", "GitHub Actions CI/CD", "PWA + CDN delivery"],
    badges: ["Performance", "DX"],
    bestFor: ["Frontend architecture", "Performance"],
    tech: ["Vue", "Nuxt.js", "React", "React Native", "Jest", "Playwright", "GitHub Actions"],
    outcomes: [
      "Reached 99.9% deployment stability with Jest, Playwright, and GitHub Actions in the loop.",
      "Improved load time and offline behavior so early users had a fast, resilient experience on unstable connections.",
    ],
    caseStudy: {
      problem:
        "Products had to load quickly on modest devices, work offline, and deploy without breaking core flows.",
      approach:
        "Split code and lazy loaded heavy paths, moved assets behind a CDN, and built PWAs with service workers and caching. Added Jest, Playwright, and GitHub Actions so regressions were caught before reaching users.",
      result:
        "99.9% uptime on releases, faster first load, and key flows that continued to work offline for early adopters.",
    },
    beforeAfter: [
      { label: "Deployment stability", before: "~95%", after: "99.9%" },
      { label: "First load", before: "Heavy bundle", after: "Split + CDN" },
    ],
    links: [{ label: "Website", href: "https://ctrltech.org" }],
  },
];
