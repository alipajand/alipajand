import { render, screen, within } from "@testing-library/react";

import { ProjectIndex } from "components/Projects/ProjectIndex";
import { PORTFOLIO_CASE_STUDIES_TOC_ARIA_LABEL } from "data/projectsUi";

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
  it("should outline every case study with in-page links", () => {
    render(<ProjectIndex />);

    const [outline] = screen.getAllByRole("navigation", {
      name: PORTFOLIO_CASE_STUDIES_TOC_ARIA_LABEL,
    });
    const links = within(outline).getAllByRole("link");
    expect(links).toHaveLength(7);
    expect(links[0]).toHaveAttribute("href", "#project-ledgerguard");
    expect(within(outline).getByRole("link", { name: "MapBylaw" })).toHaveAttribute(
      "href",
      "#project-mapbylaw"
    );
  });

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
      screen.getByRole("heading", { level: 2, name: "Agent Engineering Tools" })
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
        .getAllByRole("link", { name: /^Read the .+ case study/ })
        .map((link) => link.getAttribute("href"))
    ).toEqual([
      "/portfolio/ledgerguard",
      "/portfolio/alwaysgeeky",
      "/portfolio/emplifi",
      "/portfolio/agent-tooling",
      "/portfolio/tallyfolio",
      "/portfolio/controltech",
      "/portfolio/mapbylaw",
    ]);
  });

  it("should link project titles and related links from the index", () => {
    render(<ProjectIndex />);

    const heading = screen.getByRole("heading", { level: 2, name: "LedgerGuard" });
    expect(within(heading).getByRole("link", { name: "LedgerGuard" })).toHaveAttribute(
      "href",
      "/portfolio/ledgerguard"
    );
    const ledgerGuardLinks = screen.getByRole("list", { name: "LedgerGuard links" });
    expect(
      within(ledgerGuardLinks).getByRole("link", { name: /ledgerguard\.io.*opens in new tab/ })
    ).toHaveAttribute("target", "_blank");
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
