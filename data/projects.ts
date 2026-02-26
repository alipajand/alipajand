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

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  tech: string[];
  outcomes: string[];
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
    name: "Typed AI Recommendations & Report Integrity",
    description:
      "Built an AI recommendations pipeline that stays honest under scrutiny by planners, developers, and a detailed report data audit — grounded in the same zoning rules, feasibility math, and datasets as the rest of MapBylaw.",
    role: "Senior Product Engineer · MapBylaw",
    tech: ["TypeScript", "Fastify", "React", "React-PDF", "Docling", "OpenAPI", "AWS", "WCAG"],
    outcomes: [
      "Recommendations became specific, auditable, and consistent between dashboard and PDF instead of chatbot-style advice.",
      "Single typed contract for AI recommendations across API, dashboards, and PDF reports so audits no longer require chasing fields through multiple layers.",
      "Updating rules or incentives in one place tightens AI context and validation automatically, keeping report content policy intact.",
    ],
    caseStudy: {
      problem:
        "Early AI recommendations were generic, hard to trace back to inputs, and sometimes drifted from MapBylaw's content policy (no fake or static data, no Montreal-only fallbacks pretending to be real). There was no single typed contract between the Fastify API, React dashboards, and React-PDF reports.",
      approach:
        "Defined a strict TypeScript shape for ai_recommendations in the API and database, then consumed it in both the web dashboard and PDF payload builder. Built a narrow context builder that only feeds the model what MapBylaw already knows is true (zoning code, PUM 2050 sector, heritage/climate flags, feasibility scores, computed scenarios). Wired the flow through OpenAPI + Zod validation, added tests so malformed recommendations fail fast, and codified the constraints in REPORTS_DATA_AUDIT.md, ARCHITECTURE.md, IMPLEMENTATION_STATUS.md, and API_AUDIT.md.",
      result:
        "Specific, auditable recommendations that line up between dashboard and PDF (e.g., “Scenario B exceeds the Plateau conversion cap; keep GFA under 200 m² or switch to a plex + ADU strategy”) and evolve automatically as rules and incentives change.",
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
    image: undefined,
  },
  {
    id: "mapbylaw-design-system-dx",
    name: "Design system & platform DX",
    description:
      "Product engineering for a map-first property insights platform: shared UI across web and admin, feature-based architecture, type-safe API and PDF report system.",
    role: "Senior Product Engineer · MapBylaw",
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
      "Single design system (@mapbylaw/ui) for web and admin; consistent toasts, shell, and tables.",
      "Feature-based structure and path aliases so teams ship without deep import chains.",
      "OpenAPI + Zod and strongly-typed PDF payloads keep API and report outputs in sync.",
    ],
    caseStudy: {
      problem:
        "Web app and admin app needed consistent UI and patterns. API, PDF report, and frontend had to stay aligned as we added bilingual reports, consent-gated analytics, and internal tooling.",
      approach:
        "Shared component library (@mapbylaw/ui) for both apps. Feature-based folders and barrel exports; path aliases (components/, features/, utils/) for clean imports. OpenAPI 3.0 and Zod for API contracts; React-PDF with a typed payload builder and shared report components so the 10-page bilingual report stays single-source.",
      result:
        "One design language and predictable DX. API docs and types drive frontend; report content policy (no static/fake data) enforced via shared types and audit.",
    },
    beforeAfter: [
      { label: "UI across apps", before: "Separate stacks", after: "Shared @mapbylaw/ui" },
      { label: "Report data", before: "Ad-hoc copy", after: "Typed payload + audit" },
    ],
    links: [{ label: "Project", href: "https://mapbylaw.ca/" }],
    image: undefined,
  },
  {
    id: "design-system-marketplace-login-web3",
    name: "Design System, Marketplace & Login using (Web3)",
    description:
      "Built and maintained the design system for our Web3 products, then used it to ship the Marketplace and Login from design to production. Accessible (WCAG), consistent UI, solid API and auth, deployed on AWS.",
    role: "Lead / Senior Frontend Engineer · AlwaysGeeky Games",
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
      "Unified look and accessibility across products.",
      "CI catches visual and a11y regressions before merge.",
      "Marketplace and Login shipped on time, matched design, stayed stable under real traffic, and handled Web3 API/auth flows reliably in production.",
    ],
    caseStudy: {
      problem:
        "Teams were building their own components and we needed Marketplace and Login to match design, integrate with Web3 APIs, and feel fast—not fragile or inconsistent.",
      approach:
        "One Storybook-driven design system with WCAG-compliant components. Wired CI (GitHub Actions) to run lint, visual diff, and a11y checks on every PR. Built Marketplace and Login in React/Next.js/Vite on top of the system, smoothing loading and error states and integrating cleanly with APIs and auth.",
      result:
        "Unified look and accessibility across products. CI catches visual/a11y regressions before merge, and Marketplace and Login stayed stable under real Web3 traffic.",
    },
    beforeAfter: [
      { label: "Component reuse", before: "Ad-hoc", after: "Shared library" },
      { label: "A11y checks", before: "Manual", after: "Automated in CI" },
    ],
    links: [
      { label: "Marketplace", href: "https://market.voxies.io" },
      { label: "Login", href: "https://login.voxies.io/" },
    ],
    image: undefined,
  },
  {
    id: "data-dashboards-emplifi",
    name: "Data Dashboards & Motion",
    description:
      "Built data-heavy dashboards with smooth motion (GSAP) and D3.js charts. Made them run well inside mobile webviews and embeds.",
    role: "Senior Frontend Engineer · Emplifi",
    tech: ["React", "D3.js", "GSAP", "Figma"],
    outcomes: [
      "A/B tests and analytics showed better retention and snappier UI",
      "Same dashboards ran smoothly when embedded in other apps",
    ],
    caseStudy: {
      problem:
        "Dashboards had to look good and feel smooth inside mobile webviews, with real motion design.",
      approach:
        "D3.js for charts, GSAP for motion. Tuned React so one codebase ran well in webviews.",
      result: "Smoother experience in embeds. Data showed better retention and fewer drop-offs.",
    },
    beforeAfter: [{ label: "Embedded perf", before: "Janky", after: "Smooth 60fps" }],
    links: [{ label: "Website", href: "https://emplifi.io" }],
    image: undefined,
  },
  {
    id: "pwa-performance-controltech",
    name: "PWA & Performance",
    description:
      "Built several startup products end to end. Code splitting, lazy loading, CDN. PWAs with offline and caching from scratch.",
    role: "Frontend Engineer · ControlTech Startup Studio",
    tech: ["Vue", "Nuxt.js", "React", "React Native", "Jest", "Playwright", "GitHub Actions"],
    outcomes: [
      "99.9% deployment stability with Jest, Playwright, and GitHub Actions",
      "Faster load and offline support so early users had a good experience",
    ],
    caseStudy: {
      problem: "Products had to load fast, work offline, and deploy without breaking.",
      approach:
        "Split code, lazy load, use a CDN. Built PWAs with service workers and caching. Added Jest, Playwright, and GitHub Actions.",
      result: "99.9% uptime on releases. Faster first load. Key flows worked offline.",
    },
    beforeAfter: [
      { label: "Deployment stability", before: "~95%", after: "99.9%" },
      { label: "First load", before: "Heavy bundle", after: "Split + CDN" },
    ],
    links: [{ label: "Website", href: "https://ctrltech.org" }],
    image: undefined,
  },
];
