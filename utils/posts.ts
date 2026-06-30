import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import hljs from "highlight.js/lib/common";
import { load } from "js-yaml";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";

const LANG_ALIASES: Record<string, string> = {
  tsx: "typescript",
  jsx: "javascript",
};

const resolveLanguage = (lang: string): string => {
  const normalized = LANG_ALIASES[lang] ?? lang;
  return normalized && hljs.getLanguage(normalized) ? normalized : "plaintext";
};

marked.use(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight: (code, lang) => hljs.highlight(code, { language: resolveLanguage(lang) }).value,
  })
);

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
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  tags?: string[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  tags?: string[];
  contentHtml: string;
}

const getPostSlugs = (): string[] => {
  if (!readdirSync(POSTS_DIR, { withFileTypes: true })) return [];
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => toSafeSlug(f.replace(/\.md$/, "")))
    .filter((slug) => slug.length > 0);
};

export const getAllPosts = (): Omit<Post, "contentHtml">[] => {
  const slugs = getPostSlugs();
  return slugs
    .map((slug) => {
      const path = join(POSTS_DIR, `${slug}.md`);
      const raw = readFileSync(path, "utf-8");
      const { data } = parseFrontmatter(raw);
      const fm = data as unknown as PostFrontmatter;
      return {
        slug,
        title: fm.title ?? slug,
        date: fm.date ?? "",
        excerpt: fm.excerpt ?? "",
        ...(typeof fm.seoTitle === "string" && fm.seoTitle.length > 0
          ? { seoTitle: fm.seoTitle }
          : {}),
        ...(typeof fm.seoDescription === "string" && fm.seoDescription.length > 0
          ? { seoDescription: fm.seoDescription }
          : {}),
        ...(fm.featured === true ? { featured: true as const } : {}),
        ...(Array.isArray(fm.tags) && fm.tags.length > 0 ? { tags: fm.tags as string[] } : {}),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
};

export const getPostBySlug = (slug: string): Post | null => {
  try {
    const path = join(POSTS_DIR, `${slug}.md`);
    const raw = readFileSync(path, "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const fm = data as unknown as PostFrontmatter;
    const contentHtml = marked.parse(content, { async: false }) as string;
    return {
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "",
      excerpt: fm.excerpt ?? "",
      ...(typeof fm.seoTitle === "string" && fm.seoTitle.length > 0
        ? { seoTitle: fm.seoTitle }
        : {}),
      ...(typeof fm.seoDescription === "string" && fm.seoDescription.length > 0
        ? { seoDescription: fm.seoDescription }
        : {}),
      ...(fm.featured === true ? { featured: true as const } : {}),
      ...(Array.isArray(fm.tags) && fm.tags.length > 0 ? { tags: fm.tags as string[] } : {}),
      contentHtml,
    };
  } catch {
    return null;
  }
};

export const getLatestPosts = (count: number): Omit<Post, "contentHtml">[] => {
  return getAllPosts().slice(0, count);
};

export const getPostsForWritingSection = (
  recentCount: number
): {
  featured: Omit<Post, "contentHtml"> | null;
  recent: Omit<Post, "contentHtml">[];
} => {
  const all = getAllPosts();
  const featured = all.find((p) => p.featured === true) ?? null;
  const withoutFeatured = featured ? all.filter((p) => p.slug !== featured.slug) : all;
  return {
    featured,
    recent: withoutFeatured.slice(0, recentCount),
  };
};
