import { render, screen } from "@testing-library/react";
import type { WritingPost } from "components/Writing/Writing";
import { Writing } from "components/Writing/Writing";

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
  },
  {
    slug: "test-post-2",
    title: "Test Post 2",
    date: "2024-02-20",
    excerpt: "Another test excerpt",
  },
];

describe("Writing", () => {
  describe("rendering", () => {
    it("should render heading", () => {
      render(<Writing posts={mockPosts} />);
      expect(screen.getByText("Writing")).toBeInTheDocument();
    });

    it("should render description", () => {
      render(<Writing posts={mockPosts} />);
      expect(screen.getByText("Notes on design systems, DX, and Frontend.")).toBeInTheDocument();
    });

    it("should render all posts", () => {
      render(<Writing posts={mockPosts} />);
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });

    it("should render post excerpts", () => {
      render(<Writing posts={mockPosts} />);
      expect(screen.getByText("This is a test excerpt")).toBeInTheDocument();
      expect(screen.getByText("Another test excerpt")).toBeInTheDocument();
    });

    it("should render link to all posts", () => {
      render(<Writing posts={mockPosts} />);
      const link = screen.getByText("All posts →");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/blog");
    });
  });

  describe("post links", () => {
    it("should render links to individual posts", () => {
      render(<Writing posts={mockPosts} />);
      const post1Link = screen.getByText("Test Post 1").closest("a");
      const post2Link = screen.getByText("Test Post 2").closest("a");

      expect(post1Link).toHaveAttribute("href", "/blog/test-post-1");
      expect(post2Link).toHaveAttribute("href", "/blog/test-post-2");
    });

    it("should have correct structure for post links", () => {
      render(<Writing posts={mockPosts} />);
      const postLink = screen.getByText("Test Post 1").closest("a");
      expect(postLink).toHaveClass("group", "block");
    });
  });

  describe("date formatting", () => {
    it("should format dates correctly", () => {
      render(<Writing posts={mockPosts} />);
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

      render(<Writing posts={postsWithInvalidDate} />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toHaveAttribute("dateTime", "invalid-date");
      expect(timeElement.textContent).toBeTruthy();
    });
  });

  describe("empty state", () => {
    it("should return null when posts array is empty", () => {
      const { container } = render(<Writing posts={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("section attributes", () => {
    it("should have correct id and aria-labelledby", () => {
      const { container } = render(<Writing posts={mockPosts} />);
      const section = container.querySelector("section");
      expect(section).toHaveAttribute("id", "writing");
      expect(section).toHaveAttribute("aria-labelledby", "writing-heading");
    });

    it("should have correct heading id", () => {
      render(<Writing posts={mockPosts} />);
      const heading = screen.getByText("Writing");
      expect(heading).toHaveAttribute("id", "writing-heading");
    });
  });

  describe("data-reveal attributes", () => {
    it("should have data-reveal on heading", () => {
      render(<Writing posts={mockPosts} />);
      const heading = screen.getByText("Writing");
      expect(heading).toHaveAttribute("data-reveal");
    });

    it("should have data-reveal on description", () => {
      const { container: _container } = render(<Writing posts={mockPosts} />);
      const description = screen.getByText("Notes on design systems, DX, and Frontend.");
      expect(description).toHaveAttribute("data-reveal");
    });

    it("should have data-reveal on posts list", () => {
      const { container } = render(<Writing posts={mockPosts} />);
      const list = container.querySelector("ul[data-reveal]");
      expect(list).toBeInTheDocument();
    });

    it("should have data-reveal on all posts link", () => {
      const { container: _container } = render(<Writing posts={mockPosts} />);
      const allPostsLink = screen.getByText("All posts →").closest("p");
      expect(allPostsLink).toHaveAttribute("data-reveal");
    });
  });
});
