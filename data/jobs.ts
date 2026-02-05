export interface Job {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export const JOBS: Job[] = [
  {
    role: "Senior Frontend Developer",
    company: "AlwaysGeeky Games",
    period: "2024 – 2026",
    highlights: [
      "Full-stack ownership of Marketplace & Login: React/Next.js frontend to Node.js and Python backend in production.",
      "Improved site speed and server response by ~30% via data and DB optimization; built shared component library for faster feature delivery.",
      "Design System & Component Library with full WCAG accessibility and CI/CD (GitHub Actions).",
      "Developer Experience: tooling, docs, and workflows; AI-driven automation (MCP server for Cursor) for code review and velocity.",
    ],
  },
  {
    role: "Senior Frontend Developer",
    company: "Emplifi",
    period: "2022 – 2023",
    highlights: [
      "Built data-heavy UIs with GSAP animations; translated high-fidelity Figma into responsive, performant components.",
      "Delivered data dashboards with D3.js and React; optimized for mobile webviews and embedded environments.",
      "Used A/B testing, Sentry, and Hotjar to drive measurable improvements in retention and interface responsiveness.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "ControlTech Startup Studio",
    period: "2018 – 2022",
    highlights: [
      "Owned full development cycle for multiple startup products: Figma to React/React Native, AWS infra, and stable releases for early customers.",
      "Reduced first-load times via code splitting, lazy loading, and CDN; built PWA from scratch (service workers, offline, caching).",
      "Established Jest & Playwright test suites and GitHub Actions CI/CD; achieved 99.9% deployment stability.",
    ],
  },
  {
    role: "UI/UX Designer & Frontend Developer",
    company: "Rayvarz Inc.",
    period: "2016 – 2017",
    highlights: [
      "Led redesign of legacy B2B dashboards; +15% user engagement through data viz and information architecture.",
      "Acted as bridge between design and engineering: Figma/Photoshop to Vue.js; user research and A/B testing to validate UI decisions.",
    ],
  },
];
