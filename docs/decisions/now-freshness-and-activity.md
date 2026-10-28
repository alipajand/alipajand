# /now freshness and the contribution snapshot

Status: **proposal.** This document changes no behaviour. It follows up #253 (contribution snapshot
wording and table) and #259 (week ruler DST fix, ticker pause). The owner has set a direction for
most items; it is written in below as the recommendation. Items that change a displayed metric (A3)
still need the owner's explicit approval before anything is built.

Baseline: `main` at `de7fac2`. Verified on 2026-10-27 between 18:45 and 19:30 America/Toronto with
`pnpm build && pnpm start -p 3505`, Playwright Chromium (desktop viewport, not emulated mobile) with
`page.clock`, and `gh api graphql` signed in as `alipajand`.

Implementation of D3/D4, D5 and D7 belongs to a separate track (T7), as draft PRs touching
`features/now/**`, `app/now/**` and `data/now*`. This document records the evidence and the
decisions; it does not propose code for those files. **T7 PRs: none were open when this was written;
link them here when they are.**

Follow-ups: D3/D4 shipped in #275, D5 in #270 and D7 in #267. D6 (ruler semantics) is proposed in
[`now-ruler-semantics.md`](./now-ruler-semantics.md), and A3 (public versus private counts) in
[`contribution-metrics-options.md`](./contribution-metrics-options.md).

## Kept from #253 and #259

These are verified, merged and not reopened here:

- Every contribution label says "contributions", never "commits" (#253; spec in
  `features/open-source/__tests__/OpenSourcePageContent.spec.tsx`).
- The screen-reader monthly table sits in a visually hidden wrapper (`OpenSourceActivity.tsx:83-102`)
  with a dated caption ("Contributions per month, Oct 26, 2025 to Oct 27, 2026").
- `weekOfYear` counts local calendar days, so DST cannot shift a week boundary (`utils/week.ts:13-19`,
  `utils/__tests__/week.spec.ts`).
- The stack ticker keeps its offset when automatic motion is paused or resumed
  (`features/now/NowStackTicker.tsx`, `features/now/__tests__/NowStackTicker.spec.tsx`).

## Findings and decisions

### D3. As-of date for /now

**Current.**

- No date anywhere on the page. `NOW_LEDE` says "Snapshot of active work and interests, updated when
  priorities shift." (`data/now.ts:6`).
- The section content (`data/now.ts:15-55`) was written on **2026-05-08** (`ef48e66`, which created
  the file). Since then it has only been reformatted (`a66f466`, 2026-06-03, a line join in
  `NOW_LEDE`) and extended with display labels (`c0f783a`, 2026-10-27, lines 57-70). No item text
  has changed in git since 2026-05-08.
- The page nevertheless reads as current: the h1 is "Now 2026" and the ruler says
  "Now · wk 43 / 52" (measured on the built page).
- No `dateModified`: `/now` emits only `BreadcrumbJsonLd` (`app/now/page.tsx:17`), and
  `buildNowMetadata` (`utils/metadata.ts:178-203`) is `openGraph.type: "website"`, which has no
  modified time.
- Sitemap `lastmod` for `/now` is `new Date()` at build (`app/sitemap.ts:48-53`), measured as
  `2026-10-27T22:46:51.826Z`, the moment of this build. It changes on every deploy.
- `llms-full.txt` exports the same sections with no date (`utils/llms.ts:197-199`).

**Options.**

| Option                                                                                                                                                             | Cost                                                                          | Honesty                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| a. Hand-maintained `NOW_UPDATED` (`YYYY-MM-DD`) in `data/now.ts`, a visible "Updated <date>" line, and the same value for `dateModified` and the sitemap `lastmod` | One constant, one line of UI, one sitemap line, a test                        | Exact, as long as the owner bumps it when editing                                                      |
| b. Use the last git commit date of `data/now.ts` at build                                                                                                          | Build-time git call; Vercel's shallow clone may not have history (unverified) | Wrong: a reformat or label change moves the date without a content change (`a66f466`, `c0f783a` above) |
| c. Build date                                                                                                                                                      | Free                                                                          | Wrong: claims freshness on every deploy                                                                |

**Recommendation (owner direction): a.** One `NOW_UPDATED` date drives the visible line, the
structured-data `dateModified` and the sitemap `lastmod`. The page never says or implies that it
refreshes itself.

- The value is the owner's to set. Git supports **2026-05-08** as the last content edit. If the owner
  re-reads the sections now and confirms them, the confirmation date is equally honest; otherwise use
  2026-05-08.
- `dateModified` needs a carrier. Options: a `WebPage` JSON-LD block on `/now` with `dateModified`,
  or none (the visible line and the sitemap are enough). Recommend the `WebPage` block, because
  answer engines read it.
- A test in T7's PR should assert that the visible line, the JSON-LD and the sitemap all print
  `NOW_UPDATED`, and that `NOW_UPDATED` is not after the build date.
- Outside T7's files: `app/sitemap.ts` (`/now` entry) and `utils/llms.ts:197-199` (add
  "Updated: <date>" to the Now section of `llms-full.txt`). The sitemap is also changed by the
  writing publication plan (`writing-publication-implementation.md` section 4.4), so one PR should own
  it.

### D4. Static-page freshness

**Current.** `/now` is `○ (Static)`, `initialRevalidateSeconds: false` in
`.next/prerender-manifest.json`, served with `Cache-Control: s-maxage=31536000`,
`x-nextjs-prerender: 1`, `x-nextjs-cache: HIT` (measured). `NowPageContent` reads `new Date()` once at
prerender (`features/now/NowPageContent.tsx:21-26`) for the h1 year (`NowDisplay`, `:24`) and the
server-rendered week (`:26`). Both are therefore **build-time** values, computed in the build
machine's own time zone (`getFullYear`, `getDate` are local). On Vercel the build zone is presumably
UTC (**unverified**), so a build between 19:00/20:00 Toronto on 31 December would already render the
next year.

**Options.**

| Option                                                                              | Cost                                                                        | Effect                                                                                                                         |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| a. Derive the h1 year from `NOW_UPDATED`, not the clock; keep the page fully static | None at runtime                                                             | The year changes when the content does. A year-long CDN cache is then correct, because only a deploy can change the content    |
| b. `export const revalidate = 86400` on `/now`                                      | ≤ 1 regeneration a day when requested; one stale response after each expiry | The year rolls over within a day, but the content under it is still as old as it was; it hides staleness instead of stating it |
| c. Make `/now` dynamic                                                              | A function call per visit                                                   | Same as b, more cost                                                                                                           |

**Recommendation (owner direction): a**, together with D3. No automatic refresh.

### D6. Year rollover on 2027-01-01 (simulated)

Simulated against the 2026-10-27 build with Playwright `page.clock.install` (the server page is
static, so only the client clock moves):

| Zone             | Client time      | h1 (accessible name) | Ruler label      |
| ---------------- | ---------------- | -------------------- | ---------------- |
| America/Toronto  | 2026-12-30 12:00 | Now 2026             | NOW · WK 52 / 52 |
| America/Toronto  | 2026-12-31 23:30 | Now 2026             | NOW · WK 52 / 52 |
| America/Toronto  | 2027-01-01 00:30 | Now 2026             | NOW · WK 43 / 52 |
| Pacific/Auckland | 2027-01-01 00:30 | Now 2026             | NOW · WK 43 / 52 |
| America/Toronto  | 2027-01-08 12:00 | Now 2026             | NOW · WK 43 / 52 |

No hydration warnings. Each run logged two resource 404s; #259 traced the same pair to local
`/_vercel/*` scripts (not re-checked by URL here).

Why: the island recomputes the week only when the visitor's year equals the rendered year
(`features/now/NowWeekRuler.tsx:33-34`); otherwise it keeps the build week. So in 2027 the page says
"Now 2026 · wk 43" indefinitely. It is internally consistent but stale, and the ruler jumps **back**
from week 52 to week 43 at midnight on 1 January.

There is a second, quieter problem in 2026 itself: until 31 December the client moves the cursor to
**today's** week while the content is from May. The ruler then implies a freshness the content does
not have.

**Recommendation (owner decision; implementation in T7's D3/D4/D5 work):** with `NOW_UPDATED` in
place, the h1 shows that date's year and the ruler marks that date's position in its year. Today's
position may be shown in addition only if it is labelled as today, distinct from the as-of mark.
Nothing on the page jumps at a year boundary, because nothing depends on the visitor's year.

### D5. Ruler semantics (52 steps, not ISO weeks)

**Current.** `weekOfYear` (`utils/week.ts:13-19`) counts 7-day blocks from 1 January and folds day
365 (and 366) into step 52. The label reads "Now · wk 43 / 52" (`data/now.ts:68-70`). Checked with a
small Node script:

| Date       | Ruler                     | ISO week |
| ---------- | ------------------------- | -------- |
| 2026-01-01 | 1                         | 2026-W01 |
| 2026-10-27 | 43                        | 2026-W44 |
| 2026-12-28 | 52                        | 2026-W53 |
| 2026-12-31 | 52                        | 2026-W53 |
| 2027-01-01 | 1 (if it were recomputed) | 2026-W53 |
| 2027-12-31 | 52                        | 2027-W52 |

ISO 2026 has 53 weeks; 2027 and 2028 have 52. The ruler never breaks (its last step is 8–9 days
long), but "wk 43" next to a calendar that says W44 reads as an error.

**Options.**

| Option                                                                                                            | Cost                                   | Note                                                              |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------- |
| a. Keep 52 steps; relabel as year progress, not a week number (for example "Now · 43 / 52" or "Oct 27 · day 300") | Label copy and a test                  | Graphic unchanged                                                 |
| b. Keep 52 steps; show the ISO week number in the label and clamp only the cursor position (W53 sits on step 52)  | Label logic, ISO week helper and tests | Correct for calendar users; 53 in a 52-step graphic needs a clamp |
| c. Replace the graphic with a 53-slot or day-based ruler                                                          | Design change                          | Out of scope: the approved Hairline graphic stays                 |

**Recommendation (owner direction): a.** Keep the 52-step year-progress ruler and stop presenting
its value as a week number. Exact copy is the design lead's call in T7's PR.

### D7. Ruler without JavaScript

**Current.** The ruler is a `<canvas>` drawn only by the island (`NowWeekRuler.tsx:26-96`); the
server renders an empty canvas plus the label positioned in CSS (`NowWeekRuler.module.css:11-23`).
With JavaScript disabled, Playwright Chromium at 1280 px shows a 1246 × 133 px blank band with only
"NOW · WK 43 / 52" in it (screenshot taken, not committed). The block is `aria-hidden`
(`NowWeekRuler.tsx:101`), so this is a visual gap, not an accessibility failure.

**Options.**

| Option                                                                                                                                | Cost                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| a. Server-render the 53 tick lines and Q labels as inline SVG (or CSS gradients) under the canvas; the canvas covers it once it draws | ~60 small SVG elements; a no-JS e2e check; the visual baseline for `/now` (the ruler is masked in today's baselines) |
| b. `<noscript>` image                                                                                                                 | An asset to keep in sync with the design                                                                             |
| c. Leave blank                                                                                                                        | None; an empty band on no-JS and on script failure                                                                   |

**Recommendation (owner direction): a**, a server-rendered SVG/CSS fallback. T7 implements it.

### A1. As-of date for the contribution snapshot (`/open-source`)

**Current.** `taken: "2026-10-27"` and `from: "2025-10-26"` (`data/openSourceActivity.ts:20-24`).
The refresh script sets `taken` to the **UTC** date at the moment it runs
(`docs/design/kit/build.mjs:210`), and the scrape includes the current day while it is still in
progress: #253 found 42 contributions for 2026-10-27 in the snapshot and 121 later that day. The page
shows "[ Snapshot · Oct 27, 2026 ]" (`OpenSourceActivity.tsx:60-62`) and a summary "… between
Oct 26, 2025 and Oct 27, 2026", so the last, partial day is presented as a full one. `/open-source` is
static with `s-maxage=31536000` (measured), which is correct for a committed snapshot.

**Options.**

| Option                                                                                                                                                   | Cost                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| a. Refresh only after the last day has ended; drop the partial day; set `taken` to the day after the last counted day; record a full `takenAt` timestamp | A change to the refresh step; no UI change         |
| b. Keep the partial day and label it ("Oct 27, partial")                                                                                                 | Copy change; the stats still include a partial day |

**Recommendation (owner decision): a.** It is a data-hygiene change in the refresh procedure, not a
displayed-metric change, but it lands together with A3 because both change how the snapshot is
produced.

### A2. Snapshot provenance

**Current.** `node --no-warnings docs/design/kit/build.mjs --activity` fetches the **signed-out HTML
calendar** at `https://github.com/users/alipajand/contributions` (`build.mjs:199-219`). It matches
`<tool-tip>` text and `data-date … data-level` attributes with regular expressions (`:204-207`),
takes `total` from the heading "N contributions in the last year" (`:209`), writes
`docs/design/kit/activity.json`, and the result is copied by hand into
`data/openSourceActivity.ts` (comment at `:1-7`). Risks:

- It depends on GitHub's undocumented markup; a markup change fails loudly only if fewer than 300 days
  parse (`:208`), otherwise it can silently mis-read.
- The committed data does not say where or when it came from, beyond `taken`.
- GitHub's day boundary for the HTML calendar differs from the API's (#253: 26 days differ by 1–18,
  cancelling across neighbouring days). The zone GitHub uses for a signed-out viewer is
  **unverified**.
- The script lives in the design kit (`docs/design/**`, another track's files). This proposal does not
  change it.

**Recommendation (owner decision):** whichever variant A3 picks, add `source` (URL or GraphQL query
name) and `takenAt` (ISO timestamp) to `ContributionSnapshot`, and move the refresh script out of the
design kit into `scripts/` so the site's data does not depend on design tooling.

### A3. Public versus private counts (**changes a displayed metric; needs owner approval**)

**Re-verified 2026-10-27 ~19:00 Toronto** with `gh api graphql` (token scopes include `repo` and
`read:org`), `contributionsCollection(from: "2025-10-26T00:00:00Z", to: "2026-10-27T23:59:59Z")`:

| Field                                               | Value                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| `contributionCalendar.totalContributions`           | 16,675                                                              |
| `restrictedContributionsCount`                      | 15,598 (93.5%)                                                      |
| Commits / PRs / reviews / issues / new repositories | 823 / 205 / 24 / 15 / 10                                            |
| Attributable total                                  | 1,077 (6.5%)                                                        |
| Attributable contributions in private repositories  | 0 (every `…ContributionsByRepository` entry has `isPrivate: false`) |

So **1,077 public contributions** against a calendar of 16,675 in the same window. The snapshot on
the page (16,511) was scraped earlier the same day from HTML, so its total is not directly comparable
with either API figure; any variant must take all its numbers from one fetch. #253 reported 16,582 /
15,598 (about 94%) earlier on the same day; the restricted count is unchanged.

The current copy is truthful (#253 fixed it): "A dated snapshot of the GitHub contribution calendar
on github.com/alipajand, refreshed by hand. GitHub counts private contributions there too, so it
shows when I was active, not how much open-source work shipped." (`data/openSourcePage.ts:318-319`).
The problem is placement: on a page about open-source work, the headline stat "Last year · 16,511
contributions" (`:320-326`) is about 94% private work.

**Owner direction:** prefer public GitHub contributions for open-source metrics. If a calendar that
includes private contributions stays, label it unambiguously and keep it apart from public counts.
Both variants are specified so the owner can approve one. Nothing is implemented.

#### Variant P (recommended): public contributions only

- **Data source.** GitHub GraphQL `user(login: "alipajand").contributionsCollection(from, to)`:
  `commitContributionsByRepository { repository { isPrivate } contributions(first: 100) { nodes {
occurredAt commitCount } } }`, and the same for `pullRequestContributionsByRepository`,
  `pullRequestReviewContributionsByRepository`, `issueContributionsByRepository`, plus
  `repositoryContributions`. Keep only `isPrivate: false`, bucket by day in America/Toronto, page
  through `pageInfo` (a repository can have more than 100 nodes). `contributionCalendar` is **not**
  usable here because its day counts include restricted contributions.
- **Levels.** GitHub's `data-level` is relative to the full calendar. For public-only data compute
  levels from the public counts (for example quartiles of non-zero days) and keep the legend as
  "Less" / "More", which makes no numeric claim.
- **Copy (exact):**
  - Heading: `Public contribution activity`
  - Lede: `Contributions to public GitHub repositories (commits, pull requests, reviews, issues and
new repositories) from {first} to {last}. Counted from GitHub's API on {taken} and refreshed by
hand. Private work is not included.`
  - Stat: label `Last year`, unit `public contributions`
  - Resting readout: `[ Public snapshot · {taken} ]`
  - Summary: `{n} public contributions on GitHub between {first} and {last}`
  - Table caption: `Public contributions per month, {first} to {last}`
- **Refresh steps.**
  1. After the last day to include has ended in Toronto, run the refresh script locally with the
     owner's own `gh` login (`gh auth status`). No token goes into the repository, CI or Vercel.
  2. The script writes `from`, `to` (last full day), `taken` (`to` + 1 day), `takenAt`, `source:
"github-graphql:contributionsCollection"`, `total`, `counts`, `levels`.
  3. Check that `total` equals the sum of `counts` (the existing #253 spec does this) and that
     `counts.length` is the inclusive day span.
  4. Commit `data/openSourceActivity.ts`; the next deploy publishes it.
- **Design impact.** About 1,077 contributions across 367 days makes a much sparser calendar. Compare
  against the approved `/open-source` artifact in `docs/design/` and re-record the two
  `/open-source` baselines with a diff review.

#### Variant L: keep the calendar with private contributions, clearly labelled

- **Data source.** As today (the signed-out HTML calendar, or `contributionCalendar` from GraphQL,
  which matches it up to the day-boundary difference). In the **same** refresh, fetch the public
  split above, so both numbers share a window and a timestamp.
- **Copy (exact):**
  - Heading: `GitHub activity, public and private`
  - Lede: `Every contribution GitHub counts on my profile from {first} to {last}, including
{restricted} in private repositories that GitHub shows only as anonymous counts. {public} were
to public repositories. A dated snapshot, refreshed by hand on {taken}.`
  - Stats: `Last year` · `{total}` · unit `contributions, incl. private`; a separate stat
    `Public` · `{public}` · unit `to public repositories`
  - Resting readout: `[ Snapshot · {taken} · incl. private ]`
  - Summary: `{n} contributions on GitHub, including private ones, between {first} and {last}`
  - Table caption: `Contributions per month, public and private, {first} to {last}`
- **Refresh steps.** As today (`build.mjs --activity`, copy into `data/openSourceActivity.ts`), plus
  the GraphQL public split from the same run, plus the A1 and A2 changes (full last day, `takenAt`,
  `source`).

**Recommendation:** Variant P, subject to owner approval and a design review of the sparser
calendar. If the owner prefers to keep the activity rhythm the full calendar shows, Variant L with
its labels; never the current unlabelled headline number next to open-source work.

Do **not** replace the dated, hand-refreshed snapshot with a live call to GitHub. A live figure would
need a token on the server, could fail at request time, and would read as "current" without a date.

## Decisions

| ID  | Item              | Recommendation                                                                             | Status                                      | Implemented by                                                 |
| --- | ----------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------- |
| D3  | /now as-of date   | `NOW_UPDATED`, visible "Updated" line, same value for `dateModified` and sitemap `lastmod` | Owner direction given                       | T7 (plus `app/sitemap.ts`, `utils/llms.ts` outside T7's files) |
| D4  | Static freshness  | Year from `NOW_UPDATED`; stay static; no automatic refresh                                 | Owner direction given                       | T7                                                             |
| D5  | Ruler semantics   | 52-step year progress, not labelled as a week number                                       | Owner direction given                       | T7                                                             |
| D6  | Year rollover     | Follows from D3/D4/D5: nothing on the page depends on the visitor's year                   | Owner decision                              | T7                                                             |
| D7  | No-JS ruler       | Server-rendered SVG/CSS ticks under the canvas                                             | Owner direction given                       | T7                                                             |
| A1  | Snapshot as-of    | Full days only; `taken` = day after last counted day; `takenAt`                            | Owner decision                              | Not assigned                                                   |
| A2  | Provenance        | `source` + `takenAt`; refresh script under `scripts/`                                      | Owner decision                              | Not assigned                                                   |
| A3  | Public vs private | Variant P (public-only), else Variant L with labels                                        | **Needs owner approval** (displayed metric) | Not assigned                                                   |

## Not verified

- The build machine's time zone on Vercel (affects the server-rendered year and week until D4 lands).
- Whether Vercel's build has enough git history for option D3-b (not recommended anyway).
- The time zone GitHub uses for a signed-out viewer's contribution calendar.
- The exact per-day public series for Variant P (only totals were fetched).
- Real devices or real Safari: none used. All browser checks were Playwright Chromium.
