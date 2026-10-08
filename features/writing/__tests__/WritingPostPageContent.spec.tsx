import { render, screen } from "@testing-library/react";

import { WritingPostPageContent } from "features/writing/WritingPostPageContent";
import { WRITING_TOC_ARIA_LABEL } from "data/writing";

jest.mock("utils/hooks/useAutoReveal", () => ({
  useAutoReveal: jest.fn(() => ({ selectors: { containerRef: { current: null } } })),
}));

jest.mock("utils/hooks/usePageHeader", () => ({
  usePageHeader: jest.fn(() => ({ selectors: { headerRef: { current: null } } })),
}));

describe("WritingPostPageContent", () => {
  it("should render the title, prose, diagrams and both outlines", () => {
    render(
      <WritingPostPageContent
        title="Post title"
        date="2026-01-20"
        contentHtml={
          '<p>Intro text</p>\n<div data-diagram-slot="0"></div>\n<h2 id="one">One</h2><div data-diagram-slot="9"></div><h2 id="two">Two</h2>'
        }
        headings={[
          { id: "one", text: "One", level: 2 },
          { id: "two", text: "Two", level: 2 },
        ]}
        diagrams={[
          {
            type: "compare",
            title: "A diagram",
            columns: [
              { label: "Before", items: ["x"] },
              { label: "After", items: ["y"] },
            ],
          },
        ]}
      />
    );

    expect(screen.getByRole("heading", { level: 1, name: "Post title" })).toBeInTheDocument();
    expect(screen.getByText("Intro text")).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: "A diagram" })).toBeInTheDocument();
    expect(screen.getAllByRole("navigation", { name: WRITING_TOC_ARIA_LABEL })).toHaveLength(2);
  });
});
