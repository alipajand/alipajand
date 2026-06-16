import { render, screen } from "@testing-library/react";

import { OpenSourcePageContent } from "features/open-source/OpenSourcePageContent";
import {
  OPEN_SOURCE_CTA_PRIMARY_HREF,
  OPEN_SOURCE_CTA_PRIMARY_LABEL,
  OPEN_SOURCE_CTA_SECONDARY_HREF,
  OPEN_SOURCE_CTA_SECONDARY_LABEL,
  OPEN_SOURCE_HEADER_HEADING,
  OPEN_SOURCE_PROJECTS,
  OPEN_SOURCE_SHARED_PRINCIPLES,
  OPEN_SOURCE_SHARED_PRINCIPLES_HEADING,
} from "data/openSourcePage";

jest.mock("utils/hooks/usePageHeader", () => ({
  usePageHeader: jest.fn(() => ({
    selectors: {
      headerRef: { current: null },
    },
  })),
}));

jest.mock("utils/hooks/useScrollReveal", () => ({
  useScrollReveal: jest.fn(() => ({
    selectors: {
      sectionRef: { current: null },
    },
  })),
}));

describe("OpenSourcePageContent", () => {
  it("renders the page heading", () => {
    render(<OpenSourcePageContent />);

    expect(screen.getByRole("heading", { name: OPEN_SOURCE_HEADER_HEADING })).toBeInTheDocument();
  });

  it("renders all four repository names", () => {
    render(<OpenSourcePageContent />);

    OPEN_SOURCE_PROJECTS.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it("renders all four repository links", () => {
    render(<OpenSourcePageContent />);

    OPEN_SOURCE_PROJECTS.forEach((project) => {
      expect(
        screen.getByRole("link", {
          name: `Open ${project.title} repository on GitHub`,
        })
      ).toHaveAttribute("href", project.repositoryUrl);
    });
  });

  it("renders the shared principles heading", () => {
    render(<OpenSourcePageContent />);

    expect(
      screen.getByRole("heading", { name: OPEN_SOURCE_SHARED_PRINCIPLES_HEADING })
    ).toBeInTheDocument();
  });

  it("renders all four shared-principle cards", () => {
    const { container } = render(<OpenSourcePageContent />);

    OPEN_SOURCE_SHARED_PRINCIPLES.forEach((principle) => {
      expect(screen.getByText(principle.title)).toBeInTheDocument();
      expect(screen.getByText(principle.body)).toBeInTheDocument();
    });

    expect(container.querySelectorAll("[data-open-source-principle]")).toHaveLength(4);
  });

  it("renders the GitHub profile CTA", () => {
    render(<OpenSourcePageContent />);

    expect(screen.getByRole("link", { name: OPEN_SOURCE_CTA_PRIMARY_LABEL })).toHaveAttribute(
      "href",
      OPEN_SOURCE_CTA_PRIMARY_HREF
    );
  });

  it("renders the writing CTA", () => {
    render(<OpenSourcePageContent />);

    expect(screen.getByRole("link", { name: OPEN_SOURCE_CTA_SECONDARY_LABEL })).toHaveAttribute(
      "href",
      OPEN_SOURCE_CTA_SECONDARY_HREF
    );
  });
});
