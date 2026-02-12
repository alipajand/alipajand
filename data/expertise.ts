export interface ExpertiseArea {
  title: string;
  sentence: string;
  tags: string[];
}

export const EXPERTISE_AREAS: ExpertiseArea[] = [
  {
    title: "Frontend architecture",
    sentence:
      "I scale React, Next.js, Vue 3, and Nuxt 3 apps with clear structure—libraries, design systems, and tooling so teams don't step on each other.",
    tags: ["React", "Next.js", "Vue 3", "Nuxt 3", "TypeScript", "Vite"],
  },
  {
    title: "State & data",
    sentence:
      "I use Zustand, Redux, Pinia, and React Query so complex UIs (dashboards, real-time) stay predictable and easy to debug.",
    tags: ["Zustand", "Redux", "Pinia", "React Query", "Context API"],
  },
  {
    title: "Interactions & motion",
    sentence:
      "I build GSAP timelines, D3.js charts, and 3D/WebGL when motion and data viz are part of the product—not just eye candy.",
    tags: ["GSAP", "D3.js", "3D Web Graphics"],
  },
  {
    title: "Design systems & accessibility",
    sentence:
      "I run design systems in Storybook, keep components WCAG-ready, and use CI to block a11y and visual regressions.",
    tags: ["Storybook", "WCAG", "Figma", "GitHub Actions"],
  },
  {
    title: "Backend & APIs",
    sentence:
      "I design and wire up Node.js, REST, and GraphQL so the frontend gets clear contracts and good error handling.",
    tags: ["Node.js", "Nest.js", "REST APIs", "GraphQL", "PostgreSQL"],
  },
  {
    title: "Testing & reliability",
    sentence:
      "I set up Jest, Playwright, and Sentry so we catch bugs in CI and fix production issues fast.",
    tags: ["Jest", "Playwright", "Sentry", "Chrome DevTools"],
  },
  {
    title: "Infrastructure & DX",
    sentence:
      "I ship with AWS, Docker, and GitHub Actions. I also build custom tooling (like the MCP for Cursor) so feedback is fast.",
    tags: ["AWS", "Docker", "Git", "GitHub Actions", "Vite"],
  },
];

export const EXPERTISE_CORE =
  "I lead, collaborate, and mentor. I care about stable releases and clear communication.";
