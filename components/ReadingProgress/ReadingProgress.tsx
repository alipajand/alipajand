"use client";

import { useEffect, useRef } from "react";

import { onScrollFrame } from "utils/cinematic";
import { gsap } from "utils/gsap";

export const ReadingProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0 });

    return onScrollFrame(() => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      gsap.set(bar, { scaleX: progress, overwrite: true });
    });
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2px] bg-foreground z-[60] origin-left"
      aria-hidden="true"
    />
  );
};
