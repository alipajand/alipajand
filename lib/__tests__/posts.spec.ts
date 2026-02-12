/**
 * @jest-environment node
 */

import { readdirSync } from "fs";
import { join } from "path";
import { getAllPosts, getLatestPosts, getPostBySlug } from "lib/posts";

jest.mock("marked", () => ({
  marked: {
    parse: (content: string) => `<p>${content}</p>`,
  },
}));

const POSTS_DIR = join(process.cwd(), "content", "posts");

describe("lib/posts", () => {
  describe("getAllPosts", () => {
    it("returns array of posts with slug, title, date, excerpt", () => {
      const posts = getAllPosts();
      expect(Array.isArray(posts)).toBe(true);
      posts.forEach((post) => {
        expect(post).toHaveProperty("slug");
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("date");
        expect(post).toHaveProperty("excerpt");
        expect(post).not.toHaveProperty("contentHtml");
      });
    });

    it("sorts posts by date descending", () => {
      const posts = getAllPosts();
      if (posts.length < 2) return;
      for (let i = 0; i < posts.length - 1; i++) {
        expect(posts[i].date.localeCompare(posts[i + 1].date)).toBeGreaterThanOrEqual(0);
      }
    });

    it("excludes readme.md from slugs", () => {
      const posts = getAllPosts();
      const slugs = posts.map((p) => p.slug);
      expect(slugs).not.toContain("readme");
      expect(slugs).not.toContain("README");
    });
  });

  describe("getPostBySlug", () => {
    it("returns full post with contentHtml for valid slug", () => {
      const slugs = readdirSync(POSTS_DIR)
        .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
        .map((f) => f.replace(/\.md$/, ""));
      if (slugs.length === 0) return;
      const post = getPostBySlug(slugs[0]);
      expect(post).not.toBeNull();
      expect(post).toHaveProperty("slug", slugs[0]);
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("date");
      expect(post).toHaveProperty("excerpt");
      expect(post).toHaveProperty("contentHtml");
      expect(typeof (post as { contentHtml: string }).contentHtml).toBe("string");
    });

    it("returns null for non-existent slug", () => {
      expect(getPostBySlug("non-existent-slug-xyz")).toBeNull();
    });
  });

  describe("getLatestPosts", () => {
    it("returns at most count posts", () => {
      const posts = getLatestPosts(1);
      expect(posts.length).toBeLessThanOrEqual(1);
    });

    it("returns same order as getAllPosts slice", () => {
      const all = getAllPosts();
      const latest = getLatestPosts(2);
      expect(latest).toEqual(all.slice(0, 2));
    });
  });
});
