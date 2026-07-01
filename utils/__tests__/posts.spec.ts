import { readdirSync } from "fs";
import { join } from "path";
import { getAllPosts, getLatestPosts, getPostBySlug, getPostsForWritingSection } from "utils/posts";

jest.mock("marked", () => ({
  marked: {
    parse: (content: string) => `<p>${content}</p>`,
    use: jest.fn(),
  },
}));

jest.mock("marked-highlight", () => ({
  markedHighlight: jest.fn(() => ({})),
}));

const POSTS_DIR = join(process.cwd(), "content", "posts");

describe("utils/posts", () => {
  describe("getAllPosts", () => {
    it("should return array of posts with slug, title, date, excerpt", () => {
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

    it("should sort posts by date descending", () => {
      const posts = getAllPosts();
      if (posts.length < 2) return;
      for (let i = 0; i < posts.length - 1; i++) {
        expect(posts[i].date.localeCompare(posts[i + 1].date)).toBeGreaterThanOrEqual(0);
      }
    });

    it("should exclude readme.md from slugs", () => {
      const posts = getAllPosts();
      const slugs = posts.map((p) => p.slug);
      expect(slugs).not.toContain("readme");
      expect(slugs).not.toContain("README");
    });
  });

  describe("getPostBySlug", () => {
    it("should return full post with contentHtml for valid slug", () => {
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

    it("should return null for non-existent slug", () => {
      expect(getPostBySlug("non-existent-slug-xyz")).toBeNull();
    });

    it("should read optional SEO frontmatter when present", () => {
      const post = getPostBySlug("how-i-use-ai-in-my-frontend-engineering-workflow");
      expect(post).not.toBeNull();
      expect(post?.seoTitle).toBe("How I Use AI in My Frontend Engineering Workflow — Ali Pajand");
      expect(post?.seoDescription).toBe(
        "How I use AI tools, Cursor, model testing, and coding leaderboards in day-to-day frontend engineering work across architecture, product UX, refactoring, testing, and code review."
      );
    });
  });

  describe("getLatestPosts", () => {
    it("should return at most count posts", () => {
      const posts = getLatestPosts(1);
      expect(posts.length).toBeLessThanOrEqual(1);
    });

    it("should return same order as getAllPosts slice", () => {
      const all = getAllPosts();
      const latest = getLatestPosts(2);
      expect(latest).toEqual(all.slice(0, 2));
    });
  });

  describe("getPostsForWritingSection", () => {
    it("should return featured post when frontmatter marks one", () => {
      const { featured, recent } = getPostsForWritingSection(2);
      const all = getAllPosts();
      const expectedFeatured = all.find((p) => p.featured === true);
      expect(featured).toEqual(expectedFeatured ?? null);
      if (featured) {
        expect(recent.some((p) => p.slug === featured.slug)).toBe(false);
      }
    });

    it("should limit recent to recentCount excluding featured", () => {
      const { recent } = getPostsForWritingSection(2);
      expect(recent.length).toBeLessThanOrEqual(2);
    });
  });
});
