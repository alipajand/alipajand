import "@testing-library/jest-dom";

const mockScrollTriggerInstance = { kill: jest.fn() };
const mockScrollTrigger = {
  create: jest.fn(() => mockScrollTriggerInstance),
};

jest.mock("gsap/ScrollTrigger", () => ({
  __esModule: true,
  ScrollTrigger: mockScrollTrigger,
  default: mockScrollTrigger,
}));

jest.mock("gsap", () => ({
  set: jest.fn(),
  to: jest.fn().mockReturnValue({}),
  fromTo: jest.fn().mockReturnValue({}),
  timeline: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
  })),
  registerPlugin: jest.fn(),
}));

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    public callback: IntersectionObserverCallback,
    _?: IntersectionObserverInit
  ) {}

  observe(): void {
    this.callback(
      [
        { isIntersecting: true, target: document.createElement("div") },
      ] as unknown as IntersectionObserverEntry[],
      this
    );
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
