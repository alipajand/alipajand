# Writing publication: implementation proposal

Status: **proposal, nothing implemented.** This document changes no behaviour. It turns the model in
[`writing-publication-policy.md`](./writing-publication-policy.md) (#249) into a concrete change list.
Decisions D1–D6 in that document are still **open owner decisions**; everything below assumes the
recommended answers and says where a different answer changes the plan.

The open decisions now live in
[`writing-publication-decision-register.md`](./writing-publication-decision-register.md), which
also corrects the parts of this document that went stale after #275.

Baseline: `main` at `de7fac2`. Verified on 2026-10-27 between 18:45 and 19:30 America/Toronto with
`pnpm build && pnpm start -p 3505` (Next.js 16.4.3, Turbopack). The example post is still
`content/posts/preparing-integrations-for-anthropic-and-cursor-directories.md` (`date: "2026-10-28"`),
which becomes published at **2026-10-28T04:00:00Z**, a few hours after this was written. If this is
read after that instant, re-create the situation with a fixture post (section 6), not the real one.

Between #249's baseline (`6ec24ef`) and `de7fac2` the only change to a file named here is
`657f0c5` (build-time HTML sanitising in `utils/posts.ts`). It moved line numbers but not
publication behaviour. Line numbers in this document are for `de7fac2`; some in #249 are now stale
(for example `getPublishedPosts` is at `utils/posts.ts:167`, not `:155`).

## 0. Target policy

| State                      | Who can read it                              | Indexed / listed anywhere                    |
| -------------------------- | -------------------------------------------- | -------------------------------------------- |
| `draft`                    | Nobody **through the site** (see the caveat) | No                                           |
| `scheduled`                | Nobody until 00:00 America/Toronto on `date` | No                                           |
| `scheduled` + `preview`    | Anyone with the URL                          | No: `noindex`, no feed, sitemap, llms, lists |
| `published` (date ≤ today) | Everyone                                     | Yes, everywhere                              |

**Caveat that the code cannot fix.** The repository is public. Any file committed to
`content/posts/` on any branch is readable on GitHub, whatever the site does. "Drafts are private"
can therefore only mean "the site never serves them". If the owner wants drafts that nobody can read,
they must live outside this repository (a private repository, or a git-ignored local folder) until
they are ready. Deleting a committed draft later does not remove it from git history. This is
decision **P1** in section 8.

## 1. Verified current behaviour on `de7fac2`

Route table from `pnpm build` (abridged): `ƒ /`, `ƒ /writing`, `○ /feed.xml`, `○ /sitemap.xml`,
`○ /llms.txt`, `○ /llms-full.txt`, `○ /now`, `● /writing/[slug]` (16 paths),
`● /writing/[slug]/opengraph-image` (16 paths).

`.next/prerender-manifest.json`: every `/writing/*`, the feed, the sitemap and both llms files have
`initialRevalidateSeconds: false`; `/writing/[slug]` and `/writing/[slug]/opengraph-image` have
`fallback: null` (that is, `dynamicParams` is `true`, the default; it is set nowhere). The repo has
no `vercel.json`, no cron, no `revalidate` export, no `revalidatePath`/`revalidateTag`, and no
`cacheComponents` in `next.config.ts`.

Measured with `curl -D -` against port 3505 on 2026-10-27 (the day before the example post's date):

| Surface                             | Code                                                             | Status / `Cache-Control`                                               | Future post                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `/`                                 | `app/page.tsx:8,15`                                              | 200, `private, no-cache, no-store, max-age=0, must-revalidate`         | Absent (0 matches)                                                                             |
| `/writing`                          | `app/writing/page.tsx:14,19-25,35-36`                            | 200, same as `/`                                                       | Listed: 2× "Upcoming", 1× "Preview article"; left out of CollectionPage JSON-LD                |
| Article                             | `app/writing/[slug]/page.tsx:19-22,31-70`                        | 200, `s-maxage=31536000`, `x-nextjs-cache: HIT`                        | `<meta name="robots" content="index, follow"/>`, canonical set                                 |
| Article metadata                    | `utils/metadata.ts:54-95` (`publishedTime` at `:82-83`)          | –                                                                      | `article:published_time` and `article:modified_time` = `2026-10-28`                            |
| Article JSON-LD                     | `components/ArticleJsonLd/ArticleJsonLd.tsx:17-18`               | –                                                                      | `"datePublished":"2026-10-28","dateModified":"2026-10-28"`                                     |
| OG image                            | `app/writing/[slug]/opengraph-image.tsx:9-12,24-31`              | 200, `public, max-age=0, must-revalidate`, `HIT`                       | Built                                                                                          |
| `/feed.xml`                         | `app/feed.xml/route.ts:4,7`, `utils/feed.ts:15-18,43`            | 200, `s-maxage=31536000`                                               | Item present; `<pubDate>` and `<lastBuildDate>` both `Wed, 28 Oct 2026 00:00:00 GMT`           |
| `/sitemap.xml`                      | `app/sitemap.ts:8-14`                                            | 200, `public, max-age=0, must-revalidate`                              | Listed, `<lastmod>2026-10-28</lastmod>`; static routes carry the **build** time                |
| `/llms.txt`                         | `app/llms.txt/route.ts:5,9`, `utils/llms.ts:61-63`               | 200, `s-maxage=31536000`                                               | Listed (1 match)                                                                               |
| `/llms-full.txt`                    | `app/llms-full.txt/route.ts:5,11`, `utils/llms.ts:202-217`       | 200, `s-maxage=31536000`                                               | Full Markdown body at line 683, `Published: 2026-10-28` at line 686                            |
| "More writing"                      | `app/writing/[slug]/page.tsx:61-65`, `WritingPostMore.tsx:28-42` | –                                                                      | Linked from other standard articles (1 match on `/writing/design-systems-that-stick`)          |
| In-body link                        | `content/posts/agent-readiness-doctor.md:102`                    | –                                                                      | Linked (1 match on `/writing/agent-readiness-doctor`)                                          |
| `/robots.txt`                       | `app/robots.ts:24-41`                                            | 200                                                                    | No rule for writing; root layout sets `index: true` for every page (`app/layout.tsx:65-75`)    |
| Unknown slug `/writing/zz-t5-probe` | –                                                                | **404 with `s-maxage=31536000`**, `MISS` then `HIT`                    | Cache files written under `.next/server/route-cache/APP_PAGE/…/writing/zz-t5-probe.*` (V233-5) |
| Unknown slug OG image               | `opengraph-image.tsx:27-31`                                      | **200** generic "Writing" card, cached under `route-cache/APP_ROUTE/…` | –                                                                                              |

V233-5 (every invented slug creates a long-lived cached 404 and a cached 200 OG image) is still
present on `de7fac2`.

## 2. Frontmatter schema

### Current

`PostFrontmatter` (`utils/posts.ts:50-58`) has `title`, `date`, `excerpt`, `seoTitle?`,
`seoDescription?`, `featured?`, `tags?`. Values are cast, not validated (`utils/posts.ts:91`,
`:141`): a missing `date` becomes `""`, and a post with `date: ""` is never published by
`isPostPublished` but **is** routed and exported everywhere date-blind. js-yaml 5.5.0 keeps
`date: 2026-10-28` (unquoted) and `draft: yes` as **strings** (checked with `node -e`), so a
typo like `draft: "true"` or `draft: yes` would silently be truthy-looking but not `true`.

### Proposed

```yaml
# published (no flag needed)
date: "2026-09-18"

# scheduled: date in the future, no flag
date: "2026-11-12"

# scheduled with an explicit public preview
date: "2026-11-12"
preview: true

# draft: never routed, never exported
draft: true
date: "2026-11-12" # optional for drafts
```

Rules, enforced by a new `parsePostFrontmatter(file, data)` in `utils/posts.ts` that throws with the
file name (failing `pnpm build` and the Jest suite):

- `title`, `excerpt`: non-empty strings.
- `date`: required unless `draft: true`; either `YYYY-MM-DD` that round-trips through
  `Date.UTC`, or an ISO timestamp **with an explicit offset** (`2026-11-12T09:00:00-05:00`).
  Reject offset-less timestamps, which `Date.parse` reads in the server's zone.
- `draft`, `preview`, `featured`: absent or the boolean `true`/`false`; any other type throws.
- `draft: true` with `preview: true` throws.
- `preview: true` on a post whose date has passed is allowed and ignored (it is then just
  published); a lint test can warn so the flag gets cleaned up.

The state is derived, never stored, so contradictory combinations cannot exist:

```ts
// utils/publication.ts (new)
export type PublicationState = "draft" | "scheduled" | "preview" | "published";
export const publicationState = (post: PostSummary, now: Date): PublicationState =>
  post.draft
    ? "draft"
    : isPostPublished(post.date, now)
      ? "published"
      : post.preview
        ? "preview"
        : "scheduled";
```

`PostSummary` gains `draft?: true` and `preview?: true`, set in `getAllPosts()`
(`utils/posts.ts:84-108`) and `getPostBySlug()` (`:136-158`) the same way `featured` is today.

Migration: none of the 16 posts needs an edit. The 15 posts dated up to 2026-10-12 are published.
The 2026-10-28 post is published by the time any of this can ship. `docs/MIGRATIONS.md:5-17`
("Adding a new writing post") still describes `content/<slug>.md`, a `description` field and a
`data/posts/` index; rewrite it with the four states.

## 3. One helper: `isPublished(post, now)`

```ts
// utils/publication.ts
export const isPublished = (post: PostSummary, now: Date) =>
  publicationState(post, now) === "published";
export const isRoutable = (post: PostSummary) => !post.draft; // has a URL at all
export const isReadable = (post: PostSummary, now: Date) =>
  // URL returns 200
  ["published", "preview"].includes(publicationState(post, now));
```

- `isPostPublished(date, now)` (`utils/date.ts:24-38`) stays as the calendar rule underneath and is
  imported only by `utils/publication.ts`.
- `getAllPosts()` becomes module-private (rename to `readAllPostFiles()`); export instead
  `getPublishedPosts(now)` (already at `utils/posts.ts:167-168`, re-pointed at `isPublished`),
  `getRoutablePosts()` and `getReadablePost(slug, now)`.
- Guard: an ESLint `no-restricted-imports` rule in `eslint.config.mjs` forbidding
  `isPostPublished` and the raw reader outside `utils/posts.ts` and `utils/publication.ts`, plus a
  Jest test that greps `app/**` and `features/**` for `getAllPosts`.
- `now` is always a parameter. Routes pass `new Date()` at render time; tests pass fixed instants.
  Nothing reads the client clock for publication (true today as well).

## 4. Surface by surface

Each row: current → proposed, exact change, tests. "Mechanism" refers to section 5.

### 4.1 Canonical and article metadata

- **Current:** `buildArticleMetadata` (`utils/metadata.ts:54-95`) always sets the canonical URL,
  `openGraph.publishedTime`/`modifiedTime = p.date` and no `robots`, so the root layout's
  `index: true` applies (`app/layout.tsx:65-75`).
- **Proposed:** `generateMetadata` (`app/writing/[slug]/page.tsx:24-29`) resolves the state.
  - `published`: as today; `publishedTime` becomes the Toronto-midnight instant (section 4.11).
    `modifiedTime` is omitted unless the owner adds an `updated:` field (decision P6).
  - `preview`: `robots: { index: false, follow: true, googleBot: { index: false, follow: true } }`
    (the layout's `googleBot` block must be overridden too, or Google reads its `index: true`);
    no `publishedTime`/`modifiedTime`; keep the canonical pointing at itself (the URL is final, and
    `noindex` on the page is what keeps it out of search).
  - `scheduled`, `draft`, unknown: `notFound()` is called in the page; metadata returns
    `{ title: "Not found", robots: { index: false } }`.
- **Change:** `buildArticleMetadata(post, state)` in `utils/metadata.ts`.
- **Tests:** extend `utils/__tests__/metadata.spec.ts`: published has no `robots` override; preview
  has `index: false` in both `robots` and `googleBot`, and no `publishedTime`.

### 4.2 Article JSON-LD

- **Current:** always rendered (`app/writing/[slug]/page.tsx:52`), with `datePublished` and
  `dateModified` equal to the frontmatter date (`ArticleJsonLd.tsx:17-18`).
- **Proposed:** render `<ArticleJsonLd>` only when `published`. `datePublished` is the Toronto
  offset form `2026-10-28T00:00:00-04:00` (or date-only, decision P5); `dateModified` is the
  `updated:` field if P6 adds one, else equal to `datePublished`. `BreadcrumbJsonLd` stays on
  previews (harmless, and the page is `noindex`).
- **Tests:** `components/ArticleJsonLd/__tests__/ArticleJsonLd.spec.tsx` for the date format; the
  page-level matrix (section 6) for presence/absence.

### 4.3 RSS (`/feed.xml`), including PUB-02

- **Current:** every post (`app/feed.xml/route.ts:7`); `pubDate` is UTC midnight because
  `toRfc822` parses `YYYY-MM-DD` as UTC (`utils/feed.ts:15-18`), which is 20:00 or 19:00 the
  **previous evening** in Toronto; `lastBuildDate` is the newest post's date (`utils/feed.ts:43`),
  measured as `Wed, 28 Oct 2026 00:00:00 GMT`, a future value.
- **Proposed:**
  - Items: `getPublishedPosts(now)` only. Previews, scheduled posts and drafts never appear.
  - `pubDate` (PUB-02): the publication instant, `publicationInstant(date)` =
    00:00 America/Toronto on that date, for example `Wed, 28 Oct 2026 04:00:00 GMT` (EDT) or
    `Mon, 07 Dec 2026 05:00:00 GMT` (EST). Full timestamps are emitted as given.
  - `lastBuildDate`: RSS 2.0 defines it as the last time the channel content changed. Use the
    **newest published item's `pubDate`**, never `now` (which would change on every regeneration
    and make readers think the feed changed) and never a future value.
  - Optional (P5): `<atom:updated>`-style per-item updates are out of scope; RSS readers dedupe by
    `<guid>`, which stays the permalink.
- **Change:** `buildRssFeed(posts)` in `utils/feed.ts` gets a `publicationInstant` import from a new
  helper in `utils/date.ts`, shared with `isPostPublished` so both use the same boundary.
- **Tests:** `utils/__tests__/feed.spec.ts`: `pubDate` for a summer and a winter date; `lastBuildDate`
  equals the first item's `pubDate`; a fixture with a future post yields no item and no future
  `lastBuildDate`.

### 4.4 Sitemap

- **Current:** every post with `lastModified: post.date` (`app/sitemap.ts:8-14`); every static route
  has `lastModified: new Date()`, which is the **build** time (measured `2026-10-27T22:46:51.826Z`),
  so it changes on every deploy whether or not content did.
- **Proposed:** `getPublishedPosts(now)` only; `lastModified` = `updated ?? date`. Static routes get a
  hand-maintained date each (for `/now` that is `NOW_UPDATED`, owned by the Now track; see
  `now-freshness-and-activity.md`). The `/writing` entry's `lastModified` = newest published post's
  date.
- **Change:** `app/sitemap.ts`. Coordinate with the Now track, which also needs this file for
  `/now`.
- **Tests:** `app/__tests__/sitemap.spec.ts`: no non-published slug; no `lastModified` after `now`.

### 4.5 `llms.txt` and `llms-full.txt`

- **Current:** every post (`app/llms.txt/route.ts:9`, `app/llms-full.txt/route.ts:11`); the full
  Markdown of the future post is served with `s-maxage=31536000`, and `app/robots.ts:10-22` invites
  answer-engine crawlers by name. Once fetched, text cannot be withdrawn.
- **Proposed:** `getPublishedPosts(now)` for both. `Published:` line uses the date as today.
- **Change:** the two route files only; `utils/llms.ts` is already list-driven.
- **Tests:** `utils/__tests__/llms.spec.ts` with fixtures; the page-level matrix.

### 4.6 Home page and `/writing` index

- **Current:** `/` uses `getPostsForWritingSection` → `getPublishedPosts` (`app/page.tsx:15`,
  `utils/posts.ts:174-188`). `/writing` shows every post and flags `upcoming`
  (`app/writing/page.tsx:19-25`, `writingModel.ts:11-12`), labelled "Upcoming"/"Preview article"
  (`WritingPostFilters.tsx:66-85`), excluded from the hero count (`WritingIndexHero.tsx:23`), the
  featured pick (`writingModel.ts:49-51`) and the CollectionPage JSON-LD
  (`app/writing/page.tsx:35-36`). Both routes are `force-dynamic` only to read the clock.
- **Proposed:**
  - `/`: unchanged rule (`isPublished`).
  - `/writing`: published posts, plus `preview` posts as "Upcoming · Preview article" rows **only if
    D2 keeps them**. `scheduled` (no preview) and `draft` never appear. Topic lanes
    (`topicLanes`, `writingModel.ts:29-43`) and the timeline range (`timelineRange`,
    `writingModel.ts:73-84`) count published posts only, so a preview cannot stretch the timeline.
    The `upcoming` flag becomes `state === "preview"`.
  - Both drop `force-dynamic` (D5) and become static, refreshed by the mechanism in section 5. Until
    a mechanism exists, they must stay dynamic, or they would freeze at build time.
- **Change:** `app/page.tsx`, `app/writing/page.tsx`, `features/writing/writingModel.ts`.
- **Tests:** `app/__tests__/writingRoutes.spec.tsx` and `features/writing/__tests__/writingModel.spec.ts`
  with fixture posts in each state.

### 4.7 "More writing" and in-body links

- **Current:** "More writing" lists `getAllPosts()` (`app/writing/[slug]/page.tsx:61-65`), so every
  standard article links the future post. `agent-readiness-doctor.md:102` links it in prose.
- **Proposed:** "More writing" uses `getPublishedPosts(now)`. A preview article's own "More writing"
  still lists only published posts (it does not list itself). In-body links are authored, so the
  rule is a **test**: walk every post's Markdown, collect `/writing/<slug>` links, fail if a
  published post links a post that is not published at the same `now`. Run it at the real `now` in
  CI (it then fails the day before a scheduled link target, which is the point) and at each fixture
  boundary.
- **Change:** `app/writing/[slug]/page.tsx`; new `utils/__tests__/postLinks.spec.ts`.
- **Note:** a link from a published post to a scheduled post is a broken link until the date. The
  author can either schedule both together or add the link on the day.

### 4.8 OG images

- **Current:** `generateStaticParams` = every post (`opengraph-image.tsx:9-12`); any slug, real or
  not, gets a 200 image (generic "Writing" card for unknown slugs, `:27-31`).
- **Proposed:** `generateStaticParams` = `getRoutablePosts()` (same as the page);
  `export const dynamicParams = false`; the handler calls `notFound()` unless `isReadable`. Previews
  keep an image (it is what a shared preview link unfurls with). Optional `X-Robots-Tag: noindex`
  on preview images is not needed: images are not indexed as pages, and the page is `noindex`.
- **Tests:** OG handler returns 404 for unknown, draft and scheduled fixtures; 200 for preview and
  published.

### 4.9 Robots and `noindex`

- **Current:** `robots.txt` disallows only `/api/` (`app/robots.ts:24`); no page is `noindex`.
- **Proposed:** keep `robots.txt` as is. **Do not** `Disallow` preview URLs: a crawler that is
  disallowed never sees the `noindex` meta and can still index the bare URL from links. `noindex`
  is carried only by the preview page's metadata (section 4.1). Scheduled and draft URLs 404, which
  needs no robots rule.

### 4.10 Cache headers

- **Current:** see section 1. Static article, feed and llms responses are `s-maxage=31536000`;
  `/` and `/writing` are `private, no-store`; the sitemap and OG images are
  `public, max-age=0, must-revalidate` and prerendered once.
- **Proposed:** Next.js derives `Cache-Control` from the route's revalidation settings; nothing is
  set by hand. With the recommended mechanism (section 5, option C plus a one-day safety net), the
  affected routes export `revalidate = 86400` and Next emits
  `s-maxage=86400, stale-while-revalidate=…` locally (as in #249's spike 1). On Vercel the CDN
  manages ISR caching itself (Vercel ISR docs, "Zero configuration overhead … manages
  `Cache-Control` headers automatically"). **Unverified:** the exact header a browser receives on
  Vercel for these routes; check on a preview deployment.
- 404s for unknown slugs must not be cached for a year: with `dynamicParams = false` the local 404
  is `private, no-cache, no-store` and writes no cache file (#249 spike 1).

### 4.11 Publication-date boundary

- **Current:** `isPostPublished` (`utils/date.ts:24-38`) compares the America/Toronto calendar day;
  boundary for `2026-10-28` is `2026-10-28T04:00:00Z` (#249, measured). Only `/` and `/writing` use
  it.
- **Proposed:** keep America/Toronto (D4). Add `publicationInstant(date: string): Date` in
  `utils/date.ts`, returning 00:00 Toronto on that date (computed from the zone's offset for that
  day via `Intl.DateTimeFormat(..., { timeZoneName: "longOffset" })`, not a fixed `-04:00`), and
  define `isPostPublished(date, now)` as `now >= publicationInstant(date)` so the boundary has one
  definition. The feed, metadata and JSON-LD all print that same instant.
- **Tests:** `utils/__tests__/date.spec.ts`: `03:59:59Z`/`04:00:00Z` on 2026-10-28; the winter
  boundary `05:00:00Z` (for example 2026-12-07); both 2026/27 DST change days (2026-11-01,
  2027-03-14) where a Toronto day is 25 h and 23 h long; run under `TZ=UTC`,
  `TZ=America/Los_Angeles` and `TZ=Pacific/Auckland` (as #259 did for `week.ts`).

### 4.12 `generateStaticParams` and static route generation

- **Current:** both dynamic routes prerender every post (`page.tsx:19-22`,
  `opengraph-image.tsx:9-12`).
- **Proposed:** both use `getRoutablePosts()`: published, scheduled and preview, **never drafts**.
  Scheduled posts are included on purpose: they prerender as a 404 (`notFound()`), and revalidation
  can turn that path into a 200 on its date even with `dynamicParams = false` (#249 spikes 1 and 2).
  A draft is not in the list, so with `dynamicParams = false` it can never render, even after
  revalidation; un-drafting it needs a deploy, which is acceptable because it is a content commit.
- **Consequence for option A (deploy-based) only:** if scheduled posts were left out of
  `generateStaticParams` instead, each one would need a deploy on its date to exist at all.

### 4.13 Unknown slugs (V233-5) and `dynamicParams = false`

- **Current:** reproduced in section 1: a cached 404 for a year and route-cache files per invented
  slug; a cached 200 OG image.
- **Proposed:** `export const dynamicParams = false` in both `app/writing/[slug]/page.tsx` and
  `app/writing/[slug]/opengraph-image.tsx`. Next.js docs: with `false`, "Dynamic route segments not
  included in `generateStaticParams` will return a 404."
  ([dynamicParams](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams)).
  The same page notes `dynamicParams` "is not available when Cache Components is enabled"; the repo
  does not enable `cacheComponents`, and enabling it later would need a different approach
  (`"use cache"` with `cacheLife`/`cacheTag`).
- **Order matters:** `dynamicParams = false` must land **with or before** any date filtering plus
  revalidation, or a scheduled slug requested before its date is cached per URL as a 404, which is
  V233-5 applied to a real post (#249 section 4.6).
- **Tests:** a build check (script over `.next/prerender-manifest.json`): both dynamic routes have
  `fallback: false`. An e2e request to an unknown slug returns 404 and is not
  `s-maxage=31536000`.

## 5. Making the boundary take effect without a manual deploy

Four mechanisms. All assume sections 2–4 (filtering by state) are in place.

The account has **no Vercel team** (`list_teams` returned none), so the project is on a personal
account. Vercel personal accounts are Hobby; **confirm the plan in the dashboard** before choosing,
because the cron limits differ.

### A. Deploy-based publishing

Static surfaces filter by `isPublished(post, buildTime)`; the post goes live when someone deploys
on or after its date.

- **Infrastructure / credentials:** none new.
- **First request at the boundary:** nothing changes at 00:00; the post stays hidden until the next
  production deploy, then the first request is fresh. `/` and `/writing` must stay `force-dynamic`
  or they disagree with the article for the gap.
- **Failure modes:** forgetting to deploy; a red `main` on the day blocks publication; any deploy
  ships whatever else is on `main`.
- **Cost:** none beyond the deploy.

### B. Time-based ISR (`export const revalidate = N`)

On the article, OG image, feed, sitemap, both llms files, `/` and `/writing`.

- **Infrastructure / credentials:** none.
- **First request at the boundary:** **stale.** Measured locally in #249 spike 1: after expiry the
  first request returned the cached 404 (`x-nextjs-cache: STALE`) and triggered regeneration; the
  second returned 200. Vercel's ISR docs describe the same stale-while-revalidate behaviour for
  time-based revalidation ("visitors continue to get the cached version while Vercel generates the
  new content"; [ISR](https://vercel.com/docs/incremental-static-regeneration)). Each route expires
  on its own clock, so for up to `N` (plus one request) home can link to an article still served
  as a cached 404.
- **Failure modes:** self-healing. A failed regeneration keeps the stale copy and retries after
  30 s (Vercel ISR docs, "On failure").
- **Cost:** at most `86400 / N` background regenerations per route per day, only when requested;
  each counts as a function invocation plus ISR read/write units (Vercel ISR docs, "Pricing and
  limits"). With `N = 3600` and ~40 routes, at most ~960 small renders a day. Not measured on
  Vercel.

### C. Vercel cron → route handler → `revalidatePath` (recommended, with B at `N = 86400` as a safety net)

- **Infrastructure / credentials:**
  - `vercel.json` (new; human review per `AGENTS.md`):
    `{ "crons": [{ "path": "/api/cron/publish", "schedule": "5 5 * * *" }] }`.
  - `CRON_SECRET` project environment variable, at least 16 random characters; Vercel sends it as
    `Authorization: Bearer <value>` on each invocation
    ([Managing cron jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs), "Securing cron
    jobs"). Set by the owner; not by this proposal.
  - `app/api/cron/publish/route.ts`: `GET` returns 401 unless the bearer matches; if no post's
    `publicationInstant` falls in the last 26 hours, return 204 without revalidating; otherwise
    `revalidatePath("/", "layout")` and return 200 with the slugs. The built `.meta` files for the
    feed, sitemap, `llms-full.txt`, `/now` and the OG image all carry the `_N_T_/layout` cache tag
    (checked in `.next/server/app/*.meta`), so one call covers pages and route handlers.
- **Schedule and plan limits:** cron schedules are UTC. Hobby allows once per day with "Per-hour
  (±59 min)" precision; Pro allows once per minute, per-minute precision
  ([Usage & pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing)). `5 5 * * *` fires
  05:05–05:59 UTC on Hobby, which is 00:05–00:59 EST or 01:05–01:59 EDT: always after Toronto
  midnight, at most about two hours late in summer. Cron definitions are taken from the production
  deployment (the CLI docs for `vercel crons run` say it reads them from the deployed production
  project), so a preview deployment never fires them; test previews by calling the route by hand.
- **First request at the boundary:** before the cron, the post stays a cached 404 everywhere
  (consistent). After it:
  - **Measured locally** (#249 spike 2, `next start`): the first request after `revalidatePath`
    regenerated synchronously (`MISS`, 200, feed updated).
  - **Documented:** Next.js says a call from a Route Handler "marks the path for revalidation. The
    revalidation is done on the next visit"
    ([revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)).
    Vercel's ISR page says on-demand revalidation also runs "in the background: visitors continue to
    get the cached version while Vercel generates the new content".
  - **Unverified:** whether the first request on Vercel after the call gets fresh or stale content.
    The two documents read differently. Test on a preview deployment by calling the handler by hand
    (with the secret) before relying on it. Either way, at most one stale response per path.
- **Failure modes:** Vercel does not retry a failed cron; delivery is "best effort", and a run can
  be missed or delivered twice ([Managing cron jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs),
  "Cron job error handling", "Cron job delivery and idempotency"). The handler is idempotent
  (revalidating twice is harmless) and looks back 26 hours, so a duplicate does nothing new; a
  missed run is caught by the `revalidate = 86400` safety net within a day, or by the next run if
  the look-back is widened to 50 hours. Disabling crons in the dashboard persists across rollbacks.
- **Cost:** one function invocation a day; one regeneration per requested path on publication days
  only. Cron jobs are included on all plans and billed as function usage.

### D. GitHub Actions `schedule` → Vercel deploy hook

- **Infrastructure / credentials:**
  - A Deploy Hook created in Vercel project settings (Settings → Git → Deploy Hooks) for `main`.
    The URL itself is the credential: "anyone with the URL" can deploy, so it goes in a repository
    secret ([Deploy Hooks](https://vercel.com/docs/deploy-hooks), "Security").
  - A workflow in `.github/workflows/` (CI track) with `on: schedule` in America/Toronto (GitHub's docs say a
    schedule can take an IANA time zone string; check the exact key when writing the workflow), running `curl -X POST "$DEPLOY_HOOK_URL"` only when a
    post's date is today.
- **Limits:** 5 hooks per project on Hobby/Pro; 60 triggers per hour per project. GitHub: shortest
  interval 5 minutes; runs "can be delayed during periods of high loads" and "some queued jobs may be
  dropped"; scheduled workflows run only on the default branch, and in a public repository are
  "automatically disabled when no repository activity has occurred in 60 days"
  ([GitHub events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)).
- **First request at the boundary:** hidden until the build finishes (local build ~80 s; Vercel adds
  install and upload), then fresh, because a deploy starts a new ISR cache.
- **Failure modes:** a red or broken `main` blocks publication; every run ships whatever is on
  `main` at that moment, close to an unplanned deploy; a dropped or delayed GitHub run; the 60-day
  auto-disable on a quiet repository; a leaked hook URL lets anyone redeploy.
- **Cost:** one production build per publication day (or per day if not filtered); GitHub Actions
  minutes are free for public repositories.

A hybrid (GitHub Actions schedule calling the cron route with `CRON_SECRET` instead of a Vercel
cron) gives minute precision on Hobby but carries GitHub's delay, drop and 60-day risks and puts
the secret in two places. Not recommended unless the plan is Hobby and an hour late is unacceptable.

### Comparison

|                           | A. Deploy             | B. ISR `N`                         | C. Cron + `revalidatePath`                                         | D. Scheduled deploy hook         |
| ------------------------- | --------------------- | ---------------------------------- | ------------------------------------------------------------------ | -------------------------------- |
| New config / secret       | None                  | None                               | `vercel.json`, `CRON_SECRET`                                       | Deploy hook URL secret, workflow |
| Delay after 00:00 Toronto | Until someone deploys | ≤ N + one stale response per route | Hobby ≤ ~2 h, Pro ~5 min; possibly one stale response (unverified) | Scheduler delay + build          |
| Surfaces agree?           | Yes after deploy      | No, each route on its own clock    | Yes, one invalidation                                              | Yes after deploy                 |
| Failure recovery          | Manual                | Self-healing                       | Safety net `revalidate = 86400`                                    | Manual                           |
| Daily cost                | 0                     | ≤ 86400/N renders per route        | 1 invocation                                                       | 1 build on publication days      |

## 6. Tests to add (one list)

- `utils/__tests__/publication.spec.ts`: state matrix (draft, scheduled, preview, published) at
  `2026-10-28T03:59:59Z` and `04:00:00Z`, a winter date, both DST days; schema errors throw with the
  file name.
- A rewrite of `app/__tests__/writingPublication.spec.ts` (`:47-53` asserts no `draft:` key and
  `:70-89` pins today's leak; both must change). Use fixture posts in a temporary directory by making
  `POSTS_DIR` (`utils/posts.ts:40`) injectable, and assert for each state, before and after the
  boundary: article and OG `generateStaticParams`, page `notFound()`, metadata robots, `ArticleJsonLd`
  presence, sitemap, feed (items, `pubDate`, `lastBuildDate`), `llms.txt`, `llms-full.txt`, home,
  `/writing` rows and JSON-LD, "More writing".
- `utils/__tests__/postLinks.spec.ts` (section 4.7).
- `app/api/cron/publish/__tests__/route.spec.ts`: 401 without or with a wrong bearer; 204 with no
  post in the window; `revalidatePath("/", "layout")` called once when a post is in the window.
- Build check: `fallback: false` for both writing dynamic routes; unknown slug e2e 404 without a
  year-long `s-maxage`.
- E2E with Playwright `page.clock` cannot move the **server** clock. Boundary behaviour is covered by
  Jest with injected `now`; e2e covers only the rendered result of a fixed build.

## 7. Rollout order

1. **PR 1, no visible change:** `dynamicParams = false` on both writing dynamic routes; the OG image
   route returns 404 for unknown slugs. Fixes V233-5 on its own. Keeps every current post routable
   because all are in `generateStaticParams`.
2. **PR 2:** frontmatter validation and `utils/publication.ts`, with `isPublished` wired into the
   surfaces that already filter (home, `/writing`). No behaviour change for the 16 current posts.
3. **PR 3:** the date-blind surfaces filter by state (sections 4.1–4.8), **together with** the chosen
   mechanism (C plus the `revalidate = 86400` safety net, or B). Never ship the filter without a
   mechanism: #249 measured that the post then stays hidden until the next deploy.
4. **PR 4:** drop `force-dynamic` from `/` and `/writing` (D5), once PR 3's mechanism is proven on a
   preview deployment.
5. **PR 5:** PUB-02 feed dates and `lastBuildDate`, metadata/JSON-LD date format, docs
   (`docs/MIGRATIONS.md`).
6. Before merging PR 3: on a Vercel preview, call the cron route by hand and record the first
   response's `x-vercel-cache` for the article, feed and sitemap (closes the "unverified" item in
   option C).

## 8. Decisions the owner must make

| ID  | Decision                                                                   | Recommendation                                                                                                        |
| --- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| D1  | Adopt `draft` / `scheduled` / `preview` / `published`                      | Yes                                                                                                                   |
| D2  | Keep "Upcoming · Preview article" rows on `/writing` for previews          | Optional; previews stay `noindex` and out of every export either way                                                  |
| D3  | Boundary mechanism                                                         | C (Vercel cron + `revalidatePath`) with `revalidate = 86400`; B with `N = 3600` if no cron or secret is wanted; not D |
| D4  | Time zone                                                                  | America/Toronto midnight                                                                                              |
| D5  | Make `/` and `/writing` static                                             | Yes, after D3 is proven                                                                                               |
| D6  | The 2026-10-28 post                                                        | Moot once 2026-10-28 has passed (it will have by the time this can ship); no frontmatter change                       |
| P1  | Where drafts live                                                          | Outside this public repository, or accept that committed drafts are readable on GitHub                                |
| P2  | Vercel plan (Hobby ±59 min cron vs Pro)                                    | Confirm in the dashboard; Hobby is acceptable with the `5 5 * * *` schedule                                           |
| P3  | Who creates `CRON_SECRET` and reviews `vercel.json`                        | Owner                                                                                                                 |
| P4  | Allow a published post to link a scheduled one                             | No; the link test fails until both are published                                                                      |
| P5  | Date format in JSON-LD and `article:published_time`                        | Toronto offset timestamp, matching the feed                                                                           |
| P6  | Add an `updated:` frontmatter field for `dateModified` / sitemap `lastmod` | Yes, optional per post                                                                                                |

## 9. Not verified

- Vercel's first response after an on-demand `revalidatePath` from a Route Handler (stale or fresh).
- The browser-facing `Cache-Control` on Vercel for routes with `revalidate = 86400`.
- The project's Vercel plan (inferred Hobby from a personal account with no team).
- Cost figures in section 5 are upper bounds from arithmetic, not measured usage.
