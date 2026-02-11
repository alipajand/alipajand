export interface SkillGroup {
  label: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Languages & Frameworks",
    items: [
      "React",
      "Next.js",
      "Vue 3",
      "Nuxt 3",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
    ],
  },
  {
    label: "Backend & APIs",
    items: ["Node.js", "Nest.js", "Python", "PostgreSQL", "REST APIs", "GraphQL"],
  },
  {
    label: "Interactions",
    items: ["D3.js", "GSAP", "3D Web Graphics"],
  },
  {
    label: "State & Data",
    items: ["Redux", "Zustand", "Pinia", "React Query", "Context API"],
  },
  {
    label: "Testing & Quality",
    items: ["Jest", "Playwright", "Sentry", "Chrome DevTools"],
  },
  {
    label: "Tools & Cloud",
    items: ["AWS", "Docker", "Git", "GitHub Actions", "Vite", "Figma", "Storybook"],
  },
];

export const SKILLS_CORE_ITEMS = ["Leadership", "Collaboration", "Communication", "Mentorship"];
