# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

No open owner decisions or pending privacy-cleanup actions remain.

Privacy cleanup of the original LedgerGuard, MapBylaw and TallyFolio screenshots, completed on
2026-10-31:

- **Historical Vercel deployments.** The owner removed the 62 production deployments that served
  the original `/portfolio-media/ledgerguard-dashboard.png` and
  `/portfolio-media/mapbylaw-dashboard.png` (Vercel CLI 65.9.0, team `pajand`). Authenticated
  read-back: none of the 62 IDs is in the project's deployment list, direct lookups return 404
  `not_found`, and every old URL returns 404 `DEPLOYMENT_NOT_FOUND` for both screenshot paths, not
  a redirect to sign-in. Vercel can restore a deleted deployment for 30 days; none is active.
- **Production.** `alipajand.com`, `alipajand-pajand.vercel.app` and
  `alipajand-git-main-pajand.vercel.app` point to `dpl_BHvRX3ews7yx8KtxDU9jrgHH5Wo2` (`f86bf39`).
  `/portfolio` returns 200 and both original screenshot paths return 404.
- **MapBylaw and TallyFolio design previews.** The records holding versions 1–5
  (`Ez5bX39cieti12y95JwNP9`, `PJzBMyJ9vQJ9u9Wpk4jiw9`) were deleted with their history and
  replaced by sanitized previews at new URLs (see `docs/design/README.md`).
- **Concept previews from #214.** All three were deleted with their version history.
- **Branch protection.** Ruleset 15352584 has `strict_required_status_checks_policy: true`, with
  both required checks unchanged.
- **Unchanged.** No sign-in identities were changed, and Git history was not rewritten.
