---
title: "How to prepare integrations for the Anthropic and Cursor directories"
date: "2026-10-18"
excerpt: "What I changed in Agent Readiness 0.1.2 to prepare for directory review: plugin documentation, schema validation, honest failure behavior, coordinated versions, and tests of the installed artifact."
seoTitle: "Preparing integrations for Anthropic and Cursor directories — Ali Pajand"
seoDescription: "Lessons from Agent Readiness PR #40: validate plugin manifests, document data handling, test denied execution, and separate a published release from directory approval."
tags:
  - DX
  - Tooling
  - Open Source
---

A plugin can run correctly on your machine and still be unready for a directory submission. The package may be missing documentation where the directory expects it. A manifest can contain a reasonable-looking field that the destination rejects. A command can work when execution is allowed but give a misleading answer when it is denied.

I ran into those gaps while preparing Agent Readiness for the Anthropic plugin directory and Cursor Marketplace. [PR #40](https://github.com/alipajand/agent-readiness-action/pull/40), merged on October 13, 2026, became integrations release 0.1.2.

The audit engines and scoring stayed the same. The work was in packaging, command behavior, documentation, and evidence that the installed integration behaved as advertised.

This is a case study of that release and the checks recorded around it. Directory requirements can change; the specific schema and portal checks below describe what I prepared against in October 2026.

## Start with the artifact each destination receives

Agent Readiness has several ways in: a GitHub Action, a portable skill, editor plugins, and an MCP server. They share audit engines, but they have different installation and review paths.

For the directory work, the relevant artifact was `plugins/agent-readiness/`. It contains the command, skill, bundled scanner, license, and separate Claude Code and Cursor manifests. The repository root carries the marketplace manifests that point to that folder.

That distinction exposed the first problem: repository documentation did not substitute for a README inside the plugin package. The submission check recorded for Anthropic required that local README, with at least 40 words outside code blocks. I added it where the reviewer and installed package could find it.

The useful question became: if someone sees only this package, can they understand what it installs and what it does? The [plugin README](https://github.com/alipajand/agent-readiness-action/blob/integrations-v0.1.2/plugins/agent-readiness/README.md) answers that without requiring a tour of the repository.

## Make the README explain execution and data handling

The README covers purpose, installation, commands, components, runtime requirements, engine provenance, and tested clients. For this plugin, Node.js 22.12 or later is required. The separate MCP server has a different minimum, so I kept its requirements in its own installation documentation.

The most consequential part was describing data handling precisely. There are three separate boundaries:

| Layer              | What the documentation says                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Bundled scanner    | Reads the selected repository, writes nothing, runs no repository scripts, and makes no network requests             |
| Host client        | Reads the report and may send it, or files it reads directly, to its model provider                                  |
| Credential masking | Uses patterns on scanner output; it does not cover arbitrary credential formats or files read directly by the client |

Calling the whole workflow “offline” would blur those boundaries. A local scanner can produce a report that becomes part of a hosted conversation.

I also explained where the bundled code came from: two engines compiled from pinned commits, with their identities included in reports. That gives a reviewer something concrete to trace when inspecting a generated script. The [submission guide](https://github.com/alipajand/agent-readiness-action/blob/main/docs/distribution/SUBMISSIONS.md) records the disclosures used for the directory forms.

## Validate against the destination's schema

The Cursor manifest included `author.url`. That field looked harmless, but the Cursor schema snapshot I checked allowed only `name` and `email` in the author object. I removed the URL and added the supported `displayName` field.

I then added tests for both the plugin and marketplace manifests against schema snapshots from `cursor/plugins` at commit `fe53d9e`. Keeping those snapshots in the test suite made the check repeatable and made its reference version explicit.

This does create maintenance work. A passing test against a pinned schema establishes compatibility with that snapshot. It does not prove compatibility with every later directory rule. Before another submission, I would compare the snapshots with the destination's published schemas and review any changes deliberately.

The regression mattered: the new schema test rejected the previous 0.1.1 manifest. It demonstrated that the test caught the actual submission defect. The implementation is in [the plugin tests at the release tag](https://github.com/alipajand/agent-readiness-action/blob/integrations-v0.1.2/integrations/tests/plugins.spec.ts).

## Give the command an honest failure path

The Cursor command also needed `name` and `description` frontmatter. More importantly, it needed its own rule for what happens when the scanner cannot run.

Previously, the command relied on the skill to supply that rule. I moved the requirement into the command as well: if execution is denied, Node.js is missing, or the script stops before producing a complete report, report that the audit did not run. Give no scores or findings, and do not substitute a manual inspection of the repository.

That last constraint protects the meaning of the result. A model reading files and offering an opinion has not run the deterministic scanner. Presenting that fallback as the requested audit would give the user a result with different guarantees under the same name.

The [released Cursor command](https://github.com/alipajand/agent-readiness-action/blob/integrations-v0.1.2/plugins/agent-readiness/cursor-commands/agent-readiness-audit.md) makes the boundary explicit. A text assertion protects the instruction from accidental removal; a live denied-execution test checks whether the host follows it.

## Test the installed workflow, including denial

PR #40 recorded 138 passing Action tests and 120 passing integration tests. It also recorded signed-in, headless Claude Code runs: the named command and skill produced the scanner's scores, and blocked command tools resulted in no audit scores or replacement file inspection.

Cursor itself was still untested in that PR. The later acceptance runs on October 13 supplied that evidence using Cursor 3.24.12 and the plugin exported from the released tag.

The sequence was deliberately small:

1. Install the released plugin and confirm the host discovers its command and skill.
2. Run the bundled scanner directly on a disposable fixture to establish reference results.
3. Invoke the command in the host and compare scores, issue counts, version, and engine commits.
4. Require command approval, deny execution, and inspect the answer and tool calls.
5. Check that a planted test credential stays masked and the fixture repository remains unchanged.

The first Cursor session could not establish denial behavior because execution happened without a prompt. A second session used an empty command allowlist so approval and denial could be exercised.

There is a useful limit in that evidence: Cursor's transcript recorded requested tool calls, but not the approval clicks themselves. The denial was supported by the owner's report and screenshots alongside the transcript. The denied run also skipped both the Node.js version check and the audit command. Those details belong in the record, because they define what was actually tested.

The [acceptance log](https://github.com/alipajand/agent-readiness-action/blob/main/docs/distribution/SUBMISSIONS.md#cursor-acceptance-checklist) preserves those distinctions. MCP in Cursor, Windows, and reliable plain-language invocation were not established by these tests.

## Release one identifiable set of artifacts

The integration versions were coupled by tests: runtime, skill metadata, plugin manifests, integration package, MCP npm package, and registry metadata all moved to 0.1.2. That meant releasing the MCP package even though its behavior did not change.

The tradeoff is straightforward. A shared version makes the artifact set easier to identify, but a plugin packaging fix creates release work for other integrations. I kept that existing contract for this release instead of changing versioning policy in the same patch.

The checks compared rebuilt bundles with 0.1.1 and found only the version-string change. Repeated builds were reproducible, and packing the npm artifact twice produced identical checksums. The GitHub Action stayed at v1.2.0; its release tags were separate from `integrations-v0.1.2`.

The release order also mattered. Installation examples pointing at 0.1.2 would fail until that version existed in npm. The documented sequence was to tag and release the integration, publish from an export of that tag, verify the artifact, and publish the matching MCP Registry metadata. [PR #40](https://github.com/alipajand/agent-readiness-action/pull/40) records those checks and the publication dependency.

## Keep publication and directory approval separate

The October 14 [publishing matrix](https://github.com/alipajand/agent-readiness-action/blob/main/docs/PUBLISHING-MATRIX.md) records integrations 0.1.2 as released, the MCP package as published on npm and in the official MCP Registry, and the skill and Claude Code plugin as installable from GitHub.

It separately records the Anthropic submission as scanning and the Cursor submission as awaiting review. Those are dated submission states, not claims of approval.

For another integration, I would keep the same evidence chain: identify the package, validate its destination-specific metadata, document its execution boundaries, test success and denial in the host, and submit the exact released artifact. Each step should leave enough evidence for the next reviewer to understand what passed and what remains unknown.

You can find the integrations on my [open-source page](/open-source). For the underlying audit work, see [Agent instruction files are code. Lint them like code.](/writing/agent-instructions-are-code), and for the separate GitBot contribution, see [Keeping repository instructions useful with Agent Readiness Doctor](/writing/agent-readiness-doctor).
