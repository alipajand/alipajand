# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

## Unredacted screenshots outside the repository

Decided: no history rewrite. Commits keep the owner's own address, by the owner's decision. Every
tracked file and embedded image is checked against the known exposed images
(`app/__tests__/trackedImages.spec.ts`). What remains needs the owner, outside the repository. These
lists were last checked on 2026-10-28, the deployments against Vercel's own deployment list.

- **Vercel deployments.** 76 deployments of the `alipajand` project were built from a commit whose
  `public/portfolio-media/` holds the original `ledgerguard-dashboard.png` and
  `mapbylaw-dashboard.png`. All are production builds of `main` from 2026-09-24 to 2026-10-27,
  from `6584d6c` to `bad0efe`, and all redirect to Vercel sign-in. The exact URLs are in the PR
  that added this list.
  - **70 ready.** These serve the images. Delete them, or confirm that sign-in protection is
    enough.
  - **5 failed** (`28cfcd1`, `5bd4983`, `6928659`, and `4706742` twice) **and 1 canceled**
    (`d278ef2`). A failed or canceled build should have no output to serve, so deleting these is
    cleanup.
  - **Production aliases are not on the list.** `alipajand.com`, `alipajand-pajand.vercel.app` and
    `alipajand-git-main-pajand.vercel.app` point to `alipajand-cc2kjhdnk` (`794d4b1`), which has
    neither image. None of the 76 holds an alias.
- **Published design previews.** Each one serves an exposed image byte for byte:
  - The MapBylaw page preview linked from `docs/design/README.md`: the unredacted MapBylaw kit
    dashboard.
  - The three concept previews linked from #214. Each ships
    `shared/media/{ledgerguard,mapbylaw}-dashboard-{640,1280}.webp`.

  Republish them from the current pages, or delete them. The other 16 previews linked from
  `docs/design/README.md`, the design system included, embed none of the known images. The check
  is byte for byte, so a re-encoded copy would not show up.

- Whether to change the product sign-in emails and the workspace name that the originals show. The
  login email is already in every commit header that used it, so renaming the workspace does more.

Owner checklist, in order:

1. In Vercel, open `alipajand` → Domains and confirm the three aliases above point to a deployment
   built after `bad0efe`. If one points into the list, promote a current build first.
2. Delete the 70 ready deployments by their deployment URL, never by alias or domain. Deleting them
   also removes them as instant-rollback targets, which is intended.
3. Optionally delete the 5 failed and 1 canceled deployments.
4. Re-check Domains: `alipajand.com` still serves the current production deployment, and
   `https://alipajand.com/portfolio-media/ledgerguard-dashboard.png` still returns 404.
5. Republish or delete each design preview listed above, from its current page.
6. Say so in a PR that removes the finished items from this list.

## Content and copy

- **TallyFolio dashboard screenshot (`public/portfolio-media/tallyfolio-dashboard.png`).** It is
  labelled "Sample data" in `data/projects.ts`, but nothing in the repository shows that its
  figures are fictional. It shows exact cents (income $3,580.66, net cash flow -$1,375.20) and
  named credit cards with balances (Neo World Elite Mastercard, Scotia Momentum Visa Infinite). No
  fixture or seed in this repository produced it.
  - **Recommended:** confirm it shows a seeded demo workspace, and say where that seed lives.
  - **If not confirmed:** the smallest safe change is to remove the dashboard from the TallyFolio
    case study and keep `tallyfolio-landing.png`, whose panel is the product's own "Sample
    workspace" marketing mock. A new capture from a seeded workspace can replace it later.

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

Checked on 2026-10-28: the ruleset is unchanged, and both required contexts still run on `main`.
`Lint, typecheck, test, build` comes from `ci.yml`. `Playwright e2e (Chromium, Linux)` is the
aggregate job in `e2e.yml` that requires both shards. Both come from GitHub Actions (app 15368),
which the ruleset names. A dry run of the command above changes only that one field.

## Technical follow-ups (no decision needed)

- WebKit axe is flaky in CI and still has no root cause. Its contexts are created by hand in
  `e2e/a11y.e2e.ts`, outside the configured `trace` option, so no failure has left a trace. #329
  keeps one in `test-results/` for each failed WebKit scan. Read the next one before changing the
  test. As of 2026-10-28 there is none to read. No e2e run since #329 merged has failed a test (the
  two failed runs stopped at the Playwright image version check), and none reported a flaky
  retry. The report is uploaded only when a job fails, so a scan that fails and then passes on
  retry leaves no trace either.
  - `AxeBuilder.analyze()` hangs until the 30 s test timeout, always on the Agent Readiness Doctor
    post at 390 px (runs 40606433458, 40739305931, 40746303667 and 40756047367; the last failed
    both attempts). It did not reproduce in 20 local runs (macOS WebKit, about 2 s each).
  - Unexpected `color-contrast` violations, each on an element that scroll-linked motion restyles
    after load. One is the active chapter-rail link, `a[href$="#context"]`, on case-alwaysgeeky
    and case-mapbylaw at 390 px and case-emplifi at 1440 px (runs 40739305931, 40747535192 and
    40750031006). The other is the lit FlowBand step, `li[data-on]`, on the code-review post at
    1440 px (runs 40731926603 and 40738782905).
