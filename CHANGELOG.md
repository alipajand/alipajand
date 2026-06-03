# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.0] - 2026-06-03

### Added

- Homepage **Hiring fit** section with four strength cards, role-fit pills, and CTAs to portfolio and engineering principles.
- Writing post: _How I approach senior frontend architecture_.
- Apple touch icon (`app/apple-icon.tsx`) with AP monogram.

### Changed

- **Positioning:** Unify site copy around **Senior Product Engineer**; broaden hiring-fit messaging for senior frontend, frontend platform, design systems, and AI product UI searches.
- **Skills:** Expand Product Frontend Architecture, Design Systems & Accessibility, and Quality/Observability/DX groups (TanStack Query, Server Components, design-system governance, performance budgets, and related terms).
- **Portfolio:** Standardize case-study role labels for LedgerGuard, MapBylaw, AlwaysGeeky Games, and Emplifi.
- **Writing:** Render post tags as accessible pill badges on writing cards.
- Refresh app icon treatment, update section ids, and upgrade core dependencies (Next.js, React, Tailwind, TypeScript, and related packages).

### Fixed

- **Security:** Harden post slug handling in `utils/posts.ts` to address CodeQL stored XSS risk in writing routes.
- Fix broken `pnpm-lock.yaml` after dependency upgrades.

---

## [1.3.0] - 2026-05-08

### Added

- **Now** page (`/now`) and **Engineering principles** page (`/engineering-principles`) with dedicated content and metadata.
- LedgerGuard portfolio case study and blog post on pipeline truth between extraction and finance.
- LedgerGuard and MCP workflow diagrams for case studies and posts.
- **How I think** homepage section.

### Changed

- **Routes:** Migrate blog to **Writing** (`/writing`, `/writing/[slug]`); add redirects from legacy `/blog` paths.
- **Portfolio:** Reorder case studies and expand project card case-study presentation.
- Refine ledes, section descriptions, and validation messages across the site.
- Switch package management to **pnpm** (`pnpm-lock.yaml`, workspace config) and refresh dependency versions.
- Routine dependency bumps (Next.js, React, marked, Tailwind, Prettier, and related packages).

### Removed

- Site footer and associated components/tests.
- Gated analytics wrappers, resource hints, and selected-work gallery (and their tests).

---

## [1.2.0] - 2026-04-21

### Changed

- Visual polish across hero, contact, nav, testimonials, and shared section styling (`utils/visual.ts`).
- Update nav links and favicon.
- Routine dependency bumps (Next.js 16.2.x, TypeScript 6, Tailwind 4.2.x, and related packages).

---

## [1.1.0] - 2026-03-19

### Added

- `scripts/strip-comments-range.mjs`: strip `//` and `/* */` trivia via TypeScript ranges (preserves layout; keeps `///` references, `// @ts-*`, and `/** @jest-environment */`).
- `jest-config` as a direct devDependency so strict TypeScript checking resolves Jest’s typings.

### Changed

- **Positioning:** Remove hiring-oriented homepage sections (HireProof, hiring snapshot) and rewrite contact intro/reasons for a non-employment posture.
- **Navigation & footer:** Refresh primary nav labels and structure (e.g. Me, Writing for the blog route); use `next/link` for the brand and footer links.
- **Layout & copy:** Relax default max-width on shared section ledes; align spacing and markup across sections, blog list/post routes, and portfolio.
- **Selected work:** Drop the “Illustrative · not a live screenshot” line on fallback thumbnails.
- **Blog & docs:** Tighten punctuation and copy in several posts; refresh README and `docs/SITE_STRUCTURE.md`.
- **Tooling:** Exclude `.next` in `tsconfig.json` so generated route types aren’t duplicated; trim `next.config.ts`; remove `format:check`, `test:coverage`, and `test:watch` npm scripts.
- **Maintenance:** Strip comments across app, components, data, and utils without reprinting files.

---

## [1.0.4] - 2026-03-01

### Added

- Add `SECURITY.md` with supported versions and instructions for reporting vulnerabilities (enables GitHub Security policy).

---

## [1.0.3] - 2026-03-01

### Fixed

- **Security:** Resolve high-severity ReDoS in transitive `minimatch` (GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74): `matchOne()` combinatorial backtracking via multiple non-adjacent GLOBSTAR segments. Fixed via `npm audit fix` and an `overrides` entry in `package.json` pinning `minimatch` to `>=9.0.7` so Jest and other transitive dependents cannot regress; addresses Dependabot alert #6.

---

## [1.0.2] - 2026-02-26

### Changed

- Update `data/projects.ts` project case studies, tech stacks, roles, AlwaysGeeky Games, Emplifi, and ControlTech so the portfolio reads in a more outcomes-focused voice.

### Fixed

- Restore the optional `image` field on the `Project` type so project cards and their tests compile correctly.

---

## [1.0.1] - 2026-02-26

### Added

- Add MIT LICENSE file at the project root.
- Add CHANGELOG file.

### Changed

- Mark the root package as non-private and add MIT license metadata in `package.json` so the project can be published.
- Update `package-lock.json` metadata to mark relevant dependencies as peer where appropriate.

### Fixed

- Fix ESLint pre-commit failure by disabling the `react/display-name` rule that is incompatible with the current ESLint setup.
