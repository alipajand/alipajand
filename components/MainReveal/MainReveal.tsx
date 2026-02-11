"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "utils/gsap";

export function MainReveal({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    gsap.set(el, { opacity: 0 });
    gsap.to(el, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.1,
    });
  }, []);

  return (
    <div ref={wrapperRef} className="min-h-screen">
      {children}
    </div>
  );
}
