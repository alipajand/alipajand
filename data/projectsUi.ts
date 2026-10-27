export const PROJECT_MY_ROLE_HEADING = "My role";

export const PROJECT_SECTION_LINK_BACK = "Back to all case studies";

export const PROJECT_SECTION_RELATED_HEADING = "Related work";

export const PROJECT_CASE_STUDY_SECTION_CONTEXT = "Context";

export const PROJECT_CASE_STUDY_SECTION_PROBLEM = "Problem";

export const PROJECT_CASE_STUDY_SECTION_WHAT_I_BUILT = "What I built";

export const PROJECT_CASE_STUDY_SECTION_TECHNICAL_DECISIONS = "Technical decisions";

export const PROJECT_CASE_STUDY_SECTION_UX_DECISIONS = "UX and detail decisions";

export const PROJECT_CASE_STUDY_SECTION_OUTCOME = "Outcome";

export const PROJECT_CASE_STUDY_SECTION_IMPROVE = "What I would improve";

export const PROJECT_CASE_STUDY_SECTION_EVIDENCE = "Interface evidence";

export const PROJECT_DECISION_LABEL = "Decision";

export const PROJECT_DECISION_WHY_LABEL = "Why";

export const PROJECT_DECISION_TRADE_OFF_LABEL = "Trade-off";

export const PROJECT_DECISION_RESULT_LABEL = "Result";

export const projectCaseStudyTocAriaLabel = (projectName: string): string =>
  `Table of contents for ${projectName}`;

export const projectLiveLinksAriaLabel = (projectName: string): string =>
  `${projectName} live links`;

export const PORTFOLIO_PROFILE_LINKS_ARIA_LABEL = "Profiles and booking";

export const PORTFOLIO_PROFILE_LINK_LABELS = ["GitHub", "LinkedIn", "Book a call"] as const;

/* Case-study page chrome (hairline layout). */

export const PROJECT_BREADCRUMB_ARIA_LABEL = "Breadcrumb";

export const PROJECT_FACT_ROLE_LABEL = "Role";

export const PROJECT_FACT_TIMEFRAME_LABEL = "Timeframe";

export const PROJECT_FACT_STACK_LABEL = "Stack";

export const PROJECT_PAGER_ARIA_LABEL = "Case studies";

export const PROJECT_PAGER_INDEX_EYEBROW = "[ Index ]";

export const PROJECT_PAGER_NEXT_EYEBROW = "[ Next case study ]";

export const PROJECT_FIGURE_ENLARGE_LABEL = "Enlarge";

export const PROJECT_FIGURE_CLOSE_LABEL = "Close";

export const projectRelatedLinksAriaLabel = (projectName: string): string =>
  `${projectName} related work`;

/** Head label on a flow band, such as "Diagram · Technical decisions". */
export const projectFlowEyebrow = (sectionTitle: string): string => `Diagram · ${sectionTitle}`;

export const projectFlowBandLabel = (sectionTitle: string): string => `${sectionTitle} diagram`;

/** Small label over an internal related link: the kind of page it opens. */
export const projectRelatedKind = (href: string): string => {
  if (href.startsWith("/writing")) return "Writing";
  if (href.startsWith("/portfolio")) return "Case study";
  return "Page";
};
