export interface CaseStudyBlock {
  problem: string;
  constraints: string;
  owned: string[];
  highLevelFlow?: string[];
  architectureDecisions: string;
  technicalImplementation: string;
  uxAccessibility: string;
  outcome: string;
  tradeoffs: string;
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
    name: "LedgerGuard — AI contract intelligence with deterministic financial truth",
    description:
      "Multi-tenant B2B SaaS that turns vendor contracts into commitment, renewal, notice-window, and spend-risk views. The core product decision: keep probabilistic AI/OCR extraction separate from deterministic financial truth so the UI never presents stale or partial data as certainty.",
    role: "Senior Product Engineer · LedgerGuard (independent product)",
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
      "Designed the product architecture across Next.js, Fastify, Python workers, Supabase/Postgres, async document extraction, Stripe, feature flags, audit trails, and multi-tenant access patterns.",
      "Separated probabilistic document intelligence from deterministic financial read models: workers propose, domain rules validate, and renewal/commitment surfaces show explicit warnings when truth is partial, stale, or skewed.",
      "Built buyer-facing and operator-facing product surfaces including upload, verification, commitments ledger, renewal risk, portfolio demo, and typed API contracts that keep web/admin behavior aligned with backend decisions.",
    ],
    caseStudy: {
      problem:
        "Renewal and spend-at-risk views only matter if finance trusts the underlying commitments. Contract PDFs traverse async, replayable pipelines where extraction, synthesis, and portfolio rows can land out of order or partially fail, so any UI that treats “first persisted row wins” as truth ships confident renewals on stale or skewed data.",
      constraints:
        "Hard multi-tenant isolation (RLS), workers cannot bypass domain invariants, pipelines must stay idempotent under replay, and finance needs clause-backed trace, not narrative inferred by models presented as fact.",
      owned: [
        "Designed the product architecture across Next.js, Fastify, Python workers, Supabase/Postgres, and async document extraction.",
        "Built buyer- and operator-facing surfaces (upload, verification, commitments ledger, renewal risk) and typed tenant/admin API contracts.",
        "Codified renewal-truth precedence and repair planning so newer synthesis is not clobbered by stale rows.",
      ],
      highLevelFlow: [
        "Upload contract",
        "Async AI/OCR extraction",
        "Domain validation via internal callbacks",
        "Truth-precedence resolves drift/skew",
        "Renewal ledger UI with honest warnings",
      ],
      architectureDecisions:
        "Split deterministic API/domain state (commitments, commitment_fields, truth_state, audit metadata) from probabilistic workers; workers never write tenant truth directly, only validated internal callbacks. Codified portfolio truth precedence (version skew, same-version drift, fields-only recovery) and repair planning instead of clobbering newer synthesis.",
      technicalImplementation:
        "Idempotent worker flows, aligned read models across list/detail/renewal routes, and explicit repair paths so behavior stays coherent when pipelines partially fail or replay.",
      uxAccessibility:
        "Honest UI states: explicit warnings when truth is partial, stale, or skewed instead of implied certainty, with verification flows that stay keyboard reachable.",
      outcome:
        "Renewal drivers trace to explainable sources with explicit hints when the ledger is incomplete or skewed, so teams can act before auto-renew locks without the product overstating pipeline certainty.",
      tradeoffs:
        "Surfacing drift, skew, and incomplete ledger state adds UI surface area versus implied certainty. Bounded honesty when realignment cannot complete beats silent green checks.",
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
    name: "MapBylaw — typed AI recommendations, shared UI, and report infrastructure",
    description:
      "Product engineering for a map-first property insights platform: shared UI across web/admin, typed API contracts, bilingual React-PDF reports, and AI recommendations grounded in zoning rules, feasibility math, and verified scenario inputs.",
    role: "Senior Product Engineer · MapBylaw",
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
      "Built a shared UI foundation across web and admin so core flows, visual language, accessibility patterns, and product states stay consistent as the platform grows.",
      "Aligned Fastify APIs, Zod/OpenAPI contracts, dashboard surfaces, and React-PDF payloads so reports and product UI use the same verified data model.",
      "Constrained AI recommendations to policy-aware, scenario-specific inputs with strict typed outputs, preventing generic chatbot responses from drifting away from zoning and feasibility rules.",
    ],
    caseStudy: {
      problem:
        "Web and admin had to evolve in parallel while bilingual PDFs, consent-gated analytics, and AI recommendations stayed aligned with zoning and feasibility logic, not generic chatbot output detached from policy.",
      constraints:
        "Content policy forbids fabricated or static market stand-ins; Montreal-only shortcuts cannot masquerade as real inputs; Fastify, dashboards, and React-PDF must agree as incentives and rules change.",
      owned: [
        "Built the shared @mapbylaw/ui foundation used across web and admin.",
        "Aligned Fastify APIs, Zod/OpenAPI contracts, and typed React-PDF payloads on one verified data model.",
        "Constrained AI recommendations to typed, policy-aligned scenario inputs.",
      ],
      highLevelFlow: [
        "Verified scenario inputs",
        "Typed API (Zod/OpenAPI)",
        "Policy-aligned AI recommendations",
        "Shared @mapbylaw/ui",
        "Dashboard + bilingual PDF",
      ],
      architectureDecisions:
        "Shared @mapbylaw/ui with feature folders and path aliases; OpenAPI 3 + Zod at the boundary; typed React-PDF payload builder sharing components with web apps; ai_recommendations as a narrow TypeScript shape fed only verified scenario inputs, with living audits alongside architecture docs.",
      technicalImplementation:
        "Tests reject malformed AI payloads early; orchestration keeps validation, AI context, and bilingual report integrity moving together when datasets or incentives shift.",
      uxAccessibility:
        "WCAG-minded shared components and consistent product states (loading, empty, error) across web and admin, plus bilingual report parity.",
      outcome:
        "One design language and scenario-level recommendations that stay consistent between dashboard and PDF as policy evolves, with integrity enforced by shared types and audits instead of ad-hoc copy edits.",
      tradeoffs:
        "Strict schemas and audits add ongoing maintenance versus permissive glue code, but they prevent API/report/UI drift that is expensive to unwind and risky under regulatory scrutiny.",
    },
    beforeAfter: [
      { label: "UI across apps", before: "Separate stacks", after: "Shared @mapbylaw/ui" },
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
        label: "Schema & reports",
        before: "Scattered / ad-hoc",
        after: "Shared contract + typed PDF + audits",
      },
    ],
    links: [{ label: "Project", href: "https://mapbylaw.ca/" }],
  },
  {
    id: "design-system-marketplace-login-web3",
    name: "AlwaysGeeky — design system, marketplace, and login platform",
    description:
      "Led frontend delivery for Web3 product surfaces by building a reusable design system and shipping marketplace and login flows with accessible components, reliable auth/API states, Storybook documentation, and CI quality checks.",
    role: "Lead Frontend Engineer · Design Systems · AlwaysGeeky Games",
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
      "Built shared frontend foundations so marketplace, login, and product surfaces used consistent accessible components instead of one-off UI.",
      "Added Storybook and CI quality checks for visual, accessibility, and regression coverage before merge.",
      "Shipped production marketplace and login flows with explicit loading, empty, error, and Web3 auth/API states instead of happy-path-only UI.",
    ],
    caseStudy: {
      problem:
        "Teams were shipping one-off UI while marketplace and login needed to match design, integrate with Web3 APIs and wallet/auth flows, and survive production traffic, not become a brittle demo layer.",
      constraints:
        "WCAG expectations across products, tight coordination with design, and shipping deadlines without dropping accessibility or error handling for chain/API failures.",
      owned: [
        "Established the shared component architecture and Storybook documentation (in close coordination with design).",
        "Added CI gates for visual and accessibility regressions before merge.",
        "Shipped marketplace and login flows with explicit loading, empty, error, and Web3 auth/API states.",
      ],
      highLevelFlow: [
        "Shared primitives & tokens",
        "Storybook documentation",
        "CI visual/a11y gates",
        "Marketplace & login flows",
        "Production-ready states",
      ],
      architectureDecisions:
        "Storybook-driven design system with shared primitives; GitHub Actions running lint, visual regression, and accessibility checks on every PR; marketplace and login implemented on the same stack with explicit loading, empty, and failure surfaces.",
      technicalImplementation:
        "Automated gates catch regressions before release; flows tuned for noisy Web3 backends and real user traffic rather than happy-path-only demos.",
      uxAccessibility:
        "WCAG-aligned accessible primitives reused across products, with explicit non-happy-path states instead of demo-only UI.",
      outcome:
        "A consistent accessible baseline across products; marketplace and login remained stable in production with regressions caught before they reached users.",
      tradeoffs:
        "CI adds merge friction up front versus discovering visual and a11y failures in production; shared components slow one-off hacks but reduce long-term drift across games and surfaces.",
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
    name: "Emplifi — data-heavy dashboards and embedded performance",
    description:
      "Built and tuned dashboard interfaces using React, D3.js, and GSAP, with attention to readability, motion discipline, and performance inside embedded and mobile webview contexts.",
    role: "Senior Frontend Engineer · Emplifi",
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
      owned: [
        "Built D3.js dashboards with profiled, bounded GSAP motion (team delivery).",
        "Tuned embed and mobile-webview performance paths against tight CPU and layout budgets.",
      ],
      highLevelFlow: [
        "Dashboard data",
        "D3.js charts",
        "Profiled, bounded GSAP motion",
        "Embed & webview tuning",
        "Responsive dashboards",
      ],
      architectureDecisions:
        "D3.js for chart fidelity; GSAP for timeline-style motion; React profiling so animation work stays bounded on low-power devices and embeds.",
      technicalImplementation:
        "Targeted tuning for embed and webview paths, with fewer assumptions from full-desktop chrome and bounded animation work per frame.",
      uxAccessibility:
        "Readable chart density on small viewports and motion that degrades gracefully when frame budgets are exhausted.",
      outcome:
        "Dashboards that stayed usable in embedded and mobile webview contexts, with motion that remained controlled rather than chaotic.",
      tradeoffs:
        "Rich motion increases implementation and test surface versus static charts; profiling effort traded for predictable frame time in webview contexts.",
    },
    beforeAfter: [
      {
        label: "Embedded performance",
        before: "Unbounded motion cost",
        after: "Profiled, bounded motion",
      },
    ],
    links: [{ label: "Website", href: "https://emplifi.io" }],
  },
  {
    id: "pwa-performance-controltech",
    name: "ControlTech — PWA, performance, and startup product delivery",
    description:
      "Built startup product surfaces end to end across Vue, Nuxt, React, and React Native, with focus on performance, offline/PWA behavior, test coverage, CI/CD, and practical delivery.",
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
      owned: [
        "Built startup product surfaces across Vue, Nuxt, React, and React Native.",
        "Set up route-level code splitting, CDN delivery, PWA caching, and CI test gates (Jest/Playwright/GitHub Actions).",
      ],
      highLevelFlow: [
        "Route-level code splitting",
        "CDN-backed assets",
        "Service-worker PWA cache",
        "CI test gates",
        "Fast, offline-resilient UI",
      ],
      architectureDecisions:
        "Route-level code splitting and lazy loading; CDN-backed static assets; service worker caching for PWA shells; Jest and Playwright in CI with GitHub Actions gating merges.",
      technicalImplementation:
        "Automated tests and CI reduced regressions reaching users; splitting and CDN work addressed first-load pain on slow connections.",
      uxAccessibility:
        "Offline-capable shells kept core flows usable on unstable networks for early adopters.",
      outcome:
        "Releases stopped routinely breaking core flows; first load improved materially and offline-capable paths stayed usable on unstable networks.",
      tradeoffs:
        "More pipeline and test code versus shipping larger bundles faster; offline caches trade freshness for resilience until invalidated.",
    },
    beforeAfter: [
      {
        label: "Release confidence",
        before: "Manual, high variance",
        after: "CI-gated, repeatable",
      },
      { label: "First load", before: "Heavy bundle", after: "Split + CDN" },
    ],
    links: [{ label: "Website", href: "https://ctrltech.org" }],
  },
];
