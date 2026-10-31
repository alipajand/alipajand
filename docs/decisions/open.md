# Open decisions

Owner decisions that block work. Each item has the recommended answer first. When an item is
decided, delete it here and record the outcome in the implementing PR; the code and its tests are
the lasting record. The longer analysis behind these items is in the history of `docs/decisions/`
and `docs/audits/` before this file replaced them.

No owner decisions are open. The privacy cleanup of the original LedgerGuard, MapBylaw and
TallyFolio screenshots is finished.

Done and verified on 2026-10-31:

- **MapBylaw and TallyFolio design previews.** Their versions 1–5 held the unredacted MapBylaw
  dashboard and the unverified TallyFolio dashboard. Both records (`Ez5bX39cieti12y95JwNP9`,
  `PJzBMyJ9vQJ9u9Wpk4jiw9`) were deleted, which removes every version, and they no longer appear
  in the account's artifact list. New previews at new URLs replace them (see
  `docs/design/README.md`), and the 12 previews that linked to them were republished.
- **Concept previews from #214.** All three were deleted with their version history.
- **Old Vercel deployments.** The 62 production deployments that served the original
  `/portfolio-media/ledgerguard-dashboard.png` and `/portfolio-media/mapbylaw-dashboard.png` are
  deleted. None is in the project's deployment list, and each URL returns 404
  `DEPLOYMENT_NOT_FOUND`. Production still serves 200 on `/` and `/portfolio`, and both original
  paths return 404.
- **Branch protection.** Ruleset 15352584 has `strict_required_status_checks_policy: true`; no
  other field changed.
