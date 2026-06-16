import { render, screen, within } from "@testing-library/react";

import { SelectedWorkCard } from "components/SelectedWork/SelectedWorkCard";
import type { Project } from "data/projects";
import { SELECTED_WORK_CARD_CTA, SELECTED_WORK_THEMES_LABEL } from "data/selectedWork";

const project: Project = {
  id: "demo-project",
  name: "Demo Project",
  description: "Test description",
  role: "Lead Engineer",
  highlighted: true,
  signalStack: ["Typed APIs"],
  tech: ["React"],
  outcomes: ["Outcome 1"],
  badges: ["AI", "DX"],
  navLabel: "Demo nav",
  caseStudy: {
    problem: "A tricky problem statement.",
    constraints: "Constraints",
    owned: ["Owned the first thing.", "Owned the second thing."],
    architectureDecisions: "Architecture decisions",
    technicalImplementation: "Technical implementation",
    uxAccessibility: "UX and accessibility",
    outcome: "Measurable evidence of impact.",
    tradeoffs: "Tradeoffs",
  },
};

describe("SelectedWorkCard", () => {
  it("renders the project name, problem, role, and evidence", () => {
    render(<SelectedWorkCard project={project} />);
    expect(screen.getByRole("heading", { name: project.name })).toBeInTheDocument();
    expect(screen.getByText(project.caseStudy!.problem)).toBeInTheDocument();
    expect(screen.getByText(project.role)).toBeInTheDocument();
    expect(screen.getByText(project.caseStudy!.outcome)).toBeInTheDocument();
  });

  it("renders each owned point and theme badge", () => {
    render(<SelectedWorkCard project={project} />);
    for (const point of project.caseStudy!.owned) {
      expect(screen.getByText(point)).toBeInTheDocument();
    }

    const themesList = screen.getByRole("list", { name: SELECTED_WORK_THEMES_LABEL });
    for (const theme of project.badges ?? []) {
      expect(within(themesList).getByText(theme)).toBeInTheDocument();
    }
  });

  it("links to the deep-linked case study on the portfolio page", () => {
    render(<SelectedWorkCard project={project} />);
    const cta = screen.getByRole("link", { name: new RegExp(SELECTED_WORK_CARD_CTA, "i") });
    expect(cta).toHaveAttribute("href", `/portfolio#project-${project.id}`);
  });

  it("omits the themes list when there are no themes", () => {
    render(<SelectedWorkCard project={{ ...project, badges: [] }} />);
    expect(
      screen.queryByRole("list", { name: SELECTED_WORK_THEMES_LABEL })
    ).not.toBeInTheDocument();
  });
});
