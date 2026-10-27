import type { NextLink } from "components/hairline/NextLinks/NextLinks";

export const WRITING_SECTION_LEDE =
  "Notes on frontend architecture, design systems, trustworthy AI interfaces, developer experience, and shipping software that holds up.";

export const WRITING_WHY_IT_MATTERS =
  "These are the closest thing to watching me think: how I reason about architecture, product constraints, data integrity, performance, and where automated systems should stop and a person should decide.";

export const WRITING_FEATURED_LABEL = "Featured";

export const WRITING_ALL_POSTS_CTA = "Browse all posts";

export const WRITING_INDEX_TITLE =
  "Writing — Ali Pajand · Frontend Architecture & Product Engineering";

export const WRITING_INDEX_DESCRIPTION =
  "Notes on frontend architecture, design systems, trustworthy AI interfaces, developer experience, data integrity, performance, and reliable software delivery.";

export const WRITING_SECTION_HEADING = "Writing";

export const WRITING_INDEX_EMPTY_MESSAGE = "No posts yet. Check back soon.";

export const WRITING_POST_MCP_FIGCAPTION =
  "High-level MCP loop: the editor calls tools on the server; lint, types, and tests feed structured results back into the IDE.";

export const WRITING_INDEX_COLLECTION_NAME =
  "Writing on Frontend Architecture and Product Engineering";

export const WRITING_TOC_HEADING = "On this page";

export const WRITING_TOC_ARIA_LABEL = "Table of contents";

export const WRITING_DIAGRAM_OVERLINE = "Diagram";

export const WRITING_DIAGRAM_PREV_LABEL = "Previous";

export const WRITING_DIAGRAM_NEXT_LABEL = "Next";

export const WRITING_DIAGRAM_FLOW_HINT = "Select a step to see what happens there.";

export const WRITING_DIAGRAM_LAYERS_HINT = "Select a layer to see what it owns.";

export const writingDiagramStepCounter = (current: number, total: number): string =>
  `Step ${current} of ${total}`;

export const WRITING_UPCOMING_LABEL = "Upcoming";

/*
 * Hairline writing pages: labels around the post content (titles, dates, excerpts and tags come from
 * content/posts).
 */
// ── Index ──
export const WRITING_INDEX_EYEBROW = "[ Writing ]";
export const writingPublishedCount = (count: number): string =>
  `${count} ${count === 1 ? "post" : "posts"}`;
export const WRITING_HERO_LABEL = "Introduction";
export const WRITING_FEATURED_CTA = "Featured";
export const WRITING_FEATURED_HEADING = "Featured";
export const WRITING_WHY_EYEBROW = "[ Why it matters ]";
export const WRITING_WHY_LABEL = "Why it matters";
export const WRITING_ALL_POSTS_HEADING = "All posts";
export const WRITING_FILTER_LABEL = "Topic";
export const WRITING_FILTER_GROUP_LABEL = "Filter by topic";
export const WRITING_FILTER_ALL = "All";
export const writingShownCount = (shown: number, total: number): string =>
  `${shown} of ${total} posts`;
export const WRITING_READ_ARTICLE = "Read article";
export const WRITING_PREVIEW_ARTICLE = "Preview article";
/** A tag becomes a topic lane (timeline row, ticker item, filter chip) once this many posts use it. */
export const WRITING_TOPIC_LANE_MIN_POSTS = 4;
export const WRITING_TIMELINE_UPCOMING = "Upcoming";

export const WRITING_INDEX_NEXT_LABEL = "More";
export const WRITING_INDEX_NEXT_LINKS: readonly NextLink[] = [
  { eyebrow: "[ Tools ]", title: "Open source", href: "/open-source" },
  { eyebrow: "[ Operating model ]", title: "Principles", href: "/engineering-principles" },
  { eyebrow: "[ Contact ]", title: "Get in touch", href: "/#contact" },
];

// ── Article ──
export const WRITING_ARTICLE_PUBLISHED = "Published";
export const WRITING_ARTICLE_TOPICS = "Topics";
export const WRITING_ARTICLE_SUMMARY = "Summary";
export const WRITING_ARTICLE_TOC_EYEBROW = "[ On this page ]";
/** The launch layout labels its contents plainly, and uses the same words for the phone disclosure. */
export const WRITING_LAUNCH_TOC_EYEBROW = "On this page";
export const WRITING_MORE_HEADING = "More writing";
export const WRITING_MORE_ACTION = "All writing";
export const WRITING_BACK_TO_INDEX = "Back to writing";
export const WRITING_TABLE_REGION_LABEL = "Table, scrolls sideways";
export const writingDiagramBandLabel = (title: string): string => `Diagram: ${title}`;

export const WRITING_ARTICLE_NEXT_LABEL = "More from the site";
export const WRITING_ARTICLE_NEXT_LINKS: readonly NextLink[] = [
  { eyebrow: "[ Case studies ]", title: "Portfolio", href: "/portfolio" },
  { eyebrow: "[ Operating model ]", title: "Principles", href: "/engineering-principles" },
  { eyebrow: "[ Contact ]", title: "Get in touch", href: "/#contact" },
];

// ── Agent Readiness Doctor ──
/** Posts with the launch layout: the refactor scene above the article. */
export const WRITING_LAUNCH_ARTICLES: readonly string[] = ["agent-readiness-doctor"];

export const ARD_SCENE = {
  label: "Illustration: instructions drifting after a refactor",
  steps: [
    { eyebrow: "Step 01", title: "Before the refactor" },
    { eyebrow: "Step 02", title: "Tests green, guidance stale" },
    { eyebrow: "Step 03", title: "Smallest edit, for review" },
  ],
  guide: {
    title: "Repository guidance",
    kind: "Instructions",
    rows: [
      { label: "Shared components:", before: "src/ui", after: "components" },
      { label: "Validate with:", before: "verify", after: "check" },
    ],
    status: ["Matches the code", "2 outdated references", "Proposed diff · awaiting maintainer"],
  },
  repo: {
    title: "Repository",
    kind: "Code",
    rows: [
      { before: "src/ui/", after: "components/", note: "Shared components move" },
      { before: "scripts: verify", after: "scripts: check", note: "Validation script is renamed" },
    ],
    status: ["Build passing", "Build passing · tests green", "Build passing · tests green"],
  },
  footnote: "The example from this post, not a report from a measured deployment.",
} as const;
