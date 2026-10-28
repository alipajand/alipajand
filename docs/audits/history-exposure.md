# History exposure: unredacted dashboard screenshots

Status: **for owner review. No history has been rewritten.** This note records where the unredacted MapBylaw and LedgerGuard dashboard screenshots still exist in git, why replacing files does not remove them, and the options with their consequences. The recommendation at the end needs the owner's decision.

This document does not repeat any identifier. "Login email" means the address the owner signs in with, which is not the published contact address in `data/links.ts`. "Owner name" means the full name in the MapBylaw account row. "Workspace name" means the real LedgerGuard workspace shown in the original capture.

## What the unredacted images show

| Image                                                                      | Identifiers                                                                                     |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Original MapBylaw dashboard (3452×1980 PNG) and every copy made from it    | Account row, bottom left: avatar initials, owner name, full login email                         |
| Original LedgerGuard dashboard (3456×2234 PNG) and every copy made from it | Account row, bottom left: login email (truncated). Workspace switcher, top left: workspace name |
| First LedgerGuard redaction (`260f7f5`) and captures of it                 | Email blurred. The workspace name is still visible. Fixed in `801b81f`.                         |

## Where they are in history

The search covered every object reachable from `origin` branches, local branches and all 271 `refs/pull/*/head` refs (fetched on 2026-10-27).

- **Exact copies.** Every image blob, and every base64 image decoded from HTML, Markdown, CSS and JS blobs, was hashed and compared with the known unredacted files: 1,078 images and 47 data URIs.
- **Derived copies.** A multi-scale template search over the same images looked for resized copies or screenshots containing either dashboard. Each hit's account row and workspace switcher were then compared against the unredacted, first-redaction and final redacted versions.

Dates are commit dates (UTC−4). "PR refs" counts the `refs/pull/N/head` refs that reach the commit.

### On `main` (reachable from the default branch)

| Commit                   | Date             | Change                | Blob                                       | Path                                                                                                                                                           |
| ------------------------ | ---------------- | --------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `15d5e67`                | 2026-06-18 18:01 | added                 | `ca96a78`                                  | `public/portfolio-media/mapbylaw-dashboard.png` (original)                                                                                                     |
| `15d5e67`                | 2026-06-18 18:01 | added                 | `962e675`                                  | `public/portfolio-media/ledgerguard-dashboard.png` (original)                                                                                                  |
| `1c33fd1` (#119, v1.6.2) | 2026-06-18 18:17 | added on `main`       | same two blobs                             | same two paths                                                                                                                                                 |
| `faaee38` (#223)         | 2026-10-27 15:21 | added                 | `113ee9c`                                  | `docs/design/kit/img/mapbylaw-dashboard.jpg` (1728×991 downscale of the original)                                                                              |
| `faaee38` (#223)         | 2026-10-27 15:21 | added                 | `d576689`                                  | `docs/design/pages/case-mapbylaw.html` (same JPEG as base64 data URI #1)                                                                                       |
| `54fa2b6`                | 2026-10-27 16:55 | added                 | `d6887e3`, `77403bc`                       | `docs/design/implementation/case-studies/mapbylaw-{1440,390}-reference.jpg` (dashboard about 480 and 350 px wide, so the text is 2–4 px tall and not readable) |
| `260f7f5`                | 2026-10-27 16:54 | added                 | `de7aeb7`                                  | `public/portfolio-media/ledgerguard-dashboard-redacted.png`, first version (workspace name visible)                                                            |
| `54fa2b6`                | 2026-10-27 16:55 | added                 | `5abb418`, `46245a5`                       | `docs/design/implementation/case-studies/ledgerguard-{1440,390}-actual.jpg`, first version (workspace name, about 3 px)                                        |
| `588f4b3`                | 2026-10-27 16:57 | added                 | `8d8a8c6`, `5b43078`                       | `e2e/__screenshots__/case-studies.e2e.ts/ledgerguard-{1440x900,390x844}-darwin.png`, first version (workspace name)                                            |
| `801b81f`, `ff9d022`     | 2026-10-27 17:03 | replaced              | —                                          | The LedgerGuard redacted PNG, the two captures and the two baselines replaced with the fictional-workspace version                                             |
| `6e669b8` (#250)         | 2026-10-27 17:39 | deleted from the tree | `ca96a78`, `962e675`                       | The two original PNGs. The blobs stay in history.                                                                                                              |
| PR #276 (open)           | 2026-10-27       | replaces              | `113ee9c`, `d576689`, `d6887e3`, `77403bc` | Kit JPEG, data URI and both reference captures regenerated or blurred                                                                                          |

The originals are in history on `main` from 2026-06-18 and were served by the live site from `/portfolio-media/` until #250 shipped. They are reachable from 152 PR refs (#120 to #271). No release tag contains them; the newest tag is `v1.2.0`.

### Only in pull request refs (branches deleted)

| Commit                                                | Date                     | PR (state)                    | Blob                                                             | Path                                                                                                                                                                                       |
| ----------------------------------------------------- | ------------------------ | ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `b64dded`                                             | 2026-10-27 13:54         | #223 (merged by squash), #226 | `35f6b0f`                                                        | `docs/design/kit/img/ledgerguard-dashboard.jpg` and `docs/design/system/project/assets/Screenshots/ledgerguard-dashboard.jpg` (original LedgerGuard, 1728 px)                              |
| `b64dded`                                             | 2026-10-27 13:54         | #223, #226                    | `9801b31`                                                        | `docs/design/pages/case-ledgerguard.html` (same JPEG as data URI #2)                                                                                                                       |
| `b64dded`, `6e0ffc8`, `d6dc60a`, `89a649f`            | 2026-10-27 13:54–14:51   | #223, #226                    | `113ee9c`; `b519691`, `d61fec2`, `b8cbf9d`                       | The MapBylaw kit JPEG and three earlier `case-mapbylaw.html` versions, all with the same data URI                                                                                          |
| `ad02ca8`                                             | 2026-10-27 14:36         | #223, #226                    | —                                                                | The LedgerGuard kit JPEG and data URI replaced with the design prototype                                                                                                                   |
| `535f0da`                                             | 2026-10-23 16:24         | #214 (closed)                 | `2d2f700`, `b685bf4`, `9648835`, `4cc9b86`                       | `docs/design/portfolio-redesign/artifacts/shared/media/{ledgerguard,mapbylaw}-dashboard-{1280,640}.webp` (direct resized copies; the email is about 9 px tall at 1280)                     |
| `be3d269`, `46e0368`                                  | 2026-10-23 18:15, 22:04  | #215, #216 (closed)           | `f388bd4`, `e1ce2b7`                                             | `docs/design/portfolio-redesign/{cinematic-exploration,p2-portability}/prototype/media/ledgerguard-dashboard-{1600,960}.webp` (direct resized copies)                                      |
| `8b956f4`                                             | 2026-10-23 15:42         | #214, #215, #216              | `1228ded`, `6f303a0`, `d2d43d0`, `6eb9b40`, `9c0bae0`, `1c3f5d4` | `docs/design/portfolio-redesign/screenshots/ledgerguard-{1440,768,390}-*full.jpg` (page captures; dashboard 343–746 px wide)                                                               |
| `be3d269`, `1cbdfe5`, `0c90c7c`, `5ce6aae` and others | 2026-10-23 to 2026-10-26 | #215, #216                    | `1495f8f`, `3410126`, `5b71cf9`, `01ce5d8` and about 25 more     | Prototype and engine screenshots under `docs/design/portfolio-redesign/**/screenshots` showing the original LedgerGuard capture at 190–910 px wide. The identifiers there are 1–7 px tall. |

### Text that named the workspace

The workspace name also appeared in Markdown:

- `docs/design/implementation-audit/07-content-and-assets.md`, from `bf7ff06` (#226 head) and `9bb96bb` (#226, on `main`). PR #276 removes it.
- `docs/audits/security-privacy.md`, from `5e49365` (on `main`) until `f0c899e`.

### The login email outside the screenshots

The same login email has been public in this repository independently of the screenshots:

- It is the author email on 326 commits reachable from `main`. Commit metadata shows it on GitHub, in `.patch` views and in every clone.
- It appeared in tracked text from February 2026 (`2cd6cbc`, `d205acf`, `b0bb2da`, `05766b8`, `a66f466`) in `.env.example`, `SECURITY.md`, `data/links.ts` and the contact route, and in `docs/audits/security-privacy.md` (`5e49365` → `f0c899e`).

What the screenshots add is the link between that address, the owner name and specific MapBylaw and LedgerGuard accounts, plus the LedgerGuard workspace name.

## Why deleting the file does not remove it

- **Git keeps every version.** A commit that deletes or replaces a file adds a new tree; earlier commits still point to the old blob. Anyone can run `git show 1c33fd1:public/portfolio-media/mapbylaw-dashboard.png`, or browse that commit on GitHub, and get the original.
- **Pull request refs are pinned.** GitHub keeps `refs/pull/N/head` for every pull request, open, closed or merged, even after the branch is deleted. The owner can't delete or force-push these refs. #214, #215, #216, #223 and #226 keep commits reachable that are on no branch at all (`b64dded`, `535f0da`, `be3d269`, `8b956f4`, …).
- **Commits stay addressable by SHA.** GitHub serves a commit by SHA (web UI, `.patch`, API, archive download) after its branch is deleted and, for a while, even after a force-push removes it.
- **Forks and clones keep their own copies.** The repository reports 0 forks today, but it is public. GitHub's traffic API reports 429 clones by 166 unique cloners in the last 14 days. That count includes CI and deploy systems, but every clone has the full history.
- **Caches outside git.** The live site served the original PNGs from 2026-06-18 until #250. Past Vercel deployments keep serving the files they were built with at their own deployment URLs. CDN caches, search-engine image indexes and web archives may also hold copies. A history rewrite touches none of these.

## Options

### (a) Accept the exposure and keep the current fixes

What it involves: merge #276, keep the regression tests, and change nothing in history.

- **Cost.** None to the repository: no SHAs change, and open PRs, forks and clones are unaffected.
- **What remains.** The images stay reachable by SHA, through PR refs and in every clone.
- **Mitigating factors.** The login email is already public through commit metadata on `main` and earlier tracked files, so the screenshots do not reveal a new address. They do tie it to the owner name and the two product accounts, and they show the workspace name.

### (b) Rewrite history with `git filter-repo`, force-push, and ask GitHub Support to purge

What it involves:

1. Mirror-clone the repository and back it up.
2. Run `git filter-repo` to strip the blobs listed above, by path and by blob ID. Do the same for the workspace name in the two Markdown files, and optionally the author email via a mailmap.
3. Force-push every branch and tag.
4. Ask GitHub Support to run garbage collection, drop cached views and remove the affected `refs/pull/*` refs. Only Support can remove PR refs, and they decide what to purge.

Consequences:

- **SHAs change.** Every commit from 2026-06-18 onward gets a new SHA (or every commit, if the author email is rewritten). Links to commits, PR "Files changed" views, review comments anchored to lines, `CHANGELOG.md` references and audit documents that cite SHAs, including this one, stop resolving.
- **Open PRs break.** Their bases no longer match and they have to be recreated or rebased. Open branches in local worktrees must be re-cloned or hard-reset; any unpushed work must be moved by hand.
- **Clones and forks.** Existing clones keep the old history. Pulling into them merges the old history back unless every clone is discarded. Forks, if any exist by then, are not rewritten.
- **CI and deployments.** Vercel and GitHub Actions history keep pointing at SHAs that no longer exist. Vercel deployments built from old commits still serve the old files until they are deleted.
- **Working rules.** The current working rules for this repository exclude force-pushes and history rewrites. This option needs an explicit, one-off exception from the owner.
- **No guarantee.** It does not remove copies that were already cloned, cached or archived.

### (c) Change the exposed account details

What it involves:

- Change the sign-in email on the MapBylaw and LedgerGuard accounts shown, or retire those accounts.
- Rename or retire the LedgerGuard workspace.
- Set GitHub's "Keep my email addresses private" and "Block command line pushes that expose my email", and use the `users.noreply.github.com` address for future commits. The repository already has 100 commits on `main` with that address.
- Confirm the login has strong, unique credentials and two-factor authentication. The email is a username, not a secret, so this limits what the exposure enables rather than removing it.

Consequences:

- **Effect.** It makes the exposed details stale instead of hidden, and it is the only option that also covers copies already outside git.
- **Cost.** Account administration outside the repository. It does not change git history: past commits keep the old author email.

## Recommendation (needs the owner's decision)

**(a) together with (c).**

- **(a):** merge #276, keep the hash and asset tests, and leave history alone.
- **(c):** switch commits to the noreply address and decide whether the product logins and the workspace name are worth changing.

Option (b) costs a lot: every SHA, open PR, clone and audit trail. It would still leave the email in the 326 commit headers unless the author email is rewritten too, which changes every commit that carries it. And it cannot reach clones, deployments or caches that already hold the files.

If the owner decides the workspace name or the name-and-email pairing must not stay reachable on GitHub, the narrowest version of (b) is a GitHub Support request:

- remove refs `refs/pull/214`, `215`, `216`, `223` and `226`, which hold the redesign copies and the first LedgerGuard kit image;
- purge cached views of the commits listed above.

Doing that together with a filter-repo rewrite of `public/portfolio-media/{mapbylaw,ledgerguard}-dashboard.png` and the other paths above is what option (b) means in full.

Decisions needed:

- [ ] Accept the remaining exposure in history (a), or approve a one-off rewrite exception (b).
- [ ] Switch future commits to the GitHub noreply address (c).
- [ ] Change or retire the exposed MapBylaw and LedgerGuard sign-in emails and the LedgerGuard workspace name (c).
- [ ] Delete or protect past Vercel deployments that still serve the original PNGs (outside the repository).
