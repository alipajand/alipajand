export interface EasedPointer {
  /** Smoothed position; read it while drawing. */
  readonly x: number;
  readonly y: number;
  /** Sets the target position and eases toward it over a few frames, calling `draw` each frame. */
  follow: (x: number, y?: number) => void;
  /** Cancels any frame still pending. */
  stop: () => void;
}

/**
 * A pointer position that eases toward its target and then stops requesting frames, so pointer
 * parallax never turns into an idle animation loop.
 */
export const createEasedPointer = (
  draw: () => void,
  { x = 0, y = 0, smoothing = 0.07 }: { x?: number; y?: number; smoothing?: number } = {}
): EasedPointer => {
  const target = { x, y };
  const current = { x, y };
  let frame = 0;

  const step = () => {
    current.x += (target.x - current.x) * smoothing;
    current.y += (target.y - current.y) * smoothing;
    const settled =
      Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
    if (settled) {
      current.x = target.x;
      current.y = target.y;
    }
    draw();
    frame = settled ? 0 : window.requestAnimationFrame(step);
  };

  return {
    get x() {
      return current.x;
    },
    get y() {
      return current.y;
    },
    follow: (nextX, nextY = target.y) => {
      target.x = nextX;
      target.y = nextY;
      if (!frame) frame = window.requestAnimationFrame(step);
    },
    stop: () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    },
  };
};
