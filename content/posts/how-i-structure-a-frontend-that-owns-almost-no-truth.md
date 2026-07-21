---
title: "How I structure a frontend that owns almost no truth"
date: "2026-07-21"
excerpt: "Frontend architecture is not a folder layout or a state library. It is deciding which kind of state each piece of data is, giving it exactly one owner, and making the second owner hard to create."
seoTitle: "How I structure a frontend that owns almost no truth — Ali Pajand"
seoDescription: "A senior approach to frontend structure in React and Next.js: single-owner state, URL as the home for shareable UI state, server and client boundaries, component tiers, props as contracts, and what those boundaries cost."
featured: true
tags:
  - Frontend Architecture
  - React
  - Next.js
  - Design Systems
  - Product engineering
---

Most frontend architecture conversations start in the wrong place. Which state library. How to split the folders. Whether to colocate. Those are consequences, not decisions.

The decision underneath is that a frontend owns almost nothing. The server owns the data. The URL owns where the user is. The browser owns focus, history, and scroll. What is genuinely the frontend's to own is small: what is selected right now, what is being typed, what is open. Everything else is borrowed, and the failures come from forgetting which is which.

So the claim I want to defend: **every piece of state needs exactly one owner, and structure is what makes a second owner expensive to create.**

## The bug that made this concrete

A filtered data view. Date range, a few category toggles, a search box, a tab. All of it in component state, because that is what the first version needed.

Then the requests arrived. Share this view with someone. Refresh without losing my filters. Use the back button to undo a filter change. Deep-link into a filtered report from an email.

The tempting fix is to sync: keep the state in `useState`, mirror it into the URL with an effect, and read the URL back on mount. I have written that. It produces a specific, miserable class of bug. Back navigation changes the URL but not the state, so you re-sync. Now a state change writes to the URL and the URL write feeds back into state. You add a guard flag. Then the tab is in the URL but the scroll position is not, so returning from a detail page restores half the view. Every fix adds another edge case, because the real problem is that two things believe they own the same value.

The fix was deletion, not addition. Filters are URL state. The URL is the only owner. Components read from search params and write by navigation. There is nothing to sync because there is nothing else holding the value.

That reframed the whole layer for me. Before adding state anywhere, the question is not "where is this convenient" but "what kind of state is this," and the kind determines the owner.

## Four kinds, four owners

**Server data** is owned by the server and cached on the client. It has a fetch, a staleness story, and an invalidation story. It is never copied into local state so it can be edited in place. Copying it creates a second owner immediately, and the copy is stale the moment a mutation succeeds.

**URL state** is anything that should survive a refresh, a share, or a back button. Filters, tabs, pagination, selected entity, sort. If a user could reasonably send someone a link and expect the same view, it belongs here. This is the category most apps get wrong, because component state is easier to write on day one and the cost lands in month three.

**Form state** is owned by the form library, from mount to submit. It is deliberately not application state. A half-typed field is not a fact about the system, and treating it as one is how you get a global store full of drafts nobody cleans up.

**Ephemeral interaction state** is genuinely local: open menus, hover, drag position, which row is expanded, an optimistic pending flag. It lives in the component that owns the interaction and dies with it. Almost none of this deserves promotion to a shared store.

The fifth category is the one that causes the most damage: **derived state, which is not state.** A filtered list, a computed total, a validity flag, a formatted label. Storing these means storing the same information twice and writing an effect to keep the copies in agreement. Compute them during render, or compute them before they reach the client. An effect whose only job is to keep two pieces of your own state consistent is a design error, not a synchronization problem.

## The server and client boundary needs enforcement, not etiquette

"Server components fetch, client components handle interaction" is a slogan until something stops you from breaking it.

What makes it real is direction. Data readers live in server-only modules and import a marker that throws at build time if they are ever pulled into a client bundle. Aggregation happens on the server or in a pure module. A chart component receives finished series and renders them. It does not sum, group, convert currencies, or resolve date ranges.

That last one matters more than it sounds. When a chart computes its own totals, a card elsewhere on the page computes the same total its own way, and the two disagree over rounding or over which rows to include. Nobody notices for a while, and then a user notices and stops trusting the whole screen. One computation, one place, both surfaces consume the result.

The practical rule I use: a client component may be interactive, but it should not be the first place a number comes into existence.

## Three tiers, one direction

Components fall into three tiers, and the tier is decided by what the component is allowed to know.

**Primitives** know nothing about the domain. Button, dialog, field, table shell, sheet. They take generic props and are the only place styling is expressed.

**Domain components** know the shape of a domain object but not where it came from. A row, a summary card, a chart panel. They take typed props and emit callbacks. They do not fetch, and they do not read global state.

**Route compositions** know everything: they fetch, arrange, pass callbacks down, and own the page's structure.

Dependencies point one way. Primitives never import domain components. Domain components never import route code. When someone reaches for a domain concept inside a primitive, that is the signal a new domain component is missing.

The test for which tier a component belongs to: could it be rendered in isolation with hand-written props? If not, it is a route composition wearing a smaller name.

## Props are the contract, and formatting is the edge

The single-owner idea shows up again in a smaller place: where a number stops being a number.

```ts
// Domain component receives values, not rows, and not strings.
type SummaryCardProps = {
  label: string;
  amountMinor: bigint;
  currency: Currency;
  /** Non-empty means the figure is partial and the card must say so. */
  excluded: readonly ExcludedSource[];
  trend?: { direction: "up" | "down"; deltaMinor: bigint };
};
```

Two things this rules out. The component does not receive a raw database row, so a schema change does not ripple into the view layer, and the component cannot quietly start reading a field it was not given. And it does not receive `"$1,240.00"`, because a pre-formatted string cannot be re-formatted for a different locale, cannot be compared, and hides whether the figure was complete.

Formatting is a rendering concern and belongs at the last possible moment, in the component that displays it. Values travel; strings arrive.

The `excluded` field is the deliberate part. When data is partial, the type says so and the component cannot render the amount without stepping over the evidence. Making the honest path the shortest path is more reliable than a code review comment asking for it.

## Performance is mostly a placement problem

The interventions that matter are structural, not micro-optimizations.

A component that updates every second, a countdown or a live clock, is its own subtree with its own state. When that state sits higher up, the entire page re-renders on a tick, and no amount of memoization further down repairs it. Isolate the thing that changes fast.

Long lists are windowed. A table rendering two thousand rows is not slow because React is slow, it is slow because two thousand rows exist in the DOM.

Heavy computation does not run in a client component at all, which is the same boundary as before, arriving from a different direction. And URL state helps here too: because the view is reconstructible from the URL, a navigation is a fresh render from a known input rather than an incremental patch on state that has been mutating for ten minutes.

Layout constraints are structural in the same way. The app has to work at 320px with no horizontal page overflow, so dense tables live in scroll containers and the filter bar is one responsive component that keeps inline controls on desktop and collapses into a sheet on mobile. Same state, same URL params, different affordance. Two separate implementations of a mobile and desktop filter bar means two places to update and one of them will lag.

## What this costs

Boundaries are not free and pretending otherwise is a tell.

URL state is more verbose than `useState`. You write parsers, you validate params, you handle garbage input, and you accept that every filter change is a navigation. On a view with two filters that nobody shares, `useState` is the right call and I use it.

Three tiers means more files. A small feature can touch a primitive, a domain component, and a route composition. That feels like ceremony when the feature is a single card.

Passing values instead of rows means more prop plumbing, and there are days you would rather hand the whole object down.

I would not pay any of this on a prototype or a page that will be deleted in a quarter. It pays off when a view is long-lived, shared between surfaces, or displays something a user will act on.

## Whether the structure held

The honest test is a feature nobody planned for. Two arrived.

Deep-linking from notifications into a specific filtered view was close to free, because the filters already lived in the URL. The feature was a link. Under the sync-two-owners version it would have been a rewrite of the filter layer.

Cross-surface reuse of a summary figure was the same story from the other side. The number already existed as a server-side computation with a typed result, so a second surface consumed it rather than recomputing it. Had the first consumer been a chart that summed its own props, the second would have written its own version and the two would have drifted.

Neither was clever. Both were cheap because a placement decision made early meant there was only one thing to change.

## The questions I ask in a frontend review

1. What kind of state is this, and does anything else hold the same value?
2. Would a user expect this to survive a refresh, a share, or the back button?
3. Is this effect synchronizing two pieces of our own state? If so, what can be deleted?
4. Is this the first place this number comes into existence on the client?
5. Could this component render in isolation with hand-written props?

None of it is exotic. It is mostly refusing to let a value have two homes, and noticing early, while moving it is still a small change rather than an argument about a rewrite.

## References

- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect): the canonical case against synchronized derived state.
- [Next.js App Router](https://nextjs.org/docs): server and client component boundaries, and search params as state.
- [TanStack Query](https://tanstack.com/query/latest) · [React Hook Form](https://react-hook-form.com/): owners for server cache and form state.
- [TanStack Virtual](https://tanstack.com/virtual/latest): windowing long lists.
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction) · [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/): the primitive tier, and behavior worth not reimplementing.
