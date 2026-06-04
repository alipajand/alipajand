# Agent instructions

## Project overview

**alipajand** is Ali Pajand's personal portfolio website — a Next.js 15 App Router site showcasing experience, projects, writing, and engineering principles. It is deployed to Vercel and uses Resend for the contact form.

There are no databases, no auth, and no multi-tenant concerns. All content is static TypeScript in `data/` and Markdown in `content/`.

## Stack

| Layer | Technology |
| --------- | -------------------------------------------- |
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | GSAP + Lenis |
| Email | Resend (`app/api/contact`) |
| Testing | Jest + @testing-library/react |
| Lint/fmt | ESLint + Prettier |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |

## Architecture boundaries

Read `docs/ARCHITECTURE.md` before large changes. Respect module boundaries:

| Module | Responsibility |
| ------------ | ----------------------------------------------- |
| `app/` | Next.js routes, layouts, metadata, API handlers |
| `features/` | Page-level feature sections (colocated logic) |
| `components/` | Shared, reusable UI components |
| `data/` | Static typed content (experience, skills, etc.) |
| `content/` | Markdown posts for the writing section |
| `utils/` | Pure utility functions and hooks |

**Agent-editable areas:** UI components, features, data files, utils, tests, and documentation under `docs/`.

**Human review required:** changes to public URLs/slugs, the contact API route, Vercel config, environment variables, and any dependency additions that affect bundle size.

## Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Tests
pnpm test

# Lint
pnpm lint

# Typecheck
pnpm typecheck

# Format
pnpm format
```

## Testing expectations

- Run `pnpm test` before finishing any task.
- Tests live colocated under `__tests__/` folders next to their subjects.
- Add or update tests when changing component behavior, hooks, or utility functions.
- Do not disable tests or modify CI config without explicit approval.

## Content and copy rules

- Static content lives in `data/*.ts` files — edit there, not scattered in JSX.
- Blog posts/writing lives in `content/` as Markdown with gray-matter frontmatter.
- Do not change public slugs or URLs without explicit approval — they affect SEO and external links.

## Forbidden changes without approval

- Public route slugs (SEO impact)
- `app/api/contact` (production email sending)
- Environment variables or secrets (`.env*` files)
- Vercel configuration or deployment targets
- Accessibility landmarks, focus order, and `aria-*` wiring
- Addition of new npm dependencies with significant bundle cost

## Final report format

When completing a task, report:

1. Summary of changes
2. Files created or modified
3. Commands run (test, lint, build)
4. Test results
5. Known limitations or follow-ups
