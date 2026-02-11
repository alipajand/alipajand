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
      "Shipped high-traffic Marketplace and Login (React, Next.js, AWS) on time with pixel-perfect UI and stable Web3 API integration  production flows meeting design and performance targets.",
      "Design system and component library led to faster feature delivery across teams; CI/CD (GitHub Actions) for visual regression and WCAG checks reduced a11y regressions to zero in releases.",
      "Introduced AI-driven automation (custom MCP server for Cursor) for code review and lint/type feedback in-IDE, cutting feedback loops and speeding up PR readiness.",
    ],
  },
  {
    role: "Senior Frontend Developer",
    company: "Emplifi",
    period: "2022 – 2023",
    highlights: [
      "Data-heavy dashboards and motion (GSAP, D3.js) delivered to spec; A/B testing and analytics (Sentry, Hotjar) showed measurable gains in user retention and interface responsiveness.",
      "Optimized rendering and state for embedded mobile webviews so the same dashboards performed smoothly in third-party contexts  removing jank and friction identified in UX data.",
      "Figma-to-code pipeline with responsive components; technical decisions validated against business KPIs and user research.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "ControlTech Startup Studio",
    period: "2018 – 2022",
    highlights: [
      "Multiple startup products taken from Figma to React/React Native and AWS with stable releases for early customers; full ownership of frontend delivery.",
      "Code splitting, lazy loading, and CDN reduced first-load times; PWA (service workers, offline, caching) improved reliability and engagement for key flows.",
      "Jest and Playwright plus GitHub Actions CI/CD achieved 99.9% deployment stability  fewer production incidents and faster, confident releases.",
    ],
  },
  {
    role: "UI/UX Designer & Frontend Developer",
    company: "Rayvarz Inc.",
    period: "2016 – 2017",
    highlights: [
      "Redesign of legacy B2B dashboards drove +15% user engagement (data viz and information architecture); outcomes measured and aligned with business goals.",
      "Bridged design and engineering: Figma/Photoshop to Vue.js; user research and A/B testing used to validate UI changes and tie technical work to KPIs.",
    ],
  },
];
