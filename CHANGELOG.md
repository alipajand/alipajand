# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed

- Update `data/projects.ts` project case studies, tech stacks, roles, and copy tone for MapBylaw, AlwaysGeeky Games, Emplifi, and ControlTech so the portfolio reads in a more senior, outcomes-focused voice.

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

