import { formatDate } from "utils/date";
import { weekOfCalendarDate } from "utils/week";

export const NOW_PAGE_TITLE = "Now";

export const NOW_META_DESCRIPTION =
  "Current focus: what’s shipping, what’s under study, tooling experiments, writing, and the stack in use.";

export const NOW_LEDE = "Snapshot of active work and interests, updated when priorities shift.";

export interface NowSection {
  id: string;
  title: string;
  items: string[];
  footer?: { href: string; label: string };
}

export const NOW_SECTIONS: NowSection[] = [
  {
    id: "building",
    title: "Building",
    items: [
      "LedgerGuard-style separation: deterministic domain APIs vs probabilistic workers; renewal read models that surface drift instead of implying certainty.",
      "Design-system patterns for multi-app repos: shared primitives, typed boundaries, CI that guards a11y and visual regressions.",
    ],
  },
  {
    id: "thinking-about",
    title: "Thinking About",
    items: [
      "Truth precedence when extraction, synthesis, and persisted rows disagree, with explicit repair paths instead of silent merges.",
      "Trust boundaries for AI-assisted flows: traceability, reviewer workflows, and when to refuse automation.",
    ],
  },
  {
    id: "exploring",
    title: "Exploring",
    items: [
      "MCP servers that wrap lint, types, and tests so editor feedback matches CI expectations.",
      "Queue semantics for idempotent workers: retries, partial failure, and internal callbacks that cannot bypass domain rules.",
    ],
  },
  {
    id: "writing",
    title: "Writing",
    items: [
      "Architecture and DX notes, including case studies, MCP workflow, and multi-tenant product engineering.",
    ],
    footer: { href: "/writing", label: "Writing archive" },
  },
  {
    id: "current-stack",
    title: "Current Stack",
    items: [
      "TypeScript · React · Next.js · Node (Fastify) · PostgreSQL · Prisma · Zod · OpenAPI · BullMQ · Supabase Auth · Stripe · Sentry · GitHub Actions",
    ],
  },
];

/**
 * The date this page's content was last revised (`YYYY-MM-DD`), set by hand whenever `NOW_LEDE` or
 * `NOW_SECTIONS` changes. It drives the "Now <year>" title, the visible "Updated" line, the page's
 * `dateModified` and its sitemap `lastmod`. Nothing updates it automatically, and a deploy alone
 * does not change it.
 *
 * 2026-05-08 is the last commit that changed the section text (ef48e66). Later commits only
 * reformatted the lede (a66f466) or added display labels (c0f783a).
 */
export const NOW_UPDATED = "2026-05-08";

/** The year in the display title, taken from `NOW_UPDATED` rather than the build clock. */
export const NOW_YEAR = Number(NOW_UPDATED.slice(0, 4));

export const NOW_UPDATED_PREFIX = "Updated";

/** The section shown as the stack band instead of a numbered cell. */
export const NOW_STACK_SECTION_ID = "current-stack";

export const NOW_INTRO_ARIA_LABEL = "About this page";

export const NOW_ADDRESS_LABEL = "[ alipajand.com/now ]";

/** The stack band's count, for example "[ 05 ] · 13 tools". */
export const nowStackCountLabel = (position: number, toolCount: number): string =>
  `[ ${String(position).padStart(2, "0")} ] · ${toolCount} tools`;

/**
 * The ruler marks the step `NOW_UPDATED` falls on (52 seven-day steps from January 1, see
 * `utils/week.ts`): step 19 for 2026-05-08. It is the same on the server, without JavaScript and on
 * every visitor's clock, because it dates the content, not the visit.
 */
export const NOW_RULER_STEP = weekOfCalendarDate(NOW_UPDATED);

/** The marker's label, for example "As of May 8, 2026". */
export const NOW_RULER_LABEL = `As of ${formatDate(NOW_UPDATED)}`;
