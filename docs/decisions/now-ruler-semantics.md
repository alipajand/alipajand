# /now ruler semantics

Status: **proposal, needs an owner decision (D6 in
[`now-freshness-and-activity.md`](./now-freshness-and-activity.md)).** This document changes no
behaviour. It checks what #267, #270 and #275 shipped, measures what the year ruler does across the
year rollover, the DST weeks and without JavaScript, and proposes a ruler that marks the date the
content is as of instead of the visitor's or the build's day.

Baseline: `main` at `97651be` (contains `e1025e5`). Measured on 2026-10-27 between 20:08 and 20:20
America/Toronto against `pnpm build` + `next start -p 3523` (build finished at
2026-10-28T00:08Z). Browsers: Playwright Chromium 156.0.8078.4 and Playwright WebKit 27.2 (a WebKit
build, not Safari), desktop viewport 1440 × 900, no device emulation. Clock control:
`page.clock.install` (the browser clock only; `/now` is static, so the server clock does not
matter).

## 1. The as-of date on `main`

| Carrier                | Code (file:line)                                                       | Built output                                                                            |
| ---------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Constant               | `data/now.ts:66` `NOW_UPDATED = "2026-05-08"`                          | –                                                                                       |
| Title year             | `data/now.ts:69` `NOW_YEAR`, `features/now/NowPageContent.tsx:24`      | h1 accessible name "Now 2026"                                                           |
| Visible line           | `features/now/NowIntro.tsx:18-20`, `data/now.ts:71`                    | `Updated <time dateTime="2026-05-08">May 8, 2026</time>`, read as "Updated May 8, 2026" |
| WebPage `dateModified` | `features/now/NowPageJsonLd.tsx:16`, rendered at `app/now/page.tsx:19` | `"dateModified":"2026-05-08"`                                                           |
| Sitemap `lastmod`      | `app/sitemap.ts:49-54`                                                 | `<loc>https://alipajand.com/now</loc><lastmod>2026-05-08</lastmod>`                     |
| `llms-full.txt`        | `utils/llms.ts:257-259`                                                | lines 656–658: `## Now`, blank, `Updated: 2026-05-08`                                   |

All six agree on the build. The agreement is pinned by `features/now/__tests__/nowUpdated.spec.tsx`
and `e2e/now-updated.e2e.ts` (both from #275).

**What the date means.** It is the date of the last commit that changed the section text, not a
review date. Every string in `NOW_LEDE`, `NOW_SECTIONS` and `NOW_META_DESCRIPTION` at `ef48e66`
(2026-05-08) is byte-identical on `main` (10 of 10 strings compared). #275's description asks the
owner to confirm the date and says a re-read could justify a later one. No later review is
recorded in the repository or in any merged PR, so nothing here claims one. If the owner re-reads
and confirms the sections, that confirmation date is the honest value for `NOW_UPDATED`.

## 2. What the ruler does today

- **Server (and no JavaScript):** `NowPageContent` takes `now = new Date()` at prerender
  (`features/now/NowPageContent.tsx:21`) and passes `year={now.getFullYear()}` and
  `initialWeek={weekOfYear(now)}` to the ruler (`:26`). These are **build** values, in the build
  machine's local zone. The server SVG (#267, `features/now/NowWeekRuler.tsx:37-74`) and the label
  (`:159-170`) use them.
- **Island:** `NowWeekRuler.tsx:91-92` recomputes the step from the **visitor's** clock when the
  visitor's year equals the build year, and otherwise keeps the build step.
- **Label:** "Week N of 52 · year progress" (`data/now.ts:90`, #270). Ticks before the cursor are
  drawn solid (`NowWeekRuler.tsx:52,109`).

Measured (Chromium; WebKit gave the same labels and steps to within 0.01 of a step):

| Visitor clock                                  | Zone                | Label             | Cursor step | Note                                                 |
| ---------------------------------------------- | ------------------- | ----------------- | ----------- | ---------------------------------------------------- |
| 2026-10-27 12:00                               | America/Toronto     | Week 43 of 52     | 43          | Build day                                            |
| 2026-10-28 00:00:30                            | America/Toronto     | Week 43 of 52     | 43          | Writing boundary night; no effect here               |
| 2026-10-31 23:30 EDT                           | America/Toronto     | Week 44 of 52     | 44          | Eve of the DST change                                |
| 2026-11-01 01:30 EDT, then 01:30 EST           | America/Toronto     | Week 44 of 52     | 44          | Both repeated hours give the same step               |
| 2026-11-01 23:30 EST                           | America/Toronto     | Week 44 of 52     | 44          | –                                                    |
| 2026-12-30 12:00                               | America/Toronto     | Week 52 of 52     | 52          | Label clamped inside the ruler (centre at step 48.6) |
| 2026-12-31 23:30 EST                           | America/Toronto     | Week 52 of 52     | 52          | –                                                    |
| 2027-01-01 00:30 EST                           | America/Toronto     | **Week 43 of 52** | **43**      | Jumps back to the build step                         |
| 2027-01-01 00:30 NZDT (2026-12-31T11:30Z)      | Pacific/Auckland    | Week 43 of 52     | 43          | Same jump, 18 h earlier                              |
| 2026-12-31 16:30 PST (2027-01-01T00:30Z)       | America/Los_Angeles | Week 52 of 52     | 52          | Still 2026 locally                                   |
| 2027-01-08 12:00                               | America/Toronto     | Week 43 of 52     | 43          | Frozen at the build step all of 2027                 |
| 2027-03-13 23:30 EST and 2027-03-14 03:30 EDT  | America/Toronto     | Week 43 of 52     | 43          | DST start in 2027: unchanged (frozen)                |
| 2026-03-08 03:30 EDT (a clock set in the past) | America/Toronto     | Week 10 of 52     | 10          | Left of the content's own date                       |
| JavaScript disabled, 1440 px                   | –                   | Week 43 of 52     | 43          | Server SVG visible, canvas blank                     |
| JavaScript disabled, 390 px                    | –                   | Week 43 of 52     | 43          | Label clamped (centre at step 35.2)                  |

No hydration errors in any run. With JavaScript on, the canvas drew and the server copy was hidden
(`data-drawn` set, static ruler `visibility: hidden`) in every case.

Findings:

| ID   | Finding                                                                                                                                                                                                                               | Severity |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| NR-1 | Through 2026 the cursor follows the visitor's today (43, 44 … 52) under content dated May 8. The ruler implies a freshness the content does not have.                                                                                 | P2       |
| NR-2 | At each visitor's local New Year the cursor jumps **back** from 52 to the build step and stays there all of 2027. Visitors in different zones see different positions at the same instant (Auckland 43, Los Angeles 52).              | P2       |
| NR-3 | The no-JS ruler and the 2027 fallback show the **build** step, so they change with every deploy without any content change. A deploy in 2027 would also switch the ruler (not the h1) to 2027 while the content stays dated May 2026. | P2       |
| NR-4 | A visitor clock earlier than `NOW_UPDATED` places the cursor before the content date (Week 10 for 2026-03-08). Only wrong clocks reach this.                                                                                          | P3       |
| –    | DST: no effect. `weekOfYear` counts local calendar days (`utils/week.ts:13-19`, #259), and both 01:30s on 2026-11-01 give step 44.                                                                                                    | –        |

## 3. Proposal

### 3.1 Semantics

- The ruler is the year `NOW_YEAR` (2026), as the h1 already is.
- The **primary marker** is `NOW_UPDATED`'s position: step 19 for 2026-05-08 (day 127 of the year,
  `floor(127 / 7) + 1`). It is computed from the date string, not from a `Date` in any zone, so the
  server, the island and every visitor get the same step. Ticks up to it are solid; ticks after it
  stay at the muted opacity.
- An **optional "Today" marker** shows the visitor's position, drawn so it cannot be read as the
  content date. It is added only by the island, and only when the visitor's local date is in
  `NOW_YEAR` **and** on or after `NOW_UPDATED`. In any other year, or with a clock before the
  content date, it is not drawn. The server never draws it, because the server's "today" is the build
  day.
- Nothing on the page depends on the build date or on the visitor's year, so NR-2 and NR-3 cannot
  happen, and the year boundary changes nothing (unless the Today marker was showing, in which case
  it simply disappears on 1 January).

### 3.2 Exact copy

| Element                 | Current                         | Proposed                                                                       |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| Primary ruler label     | `Week 43 of 52 · year progress` | `As of May 8, 2026` (`As of` + `formatShortDate(NOW_UPDATED)`)                 |
| Today label, ≥ 600 px   | –                               | `Today · Oct 27` (`Today · ` + month and day in the visitor's zone)            |
| Today label, < 600 px   | –                               | `Today`                                                                        |
| Intro line (`NowIntro`) | `Updated May 8, 2026`           | Unchanged (option b below if the owner wants the as-of wording in both places) |
| h1                      | `Now 2026` (from `NOW_YEAR`)    | Unchanged                                                                      |

Copy constants would sit next to the existing ones in `data/now.ts`: `NOW_RULER_AS_OF_PREFIX = "As
of"` and `NOW_RULER_TODAY_LABEL = "Today"`, replacing `nowWeekLabel` (`data/now.ts:84-90`). The
step number disappears from the copy; the position on the ruler shows it, and #270's "not an ISO
week" problem goes away with it.

The ruler stays `aria-hidden` (`NowWeekRuler.tsx:164`). The as-of date is already text in the intro
line, so assistive technology loses nothing, and the Today marker adds no information that needs a
text alternative.

### 3.3 Visual treatment within the existing artwork

Mocks: `docs/audits/evidence/proposals/now-ruler-current-1440.png`, `now-ruler-current-390.png`
(today's ruler, visitor clock 2026-10-27 12:00 Toronto) and `now-ruler-proposal-1440.png`,
`now-ruler-proposal-390.png` (the proposal drawn onto the shipped server ruler by editing the DOM;
tagged "PROPOSAL MOCK").

- **Primary marker:** exactly today's cursor and label: the 2px solid line from 44px to 8px below the
  baseline, the filled label box (`--color-line` background, `--color-ink` text, mono, uppercase)
  with the existing edge clamp (`NowWeekRuler.module.css:43-51,64-85`). Only its position and text
  change.
- **Today marker:** a 1px **dashed** hairline over the same vertical span at 60% opacity, with an
  **outlined** label: 1px solid `currentColor` border, transparent background, `--color-line` text
  at 75% opacity, same mono size and tracking as the primary label. Filled = content date, outline =
  today; the two never share a style.
- **Collision:** if the two label boxes would overlap, drop the Today label and keep its dashed
  line; the primary label always wins. At 1440 px the boxes are about five to six steps wide
  together, so this applies from May 8 to about mid-June; at 390 px it covers more of the year.
- **No JavaScript:** the server SVG and label show only the primary marker at step 19 (CSS
  `--week: 19`). There is no Today marker, and nothing to hide or swap later except the canvas
  hand-off #267 already does.
- **Reduced motion:** unchanged (the scroll drift is already skipped).

### 3.4 Changes an implementation would make (not in this PR)

- `utils/week.ts`: add `weekOfDate(isoDate: string)`, computed from the `YYYY-MM-DD` parts with
  `Date.UTC`, so it needs no zone.
- `features/now/NowPageContent.tsx:21,26`: stop passing the render clock to the ruler; pass
  `asOfWeek = weekOfDate(NOW_UPDATED)` and `year = NOW_YEAR`. The `now` prop then only serves tests,
  or goes away.
- `features/now/NowWeekRuler.tsx`: draw the cursor at `asOfWeek` on the server and the canvas; the
  island computes the Today step from the visitor's clock under the rule in 3.1 and draws the dashed
  line and outlined label.
- `features/now/NowWeekRuler.module.css`: `.today` and `.todayLabel` rules.
- `data/now.ts:84-90`: the copy constants above.
- `e2e/remaining-pages.e2e.ts:336` masks the label in the `/now` baselines because it depended on the
  clock. With a fixed primary label the mask can go (the Today marker would need its own mask or a
  pinned clock), so the four `/now` baselines (darwin and linux, 1440 and 390) need re-recording and
  review.

### 3.5 Test plan

Unit (Jest):

- `weekOfDate`: `2026-01-01` → 1, `2026-05-08` → 19, `2026-12-31` → 52, `2028-12-31` → 52 (leap
  year), invalid strings throw; run under `TZ=UTC`, `TZ=America/Los_Angeles`, `TZ=Pacific/Auckland`.
- `todayStep(now, asOf, year)`: `null` before `NOW_UPDATED`, `null` in another year, the step
  otherwise; the 2026-11-01 repeated hour gives 44 both times.
- Copy: the primary label equals `As of ${formatShortDate(NOW_UPDATED)}`.

Component (`features/now/__tests__/NowPageContent.spec.tsx`):

- Server markup has `--week: 19` and the label "As of May 8, 2026" whatever `now` is injected
  (2026-10-27, 2027-01-08, 2031-06-01).
- Server markup contains no Today marker.

E2E (Playwright Chromium and Playwright WebKit, `page.clock.install`, desktop 1440 and 390):

| Visitor clock                         | Zone                | Expected                                                        |
| ------------------------------------- | ------------------- | --------------------------------------------------------------- |
| 2026-10-27 12:00                      | America/Toronto     | Primary at 19 "As of May 8, 2026"; Today at 43 "Today · Oct 27" |
| 2026-11-01 01:30 EDT and 01:30 EST    | America/Toronto     | Primary at 19; Today at 44 both times                           |
| 2026-12-31 23:30                      | America/Toronto     | Primary at 19; Today at 52                                      |
| 2027-01-01 00:30                      | Toronto, Auckland   | Primary at 19; no Today marker; h1 "Now 2026"                   |
| 2026-12-31 16:30 PST (2027 in UTC)    | America/Los_Angeles | Primary at 19; Today at 52                                      |
| 2027-03-14 03:30 EDT                  | America/Toronto     | Primary at 19; no Today marker                                  |
| 2026-03-08 (before `NOW_UPDATED`)     | America/Toronto     | Primary at 19; no Today marker                                  |
| 2026-05-15 (Today within label range) | America/Toronto     | Primary label visible; Today line drawn, Today label omitted    |
| JavaScript disabled                   | –                   | Server SVG cursor at 19, label "As of May 8, 2026", no Today    |

Each case also asserts no hydration error in the console, the label stays inside the ruler (the
existing #270 check), and the canvas hand-off leaves one ruler visible (the existing #267 check).
Visual: re-record the `/now` baselines without the label mask and review the diff.

## 4. Decisions

- **R1. Primary marker**
  - [ ] **a.** Mark `NOW_UPDATED` (step 19 for 2026-05-08) with "As of May 8, 2026". _Recommended._
  - [ ] **b.** Keep today's behaviour (visitor clock in the build year, build step otherwise).
- **R2. Today marker**
  - [ ] **a.** Add it as in 3.1 and 3.3 (dashed, outlined, island only, same year and after the
        content date only). _Recommended if the owner wants the ruler to keep a sense of "now"._
  - [ ] **b.** No Today marker; the ruler shows only the as-of date.
- **R3. Intro wording**
  - [ ] **a.** Keep "Updated May 8, 2026". _Recommended: the ruler label carries "As of"._
  - [ ] **b.** "Content as of May 8, 2026" in the intro as well.
- **R4. `NOW_UPDATED` value**
  - [ ] **a.** Keep 2026-05-08, the last content edit in git.
  - [ ] **b.** Re-read the sections and set the confirmation date (only if a review actually
        happens).

## 5. Not verified

- The build machine's time zone on Vercel. It only matters until R1 lands (NR-3).
- Real Safari, real iOS or Android devices. Only Playwright Chromium and Playwright WebKit on macOS.
- Theme variants of the mocks: only the default rendering was captured.
