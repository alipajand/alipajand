import type { PropsWithChildren } from "react";

export function MainReveal({ children }: PropsWithChildren) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      {children}
    </main>
  );
}
