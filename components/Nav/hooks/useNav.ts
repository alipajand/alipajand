"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export interface NavSelectors {
  isMobileOpen: boolean;
  pathname: string;
  mobileMenuRef: RefObject<HTMLDivElement | null>;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}

export interface NavActions {
  handleToggleMenu: () => void;
  handleCloseMenu: () => void;
}

export interface NavHook {
  selectors: NavSelectors;
  actions: NavActions;
}

export const useNav = (): NavHook => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const prevMobileOpen = useRef(false);
  const previousPathname = useRef(pathname);

  const handleCloseMenu = useCallback(() => setIsMobileOpen(false), []);

  useEffect(() => {
    if (previousPathname.current !== pathname && isMobileOpen) {
      handleCloseMenu();
    }
    previousPathname.current = pathname;
  }, [handleCloseMenu, isMobileOpen, pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const inertTargets = [
      document.getElementById("main-content"),
      document.querySelector("footer"),
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (isMobileOpen) {
      inertTargets.forEach((element) => element.setAttribute("inert", ""));
    } else {
      inertTargets.forEach((element) => element.removeAttribute("inert"));
    }

    return () => {
      inertTargets.forEach((element) => element.removeAttribute("inert"));
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  useEffect(() => {
    if (isMobileOpen && !prevMobileOpen.current) {
      queueMicrotask(() => {
        mobileMenuRef.current
          ?.querySelector<HTMLElement>(
            "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
          )
          ?.focus();
      });
    }
    if (!isMobileOpen && prevMobileOpen.current) {
      queueMicrotask(() => menuButtonRef.current?.focus());
    }
    prevMobileOpen.current = isMobileOpen;
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const getFocusable = () => {
      const menu = mobileMenuRef.current;
      if (!menu) return [];
      const menuItems = Array.from(
        menu.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
        )
      ).filter(
        (element) =>
          !element.hasAttribute("inert") && element.getAttribute("aria-hidden") !== "true"
      );
      const button = menuButtonRef.current;
      return button ? [button, ...menuItems] : menuItems;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      } else if (!focusable.includes(active as HTMLElement)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileOpen]);

  const handleToggleMenu = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  return {
    selectors: { isMobileOpen, pathname, mobileMenuRef, menuButtonRef },
    actions: { handleToggleMenu, handleCloseMenu },
  };
};
