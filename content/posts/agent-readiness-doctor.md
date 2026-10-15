---
title: "Keeping repository instructions useful with Agent Readiness Doctor"
date: "2026-10-12"
excerpt: "A refactor can leave the code healthy and its instructions wrong. How I would use Agent Readiness Doctor to make instruction maintenance part of the development workflow."
seoTitle: "Agent Readiness Doctor: repository instruction maintenance — Ali Pajand"
seoDescription: "Practical ways to use Agent Readiness Doctor after refactors, during onboarding, and when reviewing repository guidance."
tags:
  - DX
  - Tooling
  - Open Source
---

A refactor can leave every test green while making the next developer's first hour harder. A setup command still points
to a removed script. An architecture note names a directory that no longer exists. Two instruction files describe
different validation steps.

Those are maintenance bugs. They deserve a place in the development workflow alongside the code changes that caused
them.

My [Agent Readiness Doctor contribution](/open-source) is now available in GitBot's in-app Marketplace.
The [public listing](https://gitbot.codeongrass.com/bots/agent-readiness-doctor/) credits me as its creator and links to
the [MIT-licensed source](https://github.com/gitbot-hq/Library/tree/main/bots/agent-readiness-doctor).

## What the bot does

It compares instruction files and agent settings with repository evidence, proposes minimal edits, and applies approved
changes before repeating its checks. It can use `acd` and `ark` if installed, or continue without them.
The [published workflow](https://gitbot.codeongrass.com/bots/agent-readiness-doctor/) describes those boundaries.

## After a refactor: check the instructions people will follow

Imagine moving shared components from `src/ui` to `components`, then renaming a validation script from `verify` to
`check`. The application may build successfully. Neither change necessarily breaks a test that would remind you to
update the onboarding instructions.

I would make instruction review part of closing that refactor. Give the bot a narrow task:

> Compare our repository guidance with the component move and script rename. Show evidence for any outdated references
> and propose the smallest edits.

This is an example prompt, not a report from a measured deployment. The useful outcome would be a short diff that a
maintainer can evaluate alongside the refactor, while the reasons for the changes are still fresh.

## During onboarding: turn confusion into a concrete question

An unfamiliar repository often has several plausible sources of truth: a README, a contributor guide, package scripts,
and editor-specific rules. If they disagree, a new contributor has to reconstruct the intended workflow before doing
useful work.

I would start with a specific question: which documented validation steps correspond to commands that actually exist?
Then I would ask a maintainer to resolve anything the code cannot explain.

For example, finding both a unit-test command and an integration-test command does not establish which one is required
for a documentation change. That is a team decision. A useful audit makes the ambiguity visible; the team still needs to
settle the policy.

## Keep the review small enough to understand

I would separate factual corrections from policy changes. Updating a verified directory reference is easy to assess.
Changing when contributors may skip a check needs a different conversation.

The review questions I would use are:

- Does the replacement command or path exist?
- Does the edit preserve the reason the original instruction was written?
- Are we resolving a contradiction or merely making the wording more uniform?
- Will the next contributor understand what to do when validation fails?

The last question matters especially. A command alone does not explain whether a failure is expected locally, requires a
service, or should stop the work. Good instructions make those decisions explicit.

## Where the MCP server and plugins fit

Agent Readiness Doctor is the GitBot contribution. The separate [Agent Readiness integrations](/open-source), released
as v0.1.2, expose the underlying audits through
an [MCP server](https://www.npmjs.com/package/@alipajand/agent-readiness-mcp), a portable skill, and editor plugins.
They share a read-only, offline scanner; the GitBot workflow can propose and apply approved instruction edits.
Installing one does not establish that the other is installed or connected.

The scanner uses deterministic rules rather than model-generated scores. Its host client may still send reports and
files it reads to its model provider.
The [integration documentation](https://github.com/alipajand/agent-readiness-action/blob/main/docs/integrations/MCP-SERVER.md)
describes the MCP tools and tested clients, and
the [publishing matrix](https://github.com/alipajand/agent-readiness-action/blob/main/docs/PUBLISHING-MATRIX.md)
separates released packages from pending directory reviews.

## Try it on one maintenance task

In GitBot, open Marketplace and install Agent Readiness Doctor, then start a thread in your repository.
The [public page](https://gitbot.codeongrass.com/bots/agent-readiness-doctor/) includes setup details and the full
instructions.

I would begin with one recently changed area, review the proposed diff, and record unresolved decisions for the
maintainer. That gives the exercise a clear finish: accurate guidance for a real task, rather than a more
impressive-looking document.

For the deterministic checks behind this work,
read [Agent instruction files are code. Lint them like code.](/writing/agent-instructions-are-code).
My [open-source page](/open-source) brings the bot contribution and related tools together.

For the packaging and acceptance work behind those integrations,
read [How to prepare integrations for the Anthropic and Cursor directories](/writing/preparing-integrations-for-anthropic-and-cursor-directories).

<figure class="article-launch-poster">
  <a href="https://gitbot.codeongrass.com/bots/agent-readiness-doctor/" rel="nofollow">
    <img src="/writing/agent-readiness-doctor-poster.png" width="1080" height="1080" alt="Agent Readiness Doctor launch poster from GitBot" loading="lazy" decoding="async" />
  </a>
</figure>
