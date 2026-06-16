"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { usePathname } from "next/navigation";

import { prefersReducedMotion } from "utils/gsap";

export interface NavSelectors {
  isScrolled: boolean;
  isMobileOpen: boolean;
  pathname: string;
  navLinksRef: RefObject<HTMLUListElement | null>;
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

const SCROLL_THRESHOLD = 48;

export function useNav(): NavHook {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navLinksRef = useRef<HTMLUListElement>(null);
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
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  useEffect(() => {
    const links = navLinksRef.current?.querySelectorAll("a");
    if (!links?.length) return;

    if (prefersReducedMotion()) {
      gsap.set(links, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(links, { opacity: 0, y: -8 });
    gsap.to(links, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      delay: 0.3,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    const items = menu.querySelectorAll("a");

    if (prefersReducedMotion()) {
      if (isMobileOpen) {
        gsap.set(menu, { height: "auto", opacity: 1 });
        gsap.set(items, { opacity: 1, x: 0 });
      } else {
        gsap.set(menu, { height: 0, opacity: 0 });
      }
      return;
    }

    if (isMobileOpen) {
      gsap.fromTo(
        menu,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        items,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.25, stagger: 0.05, delay: 0.1 }
      );
    } else {
      gsap.to(menu, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
  }, [isMobileOpen]);

  const handleToggleMenu = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  return {
    selectors: { isScrolled, isMobileOpen, pathname, navLinksRef, mobileMenuRef, menuButtonRef },
    actions: { handleToggleMenu, handleCloseMenu },
  };
}
