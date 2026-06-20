export interface HiringFitCard {
  id: string;
  title: string;
  body: string;
}

export const HIRING_FIT_HEADING = "What I work with";

export const HIRING_FIT_CARDS: HiringFitCard[] = [
  {
    id: "frontend-architecture",
    title: "Frontend Architecture",
    body: "React · Next.js App Router · Server Components · TypeScript · TanStack Query · Zustand · Redux",
  },
  {
    id: "design-systems-accessibility",
    title: "Design Systems & Accessibility",
    body: "Storybook · Design tokens · Component APIs · WCAG · Semantic HTML · Keyboard navigation",
  },
  {
    id: "ai-product-ui",
    title: "AI Product UI",
    body: "Human-in-the-loop UX · Async extraction states · Confidence display · Deterministic vs. probabilistic boundaries",
  },
  {
    id: "data-performance",
    title: "Data & Performance",
    body: "D3.js · GSAP · Rendering optimization · Code splitting · Caching · Sentry · Web Vitals",
  },
  {
    id: "dx-quality",
    title: "Developer Experience & Quality",
    body: "Jest · Playwright · Cypress · React Testing Library · GitHub Actions · CI/CD · Cursor MCP · API contracts",
  },
  {
    id: "additional",
    title: "Additional",
    body: "Tailwind CSS · Figma · SCSS · Node.js · REST · GraphQL · AWS Lambda · MongoDB · CircleCI · Grafana · Lighthouse",
  },
];
