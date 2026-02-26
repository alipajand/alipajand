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
    id: "mapbylaw-design-system-dx",
    name: "MapBylaw · Design system & platform DX",
    description:
      "Product engineering for a map-first property insights platform: shared UI across web and admin, feature-based architecture, type-safe API and PDF report system.",
    role: "Senior Product Engineer · Design Systems · Developer Experience",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "@mapbylaw/ui",
      "OpenAPI",
      "Zod",
      "React-PDF",
      "pnpm monorepo",
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
    id: "design-system-alwaysgeeky",
    name: "Design System & Component Library",
    description:
      "Built and maintained the design system for our Web3 products. Accessible (WCAG), consistent across browsers.",
    role: "Lead · AlwaysGeeky Games",
    tech: ["React", "TypeScript", "Storybook", "GitHub Actions", "WCAG"],
    outcomes: [
      "Teams could build UI faster because they reused the library",
      "CI checks visual and a11y changes so we don't ship regressions",
    ],
    caseStudy: {
      problem:
        "Teams were building their own components. No shared patterns, no consistent accessibility.",
      approach:
        "One design system in Storybook. WCAG-built components. GitHub Actions runs lint, visual diff, and a11y on every PR.",
      result: "Same look and a11y everywhere. CI catches problems before merge.",
    },
    beforeAfter: [
      { label: "Component reuse", before: "Ad-hoc", after: "Shared library" },
      { label: "A11y checks", before: "Manual", after: "Automated in CI" },
    ],
    image: undefined,
    imageCaption: undefined,
    secondaryMedia: undefined,
  },
  {
    id: "marketplace-login-web3",
    name: "Marketplace & Login (Web3)",
    description:
      "Built Marketplace and Login from design to production. Clean UI, solid API and auth, deployed on AWS.",
    role: "Senior Frontend · AlwaysGeeky Games",
    tech: ["React", "Next.js", "Vite", "AWS"],
    outcomes: [
      "Shipped on time. Stable under real traffic.",
      "API and auth worked smoothly in a Web3 setup.",
    ],
    caseStudy: {
      problem:
        "We needed Marketplace and Login to match design and talk to Web3 APIs without feeling slow or broken.",
      approach:
        "React/Next.js and Vite. Used the design system. Made sure loading and errors felt good.",
      result: "Shipped. It matched design and held up in production.",
    },
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
    role: "Senior Frontend · Emplifi",
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
    role: "Frontend · ControlTech Startup Studio",
    tech: ["React", "React Native", "Jest", "Playwright", "GitHub Actions"],
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
