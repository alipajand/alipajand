/**
 * A dated snapshot of public GitHub contributions: one count per full day from `from` to `to`.
 * Only contributions to public repositories are counted (commits on the default branch, pull
 * requests, reviews, issues and new repositories); private work is left out. GitHub dates them by
 * US Pacific day, so a day here can differ from the Toronto day near midnight.
 *
 * To refresh, query `user.contributionsCollection` with the GitHub GraphQL API in windows of up to
 * 90 days, keep the items whose repository is public, and check that each window's public items plus
 * `restrictedContributionsCount` equal its `contributionCalendar.totalContributions`. End at the last
 * full day before `collectedAt`.
 */
export interface ContributionSnapshot {
  user: string;
  /** Where the counts come from. */
  source: string;
  /** When the snapshot was collected, as an ISO timestamp. */
  collectedAt: string;
  /** ISO date of the first day in `counts`. */
  from: string;
  /** ISO date of the last day in `counts`, the last full day before `collectedAt`. */
  to: string;
  counts: readonly number[];
}

export const OPEN_SOURCE_CONTRIBUTION_SNAPSHOT: ContributionSnapshot = {
  user: "alipajand",
  source: "GitHub GraphQL API, user.contributionsCollection, public repositories only",
  collectedAt: "2026-10-28T16:45:08Z",
  from: "2025-10-26",
  to: "2026-10-26",
  counts: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4,
    0, 0, 0, 0, 0, 0, 26, 1, 0, 0, 0, 0, 15, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 4, 0, 13, 0, 0,
    8, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0, 5, 0, 1, 0, 3, 0, 4, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0,
    0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 2, 65,
    21, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 33, 0, 5, 10, 5, 0, 1, 6, 0, 0, 0, 22, 0, 3, 0, 2, 0, 3, 0, 0,
    2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0,
    0, 0, 0, 0, 26, 1, 1, 0, 0, 0, 2, 0, 0, 0, 2, 1, 0, 0, 2, 1, 0, 0, 1, 0, 0, 1, 2, 0, 0, 8, 2, 0,
    0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 1, 0, 0, 0, 10, 0, 185, 0, 0, 0, 0, 2, 0, 6, 11, 0, 5, 0, 0, 4,
    24, 101, 2, 0, 51, 9, 5, 3, 1, 0, 0, 0, 9, 0, 0, 4, 17, 0, 2,
  ],
};
