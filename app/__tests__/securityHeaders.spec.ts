/** @jest-environment node */

import nextConfig, { securityHeaders } from "../../next.config";

const headerValue = (key: string): string | undefined =>
  securityHeaders.find((header) => header.key === key)?.value;

describe("security headers", () => {
  it("applies the header set to every route", async () => {
    const rules = await nextConfig.headers!();
    expect(rules).toEqual([{ source: "/:path*", headers: securityHeaders }]);
  });

  it("forbids framing the site", () => {
    expect(headerValue("X-Frame-Options")).toBe("DENY");
    expect(headerValue("Content-Security-Policy")).toContain("frame-ancestors 'none'");
  });

  it("restricts base URLs, form targets and plugins without restricting scripts", () => {
    const csp = headerValue("Content-Security-Policy") ?? "";
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toMatch(/script-src|default-src|style-src/);
  });

  it("disables MIME sniffing and trims the referrer", () => {
    expect(headerValue("X-Content-Type-Options")).toBe("nosniff");
    expect(headerValue("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("denies powerful browser features the site does not use", () => {
    const policy = headerValue("Permissions-Policy") ?? "";
    for (const feature of ["camera", "microphone", "geolocation", "payment"]) {
      expect(policy).toContain(`${feature}=()`);
    }
  });

  it("does not advertise the framework", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
