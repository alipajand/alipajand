import {
  registerLenis,
  SCROLL_TARGET_OFFSET,
  scrollToElement,
  scrollToTop,
} from "utils/scrollToTop";

describe("scrollToTop", () => {
  afterEach(() => {
    registerLenis(null);
  });

  it("should scroll the window when Lenis is not registered", () => {
    const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToTop();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });

    scrollTo.mockRestore();
  });

  it("should scroll through Lenis when it is registered", () => {
    const lenisScrollTo = jest.fn();
    registerLenis({ scrollTo: lenisScrollTo });
    const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToTop();

    expect(lenisScrollTo).toHaveBeenCalledWith(0, { immediate: true });
    expect(scrollTo).not.toHaveBeenCalled();

    scrollTo.mockRestore();
  });
});

describe("scrollToElement", () => {
  afterEach(() => {
    registerLenis(null);
  });

  it("should scroll through Lenis with the nav offset when registered", () => {
    const lenisScrollTo = jest.fn();
    registerLenis({ scrollTo: lenisScrollTo });
    const el = document.createElement("h2");
    jest.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 300 } as DOMRect);

    scrollToElement(el);

    expect(lenisScrollTo).toHaveBeenCalledWith(300 - SCROLL_TARGET_OFFSET);
  });

  it("should smooth-scroll the window to the element minus the nav offset", () => {
    const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
    const el = document.createElement("h2");
    jest.spyOn(el, "getBoundingClientRect").mockReturnValue({ top: 500 } as DOMRect);

    scrollToElement(el);

    expect(scrollTo).toHaveBeenCalledWith({
      top: 500 - SCROLL_TARGET_OFFSET,
      left: 0,
      behavior: "smooth",
    });
    scrollTo.mockRestore();
  });

  it("should jump without animation when reduced motion is preferred", () => {
    const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
    const matchMedia = window.matchMedia;
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });

    scrollToElement(document.createElement("h2"));

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
    window.matchMedia = matchMedia;
    scrollTo.mockRestore();
  });
});
