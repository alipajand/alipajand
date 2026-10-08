import { fireEvent, render, screen, within } from "@testing-library/react";

import { PostDiagram } from "components/diagrams/PostDiagram";
import { WRITING_POST_MCP_FIGCAPTION, writingDiagramStepCounter } from "data/writing";
import type { DiagramSpec } from "utils/diagramBlocks";

const flow: DiagramSpec = {
  type: "flow",
  title: "Review path",
  caption: "Checks run before people review.",
  loop: "Failures go back to the editor",
  steps: [
    { label: "Edit", detail: "Change code locally." },
    { label: "Check", detail: "Run lint and tests." },
    { label: "Review" },
  ],
};

describe("PostDiagram", () => {
  describe("flow", () => {
    it("should render steps, caption, loop and the first step detail", () => {
      render(<PostDiagram spec={flow} />);

      expect(screen.getByRole("figure", { name: "Review path" })).toBeInTheDocument();
      expect(screen.getByText("Checks run before people review.")).toBeInTheDocument();
      expect(screen.getByText("Failures go back to the editor")).toBeInTheDocument();
      expect(screen.getByText(writingDiagramStepCounter(1, 3))).toBeInTheDocument();
      expect(screen.getByText("Change code locally.")).toBeInTheDocument();
    });

    it("should select a step on click and move with next/previous buttons", () => {
      render(<PostDiagram spec={flow} />);
      const list = screen.getByRole("list");

      fireEvent.click(within(list).getByRole("button", { name: /Check/ }));
      expect(screen.getByText("Run lint and tests.")).toBeInTheDocument();
      expect(within(list).getByRole("button", { name: /Check/ })).toHaveAttribute(
        "aria-pressed",
        "true"
      );

      fireEvent.click(screen.getByRole("button", { name: /Next/ }));
      expect(screen.getByText(writingDiagramStepCounter(3, 3))).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Next/ })).toBeDisabled();

      fireEvent.click(screen.getByRole("button", { name: /Previous/ }));
      expect(screen.getByText(writingDiagramStepCounter(2, 3))).toBeInTheDocument();
    });

    it("should move between steps with arrow, Home and End keys", () => {
      render(<PostDiagram spec={flow} />);
      const list = screen.getByRole("list");

      fireEvent.keyDown(list, { key: "ArrowRight" });
      expect(screen.getByText(writingDiagramStepCounter(2, 3))).toBeInTheDocument();
      expect(within(list).getByRole("button", { name: /Check/ })).toHaveFocus();

      fireEvent.keyDown(list, { key: "End" });
      expect(screen.getByText(writingDiagramStepCounter(3, 3))).toBeInTheDocument();

      fireEvent.keyDown(list, { key: "ArrowDown" });
      expect(screen.getByText(writingDiagramStepCounter(3, 3))).toBeInTheDocument();

      fireEvent.keyDown(list, { key: "Home" });
      fireEvent.keyDown(list, { key: "ArrowUp" });
      fireEvent.keyDown(list, { key: "ArrowLeft" });
      expect(screen.getByText(writingDiagramStepCounter(1, 3))).toBeInTheDocument();

      fireEvent.keyDown(list, { key: "a" });
      expect(screen.getByText(writingDiagramStepCounter(1, 3))).toBeInTheDocument();
    });
  });

  describe("layers", () => {
    it("should open the first layer and toggle layers on click", () => {
      render(
        <PostDiagram
          spec={{
            type: "layers",
            title: "Ownership",
            layers: [
              { label: "UI", detail: "Renders state." },
              { label: "API", detail: "Owns truth." },
              { label: "Jobs" },
            ],
          }}
        />
      );

      const ui = screen.getByRole("button", { name: "UI" });
      const api = screen.getByRole("button", { name: "API" });
      expect(ui).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByText("Owns truth.")).not.toBeVisible();

      fireEvent.click(api);
      expect(api).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByText("Owns truth.")).toBeVisible();
      expect(screen.getByText("Renders state.")).not.toBeVisible();

      fireEvent.click(api);
      expect(api).toHaveAttribute("aria-expanded", "false");
      expect(screen.getByRole("button", { name: "Jobs" })).not.toHaveAttribute("aria-controls");
    });
  });

  describe("compare", () => {
    it.each([2, 3])("should render %i labeled columns with their items", (count) => {
      const columns = Array.from({ length: count }, (_, i) => ({
        label: `Column ${i}`,
        items: [`Item ${i}`],
      }));
      render(<PostDiagram spec={{ type: "compare", title: "Tradeoffs", columns }} />);

      columns.forEach((column) => {
        const region = screen.getByRole("region", { name: column.label });
        expect(within(region).getByText(column.items[0])).toBeInTheDocument();
      });
    });
  });

  describe("mcp-workflow", () => {
    it("should render the MCP diagram with the default caption", () => {
      render(<PostDiagram spec={{ type: "mcp-workflow" }} />);
      expect(screen.getByText(WRITING_POST_MCP_FIGCAPTION)).toBeInTheDocument();
    });

    it("should prefer a caption from the markdown block", () => {
      render(<PostDiagram spec={{ type: "mcp-workflow", caption: "Custom" }} />);
      expect(screen.getByText("Custom")).toBeInTheDocument();
    });
  });
});
