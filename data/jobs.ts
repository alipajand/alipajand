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
      "End-to-end frontend for Marketplace & Login (React, Next.js, AWS, Web3).",
      "Design System & Component Library; WCAG accessibility, CI/CD with GitHub Actions.",
      "AI-driven automation (MCP server for Cursor) for code review and velocity.",
    ],
  },
  {
    role: "Senior Frontend Developer",
    company: "Emplifi",
    period: "2022 – 2023",
    highlights: [
      "Data-heavy UIs with GSAP animations; Figma-to-code responsive components.",
      "Data dashboards with D3.js and React; mobile webviews and embedded environments.",
      "A/B testing, Sentry, Hotjar; improved retention and responsiveness.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "ControlTech Startup Studio",
    period: "2018 – 2022",
    highlights: [
      "Performance: code splitting, lazy loading, CDN; reduced first-load times.",
      "PWA from scratch: service workers, offline support, caching.",
      "Jest & Playwright; GitHub Actions; 99.9% deployment stability.",
    ],
  },
  {
    role: "UI/UX Designer & Frontend Developer",
    company: "Rayvarz Inc.",
    period: "2016 – 2017",
    highlights: [
      "Redesigned legacy B2B dashboards; +15% engagement via data viz.",
      "Design-to-code with Figma/Photoshop and Vue.js; user research and A/B testing.",
    ],
  },
];
