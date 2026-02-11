"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "utils/gsap";

export function MainReveal({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || prefersReducedMotion()) return;

    const t = setTimeout(() => {
      gsap.fromTo(
        el,
        { opacity: 0.92 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }, 80);

    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={wrapperRef} className="min-h-screen">
      {children}
    </div>
  );
}
