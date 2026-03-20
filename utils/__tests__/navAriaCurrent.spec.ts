import { homeBrandAriaCurrent, navLinkAriaCurrent } from "utils/navAriaCurrent";

describe("navAriaCurrent", () => {
  it("navLinkAriaCurrent marks Blog on /blog and post routes", () => {
    expect(navLinkAriaCurrent("/blog", "/blog")).toBe("page");
    expect(navLinkAriaCurrent("/blog", "/blog/my-post")).toBe("page");
    expect(navLinkAriaCurrent("/blog", "/")).toBeUndefined();
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
    expect(homeBrandAriaCurrent("/blog")).toBeUndefined();
  });
});
