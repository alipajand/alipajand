import type { CaseStudyBlock } from "data/projects";

export const PROJECTS_SECTION_HEADING = "Case studies";

export const PROJECTS_SECTION_LEDE =
  "Outcome first, then how the work was structured. Technical signals up front, full stack on request. Serious write-ups, not a gallery.";

export const PROJECTS_SIDEBAR_HEADING = "On this page";

export const PROJECTS_SIDEBAR_ARIA_LABEL = "Jump to case study";

export const PROJECT_CARD_ARIA_BADGES = "Project themes";

export const PROJECT_CARD_BEST_FOR_PREFIX = "Best for:";

export const PROJECT_CARD_TECHNICAL_SIGNALS = "Technical signals";
export const PROJECT_CARD_CONTRIBUTION_LABEL = "My contribution";

export const PROJECT_CARD_FULL_STACK_SUMMARY = "Full stack";

export const PROJECT_CARD_CASE_STUDY_SR = "Case study";

export const PROJECT_CARD_HIGH_LEVEL_FLOW_LABEL = "High-level flow";

export const PROJECT_CARD_HIGH_LEVEL_FLOW_ARIA = "High-level flow steps";

export const PROJECT_CARD_LEDGER_DIAGRAM_CAPTION =
  "High-level flow: domain API owns tenant truth; workers run asynchronously and return through verification and internal callbacks, not direct writes.";

export const PROJECT_CARD_MORE_OUTCOMES = "More outcomes";

export const PROJECT_CARD_OWNED_LABEL = "What I owned";

export const PROJECT_CARD_OPEN_PROJECT = "Project";

export const PROJECT_CARD_EXTERNAL_NEW_TAB_HINT = " (opens in new tab)";

export function projectCaseStudyImageAlt(projectName: string): string {
  return `Case study visual: ${projectName}`;
}

type CaseStudyRowKey = Exclude<keyof CaseStudyBlock, "owned" | "highLevelFlow">;

export const PROJECT_CASE_STUDY_ROWS: { key: CaseStudyRowKey; label: string }[] = [
  { key: "problem", label: "Context and problem" },
  { key: "constraints", label: "Constraints" },
  { key: "architectureDecisions", label: "Key decisions" },
  { key: "technicalImplementation", label: "Technical implementation" },
  { key: "uxAccessibility", label: "UX and accessibility" },
  { key: "outcome", label: "Outcome and evidence" },
  { key: "tradeoffs", label: "Trade-offs and lessons" },
];
