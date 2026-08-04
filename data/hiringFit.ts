export interface HiringFitCard {
  id: string;
  title: string;
  body: string;
}

export const HIRING_FIT_HEADING = "Skills & Capabilities";

export const HIRING_FIT_CARDS: HiringFitCard[] = [
  {
    id: "full-stack-web",
    title: "Full-Stack Web",
    body: "React, Next.js, TypeScript, Node.js, Fastify, REST APIs, GraphQL, HTML, CSS, Tailwind CSS",
  },
  {
    id: "backend-data",
    title: "Backend & Data",
    body: "PostgreSQL, Supabase, Redis/BullMQ, authentication, background jobs, API contracts",
  },
  {
    id: "ai-assisted-engineering",
    title: "AI-Assisted Engineering",
    body: "Cursor, Claude, Codex, custom MCP tooling, agent orchestration, OpenAI APIs",
  },
  {
    id: "product-ui",
    title: "Product UI",
    body: "Storybook, design systems, Figma, WCAG, responsive design, SEO, D3.js, GSAP, Web Vitals",
  },
  {
    id: "quality-delivery",
    title: "Quality & Delivery",
    body: "Jest, Playwright, Cypress, React Testing Library, Docker, AWS, GitHub Actions, CI/CD, Sentry",
  },
];
