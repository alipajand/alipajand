import { render, screen, within } from "@testing-library/react";

import { PortfolioPageContent } from "features/portfolio/PortfolioPageContent";
import { PORTFOLIO_BAND_HEADING } from "data/portfolioIndex";
import { PORTFOLIO_PAGE_INTRO, PORTFOLIO_PROFILE_DETAILS } from "data/projects";
import { PORTFOLIO_PROFILE_LINKS_ARIA_LABEL } from "data/projectsUi";
import { getDedicatedCaseStudyProjects } from "utils/projects";

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

const introSection = () => screen.getByRole("region", { name: PORTFOLIO_BAND_HEADING });

describe("PortfolioPageContent", () => {
  it("should name the page with a single Selected Engineering Work H1 and keep the profile details", () => {
    render(<PortfolioPageContent />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Selected Engineering Work" })
    ).toBeInTheDocument();
    expect(screen.getByText(PORTFOLIO_PROFILE_DETAILS)).toBeInTheDocument();
  });

  it("should render every introduction paragraph unchanged", () => {
    render(<PortfolioPageContent />);

    const paragraphText = Array.from(introSection().querySelectorAll("p")).map(
      (node) => node.textContent
    );
    for (const paragraph of PORTFOLIO_PAGE_INTRO) {
      expect(paragraphText).toContain(paragraph);
    }
  });

  it("should render email, GitHub, LinkedIn, and booking links in the profile list", () => {
    render(<PortfolioPageContent />);

    const profileLinks = screen.getByRole("list", { name: PORTFOLIO_PROFILE_LINKS_ARIA_LABEL });
    const hrefs = within(profileLinks)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "mailto:alipajand@gmail.com",
      "https://github.com/alipajand",
      "https://linkedin.com/in/alipajand",
      "https://calendly.com/alipajand/intro",
    ]);
  });

  it("should list every dedicated case study as a text-first row with a working link", () => {
    render(<PortfolioPageContent />);

    const index = document.getElementById("case-studies") as HTMLElement;
    expect(index).toBeInTheDocument();
    for (const project of getDedicatedCaseStudyProjects()) {
      const row = document.getElementById(`project-${project.id}`) as HTMLElement;
      expect(row).toBeInTheDocument();
      const link = within(row).getByRole("link");
      expect(link.getAttribute("href")).toMatch(/^\/portfolio\//);
    }
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
