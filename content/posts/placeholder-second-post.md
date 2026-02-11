---
title: "Why I automate code review with MCP"
date: "2025-02-01"
excerpt: "Using a custom MCP server for Cursor to run lint, types, and tests before human review and why it’s worth it."
---

Code review is essential, but repetitive checks (lint, types, tests) don’t need a human. I set up a **custom MCP server
for Cursor** that runs these steps and surfaces results in the editor so reviewers can focus on logic and design.

## What the MCP server does

- Runs the project’s **linter** and **type checker** and reports errors by file/line.
- Triggers **tests** (e.g. Jest) and shows failures without leaving the IDE.
- Optionally runs **format checks** so style is consistent before the PR.

All of this is available inside Cursor, so you see problems before pushing or asking for review.

## Why it helps

1. **Faster feedback** — No need to push, wait for CI, then fix. Fix in place.
2. **Better reviews** — Reviewers spend time on architecture and readability, not “your linter failed.”
3. **Easier onboarding** — New contributors get the same checks from day one.

If you’re already using Cursor and have a Node/TypeScript stack, an MCP server like this is a small investment for a big
gain in velocity.
