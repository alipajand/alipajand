# Feature Implementation Prompt

Use this prompt when implementing a new feature, section, or page on the portfolio site.

---

## Prompt

You are implementing a new feature on the **alipajand.com** portfolio site (Next.js 15 App Router, TypeScript, Tailwind CSS, Jest + @testing-library/react).

Read `docs/ARCHITECTURE.md`, `docs/ROUTES.md`, and `AGENTS.md` before starting.

### Feature description

Name: `[FEATURE_NAME]`
Location: `[ROUTE_OR_COMPONENT_PATH]`
Description: `[WHAT IT DOES AND WHY]`

### Requirements

- [ ] Define feature content in `data/` (not hardcoded in JSX)
- [ ] Place page-level logic under `features/[feature-name]/`
- [ ] Place shared UI in `components/` if reusable across pages
- [ ] Default to React Server Components; use `"use client"` only for hooks/interactivity
- [ ] Write at least one Jest test under `__tests__/` alongside the component
- [ ] Run `pnpm typecheck` and `pnpm test` before finishing

### If adding a new route

- Add to `docs/ROUTES.md`
- Add to `app/sitemap.ts` if it should be indexed

### Validation steps

1. `pnpm typecheck` — passes
2. `pnpm test` — passes
3. `pnpm build` — production build succeeds
4. `pnpm lint` — no errors

### Output

Report:

1. Summary of what was built
2. Files created or modified
3. Commands run and results
4. Known limitations or follow-ups
