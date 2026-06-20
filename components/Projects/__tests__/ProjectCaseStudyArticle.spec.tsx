import { render, screen } from "@testing-library/react";

import { ProjectCaseStudyArticle } from "components/Projects/ProjectCaseStudyArticle";
import { getDedicatedCaseStudyProjects } from "utils/projects";

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
  const dedicatedProjects = getDedicatedCaseStudyProjects();
  const [ledgerguard, alwaysgeeky, tallyfolio, emplifi] = dedicatedProjects;

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
});
