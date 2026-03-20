"use client";

import type { ReactNode } from "react";

/** Wraps home content; keeps layout height without decorative entrance motion. */
export function MainReveal({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
