/**
 * One scroll and resize listener and one animation-frame loop for the whole page. Events are
 * coalesced into a single frame; subscribers read the same measurements. Frames only run while
 * something changed (after the last scroll event the smoothed velocity decays to zero) or while an
 * on-screen island holds a continuous-frame request, such as a drifting ticker. With neither, the
 * scheduler goes idle.
 */

export interface ScrollFrame {
  /** Current vertical scroll offset. */
  y: number;
  /** Viewport height. */
  vh: number;
  /** Largest possible scroll offset. */
  max: number;
  /** Smoothed scroll velocity in pixels per frame; positive when scrolling down. */
  vel: number;
  /** The frame's timestamp, from requestAnimationFrame. */
  time: number;
  /** Elapsed time since the previous frame in 60 Hz frames (1 at 60 Hz, 0.5 at 120 Hz). */
  step: number;
}

type ScrollListener = (frame: ScrollFrame) => void;

const VELOCITY_SMOOTHING = 0.18;
const VELOCITY_REST = 0.05;
const FRAME_MS = 1000 / 60;
/** Longest gap counted as continuous; a longer one (idle, hidden tab) counts as a single frame. */
const MAX_GAP_MS = 100;

const listeners = new Set<ScrollListener>();
let frameId = 0;
let lastY = 0;
let vel = 0;
let lastTime = 0;
let continuousHolds = 0;
let attached = false;

const measure = (time: number): ScrollFrame => {
  const y = window.scrollY;
  vel += (y - lastY - vel) * VELOCITY_SMOOTHING;
  lastY = y;
  if (Math.abs(vel) < VELOCITY_REST) vel = 0;
  const vh = window.innerHeight;
  const gap = lastTime ? time - lastTime : FRAME_MS;
  lastTime = time;
  const step = gap > 0 && gap <= MAX_GAP_MS ? gap / FRAME_MS : 1;
  return { y, vh, max: Math.max(0, document.documentElement.scrollHeight - vh), vel, time, step };
};

const run = (time: number) => {
  frameId = 0;
  const frame = measure(time);
  listeners.forEach((listener) => listener(frame));
  if (frame.vel !== 0 || continuousHolds > 0) schedule();
  else lastTime = 0;
};

const schedule = () => {
  if (frameId || listeners.size === 0) return;
  frameId = window.requestAnimationFrame(run);
};

const onPageShow = (event: PageTransitionEvent) => {
  // Restored from the back/forward cache: scroll position may have changed without a scroll event.
  if (event.persisted) {
    lastY = window.scrollY;
    schedule();
  }
};

const onVisibility = () => {
  if (document.visibilityState === "visible") schedule();
};

const attach = () => {
  if (attached) return;
  attached = true;
  lastY = window.scrollY;
  vel = 0;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", onPageShow);
  document.addEventListener("visibilitychange", onVisibility);
};

const detach = () => {
  if (!attached) return;
  attached = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  window.removeEventListener("pageshow", onPageShow);
  document.removeEventListener("visibilitychange", onVisibility);
  if (frameId) window.cancelAnimationFrame(frameId);
  frameId = 0;
};

/** Subscribes to coalesced scroll frames. The listener also receives one frame right away. */
export const subscribeScroll = (listener: ScrollListener): (() => void) => {
  listeners.add(listener);
  attach();
  schedule();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) detach();
  };
};

/** Asks for one frame, for example after a resize, a font load or a route change. */
export const requestScrollFrame = (): void => schedule();

/**
 * Keeps frames running every display refresh until the returned release is called. Islands hold
 * this only while they are on screen, the tab is visible and idle motion is allowed.
 */
export const holdContinuousFrames = (): (() => void) => {
  continuousHolds += 1;
  schedule();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    continuousHolds -= 1;
  };
};

/** Number of active subscribers. Exposed for tests and leak checks. */
export const getScrollSubscriberCount = (): number => listeners.size;
