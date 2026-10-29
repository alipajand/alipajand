# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

## Unredacted screenshots outside the repository

Decided: no history rewrite. Commits keep the owner's own address, by the owner's decision. Every
tracked file and embedded image is checked against the known exposed images
(`app/__tests__/trackedImages.spec.ts`). What remains needs the owner, outside the repository. These
lists were last checked on 2026-10-28.

- **Vercel deployments.** 70 deployments of the `alipajand` project still exist behind Vercel
  sign-in, and each was built from a commit whose `public/portfolio-media/` holds the original
  `ledgerguard-dashboard.png` and `mapbylaw-dashboard.png`. They are production deployments from
  2026-09-24 to 2026-10-27, from `6584d6c` to `bad0efe`: 66 ready builds and 4 failed builds. The
  exact URLs are in the PR that added this list. Delete them, or confirm that sign-in protection
  is enough. The list comes from GitHub's deployment records, so a deployment Vercel made without
  one (for example a CLI deploy) is not on it; the project's deployment list in Vercel is the
  final check.
- **Published design previews.** Each one serves an exposed image byte for byte:
  - The MapBylaw page preview linked from `docs/design/README.md`: the unredacted MapBylaw kit
    dashboard.
  - The three concept previews linked from #214. Each ships
    `shared/media/{ledgerguard,mapbylaw}-dashboard-{640,1280}.webp`.

  Republish them from the current pages, or delete them. The other 16 previews linked from
  `docs/design/README.md`, the design system included, embed none of the known images. The check
  is byte for byte, so a re-encoded copy would not show up.

  The TallyFolio page preview linked from `docs/design/README.md` was built from a page that
  embedded the TallyFolio dashboard (`docs/design/kit/img/tallyfolio-dashboard.jpg`) until the
  dashboard was removed. Its figures are not shown to be fictional. Republish it from the current
  page, or delete it.

- Whether to change the product sign-in emails and the workspace name that the originals show. The
  login email is already in every commit header that used it, so renaming the workspace does more.

## Branch protection

The `main` ruleset (id 15352584) requires `Lint, typecheck, test, build` and
`Playwright e2e (Chromium, Linux)` but not up-to-date branches
(`strict_required_status_checks_policy: false`). #285 merged on checks from a base without #272 and
turned `main` red until #290.

- **Recommended:** turn on "Require branches to be up to date before merging" in the `main`
  ruleset (Settings → Rules → Rulesets → main → Require status checks to pass). Through the API,
  this changes that one field and leaves every other rule as it is:

  ```bash
  gh api repos/alipajand/alipajand/rulesets/15352584 \
    | jq '{name, target, enforcement, conditions, bypass_actors, rules: (.rules | map(if .type == "required_status_checks" then .parameters.strict_required_status_checks_policy = true else . end))}' \
    | gh api -X PUT repos/alipajand/alipajand/rulesets/15352584 --input -
  ```

- **Alternative:** keep it as is and re-run checks by hand before merging.

## Technical follow-ups (no decision needed)

- WebKit axe is flaky in CI and still has no root cause. Its contexts are created by hand in
  `e2e/a11y.e2e.ts`, outside the configured `trace` option, so no failure has left a trace. #329
  keeps one in `test-results/` for each failed WebKit scan. Read the next one before changing the
  test.
  - `AxeBuilder.analyze()` hangs until the 30 s test timeout, always on the Agent Readiness Doctor
    post at 390 px (runs 40606433458, 40739305931, 40746303667 and 40756047367; the last failed
    both attempts). It did not reproduce in 20 local runs (macOS WebKit, about 2 s each).
  - Unexpected `color-contrast` violations, each on an element that scroll-linked motion restyles
    after load. One is the active chapter-rail link, `a[href$="#context"]`, on case-alwaysgeeky
    and case-mapbylaw at 390 px and case-emplifi at 1440 px (runs 40739305931, 40747535192 and
    40750031006). The other is the lit FlowBand step, `li[data-on]`, on the code-review post at
    1440 px (runs 40731926603 and 40738782905).
