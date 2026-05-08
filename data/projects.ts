export interface CaseStudyBlock {
  problem: string;
  constraints: string;
  architectureDecisions: string;
  tradeoffs: string;
  reliabilityPerformance: string;
  outcome: string;
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
      "Multi-tenant B2B SaaS that turns contracts into a commitments ledger finance can act on: renewal timing, notice windows, auto-renew risk, and clause-backed exposure, without treating probabilistic extraction as the system of record.",
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
      "Documented and implemented a single truth-precedence stack so document list, detail, and renewal summary prefer grounded extraction fields when portfolio rows lag, drift, or sit in fields-only state, surfacing explicit warnings instead of silent green checks.",
      "End-to-end typed contracts for tenant and platform surfaces so web and admin reflect API decisions only, aligned with audit logging, feature gating, and multi-tenant isolation patterns described in the product architecture.",
    ],
    caseStudy: {
      problem:
        "Renewal and spend-at-risk views only matter if finance trusts the underlying commitments. Contract PDFs traverse async, replayable pipelines where extraction, synthesis, and portfolio rows can land out of order or partially fail, so any UI that treats “first persisted row wins” as truth ships confident renewals on stale or skewed data.",
      constraints:
        "Hard multi-tenant isolation (RLS), workers cannot bypass domain invariants, pipelines must stay idempotent under replay, and finance needs clause-backed trace, not narrative inferred by models presented as fact.",
      architectureDecisions:
        "Split deterministic API/domain state (commitments, commitment_fields, truth_state, audit metadata) from probabilistic workers; workers never write tenant truth directly, only validated internal callbacks. Codified portfolio truth precedence (version skew, same-version drift, fields-only recovery) and repair planning instead of clobbering newer synthesis.",
      tradeoffs:
        "Surfacing drift, skew, and incomplete ledger state adds UI surface area versus implied certainty. Bounded honesty when realignment cannot complete beats silent green checks.",
      reliabilityPerformance:
        "Idempotent worker flows, aligned read models across list/detail/renewal routes, and explicit repair paths so behavior stays coherent when pipelines partially fail or replay.",
      outcome:
        "Renewal drivers trace to explainable sources with explicit hints when the ledger is incomplete or skewed, so teams can act before auto-renew locks without the product overstating pipeline certainty.",
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
      "Single design system (@mapbylaw/ui), feature-based structure, and path aliases for web and admin. OpenAPI + Zod and typed React-PDF payloads keep the bilingual report, API, and UI in lockstep.",
      "AI recommendations as a strict typed service: narrow context from real zoning and feasibility inputs, one contract across Fastify, dashboard, and PDF, with malformed payloads failing fast instead of drifting from content policy.",
      "Rule and incentive changes flow through one orchestrator so validation, AI context, and report integrity evolve together, without hand-editing report copy or chasing fields across layers for audits.",
    ],
    caseStudy: {
      problem:
        "Web and admin had to evolve in parallel while bilingual PDFs, consent-gated analytics, and AI recommendations stayed aligned with zoning and feasibility logic, not generic chatbot output detached from policy.",
      constraints:
        "Content policy forbids fabricated or static market stand-ins; Montreal-only shortcuts cannot masquerade as real inputs; Fastify, dashboards, and React-PDF must agree as incentives and rules change.",
      architectureDecisions:
        "Shared @mapbylaw/ui with feature folders and path aliases; OpenAPI 3 + Zod at the boundary; typed React-PDF payload builder sharing components with web apps; ai_recommendations as a narrow TypeScript shape fed only verified scenario inputs, with living audits alongside architecture docs.",
      tradeoffs:
        "Strict schemas and audits add ongoing maintenance versus permissive glue code, but they prevent API/report/UI drift that is expensive to unwind and risky under regulatory scrutiny.",
      reliabilityPerformance:
        "Tests reject malformed AI payloads early; orchestration keeps validation, AI context, and bilingual report integrity moving together when datasets or incentives shift.",
      outcome:
        "One design language and scenario-level recommendations that stay consistent between dashboard and PDF as policy evolves, with integrity enforced by shared types and audits instead of ad-hoc copy edits.",
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
        "Teams were shipping one-off UI while marketplace and login needed to match design, integrate with Web3 APIs and wallet/auth flows, and survive production traffic, not become a brittle demo layer.",
      constraints:
        "WCAG expectations across products, tight coordination with design, and shipping deadlines without dropping accessibility or error handling for chain/API failures.",
      architectureDecisions:
        "Storybook-driven design system with shared primitives; GitHub Actions running lint, visual regression, and accessibility checks on every PR; marketplace and login implemented on the same stack with explicit loading, empty, and failure surfaces.",
      tradeoffs:
        "CI adds merge friction up front versus discovering visual and a11y failures in production; shared components slow one-off hacks but reduce long-term drift across games and surfaces.",
      reliabilityPerformance:
        "Automated gates catch regressions before release; flows tuned for noisy Web3 backends and real user traffic rather than happy-path-only demos.",
      outcome:
        "A consistent accessible baseline across products; marketplace and login remained stable in production with regressions caught before they reached users.",
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
      "Instrumentation and qualitative review pointed to a snappier-feeling UI and stronger engagement after tightening motion and embed performance.",
      "The same dashboards ran smoothly when embedded in other apps and mobile webviews.",
    ],
    caseStudy: {
      problem:
        "Dashboards had to stay legible and responsive inside mobile webviews and embedded hosts where CPU and layout budgets are tight, with smooth motion and no constant jank.",
      constraints:
        "One codebase for standalone and embed; chart density that still reads on small viewports; motion that degrades gracefully when budgets are exhausted.",
      architectureDecisions:
        "D3.js for chart fidelity; GSAP for timeline-style motion; React profiling so animation work stays bounded on low-power devices and embeds.",
      tradeoffs:
        "Rich motion increases implementation and test surface versus static charts; profiling effort traded for predictable frame time in webview contexts.",
      reliabilityPerformance:
        "Targeted tuning for embed and webview paths, with fewer assumptions from full-desktop chrome and bounded animation work per frame.",
      outcome:
        "Dashboards that stayed usable in embedded and mobile webview contexts, with motion that remained controlled rather than chaotic.",
    },
    beforeAfter: [{ label: "Embedded performance", before: "Unbounded motion cost", after: "Profiled, bounded motion" }],
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
      "CI and automated tests sharply reduced regressions shipped to users compared with manual release habits.",
      "Improved load time and offline behavior so early users had a fast, resilient experience on unstable connections.",
    ],
    caseStudy: {
      problem:
        "Products had to load quickly on modest hardware, tolerate flaky networks, and ship without repeatedly breaking primary flows.",
      constraints:
        "Offline-capable shells where product requirements demanded it; small team release cadence; low tolerance for production regressions affecting early adopters.",
      architectureDecisions:
        "Route-level code splitting and lazy loading; CDN-backed static assets; service worker caching for PWA shells; Jest and Playwright in CI with GitHub Actions gating merges.",
      tradeoffs:
        "More pipeline and test code versus shipping larger bundles faster; offline caches trade freshness for resilience until invalidated.",
      reliabilityPerformance:
        "Automated tests and CI reduced regressions reaching users; splitting and CDN work addressed first-load pain on slow connections.",
      outcome:
        "Releases stopped routinely breaking core flows; first load improved materially and offline-capable paths stayed usable on unstable networks.",
    },
    beforeAfter: [
      { label: "Release confidence", before: "Manual, high variance", after: "CI-gated, repeatable" },
      { label: "First load", before: "Heavy bundle", after: "Split + CDN" },
    ],
    links: [{ label: "Website", href: "https://ctrltech.org" }],
  },
];
