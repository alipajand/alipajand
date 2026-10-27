/**
 * What the site publishes from `data/projects.ts`.
 *
 * Owner decision: the 80% Emplifi rendering figure and the 90% LedgerGuard coverage figure stay in
 * the project data, but no page, card, meta description, JSON-LD block or llms export renders them.
 * `utils/projects.ts` applies this policy in one place (`toPublicProject`) before any project leaves
 * the data layer:
 *
 * - list lines and diagram details that carry a suppressed figure are dropped;
 * - whole-string fields that carry one are replaced by the override below (the wording approved in
 *   the design artifacts where one exists);
 * - anything still carrying a figure afterwards throws, so new data cannot leak it silently.
 */

export interface SuppressedClaim {
  projectId: string;
  /** The exact figure that must not be published. */
  figure: string;
  /** Why it is held back. */
  reason: string;
}

export const SUPPRESSED_CLAIMS: readonly SuppressedClaim[] = [
  {
    projectId: "emplifi",
    figure: "80%",
    reason: "Re-render and paint reduction without a published measurement.",
  },
  {
    projectId: "ledgerguard",
    figure: "90%",
    reason: "Unit-test coverage figure without a published report.",
  },
];

/** Whole-string fields that may be replaced when their stored text carries a suppressed figure. */
export interface PublicProjectOverrides {
  cardProblem?: string;
  caseStudyMetaDescription?: string;
}

export const PUBLIC_PROJECT_OVERRIDES: Readonly<Record<string, PublicProjectOverrides>> = {
  emplifi: {
    // The portfolio index wording approved in docs/design/kit/static/portfolio.html.
    cardProblem:
      "Data-heavy React, TypeScript, and D3.js analytics modules assembled from shared accessible components, running in desktop browsers and embedded mobile webviews, with rendering work profiled on the webview path.",
    caseStudyMetaDescription:
      "Case study: React, TypeScript, and D3.js enterprise analytics modules built on shared accessible components, with rendering work profiled on the embedded mobile webview path. Senior Frontend Engineer — Ali Pajand.",
  },
};
