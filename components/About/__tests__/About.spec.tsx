import { render, screen } from "@testing-library/react";

import { About } from "components/About/About";
import { ABOUT_HEADING, ABOUT_PARAGRAPHS } from "data/about";

describe("About", () => {
  it("should render the section heading", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: ABOUT_HEADING, level: 2 })).toBeInTheDocument();
  });

  it("should render every paragraph", () => {
    render(<About />);
    for (const paragraph of ABOUT_PARAGRAPHS) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });
});
