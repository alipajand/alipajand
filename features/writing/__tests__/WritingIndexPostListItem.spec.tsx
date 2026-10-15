import { render, screen } from "@testing-library/react";
import { WritingIndexPostListItem } from "features/writing/WritingIndexPostListItem";

const post = {
  slug: "scheduled-post",
  title: "Scheduled post",
  date: "2026-10-28",
  excerpt: "A preview of the next article.",
  featured: true,
};

describe("WritingIndexPostListItem", () => {
  it("labels upcoming previews and gives them a distinct border", () => {
    render(<WritingIndexPostListItem post={{ ...post, upcoming: true }} />);
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Preview article →")).toBeInTheDocument();
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveClass("border-dashed");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/writing/scheduled-post");
  });

  it("shows the normal article style once published", () => {
    render(<WritingIndexPostListItem post={{ ...post, upcoming: false }} />);
    expect(screen.queryByText("Upcoming")).not.toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("Read article →")).toBeInTheDocument();
    expect(screen.getByRole("link")).not.toHaveClass("border-dashed");
  });
});
