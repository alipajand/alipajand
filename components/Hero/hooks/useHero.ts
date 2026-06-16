"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { prefersReducedMotion } from "utils/gsap";
import { DUR, EASE, STAGGER } from "utils/motion";

export interface HeroSelectors {
  containerRef: RefObject<HTMLElement | null>;
  nameCharsRef: RefObject<HTMLSpanElement | null>;
  line2Ref: RefObject<HTMLHeadingElement | null>;
  subRef: RefObject<HTMLParagraphElement | null>;
  ctaRef: RefObject<HTMLDivElement | null>;
  locationRef: RefObject<HTMLParagraphElement | null>;
  scrollIndicatorRef: RefObject<HTMLDivElement | null>;
}

export interface HeroHook {
  selectors: HeroSelectors;
}

export function useHero(): HeroHook {
  const containerRef = useRef<HTMLElement>(null);
  const nameCharsRef = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noMotion = prefersReducedMotion();

    const chars = nameCharsRef.current
      ? nameCharsRef.current.querySelectorAll<HTMLElement>("[data-char]")
      : [];

    if (noMotion) {
      gsap.set([...chars], { opacity: 1, y: 0 });
      gsap.set(line2Ref.current, { opacity: 1, y: 0 });
      gsap.set(subRef.current, { opacity: 1, y: 0 });
      gsap.set(ctaRef.current?.children ?? [], { opacity: 1, y: 0 });
      if (locationRef.current) gsap.set(locationRef.current, { opacity: 1, y: 0 });
      if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 1 });
      return;
    }

    gsap.set([...chars], { opacity: 0, y: 52 });
    gsap.set(line2Ref.current, { opacity: 0, y: 28 });
    gsap.set(subRef.current, { opacity: 0, y: 24 });
    gsap.set(ctaRef.current?.children ?? [], { opacity: 0, y: 16 });
    if (locationRef.current) gsap.set(locationRef.current, { opacity: 0, y: 12 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: EASE.smooth } });

    if (chars.length > 0) {
      tl.to([...chars], {
        opacity: 1,
        y: 0,
        duration: DUR.md,
        stagger: STAGGER.chars,
        ease: EASE.snap,
      });
    }

    tl.to(
      line2Ref.current,
      { opacity: 1, y: 0, duration: DUR.lg },
      chars.length > 0 ? `-=${DUR.sm}` : 0
    );

    tl.to(subRef.current, { opacity: 1, y: 0, duration: DUR.md }, `-=${DUR.sm}`);

    tl.to(
      ctaRef.current?.children ?? [],
      { opacity: 1, y: 0, duration: DUR.sm, stagger: 0.06 },
      `-=${DUR.xs}`
    );

    if (locationRef.current) {
      tl.to(locationRef.current, { opacity: 1, y: 0, duration: DUR.sm }, `-=${DUR.sm}`);
    }

    tl.to(scrollIndicatorRef.current, { opacity: 1, duration: DUR.sm }, `-=${DUR.xs}`);
  }, []);

  useEffect(() => {
    if (!scrollIndicatorRef.current) return;
    if (prefersReducedMotion()) return;
    gsap.to(scrollIndicatorRef.current, {
      y: 9,
      duration: 1.3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return {
    selectors: {
      containerRef,
      nameCharsRef,
      line2Ref,
      subRef,
      ctaRef,
      locationRef,
      scrollIndicatorRef,
    },
  };
}
