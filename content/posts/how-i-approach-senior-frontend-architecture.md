---
title: "How I approach senior frontend architecture"
date: "2026-06-03"
excerpt: "A practical view of senior frontend architecture: boundaries, state, API contracts, accessibility, performance, test strategy, and the review habits that keep product UI maintainable."
seoTitle: "How I approach senior frontend architecture — Ali Pajand"
seoDescription: "A practical view of senior frontend architecture: boundaries, state, API contracts, accessibility, performance, test strategy, and the review habits that keep product UI maintainable."
tags:
  - Frontend Architecture
  - React
  - TypeScript
  - DX
---

Senior frontend architecture is not about making a folder tree look clever. It is about making product behavior easier to reason about as complexity, edge cases, and team surface area grow.

I keep coming back to one question: what does this interface need to guarantee?

A dashboard, onboarding flow, renewal-review screen, and AI-assisted workflow all fail in different ways. Good architecture makes those failure modes visible early instead of hiding them behind a polished happy path.

## Boundaries first

Most frontend codebases become harder to change when shared UI and product behavior blur into each other.

I separate design-system primitives from domain-owned product components. A button, dialog shell, form field wrapper, or loading skeleton can be shared. A renewal-risk table, parcel recommendation panel, or report-export workflow should live with the feature that owns its rules and states.

A concrete example is the difference between a shared combobox primitive and a domain-owned "property scenario selector." The combobox can own keyboard behavior, labeling hooks, and focus patterns. The scenario selector owns which scenarios are available, what happens when one is not supported, and how a recommendation card updates around it.

Pushing more product behavior down into the design system to "maximize reuse" usually backfires. Stricter boundaries create more components, but they keep the shared layer from turning into a business-logic landfill. Reuse is valuable only when it does not erase ownership. I go into the documentation and contract side of this same boundary problem in [Design systems that stick](/writing/design-systems-that-stick).

## State should match the product model

State management is not a library choice first. It is a modeling problem.

The easiest way to create frontend bugs is to store state somewhere more global or durable than the product behavior requires. I prefer explicit ownership:

- Server cache: fetched records, computed scenarios, or verification results that come from the backend and need refetch or invalidation rules.
- URL state: filters, tabs, sort order, or selected IDs when the state represents shareable user intent.
- Form state: draft values the user is editing but has not committed yet.
- Local interaction state: open panels, row expansion, hover intent, inline disclosure state.
- Persisted preference: things like density mode, dismissed hints, or table column preferences that should survive refreshes.

In practice, this taxonomy maps closely to specific tools rather than staying abstract. Server cache is what [TanStack Query](https://tanstack.com/query) exists for. It explicitly does not try to be a general client-state manager, and its own documentation is worth reading on that boundary, because teams that reach for it as an everything-store usually end up fighting it. For state that genuinely needs to be global and synchronous (open panels shared across distant components, an auth user, a cart), [Zustand](https://zustand.docs.pmnd.rs/) is a small, low-ceremony option that avoids the provider and boilerplate overhead of older patterns. Form state has its own shape again; [React Hook Form](https://react-hook-form.com/) or TanStack Form fit that slot specifically because committed-vs-draft is a different lifecycle than server cache or global UI state. The mistake worth naming directly: picking one library and asking it to cover all five categories. That is usually where "why did changing this modal break browser navigation" bugs come from: state with the wrong scope reacting to changes it should not be subscribed to.

In a workflow-heavy interface, imagine a contract review screen with a renewals table and a detail drawer. The table data belongs in server cache. The selected contract ID and current filter belong in the URL so a reviewer can share the exact view. Edits to a notice date belong in form state until saved. Whether the evidence sidebar is open belongs in local interaction state. The user's chosen compact-table preference belongs in persisted local storage or profile state.

One app-wide store holding all of it "for convenience" is the pattern I avoid. Distributed state ownership requires more discipline about boundaries and naming, but it prevents stale copies, accidental coupling, and the "why did changing this modal break browser navigation?" class of bugs.

## API contracts are part of frontend architecture

Frontend architecture gets weak when the UI has to guess what the backend meant.

Typed API contracts, [Zod](https://zod.dev/) validation, and explicit empty or error states are not backend polish. They shape what the UI can safely promise. This matters even more in AI-assisted products, where the frontend needs to know what is grounded, what is uncertain, and what can be edited without being mistaken for verified truth. That is the exact problem I describe at the product level in [the LedgerGuard truth-precedence writeup](/writing/ledgerguard-truth-between-extraction-and-finance).

Zod earns a specific mention here rather than "a validation library" in the abstract, because runtime validation at the API boundary is the piece a typed contract alone cannot give you: TypeScript types disappear at compile time, so a malformed or drifted payload still reaches your components unless something checks it at runtime. Parsing the response through a schema and deriving the TypeScript type from that schema, rather than hand-writing both, keeps the two from drifting apart as the API evolves.

If the dashboard and export flow consume slightly different payload shapes, product drift starts quietly. I put a typed contract at the boundary and use it across the feature, including secondary surfaces like PDFs or exports.

Mapping each surface independently and relying on integration knowledge in developers' heads is faster at first and more expensive later. Stricter contracts add maintenance when APIs evolve, but they make change visible at compile time instead of after a customer notices the PDF and UI disagree.

## Accessibility is architecture

Accessibility is not a finishing pass. It affects component APIs, focus order, semantics, motion, error recovery, and how users move through a workflow when something fails.

The architectural consequence is that reusable components should expose accessibility requirements as part of their interface contract. A modal primitive should define focus trapping and return behavior. A form field wrapper should make error and hint wiring easy instead of optional. A loading or error pattern should account for how state changes are announced, not only how they look.

Postponing accessibility until QA usually means retrofitting semantics into components whose APIs were never designed to support them cleanly. Front-loading more design and implementation discipline pays off when accessibility stops being a special task and becomes part of how the system works by default. The [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) is the reference I use to define what a given interaction pattern is actually required to guarantee, rather than relying on memory or convention.

## Performance is a product constraint

Performance work is not about chasing abstract scores. It is about protecting the parts of the product where users actually spend time.

Consider a data-heavy interface with a large results table, map overlays, derived recommendation cards, and a detail drawer. The architecture needs to respect the fact that users are switching filters, scanning rows, and opening context quickly. That leads to decisions like:

- Keep server data fetching separate from ephemeral UI state so local interaction does not trigger unnecessary refetch behavior.
- Defer expensive derived rendering until the user has narrowed the active dataset.
- Split secondary features like export or advanced comparison panels by intent rather than loading them on first paint.
- Be explicit about loading and empty states so the interface still explains itself while work is in progress.

A monolithic page component that recomputes everything on every filter change because it is "simpler" is the version I try not to ship. Performance-aware boundaries can make composition feel more deliberate, but data-heavy products need architecture that assumes real use, not demo use.

## Tests should follow the same ownership model

Test strategy gets clearer when each layer owns different risks.

For a workflow-heavy frontend, I usually want:

- Unit tests for pure utilities, formatters, reducers, schema transforms, and state adapters.
- Integration tests for feature components that coordinate fetching states, user interaction, and rendering decisions.
- Accessibility-focused checks for shared primitives and important flows where keyboard, labeling, and error wiring are easy to regress.
- End-to-end coverage for the high-value journeys where multiple boundaries have to cooperate: search, review, save, export, or submit.

A recommendation panel might have unit tests for payload normalization, integration tests for how it renders valid versus partial responses, accessibility checks for disclosure and alert behavior, and end-to-end coverage for the full "analyze property -> view recommendation -> generate report" journey, similar in spirit to what I describe in [Teaching MapBylaw to give honest AI recommendations](/writing/mapbylaw-ai-recommendations).

Using end-to-end tests as a substitute for all other confidence tends to create slow, brittle suites that still do not explain where ownership lives when something breaks. Maintaining multiple test layers is more work, but failures localize faster and reviews can focus on product behavior instead of missing basic coverage.

## Review habits keep the architecture honest

Architecture is not preserved by diagrams alone. It is preserved by what code review treats as important.

I want deterministic checks like typecheck, lint, and tests to run early so review time can focus on behavior, ownership, naming, failure handling, and trade-offs. It is the same separation of concerns I describe in [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp). If a feature introduces a new shared component, the review should ask whether it is actually shared infrastructure or product logic looking for a home. If a piece of state moved, the review should ask whether its new owner matches the product model.

That is the part of senior frontend work I care about most. The code should not only render the right pixels. It should make the next decision easier and the next failure easier to explain.

## The goal

Good frontend architecture makes a product easier to change without making it easier to lie.

It helps designers trust the system, backend engineers trust the contract, product managers trust the behavior, and users trust what the interface is telling them. That is the standard I aim for: product UI that ships, explains itself, handles failure honestly, and stays maintainable after the first version.

## Further reading

- [TanStack Query docs](https://tanstack.com/query/latest/docs/framework/react/overview): read the "does this replace a state manager" page specifically; it is the clearest public statement of the server-cache vs. client-state boundary I rely on above.
- [Zustand](https://zustand.docs.pmnd.rs/): for the minimal global-store slot in the taxonomy above.
- [Zod](https://zod.dev/): schema-first runtime validation at the API boundary.
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/): pattern-by-pattern accessibility contracts for shared components.

## Related reading

- [Design systems that stick](/writing/design-systems-that-stick)
- [Teaching MapBylaw to give honest AI recommendations](/writing/mapbylaw-ai-recommendations)
- [The quiet failure mode in contract AI: when the UI believes the wrong row](/writing/ledgerguard-truth-between-extraction-and-finance)
