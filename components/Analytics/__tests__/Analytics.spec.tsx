import { render } from "@testing-library/react";
import Script from "next/script";
import { Analytics } from "components/Analytics/Analytics";

jest.mock("next/script", () => ({
  __esModule: true,
  default: jest.fn(({ children, ...props }: any) => {
    const { src, id, strategy, ...rest } = props;
    return <script src={src} id={id} data-strategy={strategy} {...rest}>{children}</script>;
  }),
}));

describe("Analytics", () => {
  const originalEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalEnv;
  });

  describe("when GA_MEASUREMENT_ID is not set", () => {
    it("should return null", () => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      const { container } = render(<Analytics />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when GA_MEASUREMENT_ID is set", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
      jest.mocked(Script).mockClear();
    });

    it("should render Script components", () => {
      const { container } = render(<Analytics />);

      const scripts = container.querySelectorAll("script");
      expect(scripts.length).toBeGreaterThanOrEqual(1);
      expect(Script).toHaveBeenCalledTimes(2);
    });

    it("should render gtag script with correct src", () => {
      render(<Analytics />);

      expect(Script).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX",
          strategy: "lazyOnload",
        }),
        undefined
      );
    });

    it("should render inline script with correct id", () => {
      render(<Analytics />);

      expect(Script).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          id: "google-analytics",
          strategy: "lazyOnload",
        }),
        undefined
      );
    });

    it("should include GA_MEASUREMENT_ID in inline script", () => {
      jest.mocked(Script).mockClear();
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123";
      render(<Analytics />);

      const calls = jest.mocked(Script).mock.calls;
      const inlineScriptCall = calls.find((call) => call[0]?.id === "google-analytics");
      expect(inlineScriptCall).toBeDefined();
      if (inlineScriptCall) {
        const children = inlineScriptCall[0]?.children;
        expect(children).toBeDefined();
        if (typeof children === "string") {
          expect(children).toContain("G-TEST123");
        }
      }
    });

    it("should include gtag configuration in inline script", () => {
      render(<Analytics />);

      const calls = jest.mocked(Script).mock.calls;
      const inlineScriptCall = calls.find((call) => call[0]?.id === "google-analytics");
      expect(inlineScriptCall).toBeDefined();
      if (inlineScriptCall) {
        const scriptContent = inlineScriptCall[0]?.children as string;
        expect(scriptContent).toContain("window.dataLayer");
        expect(scriptContent).toContain("function gtag");
        expect(scriptContent).toContain("gtag('js', new Date())");
        expect(scriptContent).toContain("gtag('config'");
      }
    });
  });
});
