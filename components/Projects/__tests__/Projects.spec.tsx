import { render, screen } from "@testing-library/react";

import { Projects } from "components/Projects/Projects";

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

  it("renders Selected work heading", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { name: /selected work/i })).toBeInTheDocument();
  });

  it("renders intro paragraph", () => {
    render(<Projects />);
    expect(
      screen.getByText(/Real projects. For each: what was wrong, what we did, what we got./i)
    ).toBeInTheDocument();
  });

  it("renders all projects from data", () => {
    render(<Projects />);
    expect(screen.getByText("Design System & Component Library")).toBeInTheDocument();
    expect(screen.getByText("Marketplace & Login (Web3)")).toBeInTheDocument();
    expect(screen.getByText("Data Dashboards & Motion")).toBeInTheDocument();
    expect(screen.getByText("PWA & Performance")).toBeInTheDocument();
  });

  it("renders case study labels for projects that have them", () => {
    render(<Projects />);
    expect(screen.getAllByText("The issue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("What we did").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Outcome").length).toBeGreaterThan(0);
  });

  it("renders tech tags and outcomes", () => {
    render(<Projects />);
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
  });
});
