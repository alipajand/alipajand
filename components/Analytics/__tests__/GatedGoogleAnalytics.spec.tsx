import { render } from "@testing-library/react";
import type { ComponentType } from "react";

jest.mock("next/script", () => ({
  __esModule: true,
  default: ({ id, children }: { id?: string; children?: React.ReactNode }) => (
    <script data-testid={id}>{children}</script>
  ),
}));

const loadComponent = async (gaId?: string): Promise<ComponentType> => {
  let Component!: ComponentType;
  await jest.isolateModulesAsync(async () => {
    if (gaId === undefined) {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    } else {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = gaId;
    }
    const mod = (await import("components/Analytics/GatedGoogleAnalytics")) as {
      GatedGoogleAnalytics: ComponentType;
    };
    Component = mod.GatedGoogleAnalytics;
  });
  return Component;
};

describe("GatedGoogleAnalytics", () => {
  const originalGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  afterEach(() => {
    if (originalGaId === undefined) {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    } else {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalGaId;
    }
  });

  it("renders nothing when the measurement id is missing", async () => {
    const Component = await loadComponent(undefined);
    const { container } = render(<Component />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the gtag scripts when a measurement id is set", async () => {
    const Component = await loadComponent("G-TEST123");
    const { getByTestId } = render(<Component />);

    const gtag = getByTestId("ga-gtag");
    const init = getByTestId("ga-init");

    expect(gtag).toBeInTheDocument();
    expect(init).toBeInTheDocument();
    expect(init.textContent).toContain("G-TEST123");
  });
});
