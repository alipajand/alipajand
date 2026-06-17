"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";
import { DUR, EASE } from "utils/motion";

const parseValue = (
  value: string
): {
  num: number;
  prefix: string;
  suffix: string;
} | null => {
  const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
  if (!match || match[2] === undefined) return null;
  return {
    num: parseInt(match[2], 10),
    prefix: match[1] ?? "",
    suffix: match[3] ?? "",
  };
};

export const useCountUp = (value: string) => {
  const ref = useRef<HTMLElement>(null);
  const parsed = parseValue(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed || prefersReducedMotion()) return;

    registerGSAPPlugins();

    const { num, prefix, suffix } = parsed;
    const counter = { val: 0 };

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: num,
          duration: DUR.xl,
          ease: EASE.smooth,
          onUpdate() {
            if (el) {
              el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
            }
          },
          onComplete() {
            if (el) el.textContent = `${prefix}${num}${suffix}`;
          },
        });
      },
    });

    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { ref, hasParsed: parsed !== null };
};
