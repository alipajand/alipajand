# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

## Writing publication

Recommended policy: **Draft** is never served. **Scheduled** stays hidden until 00:00
America/Toronto on its `date`. **Published** appears on every surface: article, OG image, home,
`/writing`, "More writing", sitemap, RSS, `llms.txt` and `llms-full.txt`. **Public preview** is opt-in
with `preview: true`: the article and its OG image only, `noindex`, and left out of every list and
export. The repository is public, so anything committed under `content/posts/` can be read on GitHub
whatever the site does.

| ID  | Question                                            | Recommended                                                                               | Alternatives                                                                               |
| --- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| D1  | Publication states                                  | `draft` / `scheduled` / `published` plus opt-in preview, checked at build                 | The three states without preview; or keep today (every committed post is public at deploy) |
| D2  | List previews on `/writing`?                        | No, a preview is reachable only by its URL                                                | Keep the "Upcoming · Preview article" row for previews                                     |
| D3  | What makes the date take effect without a deploy    | Vercel cron → `revalidatePath("/", "layout")`, with `revalidate = 86400` as a safety net  | Time-based ISR (`revalidate = 3600`); or publish only on deploy                            |
| D4  | Which calendar decides the day                      | America/Toronto, with one `publicationInstant(date)` shared by feed, metadata and JSON-LD | UTC                                                                                        |
| D5  | `/` and `/writing` rendering                        | Static, refreshed by D3, once D3 is proven on a preview deployment                        | Keep `force-dynamic`                                                                       |
| P1  | Where drafts live                                   | Outside this repository until they are ready to schedule                                  | `content/posts/` with `draft: true`, accepting that GitHub shows them                      |
| P2  | Vercel plan and cron precision                      | Confirm the plan; Hobby's `5 5 * * *` (up to about 2 h late in summer) is acceptable      | Pro with minute precision                                                                  |
| P3  | Who creates `CRON_SECRET` and reviews `vercel.json` | The owner, before the cron PR merges; a missing secret answers 401                        | Not applicable if D3 is not the cron                                                       |
| P4  | May a published page link to an unpublished post?   | No: a test scans post Markdown and `data/**` hrefs at the real `now`                      | Yes, accepting a 404 until the date                                                        |
| P5  | `datePublished` format                              | The Toronto-midnight instant with offset, the same instant as the feed `pubDate`          | Date only, as today                                                                        |
| P6  | Optional `updated:` frontmatter                     | Yes, for `dateModified`, `article:modified_time` and sitemap `lastmod`                    | No, `dateModified` always equals `datePublished`                                           |

Related defect, independent of the policy: an unknown `/writing/<slug>` answers 404 with a one-year
`s-maxage` and writes a cache entry. `dynamicParams = false` on the post route should come first.

## /now ruler

Today the ruler follows the visitor's clock (week 43 in late October) while the content is dated
May 8, and it jumps from 52 back to 43 at each visitor's New Year. The no-JS ruler uses the build
date.

| ID  | Question            | Recommended                                                                                                          | Alternative                               |
| --- | ------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| R1  | Primary marker      | Mark `NOW_UPDATED` (step 19 for 2026-05-08), labelled "As of May 8, 2026", the same on server, no-JS and every clock | Keep today's behaviour                    |
| R2  | "Today" marker      | Optional: dashed line with an outlined label, client only, only in `NOW_YEAR` and on or after `NOW_UPDATED`          | None, the ruler shows only the as-of date |
| R3  | Intro wording       | Keep "Updated May 8, 2026"                                                                                           | "Content as of May 8, 2026"               |
| R4  | `NOW_UPDATED` value | Keep 2026-05-08, the last content edit. No review is recorded; change it only after a real review                    | Set the date of a review                  |

## Contribution numbers on /open-source

About 94% of the shipped calendar total is private work. Measured for the full days 2025-10-26 to
2026-10-26: 16,462 contributions, of which 910 are public.

- **A (recommended):** public contributions only: 910 contributions, 82 active days.
- **B:** keep the total, labelled "including private" everywhere it appears, with the public split
  next to it.

Either way: count full days only, and record the data source and the time the snapshot was taken.
GitHub's API buckets commits by US Pacific day, so the per-day numbers cannot be shifted to Toronto
exactly.

## Unredacted screenshots in git history

The redacted dashboards replaced the originals in the tree, and a test keeps the originals out.
They are still reachable in git history and old PR refs.

- **Recommended:** accept what remains in history (no rewrite). Switch future commits to the GitHub
  noreply address.
- **Also to decide:** whether to change the exposed product sign-in emails and the workspace name;
  whether to delete old Vercel deployments that still serve the original images.
- **Alternative:** a one-off history rewrite plus a GitHub Support purge. This changes every SHA,
  breaks open PRs and clones, and cannot reach copies that already exist elsewhere.

## Content and copy

- `README.md` still states an "80% cut in unnecessary re-renders" figure that the site no longer
  shows. Remove it or source it.
- Wording to confirm: "9+ years in … Next.js", "Lead Frontend Engineer" in keywords and
  `knowsAbout`, "staff-level", "across teams".
- Screenshots: confirm the TallyFolio dashboard shows sample data. Fix the MapBylaw landing alt text
  and caption, which do not match the image.
- `components/Testimonials` and `data/testimonials.ts` are not rendered anywhere: delete both, or
  keep the data and drop the component.
- Nothing links to `/now`: add a link, or leave it unlinked on purpose.
- Contact 429 message: include a direct address or not.
- Case studies: breadcrumb label "Case studies" vs the design's "Portfolio", and whether live links
  open in a new tab.

## Technical follow-ups (no decision needed)

- Webhook route: cap the body size before verifying the signature (413 above the cap).
- Post HTML sanitiser: allow `https:` image sources only.
- `app/api/contact/route.ts` logs the provider's `error.message`.
- One `escapeHtml` helper for the contact and webhook routes.
- Sitemap `lastmod` comes from the build clock for 12 routes.
- `utils/scrollToTop.ts`: `SCROLL_TARGET_OFFSET` and `scrollToElement` are used only by the spec.
- `@asamuzakjp/css-color` is a direct devDependency that nothing imports.
