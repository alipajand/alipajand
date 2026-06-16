"use client";

import type { PropsWithChildren } from "react";

export const MainReveal = ({ children }: PropsWithChildren) => {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      {children}
    </main>
  );
};
