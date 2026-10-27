import { act, render } from "@testing-library/react";
import { useRef } from "react";

import { resetMotionPreferenceForTests, setMotionPaused } from "utils/motion/motionPreference";
import { getContinuousHoldCount, getScrollSubscriberCount } from "utils/motion/scrollScheduler";
import {
  installManualFrames,
  installMatchMedia,
  installObservers,
  type MediaControl,
} from "utils/motion/testEnvironment";
import { type MotionOptions, type MotionSetup, useMotion } from "utils/motion/useMotion";

const Island = ({
  setup,
  options,
}: {
  setup: MotionSetup<HTMLDivElement>;
  options?: MotionOptions;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(ref, setup, options);
  return <div ref={ref} data-testid="island" />;
};

let media: MediaControl;
let frames: ReturnType<typeof installManualFrames>;

beforeEach(() => {
  window.localStorage.clear();
  resetMotionPreferenceForTests();
  media = installMatchMedia(false);
  installObservers();
  frames = installManualFrames();
});

describe("useMotion", () => {
  it("should set up once mounted and tear down every listener on unmount", () => {
    const destroy = jest.fn();
    const onScroll = jest.fn();
    const setup = jest.fn(() => ({ onScroll, destroy }));

    const { unmount } = render(<Island setup={setup} options={{ alwaysActive: true }} />);
    expect(setup).toHaveBeenCalledWith(expect.objectContaining({ reducedMotion: false }));
    expect(getScrollSubscriberCount()).toBe(1);

    act(() => {
      frames.flush();
    });
    expect(onScroll).toHaveBeenCalledWith(expect.objectContaining({ y: 0, vel: 0 }));

    unmount();
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(getScrollSubscriberCount()).toBe(0);
    expect(frames.pending()).toBe(0);
  });

  it("should not request frames again once scrolling has settled", () => {
    const onScroll = jest.fn();
    render(<Island setup={() => ({ onScroll })} options={{ alwaysActive: true }} />);

    act(() => {
      frames.flush();
    });
    expect(frames.pending()).toBe(0);
    expect(onScroll).toHaveBeenCalledTimes(1);
  });

  it("should pass the reduced-motion preference and set up again when it changes", () => {
    const destroy = jest.fn();
    const setup = jest.fn(() => ({ destroy }));
    render(<Island setup={setup} />);
    expect(setup).toHaveBeenLastCalledWith(expect.objectContaining({ reducedMotion: false }));

    act(() => media.setMatches(true));
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(setup).toHaveBeenLastCalledWith(expect.objectContaining({ reducedMotion: true }));
  });

  it("should skip setup when disabled", () => {
    const setup = jest.fn();
    render(<Island setup={setup} options={{ enabled: false }} />);
    expect(setup).not.toHaveBeenCalled();
  });

  it("should keep the static rendering and mark the island when setup throws", () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    const { getByTestId } = render(
      <Island
        setup={() => {
          throw new Error("no canvas");
        }}
      />
    );
    expect(getByTestId("island")).toHaveAttribute("data-motion", "failed");
    expect(getScrollSubscriberCount()).toBe(0);
    error.mockRestore();
  });

  it("should stop the island when a frame throws", () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    const destroy = jest.fn();
    const { getByTestId } = render(
      <Island
        setup={() => ({
          onScroll: () => {
            throw new Error("bad frame");
          },
          destroy,
        })}
        options={{ alwaysActive: true }}
      />
    );
    act(() => {
      frames.flush();
    });
    expect(getByTestId("island")).toHaveAttribute("data-motion", "failed");
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(getScrollSubscriberCount()).toBe(0);
    error.mockRestore();
  });

  it("should set up again when the reset key changes, such as on a route change", () => {
    const destroy = jest.fn();
    const setup = jest.fn(() => ({ destroy }));
    const { rerender } = render(<Island setup={setup} options={{ resetKey: "/" }} />);
    rerender(<Island setup={setup} options={{ resetKey: "/portfolio" }} />);
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(setup).toHaveBeenCalledTimes(2);
  });

  it("should run onFrame every frame while active and go idle once it unmounts", () => {
    const onFrame = jest.fn();
    const { unmount } = render(
      <Island setup={({ idleMotion }) => (idleMotion ? { onFrame } : undefined)} />
    );
    for (let index = 0; index < 3; index += 1) {
      act(() => {
        frames.flush();
      });
    }
    expect(onFrame).toHaveBeenCalledTimes(3);
    expect(frames.pending()).toBe(1);
    expect(onFrame.mock.calls[2][0]).toEqual(
      expect.objectContaining({ step: expect.any(Number), time: expect.any(Number) })
    );

    unmount();
    act(() => {
      frames.flush();
    });
    expect(frames.pending()).toBe(0);
  });

  it("should turn idle motion off when the visitor pauses motion", () => {
    const setup = jest.fn(() => ({}));
    render(<Island setup={setup} />);
    expect(setup).toHaveBeenLastCalledWith(expect.objectContaining({ idleMotion: true }));

    act(() => setMotionPaused(true));
    expect(setup).toHaveBeenLastCalledWith(expect.objectContaining({ idleMotion: false }));
    expect(document.documentElement).toHaveAttribute("data-motion-paused");
    expect(window.localStorage.getItem("motion-paused")).toBe("1");

    act(() => setMotionPaused(false));
    expect(document.documentElement).not.toHaveAttribute("data-motion-paused");
  });

  it("should report idle motion as off under reduced motion", () => {
    installMatchMedia(true);
    const setup = jest.fn(() => ({}));
    render(<Island setup={setup} />);
    expect(setup).toHaveBeenLastCalledWith(
      expect.objectContaining({ reducedMotion: true, idleMotion: false })
    );
  });
});

describe("useMotion idle loop", () => {
  let visibility: DocumentVisibilityState = "visible";

  beforeAll(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => visibility,
    });
  });

  afterEach(() => {
    visibility = "visible";
  });

  const setVisibility = (next: DocumentVisibilityState) => {
    visibility = next;
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
  };

  const flush = () =>
    act(() => {
      frames.flush();
    });

  /** An island that asks for idle frames only when allowed, as the real islands do. */
  const politeSetup =
    (onFrame: jest.Mock): MotionSetup<HTMLDivElement> =>
    ({ idleMotion }) =>
      idleMotion ? { onFrame } : {};

  it("should stop the loop when the visitor pauses and start it again on resume", () => {
    const onFrame = jest.fn();
    render(<Island setup={politeSetup(onFrame)} />);
    flush();
    expect(frames.pending()).toBe(1);
    expect(getContinuousHoldCount()).toBe(1);

    act(() => setMotionPaused(true));
    flush();
    expect(frames.pending()).toBe(0);
    expect(getContinuousHoldCount()).toBe(0);
    const calls = onFrame.mock.calls.length;

    act(() => setMotionPaused(false));
    flush();
    expect(onFrame.mock.calls.length).toBeGreaterThan(calls);
    expect(frames.pending()).toBe(1);
  });

  it("should never run onFrame while idle motion is off, even if a setup returns it", () => {
    window.localStorage.setItem("motion-paused", "1");
    resetMotionPreferenceForTests();
    const onFrame = jest.fn();
    render(<Island setup={() => ({ onFrame })} />);
    flush();
    flush();
    expect(onFrame).not.toHaveBeenCalled();
    expect(getContinuousHoldCount()).toBe(0);
    expect(frames.pending()).toBe(0);
  });

  it("should let reduced motion win over a resume, including live changes", () => {
    const onFrame = jest.fn();
    render(<Island setup={() => ({ onFrame })} />);
    flush();
    expect(getContinuousHoldCount()).toBe(1);

    act(() => media.setMatches(true));
    act(() => setMotionPaused(false));
    flush();
    expect(getContinuousHoldCount()).toBe(0);
    expect(frames.pending()).toBe(0);
    onFrame.mockClear();
    flush();
    expect(onFrame).not.toHaveBeenCalled();

    act(() => media.setMatches(false));
    flush();
    expect(onFrame).toHaveBeenCalled();
    expect(getContinuousHoldCount()).toBe(1);
  });

  it("should request no frames while the tab is hidden and resume when shown", () => {
    const onFrame = jest.fn();
    render(<Island setup={politeSetup(onFrame)} />);
    flush();
    expect(frames.pending()).toBe(1);

    setVisibility("hidden");
    expect(frames.pending()).toBe(0);
    expect(getContinuousHoldCount()).toBe(0);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(frames.pending()).toBe(0);

    setVisibility("visible");
    expect(frames.pending()).toBe(1);
    expect(getContinuousHoldCount()).toBe(1);
  });

  it("should share one frame loop between islands", () => {
    const first = jest.fn();
    const second = jest.fn();
    render(
      <>
        <Island setup={politeSetup(first)} />
        <Island setup={politeSetup(second)} />
        <Island setup={() => ({ onScroll: jest.fn() })} options={{ alwaysActive: true }} />
      </>
    );
    for (let index = 0; index < 3; index += 1) {
      flush();
      expect(frames.pending()).toBe(1);
    }
    expect(getContinuousHoldCount()).toBe(2);
    expect(first).toHaveBeenCalledTimes(3);
    expect(second).toHaveBeenCalledTimes(3);
  });

  it("should leave no subscribers, holds or frames behind across route changes", () => {
    const onFrame = jest.fn();
    const { rerender, unmount } = render(
      <Island setup={politeSetup(onFrame)} options={{ resetKey: "/" }} />
    );
    flush();
    const baseline = { subscribers: getScrollSubscriberCount(), holds: getContinuousHoldCount() };
    expect(baseline).toEqual({ subscribers: 1, holds: 1 });

    for (const path of ["/portfolio", "/now", "/open-source", "/"]) {
      rerender(<Island setup={politeSetup(onFrame)} options={{ resetKey: path }} />);
      flush();
      expect({
        subscribers: getScrollSubscriberCount(),
        holds: getContinuousHoldCount(),
      }).toEqual(baseline);
      expect(frames.pending()).toBe(1);
    }

    unmount();
    flush();
    expect(getScrollSubscriberCount()).toBe(0);
    expect(getContinuousHoldCount()).toBe(0);
    expect(frames.pending()).toBe(0);
  });
});
