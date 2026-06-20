export const PROJECT_CARD_READ_CASE_STUDY = "Read case study";

export const PORTFOLIO_ADDITIONAL_EXPERIENCE_HEADING = "Additional experience";

export const PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_LABEL = "More contributed projects on LinkedIn";

export const PORTFOLIO_ADDITIONAL_EXPERIENCE_LINK_HREF =
  "https://www.linkedin.com/in/alipajand/details/projects/";

export const PROJECT_MY_ROLE_HEADING = "My role";

export const PROJECT_SECTION_LINK_BACK = "Back to all case studies";

export const PROJECT_SECTION_LINK_NEXT = "Next case study";

export const PROJECT_SECTION_RELATED_HEADING = "Related work";

export const PROJECT_CASE_STUDY_SECTION_CONTEXT = "Context";

export const PROJECT_CASE_STUDY_SECTION_PROBLEM = "Problem";

export const PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT = "What I built";

export const PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS = "Technical decisions";

export const PROJECT_CASE_STUDY_SECTION_UX_DECISIONS = "UX and detail decisions";

export const PROJECT_CASE_STUDY_SECTION_OUTCOME = "Outcome";

export const PROJECT_CASE_STUDY_SECTION_IMPROVE = "What I would improve";

export const PROJECT_CASE_STUDY_SECTION_EVIDENCE = "Interface evidence";

export const PROJECT_CASE_STUDY_TOC_HEADING = "On this page";

export const PROJECT_DECISION_LABEL = "Decision";

export const PROJECT_DECISION_WHY_LABEL = "Why";

export const PROJECT_DECISION_TRADE_OFF_LABEL = "Trade-off";

export const PROJECT_DECISION_RESULT_LABEL = "Result";

export const PROJECT_FIGURE_PLACEHOLDER_LABEL = "Image not available";

export interface ProjectCaseStudyTocItem {
  suffix: string;
  label: string;
}

export const PROJECT_CASE_STUDY_TOC_ITEMS: ProjectCaseStudyTocItem[] = [
  { suffix: "context", label: PROJECT_CASE_STUDY_SECTION_CONTEXT },
  { suffix: "problem", label: PROJECT_CASE_STUDY_SECTION_PROBLEM },
  { suffix: "role", label: PROJECT_MY_ROLE_HEADING },
  { suffix: "built", label: PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT },
  { suffix: "technical-decisions", label: PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS },
  { suffix: "ux-decisions", label: PROJECT_CASE_STUDY_SECTION_UX_DECISIONS },
  { suffix: "evidence", label: PROJECT_CASE_STUDY_SECTION_EVIDENCE },
  { suffix: "outcome", label: PROJECT_CASE_STUDY_SECTION_OUTCOME },
  { suffix: "improve", label: PROJECT_CASE_STUDY_SECTION_IMPROVE },
  { suffix: "related", label: PROJECT_SECTION_RELATED_HEADING },
];

export const projectCaseStudyTocAriaLabel = (projectName: string): string =>
  `Table of contents for ${projectName}`;
