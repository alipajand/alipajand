import { render, screen } from "@testing-library/react";

import { McpWorkflowDiagram } from "components/diagrams/McpWorkflowDiagram";

describe("McpWorkflowDiagram", () => {
  it("should render an accessible SVG diagram with a descriptive title", () => {
    render(<McpWorkflowDiagram />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("aria-labelledby", "mcp-workflow-title");
    expect(screen.getByText("feedback loop")).toBeInTheDocument();
  });

  it("should label the editor, MCP server, and checks stages", () => {
    render(<McpWorkflowDiagram />);
    expect(screen.getByText("Editor")).toBeInTheDocument();
    expect(screen.getByText("MCP server")).toBeInTheDocument();
    expect(screen.getByText("Lint · types · tests")).toBeInTheDocument();
  });
});
