import { render, screen } from "@testing-library/react";

import { OpenSourceTools } from "components/OpenSourceTools/OpenSourceTools";
import {
  OPEN_SOURCE_TOOLS,
  OPEN_SOURCE_TOOLS_CTA_HREF,
  OPEN_SOURCE_TOOLS_CTA_LABEL,
  OPEN_SOURCE_TOOLS_HEADING,
} from "data/openSourceTools";

jest.mock("utils/hooks/useScrollReveal", () => ({
  useScrollReveal: jest.fn(() => ({
    selectors: {
      sectionRef: { current: null },
    },
  })),
}));

describe("OpenSourceTools", () => {
  it("renders the section heading", () => {
    render(<OpenSourceTools />);

    expect(screen.getByRole("heading", { name: OPEN_SOURCE_TOOLS_HEADING })).toBeInTheDocument();
  });

  it("renders all four project names", () => {
    render(<OpenSourceTools />);

    OPEN_SOURCE_TOOLS.forEach((tool) => {
      expect(screen.getByText(tool.name)).toBeInTheDocument();
    });
  });

  it("renders each repository link with the correct href", () => {
    render(<OpenSourceTools />);

    OPEN_SOURCE_TOOLS.forEach((tool) => {
      expect(
        screen.getByRole("link", {
          name: `Open ${tool.name} repository on GitHub`,
        })
      ).toHaveAttribute("href", tool.repositoryUrl);
    });
  });

  it("renders the open-source CTA with the correct href", () => {
    render(<OpenSourceTools />);

    expect(screen.getByRole("link", { name: OPEN_SOURCE_TOOLS_CTA_LABEL })).toHaveAttribute(
      "href",
      OPEN_SOURCE_TOOLS_CTA_HREF
    );
  });

  it("renders exactly four cards", () => {
    const { container } = render(<OpenSourceTools />);

    expect(container.querySelectorAll("[data-open-source-tool-card]")).toHaveLength(4);
  });
});
