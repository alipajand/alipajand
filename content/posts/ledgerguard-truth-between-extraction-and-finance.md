---
title: "The quiet failure mode in contract AI: when the UI believes the wrong row"
date: "2026-04-21"
excerpt: "On LedgerGuard, the hard problem is not 'can we extract dates from a PDF?' It is making renewal and spend readouts stay honest when queues, idempotent workers, and humans disagree."
tags:
  - Product engineering
  - B2B SaaS
  - AI
---

Finance does not lose money at signature. It loses money when a renewal auto-extends, a notice window closes unseen, or a price escalator nobody modeled shows up on the invoice. [LedgerGuard](https://ledgerguard.io/) only works if users can trust what the product says.

That trust breaks in a very specific, very boring way: two representations of the same contract disagree, and the interface picks one without telling the user why.

## The failure mode is architectural

OCR, layout parsing, and model-assisted field proposals are hard problems. They are also familiar ones. You can improve extraction quality with retries, fallback parsers, review queues, and better evaluation.

The deeper problem shows up after extraction. Contract data moves through an asynchronous pipeline. Workers can replay. Internal callbacks can arrive twice. A synthesis step can fail while extracted fields are still useful. A human reviewer can correct a critical field after synthesis already exists.

If the interface simply reads "the commitment row" or "the latest write," it can show a clean renewal date that is stale, partial, or unsupported by the most recent verified field evidence. In a finance product, that is not a harmless UI bug. It is overstated certainty around money and time-sensitive obligations.

The motivating constraint was straightforward: LedgerGuard needed clause-backed renewal and spend visibility, but the data behind those views was produced by a replayable pipeline with human intervention in the middle. That ruled out a naive "last row wins" design.

## Separating proposal from truth

The product is intentionally split into two layers.

The probabilistic layer extracts and proposes structure from documents. It is allowed to be uncertain. It is allowed to fail. It is not allowed to write tenant truth directly.

The deterministic layer owns typed APIs, audit trails, tenant-scoped rules, persisted read models, and the logic that decides what the UI is allowed to claim. Workers talk back through internal authenticated routes. The API validates, reconciles, and persists.

Letting the extraction pipeline own the final portfolio rows directly and patching edge cases later would have been simpler to ship at first, but it would have made recovery logic implicit and trust hard to explain. Once the product has both extracted fields and synthesized commitments, you need an explicit truth policy anyway.

The cost is more state. You now have to represent honest incomplete states instead of always displaying a clean result. For LedgerGuard, that was the right trade. Finance users need to know when the ledger is incomplete more than they need a tidy card.

## What the lifecycle actually looks like

The useful way to think about the system is not "upload a PDF and get a number." It is a lifecycle with several chances for disagreement:

1. A contract is uploaded and queued for OCR and extraction.
2. Extraction produces field-level proposals with source evidence.
3. The deterministic API stores those fields and records their provenance.
4. A synthesis step turns verified field combinations into a cleaner commitment row used by portfolio views.
5. If a worker replays, an idempotent callback can safely skip duplicate work instead of corrupting the ledger.
6. A human reviewer can verify or correct a field when the extracted value is incomplete, wrong, or ambiguous.
7. If that correction invalidates an existing synthesized commitment, the system marks the state honestly and waits for resynthesis or reconciliation instead of pretending nothing changed.
8. UI surfaces read through the deterministic truth policy, not directly from whichever table happened to update last.

```text
upload -> extract fields -> persist provenance -> synthesize commitment
   -> human review/correction -> resynthesize or mark incomplete
   -> UI reads deterministic truth state -> reconcile when aligned
```

That lifecycle matters because each stage can succeed while a downstream stage fails. Extraction can be valid while synthesis is missing. A commitment can exist while its source provenance is no longer current. Human correction can be newer than the last synthesized output. Those are not rare exceptions in document-heavy systems. They are the product.

## Truth precedence is the real feature

The core design choice was to treat truth precedence as a product feature rather than an implementation detail. The UI is only as honest as the precedence rules behind it.

Here is the simplified policy:

| State                                        | Preferred source                                                                 | What the UI shows                                                                       |
| -------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Matching verified field and commitment       | Commitment row, with field evidence in reserve                                   | Normal renewal or spend view, plus traceable source evidence                            |
| Newer field than synthesized commitment      | Verified field takes precedence for freshness; commitment is treated as stale    | A bounded warning that the displayed summary is awaiting refresh or verification        |
| Human correction awaiting resynthesis        | Human-corrected field is authoritative, but the derived commitment is incomplete | The corrected value, explicit incomplete status, and a prompt that synthesis is pending |
| Commitment without current source provenance | Commitment is not trusted as fully current on its own                            | A visible caution that the summary exists but source alignment is incomplete            |
| Conflicting values                           | Neither side is silently promoted to clean truth                                 | Conflict state, highlighted disagreement, and a review path                             |
| Fields-only state                            | Verified fields are usable even if no synthesized commitment exists yet          | Partial portfolio/detail readout with incomplete-state messaging                        |

LedgerGuard goes the other way. If the system cannot honestly say "this contract has a clean current commitment," the UI should not imply that it does.

## What each surface is allowed to claim

Once the precedence rules were explicit, the UI became easier to reason about.

List and dashboard views are allowed to summarize only what the read model can defend. If commitment and field evidence align, the product can show a standard renewal state. If newer verified field data exists than the current synthesized commitment, the dashboard can still be useful, but it has to say that the summary is being realigned.

Detail views can expose more nuance. They can show field evidence, provenance, verification status, and exactly where disagreement lives. That is the right place for a reviewer to understand whether the problem is extraction quality, synthesis lag, or a human correction that has not been incorporated yet.

Review workflows need the opposite bias from dashboard cards. A dashboard card wants a concise answer. A review surface needs to show why the answer is not yet clean. That is where source-backed fields, validation errors, partial extraction, and human correction all need to stay legible.

## Why honest incompleteness is worth the extra UI

The most important trade-off is also the least glamorous one: preferring honest incomplete states over always displaying a polished result.

That means more visual states, more warning copy, and more engineering time spent on reconciliation instead of only on the happy path. It also means accepting that some portfolio views will show "not yet aligned" instead of a confidently filled card.

If a model or worker pipeline is wrong, the failure should be visible. If a human has corrected a source field, that correction should not disappear behind a stale synthesized row. If the product cannot support a claim with current provenance, it should not present the claim as settled.

The implementation follows from that principle: idempotent workers prevent duplicate writes, deterministic callbacks preserve domain invariants, and read models surface drift instead of flattening it away.

## The reusable lesson

If you are building AI around money, legal obligations, or regulated workflows, the differentiator is often not the model. It is whether someone can trace the path from source document to displayed value without crossing a black box.

The framework I keep coming back to is simple:

- Separate probabilistic proposal from deterministic truth.
- Decide precedence explicitly before you need it in production.
- Let the UI reflect incomplete or conflicting states honestly.
- Treat human correction as a first-class input, not an afterthought.

The moment you optimize for "always show a clean renewal card," you have already made a product decision. LedgerGuard works better when the decision is the opposite: show the renewal card only as honestly as the available evidence allows.

## Related reading

- [Teaching MapBylaw to give honest AI recommendations](/writing/mapbylaw-ai-recommendations)
- [How I approach senior frontend architecture](/writing/how-i-approach-senior-frontend-architecture)
- [Building tools that don't fight you](/writing/building-tools-that-dont-fight-you)
