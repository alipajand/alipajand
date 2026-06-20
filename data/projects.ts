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

export interface ProjectTechnicalHighlight {
  title: string;
  description: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectCaseStudy {
  overview: string;
  context: string;
  problem: string;
  myRole: string[];
  whatIBuilt: string[];
  technicalDecisions: ProjectDecision[];
  uxDecisions: string[];
  outcome: string[];
  nextImprovements: string[];
  interfaceEvidence?: ProjectFigure[];
}

export interface Project {
  id: string;
  slug: string;
  hasDedicatedCaseStudy: boolean;
  name: string;
  caseStudyTitle: string;
  caseStudyMetaTitle: string;
  caseStudyMetaDescription: string;
  employerContext: string;
  cardProblem: string;
  role: string;
  timeframe?: string;
  capabilityTags: string[];
  caseStudy: ProjectCaseStudy;
  relatedLinks: ProjectLink[];
}

export const PORTFOLIO_PAGE_HEADER_TITLE = "Portfolio";

export const PORTFOLIO_PAGE_INTRO =
  "Case studies from production work across SaaS products, enterprise analytics, AI-assisted workflows, and design systems. Each one documents the problem, my role, the decisions I made, and the product or engineering outcome.";

export const PORTFOLIO_META_TITLE = "Portfolio — Ali Pajand · Senior Frontend Engineer";

export const PORTFOLIO_META_DESCRIPTION =
  "Case studies from production work across AI product UI, design systems, enterprise dashboards, and SaaS. React, Next.js, TypeScript, D3.js, Storybook. Senior Frontend Engineer — Ali Pajand.";

export const PORTFOLIO_CASE_STUDY_ORDER = [
  "ledgerguard",
  "alwaysgeeky",
  "tallyfolio",
  "emplifi",
  "controltech",
  "agent-tooling",
  "mapbylaw",
] as const;

export const PROJECTS: Project[] = [
  {
    id: "ledgerguard",
    slug: "ledgerguard",
    hasDedicatedCaseStudy: true,
    name: "LedgerGuard",
    caseStudyTitle: "AI Contract Intelligence SaaS",
    caseStudyMetaTitle: "LedgerGuard — AI Contract Intelligence SaaS · Ali Pajand",
    caseStudyMetaDescription:
      "Case study: Multi-tenant SaaS for AI contract intelligence. Next.js App Router, TypeScript, human-in-the-loop review UI, async AI extraction states, and document ingestion. Ali Pajand, Senior Product Engineer.",
    employerContext:
      "AI contract intelligence SaaS for renewals, commitments, notice windows, and financial exposure.",
    cardProblem:
      "AI-powered contract intelligence platform for tracking renewals, financial commitments, and notice windows. Built the frontend architecture solo, including document ingestion flows, async AI extraction states, and a review UI that separates AI-suggested values from confirmed user-reviewed data.",
    role: "Senior Product Engineer",
    timeframe: "2026–Present",
    capabilityTags: [
      "Next.js App Router",
      "TypeScript",
      "Human-in-the-loop UX",
      "Async AI extraction",
      "Document review workflows",
    ],
    caseStudy: {
      overview:
        "LedgerGuard is an AI-powered contract intelligence product for tracking renewals, commitments, and notice windows. The frontend had to make long-running extraction work understandable while keeping the review surface trustworthy for product users.",
      context:
        "The product combines document ingestion, async extraction, tenant-aware product flows, and review-heavy dashboard work. The interface needed to stay clear about what came from the system and what had been confirmed by a user.",
      problem:
        "Contract extraction is not useful on its own if the UI makes uncertain output look final. The product needed a workflow that could show in-progress extraction, surface AI-suggested values safely, and support confirmation without collapsing everything into a single success state.",
      myRole: [
        "Built the frontend architecture and product UI solo across landing, authentication, upload, review, and dashboard flows.",
        "Designed the typed React and Next.js boundaries for async document ingestion and review states.",
        "Defined how AI-suggested values and confirmed user-reviewed data should be presented distinctly in the interface.",
      ],
      whatIBuilt: [
        "Document ingestion and upload flows tied to async extraction states.",
        "Tenant-aware dashboard navigation and review surfaces for contract data.",
        "Verification UI that keeps AI-suggested values separate from confirmed user-reviewed data.",
        "Portfolio and renewal visibility screens that communicate incomplete or in-progress states.",
      ],
      technicalDecisions: [
        {
          decision:
            "Use a typed Next.js App Router frontend with explicit boundaries between server-rendered product surfaces and client-side review interactions.",
          why: "The product needed predictable data flow and clear separation between page composition, mutations, and interactive review states.",
          tradeOff:
            "This adds structure and coordination overhead compared with pushing all behavior into a single client-heavy dashboard.",
          result:
            "The product kept route, data, and interaction concerns easier to reason about as the workflow expanded.",
        },
        {
          decision:
            "Model extraction as an async workflow with visible intermediate states instead of hiding processing behind a single loading spinner.",
          why: "Document review depends on whether extraction has started, partially completed, failed, or produced values that still need review.",
          tradeOff: "More UI states mean more implementation and copy work across the review flow.",
          result:
            "Users can tell whether the product is waiting, recovering, or ready for confirmation instead of guessing from a generic pending state.",
        },
      ],
      uxDecisions: [
        "Used language that distinguishes AI-suggested values from confirmed user-reviewed data throughout the workflow.",
        "Kept source context visible where available so review decisions stay tied to the contract rather than to a generic summary.",
        "Treated incomplete extraction and review-required states as first-class product states rather than edge-case modals.",
      ],
      interfaceEvidence: [
        {
          type: "image",
          src: "/portfolio-media/ledgerguard-landing.png",
          width: 3456,
          height: 2234,
          alt: "LedgerGuard landing page introducing AI-assisted contract intelligence for renewals and commitments.",
          captionLead: "Landing page.",
          captionBody:
            "The public positioning frames the product around contract workflows rather than opaque AI output.",
        },
        {
          type: "image",
          src: "/portfolio-media/ledgerguard-login.png",
          width: 3456,
          height: 2234,
          alt: "LedgerGuard sign-in screen for tenant-aware contract workflows.",
          captionLead: "Authentication.",
          captionBody:
            "The sign-in flow sits in front of tenant-aware document and dashboard work without over-claiming access controls beyond what is visible here.",
        },
        {
          type: "image",
          src: "/portfolio-media/ledgerguard-dashboard.png",
          width: 3456,
          height: 2234,
          alt: "LedgerGuard dashboard showing contract status, renewal visibility, and review workflows.",
          captionLead: "Dashboard.",
          captionBody:
            "The dashboard keeps review state, contract visibility, and renewal workflows legible without treating extraction output as final by default.",
        },
      ],
      outcome: [
        "Shipped a coherent frontend workflow for document ingestion, extraction review, and contract visibility.",
        "Established reusable UI patterns for async AI extraction states and human review.",
        "Kept the interface explicit about the difference between suggested output and confirmed data.",
      ],
      nextImprovements: [
        "Add more product-level evidence around exception handling so reviewers can prioritize the highest-risk contracts faster.",
        "Continue refining summary views so incomplete extraction states are easier to scan across larger contract sets.",
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
    id: "tallyfolio",
    slug: "tallyfolio",
    hasDedicatedCaseStudy: true,
    name: "TallyFolio",
    caseStudyTitle: "Privacy-first personal finance tracker",
    caseStudyMetaTitle: "TallyFolio — Privacy-first Personal Finance Tracker · Ali Pajand",
    caseStudyMetaDescription:
      "Case study: Privacy-first personal finance tracker built as a manual-first PWA. Next.js, TypeScript, deterministic financial calculations, import review workflows, and production-grade auth. Ali Pajand.",
    employerContext:
      "Full-stack PWA for manual-first personal finance tracking, reporting, forecasting, and asset management.",
    cardProblem:
      "Most personal finance apps force users into bank aggregation or spreadsheets. TallyFolio needed modern product workflows without giving up privacy or manual control.",
    role: "Founder · Product Engineer · Designer",
    timeframe: "Independent",
    capabilityTags: ["Full-stack product", "Financial correctness", "Privacy boundaries"],
    caseStudy: {
      overview:
        "A full-stack PWA for manual-first personal finance tracking, built with deterministic financial calculations, CSV import workflows, reports, forecasting, subscriptions, investments, and asset tracking.",
      context:
        "TallyFolio is a manual-first personal finance product built around privacy, deterministic calculations, and everyday workflows that do not depend on bank aggregation. The product needed modern import, reporting, and forecasting UX without losing user control over the data model.",
      problem:
        "Most personal finance apps force users into either bank aggregation or spreadsheets. I wanted a private, manual-first system that could still provide modern product workflows: import review, categorization, subscriptions, cash-flow forecasting, investment contributions, reports, and asset tracking.",
      myRole: [
        "Defined the product strategy, UX, frontend architecture, backend shape, and data model.",
        "Built the authenticated product workflows for imports, reporting, budgets, forecasting, subscriptions, investments, and assets.",
        "Designed the system boundaries around deterministic finance logic, privacy, and optional AI explanations.",
      ],
      whatIBuilt: [
        "Dashboard and authenticated home workflows.",
        "CSV import review and transaction management.",
        "Budgets, reports, subscriptions, recurring schedules, and forecast views.",
        "Investments, asset register, and export/settings flows.",
        "Public landing and support pages for the product.",
      ],
      technicalDecisions: [
        {
          decision:
            "Store financial values as integer minor units and keep calculations in pure domain modules.",
          why: "Budgets, forecasts, reports, subscriptions, investments, and assets all needed deterministic results that could be tested and explained.",
          tradeOff:
            "This adds domain-modeling overhead compared with scattering financial math across UI and persistence layers.",
          result:
            "Totals, forecasts, and finance workflows remain deterministic and easier to validate.",
        },
        {
          decision:
            "Make imports manual-first and parse CSV/XLSX files in memory for review rather than persisting raw files.",
          why: "The product needed modern import workflows without giving up user control or widening the privacy surface unnecessarily.",
          tradeOff:
            "Manual review adds friction compared with fully automated ingestion and requires more explicit UI states.",
          result:
            "Import review stays privacy-conscious and gives users a clearer verification step before data becomes product state.",
        },
        {
          decision:
            "Keep AI usage optional and constrained to explaining already-computed figures rather than generating new financial advice.",
          why: "Financial trust depends on the product staying explicit about what is deterministic system output versus optional interpretation.",
          tradeOff:
            "This keeps the AI surface narrower and less flashy than broader assistant-style features.",
          result:
            "The product can offer assistance without weakening the boundary around financial correctness.",
        },
      ],
      uxDecisions: [
        "Used a manual-first import flow instead of requiring bank aggregation so users stay in control of what enters the system.",
        "Modeled subscriptions and recurring schedules as first-class workflows so forecasting stays aligned to schedule truth rather than transaction guesswork.",
        "Kept the product mobile/PWA-friendly for everyday use instead of assuming a desktop-only finance workflow.",
        "Separated asset tracking from everyday spending flows so investment and cash workflows do not blur together in the UI.",
      ],
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
      outcome: [
        "Shipped a live full-stack finance product with privacy-conscious workflows and production-grade auth.",
        "Established deterministic finance logic across budgets, reports, forecasts, subscriptions, investments, and asset tracking.",
        "Created modern import and review workflows without depending on bank aggregation as the product baseline.",
      ],
      nextImprovements: [
        "Expand more product-level evidence around forecast edge cases, import recovery, and mobile-specific workflow detail.",
        "Continue refining the boundary between deterministic finance output and optional AI explanations as the product grows.",
      ],
    },
    relatedLinks: [{ label: "Live product", href: "https://tallyfolio.com" }],
  },
  {
    id: "alwaysgeeky",
    slug: "alwaysgeeky",
    hasDedicatedCaseStudy: true,
    name: "AlwaysGeeky Games",
    caseStudyTitle: "Design System & Product Workflows",
    caseStudyMetaTitle: "AlwaysGeeky Games — Design System & Product Workflows · Ali Pajand",
    caseStudyMetaDescription:
      "Case study: Shared React component library with Storybook, accessibility improvements, CI quality checks, and marketplace workflows. Senior Frontend Engineer — Ali Pajand.",
    employerContext:
      "Marketplace, authentication, and shared UI work for a consumer game marketplace.",
    cardProblem:
      "Shared React component library and Storybook documentation across a consumer game marketplace. Product and authentication workflows with consistent loading, error, empty, and session states, plus accessibility and CI quality improvements.",
    role: "Senior Frontend Engineer",
    timeframe: "2024–2026",
    capabilityTags: ["React", "Next.js", "TypeScript", "Storybook", "Accessibility"],
    caseStudy: {
      overview:
        "AlwaysGeeky Games needed product workflows that could move quickly without drifting away from a reusable design-system baseline. The work connected component architecture directly to marketplace and authentication surfaces.",
      context:
        "The product involved a shared React component library, Storybook-based documentation, and a marketplace experience with authentication and failure-prone workflow states. The goal was not only consistency, but clearer product behavior under real-world conditions.",
      problem:
        "Marketplace and account flows often drift into one-off implementations when teams prioritize speed over shared UI contracts. That makes accessibility, quality checks, and state handling harder to keep consistent as the product evolves.",
      myRole: [
        "Built and maintained core UI patterns in the shared component system.",
        "Helped evolve Storybook documentation so components were easier to discover and reuse.",
        "Implemented marketplace and authentication workflows with consistent loading, empty, and error handling.",
      ],
      whatIBuilt: [
        "Shared React and TypeScript components used across marketplace and account surfaces.",
        "Storybook documentation for reusable patterns and component usage.",
        "Workflow UI for catalog browsing, login, and account-access states.",
        "CI quality checks that reinforced the design-system baseline during delivery.",
      ],
      technicalDecisions: [
        {
          decision:
            "Use shared component APIs and Storybook documentation as the baseline for product delivery instead of treating them as side artifacts.",
          why: "Marketplace and authentication work needed a stable system for reuse, review, and accessibility alignment.",
          tradeOff:
            "Codifying patterns early slows ad-hoc implementation in the short term and adds maintenance work.",
          result:
            "Shared components stayed closer to the real product surfaces they were meant to support.",
        },
        {
          decision:
            "Treat CI quality checks as part of design-system delivery, not as a separate cleanup task.",
          why: "A shared system only stays useful when changes are validated consistently as teams ship against it.",
          tradeOff:
            "Quality gates add friction when teams want to move fast on individual screens.",
          result:
            "The design-system work stayed connected to engineering standards rather than being only a visual layer.",
        },
      ],
      uxDecisions: [
        "Kept loading, empty, and error states consistent across product surfaces instead of letting each workflow invent its own patterns.",
        "Used accessibility improvements such as semantic structure, keyboard support, and clearer state messaging where the product surfaces required it.",
        "Treated authentication and recovery UI as part of the same system as the main marketplace experience.",
      ],
      interfaceEvidence: [
        {
          type: "image",
          src: "/portfolio-media/alwaysgeeky-marketplace.png",
          width: 3456,
          height: 2234,
          alt: "AlwaysGeeky Games marketplace interface using shared design-system components.",
          captionLead: "Marketplace.",
          captionBody:
            "Catalog browsing and calls to action sit on top of reusable UI patterns rather than page-specific one-offs.",
        },
        {
          type: "image",
          src: "/portfolio-media/alwaysgeeky-login.png",
          width: 3456,
          height: 2234,
          alt: "AlwaysGeeky Games login flow using shared form and recovery patterns.",
          captionLead: "Authentication.",
          captionBody:
            "Login and recovery states follow the same component rules as the broader product UI.",
        },
      ],
      outcome: [
        "Helped evolve a reusable component baseline across product workflows.",
        "Improved consistency between Storybook documentation, shipped UI, and CI quality checks.",
        "Made accessibility and state handling part of core product delivery instead of follow-up work.",
      ],
      nextImprovements: [
        "Expand product-level regression coverage around key marketplace paths so system-level changes are easier to validate.",
        "Document more workflow-specific usage guidance inside Storybook as the shared system grows.",
      ],
    },
    relatedLinks: [
      { label: "Marketplace", href: "https://market.voxies.io" },
      { label: "Login", href: "https://login.voxies.io/" },
    ],
  },
  {
    id: "emplifi",
    slug: "emplifi",
    hasDedicatedCaseStudy: true,
    name: "Emplifi",
    caseStudyTitle: "Enterprise Analytics Dashboards",
    caseStudyMetaTitle: "Emplifi — Enterprise Analytics Dashboards · Ali Pajand",
    caseStudyMetaDescription:
      "Case study: D3.js dashboard modules for enterprise analytics. Rendering optimization, mobile webview performance, Sentry and Hotjar production monitoring. Senior Frontend Engineer — Ali Pajand.",
    employerContext: "Enterprise analytics dashboards with dense data views and embedded contexts.",
    cardProblem:
      "Data-heavy dashboard modules for a social media analytics platform. D3.js visualizations, rendering improvements for desktop and embedded mobile webview contexts, and production UX monitoring through Sentry and Hotjar.",
    role: "Senior Frontend Engineer",
    timeframe: "2022–2023",
    capabilityTags: ["React", "TypeScript", "D3.js", "GSAP", "Sentry"],
    caseStudy: {
      overview:
        "Emplifi’s dashboard work focused on metric-heavy product views that had to remain usable under tight rendering budgets. The challenge was balancing chart fidelity, interaction detail, and responsiveness across multiple host environments.",
      context:
        "The dashboards were built with React, TypeScript, D3.js, and GSAP, then used in both standard browser contexts and mobile webviews. Performance work had to account for dense interfaces, animation cost, and embedded constraints.",
      problem:
        "Data-heavy views can become sluggish or unreadable quickly when interaction cost, layout pressure, and host constraints stack up. The product needed dashboard modules that remained legible and responsive without oversimplifying the data.",
      myRole: [
        "Built dashboard modules with React, TypeScript, and D3.js.",
        "Worked on rendering performance improvements for dense dashboard views.",
        "Contributed to production monitoring and UX validation through Sentry and Hotjar.",
      ],
      whatIBuilt: [
        "Metric-heavy dashboard modules with chart interactions and supporting UI.",
        "Responsive behavior tuned for desktop and embedded mobile webview contexts.",
        "Motion and interaction patterns using GSAP where it improved orientation without overloading the interface.",
      ],
      technicalDecisions: [
        {
          decision:
            "Use D3.js for chart behavior and React for surrounding product composition rather than trying to collapse the whole dashboard into a single abstraction.",
          why: "The product needed both tailored data visualization behavior and maintainable UI composition around it.",
          tradeOff:
            "This requires careful coordination between chart rendering and the broader React surface.",
          result:
            "The team could tune chart-specific behavior without losing control of the surrounding dashboard UI.",
        },
        {
          decision:
            "Work on rendering performance specifically for embedded and mobile webview paths instead of assuming desktop behavior would translate well.",
          why: "Those contexts expose animation and layout problems earlier than standard desktop testing does.",
          tradeOff:
            "Host-specific tuning adds more QA complexity and more edge conditions to account for.",
          result:
            "Dashboard modules stayed more usable in constrained contexts where performance issues would otherwise surface first.",
        },
      ],
      uxDecisions: [
        "Treated readability and interaction pacing as part of performance work, not as separate concerns.",
        "Used production monitoring with Sentry and Hotjar to understand how dense dashboard UI behaved after release.",
        "Made motion serve orientation and hierarchy rather than decorative movement.",
      ],
      outcome: [
        "Shipped dashboard modules for enterprise analytics with more predictable rendering behavior across contexts.",
        "Established patterns for balancing chart interaction and UI readability in dense product surfaces.",
        "Kept performance work tied to the real product environments where the dashboards were used.",
      ],
      nextImprovements: [
        "Document clearer motion and rendering budgets so new modules inherit the same constraints more consistently.",
        "Capture more product-specific evidence around embedded edge cases as part of the portfolio narrative.",
      ],
    },
    relatedLinks: [{ label: "Company website", href: "https://emplifi.io" }],
  },
  {
    id: "controltech",
    slug: "controltech",
    hasDedicatedCaseStudy: true,
    name: "ControlTech",
    caseStudyTitle: "Startup Studio Frontend Delivery",
    caseStudyMetaTitle: "ControlTech — Startup Studio Frontend Delivery · Ali Pajand",
    caseStudyMetaDescription:
      "Case study: Multi-product frontend delivery across early-stage SaaS products. PWAs, workflow-heavy interfaces, Playwright/Cypress/Jest test automation, CI/CD. Frontend Engineer — Ali Pajand.",
    employerContext:
      "Frontend delivery across early-stage SaaS products, dashboards, and workflow-heavy tools.",
    cardProblem:
      "Multiple SaaS products and dashboards built from MVP through production. Workflow-heavy interfaces designed around multi-step processes, validation, async state, testing, and CI/CD.",
    role: "Frontend Engineer",
    timeframe: "2018–2022",
    capabilityTags: ["React", "TypeScript", "PWA", "Testing", "CI/CD"],
    caseStudy: {
      overview:
        "At ControlTech, the work spanned multiple early-stage products rather than a single flagship app. The recurring challenge was taking ambiguous product requirements and turning them into shippable, resilient frontend workflows under fast release cycles.",
      context:
        "The products varied in shape, but the common constraints were speed, evolving scope, and the need for interfaces that could tolerate slow networks, async workflows, and repeated iteration. Testing and delivery quality mattered because small regressions hit core flows quickly.",
      problem:
        "Early-stage products often accumulate fragile UI because the team is moving fast and the requirements keep shifting. Without reusable patterns and validation, workflow-heavy interfaces become harder to ship and harder to trust release after release.",
      myRole: [
        "Worked across several products on frontend implementation, workflow design, and release quality.",
        "Built PWAs, dashboards, and form-heavy product interfaces from MVP through production stages.",
        "Contributed test automation and CI/CD quality checks for core workflows.",
      ],
      whatIBuilt: [
        "Workflow-heavy interfaces with validation, multi-step processes, and async state handling.",
        "PWA-oriented frontend delivery where the product needed better resilience under unstable conditions.",
        "Test automation across key product paths using tools such as Jest, Playwright, and Cypress.",
      ],
      technicalDecisions: [
        {
          decision:
            "Invest in reusable patterns and validation early instead of treating them as cleanup for later startup phases.",
          why: "Fast-moving products need guardrails before the complexity compounds across multiple releases.",
          tradeOff: "Building those foundations takes time away from short-term feature work.",
          result:
            "Core workflows stayed easier to ship repeatedly without depending only on manual verification.",
        },
        {
          decision:
            "Use CI/CD quality checks to support release cadence instead of relying on ad-hoc final verification.",
          why: "Workflow regressions are expensive when multiple products are shipping under small-team conditions.",
          tradeOff:
            "Automation setup adds maintenance and sometimes slows down rapid iteration in the short term.",
          result:
            "The delivery process had more consistent quality signals around primary product paths.",
        },
      ],
      uxDecisions: [
        "Treated validation, retries, and async state handling as core interaction design concerns.",
        "Designed flows that remain readable under slow-network or unstable conditions instead of assuming ideal connectivity.",
        "Prioritized predictable workflows over visually clever one-off implementations.",
      ],
      outcome: [
        "Delivered frontend work across multiple early-stage products from MVP through production.",
        "Established a stronger baseline for testing and release quality on workflow-heavy interfaces.",
        "Kept startup delivery focused on resilient product behavior rather than only feature throughput.",
      ],
      nextImprovements: [
        "Capture more project-specific examples so individual product engagements can be represented separately in the portfolio.",
        "Extend the evidence set with more screenshots or implementation artifacts where public sharing is possible.",
      ],
    },
    relatedLinks: [{ label: "Company website", href: "https://ctrltech.org" }],
  },
  {
    id: "agent-tooling",
    slug: "agent-tooling",
    hasDedicatedCaseStudy: true,
    name: "Agent Tooling & Open Source",
    caseStudyTitle: "Developer Experience Projects",
    caseStudyMetaTitle: "Agent Tooling & Open Source — Developer Experience Projects · Ali Pajand",
    caseStudyMetaDescription:
      "Developer tooling projects: agent-context-doctor, agent-pr-reviewer-lite, and agent-readiness-kit. AI coding agent readiness, PR review automation, and frontend codebase evaluation. Ali Pajand.",
    employerContext:
      "Independent tooling experiments for AI-assisted development and developer experience.",
    cardProblem:
      "Small, focused tooling projects exploring how frontend teams can improve AI-assisted development through better context, automated review feedback, and agent-readiness evaluation.",
    role: "Independent / Ongoing",
    capabilityTags: [
      "Developer experience",
      "AI agent tooling",
      "PR review automation",
      "Repository evaluation",
    ],
    caseStudy: {
      overview:
        "These tooling projects explore how frontend teams can make AI-assisted development more reliable. The work stays intentionally small and focused on specific workflow problems instead of pretending to automate the entire development lifecycle.",
      context:
        "The projects emerged from practical friction points: weak agent context, generic review feedback, and teams adopting AI-assisted workflows before their conventions were ready for it. Each tool focuses on one gap and keeps the scope explicit.",
      problem:
        "AI-assisted development breaks down quickly when the repository context is vague, the review feedback is generic, or the workflow assumptions are unstable. Small tools can make those failure modes easier to detect before they become team habits.",
      myRole: [
        "Designed and implemented the tooling concepts, TypeScript CLIs, and supporting documentation.",
        "Defined the product scope and boundaries for each tool so the claims stayed smaller than the problem.",
        "Used the projects to explore developer experience as a product surface with explicit inputs and outputs.",
      ],
      whatIBuilt: [
        "agent-context-doctor for evaluating context quality before coding-agent implementation.",
        "agent-pr-reviewer-lite for structured pull-request feedback and risk detection.",
        "agent-readiness-kit for evaluating whether a codebase or workflow is prepared for agent-assisted development.",
      ],
      technicalDecisions: [
        {
          decision:
            "Keep the tools focused on deterministic checks and explicit heuristics instead of over-claiming broad autonomous intelligence.",
          why: "The goal was to make failure modes visible and actionable, not to replace engineering judgment with a black box.",
          tradeOff:
            "A smaller scope means the tools solve narrower problems and require more human interpretation.",
          result:
            "The projects stay clearer about what they evaluate, what they report, and what still requires human review.",
        },
        {
          decision:
            "Treat CLI output, configuration, and documentation as part of the product instead of as afterthoughts.",
          why: "Developer tooling only helps when the feedback is understandable and easy to integrate into existing workflows.",
          tradeOff: "Improving DX details takes time that could otherwise go into more features.",
          result:
            "The tools demonstrate a product-minded approach to developer experience instead of a script-only mindset.",
        },
      ],
      uxDecisions: [
        "Used structured, categorized feedback so the output is easier to evaluate than a generic AI summary.",
        "Kept repository readiness and context quality visible as explicit engineering inputs.",
        "Avoided language that implies the tools fully automate review or readiness decisions when they are really evaluation aids.",
      ],
      outcome: [
        "Built a set of small tooling projects that demonstrate practical DX thinking around AI-assisted workflows.",
        "Created examples of how structured feedback and context evaluation can improve engineering workflows.",
        "Used the projects to sharpen positioning around frontend developer experience and product engineering.",
      ],
      nextImprovements: [
        "Continue refining repository-specific evaluation rules so the tools produce more useful feedback in real teams.",
        "Add more examples and integration paths that show how the tools fit into broader frontend workflows.",
      ],
    },
    relatedLinks: [
      { label: "Open Source page", href: "/open-source" },
      { label: "GitHub profile", href: "https://github.com/alipajand" },
    ],
  },
  {
    id: "mapbylaw",
    slug: "mapbylaw",
    hasDedicatedCaseStudy: true,
    name: "MapBylaw",
    caseStudyTitle: "Product Experiment",
    caseStudyMetaTitle: "MapBylaw — Product Experiment · Ali Pajand",
    caseStudyMetaDescription:
      "Product experiment for navigating zoning and bylaw information through a clearer frontend workflow. Information architecture, filtering UI, and progressive disclosure. Ali Pajand.",
    employerContext: "Independent product experiment around zoning and bylaw navigation.",
    cardProblem:
      "Product experiment for exploring zoning and bylaw information through a clearer, more navigable frontend experience. Included to show product thinking and workflow design outside of a team context.",
    role: "Independent / Product experiment",
    capabilityTags: ["Information architecture", "Filtering UI", "Workflow UX", "Product design"],
    caseStudy: {
      overview:
        "MapBylaw is a product experiment around making zoning and bylaw information easier to explore through a clearer frontend workflow. The work emphasizes navigation, filtering, and product framing rather than claims about complete municipal coverage.",
      context:
        "Zoning information is dense, technical, and easy to present in ways that overwhelm people quickly. The experiment focused on information architecture, progressive disclosure, and a more legible path through property-related questions.",
      problem:
        "When bylaw and zoning information is presented as an undifferentiated wall of detail, the product forces users to do too much translation themselves. The interface needed to reduce that friction without implying official completeness or certainty beyond the experiment’s scope.",
      myRole: [
        "Designed the frontend product direction and information architecture for the experiment.",
        "Built navigation and filtering patterns aimed at making property workflows easier to follow.",
        "Used the project to explore product thinking and workflow design outside of a larger team context.",
      ],
      whatIBuilt: [
        "A map-led product surface for browsing property context and zoning-related details.",
        "Filtering and progressive-disclosure patterns for moving from overview into more specific information.",
        "Workflow framing that treats complex bylaw information as a navigable product problem.",
      ],
      technicalDecisions: [
        {
          decision:
            "Focus the product around information architecture and workflow clarity instead of trying to present every possible detail at once.",
          why: "The value of the experiment depends on whether people can navigate the information, not on how much text can fit on a page.",
          tradeOff:
            "Reducing surface complexity means some details appear later in the flow rather than immediately.",
          result:
            "The product experiment demonstrates a clearer path through complex information without over-claiming completeness.",
        },
        {
          decision:
            "Use progressive disclosure and filtering to keep the interface oriented around tasks rather than raw document structure.",
          why: "Users need a guided path through the material, not only access to the underlying rules.",
          tradeOff:
            "Task-oriented presentation requires more careful curation of what appears first and what remains secondary.",
          result:
            "The interface makes exploration feel more intentional and less like reading an unstructured archive.",
        },
      ],
      uxDecisions: [
        "Framed the work clearly as a product experiment rather than as a definitive municipal reference.",
        "Used filtering and disclosure patterns to reduce cognitive load before users reach lower-level detail.",
        "Kept the interface oriented around navigation and understanding instead of raw data density.",
      ],
      interfaceEvidence: [
        {
          type: "image",
          src: "/portfolio-media/mapbylaw-landing.png",
          width: 3456,
          height: 2234,
          alt: "MapBylaw landing page introducing a zoning and bylaw exploration product experiment.",
          captionLead: "Landing page.",
          captionBody:
            "The public entry point positions the work as a clearer way to navigate zoning information, not as an official or exhaustive database.",
        },
        {
          type: "image",
          src: "/portfolio-media/mapbylaw-dashboard.png",
          width: 3452,
          height: 1980,
          alt: "MapBylaw dashboard showing map context, property details, and filtered zoning information.",
          captionLead: "Dashboard.",
          captionBody:
            "The workflow emphasizes map context, filtering, and progressive disclosure to make dense information easier to follow.",
        },
      ],
      outcome: [
        "Created a product experiment that demonstrates information architecture and workflow thinking on a complex domain.",
        "Showed how filtering and progressive disclosure can make dense zoning information more approachable.",
        "Added a portfolio piece that reflects product design instincts outside of a team or client context.",
      ],
      nextImprovements: [
        "Continue exploring clearer task-based entry points for different property questions.",
        "Expand the evidence set carefully without implying official coverage or exhaustive zoning accuracy.",
      ],
    },
    relatedLinks: [
      { label: "Live product", href: "https://mapbylaw.ca/" },
      { label: "Related writing", href: "/writing/mapbylaw-ai-recommendations" },
    ],
  },
];
