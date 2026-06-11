export const EASE = {
  smooth: "power3.out",
  snap: "power4.out",
  spring: "back.out(1.4)",
  elastic: "elastic.out(1, 0.45)",
  in: "power2.in",
  linear: "none",
} as const;

export const DUR = {
  xs: 0.2,
  sm: 0.4,
  md: 0.6,
  lg: 0.85,
  xl: 1.4,
} as const;

export const STAGGER = {
  chars: 0.028,
  tight: 0.05,
  normal: 0.09,
  loose: 0.14,
} as const;
