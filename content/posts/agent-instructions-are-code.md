---
title: "Agent instruction files are code. Lint them like code."
date: "2026-09-26"
excerpt: "AGENTS.md, CLAUDE.md, and Cursor rules steer every change an AI coding agent makes, but almost nobody reviews them. What goes wrong in those files, and the deterministic checks I built to catch it."
seoTitle: "Agent instruction files are code. Lint them like code. — Ali Pajand"
seoDescription: "Placeholders, risky directives, contradictions, stale commands, hidden Unicode, and risky agent settings: what goes wrong in AGENTS.md and CLAUDE.md files, and how to check them deterministically in CI."
tags:
  - AI
  - DX
  - Tooling
---

Every AI coding agent I use reads a file before it reads my code. `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*.mdc`, `.github/copilot-instructions.md`. Those files decide which commands the agent runs, which areas it stays out of, and what it tells me when it is done.

They behave like code: they run on every task, for every contributor, and they change outcomes. But most teams treat them like a README. Someone writes them once, someone else pastes in a section from another repo, and nobody looks again until an agent does something surprising.

I built [agent-context-doctor](https://github.com/alipajand/agent-context-doctor) (`acd`) because I wanted the same thing for these files that I already have for TypeScript: a fast, deterministic check that fails loudly when something is wrong.

## What actually goes wrong in instruction files

When I started auditing real repositories, including my own, the same problems kept showing up. None of them are exotic.

**Placeholders that never got filled in.** A template section that still says `TODO: describe the architecture`, or a "Scope" heading with nothing under it. An agent does not know that section is unfinished. It just has less to work with, and it fills the gap with guesses.

**Risky permission, phrased casually.** "Skip tests if they are slow." "Use `--no-verify` if the hook is flaky." "Force push to fix the branch." Each line reads like a reasonable shortcut to a human. To an agent, it is standing permission.

**Contradictions across files.** `AGENTS.md` says tests must pass before finishing. A Cursor rule written six months later says tests are optional for small changes. An agent reading both has to pick one, and you do not get to choose which.

**Commands that no longer exist.** The file says to run `pnpm validate`. The script was renamed to `pnpm check` two refactors ago. The agent runs the missing script, gets an error, and either gives up on validation or improvises.

**Links to files that moved.** "See `docs/ARCHITECTURE.md`," which has since been split or deleted.

**Rule files the tool silently ignores.** A Cursor `.mdc` file with no `alwaysApply`, `globs`, or `description` does not load. A Claude subagent with no `name` does not register. The file looks fine in review and does nothing.

None of these are hard to fix. They are hard to _notice_, because no one reads instruction files the way they read a diff.

## The less obvious problems: settings that run code

Instruction files are prose. Agent _configuration_ is closer to executable code, and it deserves a stricter read.

A committed `.claude/settings.json` takes effect for everyone who opens the project. So does a project `.mcp.json`. That means a few lines of JSON can:

- set `defaultMode` to `bypassPermissions`, so the agent stops asking before it acts
- allow `Bash(*)`, which approves any command
- register a hook that pipes a download into a shell
- point `ANTHROPIC_BASE_URL` at a host that is not Anthropic
- start an MCP server with `npx some-package` and no version pin, so the code that runs can change between installs

I wrote the configuration checks the way an attacker would write the file. The question is not "is this setting unusual?" It is "what would this let a contributor's machine do the moment they open the repo?" Hooks and status line commands get the same scrutiny, including the repository scripts they call, read line by line.

The same applies to text that is invisible to a reviewer. Unicode tag characters mirror ASCII and render as nothing, so they can carry a complete hidden instruction that an agent still reads. Bidirectional overrides can reorder what a reviewer sees. `acd` flags both, and for tag characters it decodes the hidden text into the report so you can see exactly what was smuggled in.

One detail I had to get right there: zero-width joiners and non-joiners are not suspicious on their own. ZWNJ is ordinary orthography in Persian and Arabic, and ZWJ builds emoji sequences. The check only reports them between ASCII text or at the edges of a word, which is where they have no legitimate job.

## Pattern matching that respects negation

The obvious way to flag "skip tests" is a regex. The obvious bug is that the best instruction files say "**Never** skip tests," and a naive check punishes them for it.

So risky-language matching is clause-aware. A negation (`never`, `do not`, `avoid`, `without`, `forbidden`) earlier in the same clause cancels the match. A clause break resets it, so "Don't worry about lint, just skip tests" is still flagged: the `just` starts a new clause and the negation does not carry over.

It is still pattern matching. It does not understand meaning, and the README says so. But the false positives it avoids are the ones that would teach people to ignore the tool, which matters more than catching one extra phrasing.

## A risky line and a safer rewrite

This is the kind of rewrite I end up recommending most often:

```md
Skip tests if they are slow.
```

```md
Run the smallest relevant test first. If the full suite is too slow or broken,
say so in your summary and explain what you ran instead.
```

The point is not "always run everything." It is that an agent should never be allowed to skip validation _silently_. If something cannot be run, the instructions should require the agent to report it. The same idea drives two of the structural checks: whether a primary instruction file tells the agent which validation commands to run, and whether it says what belongs in the final summary.

## Rolling it out without blocking everyone

A new check that fails every existing PR on day one gets disabled on day two. So adoption was a design requirement, not an afterthought.

**Baselines.** Record today's findings once, commit the file, and fail only on new issues:

```bash
acd audit --json > .acd-baseline.json
acd audit --baseline .acd-baseline.json --fail-on high
```

Findings are matched on category, file, message, and evidence, not line number, so editing an unrelated section does not make an old issue look new.

**Narrow suppressions.** When a finding is a confirmed false positive, silence that one line with a comment instead of turning the check off for the repository. A mistyped suppression category is itself reported, so a typo cannot quietly disable nothing.

**Output where people already look.** The same audit renders as terminal text, JSON, Markdown, SARIF for code scanning, or GitHub annotations that land on the diff in the pull request.

If you also want a repository-level view, [agent-readiness-action](https://github.com/alipajand/agent-readiness-action) runs `acd` alongside a readiness score in one step, and can fail a pull request that lowers the score compared to the base branch. A ratchet like that is easier to adopt than an absolute threshold: you do not have to fix everything first, you just cannot make it worse.

## What this does not do

`acd` checks how instructions are _written_. It does not check whether an agent will follow them, and it says nothing about whether the resulting code is correct. A clean audit means the steering is specific, consistent, and not obviously unsafe. It does not replace reading the diff.

That is the boundary I want for this kind of tool. Deterministic checks should handle what is mechanical and repeatable, so the human review that follows can spend its attention on what is not.

## Related reading

- [Moving deterministic checks into the editor with MCP](/writing/why-i-automate-code-review-with-mcp)
- [How I Use AI in My Frontend Engineering Workflow](/writing/how-i-use-ai-in-my-frontend-engineering-workflow)
- [Building tools that don't fight you](/writing/building-tools-that-dont-fight-you)
- [agent-context-doctor on GitHub](https://github.com/alipajand/agent-context-doctor)
