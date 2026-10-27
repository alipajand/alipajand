"use client";

import { type RefObject, useEffect, useEffectEvent } from "react";

import { useReducedMotion } from "utils/motion/reducedMotion";
import {
  requestScrollFrame,
  type ScrollFrame,
  subscribeScroll,
} from "utils/motion/scrollScheduler";

export interface MotionContext<E extends Element> {
  element: E;
  /** The live operating-system preference. Setup runs again when it changes. */
  reducedMotion: boolean;
}

/** What a motion island does once its element exists. Every callback is optional. */
export interface MotionController {
  /** Runs on coalesced scroll and resize frames while the element is on screen and the tab is visible. */
  onScroll?: (frame: ScrollFrame) => void;
  /** Runs when the element's own box changes size, including the first observation. */
  onResize?: () => void;
  /** Runs when the element enters or leaves the screen, or the tab is hidden or shown. */
  onActiveChange?: (active: boolean) => void;
  /** Runs on unmount, on route change and before a re-setup. Remove everything setup added. */
  destroy?: () => void;
}

export type MotionSetup<E extends Element> = (context: MotionContext<E>) => MotionController | void;

export interface MotionOptions {
  /** Skip setup entirely, for example when the island has nothing to animate. */
  enabled?: boolean;
  /** Only deliver scroll frames while the element intersects the viewport (with this margin). */
  rootMargin?: string;
  /** Deliver scroll frames even while off screen, for page-level indicators such as the progress line. */
  alwaysActive?: boolean;
  /** Extra values that should tear the island down and set it up again, such as the pathname. */
  resetKey?: string | number;
}

const markFailed = (element: Element, error: unknown) => {
  element.setAttribute("data-motion", "failed");
  if (process.env.NODE_ENV !== "production") {
    console.error("Motion setup failed; keeping the static rendering.", error);
  }
};

/**
 * Lifecycle for scroll-linked motion. It sets up after the element is in the DOM, re-runs on
 * reduced-motion changes and `resetKey` changes, pauses while off screen or in a hidden tab, reacts to
 * element resizes and back/forward-cache restores, and tears everything down on unmount. Any error in
 * setup or a frame stops the island and leaves the server-rendered still state in place.
 */
export const useMotion = <E extends Element>(
  ref: RefObject<E | null>,
  setup: MotionSetup<E>,
  { enabled = true, rootMargin = "0px", alwaysActive = false, resetKey }: MotionOptions = {}
): void => {
  const reducedMotion = useReducedMotion();
  const runSetup = useEffectEvent((context: MotionContext<E>) => setup(context));

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    let controller: MotionController | void;
    try {
      controller = runSetup({ element, reducedMotion });
    } catch (error) {
      markFailed(element, error);
      return;
    }
    if (!controller) return;
    const motion = controller;

    let stopped = false;
    let intersecting = true;
    let tabVisible = document.visibilityState !== "hidden";
    const isActive = () => !stopped && (alwaysActive || intersecting) && tabVisible;

    const cleanups: Array<() => void> = [];
    const teardown = () => {
      if (stopped) return;
      stopped = true;
      cleanups.splice(0).forEach((cleanup) => cleanup());
      motion.destroy?.();
    };
    const guard = (callback: () => void) => {
      try {
        callback();
      } catch (error) {
        markFailed(element, error);
        teardown();
      }
    };
    const notifyActive = () => guard(() => motion.onActiveChange?.(isActive()));

    if (motion.onScroll) {
      const onScroll = motion.onScroll;
      cleanups.push(
        subscribeScroll((frame) => {
          if (isActive()) guard(() => onScroll(frame));
        })
      );
    }

    if (!alwaysActive && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          intersecting = entry.isIntersecting;
          notifyActive();
          if (intersecting) requestScrollFrame();
        },
        { rootMargin }
      );
      observer.observe(element);
      cleanups.push(() => observer.disconnect());
    }

    if (motion.onResize && typeof ResizeObserver !== "undefined") {
      const onResize = motion.onResize;
      const observer = new ResizeObserver(() => {
        guard(onResize);
        requestScrollFrame();
      });
      observer.observe(element);
      cleanups.push(() => observer.disconnect());
    } else if (motion.onResize) {
      guard(motion.onResize);
    }

    const onVisibility = () => {
      tabVisible = document.visibilityState !== "hidden";
      notifyActive();
    };
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (motion.onResize) guard(motion.onResize);
      requestScrollFrame();
    };
    window.addEventListener("pageshow", onPageShow);
    cleanups.push(() => window.removeEventListener("pageshow", onPageShow));

    return teardown;
  }, [ref, enabled, reducedMotion, rootMargin, alwaysActive, resetKey]);
};
