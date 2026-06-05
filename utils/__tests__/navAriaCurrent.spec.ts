import { homeBrandAriaCurrent, navLinkAriaCurrent } from "utils/navAriaCurrent";

describe("navAriaCurrent", () => {
  it("navLinkAriaCurrent marks Writing on /writing and post routes", () => {
    expect(navLinkAriaCurrent("/writing", "/writing")).toBe("page");
    expect(navLinkAriaCurrent("/writing", "/writing/my-post")).toBe("page");
    expect(navLinkAriaCurrent("/writing", "/")).toBeUndefined();
  });

  it("navLinkAriaCurrent marks Portfolio only on /portfolio", () => {
    expect(navLinkAriaCurrent("/portfolio", "/portfolio")).toBe("page");
    expect(navLinkAriaCurrent("/portfolio", "/")).toBeUndefined();
  });

  it("navLinkAriaCurrent returns undefined for hash home links", () => {
    expect(navLinkAriaCurrent("/#contact", "/")).toBeUndefined();
  });

  it("homeBrandAriaCurrent is page only on /", () => {
    expect(homeBrandAriaCurrent("/")).toBe("page");
    expect(homeBrandAriaCurrent("/writing")).toBeUndefined();
  });

  it("returns undefined when pathname is null", () => {
    expect(navLinkAriaCurrent("/writing", null)).toBeUndefined();
    expect(navLinkAriaCurrent("/portfolio", null)).toBeUndefined();
    expect(homeBrandAriaCurrent(null)).toBeUndefined();
  });
});
