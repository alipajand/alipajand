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
    id: "mapbylaw-ai-recommendations-report-integrity",
    name: "Typed AI recommendations & report integrity",
    description:
      "Designed and implemented an AI recommendations pipeline that planners, developers, and auditors can trust—grounded in the same zoning rules, feasibility math, and datasets as the rest of MapBylaw.",
    role: "Senior product engineer · MapBylaw",
    navLabel: "MapBylaw · AI",
    signalStack: [
      "TypeScript + OpenAPI/Zod",
      "React-PDF + typed payloads",
      "Policy-aligned AI context",
    ],
    badges: ["AI", "Accessibility"],
    bestFor: ["AI product engineering", "Frontend architecture"],
    tech: ["TypeScript", "Fastify", "React", "React-PDF", "Docling", "OpenAPI", "AWS", "WCAG"],
    outcomes: [
      "Turned vague, chatbot-style suggestions into specific, auditable recommendations that stay in sync between the dashboard and PDF reports.",
      "Introduced a single typed contract for AI recommendations across API, dashboard, and PDF so audits no longer require chasing fields through multiple layers.",
      "Made rule and incentive changes flow through one orchestrator, tightening both AI context and validation automatically while keeping report content policy intact.",
    ],
    caseStudy: {
      problem:
        "Early AI recommendations were generic, hard to trace back to inputs, and sometimes drifted from MapBylaw's content policy (no fake or static data, no Montreal-only fallbacks pretending to be real). There was no single typed contract between the Fastify API, React dashboards, and React-PDF reports, so auditing a recommendation meant spelunking across services and documents.",
      approach:
        "Standardized a strict TypeScript shape for ai_recommendations in the API and database, then consumed it in both the web dashboard and PDF payload builder. Built a narrow context builder that only feeds the model what MapBylaw already knows is true (zoning code, PUM 2050 sector, heritage/climate flags, feasibility scores, computed scenarios). Wired the flow through OpenAPI + Zod validation, added tests so malformed recommendations fail fast, and codified the constraints in REPORTS_DATA_AUDIT.md, ARCHITECTURE.md, IMPLEMENTATION_STATUS.md, and API_AUDIT.md.",
      result:
        "Specific, auditable recommendations that line up between dashboard and PDF (e.g., “Scenario B exceeds the Plateau conversion cap; keep GFA under 200 m² or switch to a plex + ADU strategy”) and evolve automatically as rules and incentives change—without hand-editing report copy.",
    },
    beforeAfter: [
      {
        label: "AI interface",
        before: "Chatbot-style, generic",
        after: "Typed, scenario-specific service",
      },
      {
        label: "Context",
        before: "Loose, sometimes invented",
        after: "Narrow, policy-aligned, no fake data",
      },
      {
        label: "Schema",
        before: "Scattered across layers",
        after: "Shared contract + living audits",
      },
    ],
  },
  {
    id: "mapbylaw-design-system-dx",
    name: "Design system & platform DX",
    description:
      "Product engineering for a map-first property insights platform: a shared UI across web and admin, feature-based architecture, and a type-safe API and PDF report system.",
    role: "Senior product engineer · MapBylaw",
    navLabel: "MapBylaw · DS",
    signalStack: ["@mapbylaw/ui", "OpenAPI + Zod contracts", "React-PDF report system"],
    badges: ["Design systems", "DX"],
    bestFor: ["Design systems", "Frontend architecture"],
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "@mapbylaw/ui",
      "React-PDF",
      "Mapbox GL",
      "Tailwind",
      "Jest",
      "Playwright",
    ],
    outcomes: [
      "Single design system (@mapbylaw/ui) for web and admin so toasts, shell, and tables behave the same everywhere.",
      "Feature-based structure and path aliases so teams ship features without deep import chains or guessing where things live.",
      "OpenAPI + Zod and strongly typed PDF payloads keep API contracts and report outputs in lockstep.",
    ],
    caseStudy: {
      problem:
        "Web and admin needed a consistent design language and patterns, while API, PDF report, and frontend all evolved with new bilingual reports, consent-gated analytics, and internal tooling.",
      approach:
        "Built a shared component library (@mapbylaw/ui) for both apps, organized by feature with barrel exports and path aliases (components/, features/, utils/) for clean imports. Used OpenAPI 3.0 and Zod for API contracts, plus React-PDF with a typed payload builder and shared report components so the 10-page bilingual report stays single-source.",
      result:
        "A single design language and predictable DX: API docs and types drive the frontend, and report content policy (no static/fake data) is enforced via shared types and audit.",
    },
    beforeAfter: [
      { label: "UI across apps", before: "Separate stacks", after: "Shared @mapbylaw/ui" },
      { label: "Report data", before: "Ad-hoc copy", after: "Typed payload + audit" },
    ],
    links: [{ label: "Project", href: "https://mapbylaw.ca/" }],
  },
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
        "Renewal and spend-at-risk readouts are only useful if finance trusts them. Contract PDFs flow through async, idempotent pipelines that can replay, partially fail, or land fields before synthesis catches up. If any UI prefers \"whatever row got written first,\" you ship confident renewals off stale commitments—the exact failure mode that makes CFOs reject black-box contract AI.",
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
