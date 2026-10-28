"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { scrollToHashElement } from "utils/hashScroll";
import { scrollToTop } from "utils/scrollToTop";

export const RouteChangeFocus = () => {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  // The path a Back/Forward step is going to, so the route change it causes keeps the browser's
  // restored scroll position instead of jumping to the top.
  const traversalPath = useRef<string | null>(null);

  useEffect(() => {
    const onPopState = () => {
      traversalPath.current = window.location.pathname;
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const isTraversal = traversalPath.current === pathname;
    traversalPath.current = null;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelScroll: (() => void) | undefined;
    const isPortfolioIndex = pathname === "/portfolio";

    const handleRouteScroll = () => {
      const main = document.getElementById("main-content");
      if (isTraversal) {
        main?.focus({ preventScroll: true });
        return;
      }

      scrollToTop();

      const hash = window.location.hash;
      if (hash && !isPortfolioIndex) {
        cancelScroll = scrollToHashElement(hash);
        return;
      }

      main?.focus({ preventScroll: true });
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
      if (!hash || window.location.pathname === "/portfolio") return;
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
