import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = join(process.cwd(), "content", "posts");

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
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
      contentHtml,
    };
  } catch {
    return null;
  }
}

export function getLatestPosts(count: number): Omit<Post, "contentHtml">[] {
  return getAllPosts().slice(0, count);
}
