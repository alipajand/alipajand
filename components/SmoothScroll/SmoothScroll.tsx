"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);
  const rafRef = useRef<(time: number) => void>(() => {});

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return;

    registerGSAPPlugins();
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    rafRef.current = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafRef.current);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafRef.current);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      gsap.ticker.lagSmoothing(1000, 500);
    };
  }, []);

  return <>{children}</>;
}
