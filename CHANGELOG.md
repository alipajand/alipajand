# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Cinematic motion layer in `utils/cinematic.ts`: word-splitting text reveals, viewport-progress card parallax, once-only intersection reveals, and a shared scroll-frame scheduler.
- `useAutoReveal`, `useCinematicCards`, and the `CinematicSections` component for section- and card-level entrance motion.
- Hero title treatment, animated hero background, and a social links row in the hero.
- Writing post: _How I structure a frontend that owns almost no truth_.
- About section content block with matching coverage.
- Dependabot grouping so `react`, `react-dom`, `@types/react`, and `@types/react-dom` move in a single PR (#151).

### Changed

- Positioning reworked to full-stack product engineer across taglines, keywords, hero proof row, hiring fit, portfolio fit, project roles, and page metadata.
- Motion reworked on the homepage and every remaining route: writing index, writing post, portfolio, case study, now, open source, and 404.
- `usePageHeader`, `useScrollReveal`, `useCountUp`, and the reveal hooks rebuilt on the shared cinematic helpers, keeping `prefers-reduced-motion` opt-outs.
- Dependabot config retargeted from `develop` to the default branch and re-scoped to this repository.
- README, web manifest, and Open Graph copy aligned with the updated positioning.
- Dependency bumps: `prettier` (#133, #142), `lenis`, `next`, `react-hook-form` (#143, #157), `@types/node` (#138, #154), `resend` (#139, #155, #156), `marked` (#140), `@tailwindcss/postcss` (#141), `js-yaml` (#144, #148, #152), `eslint-config-next` (#145, #159), `@asamuzakjp/css-color` (#146), `highlight.js` (#153), `tailwindcss` (#158), `react` and `@types/react` (#151), and `react-dom` to 19.2.8.

### Fixed

- Dependabot and `pnpm audit` alerts cleared by raising `next`/`eslint-config-next` to 16.2.12, `js-yaml` to 5.2.3, and pinning patched `postcss`, `sharp`, and `brace-expansion` through pnpm overrides (#150).

### Removed

- Testimonials section from the homepage.
- Legacy UI/UX audit and prompt documents under `docs/`.
- `scripts/strip-comments-range.mjs`.
- `.cursor/rules`; agent and editor directories are now gitignored.

---

## [1.6.6] - 2026-07-03

### Added

- Writing post: _How I would approach building a real-time backgammon platform_.
- Syntax highlighting for post code blocks via `highlight.js` and `marked-highlight`, with `tsx`/`jsx` aliases and a `plaintext` fallback.
- Themed `.prose` code and `pre` styles in `app/globals.css`.

### Changed

- Expanded posts with AI-assisted analysis, performance considerations, and product state handling; refined architecture, interaction design, and testing sections (#132).
- Normalized typographic characters across the writing archive.
- Dependency bumps for `prettier`, `tailwindcss`, `resend`, `@types/node`, and `@asamuzakjp/css-color`.

---

## [1.6.5] - 2026-06-23

### Added

- References, examples, and related-reading links across the writing archive.
- `CLAUDE.md` project instructions for contributors and coding agents.

### Changed

- Replaced `gray-matter` with a small in-repo frontmatter parser built directly on `js-yaml` in `utils/posts.ts`.
- Consolidated Dependabot updates for `js-yaml`, `react-hook-form`, `resend`, `@types/node`, and `@asamuzakjp/css-color` (#126).

### Fixed

- Aligned the `js-yaml` override in `pnpm-workspace.yaml` and `pnpm-lock.yaml` with `package.json`.

### Removed

- `gray-matter` and `@types/js-yaml` dependencies.

---

## [1.6.4] - 2026-06-20

### Added

- TallyFolio case study content across portfolio data, routes, screenshots, and coverage tests.

### Changed

- Refined Open Graph imagery styling with an updated background treatment.
- Updated portfolio project references and internal-link coverage for the expanded case-study set.

### Removed

- Unused homepage copy and legacy decorative Open Graph icon markup.

---

## [1.6.3] - 2026-06-19

### Added

- Writing post: _How I Use AI in My Frontend Engineering Workflow_.
- Optional `seoTitle` and `seoDescription` frontmatter support for writing posts.

### Changed

- Added explicit SEO metadata fields across the writing archive for consistent article metadata.
- Added related-reading links to the AI workflow post.

---

## [1.6.2] - 2026-06-18

### Added

- Portfolio case-study index with dedicated `/portfolio/[slug]` routes, JSON-LD, and sitemap entries.
- TallyFolio case study plus refreshed screenshots for LedgerGuard, MapBylaw, and AlwaysGeeky.
- Breadcrumbs on inner pages with shared data helpers and tests.
- Lenis-powered smooth scrolling and improved route-transition focus behavior.

### Changed

- Shortened contact heading and removed the hero availability line.
- Simplified cross-page navigation; standardized test descriptions across the suite.

### Fixed

- Patched transitive `js-yaml` (CVE-2026-53550) and restored `gray-matter` compatibility.

### Removed

- Unused illustrative components; simplified project reveal logic and legacy project card markup.

---

## [1.6.1] - 2026-06-16

### Added

- Homepage and site positioning refresh with stronger portfolio writing.
- WCAG improvements for hero, links, and form copy; shared keyboard accessibility patterns.
- Featured open-source tools prioritization on the tooling page.

### Changed

- Footer restructured with direct channel links and clearer nav columns.
- Portfolio case studies normalized; title formatting standardized across metadata and content.
- Component logic extracted into custom hooks; simplified styles and trimmed unused homepage content.
- Post, component, and open-source copy refined for clarity; design systems article framing clarified.

### Removed

- Unused components, tests, and hooks across the project.

---

## [1.6.0] - 2026-06-16

### Added

- `/open-source` page with a dedicated tooling section, sitemap entry, and navigation/footer links.
- Portfolio media previews for LedgerGuard, MapBylaw, and AlwaysGeeky case studies.
- Portfolio fit content that highlights role alignment and what hiring teams should look for.

### Changed

- Refined portfolio and selected-work content to surface stronger proof points, project context, and richer case-study details.
- Expanded reusable metadata helpers and related tests to cover the new open-source page and portfolio updates.
- Dependency bumps for `eslint-config-next`, `@tailwindcss/postcss`, `tailwindcss`, `react-hook-form`, and `@types/node`.

### Removed

- Obsolete `LedgerGuardArchitectureDiagram` component and the unused writing archive teaser content.

---

## [1.5.1] - 2026-06-11

### Changed

- Dependency bumps across the stack, including Next.js, React, Tailwind, ESLint config, Resend, Marked, Jest tooling, and related type packages.
- Refined hero behavior and copy across shared data files and sections.
- Simplified motion and helper hooks by removing unused comments and cleanup code.

### Fixed

- Jest coverage collection now skips type-only files so thresholds reflect executable code.
- Lockfile and config updates brought package metadata back in sync after the release branch changes.

---

## [1.5.0] - 2026-06-05

### Added

- Selected case studies on the homepage (four cards, above writing).
- Site footer with links to Now and Engineering principles.
- Skip-to-content link in the root layout.
- Optional Company field on the contact form.
- Flow steps on project case study cards.
- Reading progress bar on writing posts.
- Shared page-header animation; motion tokens in `utils/motion`.
- Contributor docs (`AGENTS.md`, architecture notes) under `docs/`.
- Tests for homepage sections, contact, nav, metadata, and GSAP helpers.

### Changed

- Homepage copy and metadata lead with Senior Frontend / Product Engineer.
- Reordered homepage sections; renamed Hiring fit to "What I bring to a team".
- Nav: Work, Writing, About, Contact. Résumé link only when `RESUME_URL` is set.
- Case studies lead with role and what I owned; cleaned up project badges.
- Contact copy for hiring inquiries; dropped the response-time line on success.
- Testimonials use a short Role · Company line.
- Type-only files excluded from Jest coverage.

### Fixed

- Hero scroll cue skips animation when `prefers-reduced-motion` is on.

---

## [1.4.0] - 2026-06-03

### Added

- Hiring fit section on the homepage.
- Writing post: _How I approach senior frontend architecture_.
- Apple touch icon (`app/apple-icon.tsx`) with AP monogram.

### Changed

- Positioning copy updated for Senior Product Engineer.
- Skills groups expanded (TanStack Query, Server Components, DX tooling, and related items).
- Portfolio role labels for LedgerGuard, MapBylaw, AlwaysGeeky Games, and Emplifi.
- Writing tags render as pills on post cards.
- App icon, section ids, and core dependencies (Next.js, React, Tailwind, TypeScript).

### Fixed

- Sanitize post slugs in `utils/posts.ts` (CodeQL XSS finding).
- Broken `pnpm-lock.yaml` after dependency upgrades.

---

## [1.3.0] - 2026-05-08

### Added

- `/now` and `/engineering-principles` pages.
- LedgerGuard case study and blog post; workflow diagrams for case studies and posts.
- How I think section on the homepage.

### Changed

- Blog routes moved to `/writing` with redirects from `/blog`.
- Portfolio case study order and project card layout.
- Copy tweaks across sections.
- Switched to pnpm; bumped dependencies.

### Removed

- Site footer and related components/tests.
- Analytics wrappers, resource hints, and selected work gallery.

---

## [1.2.0] - 2026-04-21

### Changed

- Style pass on hero, contact, nav, testimonials, and shared sections (`utils/visual.ts`).
- Nav links and favicon.
- Dependency bumps (Next.js 16.2.x, TypeScript 6, Tailwind 4.2.x).

---

## [1.1.0] - 2026-03-19

### Added

- `scripts/strip-comments-range.mjs` to strip `//` and `/* */` via TypeScript ranges (keeps `///`, `// @ts-*`, and `/** @jest-environment */`).
- `jest-config` as a direct devDependency for Jest typings under strict TypeScript.

### Changed

- Removed HireProof and hiring snapshot from the homepage; contact copy no longer hiring-focused.
- Nav labels and structure (e.g. Me, Writing); brand and footer links use `next/link`.
- Wider default max-width on section ledes; spacing and markup aligned across sections.
- Dropped the fallback thumbnail caption on selected work.
- Punctuation and copy in several posts; README and `docs/SITE_STRUCTURE.md` updated.
- Excluded `.next` from `tsconfig.json`; trimmed `next.config.ts`; removed `format:check`, `test:coverage`, and `test:watch` scripts.
- Stripped comments across app, components, data, and utils.

---

## [1.0.4] - 2026-03-01

### Added

- `SECURITY.md` for supported versions and vulnerability reporting.

---

## [1.0.3] - 2026-03-01

### Fixed

- ReDoS in transitive `minimatch` (GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74). Pinned `minimatch` to `>=9.0.7` via `overrides` in `package.json` (Dependabot #6).

---

## [1.0.2] - 2026-02-26

### Changed

- Updated case studies, stacks, and roles in `data/projects.ts` (AlwaysGeeky Games, Emplifi, ControlTech, and others).

### Fixed

- Restored optional `image` on the `Project` type so cards and tests compile.

---

## [1.0.1] - 2026-02-26

### Added

- MIT LICENSE at the project root.
- This changelog.

### Changed

- Package marked non-private with MIT license in `package.json`.
- `package-lock.json` peer metadata cleanup.

### Fixed

- ESLint pre-commit: disabled `react/display-name` (incompatible with current setup).
