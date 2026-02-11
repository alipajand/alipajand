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
      "Shipped Marketplace and Login (React, Next.js, AWS) on time. Clean UI and solid Web3 API integration.",
      "Built the design system and component library so teams could move faster. Set up CI (GitHub Actions) so we catch visual and a11y issues before merge.",
      "Built a custom MCP server for Cursor so lint and types run in the editor—fewer surprises in PRs.",
    ],
  },
  {
    role: "Senior Frontend Developer",
    company: "Emplifi",
    period: "2022 – 2023",
    highlights: [
      "Built data-heavy dashboards with GSAP and D3.js. Used A/B tests and analytics (Sentry, Hotjar) to improve retention and responsiveness.",
      "Made the same dashboards run smoothly inside mobile webviews and embeds—no more jank.",
      "Took Figma to code and kept design and engineering in sync. Used user research to decide what to build.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "ControlTech Startup Studio",
    period: "2018 – 2022",
    highlights: [
      "Built frontend for several startup products—Figma to React/React Native and AWS. Shipped stable releases for early users.",
      "Cut load times with code splitting, lazy loading, and a CDN. Built PWAs (offline, caching) so key flows kept working.",
      "Set up Jest, Playwright, and GitHub Actions. Got to 99.9% deployment stability—fewer fires, faster releases.",
    ],
  },
  {
    role: "UI/UX Designer & Frontend Developer",
    company: "Rayvarz Inc.",
    period: "2016 – 2017",
    highlights: [
      "Redesigned old B2B dashboards. Better data viz and layout led to +15% engagement. We measured it.",
      "Connected design and code (Figma/Photoshop to Vue.js). Ran user research and A/B tests to check if changes actually helped.",
    ],
  },
];
