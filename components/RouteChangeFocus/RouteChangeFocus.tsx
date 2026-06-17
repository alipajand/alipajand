"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { scrollToHashElement } from "utils/hashScroll";

export const RouteChangeFocus = () => {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelScroll: (() => void) | undefined;

    const handleRouteScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        cancelScroll = scrollToHashElement(hash);
        return;
      }

      const main = document.getElementById("main-content");
      main?.focus({ preventScroll: true });
      main?.scrollIntoView({ block: "start" });
    };

    const frame = window.requestAnimationFrame(handleRouteScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      cancelScroll?.();
    };
  }, [pathname]);

  useEffect(() => {
    let cancelScroll: (() => void) | undefined;

    const onHashChange = () => {
      cancelScroll?.();
      const hash = window.location.hash;
      if (!hash) return;
      cancelScroll = scrollToHashElement(hash);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      cancelScroll?.();
    };
  }, []);

  return null;
};
