import { render, screen } from "@testing-library/react";

import { OpenSourcePageContent } from "features/open-source/OpenSourcePageContent";
import {
  OPEN_SOURCE_CTA_PRIMARY_HREF,
  OPEN_SOURCE_CTA_PRIMARY_LABEL,
  OPEN_SOURCE_CTA_SECONDARY_HREF,
  OPEN_SOURCE_CTA_SECONDARY_LABEL,
  OPEN_SOURCE_FEATURED_HEADING,
  OPEN_SOURCE_HEADER_HEADING,
  OPEN_SOURCE_PROJECTS,
  OPEN_SOURCE_SHARED_PRINCIPLES,
  OPEN_SOURCE_SHARED_PRINCIPLES_HEADING,
  OPEN_SOURCE_SUPPORTING_HEADING,
} from "data/openSourcePage";

jest.mock("features/open-source/hooks/useOpenSourcePageContent", () => ({
  useOpenSourcePageContent: jest.fn(() => ({
    selectors: {
      headerRef: { current: null },
      contentRef: { current: null },
      featuredProjects: OPEN_SOURCE_PROJECTS.filter((project) => project.featured),
      supportingProjects: OPEN_SOURCE_PROJECTS.filter((project) => !project.featured),
    },
  })),
}));

describe("OpenSourcePageContent", () => {
  it("should render the page heading", () => {
    render(<OpenSourcePageContent />);

    expect(screen.getByRole("heading", { name: OPEN_SOURCE_HEADER_HEADING })).toBeInTheDocument();
  });

  it("should render all four repository names", () => {
    render(<OpenSourcePageContent />);

    OPEN_SOURCE_PROJECTS.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it("should render all four repository links", () => {
    render(<OpenSourcePageContent />);

    OPEN_SOURCE_PROJECTS.forEach((project) => {
      expect(
        screen.getByRole("link", {
          name: `Open ${project.title} repository on GitHub`,
        })
      ).toHaveAttribute("href", project.repositoryUrl);
    });
  });

  it("should feature agent-pr-reviewer-lite and agent-context-doctor first", () => {
    const { container } = render(<OpenSourcePageContent />);

    expect(screen.getByRole("heading", { name: OPEN_SOURCE_FEATURED_HEADING })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: OPEN_SOURCE_SUPPORTING_HEADING })
    ).toBeInTheDocument();

    const featuredTitles = Array.from(
      container.querySelectorAll("[data-open-source-project] h3")
    ).map((heading) => heading.textContent);

    expect(featuredTitles).toEqual(["Agent PR Reviewer Lite", "Agent Context Doctor"]);
  });

  it("should render CLI example blocks for the featured tools", () => {
    render(<OpenSourcePageContent />);

    expect(screen.getAllByText("Command")).toHaveLength(2);
    expect(screen.getAllByText("Fixture input")).toHaveLength(2);
    expect(screen.getAllByText("CLI output")).toHaveLength(2);
    expect(
      screen.getByText(/agent-pr-reviewer-lite --base HEAD~1 --head HEAD/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/\[high\] AGENTS\.md:2 — Risky instruction: "skip tests"/)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Simplified for readability/)).toHaveLength(2);
  });

  it("should render status and tested capability labels without GitHub stats copy", () => {
    render(<OpenSourcePageContent />);

    expect(screen.getAllByText("Status").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Format").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tested capabilities").length).toBeGreaterThan(0);
    expect(screen.queryByText(/stars|forks|followers/i)).not.toBeInTheDocument();
  });

  it("should render the shared principles heading", () => {
    render(<OpenSourcePageContent />);

    expect(
      screen.getByRole("heading", { name: OPEN_SOURCE_SHARED_PRINCIPLES_HEADING })
    ).toBeInTheDocument();
  });

  it("should render all four shared-principle cards", () => {
    const { container } = render(<OpenSourcePageContent />);

    OPEN_SOURCE_SHARED_PRINCIPLES.forEach((principle) => {
      expect(screen.getByText(principle.title)).toBeInTheDocument();
      expect(screen.getByText(principle.body)).toBeInTheDocument();
    });

    expect(container.querySelectorAll("[data-open-source-principle]")).toHaveLength(4);
  });

  it("should render the GitHub profile CTA", () => {
    render(<OpenSourcePageContent />);

    expect(screen.getByRole("link", { name: OPEN_SOURCE_CTA_PRIMARY_LABEL })).toHaveAttribute(
      "href",
      OPEN_SOURCE_CTA_PRIMARY_HREF
    );
  });

  it("should render the writing CTA", () => {
    render(<OpenSourcePageContent />);

    expect(screen.getByRole("link", { name: OPEN_SOURCE_CTA_SECONDARY_LABEL })).toHaveAttribute(
      "href",
      OPEN_SOURCE_CTA_SECONDARY_HREF
    );
  });
});
