import { render, screen } from "@testing-library/react";

import { Innovation } from "components/Innovation/Innovation";

describe("Innovation", () => {
  it("renders section with id innovation", () => {
    render(<Innovation />);
    expect(document.getElementById("innovation")).toBeInTheDocument();
  });

  it("renders Side projects & tooling heading", () => {
    render(<Innovation />);
    expect(screen.getByRole("heading", { name: /side projects & tooling/i })).toBeInTheDocument();
  });

  it("renders intro paragraph", () => {
    render(<Innovation />);
    expect(
      screen.getByText(/Things I build to ship faster and can show you in action\./i)
    ).toBeInTheDocument();
  });

  it("renders innovation items from data", () => {
    render(<Innovation />);
    expect(screen.getByText("MCP server for Cursor")).toBeInTheDocument();
    expect(screen.getByText("AI in the pipeline")).toBeInTheDocument();
  });
});
