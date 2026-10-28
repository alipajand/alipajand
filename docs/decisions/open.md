# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

## Writing publication

Publication states (draft, scheduled, published, opt-in `preview: true`) are implemented in
`utils/publication.ts` and decided at build time, so today a scheduled post goes live with the first
deployment on or after its date. What remains is how it goes live without a deploy.

| ID  | Question                                            | Recommended                                                                                 | Alternatives                                                                     |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| D3  | What makes the date take effect without a deploy    | Time-based ISR: `revalidate = 3600` on `/`, `/writing`, `/writing/[slug]` and the sitemap   | Vercel cron → `revalidatePath`, once a preview deployment shows it works; deploy |
| D5  | `/` and `/writing` rendering                        | Already static, so every surface agrees; confirm, or ask for `force-dynamic` back           | Keep `force-dynamic` lists, which then disagree with articles                    |
| P2  | Vercel plan and cron precision                      | Not needed for ISR. For the cron: confirm the plan; Hobby's daily window can run ~2 h late  | Pro with minute precision                                                        |
| P3  | Who creates `CRON_SECRET` and reviews `vercel.json` | Not needed for ISR. For the cron: the owner, before it merges; a missing secret answers 401 | —                                                                                |

### Evidence for D3 (local `next start`, Next 16.4.3, 2026-10-28)

A scratch post dated 2026-11-05 was built with the clock at 04:55Z (23:55 in Toronto, the day
before) and served from 04:59:30Z, so midnight in Toronto passed while the server ran. Nothing was
committed. The pinned clock ran ahead of the real time on purpose: a first run with the clock behind
the real time gave the same result, but its cache files were newer than the clock, which made that
run inconclusive.

| Setup                                                    | Before midnight | First request after | Second request after |
| -------------------------------------------------------- | --------------- | ------------------- | -------------------- |
| Today (no `revalidate`)                                  | 404, one year   | 404                 | 404                  |
| `revalidate = 30`                                        | 404             | 404, `STALE`        | 200 on every surface |
| `revalidate = 86400` + route calling `revalidatePath(…)` | 404             | 404 after the call  | 404                  |

- ISR works: the first visit after expiry gets the old page and starts a regeneration; the next
  visit gets the published one. Each route regenerates on its own visit, so for up to an hour after
  midnight a surface nobody has visited can still show the old state.
- `revalidatePath("/", "layout")` and `revalidatePath("/writing/<slug>")` from a route handler did
  not invalidate anything under `next start`. The Next.js docs say it should, and Vercel's cache is
  not `next start`'s, so this is not evidence about production. It means the cron option needs a
  preview-deployment test before anyone relies on it.
- Deploy-only publication already works: every deployment starts with a fresh cache, and the
  scheduled slug is a prerendered 404 that the next build turns into a page.
- With ISR, the cost is about one regeneration per route per hour of traffic (four list routes and
  each visited article). The Vercel plan and its ISR limits could not be read from here.

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
