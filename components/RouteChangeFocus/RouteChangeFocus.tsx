"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function RouteChangeFocus() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const focusMain = () => {
      const main = document.getElementById("main-content");
      main?.focus({ preventScroll: true });
      main?.scrollIntoView({ block: "start" });
    };

    const frame = window.requestAnimationFrame(focusMain);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
