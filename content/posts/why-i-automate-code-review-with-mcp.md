---
title: "Why I automate code review with MCP"
date: "2026-01-15"
excerpt: "How a custom MCP server for Cursor runs lint, types, and tests for me so human reviewers can focus on architecture, trade‑offs, and naming."
tags:
  - DX
  - Tooling
---

Code review is essential, but a lot of it is the same boring checklist: did you run the tests, fix the linter errors, and keep the types happy? That work is important, but it doesn’t need a human every single time.

I set up a **custom MCP server for Cursor** so those checks run automatically in my editor. By the time someone else looks at a pull request, we’re already past “your linter failed” and into the interesting parts: architecture, trade‑offs, and naming.

## What the MCP server does

At a high level, the MCP server acts like a very opinionated assistant that understands my project and knows which commands to run.

It:

- Runs the project’s **linter** and **type checker**, reporting errors by file and line directly in Cursor.
- Triggers **tests** (e.g. Jest) and surfaces failures without leaving the IDE.
- Optionally runs **format checks** so code style is consistent before the PR ever exists.

Instead of remembering half a dozen `npm` scripts, I invoke one MCP tool and get a clear, structured summary of what’s broken and where.

All of this happens inside Cursor, wired into the files I’m already editing. I see problems early, fix them in place, and push only when the build is effectively “green” locally.

## Why it helps

For me, the value shows up in three places:

1. **Faster feedback:** I don’t have to push, wait for CI, and then circle back. The MCP server tells me immediately when something breaks, so the fix is still fresh in my head.
2. **Better reviews:** Reviewers can assume “lint, types, and tests pass” and spend their attention on architecture, readability, and long‑term maintenance instead of mechanical nits.
3. **Easier onboarding:** New contributors don’t need to memorize the project’s scripts. They run the same MCP tools I do and get consistent, guided feedback from day one.

In other words, the computer is strict about rules, and humans get to be generous about design and intent.

## How I wired it up (at a high level)

Under the hood, the setup is straightforward:

- The MCP server exposes tools like `run_lint`, `run_types`, and `run_tests`.
- Each tool wraps the project’s existing commands (for example, `npm run lint`) and parses their output into a structured format.
- Cursor calls these tools and decorates the editor with the results, so I can jump directly to offending lines.

I didn’t have to change my stack to get this working; I just formalized the checks I was already running into a repeatable, machine‑driven flow.

If you’re already using Cursor and you have a Node/TypeScript project, a small MCP server like this is a modest one‑time investment that keeps paying off every time you open a pull request.
