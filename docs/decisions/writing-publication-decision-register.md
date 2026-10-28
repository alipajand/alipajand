# Writing publication: decision register

Status: **open, every item needs an owner decision.** This document changes no behaviour. It turns
the open questions in [`writing-publication-policy.md`](./writing-publication-policy.md) (#249) and
[`writing-publication-implementation.md`](./writing-publication-implementation.md) (#266) into one
register (D1–D6, P1–P6) with a box to tick for each, and it re-checks every surface on current
`main`. Where #249 or #266 is now stale, section 3 says so and this register wins.

Baseline: `main` at `97651be` (contains `e1025e5`). Measured on 2026-10-27 between 20:08 and 20:20
America/Toronto (2026-10-28 00:08–00:20 UTC):

- `pnpm build` (Next.js 16.4.3, Turbopack), then `next start -p 3523`, probed with `fetch`.
- The boundary was measured on the same build by starting `next start` with a `--require` preload
  that shifts the server clock (`Date` and `Date.now`) to `2026-10-28T03:59:20Z` and then to
  `2026-10-28T04:00:10Z`. Nothing was rebuilt in between. The preload lives in the scratch area,
  not in the repository.
- Vercel documentation was re-read on the same day (pages cited inline). No Vercel project, plan or
  setting was read or changed.

## 0. Recommended content policy

| State          | Who can read it                                                          | Where it appears                                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft          | Nobody through the site                                                  | Nowhere: no route, no list, no export, no link                                                                                                                                                       |
| Scheduled      | Nobody until 00:00 America/Toronto on its `date` (the calendar day)      | Nowhere until that instant, then everywhere a published post appears                                                                                                                                 |
| Published      | Everyone                                                                 | Article, OG image, home, `/writing` and its JSON-LD, "More writing", in-body and page links, sitemap, RSS, `llms.txt`, `llms-full.txt`                                                               |
| Public preview | Anyone with the URL, **only** when the post opts in with `preview: true` | The article and its OG image only, with `noindex`; no `Article` JSON-LD; excluded from the sitemap, RSS, `llms.txt`, `llms-full.txt`, home, "More writing" and lists (D2 decides the `/writing` row) |

The repository is public, so "nobody" means "the site never serves it". Anything committed to
`content/posts/` is readable on GitHub whatever the site does (P1).

## 1. Current behaviour on `main`, re-checked

Route table from the build: `ƒ /`, `ƒ /writing`, `○ /feed.xml`, `○ /sitemap.xml`, `○ /llms.txt`,
`○ /llms-full.txt`, `○ /now`, `○ /open-source`, `● /writing/[slug]` (16 paths),
`● /writing/[slug]/opengraph-image` (16 paths). In `.next/prerender-manifest.json` every listed static
route has `initialRevalidateSeconds: false`, and `/writing/[slug]` and its OG route have
`fallback: null` (`dynamicParams` is the default `true`; it is set nowhere). There is no
`vercel.json`, no `revalidate` export, no `revalidatePath`/`revalidateTag`, and no `cacheComponents`.

The only rule for "published" is `isPostPublished(date, now)` (`utils/date.ts:24-38`): a
`YYYY-MM-DD` date is published once the America/Toronto calendar day is on or after it. Only the
home page and `/writing` call it.

Example post: `content/posts/preparing-integrations-for-anthropic-and-cursor-directories.md`,
`date: "2026-10-28"`. Measured at 20:09 Toronto on 2026-10-27 (real clock):

| Surface                                 | Code (file:line)                                                                                                        | Status, `Cache-Control`, `x-nextjs-cache`                                        | Future post                                                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Home                                    | `app/page.tsx:8,15`, `utils/posts.ts:167-188`                                                                           | 200, `private, no-cache, no-store, max-age=0, must-revalidate`, none             | Absent (0 matches)                                                                                                        |
| `/writing` list                         | `app/writing/page.tsx:14,19-25`, `features/writing/WritingPostFilters.tsx:66-85`                                        | 200, same as home                                                                | Listed: "Upcoming" ×2, "Preview article" ×1                                                                               |
| `/writing` CollectionPage JSON-LD       | `app/writing/page.tsx:30-48` (filter at `:36`)                                                                          | –                                                                                | Left out (15 `Article` items)                                                                                             |
| Article route                           | `app/writing/[slug]/page.tsx:19-22` (`generateStaticParams` = `getAllPosts`), `:31-34`                                  | 200, `s-maxage=31536000`, `HIT`                                                  | Served in full                                                                                                            |
| Article metadata                        | `utils/metadata.ts:54-95` (`publishedTime`/`modifiedTime` at `:82-83`); `app/layout.tsx:65-75`                          | –                                                                                | `<meta name="robots" content="index, follow"/>`, canonical set, `article:published_time` = `modified_time` = `2026-10-28` |
| Article JSON-LD                         | `components/ArticleJsonLd/ArticleJsonLd.tsx:17-18`, rendered at `app/writing/[slug]/page.tsx:52`                        | –                                                                                | `"datePublished":"2026-10-28"`, `"dateModified":"2026-10-28"`                                                             |
| OG image                                | `app/writing/[slug]/opengraph-image.tsx:9-12,24-31`                                                                     | 200, `public, max-age=0, must-revalidate`, `HIT`                                 | Built (`image/png`, 66,123 bytes)                                                                                         |
| "More writing"                          | `app/writing/[slug]/page.tsx:59-66` (`getAllPosts`), `features/writing/WritingPostMore.tsx:28-42`                       | –                                                                                | Linked (1 anchor on `/writing/design-systems-that-stick`, and on every other standard article)                            |
| In-body link                            | `content/posts/agent-readiness-doctor.md:102`                                                                           | –                                                                                | Linked (1 anchor on `/writing/agent-readiness-doctor`)                                                                    |
| **Page link (missed by #249 and #266)** | `data/openSourcePage.ts:60-63`, used by "Agent Readiness MCP" (`:102`) and "Agent Readiness skill and plugins" (`:124`) | `/open-source`: 200, `s-maxage=31536000`, `HIT`                                  | Linked (2 anchors under "Related writing")                                                                                |
| `/feed.xml`                             | `app/feed.xml/route.ts:4,7`, `utils/feed.ts:15-18,43`                                                                   | 200, `s-maxage=31536000`, `HIT`                                                  | Item present (16 items); `<pubDate>` and `<lastBuildDate>` both `Wed, 28 Oct 2026 00:00:00 GMT`                           |
| `/sitemap.xml`                          | `app/sitemap.ts:9-15`                                                                                                   | 200, `public, max-age=0, must-revalidate`, `HIT`                                 | Listed, `<lastmod>2026-10-28</lastmod>`                                                                                   |
| `/llms.txt`                             | `app/llms.txt/route.ts:5,9`, `utils/llms.ts:61-63`                                                                      | 200, `s-maxage=31536000`, `HIT`                                                  | Listed (1 match)                                                                                                          |
| `/llms-full.txt`                        | `app/llms-full.txt/route.ts:5,11`, `utils/llms.ts:202-217`                                                              | 200, `s-maxage=31536000`, `HIT`                                                  | Full Markdown body; title at line 685, `Published: 2026-10-28` in the lines after it                                      |
| `/robots.txt`                           | `app/robots.ts:24-41`                                                                                                   | 200                                                                              | Disallows only `/api/`; no writing rule                                                                                   |
| Unknown slug (V233-5)                   | –                                                                                                                       | `/writing/zz-proposals-probe-1`: **404, `s-maxage=31536000`**, `MISS` then `HIT` | Four files written under `.next/server/route-cache/APP_PAGE/…/writing/zz-proposals-probe-1.*`                             |
| Unknown slug OG image                   | `app/writing/[slug]/opengraph-image.tsx:25-31`                                                                          | **200** generic "Writing" card, `MISS`; cached under `route-cache/APP_ROUTE/…`   | –                                                                                                                         |

Two extra observations:

- **Cached 404s survive a restart.** `/writing/zz-proposals-probe-2` was first requested on a
  server that was then stopped; on the next `next start` of the same build its first request was
  already `x-nextjs-cache: HIT`. Locally the cache is on disk, so invented slugs accumulate until the
  next build. On Vercel each deployment has its own ISR cache (Vercel ISR docs, "each new
  deployment uses its own ISR cache"), so the growth is per deployment (not measured on Vercel).
- **The e2e server clock is pinned.** `playwright.config.ts:30` sets `SERVER_NOW =
"2026-10-27T16:00:00.000Z"` and `e2e/fixed-clock.cjs` shifts the e2e server to it, so e2e runs and
  the home and `/writing` baselines keep showing the post as "Upcoming" after tonight. That is
  intended (the comment at `playwright.config.ts:24-29` says moving it is a content change), but it
  means e2e cannot show the live boundary; only Jest with an injected `now` can.

## 2. What the 2026-10-28 post does at the boundary tonight

The boundary is **2026-10-28T04:00:00Z** (00:00 EDT). Same build, server clock shifted:

| Surface                                                                             | Server clock 03:59:20Z              | Server clock 04:00:10Z                      |
| ----------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------- |
| `/`                                                                                 | Absent                              | **Shown** (3 matches)                       |
| `/writing` list                                                                     | "Upcoming" ×2, "Preview article" ×1 | **No "Upcoming"**, linked as "Read article" |
| `/writing` CollectionPage JSON-LD                                                   | 15 items, post absent               | **16 items, post present**                  |
| Article, metadata, JSON-LD, OG, feed, sitemap, llms, "More writing", `/open-source` | Already public, unchanged           | Unchanged (byte-identical probe lines)      |

So on Vercel at 04:00Z, with no deploy:

- `/` and `/writing` change on the next request (they are `force-dynamic` and `private, no-store`,
  so nothing is cached in front of them).
- Every other surface has carried the post since the deploy that added the file and does not change.
  RSS readers get no new event on the day; they received the item at deploy time with a future
  `pubDate`.
- From 04:00Z every surface agrees, and the `datePublished`, `article:published_time` and sitemap
  `lastmod` that were false before the boundary become true.
- The feed's `pubDate` stays `Wed, 28 Oct 2026 00:00:00 GMT`, which is 20:00 EDT on Oct 27, four
  hours **before** the Toronto boundary (PUB-02, `utils/feed.ts:15-18`).

After tonight there is no future-dated post in `content/posts/`, so D6 is settled by the calendar,
and anything that tests the boundary must use a fixture post (as #266 section 6 says).
`app/__tests__/writingPublication.spec.ts:33-35` uses fixed instants (`2026-10-27T16:00:00Z`,
`2026-10-29T16:00:00Z`), so it keeps passing after the boundary.

## 3. What is stale in #249 and #266

| Item                        | Correction                                                                                                                                                                                                                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mechanism letters           | #249 uses A = ISR, B = cron, C = deploy hook; #266 uses A = deploy, B = ISR, C = cron, D = deploy hook. This register uses names only (section 5).                                                                                                                                                             |
| Surfaces that link the post | Both list "More writing" and the Markdown link only. `/open-source` also links it from data (`data/openSourcePage.ts:60-63,102,124`). The P4 link check must read `data/**` hrefs as well as Markdown.                                                                                                         |
| `/now` in the sitemap       | #266 section 4.4 left it to the Now track. #275 has landed: `/now` is `<lastmod>2026-05-08</lastmod>` (`app/sitemap.ts:49-54`). The other static routes still print the **build** time (measured `2026-10-28T00:08:57.437Z`).                                                                                  |
| `llms-full.txt` line        | The post's heading is at line 685, not 683: #275 added the `/now` "Updated" line above it.                                                                                                                                                                                                                     |
| D6                          | #266 said "moot once 2026-10-28 has passed". From 04:00Z tonight that is true; nothing can ship before it.                                                                                                                                                                                                     |
| Cron plan limits            | Still as #266 says for frequency and precision (Hobby: once per day, "Per-hour (±59 min)"; Pro: once per minute, per-minute). New since: **100 cron jobs per project on every plan** ([Usage & pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing), updated 2026-07-15).                             |
| Deploy hooks                | A hook accepts **GET or POST**, not only POST; repeat requests for the same version cancel earlier builds from that hook; limits unchanged (5 per project on Hobby/Pro, 60 triggers an hour per project) ([Deploy Hooks](https://vercel.com/docs/deploy-hooks), updated 2026-09-16).                           |
| ISR and deploys             | Vercel's ISR page now states that "each new deployment uses its own ISR cache", so a deploy always starts every ISR route fresh, and on-demand revalidation applies only to the deployment and domain it is triggered on ([ISR](https://vercel.com/docs/incremental-static-regeneration), updated 2026-08-28). |
| `docs/MIGRATIONS.md:5-17`   | Unchanged and still wrong (`content/<slug>.md`, a `description` field, a `data/posts/` index). Rewrite it when D1 lands.                                                                                                                                                                                       |

Still correct and re-measured: every line reference in #266 section 1 except the two above; the
V233-5 reproduction; the `s-maxage=31536000` on article, feed and llms responses; the generic 200 OG
card for unknown slugs.

## 4. Register

Tick one box per item. "Files" lists what an implementation would touch; nothing here touches them.

### D1. Publication states

- **Question:** adopt `draft` / `scheduled` / `published`, plus an explicit public preview?
- **Options:**
  - [ ] **a.** Adopt all four as in section 0: `draft: true` and `preview: true` frontmatter booleans,
        state derived from them and the date, validated at build (#266 section 2).
  - [ ] **b.** Adopt `draft` / `scheduled` / `published` without previews: a scheduled post is
        never readable before its date.
  - [ ] **c.** Keep today's behaviour (date is a label; every committed post is public at deploy).
- **Recommendation:** a.
- **Consequence:** a and b make the date a schedule for every surface, which needs D3 (or the post
  stays hidden until the next deploy; #249 measured that). a keeps a deliberate way to share a link
  before the date; b removes it. c keeps SEC-17 and A-01 open.
- **Files:** `utils/posts.ts:50-58,84-108,136-158,167-188`, new `utils/publication.ts`,
  `utils/date.ts:24-38`, `eslint.config.mjs` (guard on the raw reader),
  `app/__tests__/writingPublication.spec.ts` (rewrite), `docs/MIGRATIONS.md:5-17`.

### D2. Preview rows on `/writing`

- **Question:** should a `preview: true` post be listed on `/writing` as "Upcoming · Preview article"?
- **Options:**
  - [ ] **a.** Yes: keep today's row and label for previews only.
  - [ ] **b.** No: previews are reachable only by their URL.
- **Recommendation:** b. A listed preview is discoverable by anyone browsing, which is close to
  publishing it; a preview is for sharing a link on purpose.
- **Consequence:** a keeps `upcoming` in `features/writing/writingModel.ts:12` and the dashed row
  style; b removes the "Upcoming" and "Preview article" strings (`data/writing.ts:46,68,71`) and the
  timeline's upcoming styling. Either way previews stay `noindex` and out of every export.
- **Files:** `app/writing/page.tsx:19-25`, `features/writing/writingModel.ts`,
  `features/writing/WritingPostFilters.tsx:66-85`, `features/writing/WritingTimeline.tsx:37,164-172`,
  `features/writing/WritingIndexHero.tsx:23`, `data/writing.ts:46,68,71`, the `/writing` visual
  baselines.

### D3. How the date boundary takes effect

- **Question:** what makes a scheduled post public at 00:00 Toronto without someone deploying?
- **Options** (compared in section 5):
  - [ ] **a.** Deploy-based publishing (manual, or a scheduled deploy hook).
  - [ ] **b.** Time-based ISR, `export const revalidate = 3600` on every affected route.
  - [ ] **c.** Vercel cron → route handler → `revalidatePath("/", "layout")`, with
        `revalidate = 86400` on the same routes as a one-day safety net.
- **Recommendation:** c.
- **Consequence:** c adds `vercel.json` and a `CRON_SECRET`, and the boundary lands within the cron's
  precision (Hobby up to ~2 h in summer); all surfaces flip together. b needs nothing new but each
  route flips on its own clock, with one stale response each. a needs nothing new but a post is
  public only after a deploy on or after its date.
- **Files:** a: none, or a workflow in `.github/workflows/` plus a repository secret; b: the eight
  routes in D5's list; c: new `vercel.json`, new `app/api/cron/publish/route.ts` and its test, the
  same routes for the safety net.

### D4. Time zone of the boundary

- **Question:** which calendar decides a date-only post's day?
- **Options:**
  - [ ] **a.** America/Toronto (`SITE_TIME_ZONE`, `utils/date.ts:1`), as `isPostPublished` does today.
  - [ ] **b.** UTC.
- **Recommendation:** a.
- **Consequence:** a publishes at 00:00 EDT/EST, matching `formatDate`, and requires a shared
  `publicationInstant(date)` so the feed, metadata and JSON-LD print the same instant (PUB-02). b
  would publish at 20:00 or 19:00 the evening before in Toronto and disagree with every displayed
  date.
- **Files:** `utils/date.ts`, `utils/feed.ts:15-18,43`, `utils/metadata.ts:82-83`,
  `components/ArticleJsonLd/ArticleJsonLd.tsx:17-18`, `app/writing/page.tsx:44`, tests in
  `utils/__tests__/date.spec.ts` and `utils/__tests__/feed.spec.ts`.

### D5. `/` and `/writing` rendering

- **Question:** keep `force-dynamic` on the home page and `/writing`, or make them static?
- **Options:**
  - [ ] **a.** Make both static and refresh them with the D3 mechanism.
  - [ ] **b.** Keep both dynamic (a function call per visit, `private, no-store`).
- **Recommendation:** a, but only after the D3 mechanism is proven on a preview deployment.
- **Consequence:** a removes a function invocation per visit and puts both pages on the same clock
  as the article, feed and sitemap. b keeps a second clock: with c or b in D3, home could list a
  post up to the cron delay (or ISR window) before its article exists.
- **Files:** `app/page.tsx:8`, `app/writing/page.tsx:14,19`, `playwright.config.ts:24-30` and
  `e2e/fixed-clock.cjs` (the pinned server clock only matters for dynamic pages), the home and
  `/writing` baselines.

### D6. The 2026-10-28 post

- **Question:** does `preparing-integrations-for-anthropic-and-cursor-directories` need a
  frontmatter change?
- **Options:**
  - [ ] **a.** No change: it is published from 2026-10-28T04:00:00Z, before anything here can ship.
  - [ ] **b.** `preview: true` (only meaningful if an implementation shipped before its date).
- **Recommendation:** a.
- **Consequence:** none; section 2 records what it does at the boundary.
- **Files:** none.

### P1. Where drafts live

- **Question:** given the public repository, where are drafts kept?
- **Options:**
  - [ ] **a.** Outside this repository (a private repository or a git-ignored local folder) until
        ready to schedule.
  - [ ] **b.** In `content/posts/` with `draft: true`, accepting that GitHub shows them.
- **Recommendation:** a for anything not yet meant to be read; b only for drafts that may be seen.
- **Consequence:** with b, `draft: true` only keeps the site from serving the post; the text, its
  history and any later deletion remain on GitHub.
- **Files:** `docs/MIGRATIONS.md` (write the rule down); `.gitignore` if a local folder is chosen.

### P2. Vercel plan

- **Question:** is the project on Hobby or Pro, and is Hobby's cron precision acceptable?
- **Options:**
  - [ ] **a.** Hobby, with the `5 5 * * *` UTC schedule (fires 05:00–05:59 UTC: 00:00–00:59 EST or
        01:00–01:59 EDT).
  - [ ] **b.** Pro, with minute precision: `1 5 * * *` (00:01 EST, 01:01 EDT) all year, or two
        entries `1 4 * * *` and `1 5 * * *` with the handler acting only after Toronto midnight.
- **Recommendation:** confirm the plan in the dashboard first (not read here); a is acceptable.
- **Consequence:** on Hobby a post can appear up to about two hours after Toronto midnight in
  summer. A schedule that would run more than once a day fails the Hobby deployment.
- **Files:** `vercel.json` (if D3 = c).

### P3. Ownership of the new secret and config

- **Question:** who creates `CRON_SECRET` and reviews `vercel.json`?
- **Options:**
  - [ ] **a.** The owner, in the Vercel dashboard, before the PR that adds the cron merges.
  - [ ] **b.** Not applicable (D3 is a or b).
- **Recommendation:** a. `AGENTS.md:36` requires human review for Vercel config and environment
  variables.
- **Consequence:** without the secret the route must refuse every call (401), so a missing secret
  fails closed and the safety net still publishes within a day.
- **Files:** `vercel.json`, `app/api/cron/publish/route.ts`.

### P4. Links to posts that are not published

- **Question:** may a published page link to a scheduled post?
- **Options:**
  - [ ] **a.** No: a test fails if any published post's Markdown **or any `data/**` href** points at
        `/writing/<slug>` of a post that is not published at the same `now`.
  - [ ] **b.** Yes, accepting a 404 link until the date.
- **Recommendation:** a, run at the real `now` in CI and at fixture boundaries.
- **Consequence:** the author schedules linked posts together or adds the link on the day. Tonight's
  case would have failed twice: the Markdown link in `agent-readiness-doctor.md:102` and the two
  `/open-source` links.
- **Files:** new `utils/__tests__/postLinks.spec.ts`; `data/openSourcePage.ts` is in scope of the scan.

### P5. Date format in structured data

- **Question:** how are `datePublished` and `article:published_time` written?
- **Options:**
  - [ ] **a.** The Toronto-midnight instant with its offset (`2026-10-28T00:00:00-04:00`), the same
        instant as the feed's `pubDate`.
  - [ ] **b.** Date only (`2026-10-28`), as today.
- **Recommendation:** a.
- **Consequence:** a removes the four-hour disagreement with the feed (PUB-02) and with the
  boundary; b is valid schema.org but leaves the instant to each consumer's zone.
- **Files:** `utils/metadata.ts:82-83`, `components/ArticleJsonLd/ArticleJsonLd.tsx:17-18`,
  `app/writing/page.tsx:44`, `utils/feed.ts:15-18`.

### P6. `updated:` frontmatter

- **Question:** add an optional `updated:` date for `dateModified`, `article:modified_time` and the
  sitemap `lastmod`?
- **Options:**
  - [ ] **a.** Yes, optional per post; absent means "same as `date`".
  - [ ] **b.** No; `dateModified` always equals `datePublished`.
- **Recommendation:** a.
- **Consequence:** a lets a revised article say so without moving its publication date; it adds one
  field to validate. b keeps today's output.
- **Files:** `utils/posts.ts:50-58`, `utils/metadata.ts:82-83`,
  `components/ArticleJsonLd/ArticleJsonLd.tsx:18`, `app/sitemap.ts:12`.

## 5. Boundary mechanisms compared

All three assume the date-blind surfaces filter by state, and that `dynamicParams = false` is set
on `/writing/[slug]` and its OG route with every non-draft post in `generateStaticParams` (#266
sections 4.12–4.13). Without that, a scheduled slug requested early is cached per URL as a 404 for a
year, which is V233-5 applied to a real post.

Affected routes: `/writing/[slug]`, `/writing/[slug]/opengraph-image`, `/feed.xml`, `/sitemap.xml`,
`/llms.txt`, `/llms-full.txt`, `/open-source` (it links posts), and `/` plus `/writing` if D5 = a.

|                                   | Deploy-based publishing                                                                                                                                                                                                          | Time-based ISR (`revalidate = N`)                                                                                                                                                                                                                                | Cron + on-demand `revalidatePath`                                                                                                                                                                                                                                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How                               | Surfaces filter with the **build** time. A post goes public when a production deploy runs on or after its date: by hand, or a scheduled job calling a Vercel Deploy Hook                                                         | `export const revalidate = N` on each affected route; each regenerates after `N` seconds when requested                                                                                                                                                          | `vercel.json` cron (`5 5 * * *`) calls `app/api/cron/publish/route.ts`, which checks the bearer secret and, if some post's `publicationInstant` fell in the last 26 h, calls `revalidatePath("/", "layout")`. `revalidate = 86400` on the same routes as a safety net                                                            |
| Services and credentials          | Manual: none. Scheduled: a Deploy Hook (Settings → Git) whose URL **is** the credential, stored as a repository secret, plus a workflow file (CI track)                                                                          | None                                                                                                                                                                                                                                                             | `vercel.json` (human review), `CRON_SECRET` project env var (≥ 16 characters; Vercel sends `Authorization: Bearer <value>`), the route handler                                                                                                                                                                                   |
| Plan limits                       | Deploy hooks: 5 per project (Hobby/Pro), 60 triggers an hour per project. GitHub `schedule`: shortest 5 min, can be delayed or dropped under load, runs only on the default branch, disabled after 60 days without repo activity | ISR is on all plans                                                                                                                                                                                                                                              | Cron on all plans, 100 per project. Hobby: once a day, ±59 min. Pro: once a minute, per-minute. Crons run only for the production deployment                                                                                                                                                                                     |
| Cost                              | One full production build per publication day (local build ~80 s; Vercel adds install and upload). GitHub Actions minutes are free for a public repository                                                                       | Up to `86400 / N` regenerations per route per day, only when requested; billed as function invocations plus ISR writes/reads. `N = 3600` over ~41 paths (16 articles, 16 OG images, 9 other routes): at most ~980 small renders a day (arithmetic, not measured) | One function invocation a day; one regeneration per requested path on publication days only (ISR writes)                                                                                                                                                                                                                         |
| First request after 00:00 Toronto | Before the deploy: still hidden everywhere. After it: fresh, because each deployment starts its own ISR cache                                                                                                                    | **Stale.** Measured locally in #249 spike 1: first request after expiry `x-nextjs-cache: STALE` (old 404), second `200`. Vercel documents the same ("visitors continue to get the cached version"). Each route on its own clock                                  | Hidden everywhere until the cron fires (consistent). Measured locally (#249 spike 2): first request after the call regenerated synchronously (`MISS`, 200). Vercel documents on-demand revalidation as background ("visitors continue to get the cached version"). **Unverified on Vercel**: at most one stale response per path |
| Failure modes                     | Forgetting to deploy; a red `main` blocks publication; every deploy ships whatever else is on `main`; a dropped or late GitHub run; a leaked hook URL lets anyone redeploy                                                       | Self-healing. A failed regeneration keeps the stale copy and retries after 30 s. For up to `N` home can link an article still served as a cached 404                                                                                                             | Vercel does not retry a failed cron, and delivery is best effort (a run can be missed or duplicated). The handler is idempotent; the 26 h look-back absorbs duplicates; the `revalidate = 86400` safety net bounds a missed run to a day. A missing secret fails closed (401)                                                    |
| Surfaces agree at the boundary?   | Yes, after the deploy                                                                                                                                                                                                            | No, until every route has regenerated                                                                                                                                                                                                                            | Yes, one invalidation                                                                                                                                                                                                                                                                                                            |

Recommendation for D3: **cron + `revalidatePath`** with the one-day ISR safety net. If no cron or
secret is wanted, **ISR with `N = 3600`**. Deploy-based publishing is the simplest and needs nothing
new, but it makes the frontmatter date a reminder rather than a schedule.

Before relying on the cron: on a Vercel preview, call the route by hand with the secret and record
the first response's `x-vercel-cache` for an article, the feed and the sitemap.

## 6. Not verified

- The Vercel plan (Hobby or Pro). Not read; P2.
- On Vercel, whether the first request after an on-demand `revalidatePath` gets fresh or stale
  content, and the browser-facing `Cache-Control` for routes with `revalidate = 86400`.
- Whether unknown-slug cache entries accumulate per deployment on Vercel as they do on local disk.
- Cost figures are arithmetic upper bounds, not measured usage.
- The live site was not requested; every measurement is a local production build.
