import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import { load } from "js-yaml";
import { marked } from "marked";

import { isCalendarDate, isPublished, isRoutable } from "utils/publication";

import { assertDiagramSlots, extractDiagramBlocks, type DiagramSpec } from "utils/diagramBlocks";
import { addHeadingIds, type PostHeading } from "utils/headings";
import { renderHighlightedCode } from "utils/highlightCode";
import { sanitizePostHtml } from "utils/sanitizePostHtml";

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
  date: string;
  updated?: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  tags?: string[];
  draft?: boolean;
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

export const getAllPosts = (): PostSummary[] =>
  getPostSlugs()
    .map((slug) => {
      const { data } = parseFrontmatter(readFileSync(join(POSTS_DIR, `${slug}.md`), "utf-8"));
      return toPostSummary(slug, data);
    })
    .sort((a, b) => b.date.localeCompare(a.date));

const POST_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const readPostFile = (slug: string): string | null => {
  if (!POST_SLUG_RE.test(slug)) return null;
  try {
    return readFileSync(join(POSTS_DIR, `${slug}.md`), "utf-8");
  } catch {
    return null;
  }
};

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

export const getPostMarkdown = (slug: string): string | null => {
  const raw = readPostFile(slug);
  if (raw === null) return null;
  return parseFrontmatter(raw).content.trim();
};

export const getPublishedPosts = (now: Date): PostSummary[] =>
  getAllPosts().filter((post) => isPublished(post, now));

export const getGeneratedPostSlugs = (): string[] =>
  getAllPosts()
    .filter((post) => post.draft !== true)
    .map((post) => post.slug);

export const getRoutablePost = (slug: string, now: Date): Post | null => {
  const post = getPostBySlug(slug);
  return post && isRoutable(post, now) ? post : null;
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
