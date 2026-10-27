/**
 * One scroll and resize listener for the whole page. Events are coalesced into a single animation
 * frame; subscribers read the same measurements. Frames only run while something changed: after the
 * last scroll event the smoothed velocity decays to zero and the scheduler goes idle.
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
}

type ScrollListener = (frame: ScrollFrame) => void;

const VELOCITY_SMOOTHING = 0.18;
const VELOCITY_REST = 0.05;

const listeners = new Set<ScrollListener>();
let frameId = 0;
let lastY = 0;
let vel = 0;
let attached = false;

const measure = (): ScrollFrame => {
  const y = window.scrollY;
  vel += (y - lastY - vel) * VELOCITY_SMOOTHING;
  lastY = y;
  if (Math.abs(vel) < VELOCITY_REST) vel = 0;
  const vh = window.innerHeight;
  return { y, vh, max: Math.max(0, document.documentElement.scrollHeight - vh), vel };
};

const run = () => {
  frameId = 0;
  const frame = measure();
  listeners.forEach((listener) => listener(frame));
  if (frame.vel !== 0) schedule();
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

/** Number of active subscribers. Exposed for tests and leak checks. */
export const getScrollSubscriberCount = (): number => listeners.size;
