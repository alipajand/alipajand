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
      "Led and shipped high-traffic Marketplace and Login (React, Next.js, AWS) on time—pixel-perfect UI and stable Web3 API integration; production flows met design and performance targets.",
      "Architected design system and component library; drove faster feature delivery across teams. CI/CD (GitHub Actions) for visual regression and WCAG checks reduced a11y regressions to zero in releases.",
      "Introduced AI-driven automation (custom MCP server for Cursor) for code review and lint/type feedback in-IDE, cutting feedback loops and accelerating PR readiness.",
    ],
  },
  {
    role: "Senior Frontend Developer",
    company: "Emplifi",
    period: "2022 – 2023",
    highlights: [
      "Led delivery of data-heavy dashboards and motion (GSAP, D3.js) to spec; A/B testing and analytics (Sentry, Hotjar) drove measurable gains in user retention and interface responsiveness.",
      "Architected rendering and state for embedded mobile webviews so dashboards performed smoothly in third-party contexts—removing jank and friction identified in UX data.",
      "Owned Figma-to-code pipeline with responsive components; aligned technical decisions with business KPIs and user research.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "ControlTech Startup Studio",
    period: "2018 – 2022",
    highlights: [
      "Owned full frontend delivery for multiple startup products—Figma to React/React Native and AWS—shipping stable releases for early customers.",
      "Drove performance: code splitting, lazy loading, and CDN reduced first-load times; PWA (service workers, offline, caching) improved reliability and engagement for key flows.",
      "Established Jest, Playwright, and GitHub Actions CI/CD; achieved 99.9% deployment stability—fewer production incidents and faster, confident releases.",
    ],
  },
  {
    role: "UI/UX Designer & Frontend Developer",
    company: "Rayvarz Inc.",
    period: "2016 – 2017",
    highlights: [
      "Led redesign of legacy B2B dashboards—drove +15% user engagement via data viz and information architecture; outcomes measured and aligned with business goals.",
      "Bridged design and engineering (Figma/Photoshop to Vue.js); drove user research and A/B testing to validate UI changes and tie technical work to KPIs.",
    ],
  },
];
