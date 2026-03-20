---
title: "Design systems that stick"
date: "2025-01-15"
excerpt: "How to actually get adoption – and keep a design system alive – with clear documentation, a single source of truth, and lightweight governance."
tags:
  - Design systems
  - Documentation
---

A design system that looks great in Figma but never leaves the design team is just expensive wallpaper. The systems that
stick are the ones people reach for by default, even on hectic days with tight deadlines.

In practice, three things have made the biggest difference for me: **documentation first**, **one source of truth**, and
**lightweight governance**.

## Documentation first

If components aren’t documented where developers already look, they may as well not exist. Most teams don’t have the
time (or patience) to dig through Figma frames and Confluence pages just to figure out which button is “blessed.”

What worked was putting docs right next to the code:

- Clear props and usage examples
- Do’s and don’ts
- Accessibility notes (keyboard, focus, ARIA)

Storybook became the front door. Every component shipped with a short README, examples for common flows, and a “don’t do
this” section that captured the mistakes we’d already seen in the product. That alone reduced “can I build my own?”
questions and turned the library into the default choice.

## Single source of truth

The fastest way to kill trust in a design system is drift: Figma says one thing, production says another, and nobody is
sure which one is “real.”

We tried to keep separate design and code systems and failed. Eventually we treated **Storybook as the contract**:

- Design specs referenced the same component names and variants as Storybook.
- Tokens and props were documented in one place, then synced into both Figma and code.
- When in doubt, the implementation in the repo was the source of truth, and design was updated to match it.

This removed a lot of arguments. If something didn’t match Storybook, it was a bug to fix, not a design debate to
reopen.

## Lightweight governance

Governance is where many design systems get bogged down. You need enough structure to avoid chaos, but not so much
process that teams start bypassing the system to move faster.

We deliberately avoided a heavyweight “design system council.” Instead we had:

- **Ownership** — One team owned the core library and reviews.
- **Contribution guidelines** — A short CONTRIBUTING.md and PR template.
- **Versioning** — Semantic versioning and a changelog so consumers could upgrade safely.

Contributions were encouraged as long as they followed the guidelines and came with documentation. Changes were visible
and predictable thanks to versioning and a clear changelog.

The result: the system stayed consistent, designers and engineers felt heard, and product teams could still ship without
waiting on a central gatekeeper.
