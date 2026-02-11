"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";

export interface UseScrollRevealOptions {
  trigger?: HTMLElement | null;
  once?: boolean;
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  start?: string;
}

export interface ScrollRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
}

export interface ScrollRevealHook {
  selectors: ScrollRevealSelectors;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}): ScrollRevealHook {
  const sectionRef = useRef<HTMLElement>(null);

  const {
    trigger,
    once = true,
    y = 48,
    duration = 0.7,
    stagger = 0.1,
    delay = 0,
    start = "top 85%",
  } = options;

  useEffect(() => {
    registerGSAPPlugins();

    const el = sectionRef.current;
    if (!el) return;

    const children = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (children.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(children, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(children, { opacity: 0, y });

    const triggerEl = trigger ?? el;
    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start,
      once,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: children.length > 1 ? stagger : 0,
          ease: "power3.out",
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [trigger, once, y, duration, stagger, delay, start]);

  return {
    selectors: { sectionRef },
  };
}
