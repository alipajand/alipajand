/**
 * Central motion configuration for GSAP animations across the portfolio.
 * Import from here instead of hard-coding easing/duration values.
 */

/** Curated GSAP easing presets */
export const EASE = {
  /** Default smooth deceleration — most UI motion */
  smooth: "power3.out",
  /** Stronger snap — buttons, badges, quick reveals */
  snap: "power4.out",
  /** Gentle spring — cards, panels */
  spring: "back.out(1.4)",
  /** Elastic pop — icons, attention elements */
  elastic: "elastic.out(1, 0.45)",
  /** Standard ease-in for exits */
  in: "power2.in",
  /** Linear — counters, progress bars */
  linear: "none",
} as const;

/** Duration tokens in seconds */
export const DUR = {
  /** Micro — badge/icon flash */
  xs: 0.2,
  /** Short — quick reveals */
  sm: 0.4,
  /** Standard — most reveals */
  md: 0.6,
  /** Long — full section entrances */
  lg: 0.85,
  /** Cinematic — count-ups, hero */
  xl: 1.4,
} as const;

/** Stagger presets in seconds */
export const STAGGER = {
  /** Character-level — tight text reveals */
  chars: 0.028,
  /** Tight — small badges, list items */
  tight: 0.05,
  /** Normal — cards, grid items */
  normal: 0.09,
  /** Loose — large staggered sections */
  loose: 0.14,
} as const;

/** Common initial hidden states */
export const HIDDEN = {
  fade: { opacity: 0 },
  up: { opacity: 0, y: 32 },
  upNear: { opacity: 0, y: 16 },
  upFar: { opacity: 0, y: 56 },
  scale: { opacity: 0, scale: 0.9 },
} as const;
