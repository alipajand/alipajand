import { render, screen, within } from "@testing-library/react";

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
  it("renders the updated portfolio intro text", () => {
    render(<PortfolioPageContent />);

    expect(
      screen.getByText(
        "Case studies covering product engineering, frontend architecture, design systems, complex workflows, and AI-assisted interfaces."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "I’m a Senior Product Engineer specializing in frontend architecture, design systems, and developer experience. These case studies focus on designing and shipping complex, reliable product workflows without sacrificing clarity, accessibility, or maintainability."
      )
    ).toBeInTheDocument();
  });

  it("renders the role-fit strip", () => {
    render(<PortfolioPageContent />);

    const roleFit = screen.getByLabelText("Portfolio role fit");
    expect(roleFit).toBeInTheDocument();
    expect(within(roleFit).getByText("Senior Product Engineer")).toBeInTheDocument();
    expect(within(roleFit).getByText("Developer experience")).toBeInTheDocument();
  });

  it("renders the what to look for section and all cards", () => {
    render(<PortfolioPageContent />);

    expect(screen.getByRole("heading", { name: "What to look for" })).toBeInTheDocument();
    expect(screen.getByText("Product UI from ambiguity")).toBeInTheDocument();
    expect(screen.getByText("Design systems that ship")).toBeInTheDocument();
    expect(screen.getByText("Complex frontend states")).toBeInTheDocument();
    expect(screen.getByText("Frontend quality and ownership")).toBeInTheDocument();
  });
});
