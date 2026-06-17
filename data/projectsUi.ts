export const PROJECT_CARD_CAPABILITIES_LABEL = "Capabilities";

export const PROJECT_CARD_READ_CASE_STUDY = "Read case study";

export const PROJECT_RESPONSIBILITY_HEADING = "My responsibility";

export const PROJECT_RESPONSIBILITY_OWNED = "What I personally owned";

export const PROJECT_RESPONSIBILITY_COLLABORATIVE = "What was collaborative";

export const PROJECT_RESPONSIBILITY_OUTSIDE = "What was outside my responsibility";

export const PROJECT_SECTION_LINK_BACK = "Back to all case studies";

export const PROJECT_SECTION_LINK_NEXT = "Next case study";

export const PROJECT_SECTION_RELATED_HEADING = "Related work";

export const PROJECT_CASE_STUDY_SECTION_OVERVIEW = "Overview";

export const PROJECT_CASE_STUDY_SECTION_CONTEXT = "Context and constraints";

export const PROJECT_CASE_STUDY_SECTION_PROBLEM = "The problem";

export const PROJECT_CASE_STUDY_SECTION_DECISIONS = "Key decisions";

export const PROJECT_CASE_STUDY_SECTION_WORKFLOW = "Product workflow or system architecture";

export const PROJECT_CASE_STUDY_SECTION_EVIDENCE = "Interface evidence";

export const PROJECT_CASE_STUDY_SECTION_STATES = "Difficult states and edge cases";

export const PROJECT_CASE_STUDY_SECTION_OUTCOME = "Outcome";

export const PROJECT_CASE_STUDY_SECTION_IMPROVE = "What I would improve next";

export const PROJECT_CASE_STUDY_TOC_HEADING = "On this page";

export const PROJECT_CASE_STUDY_FACTUAL_REVIEW_PREFIX = "Factual review note:";

export const PROJECT_DECISION_LABEL = "Decision";

export const PROJECT_DECISION_WHY_LABEL = "Why";

export const PROJECT_DECISION_TRADE_OFF_LABEL = "Trade-off";

export const PROJECT_DECISION_RESULT_LABEL = "Result";

export interface ProjectCaseStudyTocItem {
  suffix: string;
  label: string;
}

export const PROJECT_CASE_STUDY_TOC_ITEMS: ProjectCaseStudyTocItem[] = [
  { suffix: "overview", label: PROJECT_CASE_STUDY_SECTION_OVERVIEW },
  { suffix: "context", label: PROJECT_CASE_STUDY_SECTION_CONTEXT },
  { suffix: "responsibility", label: PROJECT_RESPONSIBILITY_HEADING },
  { suffix: "problem", label: PROJECT_CASE_STUDY_SECTION_PROBLEM },
  { suffix: "decisions", label: PROJECT_CASE_STUDY_SECTION_DECISIONS },
  { suffix: "workflow", label: PROJECT_CASE_STUDY_SECTION_WORKFLOW },
  { suffix: "evidence", label: PROJECT_CASE_STUDY_SECTION_EVIDENCE },
  { suffix: "states", label: PROJECT_CASE_STUDY_SECTION_STATES },
  { suffix: "outcome", label: PROJECT_CASE_STUDY_SECTION_OUTCOME },
  { suffix: "improve", label: PROJECT_CASE_STUDY_SECTION_IMPROVE },
  { suffix: "related", label: PROJECT_SECTION_RELATED_HEADING },
];

export const projectCaseStudyTocAriaLabel = (projectName: string): string =>
  `Table of contents for ${projectName}`;
