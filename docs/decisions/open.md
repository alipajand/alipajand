# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

## Writing publication

Every route that lists or serves posts re-renders hourly (`revalidate = 3600`), so a scheduled post
goes live within about an hour of its date without a deploy.

| ID  | Question                     | Recommended                                                                               | Alternative                                                   |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| D5  | `/` and `/writing` rendering | Static with hourly ISR, so every surface agrees; confirm, or ask for `force-dynamic` back | Keep `force-dynamic` lists, which then disagree with articles |

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

- WebKit axe on the Agent Readiness Doctor post at 390 px is flaky in CI. In run 40606433458,
  `AxeBuilder.analyze()` hung until the 30 s test timeout and passed on retry in 5 s. It did not
  reproduce in 20 local runs (macOS WebKit, about 2 s each). Capture a trace from the next CI
  failure before changing the test.
