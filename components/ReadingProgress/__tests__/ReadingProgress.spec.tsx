import { render } from "@testing-library/react";
import { act } from "react";

import { ReadingProgress } from "components/ReadingProgress/ReadingProgress";

jest.mock("utils/gsap", () => ({
  __esModule: true,
  gsap: {
    set: jest.fn(),
  },
}));

type GsapMock = { gsap: { set: jest.Mock } };

const getMock = (): GsapMock => jest.requireMock("utils/gsap") as GsapMock;

const setScrollMetrics = ({ scrollY, scrollHeight }: { scrollY: number; scrollHeight: number }) => {
  Object.defineProperty(window, "scrollY", { value: scrollY, writable: true, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 800, writable: true, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    writable: true,
    configurable: true,
  });
};

describe("ReadingProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 1;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render a decorative progress bar", () => {
    setScrollMetrics({ scrollY: 0, scrollHeight: 2400 });
    const { container } = render(<ReadingProgress />);
    expect(container.querySelector('div[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("should scale the bar to the share of the page already scrolled", () => {
    setScrollMetrics({ scrollY: 800, scrollHeight: 2400 });
    const mock = getMock();

    render(<ReadingProgress />);

    expect(mock.gsap.set).toHaveBeenCalledWith(expect.anything(), { scaleX: 0 });
    expect(mock.gsap.set).toHaveBeenCalledWith(expect.anything(), {
      scaleX: 0.5,
      overwrite: true,
    });
  });

  it("should keep the bar empty when the page does not scroll", () => {
    setScrollMetrics({ scrollY: 0, scrollHeight: 800 });
    const mock = getMock();

    render(<ReadingProgress />);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(mock.gsap.set).toHaveBeenCalledWith(expect.anything(), { scaleX: 0, overwrite: true });
  });

  it("should stop listening to scroll once unmounted", () => {
    setScrollMetrics({ scrollY: 0, scrollHeight: 2400 });
    const removeListener = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<ReadingProgress />);
    unmount();

    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
