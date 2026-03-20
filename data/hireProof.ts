export interface HireProofItem {
  id: string;
  title: string;
  summary: string;
}

export const HIRE_PROOF_HEADING = "Why teams hire me";

export const HIRE_PROOF_INTRO =
  "At a glance—how I show up for teams. Case studies below go deeper on each problem.";

export const HIRE_PROOF_ITEMS: HireProofItem[] = [
  {
    id: "design-systems",
    title: "Design systems that unblock teams",
    summary:
      "Storybook-driven libraries and shared UI that cut UI development time; CI blocks visual and a11y regressions before merge, with WCAG compliance across products.",
  },
  {
    id: "frontend-architecture",
    title: "Frontend architecture that scales",
    summary:
      "Clear structure for React, Next.js, and Vue/Nuxt apps—libraries, design systems, and tooling so teams don’t step on each other as the codebase grows.",
  },
  {
    id: "a11y-quality",
    title: "Accessibility and quality guardrails",
    summary:
      "WCAG-ready components and automated checks in CI so accessibility and visuals are protected in review—not bolted on at the end.",
  },
  {
    id: "product-minded",
    title: "Product-minded execution",
    summary:
      "I sit between design and engineering: messy requirements become shipped product, with technical work aligned to research and KPIs when the role calls for it.",
  },
  {
    id: "dx-tooling",
    title: "Developer experience and tooling",
    summary:
      "GitHub Actions, Jest, Playwright, and custom tooling (e.g. an MCP server for Cursor) so lint, types, and tests surface early—cleaner PRs and faster feedback.",
  },
  {
    id: "stable-shipping",
    title: "Stable shipping and reliability",
    summary:
      "Jest, Playwright, and GitHub Actions in CI/CD—including 99.9% deployment stability in a multi-product studio with fewer production incidents and faster, confident releases.",
  },
];
