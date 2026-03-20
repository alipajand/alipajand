import { render, screen } from "@testing-library/react";
import type { WritingPost } from "components/Writing/Writing";
import { Writing } from "components/Writing/Writing";
import {
  WRITING_ALL_POSTS_CTA,
  WRITING_SECTION_LEDE,
  WRITING_WHY_IT_MATTERS,
} from "data/writing";

jest.mock("utils/hooks/useScrollReveal", () => ({
  useScrollReveal: jest.fn(() => ({
    selectors: {
      sectionRef: { current: null },
    },
  })),
}));

const mockPosts: WritingPost[] = [
  {
    slug: "test-post-1",
    title: "Test Post 1",
    date: "2024-01-15",
    excerpt: "This is a test excerpt",
    tags: ["Alpha", "Beta"],
  },
  {
    slug: "test-post-2",
    title: "Test Post 2",
    date: "2024-02-20",
    excerpt: "Another test excerpt",
  },
];

const mockFeatured: WritingPost = {
  slug: "featured-post",
  title: "Featured Article",
  date: "2024-03-01",
  excerpt: "Featured excerpt for authority.",
  featured: true,
  tags: ["Systems"],
};

describe("Writing", () => {
  describe("rendering", () => {
    it("should render heading", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      expect(screen.getByText("Writing")).toBeInTheDocument();
    });

    it("should render lede and why-it-matters line", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      expect(screen.getByText(WRITING_SECTION_LEDE)).toBeInTheDocument();
      expect(screen.getByText(WRITING_WHY_IT_MATTERS)).toBeInTheDocument();
    });

    it("should render all recent posts", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });

    it("should render post excerpts", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      expect(screen.getByText("This is a test excerpt")).toBeInTheDocument();
      expect(screen.getByText("Another test excerpt")).toBeInTheDocument();
    });

    it("should render tags when present", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      expect(screen.getByText("Alpha · Beta")).toBeInTheDocument();
    });

    it("should render featured post when provided", () => {
      render(<Writing featured={mockFeatured} posts={mockPosts} />);
      expect(screen.getByText("Featured")).toBeInTheDocument();
      expect(screen.getByText("Featured Article")).toBeInTheDocument();
      expect(screen.getByText("Featured excerpt for authority.")).toBeInTheDocument();
    });

    it("should link to all posts archive", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      const link = screen.getByRole("link", { name: WRITING_ALL_POSTS_CTA });
      expect(link).toHaveAttribute("href", "/blog");
    });
  });

  describe("post links", () => {
    it("should render links to individual posts", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      const post1Link = screen.getByText("Test Post 1").closest("a");
      const post2Link = screen.getByText("Test Post 2").closest("a");

      expect(post1Link).toHaveAttribute("href", "/blog/test-post-1");
      expect(post2Link).toHaveAttribute("href", "/blog/test-post-2");
    });

    it("should have correct structure for post links", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      const postLink = screen.getByText("Test Post 1").closest("a");
      expect(postLink).toHaveClass("group", "block");
    });
  });

  describe("date formatting", () => {
    it("should format dates correctly", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      const timeElements = screen.getAllByRole("time");

      expect(timeElements[0]).toHaveAttribute("dateTime", "2024-01-15");
      expect(timeElements[1]).toHaveAttribute("dateTime", "2024-02-20");
    });

    it("should handle invalid dates gracefully", () => {
      const postsWithInvalidDate: WritingPost[] = [
        {
          slug: "invalid-date",
          title: "Invalid Date Post",
          date: "invalid-date",
          excerpt: "Test",
        },
      ];

      render(<Writing featured={null} posts={postsWithInvalidDate} />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveAttribute("dateTime", "invalid-date");
      expect(timeElement.textContent).toBeTruthy();
    });
  });

  describe("empty state", () => {
    it("should return null when no featured and posts empty", () => {
      const { container } = render(<Writing featured={null} posts={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render when only featured post exists", () => {
      render(<Writing featured={mockFeatured} posts={[]} />);
      expect(screen.getByText("Featured Article")).toBeInTheDocument();
    });
  });

  describe("section attributes", () => {
    it("should have correct id and aria-labelledby", () => {
      const { container } = render(<Writing featured={null} posts={mockPosts} />);
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("id", "writing");
      expect(section).toHaveAttribute("aria-labelledby", "writing-heading");
    });

    it("should have correct heading id", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      const heading = screen.getByText("Writing");
      expect(heading).toHaveAttribute("id", "writing-heading");
    });
  });

  describe("data-reveal attributes", () => {
    it("should have data-reveal on heading block", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      const lede = screen.getByText(WRITING_SECTION_LEDE);
      expect(lede.closest("header")).toHaveAttribute("data-reveal");
    });

    it("should have data-reveal on posts list", () => {
      const { container } = render(<Writing featured={null} posts={mockPosts} />);
      const list = container.querySelector("ul[data-reveal]");
      expect(list).toBeInTheDocument();
    });

    it("should have data-reveal on archive row", () => {
      render(<Writing featured={null} posts={mockPosts} />);
      const link = screen.getByRole("link", { name: WRITING_ALL_POSTS_CTA });
      expect(link.closest("div")).toHaveAttribute("data-reveal");
    });
  });
});
