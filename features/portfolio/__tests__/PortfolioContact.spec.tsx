import { render, screen, within } from "@testing-library/react";

import { PortfolioContact } from "features/portfolio/PortfolioContact";
import { PORTFOLIO_PROFILE_LINKS_ARIA_LABEL } from "data/projectsUi";

describe("PortfolioContact", () => {
  it("should lead the link list with the email address", () => {
    render(<PortfolioContact />);

    const list = screen.getByRole("list", { name: PORTFOLIO_PROFILE_LINKS_ARIA_LABEL });
    const [first] = within(list).getAllByRole("link");
    expect(first).toHaveAttribute("href", "mailto:alipajand@gmail.com");
    expect(within(list).getByText("alipajand@gmail.com")).toBeInTheDocument();
  });

  it("should default to the portfolio page ids", () => {
    render(<PortfolioContact />);

    expect(document.getElementById("contact")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /let’s talk/i })).toHaveAttribute("id", "contact");
  });

  it("should accept its own ids so it can sit beside the homepage contact section", () => {
    render(<PortfolioContact id="lets-talk" headingId="lets-talk-heading" />);

    const section = screen.getByRole("region", { name: /let’s talk/i });
    expect(section).toHaveAttribute("id", "lets-talk");
    expect(section).toHaveAttribute("aria-labelledby", "lets-talk-heading");
    expect(document.getElementById("contact")).not.toBeInTheDocument();
  });
});
