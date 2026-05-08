import { render, screen } from "@testing-library/react";

import { Innovation } from "components/Innovation/Innovation";
import { INNOVATION_SECTION_INTRO } from "data/innovation";

describe("Innovation", () => {
  it("renders section with id innovation", () => {
    render(<Innovation />);
    expect(document.getElementById("innovation")).toBeInTheDocument();
  });

  it("renders DX tooling & experiments heading", () => {
    render(<Innovation />);
    expect(screen.getByRole("heading", { name: /dx tooling & experiments/i })).toBeInTheDocument();
  });

  it("renders intro paragraph", () => {
    render(<Innovation />);
    expect(screen.getByText(INNOVATION_SECTION_INTRO)).toBeInTheDocument();
  });

  it("renders innovation items from data", () => {
    render(<Innovation />);
    expect(screen.getByText("MCP server for Cursor")).toBeInTheDocument();
    expect(screen.getByText("Checks in GitHub Actions")).toBeInTheDocument();
  });
});
