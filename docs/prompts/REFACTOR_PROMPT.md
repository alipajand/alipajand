# Refactor Prompt

Use this prompt when refactoring a component, feature, or utility in the portfolio site.

---

## Prompt

You are refactoring code in the **alipajand.com** portfolio site (Next.js 15 App Router, TypeScript, Tailwind CSS).

Read `docs/ARCHITECTURE.md` and `AGENTS.md` before starting.

### Target

File(s) to refactor: `[FILE_PATH]`

Reason for refactor: `[DESCRIBE THE PROBLEM — e.g. "component is too large", "logic duplicated across features", "hook has side effects in wrong layer"]`

### Rules

- **Preserve all public behavior** — no visible regressions allowed.
- **Do not change public slugs or URLs** without explicit approval.
- **Keep content in `data/`** — do not move copy into component JSX.
- **Prefer Server Components** — only add `"use client"` where truly needed.
- **Colocate tests** — update or add `__tests__/` test files alongside the refactored code.
- **No new dependencies** unless they clearly outperform existing utilities.

### Validation steps

1. `pnpm typecheck` — must pass with no errors.
2. `pnpm test` — all tests must pass.
3. `pnpm lint` — no lint errors.
4. `pnpm build` — production build must succeed.

### Output

Report:

1. What changed and why
2. Files modified
3. Commands run and results
4. Any known limitations or follow-up work needed
