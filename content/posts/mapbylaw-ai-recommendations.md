---
title: "Teaching MapBylaw to give honest AI recommendations"
date: "2026-02-26"
excerpt: "How I moved from vague, ChatGPT-flavored suggestions to grounded, auditable AI recommendations inside a real zoning and feasibility product."
seoTitle: "Teaching MapBylaw to give honest AI recommendations — Ali Pajand"
seoDescription: "How I moved from vague, ChatGPT-flavored suggestions to grounded, auditable AI recommendations inside a real zoning and feasibility product."
tags:
  - Product engineering
  - AI
---

On MapBylaw, "AI recommendations" cannot just sound smart. They have to survive contact with a planner, a skeptical developer, and a 10-page report. If the text is not grounded in zoning rules, feasibility math, and the same verified datasets the rest of the product uses, it is just copy with a chatbot accent.

This is how I moved the feature from vague suggestions to recommendations that are specific, auditable, and aligned with our report content policy.

## Problem: vague advice with no contract

A typical first failure is not bad writing. It is letting the model speak too freely.

Generic recommendation output can sound plausible without being tied tightly enough to the parcel, zoning constraints, PUM 2050 sector, heritage or climate flags, or the scenario calculations already produced elsewhere in the product.

The architectural problem was just as important. The Fastify API, the React dashboard, and the React-PDF report did not yet share one obvious recommendation contract. That made it harder to prove what the model had seen, harder to validate what it returned, and harder to guarantee that the dashboard and PDF rendered the same thing.

Keeping the recommendations loosely typed and treating them as presentation copy would have been faster short term, but it would have created drift between API payloads, product UI, and report output at the exact point where users expect consistency.

## Solution: narrow context and typed output

The turning point was treating AI recommendations as a typed product service, not a black box hanging off the side of the app.

The context builder only includes inputs the product already considers verified. In simplified form, it looks like this:

```ts
type RecommendationContext = {
  propertyId: string;
  zoningCode: string;
  pum2050Sector: string | null;
  heritageFlag: boolean;
  climateConstraint: boolean;
  feasibilityScore: number | null;
  scenarios: Array<{
    id: string;
    label: string;
    status: "viable" | "constrained" | "not-supported";
    keyConstraints: string[];
  }>;
};
```

That narrow shape is deliberate. The model gets zoning, sector, policy flags, feasibility signals, and scenarios we have already computed. It does not get permission to improvise market facts or infer hidden municipal rules.

The output is also constrained:

```ts
type StructuredRecommendation = {
  summary: string;
  scenarioId: string;
  recommendationType: "pursue" | "revise" | "avoid";
  rationale: string[];
  citedInputs: string[];
  limitations: string[];
};
```

I traded breadth for grounding. Broader context can produce more expansive recommendations, but it also increases the chance that the model starts sounding authoritative about facts the product has not actually verified.

This is not a problem unique to MapBylaw, which is partly why the structured-output ecosystem around LLMs has matured the way it has. [Zod](https://zod.dev/) is what I use for the schema definition and parsing layer at the API boundary. Anthropic's [developer documentation](https://docs.claude.com/) covers tool use and structured output, and OpenAI's equivalent structured-outputs feature exists for the same reason — "ask the model nicely to return JSON" was never a reliable contract. Constraining the output shape at generation time, then validating again on receipt, is the pattern that actually holds in production.

## Validation is what makes the feature believable

Once the context and output were explicit, validation became part of the feature instead of an afterthought.

An example of valid input is small and boring, which is exactly what you want:

```ts
const context: RecommendationContext = {
  propertyId: "prop_1284",
  zoningCode: "R3-12",
  pum2050Sector: "Urban corridor",
  heritageFlag: false,
  climateConstraint: true,
  feasibilityScore: 0.72,
  scenarios: [
    {
      id: "scenario_b",
      label: "Plex + ADU",
      status: "viable",
      keyConstraints: ["Height cap", "Parking waiver not assumed"],
    },
  ],
};
```

A valid output has to reference that world. It needs a known `scenarioId`, an allowed recommendation type, and rationale tied to inputs the system can point back to.

A rejected output is easy to recognize:

```ts
const invalid = {
  summary: "Build a 20-unit tower for maximum ROI.",
  scenarioId: "scenario_z",
  recommendationType: "go-big",
  rationale: ["Nearby comps support luxury absorption."],
  citedInputs: ["market-trends-api"],
  limitations: [],
};
```

That response fails for multiple reasons. It points to an unknown scenario, uses an unsupported enum value, and cites inputs outside the verified product contract. The right behavior is rejection, not cleanup. If the model steps outside the schema, the system should fail fast.

## What the model is not allowed to do

This was the most important product boundary to state clearly.

The model is not allowed to:

- Invent parcel facts, market figures, incentives, or policy exceptions.
- Reference datasets that are not part of the verified property-analysis pipeline.
- Recommend scenarios the product has not already computed.
- Hide missing data behind generic confidence-sounding prose.
- Diverge between dashboard and PDF payloads.

That boundary is why narrow context works. It keeps the model grounded in verified product knowledge, even though it limits recommendations to what the system already knows.

A narrow context builder will not produce sweeping strategic commentary. It will also avoid pretending that a product with constrained verified inputs has a right to give sweeping strategic commentary.

## End-to-end flow: from domain data to dashboard and PDF

The full flow matters more than the prompt.

First, the property analysis pipeline produces verified domain inputs: zoning data, PUM 2050 sector, heritage and climate flags, feasibility signals, and scenario outputs. Those inputs already exist because the rest of the product depends on them.

Second, the recommendation orchestrator builds the narrow context payload from those verified fields only. That payload is sent to the model with instructions aligned to the report content policy.

Third, the model returns a structured payload that is validated through the same contract used by the API boundary. Malformed or unsupported responses are rejected before they reach presentation layers.

Fourth, the accepted recommendation payload becomes part of the typed application state consumed by both the dashboard and the PDF builder. The same structured result powers the in-app recommendation card and the report section, so there is no copy-editing fork where one surface says something the other cannot defend. This is the same "one typed payload, multiple surfaces" discipline I describe at the data-truth level in [the LedgerGuard writeup](/writing/ledgerguard-truth-between-extraction-and-finance) — different domain, same architectural instinct.

Fifth, if policy rules, incentive logic, or scenario rules change, the context builder and schema update with them. That keeps the recommendation layer moving with the verified domain model instead of becoming its own undocumented product.

## Why narrowing the contract was the right move

MapBylaw already had strong constraints: no static or fake data, no region-hardcoded fallbacks pretending to be real, and consistency between app surfaces and reports.

Given those constraints, the better move was not "make the model smarter." It was "make the contract narrower and more enforceable."

A more expressive but less governable AI layer might have looked impressive in isolated demos. It would have been harder to audit, harder to test, and more likely to drift away from the product's actual zoning and feasibility logic.

The implementation behaves better because it is stricter. Tests can reject malformed payloads early. Engineers can trace recommendations back to the scenario-level inputs that shaped them. Users get guidance that feels like part of MapBylaw, not a detached chatbot layered on top.

## Reusable lesson

In applied AI products, "good recommendations" usually start earlier than prompt writing. They start with whether the rest of the system has decided what counts as verified input, what output is allowed, and what should happen when the model wanders outside that boundary.

The lesson I would reuse is simple:

- Narrow the model's context to facts your product already trusts.
- Make output schema validation non-optional.
- Share one typed payload across every surface that presents the result.
- Reject unsupported answers instead of laundering them into something presentable.

That costs flexibility. It buys honesty, which is the more important feature.

## Further reading

- [Zod](https://zod.dev/) — schema definition and runtime validation for exactly this kind of API and model-output boundary.
- [Anthropic's developer documentation on tool use](https://docs.claude.com/) — for constraining model output shape at generation time rather than only validating after the fact.
- [Pydantic](https://docs.pydantic.dev/) — the Python-side equivalent if your recommendation service sits behind a Python API instead of Fastify/Node.

## Related reading

- [The quiet failure mode in contract AI: when the UI believes the wrong row](/writing/ledgerguard-truth-between-extraction-and-finance)
- [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp)
- [Building tools that don't fight you](/writing/building-tools-that-dont-fight-you)
