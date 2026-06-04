# QA Audit Prompt

Use this prompt to perform a QA pass on a component, feature, or the full site before shipping.

---

## Prompt

You are performing a QA audit on the **alipajand.com** portfolio site (Next.js 15 App Router, TypeScript, Tailwind CSS, Jest + @testing-library/react).

Read `docs/ARCHITECTURE.md` and `AGENTS.md` before starting.

### Scope

Target: `[COMPONENT_OR_FEATURE_PATH]`

### Checklist

**Functionality**
- [ ] Does the feature render correctly in the browser?
- [ ] Does the contact form submit and show success/error states?
- [ ] Does writing/blog post loading work for all slugs?
- [ ] Are all links (internal and external) valid?

**Tests**
- [ ] Run `pnpm test` — all tests pass?
- [ ] Is the component covered by a test in `__tests__/`?
- [ ] Are edge cases tested (empty data, long strings, missing optional props)?

**TypeScript**
- [ ] Run `pnpm typecheck` — no errors?
- [ ] Are all props typed explicitly (no `any`)?

**Accessibility**
- [ ] Does the component have correct heading order?
- [ ] Are interactive elements keyboard-accessible?
- [ ] Are images decorated with meaningful `alt` text?
- [ ] Are ARIA landmarks and roles correct?

**Performance**
- [ ] Is this a Server Component where possible?
- [ ] Is `"use client"` only used where necessary?
- [ ] Are images using `next/image` with explicit width/height?

**Content safety**
- [ ] Are public slugs unchanged?
- [ ] Is static content in `data/` (not scattered in JSX)?

### Output format

Report findings as:
- PASS: [what was checked]
- WARN: [issue] — [recommended fix]
- FAIL: [critical issue] — [must fix before ship]
