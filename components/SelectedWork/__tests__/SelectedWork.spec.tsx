import { render, screen } from "@testing-library/react";

import { SelectedWork } from "components/SelectedWork/SelectedWork";
import {
  HOMEPAGE_CASE_STUDIES,
  HOMEPAGE_CASE_STUDIES_HEADING,
  HOMEPAGE_CASE_STUDIES_LEDE,
} from "data/homepage";
import { SELECTED_WORK_SECTION_CTA_HREF, SELECTED_WORK_SECTION_CTA_LABEL } from "data/selectedWork";

describe("SelectedWork", () => {
  it("should render the section with the case-studies id", () => {
    render(<SelectedWork />);
    expect(document.getElementById("case-studies")).toBeInTheDocument();
  });

  it("should render the heading and lede", () => {
    render(<SelectedWork />);
    expect(
      screen.getByRole("heading", { name: HOMEPAGE_CASE_STUDIES_HEADING })
    ).toBeInTheDocument();
    expect(screen.getByText(HOMEPAGE_CASE_STUDIES_LEDE)).toBeInTheDocument();
  });

  it("should render a card for every selected work item", () => {
    render(<SelectedWork />);
    for (const project of HOMEPAGE_CASE_STUDIES) {
      expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
    }
  });

  it("should render the section CTA pointing to the work page", () => {
    render(<SelectedWork />);
    const cta = screen.getByRole("link", { name: SELECTED_WORK_SECTION_CTA_LABEL });
    expect(cta).toHaveAttribute("href", SELECTED_WORK_SECTION_CTA_HREF);
  });
});
