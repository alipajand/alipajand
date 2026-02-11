import { render, screen } from "@testing-library/react";

import { Education } from "components/Education/Education";

describe("Education", () => {
  it("renders section with education text", () => {
    render(<Education />);
    expect(
      screen.getByText(/Master's Degree in Computer Information Technology · 2016/i)
    ).toBeInTheDocument();
  });

  it("renders a section element", () => {
    render(<Education />);
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });
});
