import { render, screen } from "@testing-library/react";

import { PortfolioPageContent } from "features/portfolio/PortfolioPageContent";

jest.mock("utils/hooks/usePageHeader", () => ({
  usePageHeader: () => ({
    selectors: { headerRef: { current: null } },
  }),
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

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    const { fill: _fill, sizes: _sizes, ...imgProps } = props;
    return <img src={src} alt={alt} {...imgProps} />;
  },
}));

describe("PortfolioPageContent", () => {
  it("renders the portfolio H1 and required introduction", () => {
    render(<PortfolioPageContent />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Product engineering case studies" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "I work across product decisions, interface design, frontend architecture, design systems, and delivery. These case studies focus on the constraints, decisions, and implementation details behind the finished interfaces."
      )
    ).toBeInTheDocument();
  });

  it("renders the homepage back link and portfolio case studies", () => {
    render(<PortfolioPageContent />);

    expect(screen.getByRole("link", { name: "← Back to homepage" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("heading", { name: "Selected case studies" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "LedgerGuard" }).length).toBeGreaterThan(0);
  });
});
