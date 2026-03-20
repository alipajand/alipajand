import { render, screen } from "@testing-library/react";

import { Writing } from "components/Writing/Writing";
import type { WritingPost } from "components/Writing/Writing";

describe("Writing formatDate", () => {
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;

  afterEach(() => {
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });

  it("falls back to original date string when formatting throws", () => {
    Date.prototype.toLocaleDateString = function thrower() {
      throw new RangeError("Invalid time value");
    };

    const posts: WritingPost[] = [
      {
        slug: "invalid-date-post",
        title: "Invalid Date Post",
        date: "2024-01-01",
        excerpt: "Excerpt",
      },
    ];

    render(<Writing featured={null} posts={posts} />);

    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });
});
