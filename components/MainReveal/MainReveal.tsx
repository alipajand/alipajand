"use client";

import type { ReactNode } from "react";

export function MainReveal({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
