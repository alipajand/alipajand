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
      "Own the end-to-end frontend delivery of high-traffic Marketplace and Login projects using React and Next.js and AWS ensuring pixel-perfect UI execution and seamless API integration in Web3 environment, using vite, storybook and lints.",
      "Architected and maintained a comprehensive Design System and Component Library, improving development velocity while ensuring full WCAG accessibility and cross-browser stability. Implement CI/CD pipelines using Github Actions.",
      "Design System & Component Library with full WCAG accessibility and CI/CD (GitHub Actions).",
      "Developer Experience: tooling, docs, and workflows; AI-driven automation (MCP server for Cursor) for code review and velocity.",
    ],
  },
  {
    role: "Senior Frontend Developer",
    company: "Emplifi",
    period: "2022 – 2023",
    highlights: [
      "Developed complex, data-heavy user interfaces focusing on smooth motion design and GSAP animations, translating high-fidelity Figma designs into responsive web components.",
      "Optimized frontend rendering pipelines and state management to ensure performance within mobile webviews and embedded environments.",
      "Leveraged A/B testing, Sentry, and Hotjar analytics to identify UX friction points, resulting in measurable improvements to user retention and interface responsiveness.",
      "Delivered data dashboards with D3.js and React; optimized for mobile webviews and embedded environments.",
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
      "Conducted user research and A/B testing to validate UI changes, ensuring technical decisions were aligned with business KPIs and user needs.",
    ],
  },
];
