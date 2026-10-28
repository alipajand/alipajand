export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  period: string;
  summary: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  period: string;
  institution: string;
}

export const EXPERIENCE_HEADING = "Experience";

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "ledgerguard",
    organization: "LedgerGuard",
    role: "Senior Product Engineer · Independent product",
    period: "2026–Present",
    summary:
      "Designed and built a multi-tenant AI contract-intelligence SaaS alone: Next.js App Router frontend, Node.js/Fastify API, PostgreSQL, Redis/BullMQ jobs, and a Python extraction worker, with human review before any extracted value becomes confirmed data.",
  },
  {
    id: "alwaysgeeky",
    organization: "AlwaysGeeky Games",
    role: "Senior Frontend Engineer",
    period: "2024–2026",
    summary:
      "Built and owned the shared React and TypeScript design system four product surfaces were built on, wrote the design docs for its changes, drove adoption with the engineers building those surfaces, mentored through pairing and code review, and shipped marketplace and authentication flows in Next.js.",
  },
  {
    id: "emplifi",
    organization: "Emplifi",
    role: "Senior Frontend Engineer",
    period: "2022–2023",
    summary:
      "Built React, TypeScript, and D3.js analytics dashboards for desktop, embedded, and mobile-webview contexts, profiled and reduced rendering cost on the mobile-webview path, traced production issues with Sentry and Hotjar, and mentored one to two engineers through the formal mentoring program.",
  },
  {
    id: "controltech",
    organization: "ControlTech",
    role: "Frontend Engineer",
    period: "2018–2022",
    summary:
      "Delivered PWAs, dashboards, and workflow-heavy interfaces across concurrent startup products from MVP to production, worked through API contracts with backend engineers, and protected core flows with Jest, React Testing Library, Cypress, Playwright, and CI checks.",
  },
  {
    id: "freelance",
    organization: "Independent freelance projects",
    role: "Freelance web developer · Alongside Rayvarz and ControlTech",
    period: "2015–2022",
    summary: "Built web applications with Nuxt.js and Vue.js.",
  },
  {
    id: "rayvarz",
    organization: "Rayvarz Software Engineering Company",
    role: "UI/UX Designer & Frontend Developer",
    period: "2015–2017",
    summary:
      "UI/UX design, information architecture, and Vue.js frontend work for Rayvarz's financial accounting software and company website.",
  },
];

export const EDUCATION_HEADING = "Education";

export const EDUCATION: EducationEntry[] = [
  {
    id: "masters",
    degree: "Master’s Degree, Computer Information Technology",
    period: "2014–2017",
    institution: "Allameh Tabataba'i University",
  },
  {
    id: "bachelors",
    degree: "Bachelor’s Degree, Engineering/Industrial Management",
    period: "2010–2014",
    institution: "Allameh Tabataba'i University",
  },
];

export const experienceCount = (roles: number): string => `${roles} roles`;
