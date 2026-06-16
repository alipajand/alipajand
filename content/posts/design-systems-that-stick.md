---
title: "Design systems that stick"
date: "2025-01-15"
excerpt: "How to get adoption and keep a design system useful with better component contracts, practical documentation, and lightweight governance."
tags:
  - Design systems
  - Documentation
---

A design system that looks polished in Figma but gets bypassed in product code is not established. It is decoration.

The clearest adoption failure I have seen was not ideological resistance to consistency. It was delivery pressure meeting a shared system that did not yet make the right path easy enough.

## The failure was real product work bypassing the system

In marketplace and authentication-heavy product work, teams were shipping flows with special states the shared components did not explain well yet: wallet loading, API-backed errors, empty commerce states, recovery messaging, and layout combinations that lived outside the original component examples.

The bypass was predictable. Engineers could assemble a one-off card, form section, or button group inside the feature faster than they could reverse-engineer whether the design system supported the state cleanly. Designers could point to a Figma frame, but that still did not tell implementation teams how accessibility, failure states, or responsive behavior were supposed to work.

That was the real constraint. Adoption was failing not because teams hated the system, but because the system's interface contract was incomplete where product work was busiest.

The rejected alternative was to lecture teams harder about consistency. That would have confused compliance with usability. If the fastest path to ship is bypassing the system, the system has a product problem.

## Documentation first, but close to the code

The fix started with documentation, but not in the vague "we should write better docs" sense.

Storybook was the primary discovery surface and interface contract, while code and versioned tokens remained the executable sources of truth.

That distinction matters. Storybook is where engineers and designers discover variants, read usage guidance, and compare states. Component code and token definitions are what the build and product actually execute.

The practical change was that each important shared component needed:

- Clear props and examples for real product states, not only ideal demos.
- Accessibility notes covering keyboard behavior, focus, semantics, and error messaging.
- "Use this when / do not use this when" guidance so product teams knew what should remain domain-specific.
- Examples of loading, empty, error, and recovery states where applicable.

The decision was to document the states teams were already bypassing for. The trade-off was more Storybook and example maintenance, but that cost was lower than letting product code fork into inconsistent local patterns.

## The component contract had to change

Documentation alone would not have fixed the adoption problem. Some of the shared component APIs were too narrow.

A common failure mode in design systems is exposing a visually reusable shell without exposing the behavioral hooks product teams need. A form section that looks correct but does not make hint text, error wiring, or async-action states straightforward will get wrapped, then forked, then replaced.

The better response was to harden the contract:

- Make accessibility requirements part of the API, not optional follow-up work.
- Support the state combinations product teams actually need, especially loading, disabled, error, and recovery paths.
- Leave space for escape hatches when the product really is unique, but make that escape explicit rather than accidental.

Escape hatches matter. A design system should not absorb every piece of product behavior. Domain-specific recommendation panels, wallet-connect logic, or contract-review controls should remain product-owned even if they are visually assembled from shared primitives.

The trade-off is that stronger contracts take longer to design. The upside is that teams stop bypassing the system for problems it should have solved in the first place.

## Adoption depends on migration, not just new rules

Once the contract changes, adoption still does not happen automatically.

Existing one-off implementations need a migration path. That usually means identifying the duplicated patterns worth converging first, documenting the replacement, and making the new shared version at least as easy to use as the local workaround.

The rejected alternative was an all-at-once rewrite. That tends to create a lot of churn and resentment while still leaving product-specific edge cases unresolved.

The decision I prefer is incremental migration:

- Converge the highest-traffic repeated patterns first.
- Treat product teams as signal, not just consumers; if they bypassed a component, ask why.
- Keep migration guidance near the component docs.
- Avoid forcing a shared abstraction where the product behavior is still unsettled.

The trade-off is living with a mixed system for a while. That is fine. A design system becomes real by improving product work over time, not by declaring purity.

## Lightweight governance keeps the system usable

Governance matters, but heavy governance often creates the same bypass pressure as a weak component API.

What has worked better for me is lightweight contribution structure:

- Clear ownership of the core library.
- Contribution criteria for when something belongs in the system at all.
- Required documentation and accessibility behavior for new shared components.
- Versioning and changelog discipline so consumers understand what changed.

Contribution criteria are especially important. A pattern belongs in the design system when it is reused across product areas, has a stable enough interface contract, and can define accessible behavior clearly. If it is still highly domain-specific or volatile, it should remain product-owned for now.

That avoids a common mistake: moving unstable product logic into shared infrastructure too early in the name of consistency.

## Deprecation, breaking changes, and accessibility

The system also needs a clear strategy for change.

Deprecation should be explicit, documented, and time-bounded. If a component or token is being replaced, teams need to know what to use instead, how long the old path is supported, and what the breaking edge is. Silent drift is worse than a visible deprecation notice.

Breaking changes should be rare and intentional. When they do happen, they need migration notes and examples because design systems affect many product surfaces at once.

Accessibility raises the bar for the contract. If a shared dialog, field, navigation pattern, or button group cannot define semantics, focus behavior, and recoverable error states clearly, it is not ready to be shared. Accessibility is not a documentation appendix. It is part of what makes the abstraction legitimate.

That is also why some things should remain product-specific. A domain workflow may still need custom orchestration even if it uses shared accessible primitives underneath. Reuse should happen at the right layer, not at the most convenient one.

## The lesson I keep reusing

Design systems stick when they reduce effort under real delivery pressure.

That means:

- documentation where teams already work
- an interface contract that reflects real states, including accessibility
- migration paths for existing bypasses
- governance light enough that contribution is possible
- discipline about what should stay product-specific

If teams keep bypassing a system, assume the bypass is telling you something true. The answer is usually not more evangelism. It is a better interface.

## Related reading

- [How I approach senior frontend architecture](/writing/how-i-approach-senior-frontend-architecture)
- [Building tools that don't fight you](/writing/building-tools-that-dont-fight-you)
- [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp)
