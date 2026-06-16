import { render } from "@testing-library/react";

import { GatedVercelAnalytics } from "components/Analytics/GatedVercelAnalytics";

jest.mock("@vercel/analytics/next", () => ({
  __esModule: true,
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

const setNodeEnv = (value: string): void => {
  (process.env as Record<string, string>).NODE_ENV = value;
};

describe("GatedVercelAnalytics", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    setNodeEnv(originalEnv as string);
  });

  it("renders nothing outside production", () => {
    setNodeEnv("test");
    const { container } = render(<GatedVercelAnalytics />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the Vercel Analytics component in production", () => {
    setNodeEnv("production");
    const { getByTestId } = render(<GatedVercelAnalytics />);
    expect(getByTestId("vercel-analytics")).toBeInTheDocument();
  });
});
