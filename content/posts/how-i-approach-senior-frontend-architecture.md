---
title: "How I approach senior frontend architecture"
date: "2026-06-03"
excerpt: "A practical view of senior frontend architecture: boundaries, state, API contracts, accessibility, performance, test strategy, and the review habits that keep product UI maintainable."
tags:
  - Frontend Architecture
  - React
  - TypeScript
  - DX
---

Senior frontend architecture is not about making the folder structure look clever. It is about making product UI easier to reason about as the product, team, and edge cases grow.

The work usually starts with one question: **what does this interface need to guarantee?**

A dashboard, onboarding flow, billing page, contract review screen, or AI-assisted workflow all have different failure modes. The architecture should make those failure modes visible instead of hiding them behind optimistic UI.

## Boundaries first

I like to separate product surfaces by domain, not only by component type. A shared button belongs in the design system. A renewal-risk table, report builder, or account setup flow belongs closer to the feature that owns the behavior.

That separation keeps shared UI reusable without turning it into a dumping ground for business logic.

Good boundaries make it easier to answer:

- Where does this data come from?
- Who owns this state?
- What happens while it is loading?
- What happens when it fails?
- Which parts are reusable infrastructure, and which parts are product-specific?

When those answers are obvious, the codebase feels smaller than it is.

## State should match the product model

State management is not a library choice first. It is a product modeling problem.

Some state is server state and should be cached, invalidated, retried, and synchronized carefully. Some state is local interaction state. Some state is URL state because it represents shareable user intent. Some state belongs in a form because the user is drafting something that has not been committed yet.

I prefer boring, explicit state boundaries over clever global stores. Most frontend bugs come from state living in the wrong place.

## API contracts are part of frontend architecture

Frontend architecture gets weak when the UI has to guess what the backend meant.

Typed API contracts, Zod schemas, OpenAPI definitions, and clear empty/error states make product behavior more predictable. They also improve collaboration: backend changes stop being surprises, and frontend work stops relying on undocumented response shapes.

This matters even more in AI-assisted products. If a model produces suggestions, summaries, or risk labels, the UI needs to know what is grounded, what is uncertain, what can be edited, and what should never be presented as fact.

## Accessibility is architecture

Accessibility is not a final checklist. It affects component APIs, focus management, semantics, keyboard behavior, motion, color contrast, error messaging, and how users recover when something goes wrong.

If accessibility is handled late, the architecture usually fights it. If it is part of the system early, it improves the product for everyone.

## Performance is a product constraint

Frontend performance is not only Lighthouse. It is how the product feels during real work.

For complex interfaces, I care about:

- avoiding unnecessary rendering
- keeping expensive charts and motion bounded
- splitting code where it maps to user intent
- making loading states useful
- measuring the paths users actually take

Performance work should protect the core experience, not become abstract optimization theater.

## Tests and review habits keep the system honest

Senior frontend work is not finished when the UI looks right locally.

I want fast feedback loops: typecheck in the editor, lint before review, unit tests for logic, integration tests for important flows, accessibility checks where practical, and production observability when something still slips through.

The review conversation should focus on product behavior, naming, boundaries, and trade-offs — not avoidable formatting or type errors.

## The goal

Good frontend architecture makes a product easier to change.

It helps designers trust the system, backend engineers trust the contract, product managers trust the behavior, and users trust the interface.

That is the standard I try to build toward: product UI that ships, explains itself, handles failure honestly, and stays maintainable after the first version.
