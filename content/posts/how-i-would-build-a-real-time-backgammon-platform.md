---
title: "How I would approach building a real-time backgammon platform"
date: "2026-06-29"
excerpt: "A practical frontend architecture approach for a chess.com-style backgammon product: real-time game state, SVG rendering, the play-improve-compete loop, accessibility, and the infrastructure that makes the UI trustworthy."
seoTitle: "How I would build a real-time backgammon platform — Ali Pajand"
seoDescription: "A senior frontend architecture approach to a chess.com-style backgammon platform: real-time gameplay, SVG rendering, WebSockets, typed state, replay, analysis, accessibility, and entitlements."
tags:
  - Frontend Architecture
  - Real-time UI
  - Product Engineering
  - React
---

When someone says "the next [chess.com](https://www.chess.com/) for backgammon," I do not start with the board.

The board matters, but the product is bigger than the board. A serious platform needs to feel instant during a match, stay trustworthy when rating or money is involved, help players improve, and give them a reason to come back. So the frontend is not rendering checkers and dice. It is coordinating a real-time product system: matchmaking, live gameplay, timers, replay, analysis, profiles, leaderboards, tournaments, and subscriptions.

This is how I would approach the frontend architecture.

## Start with the product guarantees

Before picking libraries, I would define what the interface has to guarantee:

- The board always reflects the server-authoritative game state.
- A user can always tell whose turn it is, which dice are active, and which moves are legal.
- Reconnects restore the match instead of corrupting it.
- Ranked games never depend on client-side trust.
- Replay and analysis read from the same game history as live play.
- Mobile interaction is first-class, not a squeezed desktop layout.

Those guarantees shape the architecture more than the visual design does.

## The product is a loop, not a board

The thing that makes a platform sticky is the loop around the board: play a match, review what happened, understand a mistake, practice it, come back and play again. Chess.com is not big because it renders chess. It is big because it closed that loop.

So I would treat the product as five surfaces over **one shared game model**: live gameplay, replay, analysis, learning, and competition. Monetization wraps the loop rather than living inside any one surface.

The architectural consequence is the point: all five surfaces read from the same game model and the same event history. If replay, analysis, and live play each invented their own representation of a game, the product would rot from the inside. That single decision, one model serving many surfaces, is what makes the moat (play, improve, compete, return) buildable.

## The stack and the boundaries

For the web app I would use [Next.js](https://nextjs.org/docs), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/docs/). Next.js because the product needs public, SEO-driven pages (profiles, leaderboards, lessons) alongside the authenticated game. TypeScript because game state, move events, and entitlements need contracts that are hard to misuse.

The one boundary I care about most: **the game engine does not live inside React components.** Pure game logic (legal moves, dice, scoring, match rules, serialization, replay) sits in its own domain layer. React renders state and collects intent; it is not the source of truth for game rules.

```txt
Server-authoritative state -> typed client adapter -> local UI state -> rendered board
```

## Server-authoritative gameplay

For any ranked, tournament, or paid game, the server is authoritative. The client can preview legal moves and animate checkers to feel fast, but the server validates the actual move. This is standard client-side prediction with server reconciliation: predict locally, confirm against the server, reconcile or roll back ([Gabriel Gambetta has the clearest write-up](https://www.gabrielgambetta.com/client-server-game-architecture.html)).

The server's response is where the contract lives:

```ts
type ServerGameEvent =
  | { type: "GAME_STATE_UPDATED"; gameId: string; version: number; state: GameState }
  | {
      type: "MOVE_REJECTED";
      gameId: string;
      clientSeq: number;
      reason: string;
      authoritativeState: GameState;
    };
```

That `version` lets the client detect drift after a reconnect or missed event. The `authoritativeState` on a rejection is the snapshot the client rolls back to when its optimistic preview was wrong.

The transport itself matters less than the protocol. Whether it is the raw [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) with a typed wrapper or [Socket.IO](https://socket.io/docs/v4/client-api/) for built-in reconnect and rooms, the rules are the same: every client event carries an idempotency key, every server event carries a monotonic version, the client has a resync path, and timers reconcile against server-stamped deadlines rather than trusting the browser clock.

## Keep the kinds of state separate

A game product has several kinds of state, and each belongs somewhere different. The failure mode I want to avoid is one app-wide store where server cache, form drafts, hover state, and live match state all rot together.

- **Product data** ([TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)): profiles, match history, leaderboards, billing.
- **Authoritative game state** (a socket-session store): the current match, which only changes when the server says so.
- **Client preview state**: the optimistic board after a submitted-but-unconfirmed move. It is derived state, reconciled on confirm and rolled back on reject.
- **Local interaction state** ([Zustand](https://zustand.docs.pmnd.rs/)): selected checker, drag, replay cursor, UI panels.
- **Form state** ([React Hook Form](https://react-hook-form.com/)): settings, profile edits, tournament setup.
- **Runtime validation** ([Zod](https://zod.dev/)): socket payloads and API responses are runtime data, so I parse them before rendering anything product-critical.

## Board rendering: SVG first

For the board I would start with [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG), not canvas and not 3D. Backgammon needs precise hit targets, crisp scaling, accessible labels, and per-element highlights, and a board is only a few dozen nodes, which is exactly where SVG's per-element cost is a non-issue. (SVG hurts at thousands of nodes; a board never gets there.)

It can still feel dimensional without real 3D: gradients and shadows for checker depth, layered stacks, a little `perspective()` for a tabletop effect, and [Motion for React](https://motion.dev/docs/react) for checker movement and replay transitions. A full [Three.js](https://threejs.org/) board adds camera, lighting, hit-testing, and mobile-performance complexity. I would save that for premium themes, not the default game.

## Interaction: click first, drag second

I would prioritize click-to-move because it is reliable on desktop and touch, then add [dnd kit](https://dndkit.com/) drag as an enhancement the product does not depend on. Either way, move calculation stays outside the interaction layer. The board asks the engine for legal targets, the user picks one, the client sends intent, and the server decides:

```txt
UI interaction -> local preview -> move intent -> server validation -> authoritative state
```

## The MVP proves the loop

The first version should prove one path: arrive, play a match (as guest or account), see the result, review it, play again. That means landing, auth, lobby, matchmaking, the live game, a result screen, profile, match history, a basic leaderboard, and, critically, a **replay viewer**.

Replay is where "one model, many surfaces" first pays off. Every finished game becomes a durable object, and replay derives board state by reading the same event history live play produced. Move history has to be first-class from day one:

```ts
type GameRecord = {
  gameId: string;
  players: [PlayerSummary, PlayerSummary];
  initialState: GameState;
  events: GameEvent[];
  result: GameResult;
  createdAt: string;
};
```

## Analysis and competition close the loop

Analysis is what turns a finished game into a reason to play the next one. The engine behind it can arrive later, but the UI contract should be designed early so it can deepen progressively:

```ts
type MoveAnalysis = {
  moveId: string;
  label: "best" | "good" | "inaccuracy" | "mistake" | "blunder" | "unknown";
  equityBefore?: number;
  equityAfter?: number;
  bestMove?: BackgammonMove;
  explanation?: string;
  confidence: "engine" | "heuristic" | "unavailable";
};
```

That `confidence` field is not decoration. If an LLM ever explains a move, the UI has to distinguish verified engine output from generated text. The interface should never make probabilistic text look more authoritative than the system can support.

Competition is the other half. Profiles, scoped leaderboards, and tournaments are mostly product UI, with one rule: a tournament match is still a live game, so it hands off to the same game client and reads results from the same authoritative state. Bracket state lives in the product cache; the match lives in the game session. That boundary is what stops "tournament mode" from becoming a second, divergent board.

## Design system without a business-logic landfill

Shared primitives like [Tailwind](https://tailwindcss.com/docs/installation/using-vite), [Radix](https://www.radix-ui.com/primitives/docs/overview/introduction), and optionally [shadcn/ui](https://ui.shadcn.com/docs) cover the app chrome (buttons, dialogs, tabs, toasts). Game-specific components (board, checker, dice, doubling cube, clock, move list) are their own layer.

The line I would hold: a `Dialog` is shared; a `DoubleOfferDialog` belongs to the game feature because it owns cube state and match rules. Push game rules into the design system and it stops being a design system.

## Accessibility, performance, observability

Accessibility cannot wait until the end, because it shapes component APIs. I would lean on the [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) for dialogs and menus, give the board a readable summary and labelled points ("Point 6, two white checkers"), announce turn and dice state, respect [reduced-motion preferences](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), and never use color as the only signal.

Performance gets stricter on the live surface. A clock tick should not rerender the app tree: isolate the timer, update narrow state slices on socket events, lazy-load analysis and lessons, and virtualize long lists with [TanStack Virtual](https://tanstack.com/virtual/latest). The user should never feel the architecture during a match.

Observability should measure game health, not just page views. With [Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/) and [PostHog](https://posthog.com/docs) I would track move acknowledgement time, reconnect and resync counts, state mismatches, and drop-off after a first completed match, so I know the game feels broken before users say so.

## Testing follows ownership

Pure game logic (legal moves, bearing off, bar entry, match scoring, the [Crawford rule](https://en.wikipedia.org/wiki/Backgammon)) gets deterministic unit tests in [Vitest](https://vitest.dev/guide/). Components get [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). The journeys that matter most (make a legal move, reject an illegal one, reconnect mid-match, finish, open replay) get [Playwright](https://playwright.dev/docs/intro). The valuable tests prove rules, state transitions, and reconnect behavior, not snapshots.

## Monetization needs an entitlement layer

If there are subscriptions, the frontend should depend on entitlements, not raw plan names. Payments can run on [Stripe](https://docs.stripe.com/), but the UI asks:

```ts
if (!entitlements.canUseUnlimitedAnalysis) {
  return <UpgradePrompt reason="analysis-limit" />;
}
```

Not `if (user.plan !== "pro_annual_2026")`. That difference is what survives price changes, promotions, and grandfathered users: gating becomes a data change, not a code change across every surface.

## What I would build first

In order: the typed game model and event protocol, the SVG board, local legal-move preview, server-authoritative move submission, socket connection and resync, then matchmaking, result and match history, and replay. Profile, leaderboard, an entitlement shell, and an analysis placeholder come after. That order protects the hard parts (live play, state sync, replay correctness) before anyone polishes a marketing page.

## Complexity and scale: where the cost actually is

Most of the choices above exist so the expensive work stays bounded as the platform grows. The reassuring thing about backgammon is that almost nothing on the hot path of a single match gets more expensive as the product gets popular.

**Game logic is fixed-size.** A board is always 24 points, a bar, an off-tray, and a handful of checkers to weigh per roll, at most four sub-moves on a double. Working out the legal moves for a roll is a small, fixed amount of work no matter how many people are online. That is the whole reason the engine can be a pure, synchronous domain layer: validating or previewing a move never gets slower as the product grows.

**Matches are independent, so the system scales sideways.** Nothing on the gameplay hot path is shared global state. Each match is an isolated room keyed by its game id, so the total work is just the number of live matches, spread across as many servers as you care to run. Adding users adds more independent rooms rather than more contention on one structure, so you scale by adding machines, not by rewriting.

**Reconnect is cheap because state is versioned.** Detecting drift is a single integer comparison. Recovering is either one full snapshot (the game state is small) or a replay of only the events the client missed, which is usually a few. The client never re-derives the whole world to catch up; it asks how far behind it is and closes the gap.

**Replay is linear in a small number.** Folding the event log back into board state is one pass over the moves in a single game, and a game is only tens of moves long. Jumping to an arbitrary position costs about the same; if scrubbing ever feels heavy, dropping periodic position snapshots into the log lets it start from the nearest checkpoint instead. This is ordinary event sourcing ([Fowler's write-up](https://martinfowler.com/eaaDev/EventSourcing.html)), and it is why replay comes almost for free once live play is correct.

**The UI keeps per-tick work off the expensive path.** A clock tick updates one isolated subtree, not the whole component tree. Leaderboards and history virtualize, so the DOM only holds the rows actually on screen no matter how long the underlying list is, and fetching stays page-sized. The board is a bounded set of SVG nodes, so it never drifts toward the thousands-of-nodes range where SVG starts to hurt. An entitlement check reads a precomputed boolean instead of scanning plan rules.

The summary I would give a team: the only things that grow with usage are the number of live matches and the length of a few lists, and both have clean answers: shard the matches, window the lists. Everything on the hot path of a single match is bounded by the rules of backgammon, not by how popular the product gets.

## The standard I would aim for

The frontend should feel immediate but never pretend to know more than it does. During a match, speed. During reconnect, honesty. During analysis, a clear line between verified engine output and generated explanation. During replay, trust that the board came from the real match history.

That is the actual challenge here. Not "can we render a board?" but whether the interface can coordinate real-time state, product logic, monetization, and accessibility without becoming a fragile pile of UI exceptions. A good backgammon platform makes the game feel simple while the architecture quietly handles everything that is not.

## References

- [Chess.com](https://www.chess.com/): the product benchmark.
- [Backgammon rules and the doubling cube](https://en.wikipedia.org/wiki/Backgammon): rules and Crawford rule referenced above.
- [Gabriel Gambetta: Fast-Paced Multiplayer](https://www.gabrielgambetta.com/client-server-game-architecture.html): client-side prediction and server reconciliation.
- [Martin Fowler: Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html): the event-log model behind replay and resync.
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) · [Socket.IO](https://socket.io/docs/v4/client-api/): real-time transport.
- [Next.js](https://nextjs.org/docs) · [React](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/docs/): app foundation.
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) · [Zustand](https://zustand.docs.pmnd.rs/) · [Zod](https://zod.dev/) · [React Hook Form](https://react-hook-form.com/): state and validation.
- [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) · [Motion for React](https://motion.dev/docs/react) · [dnd kit](https://dndkit.com/) · [Three.js](https://threejs.org/): rendering and interaction.
- [Tailwind](https://tailwindcss.com/docs/installation/using-vite) · [Radix](https://www.radix-ui.com/primitives/docs/overview/introduction) · [shadcn/ui](https://ui.shadcn.com/docs) · [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/): UI layer and accessibility.
- [Vitest](https://vitest.dev/guide/) · [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) · [Playwright](https://playwright.dev/docs/intro): testing.
- [Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/) · [PostHog](https://posthog.com/docs) · [TanStack Virtual](https://tanstack.com/virtual/latest) · [Stripe](https://docs.stripe.com/): observability, performance, billing.
