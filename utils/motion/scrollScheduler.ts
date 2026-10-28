export interface ScrollFrame {
  y: number;
  vh: number;
  max: number;
  vel: number;
  time: number;
  step: number;
}

type ScrollListener = (frame: ScrollFrame) => void;

const VELOCITY_SMOOTHING = 0.18;
const VELOCITY_REST = 0.05;
const FRAME_MS = 1000 / 60;
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

const isHidden = () => document.visibilityState === "hidden";

const schedule = () => {
  if (frameId || listeners.size === 0 || isHidden()) return;
  frameId = window.requestAnimationFrame(run);
};

const cancel = () => {
  if (frameId) window.cancelAnimationFrame(frameId);
  frameId = 0;
  lastTime = 0;
};

const onPageShow = (event: PageTransitionEvent) => {
  if (event.persisted) {
    lastY = window.scrollY;
    schedule();
  }
};

const onVisibility = () => {
  if (isHidden()) cancel();
  else schedule();
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
  cancel();
};

export const subscribeScroll = (listener: ScrollListener): (() => void) => {
  listeners.add(listener);
  attach();
  schedule();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) detach();
  };
};

export const requestScrollFrame = (): void => schedule();

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

export const getScrollSubscriberCount = (): number => listeners.size;

export const getContinuousHoldCount = (): number => continuousHolds;
