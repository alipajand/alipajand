import { render, screen, within } from "@testing-library/react";

import { SelectedWorkCard } from "components/SelectedWork/SelectedWorkCard";
import {
  SELECTED_WORK_CARD_CTA,
  SELECTED_WORK_THEMES_LABEL,
  type SelectedWorkItem,
} from "data/selectedWork";

const item: SelectedWorkItem = {
  projectId: "demo-project",
  name: "Demo Project",
  problem: "A tricky problem statement.",
  role: "Lead Engineer",
  owned: ["Owned the first thing.", "Owned the second thing."],
  evidence: "Measurable evidence of impact.",
  themes: ["AI", "DX"],
};

describe("SelectedWorkCard", () => {
  it("renders the project name, problem, role, and evidence", () => {
    render(<SelectedWorkCard item={item} />);
    expect(screen.getByRole("heading", { name: item.name })).toBeInTheDocument();
    expect(screen.getByText(item.problem)).toBeInTheDocument();
    expect(screen.getByText(item.role)).toBeInTheDocument();
    expect(screen.getByText(item.evidence)).toBeInTheDocument();
  });

  it("renders each owned point and theme badge", () => {
    render(<SelectedWorkCard item={item} />);
    for (const point of item.owned) {
      expect(screen.getByText(point)).toBeInTheDocument();
    }

    const themesList = screen.getByRole("list", { name: SELECTED_WORK_THEMES_LABEL });
    for (const theme of item.themes) {
      expect(within(themesList).getByText(theme)).toBeInTheDocument();
    }
  });

  it("links to the deep-linked case study on the portfolio page", () => {
    render(<SelectedWorkCard item={item} />);
    const cta = screen.getByRole("link", { name: new RegExp(SELECTED_WORK_CARD_CTA, "i") });
    expect(cta).toHaveAttribute("href", `/portfolio#project-${item.projectId}`);
  });

  it("omits the themes list when there are no themes", () => {
    render(<SelectedWorkCard item={{ ...item, themes: [] }} />);
    expect(
      screen.queryByRole("list", { name: SELECTED_WORK_THEMES_LABEL })
    ).not.toBeInTheDocument();
  });
});
