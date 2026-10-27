import { act, render } from "@testing-library/react";
import { useRef } from "react";

import { getScrollSubscriberCount } from "utils/motion/scrollScheduler";
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
});
