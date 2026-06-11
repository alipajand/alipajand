"use client";

import { useEffect, useRef } from "react";

import { gsap, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAPPlugins();
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0 });

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress, overwrite: true });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2px] bg-foreground z-[60] origin-left"
      aria-hidden="true"
    />
  );
}
