"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { prefersReducedMotion } from "utils/gsap";
import { CINE, DUR, EASE } from "utils/motion";

export interface HeroSelectors {
  containerRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  eyebrowRef: RefObject<HTMLParagraphElement | null>;
  line2Ref: RefObject<HTMLHeadingElement | null>;
  subRef: RefObject<HTMLParagraphElement | null>;
  ctaRef: RefObject<HTMLDivElement | null>;
  locationRef: RefObject<HTMLParagraphElement | null>;
  scrollIndicatorRef: RefObject<HTMLDivElement | null>;
}

export interface HeroHook {
  selectors: HeroSelectors;
}

export const useHero = (): HeroHook => {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noMotion = prefersReducedMotion();

    const words = line2Ref.current
      ? Array.from(line2Ref.current.querySelectorAll<HTMLElement>("[data-cine-word]"))
      : [];

    if (noMotion) {
      gsap.set(stageRef.current, { opacity: 1, scale: 1, y: 0, filter: "none" });
      gsap.set(words, { opacity: 1, yPercent: 0 });
      gsap.set(line2Ref.current, { opacity: 1, y: 0 });
      gsap.set(eyebrowRef.current, { opacity: 1, letterSpacing: "0.14em" });
      gsap.set(subRef.current, { opacity: 1, y: 0 });
      gsap.set(ctaRef.current?.children ?? [], { opacity: 1, y: 0 });
      if (locationRef.current) gsap.set(locationRef.current, { opacity: 1, y: 0 });
      if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { opacity: 1 });
      return;
    }

    gsap.set(stageRef.current, {
      opacity: 0,
      scale: CINE.push.scale,
      y: 18,
      filter: "blur(14px)",
    });
    gsap.set(words, { opacity: 0, yPercent: 115 });
    gsap.set(line2Ref.current, { opacity: 1, y: 0 });
    gsap.set(eyebrowRef.current, { opacity: 0, letterSpacing: "0.5em" });
    gsap.set(subRef.current, { opacity: 0, y: 26 });
    gsap.set(ctaRef.current?.children ?? [], { opacity: 0, y: 18 });
    if (locationRef.current) gsap.set(locationRef.current, { opacity: 0, y: 12 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: CINE.ease } });

    tl.to(stageRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      duration: CINE.push.duration,
      ease: CINE.easeCamera,
    });

    tl.to(
      eyebrowRef.current,
      { opacity: 1, letterSpacing: "0.14em", duration: CINE.duration.settle },
      0.15
    );

    if (words.length > 0) {
      tl.to(
        words,
        {
          opacity: 1,
          yPercent: 0,
          duration: CINE.duration.mask,
          stagger: CINE.stagger.words,
          ease: EASE.snap,
        },
        0.35
      );
    }

    tl.to(subRef.current, { opacity: 1, y: 0, duration: DUR.lg }, "-=0.55");

    if (locationRef.current) {
      tl.to(locationRef.current, { opacity: 1, y: 0, duration: DUR.md }, "-=0.6");
    }

    tl.to(
      ctaRef.current?.children ?? [],
      { opacity: 1, y: 0, duration: DUR.md, stagger: 0.08 },
      "-=0.5"
    );

    tl.to(scrollIndicatorRef.current, { opacity: 1, duration: DUR.md }, "-=0.3");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return;

    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const layers = Array.from(
      container.querySelectorAll<HTMLElement>("[data-hero-parallax]")
    ) as HTMLElement[];

    let frame = 0;

    const apply = () => {
      frame = 0;
      const height = container.offsetHeight || window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / height));

      gsap.set(stage, {
        y: progress * -90,
        scale: 1 - progress * 0.04,
        opacity: 1 - progress * 0.85,
      });

      layers.forEach((layer) => {
        const kind = layer.getAttribute("data-hero-parallax");
        if (kind === "grid") {
          gsap.set(layer, { y: progress * 60, scale: 1 + progress * 0.08, opacity: 1 - progress });
          return;
        }
        if (kind === "sweep") {
          gsap.set(layer, { y: progress * 28, opacity: 0.5 - progress * 0.5 });
          return;
        }
        gsap.set(layer, { opacity: 1 + progress * 0.4 });
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!scrollIndicatorRef.current) return;
    if (prefersReducedMotion()) return;
    gsap.to(scrollIndicatorRef.current, {
      y: 9,
      duration: 1.6,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return {
    selectors: {
      containerRef,
      stageRef,
      eyebrowRef,
      line2Ref,
      subRef,
      ctaRef,
      locationRef,
      scrollIndicatorRef,
    },
  };
};
