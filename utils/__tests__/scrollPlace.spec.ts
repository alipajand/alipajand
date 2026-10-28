import { SCROLL_PLACE_SCRIPT, SCROLL_PLACE_STORAGE_KEY } from "utils/scrollPlace";

type Listener = { type: string; listener: EventListener };

describe("SCROLL_PLACE_SCRIPT", () => {
  let listeners: Listener[];
  let scrollTo: jest.Mock;

  const stored = () => JSON.parse(sessionStorage.getItem(SCROLL_PLACE_STORAGE_KEY) ?? "{}");

  const setScrollY = (y: number) => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: y });
  };

  // jsdom has no navigation timing entries.
  const setNavigationType = (type?: string) => {
    Object.defineProperty(performance, "getEntriesByType", {
      configurable: true,
      value: () => (type ? [{ type }] : []),
    });
  };

  const run = ({ type, key = "entry-a" }: { type: string; key?: string }) => {
    Object.defineProperty(window, "navigation", {
      configurable: true,
      value: {
        currentEntry: { key },
        addEventListener: (type: string, listener: EventListener) => {
          listeners.push({ type: `navigation:${type}`, listener });
        },
      },
    });
    setNavigationType(type);
    new Function(SCROLL_PLACE_SCRIPT)();
  };

  const fire = (type: string, event: Event = new Event(type)) => {
    for (const entry of listeners.filter((item) => item.type === type)) {
      entry.listener(event);
    }
  };

  const navigateAway = (sameDocument: boolean) =>
    fire(
      "navigation:navigate",
      Object.assign(new Event("navigate"), { destination: { sameDocument } })
    );

  beforeEach(() => {
    listeners = [];
    sessionStorage.clear();
    setScrollY(0);
    scrollTo = jest.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    jest.spyOn(window, "addEventListener").mockImplementation((type, listener) => {
      listeners.push({ type, listener: listener as EventListener });
    });
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(window, "navigation");
    Reflect.deleteProperty(performance, "getEntriesByType");
  });

  it("should record the offset of the current entry as the page scrolls", () => {
    run({ type: "navigate" });
    setScrollY(640);
    fire("scroll");

    expect(stored()).toEqual({ "entry-a": 640 });
  });

  it("should not record the top of the page when it is left before the owed offset is restored", () => {
    sessionStorage.setItem(SCROLL_PLACE_STORAGE_KEY, JSON.stringify({ "entry-a": 3376 }));
    run({ type: "back_forward" });
    fire("scroll");
    navigateAway(false);

    expect(stored()).toEqual({ "entry-a": 3376 });
  });

  it("should record where the reader was when a link starts to leave the page", () => {
    run({ type: "navigate" });
    setScrollY(1429);
    navigateAway(false);
    setScrollY(3208);
    fire("scroll");

    expect(stored()).toEqual({ "entry-a": 1429 });
  });

  it("should keep recording after a navigation within the page", () => {
    run({ type: "navigate" });
    setScrollY(200);
    navigateAway(true);
    setScrollY(300);
    fire("scroll");

    expect(stored()).toEqual({ "entry-a": 300 });
  });

  it("should record again once the reader moves a page that was not left", () => {
    run({ type: "navigate" });
    navigateAway(false);
    fire("keydown");
    setScrollY(90);
    fire("scroll");

    expect(stored()).toEqual({ "entry-a": 90 });
  });

  it("should apply the owed offset on load when the browser did not", () => {
    sessionStorage.setItem(SCROLL_PLACE_STORAGE_KEY, JSON.stringify({ "entry-a": 3376 }));
    run({ type: "back_forward" });
    fire("load");

    expect(scrollTo).toHaveBeenCalledWith({ top: 3376, left: 0, behavior: "instant" });
  });

  it("should leave a place the browser already restored", () => {
    sessionStorage.setItem(SCROLL_PLACE_STORAGE_KEY, JSON.stringify({ "entry-a": 3376 }));
    run({ type: "back_forward" });
    setScrollY(3376);
    fire("load");

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("should give up the owed offset once the reader scrolls", () => {
    sessionStorage.setItem(SCROLL_PLACE_STORAGE_KEY, JSON.stringify({ "entry-a": 3376 }));
    run({ type: "back_forward" });
    fire("wheel");
    setScrollY(120);
    fire("scroll");
    fire("load");

    expect(scrollTo).not.toHaveBeenCalled();
    expect(stored()).toEqual({ "entry-a": 120 });
  });

  it("should not restore on a fresh visit", () => {
    sessionStorage.setItem(SCROLL_PLACE_STORAGE_KEY, JSON.stringify({ "entry-a": 3376 }));
    run({ type: "navigate" });
    fire("load");

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("should keep only the most recent entries", () => {
    const places = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`old-${i}`, i]));
    sessionStorage.setItem(SCROLL_PLACE_STORAGE_KEY, JSON.stringify(places));
    run({ type: "navigate", key: "newest" });
    setScrollY(10);
    fire("scroll");

    const kept = stored();
    expect(Object.keys(kept)).toHaveLength(50);
    expect(kept).not.toHaveProperty("old-0");
    expect(kept.newest).toBe(10);
  });

  it("should do nothing without the Navigation API", () => {
    setNavigationType();
    new Function(SCROLL_PLACE_SCRIPT)();

    expect(listeners).toHaveLength(0);
  });
});
