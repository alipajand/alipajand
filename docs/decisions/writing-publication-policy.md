# Writing publication policy

Status: **proposed, needs an owner decision.** This document changes no behaviour. It records how
future-dated posts are published today, what follows from that, and a plan for an explicit
`draft | scheduled | published` model.

Baseline: `main` at `6ec24ef`. Verified on 2026-10-27 at about 17:30 America/Toronto with
`pnpm build && pnpm start -p 3492`. The example is the one future-dated post,
`content/posts/preparing-integrations-for-anthropic-and-cursor-directories.md` (`date: "2026-10-28"`).

Related records: SEC-17 in `docs/audits/security-privacy.md` ("by design") and A-01 in
`docs/design/implementation-audit/05-seo-accessibility.md` ("scheduled post leaks"). The current
behaviour is pinned by `app/__tests__/writingPublication.spec.ts`.

## 1. Current behaviour

### 1.1 One rule for "published", used by two surfaces only

`utils/date.ts:24-38` `isPostPublished(date, now)`:

- A date-only value (`YYYY-MM-DD`) is published once the **calendar day in America/Toronto**
  (`SITE_TIME_ZONE`) is on or after it. The comparison uses `Intl.DateTimeFormat` with an explicit
  time zone, so the server's own `TZ` (UTC on Vercel) does not matter.
- A full timestamp is compared as an instant.
- For `2026-10-28` the boundary is **2026-10-28T04:00:00Z** (midnight EDT). Measured with the real
  function: `03:59:59Z → false`, `04:00:00Z → true`, `00:00:00Z → false`.

There is no draft state. Every `.md` file in `content/posts/` is a post (the policy test asserts no
`draft:` key exists). `getAllPosts()` (`utils/posts.ts:83`) returns every file;
`getPublishedPosts(now)` (`utils/posts.ts:155`) filters with `isPostPublished`.

### 1.2 Surface by surface

Route table from `pnpm build` (Next.js 16.4.3), abridged:

```
┌ ƒ /
├ ○ /feed.xml
├ ○ /llms-full.txt
├ ○ /llms.txt
├ ○ /sitemap.xml
├ ƒ /writing
├   /writing/[slug]
│ ├ ● /writing/preparing-integrations-for-anthropic-and-cursor-directories
│ └ ● [+15 more paths]
└   /writing/[slug]/opengraph-image
  ├ ● /writing/preparing-integrations-for-anthropic-and-cursor-directories/opengraph-image
  └ ● [+15 more paths]
```

`.next/prerender-manifest.json`: every `/writing/*`, `/feed.xml`, `/sitemap.xml`, `/llms.txt` and
`/llms-full.txt` entry has `initialRevalidateSeconds: false`. The dynamic routes `/writing/[slug]` and
`/writing/[slug]/opengraph-image` have `fallback: null`, which means `dynamicParams` is `true` (the
default; it is not set anywhere).

| Surface                                  | Code                                                                | Post source                                                                      | Rendering                | `Cache-Control` (local `next start`)                      | Future post on 2026-10-27                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Home writing section                     | `app/page.tsx:8,16`                                                 | `getPostsForWritingSection` → `getPublishedPosts`                                | ƒ `force-dynamic`        | `private, no-cache, no-store, max-age=0, must-revalidate` | **Absent**                                                                                                       |
| `/writing` list                          | `app/writing/page.tsx:14,19-25`                                     | `getAllPosts` + `upcoming` flag                                                  | ƒ `force-dynamic`        | same as home                                              | **Shown**, labelled "Upcoming", link text "Preview article"                                                      |
| `/writing` CollectionPage JSON-LD        | `app/writing/page.tsx:36`                                           | `.filter((post) => !post.upcoming)`                                              | ƒ                        | –                                                         | **Absent** (15 items)                                                                                            |
| `/writing` hero count and featured pick  | `features/writing/WritingIndexHero.tsx:23`, `writingModel.ts:49-51` | `!upcoming`                                                                      | ƒ                        | –                                                         | Not counted, not featured                                                                                        |
| Article page                             | `app/writing/[slug]/page.tsx:19-22`                                 | `generateStaticParams` → `getAllPosts`; render → `getPostBySlug` (no date check) | ● SSG, never revalidated | `s-maxage=31536000`, `x-nextjs-cache: HIT`                | **200**, `<meta name="robots" content="index, follow"/>`                                                         |
| Article metadata                         | `utils/metadata.ts:54-95`                                           | the post                                                                         | ●                        | –                                                         | `article:published_time` `2026-10-28`, canonical URL, no robots override                                         |
| Article JSON-LD                          | `components/ArticleJsonLd/ArticleJsonLd.tsx:16-17`                  | the post                                                                         | ●                        | –                                                         | `"datePublished":"2026-10-28"`, `dateModified` the same                                                          |
| "More writing" on every standard article | `app/writing/[slug]/page.tsx:61`                                    | `getAllPosts`                                                                    | ●                        | –                                                         | **Linked** from the 14 other standard articles                                                                   |
| In-body link in the launch article       | `content/posts/agent-readiness-doctor.md`                           | authored Markdown                                                                | ●                        | –                                                         | **Linked** ("read How to prepare integrations…")                                                                 |
| OG image                                 | `app/writing/[slug]/opengraph-image.tsx:9-12`                       | `getAllPosts`                                                                    | ●                        | `public, max-age=0, must-revalidate`                      | **Built**                                                                                                        |
| `/feed.xml`                              | `app/feed.xml/route.ts:4,7`, `utils/feed.ts`                        | `getAllPosts`                                                                    | ○ `force-static`         | `s-maxage=31536000`                                       | **Item present**, `<pubDate>Wed, 28 Oct 2026 00:00:00 GMT</pubDate>`; `<lastBuildDate>` is the same future value |
| `/sitemap.xml`                           | `app/sitemap.ts:8-14`                                               | `getAllPosts`                                                                    | ○                        | `public, max-age=0, must-revalidate`                      | **Listed**, `<lastmod>2026-10-28</lastmod>`                                                                      |
| `/llms.txt`                              | `app/llms.txt/route.ts:4,9`                                         | `getAllPosts`                                                                    | ○ `force-static`         | `s-maxage=31536000`                                       | **Listed**                                                                                                       |
| `/llms-full.txt`                         | `app/llms-full.txt/route.ts:5,11`                                   | `getAllPosts` + `getPostMarkdown`                                                | ○ `force-static`         | `s-maxage=31536000`                                       | **Full Markdown body** included (heading at line 683 of the built body)                                          |

### 1.3 How each surface decides "now"

- **`/` and `/writing`** are dynamic (`export const dynamic = "force-dynamic"`, added for scheduling
  in `988004c`; neither route uses cookies, headers or search params). Each request runs on the
  server and evaluates `new Date()` (`app/writing/page.tsx:19`; the default argument of
  `getPostsForWritingSection` for home). The response is `private, no-store`, so neither the browser
  nor Vercel's CDN caches it. The client components (`WritingPostFilters`, `WritingTimeline`) only
  receive the server's `upcoming` flag; nothing in the writing feature reads the client clock for
  publication.
- **Everything else is date-blind.** The article pages, OG images, feed, sitemap and both llms files
  never call `isPostPublished`. They are rendered once at build time from `getAllPosts()` and are
  never revalidated (`initialRevalidateSeconds: false`). Their content depends on the **deploy**, not
  the date.
- The repo has no `vercel.json`, no cron, no deploy hook, and no `revalidatePath` or `revalidateTag`
  call.

### 1.4 What happens at the date boundary on Vercel

At 2026-10-28T04:00:00Z, without a rebuild:

- `/` starts showing the post (next request), and `/writing` drops the "Upcoming" label, links it as
  "Read article", counts it, and adds it to the CollectionPage JSON-LD.
- Nothing else changes, because the static surfaces already contained the post since the deploy
  that added the file. After the boundary every surface agrees; before it, they disagree.

The reverse matters for any fix. When I changed the static routes locally to filter by date **without**
revalidation, the post stayed a cached 404 and missing from the feed after the boundary, until the
next deploy (spike 2 in section 4.3). Filtering static surfaces is therefore only safe together with
a revalidation mechanism.

## 2. Consequences of the current behaviour

1. **Early disclosure.** The full article is public from the deploy that adds the file, not from its
   date: by URL, through the "Preview article" link on `/writing`, through "More writing" on every
   article, and as raw Markdown in `llms-full.txt`. This is deliberate (`988004c`, SEC-17), so it is
   not a confidentiality defect. It does mean there is no way to commit a post that is _not_ public
   yet. Note also that the repository itself is public, so anything committed to `content/posts/`
   can already be read on GitHub whatever the site does.
2. **Search indexing.** The article is `index, follow`, has a canonical URL, and is in the sitemap
   with a future `lastmod`. There is no `noindex` on the preview. A crawler can index it before its
   date, so its first-seen date can come before its stated publication date.
3. **RSS subscribers.** Readers receive the item when the deploy happens, with a `pubDate` in the
   future. Some readers sort or hide future-dated items, so the item can jump or appear late. On the
   date itself nothing new is emitted: subscribers got it early, with no event on the day.
   `lastBuildDate` comes from the newest post's date, not the build, so it is also in the future.
   Separately, every `pubDate` is UTC midnight (`toRfc822` in `utils/feed.ts:15-18` parses
   `YYYY-MM-DD` as UTC), which is 20:00 or 19:00 the **previous evening** in Toronto, so it disagrees
   with the Toronto rule used elsewhere.
4. **Full-text machine access.** `llms-full.txt` carries the full Markdown of the future post, and
   `app/robots.ts` explicitly welcomes AI crawlers. Once fetched, the text cannot be withdrawn. It is
   served with `s-maxage=31536000`.
5. **Static vs dynamic rendering.** `/` and `/writing` are `force-dynamic` only so they can read the
   clock (no other request-time API is used), which costs a function invocation on every visit. The
   static surfaces ignore the clock entirely. The result is two clocks: the request clock for
   two pages and the deploy clock for the rest.
6. **Scheduled publication.** For everything except the home list, the "Upcoming" label and the
   CollectionPage JSON-LD, publication happens at deploy time. The date in the frontmatter is a label,
   not a schedule.
7. **Structured data.** On the day before its date the article page emits `Article` JSON-LD with
   `datePublished: "2026-10-28"` and `article:published_time` `2026-10-28`. Both are false at the
   time they are served. The CollectionPage JSON-LD on `/writing` correctly leaves the post out, so
   the two blocks disagree for that day.
8. **Cache invalidation.** The static responses are cached by the CDN until the next deploy
   (`s-maxage=31536000` for articles, feed and llms; the sitemap and OG images are `max-age=0,
must-revalidate` but still prerendered once). Nothing invalidates them on a date. Any change to
   this policy needs an explicit invalidation path (section 4.3).

## 3. Proposed model

Three states, derived from two frontmatter fields, so contradictory combinations cannot exist:

| State       | Frontmatter                                      | Rule                                                         | Public?                                               |
| ----------- | ------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------- |
| `draft`     | `draft: true`                                    | any date                                                     | **Never.** Not routed, not listed, not in any export. |
| `scheduled` | no `draft`, `date` after today in Toronto        | becomes `published` automatically at 00:00 Toronto on `date` | **No**, unless `preview: true`                        |
| `published` | no `draft`, `date` on or before today in Toronto | –                                                            | Yes, everywhere                                       |

`preview: true` (optional, only valid on a post that is not a draft) opts a scheduled post into an
**explicit public preview**:

- the article URL works and shows the article;
- `<meta name="robots" content="noindex">` (`robots: { index: false, follow: true }` in
  `generateMetadata`);
- no `Article` JSON-LD, no `article:published_time`;
- excluded from the sitemap, RSS, `llms.txt`, `llms-full.txt`, the home page, "More writing" and the
  CollectionPage JSON-LD;
- listed on `/writing` as "Upcoming / Preview article" only if the owner wants to keep that
  (decision D2).

On its date a preview post becomes a normal published post. `preview` then has no effect and can be
removed in a later cleanup.

This matches the owner's default: drafts are never public, scheduled posts become public on or after
their date, and previews are a separate, deliberate state.

## 4. Implementation plan (separate PRs, not this one)

### 4.1 Frontmatter schema and migration

- Add to `PostFrontmatter` (`utils/posts.ts:50`): `draft?: boolean`, `preview?: boolean`.
- Validate at build time in `getAllPosts()` and throw with the file name if:
  - `date` is not a valid `YYYY-MM-DD`, or a timestamp that `Date.parse` accepts;
  - `draft` or `preview` is present but not boolean;
  - `draft: true` and `preview: true` are both set.
- Migration of the 16 existing posts:
  - The 15 posts dated on or before 2026-10-12 need no change and stay `published`.
  - `preparing-integrations-for-anthropic-and-cursor-directories` (`2026-10-28`) is `published` once
    the implementation ships after that date, so it needs no change. If the implementation ships
    before then, the owner chooses `preview: true` (keeps today's preview link, minus indexing and
    feeds) or nothing (hidden until its date).
- Update `docs/MIGRATIONS.md` "Adding a new writing post" (it still describes `content/<slug>.md`
  and a `description` field) with the three states.
- Replace `app/__tests__/writingPublication.spec.ts`, which pins today's behaviour and asserts that no
  `draft:` key exists.

### 4.2 One helper, used by every surface

New `utils/publication.ts`:

```ts
export type PublicationState = "draft" | "scheduled" | "published";

export const publicationState = (post: PostSummary, now: Date): PublicationState;
export const isPublished = (post: PostSummary, now: Date): boolean; // state === "published"
export const isPreviewable = (post: PostSummary, now: Date): boolean; // scheduled && preview
```

`isPostPublished(date, now)` in `utils/date.ts` stays as the date rule underneath. `getAllPosts()`
becomes module-private (or is renamed `readAllPostFiles()`). Routes import only
`getPublishedPosts(now)` and `getRoutablePosts()` (published + scheduled, never drafts). An ESLint
`no-restricted-imports` rule (or a test) stops `app/**` and `features/**` from importing the raw
list.

| Surface                                       | Rule after the change                                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Home (`app/page.tsx`)                         | `isPublished`                                                                                                          |
| `/writing` list, hero count, featured         | `isPublished`; plus `isPreviewable` rows as "Upcoming" if D2 keeps them                                                |
| CollectionPage JSON-LD                        | `isPublished`                                                                                                          |
| `generateStaticParams` (article and OG image) | `getRoutablePosts()`: published **and** scheduled, never drafts                                                        |
| `dynamicParams` (article and OG image)        | `export const dynamicParams = false` (see 4.6)                                                                         |
| Article render                                | published → normal; previewable → render with noindex and no `ArticleJsonLd`; scheduled without preview → `notFound()` |
| `generateMetadata`                            | same three cases; previewable → `robots: { index: false, follow: true }`, no `publishedTime`                           |
| OG image                                      | `notFound()` unless published or previewable (today an unknown slug gets a generic 200 card)                           |
| "More writing"                                | `isPublished`                                                                                                          |
| Sitemap, feed, `llms.txt`, `llms-full.txt`    | `isPublished`                                                                                                          |
| `ArticleJsonLd`                               | rendered only when `isPublished`                                                                                       |
| In-body links                                 | test: no published post links to `/writing/<slug>` of a non-published post                                             |

Scheduled posts are in `generateStaticParams` on purpose. The route then exists in the build (as a
prerendered 404) and a revalidation can turn it into a 200 on its date even with
`dynamicParams = false` (spike 1 and 2 below). Drafts are not, so they 404 with nothing cached.

### 4.3 Making the date boundary public without an unplanned deploy

Two local spikes on a throwaway copy of `6ec24ef` (reverted, not in any branch) read "now" from a file
so the boundary could be moved:

- **Spike 1, time-based ISR.** Article page with `revalidate = 10`, `dynamicParams = false`, all posts
  in `generateStaticParams`, `notFound()` when unpublished; feed filtered with `revalidate = 10`.
  - Before the boundary: article `404`, `Cache-Control: s-maxage=10, stale-while-revalidate=31535990`,
    feed without the post.
  - After moving "now" past the boundary and waiting 11 s, the **first** request still returned the
    stale `404` (`x-nextjs-cache: STALE`) and the feed still lacked the post. The second request
    returned `200` (`HIT`), and the feed listed it.
- **Spike 2, on-demand `revalidatePath`.** Same gate, no `revalidate`, plus a route handler calling
  `revalidatePath("/writing/[slug]", "page")` and `revalidatePath("/feed.xml")`.
  - Moving "now" alone changed nothing (still `404 HIT`): without revalidation the post stays hidden
    until the next deploy.
  - After calling the handler, the **first** request returned `200` (`x-nextjs-cache: MISS`) and the
    feed listed the post. The regeneration blocked instead of serving stale content.
  - The built `feed.xml.meta` carries the cache tag `_N_T_/layout`, so a single
    `revalidatePath("/", "layout")` should cover pages and route handlers alike. Confirm on a Vercel
    preview.

|                               | A. ISR `revalidate = N` on affected routes                                                                                                                   | B. Vercel cron → `revalidatePath`                                                                                                                                                                                                                             | C. Daily rebuild via deploy hook                                                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How                           | `export const revalidate = N` on article, OG, feed, sitemap, llms, llms-full (and `/`, `/writing` made static with the same N)                               | `vercel.json` cron hits `app/api/cron/publish` (checks `Authorization: Bearer $CRON_SECRET`), which calls `revalidatePath("/", "layout")`                                                                                                                     | Scheduled job (for example a GitHub Actions `schedule`) POSTs a Vercel Deploy Hook URL kept as a secret                                                                                  |
| Staleness after 00:00 Toronto | Up to N, **plus one stale response** per route (spike 1). Routes flip independently, so for a while home can link to an article still served as a cached 404 | Cron delay only. All paths are invalidated together and the next request regenerates (spike 2). Vercel cron schedules are in UTC; on the Hobby plan crons run at most daily and may fire anywhere within the scheduled hour (check the plan's current limits) | Scheduler delay (GitHub `schedule` runs are often several minutes late and can be skipped under load) plus build time (the local build takes about 80 s; Vercel adds install and upload) |
| Cost                          | ≤ 86 400 / N regenerations per route per day, only when the route is requested. N = 3600 and ~36 routes: ≤ ~870 small renders a day in the worst case        | 1 function call a day. The handler can return early unless some post's date is today, so most days cost nothing beyond that call                                                                                                                              | 1 full production build and deploy a day (~365 a year) whether or not anything changed                                                                                                   |
| New config / secrets          | None                                                                                                                                                         | `vercel.json` (human review per `AGENTS.md`) and a `CRON_SECRET` env var (owner)                                                                                                                                                                              | Deploy hook URL as a repository secret and a workflow file (owned by the CI track)                                                                                                       |
| Failure mode                  | Self-healing; worst case is a stale first response                                                                                                           | A failed or missed cron leaves the post hidden until the next run or deploy. A long ISR safety net (`revalidate = 86400`) bounds it to a day                                                                                                                  | A red `main` or a flaky install means the post is not published; every run also ships whatever is on `main` at that moment, which is close to an unplanned deploy                        |
| Side effects                  | `/` and `/writing` become static (cheaper than today's per-request functions)                                                                                | Same, `/` and `/writing` become static and flip only with the cron                                                                                                                                                                                            | Keeps the build fully static; simplest for `dynamicParams = false`                                                                                                                       |

**Recommendation: B, with A as a one-day safety net.**

- One clock tick per day invalidates every surface at once, so home, `/writing`, the article, the OG
  image, the feed, the sitemap and the llms files agree, with no stale first response.
- `/` and `/writing` drop `force-dynamic` and are revalidated by the same tick. Today they have their
  own request clock, so they would otherwise flip up to an hour before the article exists.
- Schedule: `5 5 * * *` UTC, which is 00:05 in winter (EST) and 01:05 in summer (EDT), after
  Toronto midnight all year. The handler revalidates only when some post's date equals today in
  Toronto.
- `export const revalidate = 86400` on the same routes bounds a missed cron to one day.
- If the owner does not want a cron or a new secret, use **A with N = 3600** and accept up to an hour
  plus one stale response. **C** is the least attractive: daily deploys of unreviewed `main` and
  build risk on the publishing path.

### 4.4 Time zone rule

Keep **America/Toronto** (`SITE_TIME_ZONE`). A date-only post becomes public at 00:00 Toronto on that
date. Using UTC instead would publish at 20:00 (EDT) or 19:00 (EST) the evening before, while
`formatDate` already displays dates in Toronto. Consequences to implement:

- The feed `pubDate` is the instant of Toronto midnight (`Wed, 28 Oct 2026 04:00:00 GMT`, not
  `00:00:00 GMT`). Use a helper `publicationInstant(date)` shared with `isPostPublished`.
- `lastBuildDate` is the newest **published** post's instant (or the render time), never a future
  value.
- JSON-LD `datePublished` and `article:published_time` can stay date-only or carry the Toronto
  offset (`2026-10-28T00:00:00-04:00`); they are only emitted when published.
- The cron schedule accounts for DST (see 4.3).

### 4.5 Tests to add

- `utils/__tests__/publication.spec.ts`: the state matrix (draft, scheduled, scheduled + preview,
  published) at `2026-10-28T03:59:59Z` and `04:00:00Z`; a winter boundary (`05:00Z`); both 2026 DST
  change days (2026-11-01 and 2027-03-14); invalid dates and `draft` + `preview` throw.
- Frontmatter validation over every file in `content/posts/`.
- A rewrite of `app/__tests__/writingPublication.spec.ts` that sets the clock before and after the
  boundary and asserts each surface in the 4.2 table: article and OG `generateStaticParams`, sitemap,
  feed, `llms.txt`, `llms-full.txt`, home, `/writing` list and JSON-LD, "More writing",
  `ArticleJsonLd`, `generateMetadata` robots for preview, and `notFound()` for hidden posts. Fixture
  posts in a temporary directory, so the tests do not depend on the real calendar.
- `utils/__tests__/feed.spec.ts`: `pubDate` is Toronto midnight; no future `lastBuildDate`.
- Content link test: no published post links to a non-published slug.
- Cron route test: `401` without the bearer secret, no revalidation when no post's date is today,
  `revalidatePath("/", "layout")` when one is.
- Build check (e2e or a script against `.next`): `/writing/[slug]` and its OG route have
  `fallback: false` in `prerender-manifest.json`; an unknown slug returns 404 with `no-store` and
  leaves no file under `.next/server/route-cache`.

### 4.6 Interaction with V233-5 (unknown slugs cached per URL)

Reproduced on `6ec24ef`:

- `GET /writing/zz-probe-unknown-1` → `404`, `Cache-Control: s-maxage=31536000`,
  `x-nextjs-cache: MISS`, then `HIT` on the second request.
- `.next/server/route-cache/APP_PAGE/…/writing/zz-probe-unknown-1.{html,rsc,meta,segments}` were
  written to disk. Every distinct invented slug adds a cache entry.
- `GET /writing/zz-probe-unknown-1/opengraph-image` → `200` with a generic "Writing" card, also
  cached.

With `dynamicParams = false` (spike 1), an unknown slug returned `404` with
`private, no-cache, no-store` and no cache file was written. That fixes V233-5, but it fixes the param
list at build time. So the plan must:

- put scheduled posts in `generateStaticParams` (prerendered as 404, flipped by revalidation as shown
  in the spikes), not leave them to on-demand rendering;
- set `dynamicParams = false` on **both** `/writing/[slug]` and `/writing/[slug]/opengraph-image`, and
  make the OG route `notFound()` for unknown or hidden slugs instead of drawing a generic card;
- never use option A or B without `dynamicParams = false`. Otherwise a scheduled slug requested before
  its date is cached as a 404 per URL, which is the V233-5 behaviour applied to a real post.

## 5. Owner decisions

| ID  | Decision                                                                       | Recommendation                                                                              |
| --- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| D1  | Adopt `draft` / `scheduled` / `published` with an explicit `preview` flag      | Yes                                                                                         |
| D2  | Keep "Upcoming · Preview article" rows on `/writing` for `preview: true` posts | Optional; they stay `noindex` either way                                                    |
| D3  | Boundary mechanism                                                             | B (cron + `revalidatePath`) with a one-day ISR safety net; A if no cron or secret is wanted |
| D4  | Time zone                                                                      | America/Toronto midnight                                                                    |
| D5  | Make `/` and `/writing` static (drop `force-dynamic`)                          | Yes, with D3                                                                                |
| D6  | The 2026-10-28 post, if the implementation lands before its date               | `preview: true` to keep today's preview link, or nothing to hide it                         |
