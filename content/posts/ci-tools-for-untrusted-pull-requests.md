---
title: "Building CI tools for pull requests you don't trust"
date: "2026-08-28"
excerpt: "A CI check that runs on pull requests reads input written by whoever opened the PR. Lessons from hardening three small open-source tools: package names, git refs, file names, config, symlinks, and bot comments."
seoTitle: "Building CI tools for pull requests you don't trust — Ali Pajand"
seoDescription: "Practical security lessons for CI tools and GitHub Actions that run on untrusted pull requests: npm name squatting, option injection, workflow command injection, config from the base branch, symlinks, ReDoS, and PR comment ownership."
tags:
  - Security
  - DX
  - Tooling
---

When I wrote the first versions of [agent-readiness-kit](https://github.com/alipajand/agent-readiness-kit), [agent-context-doctor](https://github.com/alipajand/agent-context-doctor), and [agent-pr-reviewer-lite](https://github.com/alipajand/agent-pr-reviewer-lite), I thought of them as read-only tools. They look at a repository and print a report. What could go wrong?

Then I wrote down where their input actually comes from when they run in CI on a pull request: file names, file contents, config files, git refs, and comments. Every one of those is written by whoever opened the PR. Sometimes that is me. Sometimes it is a contributor I have never met. Increasingly, it is an agent.

A check that runs on pull requests is a program that processes attacker-controlled input with a token in its environment. These are the places that mattered in practice.

## 1. The package name you install is not the project you think it is

This is the one that changed how I ship.

An early version of the GitHub Action ran `npx --yes agent-readiness-kit`. That reads naturally: install my CLI and run it. But I had never published that name to npm, and the name was already owned by an unrelated author. Every run downloaded and executed someone else's code, and when PR comments were enabled, it did so with `GITHUB_TOKEN` in the environment.

Nothing about that looked wrong in the workflow file. That is the problem.

The fix was to stop resolving anything at run time. The action now bundles both engines from git submodules pinned to reviewed commits, compiles them into `dist/`, and makes no registry requests at all. CI fails if the committed `dist/` does not match the source, so the code that runs is the code that was reviewed.

```diagram
type: compare
title: Resolving a package by name versus shipping reviewed code
caption: A workflow that looks correct can still execute someone else's code if anything is resolved by name at run time.
columns:
  - label: Resolve at run time
    items:
      - "npx --yes agent-readiness-kit installs whatever owns that npm name"
      - The name was never published by me and belonged to an unrelated author
      - Ran with GITHUB_TOKEN in the environment when PR comments were enabled
      - Nothing in the workflow file looked wrong
  - label: Bundle pinned, reviewed code
    items:
      - Engines come from git submodules pinned to reviewed commits
      - Compiled into a committed dist/ with no registry requests
      - CI fails if dist/ does not match the source
      - Install from a release tag, and pin the commit SHA for an exact version
```

The READMEs now say it plainly: the npm packages with these names are unrelated projects, install from a GitHub release tag, and pin the commit SHA if you want an exact version, because tags can be moved.

**Lesson:** a package name is not an identity. If your tool is not published under a name, assume someone else owns it.

## 2. Values from the PR must never become options

agent-pr-reviewer-lite runs `git diff` between a base and a head ref. The base can come from a config file in the repository under review. A base of `--output=/some/file` is not a ref. It is a git option.

Every ref is validated before it reaches git: no leading `-`, no control characters, no null bytes. git also receives `--end-of-options` before the refs, so even a value that slipped past validation would be read as a ref. The validation exists to give a clear error; `--end-of-options` is the actual guarantee.

```diagram
type: flow
title: How a ref from the repository reaches git safely
caption: Validation gives a clear error, but the end-of-options marker is what guarantees a value is never read as an option.
steps:
  - label: Value from config
    detail: The base ref can come from a config file in the repository under review, so it is untrusted input.
  - label: Validate the ref
    detail: Reject a leading dash, control characters, and null bytes with a clear error.
  - label: End git options
    detail: Pass --end-of-options before the refs, so anything that slipped past validation is still treated as a ref.
  - label: Diff with -z
    detail: Read changed paths null-separated, so spaces, quotes, newlines, and non-ASCII names match exactly.
```

The same instinct applies to file paths. Changed files are read with `git diff -z`, so a path with spaces, quotes, newlines, or non-ASCII characters is matched exactly, instead of in git's quoted form that a rule might not recognise.

## 3. A pull request should not configure its own review

By default, a CLI reads its config from the working directory. In CI, the working directory is the pull request's checkout. So the PR author controls the config that reviews their PR, including the `ignore` patterns.

Three changes closed that:

- `--config-ref origin/main` reads the config from the base branch, so a PR's edits to it have no effect on its own review.
- Any change to the reviewer config is always reported at high severity. `ignore` cannot hide it and per-rule settings cannot turn it off.
- `CODEOWNERS` is read from the base branch too, so a PR that edits it cannot change who reviews that same PR.

**Lesson:** for every input, ask which side of the trust boundary it is read from. If the answer is "the side being reviewed," it cannot be the side that decides.

```diagram
type: compare
title: Which side of the trust boundary config is read from
caption: Anything that decides how a pull request is reviewed has to come from the branch the PR cannot edit.
columns:
  - label: Read from the PR checkout
    items:
      - The PR author controls the config that reviews their own PR
      - ignore patterns in the PR can hide the PR's own changes
      - An edited CODEOWNERS could change who reviews that same PR
  - label: Read from the base branch
    items:
      - "--config-ref origin/main reads config from the base branch"
      - Any change to the reviewer config is always reported at high severity
      - ignore and per-rule settings cannot hide or disable that finding
      - CODEOWNERS also comes from the base branch
```

## 4. File names are output, and output is a channel

GitHub Actions parses lines like `::error::` or `::add-mask::` in a job's log as workflow commands. A tool that logs file names from the audited repository can be made to emit those commands by a file with a carefully chosen name.

Log output is now wrapped in `::stop-commands::` with a random token, so nothing printed from the audited repository is interpreted. Text output strips control characters, so a file name cannot carry terminal escape sequences either.

Markdown has the same problem one layer up. PR comments escape HTML and keep file names in inline code. Inside tables, a file name with a `|` can split a cell, and a backslash before an escaped pipe can cancel the escape. Both are handled. It is fiddly, unglamorous work, and it is the difference between a report and an injection surface.

## 5. Writing a file is a race

agent-context-doctor and the Action can write a Markdown report. The naive version checks the path is inside the repository, then writes to it. Between the check and the write, a symlink can appear.

Report paths must resolve inside the audited repository, including after following symlinks, and the write never goes through one. A new file is created with `O_EXCL`, which fails if anything, including a dangling symlink, is already there. An existing file is opened without truncation and replaced only after confirming that the path still names the same regular file. Windows runners have no `O_NOFOLLOW`, so the post-open check is what holds there.

Reading has the same race in reverse. The engines check file type and size on the _opened handle_, not the path, so a file cannot be swapped between the check and the read. Symlinked directories are not traversed, and files over a size limit are reported instead of read.

## 6. Config can be a denial of service

`ignore` and custom risk paths are glob patterns from the repository under review. The obvious implementation converts globs to regular expressions, and a pattern like `*a*a*a*a*b` makes that regex backtrack exponentially. A hostile config could stall a CI run indefinitely.

The glob matcher is now a small dynamic-programming implementation that runs in time proportional to pattern size times path length. Config files must be regular files under 1 MiB. Neither change shows up in a feature list, but both mean an input cannot make the tool run forever.

## 7. "Update my comment" needs to know which comment is yours

Both the Action and the PR reviewer post a single summary comment and update it on later runs. The first implementation found its comment by looking for a hidden marker string.

Anyone can paste that marker into their own comment. The tool would then overwrite a human's comment with its report.

Now a comment is only updated if it starts with the marker _and_ was written by a bot account, or by a login you configure explicitly when commenting with a personal token. Comment lookup also paginates past the first hundred comments, so a busy PR does not get a duplicate.

## The checklist I use now

None of these were clever attacks. Each one was a reasonable default that did not hold up once I asked where the input came from. Before shipping anything that runs on pull requests, I now go through these questions:

- Is anything resolved by name at run time? Can I pin it or bundle it instead?
- Can any value from the repository reach a subprocess as an option?
- Is config read from the branch being reviewed, or from a trusted ref?
- Is every string from the repository escaped for the place it is printed: terminal, Actions log, Markdown, HTML?
- Are file writes and reads contained, symlink-safe, and checked on the handle?
- Can any input make the tool run for an unbounded time or read an unbounded file?
- When the tool edits something, does it verify that the thing is its own?

AI coding agents make this more relevant, not less. More pull requests are opened by tools, more config files steer those tools, and more checks run automatically on the result. The checks themselves have to be the most boring, predictable code in the pipeline.

## Related reading

- [Which agent-written changes does a human need to read?](/writing/deterministic-review-triage-for-agent-prs)
- [Agent instruction files are code. Lint them like code.](/writing/agent-instructions-are-code)
- [agent-readiness-action on GitHub](https://github.com/alipajand/agent-readiness-action)
