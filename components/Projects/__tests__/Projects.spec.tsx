import { render, screen } from "@testing-library/react";

import { Projects } from "components/Projects/Projects";
import { PROJECTS } from "data/projects";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

describe("Projects", () => {
  it("renders section with id projects", () => {
    render(<Projects />);
    expect(document.getElementById("projects")).toBeInTheDocument();
  });

  it("renders Case studies heading", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { name: /case studies/i })).toBeInTheDocument();
  });

  it("renders intro paragraph", () => {
    render(<Projects />);
    expect(
      screen.getByText(/Outcome first, then how the work was structured/i)
    ).toBeInTheDocument();
  });

  it("renders all projects from data", () => {
    render(<Projects />);
    PROJECTS.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });
  });

  it("renders case study labels for projects that have them", () => {
    render(<Projects />);
    expect(screen.getAllByText("Problem").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Approach").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Result").length).toBeGreaterThan(0);
  });

  it("renders jump nav for case studies (in DOM for lg layout)", () => {
    const { container } = render(<Projects />);
    const nav = container.querySelector('[aria-label="Jump to case study"]');
    expect(nav).toBeInTheDocument();
    const jump = container.querySelector(
      'a[href="#project-mapbylaw-platform-ui-ai-reports"]'
    );
    expect(jump?.textContent).toContain("MapBylaw");
  });

  it("renders technical signals and full stack", () => {
    render(<Projects />);
    expect(screen.getAllByText(/technical signals/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/full stack/i).length).toBeGreaterThan(0);
  });
});
