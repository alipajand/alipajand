/**
 * Display copy for the portfolio index layout. Case-study facts stay in `data/projects.ts`; this
 * file only holds the labels, headings and decorative phrases the hairline layout adds around them.
 */

export const PORTFOLIO_DISPLAY_WORDS = ["Selected", "Work"] as const;

/** Decorative map coordinates in the hero corner (Montreal). */
export const PORTFOLIO_HERO_COORDINATES = ["45.5017° N", "73.5673° W"] as const;

export const PORTFOLIO_SCROLL_CUE = "Scroll";

/** Plates drawn in the hero, from the first architecture call down to production. */
export const PORTFOLIO_HERO_LAYERS = [
  { name: "Architecture call", stack: "Product + system design", kind: "arch" },
  { name: "Interface", stack: "React · Next.js · TypeScript", kind: "ui" },
  { name: "Design system", stack: "Components · tokens · a11y", kind: "ds" },
  { name: "API", stack: "Node.js · Fastify", kind: "api" },
  { name: "Data + jobs", stack: "PostgreSQL · background jobs", kind: "data" },
  { name: "Production", stack: "Tests · CI · release", kind: "prod" },
] as const;

export type PortfolioHeroLayerKind = (typeof PORTFOLIO_HERO_LAYERS)[number]["kind"];

/** Decorative phrases in the ticker under the display line. */
export const PORTFOLIO_PRINCIPLE_TICKER = [
  "Explicit async, error, and empty states",
  "Accessible by default",
  "Tests and CI as guardrails",
  "AI as acceleration, not authority",
] as const;

export const PORTFOLIO_BAND_EYEBROW = "[ How to read this index ]";
export const PORTFOLIO_BAND_HEADING = "Ordered by how much each one shows";

/** Large rotated words beside the intro: the core stack. */
export const PORTFOLIO_STACK_WORDS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
] as const;

export const PORTFOLIO_QUOTE = "AI as acceleration, not authority.";
export const PORTFOLIO_QUOTE_CITE = "Operating principle";

/** Case-study groups on the index, in `PORTFOLIO_CASE_STUDY_ORDER` order. */
export const PORTFOLIO_GROUPS = [
  { label: "Lead", size: 3 },
  { label: "Supporting", size: 3 },
  { label: "Experiment", size: 1 },
] as const;

export const PORTFOLIO_SCENE_EYEBROW = "[ Operating model ]";
export const PORTFOLIO_SCENE_HEADING = "Design systems as product infrastructure";
export const PORTFOLIO_SCENE_STEPS = [
  {
    label: "Parts",
    title: "Laid out flat",
    body: "Components, tokens, and states, each defined once.",
  },
  {
    label: "Contract",
    title: "Pulled together",
    body: "Shared APIs and accessibility defaults hold them in shape.",
  },
  {
    label: "System",
    title: "One library",
    body: "Enforced in CI, under every product surface.",
  },
] as const;

export const PORTFOLIO_CONTACT_EYEBROW = "[ Next step ]";
export const PORTFOLIO_CONTACT_HEADING = "Let’s talk";

export const portfolioWorksNote = (count: number, firstYear: number): string =>
  `${count} projects · ${firstYear} — present`;
