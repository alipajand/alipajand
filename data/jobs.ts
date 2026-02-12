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
      "Shipped Marketplace and Login (React, Next.js, AWS) on time with stable Web3 API integration and zero critical production incidents.",
      "Architected a Design System and component library that cut UI development time and ensured 100% WCAG compliance across products; CI (GitHub Actions) blocks visual and a11y regressions before merge.",
      "Built a custom MCP server for Cursor so lint and types run in the editor, faster feedback and cleaner PRs.",
    ],
  },
  {
    role: "Senior Frontend Developer",
    company: "Emplifi",
    period: "2022 – 2023",
    highlights: [
      "Delivered data-heavy dashboards (GSAP, D3.js) that drove measurable gains in retention and responsiveness via A/B tests and analytics (Sentry, Hotjar).",
      "Solved embedded performance: made the same dashboards run at 60fps inside mobile webviews and third-party embeds, removed jank and friction identified in UX data.",
      "Owned Figma-to-code pipeline; aligned technical decisions with user research and business KPIs.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "ControlTech Startup Studio",
    period: "2018 – 2022",
    highlights: [
      "Owned frontend delivery for multiple startup products (Figma → React/React Native, AWS); shipped stable releases for early adopters.",
      "Reduced first-load times with code splitting, lazy loading, and CDN; built PWAs (offline, caching) so key flows stayed reliable, improved engagement on core flows.",
      "Achieved 99.9% deployment stability via Jest, Playwright, and GitHub Actions CI/CD, fewer production incidents, faster and confident releases.",
    ],
  },
  {
    role: "UI/UX Designer & Frontend Developer",
    company: "Rayvarz Inc.",
    period: "2016 – 2017",
    highlights: [
      "Redesigned legacy B2B dashboards; better data viz and IA drove +15% user engagement (measured and tied to business goals).",
      "Bridged design and engineering (Figma/Photoshop → Vue.js); ran user research and A/B tests to validate UI changes and tie technical work to outcomes.",
    ],
  },
];
