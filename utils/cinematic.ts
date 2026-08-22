"use client";

import { gsap, prefersReducedMotion } from "utils/gsap";
import { CINE, DUR, EASE } from "utils/motion";

const WORD_SPLIT_FLAG = "cineSplit";

export const splitElementWords = (el: HTMLElement | null): HTMLElement[] => {
  if (!el) return [];
  if (el.dataset[WORD_SPLIT_FLAG] === "true") {
    return Array.from(el.querySelectorAll<HTMLElement>("[data-cine-word]"));
  }

  const text = el.textContent ?? "";
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const fragment = el.ownerDocument.createDocumentFragment();

  words.forEach((word, index) => {
    const mask = el.ownerDocument.createElement("span");
    mask.className = "cine-mask";

    const inner = el.ownerDocument.createElement("span");
    inner.className = "cine-word";
    inner.setAttribute("data-cine-word", "");
    inner.textContent = word;

    mask.appendChild(inner);
    fragment.appendChild(mask);

    if (index < words.length - 1) {
      fragment.appendChild(el.ownerDocument.createTextNode(" "));
    }
  });

  el.textContent = "";
  el.appendChild(fragment);
  el.dataset[WORD_SPLIT_FLAG] = "true";

  return Array.from(el.querySelectorAll<HTMLElement>("[data-cine-word]"));
};

export interface RevealOnceOptions {
  rootMargin?: string;
  threshold?: number;
}

export const revealOnce = (
  elements: HTMLElement[],
  onEnter: (el: HTMLElement, index: number) => void,
  { rootMargin = "0px 0px -12% 0px", threshold = 0.05 }: RevealOnceOptions = {}
): (() => void) => {
  if (elements.length === 0) return () => {};

  if (typeof IntersectionObserver === "undefined") {
    elements.forEach(onEnter);
    return () => {};
  }

  const indexOf = new Map(elements.map((el, index) => [el, index]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          onEnter(el, indexOf.get(el) ?? 0);
        });
    },
    { rootMargin, threshold }
  );

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
};

export const onScrollFrame = (handler: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};

  let frame = 0;

  const run = () => {
    frame = 0;
    handler();
  };

  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(run);
  };

  handler();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
};

export const viewportProgress = (el: HTMLElement): number => {
  const rect = el.getBoundingClientRect();
  const viewport = window.innerHeight || 1;
  const raw = (viewport - rect.top) / (viewport + rect.height);
  return Math.min(1, Math.max(0, raw));
};

export interface CinematicRevealOptions extends RevealOnceOptions {
  y?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}

const STAGGER_WINDOW_MS = 260;

export const cinematicReveal = (
  elements: HTMLElement[],
  {
    y = 44,
    scale = 0.99,
    duration = DUR.lg,
    stagger = CINE.stagger.lines,
    delay = 0,
    ...observerOptions
  }: CinematicRevealOptions = {}
): (() => void) => {
  if (elements.length === 0) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0, scale: 1 });
    return () => {};
  }

  gsap.set(elements, { opacity: 0, y, scale });

  let batchStart = 0;
  let batchCount = 0;

  return revealOnce(
    elements,
    (element) => {
      const now = performance.now();
      if (now - batchStart > STAGGER_WINDOW_MS) {
        batchStart = now;
        batchCount = 0;
      }

      gsap.to(element, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        delay: delay + batchCount * stagger,
        ease: EASE.smooth,
        overwrite: "auto",
      });

      batchCount += 1;
    },
    observerOptions
  );
};

export const cinematicTitleReveal = (
  elements: HTMLElement[],
  observerOptions: RevealOnceOptions = {}
): (() => void) => {
  if (elements.length === 0) return () => {};

  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return () => {};
  }

  const wordsByElement = new Map(elements.map((el) => [el, splitElementWords(el)]));

  wordsByElement.forEach((words) => {
    gsap.set(words, { opacity: 0, yPercent: 115 });
  });

  return revealOnce(
    elements,
    (element) => {
      const words = wordsByElement.get(element) ?? [];
      if (words.length === 0) return;

      gsap.to(words, {
        opacity: 1,
        yPercent: 0,
        duration: CINE.duration.mask,
        stagger: CINE.stagger.words,
        ease: EASE.snap,
        overwrite: "auto",
      });
    },
    observerOptions
  );
};
