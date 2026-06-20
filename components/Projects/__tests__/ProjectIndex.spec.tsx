import { render, screen } from "@testing-library/react";

import { ProjectIndex } from "components/Projects/ProjectIndex";

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("ProjectIndex", () => {
  it("should render the case-studies section with text-first index entries", () => {
    render(<ProjectIndex />);

    expect(document.getElementById("case-studies")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "LedgerGuard" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "AlwaysGeeky Games" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "TallyFolio" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Emplifi" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "ControlTech" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Agent Tooling & Open Source" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "MapBylaw" })).toBeInTheDocument();
  });

  it("should not render project figures or full case-study sections", () => {
    render(<ProjectIndex />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Context" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Technical decisions" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Interface evidence" })).not.toBeInTheDocument();
  });

  it("should link dedicated projects to /portfolio/{slug}", () => {
    render(<ProjectIndex />);

    expect(
      screen
        .getAllByRole("link", { name: "Read case study" })
        .map((link) => link.getAttribute("href"))
    ).toEqual([
      "/portfolio/ledgerguard",
      "/portfolio/alwaysgeeky",
      "/portfolio/tallyfolio",
      "/portfolio/emplifi",
      "/portfolio/controltech",
      "/portfolio/agent-tooling",
      "/portfolio/mapbylaw",
    ]);
  });

  it("should render anchor ids for every case-study item", () => {
    render(<ProjectIndex />);

    expect(document.getElementById("project-ledgerguard")).toBeInTheDocument();
    expect(document.getElementById("project-alwaysgeeky")).toBeInTheDocument();
    expect(document.getElementById("project-tallyfolio")).toBeInTheDocument();
    expect(document.getElementById("project-emplifi")).toBeInTheDocument();
    expect(document.getElementById("project-controltech")).toBeInTheDocument();
    expect(document.getElementById("project-agent-tooling")).toBeInTheDocument();
    expect(document.getElementById("project-mapbylaw")).toBeInTheDocument();
  });
});
