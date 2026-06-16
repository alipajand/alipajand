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
  contribution?: string;
  highlighted?: boolean;
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
    name: "LedgerGuard",
    description:
      "AI contract intelligence SaaS for renewals, commitments, notice windows, and financial exposure. I designed and built the product experience end to end, including document review, verification, source evidence, renewal-risk, and portfolio dashboard workflows.",
    role: "Senior Product Engineer · Design-minded frontend owner · LedgerGuard",
    contribution:
      "Owned product experience, visual hierarchy, interaction states, frontend implementation, review workflows, and production iteration.",
    highlighted: true,
    navLabel: "LedgerGuard",
    signalStack: [
      "Fastify API domain + worker internal callbacks",
      "Truth precedence across commitments & fields",
      "Zod/OpenAPI contracts (tenant + admin)",
    ],
    badges: ["AI", "DX"],
    bestFor: [
      "Senior frontend architecture",
      "AI-assisted product UI",
      "Workflow-heavy SaaS",
      "Product ownership",
    ],
    image: "/portfolio-media/ledgerguard.png",
    imageCaption:
      "Document review and renewal-risk workflows showing source evidence, validation states, and portfolio-level visibility.",
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
      "Designed and built the product experience end to end, from navigation and information hierarchy to document review, verification, renewal-risk, and portfolio dashboard workflows.",
      "Created visual and interaction patterns for complex AI states, including confidence gaps, source evidence, partial extraction, validation errors, and human review.",
      "Designed responsive React / Next.js interfaces directly in code, iterating on layout, typography, density, empty states, and workflow clarity without relying on fully specified design handoffs.",
      "Built a reusable component foundation that kept buyer-facing, tenant, and operator surfaces visually consistent and accessible.",
      "Owned the complete product loop across problem definition, UX decisions, implementation, testing, production behavior, and iteration.",
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
        "Contract upload",
        "Async OCR + extraction",
        "Verification + source evidence review",
        "Truth-precedence ledger update",
        "Renewal risk + portfolio visibility",
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
    // TODO(portfolio-media): Add 2–3 screenshots or a short walkthrough showing the final interface, edge states, and responsive behavior.
    link: "https://ledgerguard.io/",
  },
  {
    id: "mapbylaw-platform-ui-ai-reports",
    name: "MapBylaw",
    description:
      "Map-first property insights platform with shared UI, typed API contracts, bilingual report surfaces, and product workflows grounded in zoning rules, feasibility math, and verified scenario inputs.",
    role: "Senior Product Engineer · Frontend architecture & product UI · MapBylaw",
    contribution:
      "Owned shared UI foundations, typed frontend contracts, dashboard/report surfaces, and workflow-heavy product UI.",
    highlighted: true,
    navLabel: "MapBylaw",
    signalStack: [
      "@mapbylaw/ui + feature-based apps",
      "OpenAPI/Zod + typed React-PDF",
      "Policy-aligned AI recommendations",
    ],
    badges: ["Design systems", "DX", "AI", "Accessibility"],
    bestFor: [
      "Design systems",
      "Frontend architecture",
      "Data-heavy product UI",
      "AI-assisted workflows",
    ],
    image: "/portfolio-media/mapbylaw.png",
    imageCaption:
      "Map-first analysis and report workflows showing shared UI, data density, and policy-grounded recommendations.",
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
      "Built shared UI foundations across web and admin so product flows, visual language, accessibility patterns, and interface states stayed consistent as the platform grew.",
      "Aligned Fastify APIs, Zod/OpenAPI contracts, dashboard surfaces, and React-PDF payloads so reports and product UI use the same verified data model.",
      "Designed workflow-heavy interfaces for property analysis, recommendations, and report generation with attention to hierarchy, density, responsive behavior, and reliability.",
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
        "Property search + verified inputs",
        "Typed zoning + feasibility API",
        "Policy-aware recommendations",
        "Shared dashboard + report state",
        "Bilingual premium report delivery",
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
    // TODO(portfolio-media): Add 2–3 screenshots or a short walkthrough showing the final interface, edge states, and responsive behavior.
    links: [{ label: "Project", href: "https://mapbylaw.ca/" }],
  },
  {
    id: "design-system-marketplace-login-web3",
    name: "AlwaysGeeky — design system, marketplace, and authentication flows",
    description:
      "React / Next.js product surfaces for marketplace, authentication, and Web3 workflows, supported by a shared design system, accessibility standards, Storybook documentation, and CI quality checks.",
    role: "Senior Frontend Engineer · Design systems · AlwaysGeeky Games",
    contribution:
      "Owned design-system implementation, design-to-code translation, frontend states, accessibility, and production delivery.",
    navLabel: "Web3 DS & apps",
    signalStack: [
      "Storybook + CI (visual/a11y)",
      "WCAG across products",
      "React / Next in production",
    ],
    badges: ["Design systems", "Accessibility"],
    bestFor: [
      "Design systems",
      "Senior frontend engineering",
      "Design-to-code workflows",
      "Accessibility",
    ],
    image: "/portfolio-media/alwaysgeeky-marketplace.png",
    imageCaption:
      "Marketplace and authentication surfaces showing shared component patterns, responsive behavior, and design-system consistency.",
    secondaryMedia: {
      src: "/portfolio-media/alwaysgeeky-login.png",
      caption:
        "Authentication surface showing shared component patterns, responsive behavior, and design-system consistency.",
    },
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
      "Partnered with design and product to turn early concepts and incomplete requirements into polished marketplace, authentication, and product experiences.",
      "Built and evolved a shared design system covering component APIs, visual states, responsive behavior, accessibility, and Storybook documentation.",
      "Translated Figma designs into production interfaces while resolving practical gaps in hierarchy, spacing, interactions, responsive behavior, and edge states.",
      "Designed reusable loading, empty, error, success, and recovery patterns for API-driven and authentication-heavy workflows.",
      "Worked independently across visual refinement, frontend implementation, testing, release quality, and production follow-up.",
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
        "Design primitives + tokens",
        "Storybook + usage patterns",
        "Marketplace + auth workflows",
        "Explicit API / wallet states",
        "CI-backed release quality",
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
      // TODO(portfolio-media): Add 2–3 screenshots or a short walkthrough showing the final interface, edge states, and responsive behavior.
      { label: "Marketplace", href: "https://market.voxies.io" },
      { label: "Login", href: "https://login.voxies.io/" },
    ],
  },
  {
    id: "agent-engineering-toolkit",
    name: "Agent Engineering Toolkit — deterministic safeguards for AI coding workflows",
    description:
      "A family of open-source TypeScript tools for making AI-assisted development safer and more operationally reliable. The toolkit audits repository readiness, agent instruction quality, pull-request risk, and CI enforcement without depending on opaque model judgment.",
    role: "Creator and maintainer · Open-source developer tooling",
    contribution:
      "Owned product definition, CLI UX, rule design, TypeScript implementation, testing, documentation, release structure, and repository maintenance.",
    navLabel: "Agent tooling",
    signalStack: [
      "Deterministic repository audits",
      "Agent instruction validation",
      "Pull-request risk analysis",
      "GitHub Actions enforcement",
    ],
    badges: ["DX", "AI"],
    bestFor: [
      "Developer experience",
      "AI-assisted engineering",
      "CLI tooling",
      "CI quality systems",
    ],
    tech: [
      "TypeScript",
      "Node.js",
      "CLI design",
      "GitHub Actions",
      "CI/CD",
      "Vitest",
      "Static analysis",
      "JSON output",
      "Markdown reporting",
    ],
    outcomes: [
      "Designed a shared problem model across repository readiness, instruction quality, pull-request risk, and CI enforcement.",
      "Built deterministic CLI workflows with machine-readable output, severity thresholds, exit codes, configuration, and automated tests.",
      "Focused the tools on practical failure modes: contradictory instructions, missing validation commands, unsafe agent guidance, sensitive-file changes, and incomplete repository context.",
      "Kept the tools explainable and CI-friendly so teams can understand why a check failed instead of receiving a generic AI-generated warning.",
      "Created documentation, examples, security guidance, and contributor-facing structure suitable for public repositories.",
    ],
    caseStudy: {
      problem:
        "Coding agents can generate changes quickly, but repository context, instruction quality, validation commands, and review boundaries are often incomplete or contradictory. That creates avoidable failures before code review even begins.",
      constraints:
        "The tools needed to work locally and in CI, produce explainable results, avoid hidden model judgment, support different repositories, and remain small enough for teams to adopt without introducing another heavy platform.",
      owned: [],
      architectureDecisions:
        "Split the workflow into focused tools: repository readiness, instruction-file auditing, pull-request risk analysis, and GitHub Actions enforcement. Use deterministic rules, explicit configuration, structured output, and stable exit behavior across the toolkit.",
      technicalImplementation:
        "CLI-first execution, predictable exit codes, fixture-driven tests, machine-readable output, and narrow file analysis keep the tools suitable for local workflows and continuous integration.",
      uxAccessibility:
        "Kept the tools explainable and CI-friendly so teams can understand why a check failed instead of receiving a generic AI-generated warning.",
      outcome:
        "A coherent set of open-source guardrails that helps teams identify missing context, unsafe instructions, risky changes, and readiness gaps before agent-assisted work reaches production.",
      tradeoffs:
        "Deterministic rules cannot interpret every repository-specific nuance, but they are reproducible, testable, and easier to trust in CI. The tools prefer clear bounded checks over broad AI-generated review commentary.",
    },
    beforeAfter: [
      {
        label: "Repository guidance",
        before: "Scattered or incomplete",
        after: "Audited for commands, boundaries, and validation",
      },
      {
        label: "Agent instructions",
        before: "Contradictory or stale",
        after: "Deterministic quality and safety checks",
      },
      {
        label: "PR review",
        before: "Generic AI commentary",
        after: "Explainable risk rules and exit behavior",
      },
      {
        label: "Enforcement",
        before: "Manual local checks",
        after: "Reusable GitHub Actions workflow",
      },
    ],
    links: [
      { label: "Agent Readiness Kit", href: "https://github.com/alipajand/agent-readiness-kit" },
      {
        label: "Agent Context Doctor",
        href: "https://github.com/alipajand/agent-context-doctor",
      },
      {
        label: "Agent PR Reviewer Lite",
        href: "https://github.com/alipajand/agent-pr-reviewer-lite",
      },
      {
        label: "Agent Readiness Action",
        href: "https://github.com/alipajand/agent-readiness-action",
      },
    ],
  },
  {
    id: "data-dashboards-emplifi",
    name: "Emplifi — data-heavy dashboards and interaction performance",
    description:
      "Enterprise dashboard interfaces built with React, TypeScript, D3.js, and GSAP, focused on data density, motion, rendering performance, and embedded/mobile webview constraints.",
    role: "Senior Frontend Engineer · Dashboards & performance · Emplifi",
    contribution:
      "Owned dashboard UI implementation, interaction behavior, rendering performance, and data-dense frontend patterns.",
    navLabel: "Emplifi dashboards",
    signalStack: ["D3.js", "GSAP + profiled React", "Embedded + webview performance"],
    badges: ["Data viz", "Performance"],
    bestFor: ["Dashboards", "Data-heavy UI", "Performance", "Interaction design"],
    tech: ["React", "TypeScript", "D3.js", "GSAP", "Figma"],
    outcomes: [
      "Built data-heavy enterprise dashboards with real-time rendering constraints.",
      "Developed interactive UI experiences using React, TypeScript, D3.js, and GSAP.",
      "Optimized rendering performance for mobile webviews, embedded contexts, and large datasets.",
      "Defined frontend data flow and component patterns for high-frequency UI updates.",
      "Integrated analytics, experimentation, Sentry, and Hotjar to connect UX decisions to product outcomes.",
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
        "Live dashboard data",
        "D3 chart rendering",
        "GSAP interaction motion",
        "Embed + webview tuning",
        "Readable high-density dashboards",
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
    // TODO(portfolio-media): Add 2–3 screenshots or a short walkthrough showing the final interface, edge states, and responsive behavior.
    links: [{ label: "Website", href: "https://emplifi.io" }],
  },
  {
    id: "pwa-performance-controltech",
    name: "ControlTech — startup product delivery, PWAs, and frontend systems",
    description:
      "Frontend delivery across multiple early-stage products, including PWAs, dashboards, workflow-heavy interfaces, offline-first behavior, reusable frontend patterns, and automated release pipelines.",
    role: "Frontend Engineer · Startup product delivery · ControlTech Startup Studio",
    contribution:
      "Owned frontend delivery across early-stage products, including product states, responsive UI, PWAs, testing, and release pipelines.",
    navLabel: "ControlTech PWA",
    signalStack: ["Jest + Playwright", "GitHub Actions CI/CD", "PWA + CDN delivery"],
    badges: ["Performance", "DX"],
    bestFor: ["Startup ownership", "PWAs", "Frontend systems", "Fast iteration"],
    tech: ["Vue", "Nuxt.js", "React", "React Native", "Jest", "Playwright", "GitHub Actions"],
    outcomes: [
      "Owned frontend delivery across multiple early-stage products, often working from incomplete requirements and rapidly changing priorities.",
      "Moved between product definition, interaction decisions, implementation, testing, and deployment with minimal process overhead.",
      "Built PWAs, dashboards, and workflow-heavy interfaces, refining responsive behavior and product states directly in code.",
      "Established reusable frontend patterns, automated testing, and release pipelines to help small teams ship quickly without creating avoidable regressions.",
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
        "Ambiguous product requirements",
        "Reusable frontend patterns",
        "PWA + offline-ready flows",
        "Automated tests + CI/CD",
        "Fast startup releases",
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
    // TODO(portfolio-media): Add 2–3 screenshots or a short walkthrough showing the final interface, edge states, and responsive behavior.
    links: [{ label: "Website", href: "https://ctrltech.org" }],
  },
];
