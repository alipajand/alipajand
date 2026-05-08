export interface HowIThinkCard {
  id: string;
  title: string;
  body: string;
}

export const HOW_I_THINK_HEADING = "How I Think";

export const HOW_I_THINK_LEDE =
  "Systems thinking, AI-native engineering, and mature architecture. Not generic UI churn.";

export const HOW_I_THINK_CARDS: HowIThinkCard[] = [
  {
    id: "deterministic-vs-probabilistic",
    title: "Deterministic vs Probabilistic Systems",
    body:
      "Stable product surfaces stay deterministic: predictable flows, explicit contracts, and testable behavior. AI-driven paths are probabilistic, models infer, rank, and draft, so they need boundaries, fallbacks, and evaluation harnesses. I keep those worlds separated so reliability stays intentional rather than accidental.",
  },
  {
    id: "human-in-the-loop-ai",
    title: "Human-in-the-Loop AI",
    body:
      "Trust comes from validation loops: reviewers see provenance, edits are traceable, and confidence is surfaced honestly, not buried in UX polish. I design for human judgment where stakes are high, with clear escalation paths instead of silent automation.",
  },
  {
    id: "reliability-over-velocity-theater",
    title: "Reliability Over Velocity Theater",
    body:
      "Shipping fast means nothing if prod is noisy and regressions stick around. I bias toward observability, CI gates, and release hygiene so teams learn from incidents instead of replaying them. Velocity follows when the system tells the truth.",
  },
  {
    id: "design-systems-as-infrastructure",
    title: "Design Systems as Infrastructure",
    body:
      "A design system is shared infrastructure: tokens, components, and docs that scale teams without forcing everyone through the same bottleneck. Consistency improves DX; DX compounds into faster, safer product iteration.",
  },
  {
    id: "accessibility-as-architecture",
    title: "Accessibility as Architecture",
    body:
      "Accessibility is not a checklist bolt-on. It is part of information architecture, keyboard flows, and semantics from day one. Building inclusively improves clarity for everyone and prevents expensive rework when compliance finally lands.",
  },
];
