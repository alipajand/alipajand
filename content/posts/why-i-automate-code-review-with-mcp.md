---
title: "Moving deterministic checks into the editor with MCP"
date: "2026-01-15"
excerpt: "Why I use MCP to run deterministic local checks in the editor, what that buys over scripts or hooks alone, and where human review still starts."
seoTitle: "Moving deterministic checks into the editor with MCP — Ali Pajand"
seoDescription: "Why I use MCP to run deterministic local checks in the editor, what that buys over scripts or hooks alone, and where human review still starts."
tags:
  - DX
  - Tooling
---

Code review should spend human attention on behavior, architecture, naming, and product risk. It should not spend that attention on whether someone forgot to run lint.

That is why I moved deterministic checks into the editor with [MCP](https://modelcontextprotocol.io/), the Model Context Protocol, the open standard Anthropic introduced for connecting LLM applications to external tools and data sources. Not because lint, typecheck, and tests are "full code review," but because they are the wrong things to discover late.

## Why MCP instead of a shell script, hook, or CI-only loop

Shell scripts, Git hooks, and CI all have value. I still use local scripts and I still trust CI as the authoritative merge gate.

The question was where deterministic feedback should appear first.

A shell script is easy to write, but it still depends on the developer deciding when to run it and then parsing terminal output manually. A Git hook runs automatically, but usually at a fixed moment like pre-commit or pre-push, which is later than I want and less flexible. CI is essential, but it is the slowest place to learn about a broken type or test.

MCP was the right fit because it put the checks where the decision happens: inside the editor, attached to the files being changed, with structured results tooling can interpret instead of just printing.

That is the key architectural choice. I did not primarily need "a thing that can run commands." I needed a thin tool boundary that lets the editor call allowed commands, return structured output, and keep feedback local to the code being edited. The protocol's own [specification](https://modelcontextprotocol.io/specification/2025-06-18) describes this as separating "the concerns of providing context from the actual LLM interaction": tools, resources, and prompts are exposed in a standardized shape so the client (the editor, in this case) decides how to use the result instead of the server assuming a terminal is on the other end.

## What structured tool output enables

Once the checks are exposed as tools instead of terminal habits, the output can be shaped for use instead of display.

Structured output enables:

- file- and line-aware issue reporting in the editor
- consistent summaries across lint, typecheck, and tests
- easier composition with agent workflows that need deterministic check results
- predictable handling of failures, truncation, and timeouts

That matters because raw shell output is optimized for a terminal, not for a workflow. MCP lets the editor ask for a result and then decide how to present it.

A lightweight editor task that shells out to existing scripts can be enough for solo work, but it does not provide the same tool contract for structured consumption or broader automation. MCP adds one more layer to define and maintain, and I think that is justified when you want the checks to behave like reliable tools rather than one-off commands.

## Guardrails: allowlists, timeouts, and output limits

The server should be narrow on purpose.

For this kind of workflow, the important safety boundary is not "MCP is magic." It is that the exposed commands are allowlisted, predictable, and small in scope. If the tool is meant to run lint, typecheck, tests, or format checks, then those are the commands it should expose. Not arbitrary shell access. This is also the boundary the MCP spec itself flags under its security guidance: a server should expose the minimum surface area it needs to do its job, since anything connected to an editor or agent is also a trust boundary, not just a convenience boundary.

Timeouts and output limits matter for the same reason. Deterministic checks should fail clearly when they hang or produce too much output. A local tool that can wedge the editor or dump unbounded logs is not helping.

If the implementation targets only changed files for some checks, that is useful for speed, but it should be treated as an optimization rather than a trust boundary. Changed-file targeting can reduce noise for lint or tests, but the full project still needs authoritative validation elsewhere.

The point is to make the local loop fast and safe, not to pretend the local loop is the final judge.

## Local checks versus authoritative CI

This is where the distinction matters most.

Local MCP-driven checks are for early feedback. CI is still the authoritative shared environment. It is the merge gate, the branch-level record, and the place where the full repository runs in a standardized context.

The local loop answers: "Did I just break something obvious while editing this feature?"

CI answers: "Does this change pass the full project standard in the environment we trust for integration?"

Those are complementary responsibilities. I do not want reviewers to assume that passing local checks means the change is correct. I want them to assume that basic deterministic failures have already surfaced early, so review time can focus on product and architectural judgment.

## What remains exclusively human review work

This is the line I care about protecting.

Human review is still responsible for:

- whether the change solves the right problem
- whether the ownership boundaries are sound
- whether the naming and abstractions are understandable
- whether the failure handling is honest
- whether the product, security, or accessibility trade-offs are acceptable

No lint rule or local test command can answer those questions for you.

If the workflow needs deterministic PR-risk inspection beyond local checks, that belongs in purpose-built tooling such as [Agent PR Reviewer Lite](https://github.com/alipajand/agent-pr-reviewer-lite), which inspects diffs with explicit deterministic rules. That is a different job from an MCP server that primarily exposes local validation commands inside the editor.

## Comparison

| Approach                        | Best at                                                                | Weakness                                                     |
| ------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| MCP in the editor               | Fast, structured, file-aware local feedback where code is being edited | Extra tool layer to maintain; not an authority on its own    |
| Local scripts or Git hooks      | Simple automation around existing commands                             | Less structured output and usually weaker editor integration |
| CI                              | Authoritative shared validation and merge gating                       | Slowest feedback loop for the author                         |
| Deterministic PR-review tooling | Diff-aware policy and risk inspection beyond basic checks              | Different scope from local edit-time validation              |

## Why I keep this setup

I use MCP here because it improves where and how deterministic checks show up, not because it replaces review.

The implementation idea is intentionally modest:

- expose a small set of allowed validation commands
- keep results structured enough for editor use
- bound runtime with timeouts and output limits
- use local checks for speed and CI for authority

That is enough to move a lot of mechanical failure discovery earlier in the workflow.

The reusable lesson is broader than MCP itself. Deterministic checks should appear as close as possible to the moment an engineer makes the change. Human review should begin where deterministic checking stops.

## Further reading

If you are evaluating whether to build a server like this rather than taking my word for the shape of it, a few starting points are worth more than a blog post:

- The [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18) itself, particularly the Tools and Security & Trust sections, before writing any server code.
- The official [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and [Python SDK](https://github.com/modelcontextprotocol/python-sdk), both maintained under the `modelcontextprotocol` organization.
- The [MCP Inspector](https://github.com/modelcontextprotocol/inspector), a standalone tool for testing a server's tool calls and structured output without wiring it into an editor first: useful for exactly the allowlist and timeout testing described above.
- Editor-side, both [Claude Code](https://docs.claude.com/en/docs/claude-code) and Cursor support connecting to MCP servers directly, which is the integration point this whole approach depends on.

## Related reading

- [Building tools that don't fight you](/writing/building-tools-that-dont-fight-you)
- [Design systems that stick](/writing/design-systems-that-stick)
- [How I Use AI in My Frontend Engineering Workflow](/writing/how-i-use-ai-in-my-frontend-engineering-workflow)
- [Agent PR Reviewer Lite](https://github.com/alipajand/agent-pr-reviewer-lite)
