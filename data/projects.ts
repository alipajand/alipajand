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

/** Optional second asset: e.g. CI/CD diagram, GSAP/D3 GIF, or MCP architecture. Add to prove implementation ownership. */
export interface ProjectMedia {
  src: string;
  caption: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  tech: string[];
  outcomes: string[];
  /** Main screenshot (e.g. Storybook, dashboard, app). */
  image?: string;
  /** Alt/caption for main image (e.g. "Storybook: component library"). */
  imageCaption?: string;
  /** Second proof asset: diagram (CI/CD, MCP) or GIF (GSAP/D3 animation). */
  secondaryMedia?: ProjectMedia;
  caseStudy?: CaseStudyBlock;
  beforeAfter?: BeforeAfter[];
  link?: string;
}

export const PROJECTS: Project[] = [
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
    image: undefined,
  },
];
