import { render, screen } from "@testing-library/react";
import {
  BookIcon,
  BoxIcon,
  BranchIcon,
  ChartIcon,
  CheckIcon,
  CloudIcon,
  CodeIcon,
  CubeIcon,
  DatabaseIcon,
  LayersIcon,
  PenIcon,
  PlayIcon,
  ShieldIcon,
  WrenchIcon,
  ZapIcon,
} from "components/Icons";

const iconComponents = [
  { name: "BookIcon", Component: BookIcon },
  { name: "BoxIcon", Component: BoxIcon },
  { name: "BranchIcon", Component: BranchIcon },
  { name: "ChartIcon", Component: ChartIcon },
  { name: "CheckIcon", Component: CheckIcon },
  { name: "CloudIcon", Component: CloudIcon },
  { name: "CodeIcon", Component: CodeIcon },
  { name: "CubeIcon", Component: CubeIcon },
  { name: "DatabaseIcon", Component: DatabaseIcon },
  { name: "LayersIcon", Component: LayersIcon },
  { name: "PenIcon", Component: PenIcon },
  { name: "PlayIcon", Component: PlayIcon },
  { name: "ShieldIcon", Component: ShieldIcon },
  { name: "WrenchIcon", Component: WrenchIcon },
  { name: "ZapIcon", Component: ZapIcon },
];

describe("Icon Components", () => {
  iconComponents.forEach(({ name, Component }) => {
    describe(name, () => {
      it("should render an SVG element", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("should have correct SVG attributes", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
        expect(svg).toHaveAttribute("width", "16");
        expect(svg).toHaveAttribute("height", "16");
        expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
        expect(svg).toHaveAttribute("fill", "none");
        expect(svg).toHaveAttribute("stroke", "currentColor");
        expect(svg).toHaveAttribute("stroke-width", "2");
        expect(svg).toHaveAttribute("stroke-linecap", "round");
        expect(svg).toHaveAttribute("stroke-linejoin", "round");
      });

      it("should have aria-hidden attribute", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("aria-hidden", "true");
      });

      it("should render a path element", () => {
        const { container } = render(<Component />);
        const path = container.querySelector("path");
        expect(path).toBeInTheDocument();
      });

      it("should accept className prop", () => {
        const { container } = render(<Component className="test-class" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("test-class");
      });

      it("should work without className prop", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("should have a non-empty path d attribute", () => {
        const { container } = render(<Component />);
        const path = container.querySelector("path");
        expect(path).toHaveAttribute("d");
        expect(path?.getAttribute("d")).toBeTruthy();
        expect(path?.getAttribute("d")?.length).toBeGreaterThan(0);
      });
    });
  });
});
