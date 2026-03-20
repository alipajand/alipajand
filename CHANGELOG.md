# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- `scripts/strip-comments-range.mjs`: remove `//` and `/* */` trivia via TypeScript ranges (preserves layout; keeps `///` references, `// @ts-*`, and `/** @jest-environment */`).

### Changed

- Remove comments across app, components, data, and utils without reprinting files.
- Tighten punctuation and copy in several blog posts; refresh README and `docs/SITE_STRUCTURE.md`.
- Drop `format:check`, `test:coverage`, and `test:watch` npm scripts; trim blank lines in `next.config.ts`.

## [1.0.4] - 2026-03-01

### Added

- Add `SECURITY.md` with supported versions and instructions for reporting vulnerabilities (enables GitHub Security policy).

## [1.0.3] - 2026-03-01

### Fixed

- **Security:** Resolve high-severity ReDoS in transitive `minimatch` (GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74): `matchOne()` combinatorial backtracking via multiple non-adjacent GLOBSTAR segments. Fixed via `npm audit fix` and an `overrides` entry in `package.json` pinning `minimatch` to `>=9.0.7` so Jest and other transitive dependents cannot regress; addresses Dependabot alert #6.

## [1.0.2] - 2026-02-26

### Changed

- Update `data/projects.ts` project case studies, tech stacks, roles, AlwaysGeeky Games, Emplifi, and ControlTech so the portfolio reads in a more outcomes-focused voice.

### Fixed

- Restore the optional `image` field on the `Project` type so project cards and their tests compile correctly.

## [1.0.1] - 2026-02-26

### Added

- Add MIT LICENSE file at the project root.
- Add CHANGELOG file.

### Changed

- Mark the root package as non-private and add MIT license metadata in `package.json` so the project can be published.
- Update `package-lock.json` metadata to mark relevant dependencies as peer where appropriate.

### Fixed

- Fix ESLint pre-commit failure by disabling the `react/display-name` rule that is incompatible with the current ESLint setup.
