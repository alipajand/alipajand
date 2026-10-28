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

export const NOW_UPDATED = "2026-05-08";

export const NOW_YEAR = Number(NOW_UPDATED.slice(0, 4));

export const NOW_UPDATED_PREFIX = "Updated";

export const NOW_STACK_SECTION_ID = "current-stack";

export const NOW_INTRO_ARIA_LABEL = "About this page";

export const NOW_ADDRESS_LABEL = "[ alipajand.com/now ]";

export const nowStackCountLabel = (position: number, toolCount: number): string =>
  `[ ${String(position).padStart(2, "0")} ] · ${toolCount} tools`;

export const NOW_RULER_STEP = weekOfCalendarDate(NOW_UPDATED);

export const NOW_RULER_LABEL = `As of ${formatDate(NOW_UPDATED)}`;
