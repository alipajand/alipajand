---
title: "How I Use AI in My Frontend Engineering Workflow"
date: "2026-06-19"
excerpt: "A practical look at how I use AI in frontend engineering across planning, implementation, review, testing, and model evaluation without outsourcing engineering judgment."
seoTitle: "How I Use AI in My Frontend Engineering Workflow — Ali Pajand"
seoDescription: "How I use AI tools, Cursor, model testing, and coding leaderboards in day-to-day frontend engineering work across architecture, product UX, refactoring, testing, and code review."
tags:
  - AI
  - Frontend Engineering
  - Developer Experience
  - Product Engineering
  - Cursor
  - Code Review
---

AI is now part of my daily engineering workflow, but I do not treat it as a replacement for engineering judgment. I use it as a second brain, a reviewer, a prototyping partner, and a way to pressure-test my assumptions before I commit to an implementation direction.

The best results come when I use AI in structured stages: understanding the problem, exploring tradeoffs, generating implementation options, reviewing edge cases, and validating the final output through tests, type checks, accessibility checks, and my own review.

## AI as part of my engineering process

My main use case is not asking AI to build the whole feature. I get much better results when I treat it like a collaborator that needs context, constraints, and clear acceptance criteria.

For frontend work, that means I use AI to think through product flows, async states, loading and error behavior, component boundaries, API contract assumptions, and accessibility risks before implementation starts. This is especially useful for workflow-heavy products where the happy path is only a small part of the real product.

AI helps me move faster, but it does not remove the responsibility to understand the system. I still need to know what should be built, why it matters, what can go wrong, and how the result should behave in production.

## How I use AI before writing code

Before writing code, I often use AI to break down a feature into smaller decisions:

- What are the user states?
- What are the loading, empty, error, and retry states?
- What data does the UI need from the API?
- What should be local state vs. server state?
- What edge cases should be designed before polish?
- What accessibility behavior is required?
- What can be reused from the existing design system?

This stage is where AI is especially useful as a thinking partner. It can generate alternative approaches quickly, which gives me something to compare against my own plan. I cover the local-vs-server-state question specifically, including which library fits which slot, in [how I approach senior frontend architecture](/writing/how-i-approach-senior-frontend-architecture).

For example, if I am designing an AI-assisted review flow, I might ask for different ways to show source context, AI-suggested values, user-confirmed values, partial results, and confidence states. I do not accept the first answer. I compare the options against the product risk, user expectations, and implementation constraints.

## How I use AI during implementation

During implementation, I use tools like [Cursor](https://cursor.com/) to move faster through repetitive or structured coding tasks: refactors, component extraction, test scaffolding, documentation updates, small bug fixes, and multi-file changes that follow an existing pattern.

The key is giving the AI enough context. A vague prompt usually produces vague code. A better prompt includes:

- The goal of the change
- The files or components involved
- The constraints
- The acceptance criteria
- What not to change
- The existing patterns to follow
- The tests or checks that should pass

I try to be very explicit about boundaries. If I want Cursor to update a component, I tell it whether it can change the API, whether it can touch styling, whether it should preserve behavior, and what files are off-limits.

That makes the AI more useful and safer. It also keeps me in control of the architecture instead of letting the tool make product decisions by accident. For deterministic checks specifically — lint, typecheck, tests — I have moved those into the editor itself rather than relying on AI judgment or waiting for CI; I write about why in [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp).

## How I use AI for review and quality

I also use AI as a reviewer before I open or finalize a pull request.

I ask it to look for:

- Missing edge cases
- Fragile assumptions
- Unclear component APIs
- Accessibility issues
- Inconsistent loading, empty, or error states
- Test gaps
- Overly broad changes
- Copy that may confuse users
- Code that does not match the existing patterns

This does not replace human review. It helps me remove obvious issues earlier so that human review can focus on architecture, product behavior, maintainability, and tradeoffs.

I still rely on the fundamentals: TypeScript, tests, linting, accessibility checks, CI, and manual review. AI can suggest. It cannot be the final authority on production quality.

## How I keep up with new models

I try new AI models regularly because the tooling changes quickly. I test them on real frontend tasks, not just toy prompts.

The kinds of tasks I use for comparison include:

- Refactoring a component without changing behavior
- Generating tests for a real workflow
- Explaining a bug across multiple files
- Reviewing a PR for risk
- Creating a small UI from a design direction
- Improving accessibility in an existing component
- Planning a feature with async and error states

I also follow [LMArena's coding leaderboard](https://arena.ai/leaderboard/text) (the evaluation formerly run as a standalone WebDev Arena, now part of LMArena's Text Arena coding category), which compares models head-to-head on web development and agentic coding tasks through blind community voting. I treat that kind of leaderboard as a signal, not a source of truth — it tells you which model people preferred on a fairly narrow class of one-shot build tasks, not whether a model will hold up across a real multi-day feature with your actual constraints. I still test models against my own real frontend tasks before trusting them in my workflow, and for code review specifically I weight a model's ability to catch high-impact issues over its rank on a general build-quality board, since those are different skills the leaderboard does not separate cleanly.

I care about whether a model follows constraints, respects existing patterns, handles multi-file changes, and produces code that survives review.

## What I do not delegate to AI

There are parts of the work I do not hand over blindly:

- Product judgment
- Architecture direction
- Accessibility responsibility
- Security-sensitive decisions
- Data model decisions
- Final code review
- Production release judgment
- User-facing claims or metrics

AI can help generate options, but it cannot own the consequences. If I ship it, I am responsible for it.

This is especially important in AI-assisted product interfaces. When the product itself uses AI, the interface has to make uncertainty visible. AI-suggested data and user-confirmed data should not look the same. Review flows, confidence states, source context, and error states need deliberate product decisions, not generic UI — this is the exact problem I worked through on a real product in [the LedgerGuard truth-precedence writeup](/writing/ledgerguard-truth-between-extraction-and-finance) and [the MapBylaw recommendations writeup](/writing/mapbylaw-ai-recommendations).

## Why this matters for frontend teams

AI works best when the engineering process is already strong.

A codebase with clear conventions, typed APIs, documented components, tests, accessible patterns, and good task framing is much easier for AI to work with. A messy codebase with vague requirements and inconsistent patterns usually produces messy AI output.

That is why I see AI readiness as a developer experience problem. Better context, better prompts, better review structure, and better project conventions make the tools more useful.

It is also why I have been building small agent-tooling projects like [agent-context-doctor](https://github.com/alipajand/agent-context-doctor), [agent-pr-reviewer-lite](https://github.com/alipajand/agent-pr-reviewer-lite), and agent-readiness-kit. They explore the same idea from different angles: how do we make AI-assisted development more reliable before code is generated, while code is reviewed, and before a workflow depends on agents?

For me, AI does not replace the fundamentals. It makes them more important.

The engineers who get the most out of AI are not the ones who accept output the fastest. They are the ones who know how to frame the work, evaluate the result, and stay responsible for the product.

## Further reading

- [LMArena](https://arena.ai/) — the leaderboard referenced above; worth checking periodically rather than trusting a single snapshot, since rankings move with each model release.
- [Model Context Protocol](https://modelcontextprotocol.io/) — the open standard behind editor-integrated tool use; relevant background for anyone connecting AI tooling into an existing editor or CI workflow, covered in more depth in [my MCP writeup](/writing/why-i-automate-code-review-with-mcp).
- [Cursor's documentation](https://docs.cursor.com/) — for the specifics of rules files, context windows, and multi-file edit behavior referenced above.

## Related reading

- [How I approach senior frontend architecture](/writing/how-i-approach-senior-frontend-architecture)
- [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp)
- [Building tools that don't fight you](/writing/building-tools-that-dont-fight-you)
