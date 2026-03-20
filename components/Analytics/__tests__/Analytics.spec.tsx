import { render } from "@testing-library/react";

import { Analytics } from "components/Analytics/Analytics";

jest.mock("next/script", () => {
  return function MockScript(props: Record<string, unknown>) {
    return <div data-mock-script {...props} />;
  };
});

describe("Analytics", () => {
  const originalGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalGaId;
  });

  it("returns null when GA measurement id is not set", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";

    const { container } = render(<Analytics />);

    expect(container.firstChild).toBeNull();
  });

  it("renders GA scripts when measurement id is set", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST-ID";

    const { container } = render(<Analytics />);
    const scripts = container.querySelectorAll("[data-mock-script]");

    expect(scripts.length).toBe(2);
  });
});
