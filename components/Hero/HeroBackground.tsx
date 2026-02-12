"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "utils/gsap";

export function HeroBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion() || !svgRef.current) return;

    const svg = svgRef.current;
    const paths = svg.querySelectorAll<SVGPathElement>("path");

    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      const baseOpacity = parseFloat(path.getAttribute("opacity") || "0.4");
      const drawDuration = 2 + Math.random() * 2;
      const pauseDuration = 1 + Math.random() * 2;

      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.opacity = "0";

      const tl = gsap.timeline({ repeat: -1, delay: index * 0.3 });

      tl.to(path, {
        strokeDashoffset: 0,
        opacity: baseOpacity || 0.4,
        duration: drawDuration,
        ease: "power2.out",
      })
        // Brief pause
        .to(
          path,
          {
            duration: pauseDuration,
          },
          `+=${pauseDuration}`
        )
        // Fade out
        .to(
          path,
          {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          },
          `+=0.5`
        )
        // Reset and prepare for next draw
        .set(path, {
            strokeDashoffset: length,
          })
        // Brief pause before redrawing
        .to(
          path,
          {
            duration: pauseDuration * 0.5,
          },
          `+=${pauseDuration * 0.5}`
        );

      gsap.to(path, {
        x: Math.random() * 20 - 10, // Random horizontal movement
        y: Math.random() * 20 - 10, // Random vertical movement
        duration: 4 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5,
      });
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.5)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
        </linearGradient>
      </defs>
      {/* Animated connecting lines */}
      <path
        d="M 100 200 Q 300 100, 500 200 T 900 200"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 200 400 Q 400 300, 600 400 T 1000 400"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 50 600 Q 250 500, 450 600 T 850 600"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 300 100 L 500 300 L 700 100"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 150 500 L 350 700 L 550 500"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 800 150 Q 900 250, 1000 150 T 1200 150"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 700 350 Q 800 450, 900 350 T 1100 350"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 600 550 Q 700 650, 800 550 T 1000 550"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      {/* Additional subtle lines */}
      <path
        d="M 100 300 L 300 100"
        stroke="url(#lineGradient)"
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.2"
      />
      <path
        d="M 400 200 L 600 400"
        stroke="url(#lineGradient)"
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.2"
      />
      <path
        d="M 800 200 L 1000 400"
        stroke="url(#lineGradient)"
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.2"
      />
      <path
        d="M 200 700 L 400 500"
        stroke="url(#lineGradient)"
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.2"
      />
      <path
        d="M 900 500 L 1100 700"
        stroke="url(#lineGradient)"
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.2"
      />
    </svg>
  );
}
