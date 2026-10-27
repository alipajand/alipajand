import { createEasedPointer } from "utils/motion/easedPointer";
import { installManualFrames } from "utils/motion/testEnvironment";

describe("createEasedPointer", () => {
  it("should ease toward the target and stop requesting frames once settled", () => {
    const frames = installManualFrames();
    const draw = jest.fn();
    const pointer = createEasedPointer(draw, { smoothing: 0.5 });

    pointer.follow(1, -1);
    frames.flush();
    expect(pointer.x).toBeCloseTo(0.5);
    expect(pointer.y).toBeCloseTo(-0.5);

    let guard = 0;
    while (frames.flush() > 0 && guard < 100) guard += 1;
    expect(pointer.x).toBe(1);
    expect(pointer.y).toBe(-1);
    expect(frames.pending()).toBe(0);
    expect(guard).toBeLessThan(100);
  });

  it("should cancel a pending frame on stop", () => {
    const frames = installManualFrames();
    const draw = jest.fn();
    const pointer = createEasedPointer(draw);
    pointer.follow(1);
    pointer.stop();
    expect(frames.flush()).toBe(0);
    expect(draw).not.toHaveBeenCalled();
  });
});
