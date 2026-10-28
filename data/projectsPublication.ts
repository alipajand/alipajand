/**
 * What the site publishes from `data/projects.ts`.
 *
 * Owner decision: the 90% LedgerGuard coverage figure stays in the project data, but no page, card,
 * meta description, JSON-LD block or llms export renders it. (The unsourced 80% Emplifi rendering
 * figure was removed from the data altogether.)
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

export const PUBLIC_PROJECT_OVERRIDES: Readonly<Record<string, PublicProjectOverrides>> = {};
