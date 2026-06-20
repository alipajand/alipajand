---
title: "Building tools that don’t fight you"
date: "2026-02-26"
excerpt: "A short framework for evaluating whether a design system, developer tool, or AI feature is actually helping the work instead of adding another layer around it."
seoTitle: "Building tools that don’t fight you — Ali Pajand"
seoDescription: "A short framework for evaluating whether a design system, developer tool, or AI feature is actually helping the work instead of adding another layer around it."
featured: true
tags:
  - Design systems
  - DX
  - Tooling
---

Most of my work circles the same question: how do you build tools people actually use, trust, and then stop thinking about?

The tool changes. Sometimes it is a design system. Sometimes it is editor automation. Sometimes it is an AI recommendation layer inside a product workflow. The test stays the same.

## The adoption test

I use a simple framework to tell whether a tool is helping or just adding ceremony:

1. Does the tool appear where the decision happens?
2. Is its contract explicit?
3. Is failure visible?
4. Can users override it safely?
5. Is the preferred path easier than bypassing it?

If several answers are no, the tool is probably fighting its users, no matter how polished the implementation looks.

## How tools fight their users

Tools usually become frustrating in predictable ways.

They live in the wrong place. The design system hides in a wiki nobody checks during implementation. The validation workflow only speaks up in CI after the author has already moved on. The AI layer writes polished prose without showing what shaped it.

They also hide too much. A component looks reusable until a real accessibility or failure state appears. A local tool runs commands but does not explain what failed. A recommendation engine gives advice without showing its limits.

And they are often easier to bypass than to use properly. That is the clearest failure signal. When a one-off component, a skipped check, or a generic prompt is the path of least resistance, the system has an adoption problem, not just a documentation problem.

## The same pattern in three different systems

In [Design systems that stick](/writing/design-systems-that-stick), I write about a common adoption pattern: product teams bypass shared components when the contract does not cover the states they actually need. The fix is usually not more evangelism. It is better component APIs, clearer documentation, migration paths, and explicit accessibility requirements.

In [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp), the issue was not whether lint, types, and tests existed. It was where they appeared and how usable their output was. Structured editor-local feedback beats making authors wait for CI to rediscover deterministic failures.

In [Teaching MapBylaw to give honest AI recommendations](/writing/mapbylaw-ai-recommendations), the constraint was trust. Narrowing the context and validating the output made the AI feature less expansive, but more believable. That is a good trade in a product that already has strict rules about verified data.

The same test holds across all three. Once the tool drifts away from the moment of decision, hides its rules, or makes the workaround easier, it stops feeling like support and starts feeling like overhead.

## What I optimize for

I want tools that make the correct behavior feel ordinary.

That usually means clear rules, visible failure, and a safe path that is easier than the workaround. It also means leaving room for judgment. A design system should not absorb domain logic. An MCP tool should not pretend to perform full code review. An AI recommendation layer should not speak beyond verified product knowledge.

Safe override matters here too. Good tools do not trap users in a false binary between "use the system exactly as designed" and "bypass it completely." They make the supported path obvious, but they also leave a controlled way to handle the cases the shared path does not cover yet. That is equally true for product components, local validation workflows, and constrained AI features.

When a tool gets those boundaries right, people stop treating it as an initiative. It just becomes part of the work, which is the highest compliment I know how to give a system.

## Related reading

- [Design systems that stick](/writing/design-systems-that-stick)
- [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp)
- [Teaching MapBylaw to give honest AI recommendations](/writing/mapbylaw-ai-recommendations)
