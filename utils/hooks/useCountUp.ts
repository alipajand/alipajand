"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGSAPPlugins, ScrollTrigger } from "utils/gsap";
import { DUR, EASE } from "utils/motion";

/**
 * Parses a value string into numeric and non-numeric parts.
 * e.g. "9+"  → { num: 9, prefix: "", suffix: "+" }
 * e.g. "$2M" → { num: 2, prefix: "$", suffix: "M" }
 * e.g. "Design systems" → null (no number → no count-up)
 */
function parseValue(value: string): { num: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
  if (!match || match[2] === undefined) return null;
  return {
    num: parseInt(match[2], 10),
    prefix: match[1] ?? "",
    suffix: match[3] ?? "",
  };
}

/**
 * Animates a numeric string value from 0 to its target when the element
 * enters the viewport. Returns a ref to attach to the display element.
 * Non-numeric values are left unchanged.
 */
export function useCountUp(value: string) {
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
            // Ensure exact final value
            if (el) el.textContent = `${prefix}${num}${suffix}`;
          },
        });
      },
    });

    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { ref, hasParsed: parsed !== null };
}
