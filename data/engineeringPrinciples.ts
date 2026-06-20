export const ENGINEERING_PRINCIPLES_META_DESCRIPTION =
  "Working principles for frontend product engineering: honest interfaces, visible async states, reviewable AI output, component APIs, accessibility, typed contracts, and maintainability. Ali Pajand.";

export const ENGINEERING_PRINCIPLES_PAGE_TITLE = "Engineering Principles";

export const ENGINEERING_PRINCIPLES_HEADER_OVERLINE = "Principles";

export const ENGINEERING_PRINCIPLES_LEDE =
  "These are the working principles I return to across SaaS products, enterprise dashboards, AI-assisted workflows, and startup delivery.";

export interface EngineeringPrinciplesSection {
  id: string;
  title: string;
  paragraphs: [string, string] | [string];
}

export const ENGINEERING_PRINCIPLES_SECTIONS: EngineeringPrinciplesSection[] = [
  {
    id: "honest-interfaces",
    title: "Build honest interfaces",
    paragraphs: [
      "The UI should make the state of the system legible instead of smoothing over uncertainty. When data is partial, stale, or inferred, the interface should say so plainly rather than borrowing confidence from the design.",
      "That matters even more in workflow-heavy products where people make decisions from what the UI appears to confirm.",
    ],
  },
  {
    id: "visible-async",
    title: "Make async states visible",
    paragraphs: [
      "Loading, retrying, recovering, partial success, and failure are part of the product, not temporary engineering details. If those states are invisible, users are forced to guess what the system is doing.",
      "The result is avoidable confusion, duplicate actions, and fragile operator workflows.",
    ],
  },
  {
    id: "reviewable-ai",
    title: "Keep AI output reviewable",
    paragraphs: [
      "AI-assisted features need explicit boundaries between suggested output and confirmed truth. I prefer review flows that let people inspect source context, correct the result, and understand what remains uncertain.",
      "That keeps probabilistic output from silently becoming product truth.",
    ],
  },
  {
    id: "components-as-apis",
    title: "Treat components as APIs",
    paragraphs: [
      "A shared component is only useful when its contract is clear about states, semantics, and escape hatches. I treat component APIs as product surfaces that other engineers rely on, not just as visual wrappers.",
      "That mindset improves reuse and reduces the drift that usually breaks design systems over time.",
    ],
  },
  {
    id: "accessibility-quality",
    title: "Accessibility is product quality",
    paragraphs: [
      "Semantic HTML, keyboard behavior, focus management, and motion preferences are not polish passes. They are part of whether the product works reliably for real people in real environments.",
      "Teams that defer accessibility usually end up with weaker abstractions and more expensive rework.",
    ],
  },
  {
    id: "typed-contracts",
    title: "Prefer typed contracts and deterministic boundaries",
    paragraphs: [
      "Typed API contracts reduce accidental ambiguity between frontend, backend, and tooling. I aim to keep deterministic logic explicit so the product remains testable even when the surrounding workflow includes probabilistic systems.",
      "That separation makes failures easier to explain and easier to recover from.",
    ],
  },
  {
    id: "edge-cases-before-polish",
    title: "Design for edge cases before polish",
    paragraphs: [
      "A workflow that only feels good on the happy path is not ready. I want to understand where validation, retries, long-running jobs, missing data, and role-specific confusion will surface before I spend time polishing the final layer.",
      "That usually produces better product decisions earlier.",
    ],
  },
  {
    id: "short-feedback-loops",
    title: "Use tooling to shorten feedback loops",
    paragraphs: [
      "Good tooling makes the next correct decision easier and the wrong decision harder to miss. Tests, linting, typed contracts, CI checks, and developer tooling all matter because they reduce the time between change and useful feedback.",
      "I care about that loop because it shapes both code quality and team behavior.",
    ],
  },
  {
    id: "maintainability",
    title: "Optimize for maintainability, not cleverness",
    paragraphs: [
      "I would rather leave behind a system that another engineer can reason about than one that looks impressive in isolation. Clear naming, bounded responsibilities, and predictable patterns usually outperform dense abstractions over time.",
      "Maintainability is not the opposite of ambition. It is what lets ambitious products keep evolving.",
    ],
  },
];
