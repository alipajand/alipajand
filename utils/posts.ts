import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = join(process.cwd(), "content", "posts");

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  featured?: boolean;
  tags?: string[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  featured?: boolean;
  tags?: string[];
  contentHtml: string;
}

function getPostSlugs(): string[] {
  if (!readdirSync(POSTS_DIR, { withFileTypes: true })) return [];
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts(): Omit<Post, "contentHtml">[] {
  const slugs = getPostSlugs();
  return slugs
    .map((slug) => {
      const path = join(POSTS_DIR, `${slug}.md`);
      const raw = readFileSync(path, "utf-8");
      const { data } = matter(raw);
      const fm = data as PostFrontmatter;
      return {
        slug,
        title: fm.title ?? slug,
        date: fm.date ?? "",
        excerpt: fm.excerpt ?? "",
        ...(fm.featured === true ? { featured: true as const } : {}),
        ...(Array.isArray(fm.tags) && fm.tags.length > 0 ? { tags: fm.tags as string[] } : {}),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const path = join(POSTS_DIR, `${slug}.md`);
    const raw = readFileSync(path, "utf-8");
    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;
    const contentHtml = marked.parse(content, { async: false }) as string;
    return {
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "",
      excerpt: fm.excerpt ?? "",
      ...(fm.featured === true ? { featured: true as const } : {}),
      ...(Array.isArray(fm.tags) && fm.tags.length > 0 ? { tags: fm.tags as string[] } : {}),
      contentHtml,
    };
  } catch {
    return null;
  }
}

export function getLatestPosts(count: number): Omit<Post, "contentHtml">[] {
  return getAllPosts().slice(0, count);
}

export function getPostsForWritingSection(recentCount: number): {
  featured: Omit<Post, "contentHtml"> | null;
  recent: Omit<Post, "contentHtml">[];
} {
  const all = getAllPosts();
  const featured = all.find((p) => p.featured === true) ?? null;
  const withoutFeatured = featured ? all.filter((p) => p.slug !== featured.slug) : all;
  return {
    featured,
    recent: withoutFeatured.slice(0, recentCount),
  };
}
