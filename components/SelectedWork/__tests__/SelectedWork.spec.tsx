import { render, screen } from "@testing-library/react";

import { SelectedWork } from "components/SelectedWork/SelectedWork";
import { PROJECTS } from "data/projects";
import {
  SELECTED_WORK_HEADING,
  SELECTED_WORK_LEDE,
  SELECTED_WORK_SECTION_CTA_HREF,
  SELECTED_WORK_SECTION_CTA_LABEL,
} from "data/selectedWork";

describe("SelectedWork", () => {
  it("renders the section with the selected-work id", () => {
    render(<SelectedWork />);
    expect(document.getElementById("selected-work")).toBeInTheDocument();
  });

  it("renders the heading and lede", () => {
    render(<SelectedWork />);
    expect(screen.getByRole("heading", { name: SELECTED_WORK_HEADING })).toBeInTheDocument();
    expect(screen.getByText(SELECTED_WORK_LEDE)).toBeInTheDocument();
  });

  it("renders a card for every selected work item", () => {
    render(<SelectedWork />);
    for (const project of PROJECTS.filter((item) => item.highlighted)) {
      expect(screen.getByRole("heading", { name: project.name })).toBeInTheDocument();
    }
  });

  it("renders the section CTA pointing to the work page", () => {
    render(<SelectedWork />);
    const cta = screen.getByRole("link", { name: SELECTED_WORK_SECTION_CTA_LABEL });
    expect(cta).toHaveAttribute("href", SELECTED_WORK_SECTION_CTA_HREF);
  });
});
