export interface SkillGroup {
  label: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Product Frontend Architecture",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "App Router", "Component Architecture"],
  },
  {
    label: "Design Systems & Accessibility",
    items: ["Storybook", "Design Tokens", "WCAG", "Semantic HTML", "Keyboard UX", "Figma"],
  },
  {
    label: "AI Product Workflows",
    items: [
      "Human-in-the-loop UX",
      "AI Review Flows",
      "Structured Outputs",
      "Trust Boundaries",
      "Evaluation UX",
    ],
  },
  {
    label: "Backend & API Contracts",
    items: [
      "Node.js",
      "Fastify",
      "Nest.js",
      "Python",
      "PostgreSQL",
      "REST APIs",
      "GraphQL",
      "Zod",
      "OpenAPI",
    ],
  },
  {
    label: "Quality, Observability & DX",
    items: [
      "Jest",
      "Playwright",
      "GitHub Actions",
      "Sentry",
      "CI Quality Gates",
      "Cursor Tooling",
      "Chrome DevTools",
    ],
  },
  {
    label: "Data Visualization & Performance",
    items: ["D3.js", "GSAP", "Web Performance", "Dashboards", "PWA", "Embedded Webviews"],
  },
];

export const SKILLS_CORE_ITEMS = [
  "Product ownership",
  "Architecture judgment",
  "Cross-functional collaboration",
  "Mentorship",
];
