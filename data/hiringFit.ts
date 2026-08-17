export interface HiringFitCard {
  id: string;
  title: string;
  body: string;
}

export const HIRING_FIT_HEADING = "Engineering Capabilities";

export const HIRING_FIT_CARDS: HiringFitCard[] = [
  {
    id: "frontend-architecture",
    title: "Frontend Architecture",
    body: "React, Next.js App Router, TypeScript, Server Components, SSR and static rendering, component architecture, state and data-flow boundaries",
  },
  {
    id: "design-systems",
    title: "Design Systems & UI Engineering",
    body: "Shared component libraries, component APIs, Storybook, semantic HTML, WCAG and keyboard behaviour, responsive systems, Tailwind CSS, Figma",
  },
  {
    id: "full-stack-product-systems",
    title: "Full-Stack & Product Systems",
    body: "Node.js, Fastify, REST and GraphQL APIs, PostgreSQL, Prisma, Supabase Auth and Storage, Redis/BullMQ background jobs, Python workers, Stripe, Docker, AWS",
  },
  {
    id: "quality-developer-experience",
    title: "Quality & Developer Experience",
    body: "Jest, React Testing Library, Playwright, Cypress, GitHub Actions, CI quality gates, code review, AI-assisted development with Cursor and custom MCP tooling",
  },
  {
    id: "performance-observability",
    title: "Performance & Observability",
    body: "D3.js, GSAP, rendering and paint optimization, mobile webview constraints, Web Vitals, Sentry, Hotjar",
  },
];
