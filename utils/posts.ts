import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { load } from "js-yaml";
import { marked } from "marked";

import { isCalendarDate, isPublished, isRoutable } from "utils/publication";

import { assertDiagramSlots, extractDiagramBlocks, type DiagramSpec } from "utils/diagramBlocks";
import { addHeadingIds, type PostHeading } from "utils/headings";
import { renderHighlightedCode } from "utils/highlightCode";
import { sanitizePostHtml } from "utils/sanitizePostHtml";

// Fenced code is highlighted at build time; the article ships finished HTML and no highlighter.
marked.use({
  renderer: {
    code: ({ text, lang }: { text: string; lang?: string }) => renderHighlightedCode(text, lang),
  },
});

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

const parseFrontmatter = (raw: string): { data: Record<string, unknown>; content: string } => {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    return { data: {}, content: raw };
  }

  const [, frontmatter, content] = match;
  if (!frontmatter.trim()) {
    return { data: {}, content };
  }

  return {
    data: (load(frontmatter) ?? {}) as Record<string, unknown>,
    content,
  };
};

const POSTS_DIR = join(process.cwd(), "content", "posts");

const toSafeSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export interface PostFrontmatter {
  title: string;
  /** Publication day on the America/Toronto calendar, quoted: `"2026-10-28"`. */
  date: string;
  /** Last substantive edit, quoted, on or after `date`. */
  updated?: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  tags?: string[];
  /** Never served. Drafts stay outside this repository; see utils/publication.ts. */
  draft?: boolean;
  /** Before its date, answer at the URL as an unlisted, `noindex` preview. */
  preview?: boolean;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  tags?: string[];
  draft?: boolean;
  preview?: boolean;
  contentHtml: string;
  headings: PostHeading[];
  diagrams: DiagramSpec[];
}

export type PostSummary = Omit<Post, "contentHtml" | "headings" | "diagrams">;

const getPostSlugs = (): string[] => {
  if (!readdirSync(POSTS_DIR, { withFileTypes: true })) return [];
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => toSafeSlug(f.replace(/\.md$/, "")))
    .filter((slug) => slug.length > 0);
};

const OPTIONAL_FLAGS = ["featured", "draft", "preview"] as const;

/**
 * Frontmatter as a post summary. Publication fields are checked so a typo fails the build instead
 * of publishing early or never: `date` and `updated` must be quoted `YYYY-MM-DD` days (unquoted,
 * YAML turns them into timestamps), `updated` may not precede `date`, flags must be booleans, and
 * a draft cannot also be a preview.
 */
export const toPostSummary = (slug: string, data: Record<string, unknown>): PostSummary => {
  const fail = (message: string): never => {
    throw new Error(`content/posts/${slug}.md: ${message}`);
  };
  const fm = data as Partial<Record<keyof PostFrontmatter, unknown>>;
  if (!isCalendarDate(fm.date)) fail(`"date" must be a quoted YYYY-MM-DD day`);
  const date = fm.date as string;
  if (fm.updated !== undefined) {
    if (!isCalendarDate(fm.updated)) fail(`"updated" must be a quoted YYYY-MM-DD day`);
    if ((fm.updated as string) < date) fail(`"updated" is before "date"`);
  }
  for (const flag of OPTIONAL_FLAGS) {
    if (fm[flag] !== undefined && typeof fm[flag] !== "boolean")
      fail(`"${flag}" must be true or false`);
  }
  if (fm.draft === true && fm.preview === true) fail(`a draft cannot also be a preview`);

  return {
    slug,
    title: typeof fm.title === "string" ? fm.title : slug,
    date,
    ...(fm.updated !== undefined ? { updated: fm.updated as string } : {}),
    excerpt: typeof fm.excerpt === "string" ? fm.excerpt : "",
    ...(typeof fm.seoTitle === "string" && fm.seoTitle.length > 0 ? { seoTitle: fm.seoTitle } : {}),
    ...(typeof fm.seoDescription === "string" && fm.seoDescription.length > 0
      ? { seoDescription: fm.seoDescription }
      : {}),
    ...(fm.featured === true ? { featured: true as const } : {}),
    ...(Array.isArray(fm.tags) && fm.tags.length > 0 ? { tags: fm.tags as string[] } : {}),
    ...(fm.draft === true ? { draft: true as const } : {}),
    ...(fm.preview === true ? { preview: true as const } : {}),
  };
};

/**
 * Every post file, in every publication state, newest first. Only for code that decides
 * visibility itself (route params, validation); public surfaces use `getPublishedPosts`.
 */
export const getAllPosts = (): PostSummary[] =>
  getPostSlugs()
    .map((slug) => {
      const { data } = parseFrontmatter(readFileSync(join(POSTS_DIR, `${slug}.md`), "utf-8"));
      return toPostSummary(slug, data);
    })
    .sort((a, b) => b.date.localeCompare(a.date));

/** Same alphabet `toSafeSlug` produces; anything else (e.g. `../`) is not a post. */
const POST_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const readPostFile = (slug: string): string | null => {
  if (!POST_SLUG_RE.test(slug)) return null;
  try {
    return readFileSync(join(POSTS_DIR, `${slug}.md`), "utf-8");
  } catch {
    return null;
  }
};

/**
 * Post Markdown to article HTML: diagram fences become slots, Markdown is rendered with highlighted
 * code, the result is sanitised against an allowlist, and h2/h3 get generated ids. Runs at build.
 */
export const renderPostHtml = (
  markdown: string
): { html: string; headings: PostHeading[]; diagrams: DiagramSpec[] } => {
  const { markdown: withSlots, diagrams } = extractDiagramBlocks(markdown);
  const safe = sanitizePostHtml(marked.parse(withSlots, { async: false }) as string);
  assertDiagramSlots(safe, diagrams.length);
  const { html, headings } = addHeadingIds(safe);
  return { html, headings, diagrams };
};

export const getPostBySlug = (slug: string): Post | null => {
  const raw = readPostFile(slug);
  if (raw === null) return null;

  const { data, content } = parseFrontmatter(raw);
  const summary = toPostSummary(slug, data);
  const { html: contentHtml, headings, diagrams } = renderPostHtml(content);
  return { ...summary, contentHtml, headings, diagrams };
};

/** Post body as authored Markdown, without frontmatter. Used for plain-text exports. */
export const getPostMarkdown = (slug: string): string | null => {
  const raw = readPostFile(slug);
  if (raw === null) return null;
  return parseFrontmatter(raw).content.trim();
};

/** Posts that are published at `now`: the only ones any list, feed, export or sitemap shows. */
export const getPublishedPosts = (now: Date): PostSummary[] =>
  getAllPosts().filter((post) => isPublished(post, now));

/**
 * Slugs the article and OG image routes generate: every post except drafts. A scheduled post is
 * generated so it exists in the route table (`dynamicParams = false`); until its date the page
 * answers 404, or a `noindex` preview when it opts in. See `isRoutable`.
 */
export const getGeneratedPostSlugs = (): string[] =>
  getAllPosts()
    .filter((post) => post.draft !== true)
    .map((post) => post.slug);

/** The post at `slug` if its article may be served at `now`. */
export const getRoutablePost = (slug: string, now: Date): Post | null => {
  const post = getPostBySlug(slug);
  return post && isRoutable(post, now) ? post : null;
};

export const getLatestPosts = (count: number, now: Date): PostSummary[] => {
  return getPublishedPosts(now).slice(0, count);
};

export const getPostsForWritingSection = (
  recentCount: number,
  now: Date
): {
  featured: PostSummary | null;
  recent: PostSummary[];
} => {
  const all = getPublishedPosts(now);
  const featured = all.find((p) => p.featured === true) ?? null;
  const withoutFeatured = featured ? all.filter((p) => p.slug !== featured.slug) : all;
  return {
    featured,
    recent: withoutFeatured.slice(0, recentCount),
  };
};
