"use client";

import { useScrollReveal } from "utils/hooks/useScrollReveal";

export function Footer() {
  const {
    selectors: { sectionRef },
  } = useScrollReveal({ y: 16, stagger: 0.1 });

  return (
    <footer ref={sectionRef} className="px-6 sm:px-10 lg:px-20 py-8 border-t border-border">
      <div className="max-w-4xl" data-reveal>
        <p className="text-muted text-sm" data-reveal>
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
