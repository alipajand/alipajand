export interface ProjectFigure {
  type: "image";
  src?: string;
  width: number;
  height: number;
  alt: string;
  captionLead: string;
  captionBody: string;
  disclosureLabel?: string;
}

export interface ProjectDecision {
  decision: string;
  why: string;
  tradeOff: string;
  result: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectResponsibility {
  owned: string[];
  collaborative: string[];
  outside: string[];
  factualReviewNote?: string;
}

export interface ProjectOverviewMeta {
  role: string;
  stack: string;
  scope: string;
  status: string;
  link: ProjectLink;
}

export interface ProjectTechnicalHighlight {
  title: string;
  description: string;
}

interface ProjectCaseStudyBase {
  title: string;
  overview: string;
  problem: string;
  interfaceEvidence?: ProjectFigure[];
}

export interface ProjectCaseStudyStandard extends ProjectCaseStudyBase {
  variant?: "standard";
  contextAndConstraints: string;
  responsibility: ProjectResponsibility;
  decisions: ProjectDecision[];
  workflow: string[];
  difficultStates: string[];
  outcome: string[];
  nextImprovements: string[];
}

export interface ProjectCaseStudyFounderProduct extends ProjectCaseStudyBase {
  variant: "founder-product";
  overviewMeta: ProjectOverviewMeta;
  productDecisions: string[];
  whatIBuilt: string[];
  technicalHighlights: ProjectTechnicalHighlight[];
  result: string;
}

export type ProjectCaseStudy = ProjectCaseStudyStandard | ProjectCaseStudyFounderProduct;

export const isFounderProductCaseStudy = (
  caseStudy: ProjectCaseStudy
): caseStudy is ProjectCaseStudyFounderProduct => caseStudy.variant === "founder-product";

export interface Project {
  id: string;
  slug: string;
  hasDedicatedCaseStudy: boolean;
  name: string;
  caseStudyTitle: string;
  caseStudyMetaDescription: string;
  employerContext: string;
  cardProblem: string;
  role: string;
  timeframe?: string;
  capabilityTags: string[];
  caseStudy: ProjectCaseStudy;
  relatedLinks: ProjectLink[];
}

export const PORTFOLIO_PAGE_HEADER_TITLE = "Product engineering case studies";

export const PORTFOLIO_PAGE_INTRO =
  "I work across product decisions, interface design, frontend architecture, design systems, and delivery. These case studies focus on the constraints, decisions, and implementation details behind the finished interfaces.";

export const PORTFOLIO_META_TITLE = "Product Engineering Case Studies — Ali Pajand";

export const PORTFOLIO_META_DESCRIPTION =
  "Case studies covering product engineering, frontend architecture, design systems, complex workflows, and AI-assisted interfaces.";

export const PORTFOLIO_CASE_STUDY_ORDER = [
  "ledgerguard-deterministic-commitments-ledger",
  "tallyfolio-privacy-first-personal-finance",
  "design-system-marketplace-login-web3",
  "mapbylaw-platform-ui-ai-reports",
  "data-dashboards-emplifi",
  "pwa-performance-controltech",
] as const;

export const PROJECTS: Project[] = [
  {
    id: "tallyfolio-privacy-first-personal-finance",
    slug: "tallyfolio",
    hasDedicatedCaseStudy: true,
    name: "TallyFolio",
    caseStudyTitle: "Privacy-first personal finance tracker",
    caseStudyMetaDescription:
      "A senior product engineering case study about building a privacy-first, manual-first personal finance PWA with deterministic calculations, import workflows, and production-grade auth.",
    employerContext:
      "Full-stack PWA for manual-first personal finance tracking, reporting, forecasting, and asset management.",
    cardProblem:
      "Most personal finance apps force users into bank aggregation or spreadsheets. TallyFolio needed modern product workflows without giving up privacy or manual control.",
    role: "Founder · Product Engineer · Designer",
    capabilityTags: ["Full-stack product", "Financial correctness", "Privacy boundaries"],
    caseStudy: {
      variant: "founder-product",
      title: "Privacy-first personal finance tracker",
      overview:
        "A full-stack PWA for manual-first personal finance tracking, built with deterministic financial calculations, CSV import workflows, reports, forecasting, subscriptions, investments, and asset tracking.",
      overviewMeta: {
        role: "Founder, Product Engineer, Designer",
        stack: "Next.js, TypeScript, Supabase, Postgres, RLS, Tailwind, shadcn/ui",
        scope: "Product strategy, UX, frontend, backend, database, security, docs",
        status: "Live",
        link: { label: "tallyfolio.com", href: "https://tallyfolio.com" },
      },
      problem:
        "Most personal finance apps force users into either bank aggregation or spreadsheets. I wanted a private, manual-first system that could still provide modern product workflows: import review, categorization, subscriptions, cash-flow forecasting, investment contributions, reports, and asset tracking.",
      productDecisions: [
        "Manual-first import flow instead of requiring bank aggregation",
        "Server-first data loading with authenticated server actions",
        "Financial values stored as integer minor units",
        "Pure domain modules for budgets, forecasts, reports, subscriptions, investments, and assets",
        "CSV/XLSX files parsed in memory and not persisted",
        "User-owned export flow",
        "Optional AI explanation constrained to restating already-computed figures",
        "PWA/mobile-first improvements for everyday personal use",
      ],
      whatIBuilt: [
        "Dashboard",
        "CSV import review",
        "Transaction management",
        "Budgets",
        "Reports",
        "Subscriptions",
        "Recurring schedules",
        "Forecast",
        "Investments",
        "Assets register",
        "Settings/export",
        "Public landing/support pages",
      ],
      technicalHighlights: [
        {
          title: "Financial correctness",
          description:
            "Amounts are stored as integer minor units and calculated through pure domain modules for budgets, forecasts, reports, subscriptions, investments, and assets so totals stay deterministic and testable.",
        },
        {
          title: "Import safety",
          description:
            "CSV and XLSX uploads are parsed in memory for review and categorization, then discarded rather than persisted as raw files on the server.",
        },
        {
          title: "Privacy boundaries",
          description:
            "Manual-first tracking without requiring bank aggregation, with authenticated access and Postgres row-level security defining what each user can read or write.",
        },
        {
          title: "Recurring transaction modeling",
          description:
            "Subscriptions and recurring schedules are modeled as first-class domain objects separate from one-off transactions, keeping cash-flow forecasting aligned to schedule truth.",
        },
        {
          title: "Asset modeling",
          description:
            "An assets register tracks holdings alongside cash-flow workflows without conflating investment contributions with everyday spending categories.",
        },
        {
          title: "Mobile/PWA execution",
          description:
            "Mobile-first layouts and PWA affordances support everyday personal finance use outside a desktop-only workflow assumption.",
        },
        {
          title: "AI boundary design",
          description:
            "Optional AI explanations are constrained to restating already-computed figures rather than generating new financial advice or inferred numbers.",
        },
      ],
      result:
        "Result: shipped a live full-stack finance product with production-grade auth, privacy boundaries, deterministic financial calculations, mobile/PWA support, import workflows, and a documented architecture suitable for long-term extension.",
      interfaceEvidence: [
        {
          type: "image",
          src: "/portfolio-media/tallyfolio-landing.png",
          width: 3456,
          height: 2234,
          alt: "TallyFolio landing page",
          captionLead: "Landing page.",
          captionBody:
            "Public landing and support pages introduce the manual-first product positioning before authenticated finance workflows.",
        },
        {
          type: "image",
          src: "/portfolio-media/tallyfolio-dashboard.png",
          width: 3454,
          height: 1982,
          alt: "TallyFolio dashboard showing manual-first finance summaries, recent activity, and navigation into budgets, reports, and import workflows.",
          captionLead: "Dashboard.",
          captionBody:
            "The authenticated home surface orients everyday personal finance work around deterministic totals and clear paths into import review, budgets, and reporting.",
        },
      ],
    },
    relatedLinks: [{ label: "Live product", href: "https://tallyfolio.com" }],
  },
  {
    id: "ledgerguard-deterministic-commitments-ledger",
    slug: "ledgerguard",
    hasDedicatedCaseStudy: true,
    name: "LedgerGuard",
    caseStudyTitle: "Designing a trustworthy contract review and renewal workflow",
    caseStudyMetaDescription:
      "A product engineering case study about traceable AI-assisted contract review, human verification, renewal risk, and financial commitments.",
    employerContext:
      "AI contract intelligence SaaS for renewals, commitments, notice windows, and financial exposure.",
    cardProblem:
      "Finance teams needed renewal risk they could trust, even when OCR, extraction, synthesis, and portfolio rows landed out of order or partially failed.",
    role: "Senior Product Engineer · LedgerGuard",
    capabilityTags: ["AI workflows", "Frontend architecture", "Product ownership"],
    caseStudy: {
      title: "Designing a trustworthy contract review and renewal workflow",
      overview:
        "LedgerGuard needed to turn noisy contract extraction into a product workflow that finance teams could actually rely on. The work covered document review, verification, renewal truth, and portfolio visibility rather than a narrow UI slice.",
      contextAndConstraints:
        "The product sat across Next.js, Fastify, Python workers, and Supabase/Postgres. Tenant isolation, idempotent worker replay, and clause-backed traceability were non-negotiable because a polished dashboard is not useful if the commitments behind it are stale, skewed, or unverifiable.",
      responsibility: {
        owned: [
          "Designed the product experience across upload, verification, commitments, renewal risk, and portfolio views.",
          "Built the buyer-facing and operator-facing frontend surfaces and the typed tenant/admin API contracts they depended on.",
          "Codified how renewal truth should be surfaced when newer synthesis, stale rows, or fields-only recovery disagree.",
        ],
        collaborative: [
          "Domain rules and worker callbacks had to align across the Fastify API and Python extraction pipeline; the repository shows the cross-system dependency, but not a subsystem-by-subsystem contributor split.",
          "Product language around verification, warnings, and auditability depended on coordination between interface decisions and the underlying contract-processing model.",
        ],
        outside: [
          "Commercial outcomes, finance team operating metrics, and any model-training details are not established in this repository.",
          "The repository does not document ownership for every backend or extraction subsystem beyond the frontend, contracts, and product architecture responsibilities described here.",
        ],
      },
      problem:
        "Renewal and spend-at-risk views only matter if users trust the underlying commitments. If the interface quietly treats the first persisted value as truth, it can present confident renewal recommendations on top of stale synthesis, partial extraction, or version-skewed portfolio data.",
      decisions: [
        {
          decision:
            "Separate deterministic API truth from probabilistic worker output instead of letting workers write tenant truth directly.",
          why: "The UI needed a stable read model that could explain where a renewal value came from and whether it was safe to trust.",
          tradeOff:
            "This adds callback and repair-planning complexity compared with simply persisting worker output into the main product tables.",
          result:
            "Verification and renewal screens can show clause-backed truth, partial states, and drift warnings without pretending the pipeline is always complete.",
        },
        {
          decision:
            "Surface drift, skew, and incomplete ledger states explicitly rather than collapsing them into a green success path.",
          why: "Finance reviewers need to know when to stop and inspect evidence instead of absorbing inferred certainty from the interface.",
          tradeOff:
            "Honest warnings create more UI surface area and require more nuanced copy, empty states, and review logic.",
          result:
            "The product communicates uncertainty in a bounded way and keeps human review connected to the source evidence that matters.",
        },
      ],
      workflow: [
        "Contract upload starts an async OCR and extraction pipeline.",
        "Verification surfaces extracted values, source evidence, and incomplete or conflicting fields for review.",
        "Validated callbacks update the commitments ledger through domain rules rather than direct worker writes.",
        "Renewal-risk and portfolio views read from that reconciled truth model, including drift or recovery metadata.",
      ],
      interfaceEvidence: [
        {
          type: "image",
          src: "/portfolio-media/ledgerguard-landing.png",
          width: 3456,
          height: 2234,
          alt: "LedgerGuard landing page introducing contract intelligence for renewals, commitments, notice windows, and financial exposure.",
          captionLead: "Landing page.",
          captionBody:
            "The public entry point frames the product around traceable contract review rather than opaque AI summaries.",
        },
        {
          type: "image",
          src: "/portfolio-media/ledgerguard-login.png",
          width: 3456,
          height: 2234,
          alt: "LedgerGuard sign-in interface establishing tenant access before contract upload, verification, and portfolio workflows.",
          captionLead: "Authentication entry.",
          captionBody:
            "Production auth sits ahead of tenant-scoped contract workflows so portfolio and verification surfaces stay within explicit access boundaries.",
        },
        {
          type: "image",
          src: "/portfolio-media/ledgerguard-dashboard.png",
          width: 3456,
          height: 2234,
          alt: "LedgerGuard portfolio dashboard showing renewal risk, commitment exposure, and contract status across reconciled ledger rows.",
          captionLead: "Portfolio dashboard.",
          captionBody:
            "Renewal-risk and portfolio views read from the same reconciled truth model, keeping drift, skew, and incomplete ledger states visible before they influence spend-at-risk summaries.",
        },
      ],
      difficultStates: [
        "Partial extraction and fields-only recovery are surfaced as review-required states rather than hidden fallbacks.",
        "Stale or conflicting data is called out through drift and skew messaging before it affects renewal visibility.",
        "Async completion and replay behavior are reflected in the UI so a late worker result does not look like a definitive answer.",
        "Human review stays connected to source evidence instead of collapsing into a generic confidence score.",
      ],
      outcome: [
        "A production workflow for contract review, verification, renewal risk, and portfolio visibility shipped as one coherent product experience.",
        "Reusable UI patterns were established for source evidence, partial truth, warnings, and review-required states in an AI-assisted workflow.",
        "The product can communicate when the ledger is incomplete or skewed instead of overstating certainty.",
      ],
      nextImprovements: [
        "Tighten the portfolio-level summaries for drift, skew, and incomplete ledger state so reviewers can prioritize exceptions faster.",
        "Add more evidence views covering mobile and edge-state verification paths to make responsive review behavior easier to audit.",
      ],
    },
    relatedLinks: [
      { label: "Live product", href: "https://ledgerguard.io/" },
      {
        label: "Related writing",
        href: "/writing/ledgerguard-truth-between-extraction-and-finance",
      },
    ],
  },
  {
    id: "design-system-marketplace-login-web3",
    slug: "alwaysgeeky",
    hasDedicatedCaseStudy: true,
    name: "AlwaysGeeky Games",
    caseStudyTitle: "Shipping marketplace and authentication flows on a reusable design system",
    caseStudyMetaDescription:
      "A product engineering case study about marketplace and authentication flows on a reusable design system with Web3 error handling and accessibility.",
    employerContext:
      "Marketplace, authentication, and Web3 product surfaces delivered with shared UI, Storybook documentation, and CI quality checks.",
    cardProblem:
      "Marketplace and login flows had to match design intent, survive real wallet and API failures, and stay accessible without becoming a collection of one-off UI fixes.",
    role: "Senior Frontend Engineer · Design systems · AlwaysGeeky Games",
    capabilityTags: ["Design systems", "Accessibility", "Frontend delivery"],
    caseStudy: {
      title: "Shipping marketplace and authentication flows on a reusable design system",
      overview:
        "This work connected design-system implementation to the product surfaces people actually used: marketplace browsing, login, wallet interactions, and the error-prone states around them. The goal was not just visual consistency, but production-ready behavior under Web3 and API constraints.",
      contextAndConstraints:
        "The product needed WCAG-conscious components, close design-to-code translation, and delivery speed without dropping error handling for wallet connections, API failures, or authentication edge cases. Storybook and CI had to reinforce the same patterns used in the shipped interfaces.",
      responsibility: {
        owned: [
          "Built and evolved the shared component architecture and frontend states used across marketplace and authentication flows.",
          "Storybook served as the main documentation and component-discovery surface for the shared design system.",
          "Implemented marketplace and login interfaces with explicit loading, empty, error, and success states.",
          "CI included linting, type checks, tests, and accessibility-oriented quality checks.",
        ],
        collaborative: [
          "The design system and product surfaces were built in close coordination with design, especially where Figma intent left practical interaction and responsive gaps to resolve in code.",
          "Wallet, authentication, and API integrations depended on backend and platform boundaries outside the frontend scope described here.",
        ],
        outside: [
          "Backend integration, game-system, and commercial marketplace outcomes are not attributed in this case study.",
          "Brand strategy and product direction beyond the documented frontend and design-system work are not attributed here.",
        ],
      },
      problem:
        "Teams were shipping marketplace and authentication experiences that had to do more than look polished. They needed to reuse design-system primitives, handle real wallet and API failures, and avoid turning production Web3 behavior into a demo-only happy path.",
      decisions: [
        {
          decision:
            "Use Storybook as the main documentation and component-discovery surface for the shared design system instead of treating it as a loose visual library.",
          why: "Marketplace and login flows needed the same primitives, states, and accessibility behavior to avoid drift as product surfaces multiplied.",
          tradeOff:
            "Codifying the design system adds maintenance work and slows ad-hoc one-off UI work in the short term.",
          result:
            "Storybook served as the main documentation and component-discovery surface for the shared design system, and shared components became the baseline for production surfaces.",
        },
        {
          decision:
            "Treat non-happy-path states as part of the product system rather than cleanup work after the main interface ships.",
          why: "Wallet connectivity, authentication, and API-backed marketplaces fail in distinctive ways that users experience directly.",
          tradeOff:
            "Explicit loading, validation, recovery, and failure states increase the implementation and QA surface.",
          result:
            "Marketplace and login flows remained understandable when requests stalled, wallets failed, or account access needed recovery.",
        },
      ],
      workflow: [
        "Design-system primitives and tokens define the shared visual and interaction baseline.",
        "Storybook served as the main documentation and component-discovery surface for the shared design system.",
        "Marketplace and authentication flows reuse those components across responsive layouts.",
        "CI included linting, type checks, tests, and accessibility-oriented quality checks.",
      ],
      interfaceEvidence: [
        {
          type: "image",
          src: "/portfolio-media/alwaysgeeky-marketplace.png",
          width: 3456,
          height: 2234,
          alt: "AlwaysGeeky marketplace surface showing responsive catalog cards, navigation, and calls to action that rely on a shared design-system baseline.",
          captionLead: "Marketplace surface.",
          captionBody:
            "Catalog browsing, merchandising, and action states stay visually consistent because they share the same component APIs and responsive rules.",
        },
        {
          type: "image",
          src: "/portfolio-media/alwaysgeeky-login.png",
          width: 3456,
          height: 2234,
          alt: "AlwaysGeeky authentication interface showing shared form patterns and recovery affordances so wallet and account access flows stay consistent with the rest of the product.",
          captionLead: "Authentication flow.",
          captionBody:
            "The same component system carries validation, loading, and recovery states through account-access workflows instead of relying on separate one-off screens.",
        },
      ],
      difficultStates: [
        "Loading and empty states were designed as first-class component states rather than temporary placeholders.",
        "Validation failures and authentication recovery were handled within the same UI system as the main account flows.",
        "Wallet and API failures required explicit error and retry surfaces rather than optimistic happy-path assumptions.",
      ],
      outcome: [
        "A reusable component baseline shipped across marketplace and authentication surfaces instead of isolated screens.",
        "CI included linting, type checks, tests, and accessibility-oriented quality checks.",
        "Marketplace and login flows gained explicit loading, error, and recovery states instead of relying on happy-path-only UI.",
      ],
      nextImprovements: [
        "Expand product-level regression coverage around wallet-connect and purchase paths so shared-component changes expose workflow effects even earlier.",
        "Document more design-to-code edge cases in Storybook so interaction decisions remain traceable as the system grows.",
      ],
    },
    relatedLinks: [
      { label: "Marketplace", href: "https://market.voxies.io" },
      { label: "Login", href: "https://login.voxies.io/" },
    ],
  },
  {
    id: "data-dashboards-emplifi",
    slug: "emplifi",
    hasDedicatedCaseStudy: true,
    name: "Emplifi",
    caseStudyTitle: "Keeping dense dashboards responsive in embedded and mobile webview contexts",
    caseStudyMetaDescription:
      "A product engineering case study about dense analytics dashboards, D3.js visualizations, GSAP motion, and performance in embedded mobile webview contexts.",
    employerContext:
      "Enterprise analytics dashboards built with React, TypeScript, D3.js, and GSAP under tight rendering budgets.",
    cardProblem:
      "Data-heavy dashboards had to stay readable and responsive inside mobile webviews and embedded hosts where motion and rendering costs could become jank immediately.",
    role: "Senior Frontend Engineer · Dashboards & performance · Emplifi",
    capabilityTags: ["Data-heavy UI", "Performance", "Interaction design"],
    caseStudy: {
      title: "Keeping dense dashboards responsive in embedded and mobile webview contexts",
      overview:
        "Emplifi’s dashboard work focused on the harder version of data visualization UI: dense information, interaction-heavy charts, and performance constraints inside embedded and mobile-webview environments. The challenge was not chart rendering alone, but preserving legibility and responsiveness when browser budgets were limited.",
      contextAndConstraints:
        "The same dashboard patterns had to survive standalone use, embedded hosts, and mobile webviews. D3.js and GSAP enabled fidelity and motion, but they also demanded disciplined rendering budgets and careful profiling to avoid jitter, layout thrash, or unreadable small-screen density.",
      responsibility: {
        owned: [
          "I owned the frontend implementation and interaction work, collaborating with product, design, analytics, and backend contributors.",
          "Built dashboard UI behavior with React, TypeScript, D3.js, and GSAP.",
          "Tuned rendering and interaction performance for embedded and mobile-webview contexts.",
          "Defined frontend patterns for handling dense data updates and chart interactions.",
        ],
        collaborative: [
          "Motion and data-density choices had to coordinate with the surrounding product surfaces and host environments rather than existing as isolated chart work.",
        ],
        outside: [
          "Backend analytics pipelines, experimentation strategy, and commercial reporting outcomes are not established in this repository.",
        ],
      },
      problem:
        "Dashboards that feel acceptable on a desktop can break down quickly in embedded or mobile-webview contexts. High-density charts, frequent UI updates, and motion-heavy interactions can overwhelm CPU and layout budgets, leaving users with sluggish or unreadable reporting surfaces.",
      decisions: [
        {
          decision:
            "Use D3.js for chart fidelity and GSAP for bounded motion, then profile the interaction cost instead of assuming the stack would behave well by default.",
          why: "The product needed expressive dashboards and controlled motion, but only within tight performance budgets.",
          tradeOff:
            "Richer motion and chart control increase implementation complexity and require more profiling discipline than static visualizations.",
          result:
            "Dashboard interactions stayed controlled in constrained contexts instead of degrading into unbounded animation cost.",
        },
        {
          decision:
            "Optimize specifically for embedded and mobile-webview paths rather than treating them as smaller desktop layouts.",
          why: "Those hosts have different CPU, layout, and chrome assumptions, so generic responsive behavior is not enough.",
          tradeOff: "Host-specific tuning adds separate QA and implementation paths to maintain.",
          result:
            "The interfaces remained usable in the environments where tight rendering budgets would otherwise surface first.",
        },
      ],
      workflow: [
        "Dashboard data feeds chart and interaction components built in React and D3.js.",
        "GSAP motion is applied selectively where it improves orientation without exceeding frame budgets.",
        "Performance tuning targets embedded and mobile-webview paths with tighter layout and CPU constraints.",
        "The resulting patterns inform readable high-density dashboard layouts across those hosts.",
      ],
      difficultStates: [
        "Motion degrades gracefully when frame budgets are tight instead of assuming full-desktop rendering headroom.",
        "Dense data views are tuned for smaller or embedded hosts where layout space and CPU are limited.",
        "High-frequency interaction work is bounded so chart updates do not overwhelm surrounding dashboard controls.",
      ],
      outcome: [
        "Enterprise dashboard interfaces shipped with controlled motion and more predictable rendering behavior in embedded and mobile-webview contexts.",
        "Frontend patterns were established for dense chart layouts and high-frequency interaction updates.",
        "Performance tuning focused on real host constraints rather than a desktop-only happy path.",
      ],
      nextImprovements: [
        "Document explicit motion and rendering budgets per dashboard pattern so new surfaces inherit the same constraints more consistently.",
        "Capture more production evidence for embedded and mobile-webview edge states to complement the implementation narrative in this repository.",
      ],
    },
    relatedLinks: [{ label: "Company website", href: "https://emplifi.io" }],
  },
  {
    id: "mapbylaw-platform-ui-ai-reports",
    slug: "mapbylaw",
    hasDedicatedCaseStudy: true,
    name: "MapBylaw",
    caseStudyTitle: "Aligning typed product workflows, policy-aware AI, and bilingual reports",
    caseStudyMetaDescription:
      "A product engineering case study about typed product workflows, policy-aware AI recommendations, and bilingual property reports.",
    employerContext:
      "Map-first property insights platform with shared UI, typed APIs, AI recommendations, and bilingual report generation.",
    cardProblem:
      "Web, admin, AI recommendations, and bilingual reports all needed to stay aligned to verified zoning and feasibility data instead of drifting into disconnected product states.",
    role: "Senior Product Engineer · Frontend architecture & product UI · MapBylaw",
    capabilityTags: ["Design systems", "AI workflows", "Typed contracts"],
    caseStudy: {
      title: "Aligning typed product workflows, policy-aware AI, and bilingual reports",
      overview:
        "MapBylaw needed a product system where the dashboard, admin workflows, AI recommendations, and bilingual premium reports all agreed on the same verified property inputs. The work combined shared UI foundations with contract-driven data flow and policy-aware AI constraints.",
      contextAndConstraints:
        "Fastify APIs, Zod/OpenAPI contracts, shared UI, and React-PDF reports had to move together as incentives, policies, and scenario rules changed. Content policy also ruled out fabricated market stand-ins, which meant AI outputs had to stay narrow and tied to verified scenario data.",
      responsibility: {
        owned: [
          "Built the shared `@mapbylaw/ui` foundation used across web and admin surfaces.",
          "Aligned Fastify APIs, Zod/OpenAPI contracts, and typed React-PDF payloads on the same data model.",
          "Constrained AI recommendations to typed, scenario-specific inputs grounded in policy and feasibility rules.",
        ],
        collaborative: [
          "Scenario logic, zoning interpretation, and report requirements depended on product and domain collaboration beyond the frontend surface itself.",
          "The repository shows close alignment between dashboard, API, and report work, but it does not break down every contributor by subsystem.",
        ],
        outside: [
          "The repository does not attribute ownership for every backend service, municipal-data source, or domain-policy decision.",
          "Commercial outcomes and customer adoption metrics are not established here.",
        ],
      },
      problem:
        "A property-analysis workflow becomes brittle when the dashboard, AI recommendations, and report generator drift apart. If each layer interprets scenario inputs differently, the product starts presenting inconsistent advice or report output even when the UI looks coherent.",
      decisions: [
        {
          decision:
            "Build a shared `@mapbylaw/ui` foundation and feature-based app structure instead of letting web and admin evolve separate interface systems.",
          why: "The product needed one visual and interaction language across analysis, admin, and report-adjacent states.",
          tradeOff:
            "Shared foundations create upfront structure and maintenance work compared with fast isolated page-level components.",
          result:
            "Web and admin surfaces stayed aligned on accessibility behavior, state handling, and reusable component patterns.",
        },
        {
          decision:
            "Use OpenAPI and Zod at the product boundary so dashboards, AI recommendations, and React-PDF reports consume the same verified shapes.",
          why: "Scenario recommendations and bilingual reports lose credibility quickly if they diverge from the dashboard’s source model.",
          tradeOff:
            "Strict schemas and audits add ongoing maintenance as incentive rules and scenario logic change.",
          result:
            "The product can evolve policies and recommendations without relying on ad-hoc copy fixes or loosely typed payload glue.",
        },
      ],
      workflow: [
        "Verified property inputs feed typed zoning and feasibility APIs.",
        "Shared UI surfaces present dashboard and admin workflows against those same verified shapes.",
        "AI recommendations consume narrow scenario-specific inputs instead of free-form prompt context.",
        "Bilingual React-PDF reports render from the same validated payload model used in the product.",
      ],
      interfaceEvidence: [
        {
          type: "image",
          src: "/portfolio-media/mapbylaw-landing.png",
          width: 3456,
          height: 2234,
          alt: "MapBylaw landing page introducing map-led property insights, zoning analysis, and feasibility reporting.",
          captionLead: "Landing page.",
          captionBody:
            "The public surface sets expectations for evidence-backed property analysis before users enter typed dashboard and report workflows.",
        },
        {
          type: "image",
          src: "/portfolio-media/mapbylaw-dashboard.png",
          width: 3452,
          height: 1980,
          alt: "MapBylaw analysis dashboard showing map-led property context, structured recommendation modules, and report-ready data aligned to typed contracts.",
          captionLead: "Analysis dashboard.",
          captionBody:
            "The same structured inputs support product decisions, AI recommendations, and report generation so the interface does not drift from the underlying policy model.",
        },
      ],
      difficultStates: [
        "Malformed or overly broad AI payloads are rejected early so recommendations stay scenario-specific.",
        "Changing incentives and policy rules require synchronized updates across API contracts, shared UI, and bilingual report output.",
        "The product avoids generic AI responses by constraining recommendation inputs to verified scenario data.",
      ],
      outcome: [
        "A shared design language and typed contract system shipped across web, admin, and report workflows.",
        "AI recommendations stayed aligned to policy-aware scenario inputs instead of drifting into generic chatbot output.",
        "The report pipeline supports bilingual output while sharing the same validated data model.",
      ],
      nextImprovements: [
        "Continue expanding audit coverage around policy changes so report, dashboard, and recommendation drift is caught even earlier.",
        "Add more evidence around bilingual and premium-report edge states.",
      ],
    },
    relatedLinks: [
      { label: "Live product", href: "https://mapbylaw.ca/" },
      { label: "Related writing", href: "/writing/mapbylaw-ai-recommendations" },
    ],
  },
  {
    id: "pwa-performance-controltech",
    slug: "controltech",
    hasDedicatedCaseStudy: false,
    name: "ControlTech",
    caseStudyTitle:
      "Shipping startup product workflows that tolerate slow networks and fast release cycles",
    caseStudyMetaDescription:
      "A product engineering case study about startup delivery across PWAs, dashboards, and workflow-heavy interfaces under fast release cycles.",
    employerContext:
      "Startup product delivery across PWAs, dashboards, and workflow-heavy interfaces inside ControlTech Startup Studio.",
    cardProblem:
      "Early-stage products needed to load quickly, survive flaky connections, and release repeatedly without breaking their primary workflows.",
    role: "Frontend Engineer · Startup product delivery · ControlTech Startup Studio",
    capabilityTags: ["PWAs", "Release reliability", "Frontend systems"],
    caseStudy: {
      title:
        "Shipping startup product workflows that tolerate slow networks and fast release cycles",
      overview:
        "At ControlTech, the frontend work spanned multiple early-stage products rather than one polished flagship surface. The recurring challenge was turning ambiguous requirements into usable product flows that remained stable on modest hardware, unstable networks, and small-team release schedules.",
      contextAndConstraints:
        "The stack moved across Vue, Nuxt, React, and React Native, with PWA requirements where the product demanded offline-capable shells. Reusable patterns, automated tests, and release pipelines mattered because early adopters feel regressions immediately when teams ship fast.",
      responsibility: {
        owned: [
          "I owned frontend delivery across multiple early-stage products, moving between product definition, implementation, testing, and release.",
          "Built startup product surfaces across Vue, Nuxt, React, and React Native.",
          "Set up route-level code splitting, CDN-backed delivery, PWA caching where needed, and CI test gates with Jest, Playwright, and GitHub Actions.",
        ],
        collaborative: [
          "Product requirements and scope changed quickly across multiple early-stage efforts, so delivery depended on close iteration with small product and engineering teams.",
        ],
        outside: [
          "The repository does not establish ownership for every backend service, mobile-platform concern, or commercial startup outcome.",
        ],
      },
      problem:
        "When products ship quickly on small teams, the primary failure mode is not a missing feature. It is a flow that becomes too heavy for slow connections, too brittle for repeated releases, or too fragile to tolerate intermittent network conditions.",
      decisions: [
        {
          decision:
            "Invest in reusable frontend patterns and CI gates early instead of treating them as cleanup after the product stabilized.",
          why: "Small teams shipping frequently need repeatable quality signals or regressions will keep landing on primary flows.",
          tradeOff:
            "Tests, pipelines, and shared patterns take time that could otherwise go into short-term feature output.",
          result:
            "Automated tests and CI gates gave repeated delivery a clearer quality baseline than relying on manual verification alone.",
        },
        {
          decision:
            "Use route-level splitting, CDN-backed assets, and PWA caching where product requirements justified it.",
          why: "First-load pain and unstable networks were practical product constraints, not theoretical optimization targets.",
          tradeOff:
            "Caching and offline behavior add invalidation complexity and require more careful coordination with release behavior.",
          result:
            "Route-level splitting, CDN delivery, and PWA caching patterns targeted first-load pain and intermittent connectivity constraints.",
        },
      ],
      workflow: [
        "Ambiguous requirements are shaped into reusable interface and state patterns.",
        "Product routes are optimized through splitting, CDN delivery, and PWA behavior where needed.",
        "Automated tests and GitHub Actions gates protect primary flows before release.",
        "The same foundations support rapid iteration across multiple early-stage products.",
      ],
      difficultStates: [
        "Slow-network loading states had to remain usable rather than blocking core flows behind heavy initial loads.",
        "Offline-capable shells required careful trade-offs between resilience and cache freshness.",
        "Retry and recovery behavior mattered because release velocity and unstable connections amplify small regressions quickly.",
      ],
      outcome: [
        "Automated tests and CI gates supported repeated startup delivery with a clearer baseline than manual checks alone.",
        "Performance patterns targeted first-load pain and intermittent connectivity rather than desktop-only assumptions.",
        "Workflow-heavy interfaces were shaped directly in code under changing requirements and small-team constraints.",
      ],
      nextImprovements: [
        "Strengthen cache invalidation and recovery guidance for offline-capable flows as products evolve.",
        "Capture more product-specific evidence so individual startup engagements can be separated more clearly in the portfolio narrative.",
      ],
    },
    relatedLinks: [{ label: "Company website", href: "https://ctrltech.org" }],
  },
];
