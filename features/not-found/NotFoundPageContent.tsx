"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { NotFoundMainFocus } from "components/NotFoundMainFocus/NotFoundMainFocus";
import {
  NOT_FOUND_CODE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_KEYBOARD_TIP,
  NOT_FOUND_LINK_HOME,
  NOT_FOUND_LINK_PORTFOLIO,
  NOT_FOUND_TITLE,
} from "data/notFound";
import { gsap, prefersReducedMotion } from "utils/gsap";
import { DUR, EASE } from "utils/motion";

const SCRAMBLE_CHARS = "!@#%^&*xX01?$";

const scrambleText = (
  el: HTMLElement,
  target: string,
  duration: number,
  onComplete?: () => void
) => {
  const totalFrames = Math.round(duration * 60);
  let frame = 0;

  const tick = () => {
    const progress = frame / totalFrames;
    el.textContent = target
      .split("")
      .map((char, i) => {
        if (char === " ") return " ";
        if (i / target.length < progress) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join("");

    frame++;
    if (frame <= totalFrames) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
      onComplete?.();
    }
  };

  requestAnimationFrame(tick);
};

export const NotFoundPageContent = () => {
  const codeRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const tipRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const code = codeRef.current;
    const noMotion = prefersReducedMotion();

    if (noMotion) {
      const all = [titleRef.current, descRef.current, tipRef.current, ctasRef.current].filter(
        Boolean
      );
      gsap.set(all, { opacity: 1, y: 0 });
      return;
    }

    const belowEls = [titleRef.current, descRef.current, tipRef.current, ctasRef.current].filter(
      Boolean
    ) as HTMLElement[];

    gsap.set(belowEls, { opacity: 0, y: 20 });

    if (code) {
      const original = code.textContent ?? NOT_FOUND_CODE;
      code.textContent = SCRAMBLE_CHARS.slice(0, original.length);

      gsap.delayedCall(0.15, () => {
        scrambleText(code, original, 0.9, () => {
          gsap.to(belowEls, {
            opacity: 1,
            y: 0,
            duration: DUR.md,
            stagger: 0.09,
            ease: EASE.smooth,
            delay: 0.1,
          });
        });
      });
    }
  }, []);

  return (
    <>
      <NotFoundMainFocus />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 text-center outline-none"
      >
        <p
          ref={codeRef}
          className="text-muted text-3xl font-semibold uppercase tracking-[0.14em] mb-3"
        >
          {NOT_FOUND_CODE}
        </p>
        <h1
          ref={titleRef}
          className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3"
        >
          {NOT_FOUND_TITLE}
        </h1>
        <p
          ref={descRef}
          className="text-muted text-[15px] sm:text-base max-w-md leading-relaxed mb-4"
        >
          {NOT_FOUND_DESCRIPTION}
        </p>
        <p ref={tipRef} className="text-muted text-sm max-w-md leading-relaxed mb-10">
          {NOT_FOUND_KEYBOARD_TIP}
        </p>
        <div ref={ctasRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {NOT_FOUND_LINK_HOME}
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {NOT_FOUND_LINK_PORTFOLIO}
          </Link>
        </div>
      </main>
    </>
  );
};
