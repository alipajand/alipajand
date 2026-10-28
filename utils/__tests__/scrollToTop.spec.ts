import { scrollToTop } from "utils/scrollToTop";

describe("scrollToTop", () => {
  it("should scroll the window to the top", () => {
    const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToTop();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });

    scrollTo.mockRestore();
  });
});
