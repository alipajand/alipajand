---
title: "How I would design a document review workspace"
date: "2026-09-17"
excerpt: "A practical frontend design for reviewing AI-extracted documents: bounded queues, PDF-field selection, server-enforced leases, recoverable drafts, and accessible review workflows."
seoTitle: "Designing a document review frontend — Ali Pajand"
seoDescription: "How I would design a React document review workspace with server pagination, PDF-field selection, document leases, draft recovery, and keyboard accessibility."
tags:
  - Frontend Architecture
  - React
  - Product engineering
  - Accessibility
  - AI
---

An analyst corrects an invoice total. The input updates immediately. A moment later, the connection drops. Another analyst eventually opens the same document, and the first analyst returns with a browser full of unfinished work.

What should the interface do now?

That scenario shapes more of a document review frontend than the choice of table or form library. The interface needs to keep a person's work, establish who can change the document, and explain what has actually been saved. It also needs to help that person compare every value with the source without losing their place.

This is a proposed architecture for that workflow. I am describing the design and the trade-offs I would validate before shipping it; these are not results from a deployed application.

## Start with the review loop

The workflow is small enough to describe in one sentence: find a document, claim it, compare its extracted fields with the original, confirm or correct them, then approve or reject it.

Assume a queue containing tens of thousands of contracts, invoices, and claims, with 10 to 200 fields per document. The original is a PDF or a set of page images. Several analysts share the queue, but only one can edit a particular document at a time.

I would make the product rules explicit early. For this design, approval requires every field to be reviewed and all changes saved. Rejection can happen earlier, with a reason. Finalized documents are read-only. Those are product assumptions, and the backend needs to enforce them.

The starting stack would be React, TypeScript, Vite, React Router, TanStack Query, and PDF.js. This is an authenticated internal workspace with no stated server-rendering requirement, so a client-rendered application is a reasonable starting point. Existing team infrastructure could change that choice.

The useful boundaries are the queue, the review workspace, the document viewer, the field editor, and a typed API layer. The workspace coordinates ownership, drafts, selection, and completion. The viewer renders source evidence and reports selections. The editor displays values and reports edits. Neither child needs to implement the save protocol.

## Give each kind of state an owner

I would keep the confirmed server snapshot separate from the analyst's pending work. A background refresh should be able to update document status without replacing a half-typed correction.

| State                 | Owner                                 | Examples                                                          |
| --------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| Confirmed server data | Server, cached through TanStack Query | Saved fields, review states, revision, document status, ownership |
| Queue navigation      | URL                                   | Search, status filter, sort, page                                 |
| Pending work          | Review workspace, persisted locally   | Edited values, confirmations, baseline values and revision        |
| Interaction           | Workspace or relevant component       | Selected field, viewer page, zoom, focus intent                   |

An input displays a pending value when the draft contains one; otherwise it displays the server value. That check must use presence, not truthiness: an empty string can be an intentional correction. A response advances the confirmed baseline without erasing newer pending changes.

Review state needs its own vocabulary. A field starts **Unreviewed**. Accepting the extracted value makes it **Confirmed**; changing it makes it **Corrected**. Returning a correction to the original extraction requires explicit confirmation again. Save state answers a different question: has the server acknowledged that value and review decision?

A field can therefore be Confirmed and still be pending. Counting reviewed fields gives useful progress, but it does not prove the document is ready to finalize.

This is a concrete application of [giving each kind of frontend state one owner](/writing/how-i-structure-a-frontend-that-owns-almost-no-truth). Here, the draft deserves its own lifecycle because it may outlive the tab that created it.

## Scale the queue by bounding what the browser receives

For a large queue, I would start with server-side search, filtering, sorting, and pagination. The browser requests 50 summaries at a time; document files and extracted fields load when a review opens. Fifty is a starting value to tune, not a measured optimum.

The URL holds the committed query parameters. Search is debounced, and changing a filter resets the page. Every parameter affecting the response belongs in the [TanStack Query key](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), so different searches have separate cache entries. A late response for an old search must not replace the active search results.

I would initially use numbered pages and a semantic table. The server would add document ID as a deterministic tie-breaker when sorting. That makes equal sort values predictable, but it does not freeze a changing queue: with offset pagination, rows can move between pages as other analysts finish work. If that movement interferes with review, cursor pagination would be worth evaluating against the actual sort and navigation requirements.

Virtualization solves a different problem. It reduces the number of rendered rows; it does not remove the cost of fetching the entire queue. With a bounded page of summaries, I would first measure response size, query latency, and rendering before introducing a virtualized table.

A failed refresh should leave existing rows visible with an out-of-date notice. An empty queue and a search with no matches need different messages. These states affect whether an analyst trusts the queue enough to act on it.

## Real-time status cannot grant ownership

I would use Server-Sent Events for lightweight status notifications and ordinary HTTP for claims and saves. A notification identifies a document whose state may have changed; the frontend invalidates affected queries and refetches authoritative data. A status change can also affect filtered membership and counts, so updating one visible row alone is insufficient.

After reconnecting or returning to the tab, the client refetches in case it missed events. Polling, initially around every 15 seconds, would provide a fallback. The interval and event volume need measurement.

Consider two analysts looking at the same available row. Both click before either receives a status update. Faster notifications cannot settle who owns the document. The server needs an atomic claim operation, and editing stays disabled until that operation succeeds.

I would use a document-level lease: time-limited ownership with a token and a server-supplied expiry. A two-minute lease renewed every 30 seconds is a provisional configuration. Background tabs, network delays, and the acceptable handover delay would determine the final timings.

Every mutation needs three checks, performed atomically with the write:

- The lease token identifies the current, unexpired owner.
- The expected revision matches the document being changed.
- The document is still in a reviewable state.

The lease answers who may write. The revision answers which version their write is based on. Both matter, including when one analyst opens two tabs. An old token must remain invalid after a new lease is issued.

Leaving the workspace can release ownership explicitly. Closing a tab must not be the only release mechanism; expiration handles the case where cleanup never reaches the server.

If renewal fails, I would retain the draft, show that changes are being kept on this device, and block server writes and final decisions until ownership is verified. If another analyst has taken over, editing stops and the draft remains inspectable. The cost of whole-document ownership is reduced parallelism within a document. For this workflow, simpler recovery is worth that constraint.

## Connect the PDF and the fields through one selection

The workspace owns one `selectedFieldId`. Both panels derive their selected state from it.

Focusing a field selects it, navigates the viewer to the source page, and highlights the corresponding region. Keyboard focus stays in the input. Activating a source annotation selects that field, scrolls its input into view, and moves focus to the input. The direction of the action determines the focus behavior.

That distinction prevents a frustrating bug: typing into a field should never move focus into the PDF because its highlight updated.

The extraction contract must describe page identity, dimensions, rotation, and a documented coordinate convention. The viewer converts those source coordinates into the rendered page's coordinate system. [PDF.js viewports](https://mozilla.github.io/pdf.js/examples/) account for scale, rotation, and the PDF-to-canvas coordinate transform. I would keep overlay positioning in the same displayed coordinate space as the page, with canvas pixel density handled separately.

Zoom changes geometry, not selection identity. If the API has no source location, the UI says "Source location unavailable." An approximate box invented by the frontend would undermine the evidence the analyst is checking.

I would initially render only the active page. That also creates an asynchronous boundary: an analyst can select a field on page three while page two is still rendering. A stale render must be cancelled or ignored before it becomes visible. The highlighted field, displayed page, and render request need to agree before the result is shown; highlighting the latest field over the previous page is not a valid intermediate state.

For up to 200 fields, I would start with a normal list. Keeping fields mounted simplifies tab order, labels, error links, and focusing a field selected from the document. I would add virtualization only if measurements justify its interaction cost.

## Make instant editing and reliable saving separate jobs

Each edit or confirmation updates the local draft immediately. I would then persist the pending change locally and debounce the network save, initially by 500 milliseconds. There would be only one save in flight per document.

The subtle part is what an acknowledgment clears. Imagine this sequence:

1. The analyst changes a total to `120`, and a save begins against revision 10.
2. Before the response arrives, they correct the total again to `125`.
3. The server acknowledges `120` at revision 11.
4. The confirmed baseline becomes `120`, while the input still shows the pending `125`.
5. The next save sends `125` against revision 11.

Clearing the entire draft at step three would lose the second edit. I would track the versions of the value and review-state changes included in each request, then clear only those still matching the acknowledged snapshot. A later confirmation deserves the same protection as later typing.

The save indicator should explain the actual durability boundary: **Saved on this device**, **Saving to server**, **Saved on server**, or **Could not sync**. A successful browser-storage write is required before claiming the first state; an acknowledgment covering all current pending changes is required before claiming the third.

If local persistence fails, keep the draft in memory, continue attempting authorized server saves, and explain that closing the tab could lose changes. If synchronization fails, preserve the input and establish the failure's cause before retrying.

## Recover work without assuming the right to replay it

For small drafts, I would start with localStorage. Each record needs analyst, document, and tab-session identity, baseline revision, baseline and pending values and review states, and timestamps. Separate tab-session records prevent one tab from overwriting another's recovery data, while discovery by analyst and document makes closed-tab drafts findable.

This choice has limits. [Web Storage is synchronous](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), so serialization and writes can interrupt the main thread. If draft size or write frequency harms typing, I would evaluate IndexedDB. Browser storage also needs an explicit security policy: store the minimum recovery data, no full documents or lease tokens, and define cleanup and retention. This assumes local persistence is permitted on the devices involved.

Recovery is limited to the same browser profile. Opening a review needs a connection; reopening offline might recover text without recovering the document itself. Browser storage can fail or be cleared, so this is a recovery mechanism with limits.

The difficult case is a revision change:

1. Analyst A edits revision 10, then disconnects.
2. A's lease expires. Analyst B claims the document and saves revision 11.
3. A reconnects with pending work based on revision 10.

A's draft is valuable, but possession of it grants no ownership. The client must fetch current status and revision, establish a valid lease, and compare the baseline, local draft, and server state before sending anything.

After a reload, the in-memory lease token is gone. Without an explicit backend contract for recovering that lease session, the client needs a fresh claim and may have to wait for the old lease to expire. I would let the analyst inspect the draft while waiting.

If the revision is unchanged and ownership is valid, the analyst can resume. If it changed, I would require explicit reconciliation, even for edits to different fields, because fields may depend on one another. Confirmations and corrections must be reviewed against the chosen values; they cannot be copied blindly onto changed data. If the document has already been finalized, the draft remains viewable but cannot be submitted.

A timeout deserves its own treatment. A save may have succeeded even though its response never arrived. Refetch revision, values, and review states before deciding what remains pending. Matching values alone do not establish which request wrote them. If the outcome is ambiguous, retain the draft for reconciliation. The same rule applies to a timed-out final decision: check the current status before attempting another one.

This deliberately accepts manual conflict resolution. I would rather make that cost visible than introduce an automatic merge policy the product has never defined.

## Accessibility changes the data and interaction contracts

A labelled form next to an inaccessible document is an incomplete review workflow. A screen-reader user needs to compare the extracted value with its source, too. I would require an accessible text layer or reading-order text view, with OCR text supplied for scanned pages. A canvas alone cannot provide that comparison.

The interaction contract would include visible input labels, linked validation errors, text review states, and named annotation buttons such as "Invoice total, page 2." Selection needs an outline and label as well as color. Previous, Next, Confirm, and Show source should all be available as ordinary controls.

I would define focus transitions alongside selection: opening a review focuses its heading; activating an annotation focuses its field; Show source moves into the viewer; Escape returns to the selected field. Returning to the queue restores focus to the originating row, with the queue heading as a fallback if that row disappeared.

Shortcuts can accelerate those actions, but their bindings need validation against browsers, operating systems, keyboard layouts, and assistive technology. I would preserve ordinary text editing and avoid character-only bindings. [WCAG's character-key-shortcut guidance](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html) explains the disabling, remapping, or focus restrictions those bindings require.

At narrow widths and high zoom, the form and controls should reflow and the panels should stack. A document may need two-dimensional scrolling without making the surrounding interface scroll in both directions. That distinction is covered in [W3C's reflow guidance](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html).

Save announcements should be polite and occur on meaningful transitions, not every keystroke. Ownership loss and errors need persistent text. WCAG 2.1 AA would be a design target requiring keyboard, screen-reader, contrast, zoom, and real-document testing before making a conformance claim.

## Finalization needs its own confirmed outcome

Approval is a coordinated operation. I would pause editing, flush pending values and review states, wait for acknowledgments, and then request finalization against the resulting revision and current lease. The server validates completion and records the final status while releasing ownership atomically.

Rejection follows the same persistence boundary but allows an incomplete review and requires a reason. If the source document fails to load, approval remains unavailable: the analyst cannot verify evidence they cannot inspect.

Only confirmed success returns the analyst to the queue and clears the resolved draft. A failure keeps the workspace open with its recovery information. A timeout enters the status-checking path described above.

## What I would validate before shipping

I would concentrate validation on the transitions where two parts of the system can disagree:

- Simultaneous claims, missed renewals, and writes using expired tokens.
- Editing or confirming while a save is in flight.
- Reloading with a draft, losing a save response, and reconciling changed revisions.
- Rapid selection across PDF pages, zoom changes, and focus moving in both directions.
- Final decisions with pending changes, missing source evidence, or changed ownership.

Server concurrency tests, frontend interaction tests, and manual accessibility checks cover different parts of those risks. None of that testing is implied by an architecture proposal.

For performance, I would measure queue latency, event and polling traffic, PDF memory, and typing responsiveness. Those observations would determine whether cursor pagination, event batching, IndexedDB, or field virtualization earns its complexity.

The question I would bring to a design review is concrete: when the connection drops halfway through a correction, can the analyst tell what is preserved, what the server accepted, and what they are allowed to do next? Every boundary in this design should help the interface answer it.

## Related reading

- [How I structure a frontend that owns almost no truth](/writing/how-i-structure-a-frontend-that-owns-almost-no-truth)
- [How I approach senior frontend architecture](/writing/how-i-approach-senior-frontend-architecture)
- [The quiet failure mode in contract AI: when the UI believes the wrong row](/writing/ledgerguard-truth-between-extraction-and-finance)
