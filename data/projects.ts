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

export const PORTFOLIO_PAGE_INTRO = [
  "Nine-plus years of production web work, with frontend architecture as the specialization: React, Next.js, TypeScript, shared component systems, accessibility, and rendering performance in interfaces dense enough that those things decide whether the product is usable.",
  "The case studies below are ordered by how much they show. LedgerGuard is a product I own end to end, from the Next.js App Router frontend through the Fastify API, PostgreSQL schema, and queue-backed document pipeline. AlwaysGeeky is the shared React and TypeScript library four product surfaces were built on, along with the conventions and CI gates that kept them consistent. Emplifi is dense D3 analytics and the rendering work that made it survive mobile webviews.",
  "Each write-up covers the problem, what I owned, the decisions that mattered, and what I traded away to get there. I use AI coding agents for implementation, testing, and investigation, and keep architecture, security, and final review on my side of the line.",
] as const;

export const PORTFOLIO_PROFILE_DETAILS =
  "Based in Montreal, Canada. English: professional. French: intermediate.";

export const PORTFOLIO_META_TITLE =
  "Ali Pajand — Engineering Portfolio | React, Next.js & Full-Stack Systems";

export const PORTFOLIO_META_DESCRIPTION =
  "Case studies in frontend architecture, design systems, and end-to-end product delivery: React, Next.js, TypeScript, D3 analytics, Node.js APIs, PostgreSQL, and async AI workflows.";

export const PORTFOLIO_CASE_STUDY_ORDER = [
  "ledgerguard",
  "alwaysgeeky",
  "emplifi",
  "agent-tooling",
  "tallyfolio",
  "controltech",
  "mapbylaw",
] as const;

export const PROJECTS: Project[] = [
  {
    id: "ledgerguard",
    slug: "ledgerguard",
    hasDedicatedCaseStudy: true,
    name: "LedgerGuard",
    caseStudyTitle: "Full-Stack AI Contract Intelligence",
    caseStudyMetaTitle: "LedgerGuard — Full-Stack AI Contract Intelligence · Ali Pajand",
    caseStudyMetaDescription:
      "Case study: End-to-end ownership of a multi-tenant AI contract intelligence product across Next.js, Node.js/Fastify, PostgreSQL, authentication, background workers, document processing, billing, Docker, and CI/CD.",
    employerContext:
      "AI contract intelligence SaaS for renewals, commitments, notice windows, and financial exposure.",
    cardProblem:
      "A multi-tenant contract-intelligence SaaS built alone across the Next.js App Router product, Fastify API, PostgreSQL schema, authentication, billing, and a queue-backed document pipeline. The design problem was keeping probabilistic extraction from becoming confirmed contract data without a human reviewing the evidence.",
    role: "Senior Product Engineer",
    timeframe: "2026–Present",
    capabilityTags: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Fastify",
      "PostgreSQL",
      "Redis/BullMQ",
      "AI",
    ],
    caseStudy: {
      overview:
        "LedgerGuard tracks contract renewals, commitments, notice windows, and financial exposure. I designed and built it alone: the product, the API, the data model, the document pipeline, billing, infrastructure, and delivery.",
      context:
        "A Next.js App Router application sits in front of a Node.js/Fastify API, Supabase PostgreSQL/Auth/Storage, Redis/BullMQ orchestration, and a Python worker running AWS Textract and OpenAI extraction. Every tenant boundary, job contract, and API surface in that list is one I had to define, because there was nobody else to define them.",
      problem:
        "Extraction output is useless if the interface makes it look settled. Someone deciding whether to exercise a notice window needs to know whether a date came out of a model or out of a person confirming it against the document. The workflow had to carry that distinction from the database through to the screen, and stay legible while extraction was still running, partially done, or failed.",
      myRole: [
        "Product direction, architecture, implementation, testing, infrastructure, and release, across the whole stack.",
        "Built the Next.js App Router product, the Fastify API, the PostgreSQL data model, authentication and tenant scoping, background-job orchestration, and the Python worker integration.",
        "Set the rule the rest of the product follows: suggested values and confirmed values are stored differently, rendered differently, and only cross the boundary through explicit review.",
      ],
      whatIBuilt: [
        "Document ingestion and upload flows wired to async extraction state.",
        "Tenant-aware dashboard navigation and the review surfaces for contract data.",
        "A verification UI that keeps suggested values visually and structurally apart from confirmed ones, with source context attached.",
        "Renewal and portfolio views that stay honest about which records are still incomplete.",
        "API contracts, authentication, billing, job orchestration, Docker setup, and the CI/CD pipeline.",
      ],
      technicalDecisions: [
        {
          decision:
            "Keep deterministic contract data and API rules in Node.js/Fastify while isolating probabilistic extraction in the Python worker behind explicit job contracts.",
          why: "The product needed retryable document processing without allowing AI output to bypass authentication, tenant boundaries, or user confirmation.",
          tradeOff:
            "The separation adds Redis/BullMQ orchestration, worker lifecycle handling, and more API contracts to maintain.",
          result:
            "Background extraction can fail or retry independently while deterministic contract state remains controlled by the application and user review.",
        },
        {
          decision:
            "Draw a hard line in the App Router between server-rendered product surfaces and the client components that handle review interactions.",
          why: "Review is the only genuinely interactive part of the product. Everything else is composition and data fetching, and treating it that way keeps the client bundle and the state surface small.",
          tradeOff:
            "It takes more up-front structure than pushing the whole dashboard into one client-heavy tree, and every new feature has to be placed on one side of the line deliberately.",
          result:
            "Route, data, and interaction concerns stayed separable as the workflow grew past the original two screens.",
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
        "Shipped a working end-to-end product: ingestion, extraction review, and contract visibility, live at ledgerguard.io.",
        "Reached 90% unit-test coverage on the web application.",
        "Held the boundary between suggested and confirmed contract data across the schema, the API, and the UI rather than only in the interface layer.",
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
      "Most personal finance apps make you choose between bank aggregation and a spreadsheet. TallyFolio is the third option: a full-stack PWA with deterministic money math, CSV import review, forecasting, and production auth, built without handing over bank credentials.",
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
    caseStudyTitle: "Shared Design System & Frontend Standards",
    caseStudyMetaTitle:
      "AlwaysGeeky Games — Shared Design System & Frontend Standards · Ali Pajand",
    caseStudyMetaDescription:
      "Case study: A shared React and TypeScript component library across four product surfaces, with Storybook, accessibility work, TypeScript and review conventions, and CI quality gates. Senior Frontend Engineer — Ali Pajand.",
    employerContext:
      "Shared component library, frontend conventions, and product workflows across four product surfaces.",
    cardProblem:
      "Four product surfaces, one React and TypeScript component library. I helped build and maintain it, documented it in Storybook, and shipped marketplace, authentication, and account workflows on top of it. The lasting part was the conventions: component APIs, accessibility defaults, TypeScript and code-review rules, and CI gates that caught drift before it shipped.",
    role: "Senior Frontend Engineer",
    timeframe: "2024–2026",
    capabilityTags: ["React", "Next.js", "TypeScript", "Storybook", "GraphQL", "Accessibility"],
    caseStudy: {
      overview:
        "Four product surfaces shared one React and TypeScript component library. I helped build and maintain it, and helped establish the conventions that decided how teams were expected to build against it: component APIs, accessibility defaults, TypeScript rules, and what a review was supposed to catch.",
      context:
        "The surfaces included a marketplace, authentication, product, and account experiences, all in Next.js on top of the shared library, documented in Storybook and integrated over GraphQL. Alongside the product work, we ran an AI-assisted development workflow using Cursor with MCP tooling, so the same lint, type, and test signals engineers saw in CI were available in the editor.",
      problem:
        "Marketplace and account flows drift into one-off implementations the moment speed beats shared contracts. Four surfaces multiply that: the same empty state gets invented four times, accessibility gets handled well in one and forgotten in the others, and nobody notices until the library and the products disagree.",
      myRole: [
        "Shared ownership of the React and TypeScript component library used across all four surfaces.",
        "Helped establish the frontend conventions the surfaces were built to: component API shape, accessibility expectations, TypeScript rules, and what reviewers were expected to push back on.",
        "Helped evolve the Storybook documentation so components were discoverable enough that reuse was the easier path.",
        "Shipped marketplace, authentication, product, and account workflows with consistent loading, empty, and error handling.",
        "Worked on the Cursor and MCP setup so editor feedback lined up with the checks CI already ran.",
      ],
      whatIBuilt: [
        "Shared React and TypeScript components used across the marketplace and account surfaces.",
        "Storybook documentation covering component usage and the states each one is responsible for.",
        "Workflow UI for catalog browsing, login, and account-access states.",
        "CI quality gates that held the library and the product surfaces to the same baseline.",
      ],
      technicalDecisions: [
        {
          decision:
            "Treat component APIs as the contract, and Storybook as where that contract is written down, rather than as documentation produced after the fact.",
          why: "A component used on four surfaces is an interface other engineers depend on. If its states and escape hatches aren't explicit, each surface fills the gaps differently.",
          tradeOff:
            "Codifying a pattern is slower than writing the screen in front of you, and every component gains maintenance weight.",
          result:
            "The library stayed close to the surfaces it was meant to serve instead of becoming a parallel set of components nobody reached for.",
        },
        {
          decision:
            "Put the design-system baseline behind CI gates instead of relying on reviewers to remember it.",
          why: "Conventions that only live in people's heads decay as soon as the team is busy, and review attention is the scarcest thing on a small frontend team.",
          tradeOff:
            "Gates add friction on individual screens, and a gate that fires too often gets routed around.",
          result:
            "Standards work stayed enforceable rather than aspirational, and review time went to design decisions instead of catching lint-level drift.",
        },
        {
          decision:
            "Wire the AI-assisted workflow through MCP tooling that runs the same lint, type, and test commands as CI.",
          why: "Editor-level AI assistance is only useful if its feedback matches what will actually block the pull request.",
          tradeOff:
            "Maintaining the tooling is real work, and it only pays off if the underlying scripts stay the single source of truth.",
          result:
            "Assisted development stayed anchored to the project's real quality signals instead of to a model's guess about them.",
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
        "A component baseline four product surfaces were built on, with the conventions and gates that kept them aligned.",
        "Closer agreement between Storybook documentation, shipped UI, and what CI actually enforced.",
        "Better accessibility, responsive behaviour, API integration, and testing standards across the surfaces, plus an AI-assisted workflow tied to the project's real checks.",
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
    caseStudyTitle: "Enterprise Analytics",
    caseStudyMetaTitle: "Emplifi — Enterprise Analytics · Ali Pajand",
    caseStudyMetaDescription:
      "Case study: React, TypeScript, and D3.js enterprise analytics modules built on shared accessible components, with an 80% reduction in unnecessary rendering and chart-update paint work. Senior Frontend Engineer — Ali Pajand.",
    employerContext: "Enterprise analytics dashboards with dense data views and embedded contexts.",
    cardProblem:
      "Data-heavy React and TypeScript analytics modules built on D3.js, assembled from shared accessible components and their documentation, running in both desktop browsers and embedded mobile webviews. Profiling the webview path led to an 80% reduction in unnecessary re-renders and chart-update paint cost on lower-powered devices.",
    role: "Senior Frontend Engineer",
    timeframe: "2022–2023",
    capabilityTags: [
      "React",
      "TypeScript",
      "D3.js",
      "Design systems",
      "Performance",
      "Accessibility",
      "Sentry",
    ],
    caseStudy: {
      overview:
        "Enterprise social analytics: metric-heavy dashboards that had to stay readable and responsive while rendering a lot of data at once. Most of my work sat where chart behaviour, React composition, and the rendering budget meet.",
      context:
        "The dashboards were React, TypeScript, D3.js, and GSAP, shipped to standard browsers and to embedded mobile webviews. The webviews were the constraint that mattered: they surfaced animation and layout cost that desktop testing never showed.",
      problem:
        "Dense analytics degrade quietly. Interaction cost, layout pressure, and host constraints each look tolerable on their own, and then a customer opens the dashboard in a webview on a mid-range phone and the charts stop being usable. Cutting the data down would have solved the symptom and broken the product.",
      myRole: [
        "Built dashboard modules in React, TypeScript, and D3.js.",
        "Profiled and reduced rendering cost in dense views, focusing on the embedded webview path where problems showed up first.",
        "Built the reusable, accessible components the dashboard modules were assembled from, and wrote the documentation that let other engineers use them without asking.",
        "Used Sentry and Hotjar to understand how the dashboards behaved after release rather than only in local testing.",
      ],
      whatIBuilt: [
        "Metric-heavy dashboard modules with chart interactions and the UI around them.",
        "Shared, accessible UI components and the usage documentation around them, so dashboard work started from an existing baseline instead of from scratch.",
        "Responsive behaviour tuned separately for desktop and embedded mobile webview contexts.",
        "GSAP motion used where it helped people keep their place in the data, not as decoration.",
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
        "Cut unnecessary re-renders and chart-update paint cost on lower-powered devices by 80%.",
        "Left behind reusable accessible components and documentation that colleagues credited with helping the team ship faster.",
        "Left behind patterns for balancing chart interaction against readability in dense product surfaces.",
        "Kept performance work anchored to the environments the dashboards actually ran in.",
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
      "Four years across multiple early-stage SaaS products, dashboards, and PWAs, taken from MVP to production. Workflow-heavy interfaces built around multi-step processes, validation, async state, API integration, and the Playwright, Cypress, and Jest coverage that made repeated releases survivable.",
    role: "Frontend Engineer",
    timeframe: "2018–2022",
    capabilityTags: ["React", "TypeScript", "PWA", "Testing", "CI/CD"],
    caseStudy: {
      overview:
        "A startup studio, so the work spanned several early-stage products rather than one flagship app. This is where the habits came from: turning vague requirements into something shippable, and building it so the next product could reuse the parts.",
      context:
        "The products differed, but the constraints repeated: small teams, moving scope, unreliable networks in the field, and release cycles short enough that a regression in a core flow was expensive within days. I worked across the frontend/backend boundary where API integration required it.",
      problem:
        "Early-stage products accumulate fragile UI because everyone is moving fast and the requirements keep changing underneath them. Without reusable patterns and automated checks, workflow-heavy interfaces get harder to ship every release, and eventually nobody trusts a deploy without manually walking the flows.",
      myRole: [
        "Frontend implementation, workflow design, and release quality across several products.",
        "Built PWAs, dashboards, and form-heavy interfaces from MVP through production, often with little spec to start from.",
        "Added the test automation and CI/CD checks that covered core workflows.",
      ],
      whatIBuilt: [
        "Workflow-heavy interfaces with validation, multi-step processes, and async state handling.",
        "PWAs for products that had to keep working on unreliable connections.",
        "Automated coverage of the critical paths with Jest, React Testing Library, Playwright, and Cypress.",
        "API integrations, and the reusable frontend patterns that carried between products.",
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
        "Shipped frontend work across multiple early-stage products, MVP through production.",
        "Raised the testing and release-quality baseline on workflow-heavy interfaces.",
        "Built the breadth that later turned into end-to-end product ownership.",
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
    name: "Agent Engineering Tools",
    caseStudyTitle: "Deterministic AI-Agent Developer Tools",
    caseStudyMetaTitle: "Agent Engineering Tools — Developer Experience Projects · Ali Pajand",
    caseStudyMetaDescription:
      "Deterministic, local-first TypeScript tools for evaluating AI-agent readiness, detecting missing context, and reviewing risky code changes with human engineering review.",
    employerContext:
      "Independent tooling experiments for AI-assisted development and developer experience.",
    cardProblem:
      "Three small TypeScript CLIs built out of the same frustration: teams adopt AI-assisted development before their conventions, documentation, and review process can carry it. The tools make context quality, review feedback, and repository readiness into things you can check rather than assume.",
    role: "Independent / Ongoing",
    capabilityTags: ["TypeScript", "CLI", "CI", "AI Agents", "Developer Experience"],
    caseStudy: {
      overview:
        "These tooling projects explore how engineering teams can make AI-assisted development more reliable. The work stays intentionally small and focused on specific workflow problems instead of pretending to automate the entire development lifecycle.",
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
        "agent-context-doctor, because most bad agent output traces back to weak instructions rather than a weak model, and nobody was checking the instructions.",
        "agent-pr-reviewer-lite, because generic AI review comments get ignored, and feedback sorted by category and risk is something a reviewer can actually act on.",
        "agent-readiness-kit, because a repository without clear conventions, boundaries, or validation paths will amplify agent mistakes instead of catching them.",
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
        "Kept architecture, security, validation, and final decisions under human engineering review.",
      ],
      nextImprovements: [
        "Continue refining repository-specific evaluation rules so the tools produce more useful feedback in real teams.",
        "Add more examples and integration paths that show how the tools fit into broader engineering workflows.",
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
