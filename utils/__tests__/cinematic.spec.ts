import {
  cinematicReveal,
  onScrollFrame,
  splitElementWords,
  viewportProgress,
} from "utils/cinematic";
import * as gsapUtils from "utils/gsap";

jest.mock("utils/gsap", () => ({
  __esModule: true,
  gsap: { set: jest.fn(), to: jest.fn() },
  prefersReducedMotion: jest.fn(() => false),
}));

describe("splitElementWords", () => {
  it("should wrap each word in a mask without changing the text", () => {
    const el = document.createElement("h2");
    el.textContent = "Selected  Work Here";

    const words = splitElementWords(el);

    expect(words).toHaveLength(3);
    expect(el.textContent).toBe("Selected Work Here");
    expect(el.querySelectorAll(".cine-mask")).toHaveLength(3);
  });

  it("should split an element only once", () => {
    const el = document.createElement("h2");
    el.textContent = "Two words";

    splitElementWords(el);
    const second = splitElementWords(el);

    expect(second).toHaveLength(2);
    expect(el.querySelectorAll(".cine-mask")).toHaveLength(2);
  });

  it("should return nothing for empty or missing elements", () => {
    expect(splitElementWords(null)).toEqual([]);
    expect(splitElementWords(document.createElement("p"))).toEqual([]);
  });
});

describe("cinematicReveal", () => {
  beforeEach(() => {
    jest.mocked(gsapUtils.gsap.set).mockClear();
    jest.mocked(gsapUtils.gsap.to).mockClear();
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(false);
  });

  it("should be a no-op for an empty list", () => {
    cinematicReveal([]);
    expect(gsapUtils.gsap.set).not.toHaveBeenCalled();
  });

  it("should show elements immediately when reduced motion is preferred", () => {
    jest.mocked(gsapUtils.prefersReducedMotion).mockReturnValue(true);

    cinematicReveal([document.createElement("div")]);

    expect(gsapUtils.gsap.set).toHaveBeenCalledWith(expect.anything(), {
      opacity: 1,
      y: 0,
      scale: 1,
    });
    expect(gsapUtils.gsap.to).not.toHaveBeenCalled();
  });
});

describe("viewportProgress", () => {
  it("should report 0 below the fold and 1 once past the top", () => {
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });

    const below = document.createElement("div");
    below.getBoundingClientRect = () => ({ top: 2000, height: 200 }) as DOMRect;
    expect(viewportProgress(below)).toBe(0);

    const above = document.createElement("div");
    above.getBoundingClientRect = () => ({ top: -900, height: 200 }) as DOMRect;
    expect(viewportProgress(above)).toBe(1);
  });
});

describe("onScrollFrame", () => {
  it("should run the handler on subscribe and stop on cleanup", () => {
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    const handler = jest.fn();

    const stop = onScrollFrame(handler);
    expect(handler).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event("scroll"));
    expect(handler).toHaveBeenCalledTimes(2);

    stop();
    window.dispatchEvent(new Event("scroll"));
    expect(handler).toHaveBeenCalledTimes(2);

    jest.restoreAllMocks();
  });
});
