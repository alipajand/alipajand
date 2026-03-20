---
title: "Building tools that don’t fight you"
date: "2026-02-26"
excerpt: "How I think about design systems, automated code review, and AI recommendations as one problem: building reliable tools that disappear into the work instead of getting in the way."
featured: true
tags:
  - Design systems
  - DX
  - Tooling
---

Most of my work circles the same question: **how do you build tools that people actually use, trust, and eventually stop thinking about?**

Over the past couple of years that’s shown up in three different places: a design system, a custom MCP server for code review, and AI recommendations inside MapBylaw. On paper they look unrelated; in practice they’re the same problem repeated with different constraints.

## 1. Design systems: adoption or it didn’t happen

In the design system, the real work wasn’t clever tokens or perfect Figma files. It was:

- Writing **documentation where people already look** (Storybook, README) instead of in a separate wiki.
- Treating Storybook as the **contract between design and code**, so there’s one source of truth.
- Keeping **governance lightweight** enough that teams didn’t feel blocked when they needed a new pattern.

When that clicked, the system stopped being a “project” and turned into a default: people reached for it first because it was the easiest, safest option. That’s the bar.

## 2. MCP: make the computer do the boring parts

The MCP server came from the same instinct, applied to code review.

Lint, types, and tests are important, but they’re also **predictable and automatable**. By wrapping them in a custom MCP server that talks to Cursor, I moved those checks:

- From “did you remember to run the script?”
- To “the editor already told you what’s broken, and where.”

That shifts human review time toward architecture, trade‑offs, and naming instead of red CI dots.

Again, the pattern is the same: put a clear, typed contract in front of a process, automate the mechanical parts, and keep humans for judgement calls.

## 3. MapBylaw AI: honest recommendations or none at all

On MapBylaw, AI recommendations had to earn their place.

We already had a serious analysis pipeline: geocoding, zoning, PUM 2050 sectors, heritage and climate checks, rental stock protection rules, Plateau conversion caps, fiscal incentives, and a 10‑page PDF report that’s been audited for **“no static or fake data”**.

Dropping a generic chatbot on top of that would have been worse than nothing.

So I treated AI as just another **typed service** in the architecture:

- A strict **TypeScript shape** for `ai_recommendations` that flows through the API, dashboard, and PDF.
- A **narrow context builder** that only feeds the model what the rest of the product already knows is true.
- **OpenAPI + Zod** validation and tests so malformed or over‑eager recommendations fail fast instead of quietly leaking into production.
- Alignment with the **reports data audit**: if the data doesn’t exist, the AI doesn’t get to invent it. It either says “data not available” or stays quiet.

The result is advice that feels like it comes from MapBylaw itself, not from a detached chatbot we bolted on after the fact.

## The through‑line

Across all three, the pattern I keep coming back to is:

1. **Make the contract explicit.** Types, docs, and schemas are what keep tools honest and predictable.
2. **Let machines do the repetitive work.** Lint, types, tests, report plumbing, and context building are chores computers are good at.
3. **Reserve humans for judgement.** Design, naming, trade‑offs, and product strategy are where attention is scarce and valuable.

When a tool hits that balance, people stop noticing it as “a system” or “an AI feature.” It just becomes part of how the work gets done, which is exactly where I want it to be.
