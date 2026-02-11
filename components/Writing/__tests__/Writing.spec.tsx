import { render, screen } from "@testing-library/react";

import { Writing } from "components/Writing/Writing";

describe("Writing", () => {
  const mockPosts = [
    {
      slug: "test-post",
      title: "Test Post",
      date: "2025-01-15",
      excerpt: "Test excerpt.",
    },
  ];

  it("returns null when posts array is empty", () => {
    const { container } = render(<Writing posts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders section with id writing when posts provided", () => {
    render(<Writing posts={mockPosts} />);
    expect(document.getElementById("writing")).toBeInTheDocument();
  });

  it("renders Writing heading", () => {
    render(<Writing posts={mockPosts} />);
    expect(screen.getByRole("heading", { name: /writing/i })).toBeInTheDocument();
  });

  it("renders post title and excerpt", () => {
    render(<Writing posts={mockPosts} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Test excerpt.")).toBeInTheDocument();
  });

  it("renders link to blog post and All posts link", () => {
    render(<Writing posts={mockPosts} />);
    expect(screen.getByRole("link", { name: /read more/i })).toHaveAttribute(
      "href",
      "/blog/test-post"
    );
    expect(screen.getByRole("link", { name: /all posts/i })).toHaveAttribute("href", "/blog");
  });

  it("formats date for display", () => {
    render(<Writing posts={mockPosts} />);
    expect(screen.getByText(/Jan.*2025/)).toBeInTheDocument();
  });

  it("renders multiple posts", () => {
    const twoPosts = [
      ...mockPosts,
      { slug: "second", title: "Second Post", date: "2025-02-01", excerpt: "Second." },
    ];
    render(<Writing posts={twoPosts} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });
});
