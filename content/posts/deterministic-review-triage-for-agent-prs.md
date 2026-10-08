---
title: "Which agent-written changes does a human need to read?"
date: "2026-08-08"
excerpt: "Agent-generated pull requests touch more files than a reviewer can read with equal care. A deterministic pre-screen decides where human attention goes first, and why I kept an LLM out of that decision."
seoTitle: "Which agent-written changes does a human need to read? — Ali Pajand"
seoDescription: "A practical approach to triaging AI-generated pull requests with deterministic path and diff rules: auth, billing, migrations, CI, agent permissions, skipped tests, and code owners."
tags:
  - AI
  - Code Review
  - DX
  - Tooling
---

Coding agents changed the shape of my pull requests. A focused change used to touch four files. Now a reasonable agent-assisted change can touch twenty, spread across components, tests, a migration, a config file, and a lockfile.

Most of those files are fine. A few are not the kind of thing anyone should merge on a skim. The review problem is no longer "is this code good?" first. It is "which of these files do I need to read carefully, and who else needs to see them?"

[agent-pr-reviewer-lite](https://github.com/alipajand/agent-pr-reviewer-lite) answers that one question:

> Did this PR touch areas that deserve human review before merge?

It reads the git diff between two refs, applies a fixed set of rules, and reports which files landed in risk-sensitive areas, at what severity, and who owns them.

## Why the triage step should not be an LLM

I use LLM reviewers. They are good at reading code and pointing at suspicious logic. But they are the wrong tool for _routing_ attention, for the same reasons you would not use one as a type checker:

- **Reproducibility.** The same diff should get the same answer every time. If the gate passes on one run and fails on a rerun, people stop trusting it.
- **Auditability.** When the tool flags a file, the reason should be a rule anyone can read, not a judgment call nobody can inspect.
- **Cost and availability.** A pre-screen should run on every push, offline, without an API key in CI.
- **Manipulation.** An LLM reviewer reads the diff as text, which means the diff can talk to it. A path rule does not care what a comment says.

So the rules are plain TypeScript and regular expressions. It is meant to run _before_ or _alongside_ an LLM reviewer: a cheap, predictable first pass that decides where the expensive attention goes.

```diagram
type: compare
title: Routing review attention with an LLM versus fixed rules
caption: LLM reviewers are useful for reading code, but deciding where attention goes needs answers that are repeatable and inspectable.
columns:
  - label: LLM as the triage step
    items:
      - The same diff can get a different answer on a rerun
      - A flag rests on a judgment call nobody can inspect
      - Needs an API key and network access in CI
      - Reads the diff as text, so the diff can talk to it
  - label: Deterministic rules first
    items:
      - The same diff gets the same answer every time
      - Every flag points to a rule anyone can read
      - Runs on every push, offline, with no API key
      - A path rule ignores what a comment says
      - Runs before or alongside an LLM reviewer
```

## What deserves a human, by default

The built-in rules come from asking where a wrong change is expensive, irreversible, or quietly weakens the next review. Roughly three groups.

**Areas where bugs are expensive.** Authentication and sessions, billing and payments, security policies such as row-level security, CORS, and rate limits, and database migrations. These are high severity because the failure modes are account takeover, financial loss, data exposure, or a change you cannot roll back.

**Changes that weaken future checks.** Deleted tests. Added lines that skip or focus a test (`it.skip`, `.only`, `pytest.mark.skip`, `t.Skip`). New lint suppressions like `eslint-disable` or `@ts-expect-error` outside test files. CI workflow edits. `CODEOWNERS` edits. These rarely look dangerous in isolation. Their cost shows up later, when a check that should have caught something does not run.

**Changes to what the agent itself is allowed to do.** `.claude/settings.json`, Claude hooks, `.mcp.json`, and similar files decide which tools an agent may use without asking. A committed `settings.local.json` overrides the shared settings for everyone. A Claude command with an inline `` !`cmd` `` block runs shell before the model even reads the file. When those files change, the reason in the report names the risky keys the change adds, such as `bypassPermissions` or an unrestricted `Bash` rule.

Medium severity covers what deserves a second look rather than a blocker: lockfiles, new dependencies, environment files, infrastructure config, public routes, pricing copy, git hooks, generated files, and agent instruction files.

```diagram
type: layers
title: What the default rules route to a human
caption: The rules group files by why a wrong change hurts, with medium severity reserved for changes that deserve a second look rather than a blocker.
layers:
  - label: Areas where bugs are expensive
    detail: Auth and sessions, billing and payments, security policies, and database migrations. High severity, because failures mean takeover, financial loss, data exposure, or no rollback.
  - label: Changes that weaken future checks
    detail: Deleted tests, skipped or focused tests, new lint suppressions outside tests, CI workflow edits, and CODEOWNERS edits.
  - label: Changes to what the agent may do
    detail: Agent settings, hooks, MCP config, committed local overrides, and commands with inline shell. Reasons name risky keys such as bypassPermissions.
  - label: Second look (medium severity)
    detail: Lockfiles, new dependencies, environment and infrastructure config, public routes, pricing copy, git hooks, generated files, and agent instruction files.
```

The overall risk is simply the highest severity across findings. No weighted scoring. I tried to keep the mental model small enough that nobody needs to read the docs to understand why CI failed.

## Conservative on purpose, and honest about it

Path rules produce false positives. A test helper named `billing-utils-test.ts` matches the billing rule even if it has nothing to do with payments. I made that trade deliberately: a false positive costs a reviewer a moment, while a missed migration in an agent-generated PR can cost a lot more.

What keeps it usable is that the trade-off is explicit and adjustable:

- `ignore` patterns for paths you have decided are safe
- per-rule severity changes, or turning a rule off
- presets for common stacks (`nextjs-saas`, `supabase`, `stripe`)
- `--explain`, which prints exactly which rule triggered and why

Renames are checked against both the old and new path. Moving `src/auth/tokens.ts` to `scratch/tokens.ts` is still an auth change, and an `ignore` pattern hides a rename only if it matches both paths.

## Encoding your own product's risk

The defaults cover what most SaaS products share. The more useful part is describing the areas that are risky in _your_ product, which no generic tool can know.

For [LedgerGuard](/writing/ledgerguard-truth-between-extraction-and-finance), the expensive areas are not just auth and billing. They are document ingestion, the human verification workflow, renewals, the commitments ledger, currency normalization, and tenant isolation. A small config makes those first-class:

```json
{
  "id": "ledgerguard-normalization",
  "label": "Currency normalization changed",
  "severity": "high",
  "patterns": ["apps/api/**/currency/**", "packages/**/normalization/**"],
  "requiredReview": "currency normalization"
}
```

The full example config ships in the repository. Writing it is a useful exercise even before you run the tool: listing the directories where a wrong change would hurt is a short conversation about product risk that many teams have never had explicitly.

## Routing to the right person

Knowing a file is risky is half the job. The other half is knowing who should look. When the repository has a `CODEOWNERS` file, every finding lists the owners of that file, and the required-review summary names them:

```
Required human review:
- auth/session (owners: @org/security)
```

`CODEOWNERS` is read from the base branch, not from the pull request. That is the copy GitHub enforces, and it means a PR that edits `CODEOWNERS` cannot change who reviews that same PR.

```diagram
type: flow
title: From a twenty-file diff to a short review list
caption: Each step is mechanical, so the output is a predictable list of files, severities, and people rather than a verdict on the code.
steps:
  - label: Read the diff
    detail: Compare two git refs, checking renames against both the old and new path.
  - label: Apply rules
    detail: Built-in rules, presets, and your own product's risk areas match changed paths and diff lines.
  - label: Take the max
    detail: Overall risk is the highest severity across findings, with no weighted scoring.
  - label: Find owners
    detail: Each finding lists its CODEOWNERS, read from the base branch rather than the pull request.
  - label: Require review
    detail: The summary names which areas need human review and who should look.
```

## What it does not do

It does not read code. It does not reason across files. It does not tell you a change is correct. A PR with zero findings can still be wrong, and a PR with five high findings can be perfectly fine.

What it does is turn a twenty-file diff into a short list: these files, this severity, these people. That is the part of review that should be mechanical. Everything after it, judging the logic, the naming, the product trade-off, stays with the person reading.

## Related reading

- [Agent instruction files are code. Lint them like code.](/writing/agent-instructions-are-code)
- [Building CI tools for pull requests you don't trust](/writing/ci-tools-for-untrusted-pull-requests)
- [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp)
- [agent-pr-reviewer-lite on GitHub](https://github.com/alipajand/agent-pr-reviewer-lite)
