import { render } from "@testing-library/react";

import { GatedVercelSpeedInsights } from "components/Analytics/GatedVercelSpeedInsights";

jest.mock("@vercel/speed-insights/next", () => ({
  __esModule: true,
  SpeedInsights: () => <div data-testid="vercel-speed-insights" />,
}));

const setNodeEnv = (value: string): void => {
  (process.env as Record<string, string>).NODE_ENV = value;
};

describe("GatedVercelSpeedInsights", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    setNodeEnv(originalEnv as string);
  });

  it("should render nothing outside production", () => {
    setNodeEnv("test");
    const { container } = render(<GatedVercelSpeedInsights />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the Speed Insights component in production", () => {
    setNodeEnv("production");
    const { getByTestId } = render(<GatedVercelSpeedInsights />);
    expect(getByTestId("vercel-speed-insights")).toBeInTheDocument();
  });
});
