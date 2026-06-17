import { homeBrandAriaCurrent, navLinkAriaCurrent } from "utils/navAriaCurrent";

describe("navAriaCurrent", () => {
  it("should mark Writing on /writing and post routes for navLinkAriaCurrent", () => {
    expect(navLinkAriaCurrent("/writing", "/writing")).toBe("page");
    expect(navLinkAriaCurrent("/writing", "/writing/my-post")).toBe("page");
    expect(navLinkAriaCurrent("/writing", "/")).toBeUndefined();
  });

  it("should mark Portfolio on /portfolio and dedicated case-study routes", () => {
    expect(navLinkAriaCurrent("/portfolio", "/portfolio")).toBe("page");
    expect(navLinkAriaCurrent("/portfolio", "/portfolio/ledgerguard")).toBe("page");
    expect(navLinkAriaCurrent("/portfolio", "/")).toBeUndefined();
  });

  it("should return undefined for hash home links for navLinkAriaCurrent", () => {
    expect(navLinkAriaCurrent("/#contact", "/")).toBeUndefined();
  });

  it("should be page only on / for homeBrandAriaCurrent", () => {
    expect(homeBrandAriaCurrent("/")).toBe("page");
    expect(homeBrandAriaCurrent("/writing")).toBeUndefined();
  });

  it("should return undefined when pathname is null", () => {
    expect(navLinkAriaCurrent("/writing", null)).toBeUndefined();
    expect(navLinkAriaCurrent("/portfolio", null)).toBeUndefined();
    expect(homeBrandAriaCurrent(null)).toBeUndefined();
  });
});
