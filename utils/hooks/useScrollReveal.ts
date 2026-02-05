"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import gsap from "gsap";

export interface UseScrollRevealOptions {
  trigger?: HTMLElement | null;
  once?: boolean;
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}

export interface ScrollRevealSelectors {
  sectionRef: RefObject<HTMLElement | null>;
}

export interface ScrollRevealHook {
  selectors: ScrollRevealSelectors;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}): ScrollRevealHook {
  const sectionRef = useRef<HTMLElement>(null);

  const { trigger, once = false, y = 48, duration = 0.7, stagger = 0.1, delay = 0 } = options;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const children = el.querySelectorAll("[data-reveal]");
    const reset = () => gsap.set(children, { opacity: 0, y });
    reset();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline({ delay });
            tl.to(children, {
              opacity: 1,
              y: 0,
              duration,
              stagger: children.length > 1 ? stagger : 0,
              ease: "power3.out",
            });
            if (once && entry.target) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            reset();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const target = trigger ?? el;
    observer.observe(target);

    return () => observer.disconnect();
  }, [trigger, once, y, duration, stagger, delay]);

  return {
    selectors: { sectionRef },
  };
}
