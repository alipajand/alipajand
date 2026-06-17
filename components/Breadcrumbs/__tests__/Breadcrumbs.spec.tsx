import { render, screen } from "@testing-library/react";

import { Breadcrumbs } from "components/Breadcrumbs/Breadcrumbs";
import { portfolioCaseStudyBreadcrumbs } from "data/breadcrumbs";

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

describe("Breadcrumbs", () => {
  it("should render a semantic breadcrumb trail with aria-current on the current page", () => {
    render(<Breadcrumbs items={portfolioCaseStudyBreadcrumbs("LedgerGuard")} />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Case studies" })).toHaveAttribute(
      "href",
      "/portfolio"
    );
    expect(screen.getByText("LedgerGuard")).toHaveAttribute("aria-current", "page");
  });
});
