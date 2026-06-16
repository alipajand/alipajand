import { render, screen } from "@testing-library/react";

import { SelectedWork } from "components/SelectedWork/SelectedWork";
import {
  HOMEPAGE_CASE_STUDIES,
  HOMEPAGE_CASE_STUDIES_HEADING,
  HOMEPAGE_CASE_STUDIES_LEDE,
  HOMEPAGE_HERO_PRIMARY_CTA_HREF,
} from "data/homepage";

describe("SelectedWork", () => {
  it("renders the section with the case-studies id", () => {
    render(<SelectedWork />);
    expect(document.getElementById("case-studies")).toBeInTheDocument();
  });

  it("renders the heading and lede", () => {
    render(<SelectedWork />);
    expect(
      screen.getByRole("heading", { name: HOMEPAGE_CASE_STUDIES_HEADING })
    ).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_CASE_STUDIES_LEDE)).toBeInTheDocument();
  });

  it("renders a card for every selected work item", () => {
    render(<SelectedWork />);
    for (const project of HOMEPAGE_CASE_STUDIES) {
      expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
    }
  });

  it("renders the section CTA pointing to the work page", () => {
    render(<SelectedWork />);
    const cta = screen.getByRole("link", { name: /view all case studies/i });
    expect(cta).toHaveAttribute("href", HOMEPAGE_HERO_PRIMARY_CTA_HREF);
  });
});
