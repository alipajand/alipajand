# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

## Writing publication

Publication states (draft, scheduled, published, opt-in `preview: true`) are implemented in
`utils/publication.ts` and decided at build time, so today a scheduled post goes live with the first
deployment on or after its date. What remains is how it goes live without a deploy.

| ID  | Question                                            | Recommended                                                                              | Alternatives                                                    |
| --- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| D3  | What makes the date take effect without a deploy    | Vercel cron → `revalidatePath("/", "layout")`, with `revalidate = 86400` as a safety net | Time-based ISR (`revalidate = 3600`); or publish only on deploy |
| D5  | `/` and `/writing` rendering                        | Already static, so every surface agrees; confirm, or ask for `force-dynamic` back        | Keep `force-dynamic` lists, which then disagree with articles   |
| P2  | Vercel plan and cron precision                      | Confirm the plan; Hobby's `5 5 * * *` (up to about 2 h late in summer) is acceptable     | Pro with minute precision                                       |
| P3  | Who creates `CRON_SECRET` and reviews `vercel.json` | The owner, before the cron PR merges; a missing secret answers 401                       | Not applicable if D3 is not the cron                            |

## Unredacted screenshots in git history

Decided: no history rewrite. Commits keep the owner's own address, by the owner's decision. Every
tracked file and embedded image is checked against the known exposed images
(`app/__tests__/trackedImages.spec.ts`). What remains needs the owner, outside the repository:

- Whether to change the product sign-in emails and the workspace name that the originals show. The
  login email is already in every commit header that used it, so renaming the workspace does more.
- Whether to delete the old Vercel deployments that still serve the original images (about 70,
  behind Vercel sign-in).
- The MapBylaw design preview linked from `docs/design/README.md` still embeds the unredacted kit
  dashboard (checked 2026-10-28; the LedgerGuard preview is clean). The previews linked from #214
  (concepts A, B and C) were not checked. Republish them from the current pages, or delete them.

## Content and copy

- Confirm the TallyFolio dashboard screenshot shows sample data. It is labelled "Sample data", but
  the credit cards in it carry real bank product names, which the image alone cannot settle.

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
