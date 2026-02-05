export interface SkillGroup {
  label: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Languages & Frameworks",
    items: ["React", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Node.js"],
  },
  {
    label: "Interactions",
    items: ["D3.js", "GSAP", "3D Web Graphics"],
  },
  {
    label: "State & Data",
    items: ["Redux", "Zustand", "React Query", "Context API"],
  },
  {
    label: "Testing & Quality",
    items: ["Jest", "Playwright", "Cypress", "Sentry", "Chrome DevTools"],
  },
  {
    label: "Tools & Cloud",
    items: ["AWS", "Docker", "Git", "GitHub Actions", "Figma", "Storybook"],
  },
];
