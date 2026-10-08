---
title: "Building tools that don't fight you"
date: "2026-03-01"
excerpt: "A short framework for evaluating whether a design system, developer tool, or AI feature is actually helping the work instead of adding another layer around it."
seoTitle: "Building tools that don't fight you — Ali Pajand"
seoDescription: "A short framework for evaluating whether a design system, developer tool, or AI feature is actually helping the work instead of adding another layer around it."
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

```diagram
type: flow
title: The adoption test for any tool
caption: A tool earns adoption only when it passes these checks, whatever kind of tool it is.
steps:
  - label: At the decision
    detail: The tool appears where the decision happens, not in a wiki or a late CI run.
  - label: Explicit contract
    detail: Its rules and boundaries are stated, not discovered by trial and error.
  - label: Visible failure
    detail: When something fails, the tool says what failed and why.
  - label: Safe override
    detail: Users have a controlled way to handle cases the shared path does not cover yet.
  - label: Easier than bypass
    detail: The preferred path is the path of least resistance, like a golden path or paved road.
```

That fifth question is not a phrase I invented. It is close to what platform engineering teams call a "golden path," a term Spotify popularized internally (borrowed, by their own account, from the Frank Herbert novel) and that Netflix calls a "paved road." The idea in both cases is the same: the supported way to do something should be the path of least resistance, not a rule enforced after the fact. A platform team that builds the correct path and then has to police people away from the workaround has usually built the wrong path. I am applying the same test to design systems, editor tooling, and AI features, but the underlying mechanism is identical to what platform engineering has been calling out for years at infrastructure scale.

## How tools fight their users

Tools usually become frustrating in predictable ways.

They live in the wrong place. The design system hides in a wiki nobody checks during implementation. The validation workflow only speaks up in CI after the author has already moved on. The AI layer writes polished prose without showing what shaped it.

They also hide too much. A component looks reusable until a real accessibility or failure state appears. A local tool runs commands but does not explain what failed. A recommendation engine gives advice without showing its limits.

And they are often easier to bypass than to use properly. That is the clearest failure signal. When a one-off component, a skipped check, or a generic prompt is the path of least resistance, the system has an adoption problem, not just a documentation problem. This is exactly the failure mode platform engineering literature flags when it talks about "rumor-driven development": the state where the documented process exists, but nobody follows it because tribal knowledge and workarounds are faster, so the org ends up running on whatever the most senior person in the room remembers from last time.

```diagram
type: compare
title: Tools that fight users versus tools that support them
caption: The same three failure modes show up across design systems, editor tooling, and AI features.
columns:
  - label: Tool that fights its users
    items:
      - Lives in the wrong place, like a wiki or a late CI run
      - Hides rules, failure states, and limits
      - Workaround is faster than the supported path
  - label: Tool that supports the work
    items:
      - Appears at the moment of decision
      - Shows its contract, its failures, and its limits
      - Supported path is easier, with a controlled way to deviate
```

## The same pattern in three different systems

In [Design systems that stick](/writing/design-systems-that-stick), I write about a common adoption pattern: product teams bypass shared components when the contract does not cover the states they actually need. The fix is usually not more evangelism. It is better component APIs, clearer documentation, migration paths, and explicit accessibility requirements.

In [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp), the issue was not whether lint, types, and tests existed. It was where they appeared and how usable their output was. Structured editor-local feedback beats making authors wait for CI to rediscover deterministic failures.

In [Teaching MapBylaw to give honest AI recommendations](/writing/mapbylaw-ai-recommendations), the constraint was trust. Narrowing the context and validating the output made the AI feature less expansive, but more believable. That is a good trade in a product that already has strict rules about verified data.

The same test holds across all three. Once the tool drifts away from the moment of decision, hides its rules, or makes the workaround easier, it stops feeling like support and starts feeling like overhead.

## What I optimize for

I want tools that make the correct behavior feel ordinary.

That usually means clear rules, visible failure, and a safe path that is easier than the workaround. It also means leaving room for judgment. A design system should not absorb domain logic. An MCP tool should not pretend to perform full code review. An AI recommendation layer should not speak beyond verified product knowledge.

Safe override matters here too. Good tools do not trap users in a false binary between "use the system exactly as designed" and "bypass it completely." They make the supported path obvious, but they also leave a controlled way to handle the cases the shared path does not cover yet. That is equally true for product components, local validation workflows, and constrained AI features. If you want a deeper public treatment of this exact tension (autonomy versus guardrails), Backstage's own documentation on golden paths covers the same trade-off at the infrastructure layer: a path that cannot be deviated from at all eventually gets routed around entirely, which defeats the point of building it.

When a tool gets those boundaries right, people stop treating it as an initiative. It just becomes part of the work, which is the highest compliment I know how to give a system.

## Further reading

- [Spotify's own explanation of the Golden Path concept](https://backstage.spotify.com/learn/onboarding-software-to-backstage/setting-up-software-templates/11-spotify-templates/): the original source of the term, describing it as the standard, supported route for building something inside the organization.
- [Backstage](https://backstage.io/), the CNCF-hosted open-source platform that grew out of Spotify's internal tooling: useful for seeing the golden-path idea implemented at the infrastructure and scaffolding layer rather than the component layer.

## Related reading

- [Design systems that stick](/writing/design-systems-that-stick)
- [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp)
- [Teaching MapBylaw to give honest AI recommendations](/writing/mapbylaw-ai-recommendations)
