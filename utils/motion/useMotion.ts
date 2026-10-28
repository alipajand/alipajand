"use client";

import { type RefObject, useEffect, useEffectEvent } from "react";

import { useMotionPaused } from "utils/motion/motionPreference";
import { useReducedMotion } from "utils/motion/reducedMotion";
import {
  holdContinuousFrames,
  requestScrollFrame,
  type ScrollFrame,
  subscribeScroll,
} from "utils/motion/scrollScheduler";

export interface MotionContext<E extends Element> {
  element: E;
  reducedMotion: boolean;
  idleMotion: boolean;
}

export interface MotionController {
  onScroll?: (frame: ScrollFrame) => void;
  onFrame?: (frame: ScrollFrame) => void;
  onResize?: () => void;
  onActiveChange?: (active: boolean) => void;
  destroy?: () => void;
}

export type MotionSetup<E extends Element> = (context: MotionContext<E>) => MotionController | void;

export interface MotionOptions {
  enabled?: boolean;
  rootMargin?: string;
  alwaysActive?: boolean;
  resetKey?: string | number;
}

const markFailed = (element: Element, error: unknown) => {
  element.setAttribute("data-motion", "failed");
  if (process.env.NODE_ENV !== "production") {
    console.error("Motion setup failed; keeping the static rendering.", error);
  }
};

export const useMotion = <E extends Element>(
  ref: RefObject<E | null>,
  setup: MotionSetup<E>,
  { enabled = true, rootMargin = "0px", alwaysActive = false, resetKey }: MotionOptions = {}
): void => {
  const reducedMotion = useReducedMotion();
  const motionPaused = useMotionPaused();
  const idleMotion = !reducedMotion && !motionPaused;
  const runSetup = useEffectEvent((context: MotionContext<E>) => setup(context));

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    let controller: MotionController | void;
    try {
      controller = runSetup({ element, reducedMotion, idleMotion });
    } catch (error) {
      markFailed(element, error);
      return;
    }
    if (!controller) return;
    const motion = controller;
    const onFrame = idleMotion ? motion.onFrame : undefined;

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
    let releaseFrames: (() => void) | null = null;
    const syncContinuous = () => {
      const want = Boolean(onFrame) && isActive();
      if (want && !releaseFrames) releaseFrames = holdContinuousFrames();
      else if (!want && releaseFrames) {
        releaseFrames();
        releaseFrames = null;
      }
    };
    cleanups.push(() => {
      releaseFrames?.();
      releaseFrames = null;
    });
    const notifyActive = () => {
      syncContinuous();
      guard(() => motion.onActiveChange?.(isActive()));
    };

    if (motion.onScroll || onFrame) {
      const { onScroll } = motion;
      cleanups.push(
        subscribeScroll((frame) => {
          if (!isActive()) return;
          guard(() => {
            onScroll?.(frame);
            onFrame?.(frame);
          });
        })
      );
    }
    syncContinuous();

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
  }, [ref, enabled, reducedMotion, idleMotion, rootMargin, alwaysActive, resetKey]);
};
