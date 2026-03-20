export const SITE_NAME = "Ali Pajand";

/** Browser tab / OG title template; keep in sync with positioning. */
export const TAGLINE = "Senior Product Engineer · Design Systems · DX & Frontend";

export const KEYWORDS = [
  SITE_NAME,
  "Senior Product Engineer",
  "Senior Frontend Developer",
  "Design Systems",
  "Developer Experience",
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Montreal",
];

export const CANONICAL_URL = "https://alipajand.com";

/** `/portfolio` page — full-depth background (about, jobs, case studies, tooling, expertise). */
export const PORTFOLIO_PAGE_LEDE =
  "About, trajectory, case studies, and tooling—the full arc beyond the homepage snapshot.";

/** Short meta description for HTML / OG / Twitter (snippets; not the full hero paragraph). */
export const SITE_META_DESCRIPTION =
  "Senior product engineer in Montreal. Design systems, accessibility, TypeScript/React, DX tooling, and notes on how real systems ship.";

/**
 * X (Twitter) handle without @. Used for `twitter.creator` when set; set to null if you don’t use X.
 */
export const TWITTER_HANDLE: string | null = "alipajand";

/** Stable @id for JSON-LD graph (Person). */
export const PERSON_SCHEMA_ID = `${CANONICAL_URL}/#person`;

/** Stable @id for JSON-LD graph (WebSite). */
export const WEBSITE_SCHEMA_ID = `${CANONICAL_URL}/#website`;

/** Sharp line under the name (H1, second line)—scan in ~5 seconds. */
export const HERO_VALUE_LINE =
  "I ship accessible UIs and reliable releases—design systems, frontend architecture, and DX tooling.";

/** Outcome-focused supporting line below the value line. */
export const HERO_SUB =
  "9+ years turning messy requirements into shipped product. I own design-system rollouts, tight TypeScript/React stacks, and the release discipline teams need to move fast without breaking quality.";

export const ABOUT_PARAGRAPHS = [
  "I've spent 9+ years turning messy requirements into products that work. I do frontend (React, TypeScript, Next.js) and backend (Node.js, APIs), and I care a lot about design systems, component libraries, and the tools and docs that help teams move fast.",
  "I sit between design and engineering: I make sure the code is accessible and actually ships. I've run design-system rollouts and built things like an MCP server for Cursor so we catch issues before review. I like working in small teams where everyone cares about the product.",
  "I'm good at leading, working with others, and mentoring. I care about stable releases and making hard stuff simple so everyone can contribute.",
];

/** Contact section — who should reach out and what to expect. */
export const CONTACT_INTRO =
  "If you’re hiring for senior or staff frontend, product engineering, or design-systems/DX work—or you want to scope contract or consulting—I’m happy to talk. Share enough context that I can reply usefully: team size, stack, timeline, and what “good” looks like.";

/** Short bullets: good-fit reasons (honest, not a sales list). */
export const CONTACT_REASONS = [
  "Senior or staff IC roles in frontend, product engineering, or platform/product-facing UI.",
  "Design systems, component libraries, accessibility, or developer-experience tooling.",
  "Contract or consulting: clear scope, timeline, and constraints—I’ll say if it’s not a fit.",
  "Founders with a concrete product or architecture problem (not generic intros).",
] as const;

export const CONTACT_FORM_LEDE =
  "Prefer the form? I usually reply within a few business days. All fields are required.";

/** Compact proof row—high-signal, verifiable themes (no invented metrics). */
export const HERO_PROOF_ROW = [
  { value: "9+", label: "years building product" },
  { value: "Design systems", label: "rollouts & shared UI" },
  { value: "DX & architecture", label: "typed APIs, pipelines, review" },
  { value: "A11y-first", label: "UIs that ship" },
] as const;

/** Set to e.g. `/resume.pdf` after adding the file under `public/`; `null` hides the hero resume link. */
export const RESUME_URL: string | null = null;

export const LOCATION = "Based in Montreal, Quebec, Canada";
