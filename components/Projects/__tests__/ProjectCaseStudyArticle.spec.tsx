import { render, screen, within } from "@testing-library/react";

import { ProjectCaseStudyArticle } from "components/Projects/ProjectCaseStudyArticle";
import type { Project } from "data/projects";
import { projectCaseStudyTocAriaLabel } from "data/projectsUi";
import { getProjectBySlug } from "utils/projects";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />;
  },
}));

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

describe("ProjectCaseStudyArticle", () => {
  const ledgerguard = getProjectBySlug("ledgerguard")!;
  const alwaysgeeky = getProjectBySlug("alwaysgeeky")!;
  const tallyfolio = getProjectBySlug("tallyfolio")!;
  const emplifi = getProjectBySlug("emplifi")!;

  it("should use dedicated routes for next-project navigation on case-study pages", () => {
    render(
      <ProjectCaseStudyArticle project={ledgerguard} nextProject={alwaysgeeky} isDedicatedPage />
    );

    expect(
      screen.getByRole("link", { name: /Next case study: AlwaysGeeky Games/i })
    ).toHaveAttribute("href", "/portfolio/alwaysgeeky");
    expect(screen.getByRole("link", { name: /Back to all case studies/i })).toHaveAttribute(
      "href",
      "/portfolio#case-studies"
    );
  });

  it("should render a single H1 on dedicated case-study pages", () => {
    render(<ProjectCaseStudyArticle project={ledgerguard} isDedicatedPage />);

    expect(screen.getByRole("heading", { level: 1, name: "LedgerGuard" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: "LedgerGuard" })
    ).not.toBeInTheDocument();
  });

  it("should render the representative hero figure on dedicated pages", () => {
    render(<ProjectCaseStudyArticle project={ledgerguard} isDedicatedPage />);

    expect(
      screen.getByRole("img", {
        name: "LedgerGuard landing page introducing AI-assisted contract intelligence for renewals and commitments.",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Interface evidence" })).toBeInTheDocument();
  });

  it("should render the requested case-study sections", () => {
    render(<ProjectCaseStudyArticle project={emplifi} isDedicatedPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Emplifi" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Context" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Problem" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "My role" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What I built" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Technical decisions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "UX and detail decisions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Outcome" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What I would improve" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Product decisions" })).not.toBeInTheDocument();
  });

  it("should render tallyfolio as a standard dedicated case study", () => {
    render(<ProjectCaseStudyArticle project={tallyfolio} isDedicatedPage />);

    expect(screen.getByRole("heading", { level: 1, name: "TallyFolio" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Context" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Technical decisions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Outcome" })).toBeInTheDocument();
  });

  it("should list every rendered section in the on-this-page outline", () => {
    render(<ProjectCaseStudyArticle project={ledgerguard} isDedicatedPage />);

    const [outline] = screen.getAllByRole("navigation", {
      name: projectCaseStudyTocAriaLabel("LedgerGuard"),
    });
    expect(within(outline).getByRole("link", { name: "Context" })).toHaveAttribute(
      "href",
      "#ledgerguard-context"
    );
    expect(within(outline).getByRole("link", { name: "Interface evidence" })).toBeInTheDocument();
    expect(document.getElementById("ledgerguard-context")).not.toBeNull();
  });

  it("should leave evidence out of the outline when there are no extra figures", () => {
    const withoutEvidence: Project = {
      ...ledgerguard,
      caseStudy: { ...ledgerguard.caseStudy, interfaceEvidence: undefined },
    };
    render(<ProjectCaseStudyArticle project={withoutEvidence} isDedicatedPage />);

    expect(screen.queryByRole("link", { name: "Interface evidence" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Interface evidence" })).not.toBeInTheDocument();
  });

  it("should render diagrams inside the section they belong to", () => {
    const withDiagram: Project = {
      ...emplifi,
      caseStudy: {
        ...emplifi.caseStudy,
        diagrams: [
          {
            section: "problem",
            spec: {
              type: "compare",
              title: "Test diagram",
              columns: [
                { label: "Before", items: ["a"] },
                { label: "After", items: ["b"] },
              ],
            },
          },
        ],
      },
    };
    render(<ProjectCaseStudyArticle project={withDiagram} isDedicatedPage />);

    const problem = document.getElementById("emplifi-problem") as HTMLElement;
    expect(within(problem).getByRole("figure", { name: "Test diagram" })).toBeInTheDocument();
  });

  it("should use in-page anchors and an h2 title when embedded in a list", () => {
    render(<ProjectCaseStudyArticle project={ledgerguard} nextProject={alwaysgeeky} />);

    expect(screen.getByRole("heading", { level: 2, name: "LedgerGuard" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Next case study: AlwaysGeeky Games/i })
    ).toHaveAttribute("href", "#project-alwaysgeeky");
    expect(screen.getByRole("link", { name: /Back to all case studies/i })).toHaveAttribute(
      "href",
      "#case-studies"
    );
  });
});
