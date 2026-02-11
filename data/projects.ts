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

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  tech: string[];
  outcomes: string[];
  image?: string;
  caseStudy?: CaseStudyBlock;
  beforeAfter?: BeforeAfter[];
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "design-system-alwaysgeeky",
    name: "Design System & Component Library",
    description:
      "Architected and maintained a comprehensive design system for high-traffic Web3 products, with full WCAG accessibility and cross-browser stability.",
    role: "Lead · AlwaysGeeky Games",
    tech: ["React", "TypeScript", "Storybook", "GitHub Actions", "WCAG"],
    outcomes: [
      "Faster feature delivery: product teams adopted the library and cut UI implementation time",
      "Visual regression and a11y checks in CI, zero accessibility regressions in releases",
    ],
    caseStudy: {
      problem:
        "Multiple product teams building one-off components; inconsistent patterns and no shared accessibility baseline.",
      approach:
        "Single design system with Storybook as source of truth, WCAG-aligned components, and GitHub Actions for lint, visual diff, and a11y on every PR.",
      result:
        "Unified UI across products, consistent a11y, and CI blocking regressions before merge.",
    },
    beforeAfter: [
      { label: "Component reuse", before: "Ad-hoc", after: "Shared library" },
      { label: "A11y checks", before: "Manual", after: "Automated in CI" },
    ],
    image: undefined,
  },
  {
    id: "marketplace-login-web3",
    name: "Marketplace & Login (Web3)",
    description:
      "End-to-end frontend delivery for Marketplace and Login flows: pixel-perfect UI, seamless API integration, and AWS-backed deployment.",
    role: "Senior Frontend · AlwaysGeeky Games",
    tech: ["React", "Next.js", "Vite", "AWS"],
    outcomes: [
      "High-traffic production flows shipped on time with stable releases",
      "Seamless API and auth integration in Web3 environment",
    ],
    caseStudy: {
      problem:
        "High-traffic Marketplace and Login flows needed to match design specs and integrate with Web3 APIs without degrading UX.",
      approach:
        "React/Next.js with Vite, strict design-system usage, and robust error and loading states for API and auth.",
      result: "Shipped flows met design and performance targets; stable in production under load.",
    },
    image: undefined,
  },
  {
    id: "data-dashboards-emplifi",
    name: "Data Dashboards & Motion",
    description:
      "Complex, data-heavy UIs with smooth motion design and GSAP animations; D3.js dashboards optimized for mobile webviews and embedded environments.",
    role: "Senior Frontend · Emplifi",
    tech: ["React", "D3.js", "GSAP", "Figma"],
    outcomes: [
      "A/B testing and analytics showed measurable gains in retention and interface responsiveness",
      "Rendering and state tuned for embedded webviews so dashboards performed on mobile",
    ],
    caseStudy: {
      problem:
        "Data-heavy dashboards had to feel responsive in embedded mobile webviews while matching high-fidelity motion design.",
      approach:
        "D3.js for charts, GSAP for motion, and optimized React rendering and state so the same code ran well in webviews.",
      result:
        "Smoother UX in embedded contexts; A/B and Hotjar/Sentry data confirmed improved retention and fewer friction points.",
    },
    beforeAfter: [{ label: "Embedded perf", before: "Janky", after: "Smooth 60fps" }],
    image: undefined,
  },
  {
    id: "pwa-performance-controltech",
    name: "PWA & Performance",
    description:
      "Full development cycle for multiple startup products: code splitting, lazy loading, CDN, PWA from scratch (service workers, offline, caching).",
    role: "Frontend · ControlTech Startup Studio",
    tech: ["React", "React Native", "Jest", "Playwright", "GitHub Actions"],
    outcomes: [
      "99.9% deployment stability via Jest + Playwright and GitHub Actions CI/CD",
      "Faster first load and reliable offline experience for early customers",
    ],
    caseStudy: {
      problem:
        "Startup products needed fast first load, offline capability, and reliable deployments for early adopters.",
      approach:
        "Code splitting, lazy loading, CDN, PWA (service workers, caching), plus Jest and Playwright with GitHub Actions.",
      result:
        "99.9% deployment stability; reduced first-load times and working offline for key flows.",
    },
    beforeAfter: [
      { label: "Deployment stability", before: "~95%", after: "99.9%" },
      { label: "First load", before: "Heavy bundle", after: "Split + CDN" },
    ],
    image: undefined,
  },
];
