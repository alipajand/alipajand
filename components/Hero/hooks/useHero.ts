"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { prefersReducedMotion } from "utils/gsap";

export interface HeroSelectors {
  containerRef: RefObject<HTMLElement | null>;
  nameCharsRef: RefObject<HTMLSpanElement | null>;
  line2Ref: RefObject<HTMLSpanElement | null>;
  subRef: RefObject<HTMLParagraphElement | null>;
  ctaRef: RefObject<HTMLDivElement | null>;
  metricsRef: RefObject<HTMLDivElement | null>;
  locationRef: RefObject<HTMLParagraphElement | null>;
  scrollIndicatorRef: RefObject<HTMLDivElement | null>;
}

export interface HeroHook {
  selectors: HeroSelectors;
}

export function useHero(): HeroHook {
  const containerRef = useRef<HTMLElement>(null);
  const nameCharsRef = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nameChars = nameCharsRef.current?.querySelectorAll("[data-char]");
    const chars = nameChars ? Array.from(nameChars) : [];
    const metricsItems = metricsRef.current?.querySelectorAll("[data-metric]");
    const noMotion = prefersReducedMotion();

    if (noMotion) {
      gsap.set([...chars, line2Ref.current, subRef.current, ctaRef.current?.children], {
        opacity: 1,
        y: 0,
      });
      if (metricsRef.current) gsap.set(metricsRef.current, { opacity: 1, y: 0 });
      if (metricsItems?.length) gsap.set(metricsItems, { opacity: 1, y: 0 });
      if (locationRef.current) gsap.set(locationRef.current, { opacity: 1, y: 0 });
      if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 1 });
      return;
    }

    gsap.set([...chars, line2Ref.current], { opacity: 0, y: 60 });
    if (metricsRef.current) gsap.set(metricsRef.current, { opacity: 0, y: 20 });
    if (metricsItems?.length) gsap.set(metricsItems, { opacity: 0, y: 12 });
    if (locationRef.current) gsap.set(locationRef.current, { opacity: 0, y: 12 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(chars, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 })
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .to(
        ctaRef.current?.children ?? [],
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        "-=0.2"
      );

    if (metricsRef.current) {
      tl.to(metricsRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.15");
    }
    if (metricsItems?.length) {
      tl.to(metricsItems, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, "-=0.35");
    }
    if (locationRef.current) {
      tl.to(locationRef.current, { opacity: 1, y: 0, duration: 0.45 }, "-=0.2");
    }

    tl.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.4 }, "-=0.3");
  }, []);

  useEffect(() => {
    if (!scrollIndicatorRef.current) return;
    gsap.to(scrollIndicatorRef.current, {
      y: 8,
      duration: 1.2,
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
      metricsRef,
      locationRef,
      scrollIndicatorRef,
    },
  };
}
