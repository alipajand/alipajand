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

## Unredacted screenshots in git history

Decided: no history rewrite; future commits use the GitHub noreply address. Every tracked file and
embedded image is checked against the known exposed images (`app/__tests__/trackedImages.spec.ts`).
What remains needs the owner, outside the repository:

- Whether to change the product sign-in emails and the workspace name that the originals show. The
  login email is already in every commit header that used it, so renaming the workspace does more.
- Whether to delete the old Vercel deployments that still serve the original images (about 70,
  behind Vercel sign-in).
- The MapBylaw design preview linked from `docs/design/README.md` still embeds the unredacted kit
  dashboard (checked 2026-10-28; the LedgerGuard preview is clean). The previews linked from #214
  (concepts A, B and C) were not checked. Republish them from the current pages, or delete them.

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

## Branch protection

The `main` ruleset does not require branches to be up to date before merging. #285 merged on
checks from a base without #272 and turned `main` red until #290.

- **Recommended:** require up-to-date branches, or use a merge queue.
- **Alternative:** keep it as is and re-run checks by hand before merging.

## Technical follow-ups (no decision needed)

- WebKit axe on the Agent Readiness Doctor post at 390 px is flaky in CI.

- Post HTML sanitiser: allow `https:` image sources only.
- Webhook route: cap the body size before verifying the signature (413 above the cap).
- `app/api/contact/route.ts` logs the provider's `error.message`.
- One `escapeHtml` helper for the contact and webhook routes.
- Sitemap `lastmod` comes from the build clock for 12 routes.
- `utils/scrollToTop.ts`: `SCROLL_TARGET_OFFSET` and `scrollToElement` are used only by the spec.
- `@asamuzakjp/css-color` is a direct devDependency that nothing imports.
