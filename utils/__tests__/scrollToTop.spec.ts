import { SCROLL_TARGET_OFFSET, scrollToElement, scrollToTop } from "utils/scrollToTop";

describe("scrollToTop", () => {
  it("should scroll the window to the top", () => {
    const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToTop();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });

    scrollTo.mockRestore();
  });
});

describe("scrollToElement", () => {
  it("should scroll the window to the element minus the nav offset", () => {
    const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
    const el = document.createElement("h2");
    jest.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 500 } as DOMRect);

    scrollToElement(el);

    expect(scrollTo).toHaveBeenCalledWith({
      top: 500 - SCROLL_TARGET_OFFSET,
      left: 0,
      behavior: "auto",
    });
    scrollTo.mockRestore();
  });
});
