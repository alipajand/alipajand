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

  it("renders updated project roles", () => {
    const { container } = render(<Projects />);
    const text = container.textContent ?? "";

    expect(text).toContain("Senior Product Engineer · LedgerGuard");
    expect(text).toContain(
      "Senior Product Engineer · Frontend architecture & product UI · MapBylaw"
    );
    expect(text).toContain("Senior Frontend Engineer · Design systems · AlwaysGeeky Games");
    expect(text).toContain("Creator and maintainer · Open-source developer tooling");
    expect(text).toContain("Senior Frontend Engineer · Dashboards & performance · Emplifi");
    expect(text).toContain(
      "Frontend Engineer · Startup product delivery · ControlTech Startup Studio"
    );
  });

  it("renders contribution fields for updated projects", () => {
    render(<Projects />);

    expect(screen.getAllByText("My contribution").length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        "Owned product experience, visual hierarchy, interaction states, frontend implementation, review workflows, and production iteration."
      )
    ).toBeInTheDocument();
  });

  it("preserves existing project links", () => {
    render(<Projects />);

    const projectLinks = screen.getAllByRole("link", { name: /Project/i });
    const hrefs = projectLinks.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("https://ledgerguard.io/");
    expect(hrefs).toContain("https://mapbylaw.ca/");
    expect(screen.getByRole("link", { name: /Marketplace/i })).toHaveAttribute(
      "href",
      "https://market.voxies.io"
    );
    expect(screen.getByRole("link", { name: /Login/i })).toHaveAttribute(
      "href",
      "https://login.voxies.io/"
    );
    const websiteLinks = screen.getAllByRole("link", { name: /Website/i });
    const websiteHrefs = websiteLinks.map((link) => link.getAttribute("href"));
    expect(websiteHrefs).toContain("https://emplifi.io");
    expect(websiteHrefs).toContain("https://ctrltech.org");
  });

  it("renders the grouped agent tooling project with all repository links", () => {
    render(<Projects />);

    expect(
      screen.getByText(
        "Agent Engineering Toolkit — deterministic safeguards for AI coding workflows"
      )
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Agent Readiness Kit/i })).toHaveAttribute(
      "href",
      "https://github.com/alipajand/agent-readiness-kit"
    );
    expect(screen.getByRole("link", { name: /Agent Context Doctor/i })).toHaveAttribute(
      "href",
      "https://github.com/alipajand/agent-context-doctor"
    );
    expect(screen.getByRole("link", { name: /Agent PR Reviewer Lite/i })).toHaveAttribute(
      "href",
      "https://github.com/alipajand/agent-pr-reviewer-lite"
    );
    expect(screen.getByRole("link", { name: /Agent Readiness Action/i })).toHaveAttribute(
      "href",
      "https://github.com/alipajand/agent-readiness-action"
    );
  });

  it("renders the contribution text for the grouped agent tooling project", () => {
    render(<Projects />);

    expect(
      screen.getByText(
        "Owned product definition, CLI UX, rule design, TypeScript implementation, testing, documentation, release structure, and repository maintenance."
      )
    ).toBeInTheDocument();
  });

  it("renders the grouped project after AlwaysGeeky and before Emplifi", () => {
    const { container } = render(<Projects />);
    const projectHeadings = Array.from(container.querySelectorAll("[data-project-card] h3")).map(
      (heading) => heading.textContent
    );

    expect(
      projectHeadings.indexOf("AlwaysGeeky — design system, marketplace, and authentication flows")
    ).toBeLessThan(
      projectHeadings.indexOf(
        "Agent Engineering Toolkit — deterministic safeguards for AI coding workflows"
      )
    );
    expect(
      projectHeadings.indexOf(
        "Agent Engineering Toolkit — deterministic safeguards for AI coding workflows"
      )
    ).toBeLessThan(
      projectHeadings.indexOf("Emplifi — data-heavy dashboards and interaction performance")
    );
  });

  it("renders all projects from data", () => {
    render(<Projects />);
    PROJECTS.forEach((project) => {
      expect(screen.getAllByText(project.name).length).toBeGreaterThan(0);
    });
  });

  it("renders case study labels for projects that have them", () => {
    render(<Projects />);
    expect(screen.getAllByText("What I owned").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Context and problem").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Constraints").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Key decisions").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Outcome and evidence").length).toBeGreaterThan(0);
  });

  it("renders jump nav for case studies (in DOM for lg layout)", () => {
    const { container } = render(<Projects />);
    const nav = container.querySelector('[aria-label="Jump to case study"]');
    expect(nav).toBeInTheDocument();
    const jump = container.querySelector('a[href="#project-mapbylaw-platform-ui-ai-reports"]');
    expect(jump?.textContent).toContain("MapBylaw");
  });

  it("renders technical signals and full stack", () => {
    render(<Projects />);
    expect(screen.getAllByText(/technical signals/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/full stack/i).length).toBeGreaterThan(0);
  });
});
