# Contribution metrics on /open-source: two options

Status: **options for the owner (A3 in
[`now-freshness-and-activity.md`](./now-freshness-and-activity.md)); changes a displayed metric, so
nothing is implemented.** The shipped data (`data/openSourceActivity.ts`) and copy are unchanged.
The images under `docs/audits/evidence/proposals/` are mocks drawn by editing the built page in a
browser, tagged "PROPOSAL MOCK · not shipped".

Baseline: `main` at `97651be` (contains `e1025e5`). Inputs reviewed: #253 (merged),
`data/openSourceActivity.ts`, `data/openSourcePage.ts:318-326,434-440`,
`features/open-source/OpenSourceActivity.tsx`, `docs/design/kit/build.mjs:196-220`, and A1–A3 of
`now-freshness-and-activity.md`. GitHub was queried with `gh api graphql` signed in as `alipajand`
(token scopes `repo`, `read:org`, `gist`, `workflow`, `admin:public_key`) between 2026-10-28
00:13Z and 00:20Z (20:13–20:20 Toronto on Oct 27). Mocks: Playwright Chromium 156 against
`next start -p 3523`, JavaScript disabled so every week of the calendar shows.

## 1. What ships today

- Data: `taken: "2026-10-27"`, `from: "2025-10-26"`, `total: 16511`, 367 daily counts
  (2025-10-26 to 2026-10-27) and GitHub's levels (`data/openSourceActivity.ts:20-24`). The counts sum
  to 16,511. The last day (42) was scraped while 2026-10-27 was still in progress.
- Source: the signed-out HTML calendar at `github.com/users/alipajand/contributions`, scraped by
  `docs/design/kit/build.mjs:199-219` and copied by hand (comment at `data/openSourceActivity.ts:1-7`).
  `taken` is the **UTC** date of the run (`build.mjs:210`).
- Copy: heading "Contribution activity" (`data/openSourcePage.ts:263`); lede "…GitHub counts
  private contributions there too, so it shows when I was active, not how much open-source work
  shipped." (`:318-319`); stats "Last year · 16,511 · contributions", "Active days · 301 · of 367",
  "Longest streak · 104 · days", "Busiest day · 574 · Oct 20, 2026"; readout
  "[ Snapshot · Oct 27, 2026 ]". Mock baseline: `open-source-activity-current-1280.png`.
- Other copies of the same numbers: `docs/design/kit/activity.json:5`,
  `docs/design/pages/open-source.html:651`, and tests at
  `features/open-source/__tests__/OpenSourcePageContent.spec.tsx:180-184` and
  `utils/__tests__/remainingPagesUtils.spec.ts:39`.

The copy is truthful since #253, but the headline number on a page about open-source work is mostly
private work (section 2).

## 2. Reconciliation with the GraphQL API

### 2.1 Same window as the snapshot

`contributionsCollection(from: "2025-10-26T00:00:00Z", to: "2026-10-27T23:59:59Z")`, fetched at
2026-10-28T00:13Z (query in section 5.1):

| Field                                                             | Value                                                                      |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `contributionCalendar.totalContributions` (= sum of its 367 days) | **16,750**                                                                 |
| `restrictedContributionsCount`                                    | **15,600** (93.1%)                                                         |
| `totalCommitContributions`                                        | 878                                                                        |
| `totalPullRequestContributions`                                   | 223                                                                        |
| `totalPullRequestReviewContributions`                             | 24                                                                         |
| `totalIssueContributions`                                         | 15                                                                         |
| `totalRepositoryContributions`                                    | 10                                                                         |
| Attributable total                                                | **1,150** (6.9%)                                                           |
| Restricted + attributable                                         | 16,750, exactly the calendar total                                         |
| Repositories with attributable contributions                      | 12, **all `isPrivate: false`**; the 10 created repositories are all public |

Largest public repositories: `alipajand/alipajand` (408 commits, 118 PRs, 23 reviews),
`alipajand/agent-context-doctor` (128 / 28 / 8 issues), `alipajand/agent-readiness-action`
(120 / 41), `alipajand/agent-pr-reviewer-lite` (90 / 15 / 1 / 5 issues),
`alipajand/agent-readiness-kit` (89 / 19 / 2 issues); seven more with 1–21 commits each.

GitHub's schema defines `restrictedContributionsCount` as "A count of contributions made by the user
that the viewer cannot access." Even signed in as the owner with `repo` and `read:org`, 15,600 are
restricted, and none of the attributable contributions are private. So every private contribution
in this window is anonymous to this token, and its repositories cannot be listed; which
organisations they belong to is not verified.

The same query with Toronto offsets (`2025-10-26T00:00:00-04:00` to `2026-10-27T23:59:59-04:00`)
returned identical totals (the calendar gained a 368th day, 2026-10-28, with 0).

**Per day against the committed snapshot:** 27 of 367 days differ, by 313 in total.

- 2026-10-27: +246 (42 in the snapshot, 288 in the API): the partial last day.
- 21 days are offsetting shifts between neighbouring days: nine pairs (for example 2026-04-15 +18
  and 2026-04-16 −18) and one triple (2026-10-23 +2, 10-24 −1, 10-25 −1). The HTML calendar and
  the API put the day boundary in different places.
- 5 days are lower in the API by 1–3 (2025-10-28 −3; 2026-01-05, 2026-10-08, 2026-10-09 and
  2026-10-12 −1 each), not explained here.
- Excluding the partial day, the API is 7 lower than the snapshot over 366 days.

**Compared with #266:** #266 reported 16,675 / 15,598 / 1,077 for the same window about an hour
earlier. The window included the day still in progress, so the numbers grew while it was measured.
Any option must stop at the last **complete** day (A1).

### 2.2 Full days only: the window both options would use

`from: "2025-10-26T00:00:00-04:00"`, `to: "2026-10-26T23:59:59-04:00"` (366 Toronto days):

| Field                               | Value                                                            |
| ----------------------------------- | ---------------------------------------------------------------- |
| Calendar total                      | **16,462**                                                       |
| Restricted (private, anonymous)     | **15,552** (94.5%)                                               |
| Public, by type                     | 699 commits, 163 PRs, 23 reviews, 15 issues, 10 new repositories |
| Public total                        | **910** (5.5%)                                                   |
| Public per-day series (section 5.2) | Sums to 910, matching the per-type totals exactly                |

### 2.3 Day boundaries and time zones

- Commit contributions come as one node per repository per day, and that node's `occurredAt` is
  `07:00:00Z` (March to October) or `08:00:00Z` (January to March) in every case fetched: **midnight
  US Pacific**. Commit counts per day are therefore GitHub's Pacific days, and the API offers no finer
  grain. Pull requests, reviews, issues and repository creations carry their real timestamps and can
  be bucketed in America/Toronto.
- The calendar's own day zone is not documented, and the HTML calendar disagrees with the API by a
  day on 21 days (2.1). Neither was resolved here.
- `contributionsCollection` accepted a 367-day span. Week-sized windows returned the same nodes
  twice at their edges (11 duplicates over the year), so the per-day fetch de-duplicates by
  repository and `occurredAt` (commits) or by URL and `occurredAt` (the rest) and drops nodes outside
  the range.

## 3. Option A: public contributions only

- **Methodology:** GitHub GraphQL, signed in as the owner, `contributionsCollection` over the full-day
  window in week-sized slices (section 5.2). Count `commitCount` of each public commit node plus one
  per public pull request, review, issue and repository creation. Keep only `isPrivate: false`
  (today that is all attributable contributions). Do **not** use `contributionCalendar`: its days
  include the restricted count.
- **Coverage and zone:** 2025-10-26 to 2026-10-26 inclusive (366 days), the last complete day before
  the refresh. PRs, reviews, issues and repositories by America/Toronto day; commits by GitHub's
  Pacific day (2.3).
- **Levels:** GitHub's levels describe the full calendar, so compute public levels from the public
  counts: quartiles of non-zero days (today 2, 3 and 9), giving 0 for none and 1–4 above. Keep the
  legend as "Less" / "More", which makes no numeric claim.
- **Numbers today:** 910 public contributions; 82 active days of 366; longest streak 5 days; busiest
  day 185 on Sep 24, 2026.
- **Copy (exact):**
  - Heading: `Public contribution activity`
  - Lede: `Contributions to public GitHub repositories (commits, pull requests, reviews, issues and
new repositories) from {first} to {last}, counted from GitHub’s API and refreshed by hand.
Private work is not included.`
  - Stats: `Last year` · `{total}` · `public contributions`; `Active days` · `{active}` ·
    `of {days}`; `Longest streak` · `{streak}` · `days`; `Busiest day` · `{count}` · `{date}`
  - Readout: `[ Public snapshot · {taken} ]`
  - Calendar accessible name: `{total} public contributions on GitHub between {first} and {last}`
  - Table caption: `Public contributions per month, {first} to {last}`
- **Refresh steps:**
  1. After the last day to include has ended in Toronto, check `gh auth status` (owner's login; no
     token goes into the repository, CI or Vercel).
  2. Run the fetch (section 5.2) for `from` to the last complete day.
  3. Write `from`, `to`, `taken` (the run's Toronto date), `takenAt` (ISO timestamp), `source:
"github-graphql:contributionsCollection (public)"`, `total`, `counts`, `levels`.
  4. Check `total` equals the sum of `counts`, equals the sum of the per-type totals from one
     `contributionsCollection` call over the same window, and `counts.length` is the inclusive span.
  5. Commit; the next deploy publishes it.
- **Limitations:** commit days are Pacific, not Toronto; a contribution to a repository that later
  becomes private, or is deleted, drops out on the next refresh; GitHub counts commits only on the
  default branch or `gh-pages` and only with a linked email (GitHub's general rules, not re-measured
  here); the calendar becomes much sparser (82 active days instead of 301).
- **Mock:** `docs/audits/evidence/proposals/open-source-activity-option-a-1280.png`.

## 4. Option B: the existing total, labelled as including private contributions

- **Methodology:** the full calendar from `contributionsCollection.contributionCalendar` (its day
  counts and `contributionLevel`), plus `restrictedContributionsCount` and the public split of
  Option A, all from the **same** window and the same run, so the three numbers add up
  (restricted + public = total). Keep the HTML scrape only if the owner wants GitHub's profile
  picture exactly; it cannot provide the split, and its days differ from the API on 26 days.
- **Coverage and zone:** 2025-10-26 to 2026-10-26 inclusive; calendar days in GitHub's own zone
  (unverified, 2.3).
- **Numbers today:** 16,462 contributions, of which 15,552 private and 910 public; 299 active days of
  366; busiest day 576 on Oct 20, 2026.
- **Copy (exact):**
  - Heading: `GitHub activity, public and private`
  - Lede: `Every contribution GitHub counts on my profile from {first} to {last}, including
{restricted} in private repositories that GitHub shows only as anonymous counts. {public} were
to public repositories. A dated snapshot, refreshed by hand.`
  - Stats: `Last year` · `{total}` · `contributions, incl. private`; `Public` · `{public}` ·
    `to public repositories`; `Active days` · `{active}` · `of {days}`; `Busiest day` · `{count}` ·
    `{date}` (Longest streak moves out to keep four columns)
  - Readout: `[ Snapshot · {taken} · incl. private ]`
  - Calendar accessible name: `{total} contributions on GitHub, including private ones, between
{first} and {last}`
  - Table caption: `Contributions per month, public and private, {first} to {last}`
- **Refresh steps:** as Option A steps 1–5, plus `restricted` and the calendar's per-day counts and
  levels from the same call; check `restricted + public = total`.
- **Limitations:** 94.5% of the headline number cannot be attributed to any repository; on a page
  about open-source work it still invites the reading that it is open-source output, which the labels
  must prevent. The rule for this option: no heading, hero, ticker, meta description, `llms` export or
  JSON-LD on `/open-source` may cite the total without "incl. private".
- **Mock:** `docs/audits/evidence/proposals/open-source-activity-option-b-1280.png`.

## 5. Queries

### 5.1 Totals for one window

```graphql
query ($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      restrictedContributionsCount
      totalCommitContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
      totalRepositoryContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          nameWithOwner
          isPrivate
        }
        contributions {
          totalCount
        }
      }
      # same shape for pullRequest…, pullRequestReview…, issueContributionsByRepository
      repositoryContributions(first: 100) {
        totalCount
        nodes {
          repository {
            isPrivate
          }
        }
      }
    }
  }
}
```

`gh api graphql -F query=@totals.graphql -f login=alipajand -f from=… -f to=…`

### 5.2 Public per-day series

One call per seven-day slice of the window (each slice from 00:00 Toronto to one second before the
next slice), asserting `pageInfo.hasNextPage` is false on every connection:

```graphql
query ($from: DateTime!, $to: DateTime!) {
  user(login: "alipajand") {
    contributionsCollection(from: $from, to: $to) {
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          nameWithOwner
          isPrivate
        }
        contributions(first: 100) {
          pageInfo {
            hasNextPage
          }
          nodes {
            occurredAt
            commitCount
          }
        }
      }
      pullRequestContributions(first: 100) {
        pageInfo {
          hasNextPage
        }
        nodes {
          occurredAt
          pullRequest {
            url
            repository {
              isPrivate
            }
          }
        }
      }
      # same shape for pullRequestReviewContributions, issueContributions, repositoryContributions
    }
  }
}
```

Month-sized slices are too large: the slice from 2026-10-02 to 2026-10-27 needed a second page.

## 6. Comparison and recommendation

|                            | A. Public only                        | B. Total, labelled incl. private                 |
| -------------------------- | ------------------------------------- | ------------------------------------------------ |
| Headline                   | 910 public contributions              | 16,462 contributions, incl. private (910 public) |
| Matches the page's subject | Yes                                   | Only with the labels and the rule in section 4   |
| Calendar                   | Sparse (82 active days)               | Dense (299 active days), the rhythm of all work  |
| Source                     | One API, attributable per repository  | One API; 94.5% anonymous                         |
| Day zone                   | Toronto, except commits (Pacific)     | GitHub's calendar zone (unverified)              |
| Design review              | Needed (sparser calendar, new levels) | Needed (fifth figure, longer labels)             |

**Recommendation: Option A**, as the owner's direction recorded in A3 prefers public contributions
for open-source metrics. Option B is acceptable only with every label above. Either way: full days
only (A1), `source` and `takenAt` recorded (A2), and never the current unlabelled headline next to
open-source work.

### Decision

- [ ] **A.** Public contributions only.
- [ ] **B.** Existing total, labelled as including private contributions, with the public split.
- [ ] Neither for now (the page keeps the #253 copy).

Implementation, once chosen (not in this PR): `data/openSourceActivity.ts`,
`data/openSourcePage.ts:263,318-326,434-440`, `features/open-source/OpenSourceActivity.tsx`,
`utils/contributions.ts` (levels for A), the two specs above, the four `/open-source` baselines
(darwin and linux, 1440 and 390), a refresh script under `scripts/` (A2), and, for the design kit
copies (`docs/design/kit/activity.json`, `docs/design/pages/open-source.html`), the design track.

## 7. Not verified

- The time zone of GitHub's contribution calendar, and why five days are 1–3 lower in the API than in
  the scraped HTML.
- Which organisations the 15,552 restricted contributions belong to.
- Whether the mocks match the approved `/open-source` design artifact; they reuse the shipped
  components and only change text and cell levels.
