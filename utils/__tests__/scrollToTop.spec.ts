import { registerLenis, scrollToTop } from "utils/scrollToTop";

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
