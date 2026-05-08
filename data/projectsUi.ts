import type { CaseStudyBlock } from "data/projects";

export const PROJECTS_SECTION_HEADING = "Case studies";

export const PROJECTS_SECTION_LEDE =
  "Outcome first, then how the work was structured—technical signals up front, full stack on request. Serious write ups, not a gallery.";

export const PROJECTS_SIDEBAR_HEADING = "On this page";

export const PROJECTS_SIDEBAR_ARIA_LABEL = "Jump to case study";

export const PROJECT_CARD_ARIA_BADGES = "Project themes";

export const PROJECT_CARD_BEST_FOR_PREFIX = "Best for:";

export const PROJECT_CARD_TECHNICAL_SIGNALS = "Technical signals";

export const PROJECT_CARD_FULL_STACK_SUMMARY = "Full stack";

export const PROJECT_CARD_CASE_STUDY_SR = "Case study";

export const PROJECT_CARD_LEDGER_DIAGRAM_CAPTION =
  "High-level flow: domain API owns tenant truth; workers run asynchronously and return through verification and internal callbacks—not direct writes.";

export const PROJECT_CARD_MORE_OUTCOMES = "More outcomes";

export const PROJECT_CARD_OPEN_SITE = "Open site";

export const PROJECT_CARD_EXTERNAL_NEW_TAB_HINT = " (opens in new tab)";

export function projectCaseStudyImageAlt(projectName: string): string {
  return `Case study visual: ${projectName}`;
}

export const PROJECT_CASE_STUDY_ROWS: { key: keyof CaseStudyBlock; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "constraints", label: "Constraints" },
  { key: "architectureDecisions", label: "Architecture decisions" },
  { key: "tradeoffs", label: "Tradeoffs" },
  { key: "reliabilityPerformance", label: "Reliability / performance" },
  { key: "outcome", label: "Outcome" },
];
