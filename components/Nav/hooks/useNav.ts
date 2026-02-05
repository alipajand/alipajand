"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";

export interface NavSelectors {
  isScrolled: boolean;
  isMobileOpen: boolean;
  navLinksRef: RefObject<HTMLUListElement | null>;
  mobileMenuRef: RefObject<HTMLDivElement | null>;
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navLinksRef = useRef<HTMLUListElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
    const links = navLinksRef.current?.querySelectorAll("a");
    if (!links?.length) return;
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
    if (isMobileOpen) {
      gsap.fromTo(
        menu,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      const items = menu.querySelectorAll("a");
      gsap.fromTo(
        items,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.25, stagger: 0.05, delay: 0.1 }
      );
    } else {
      gsap.to(menu, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
    }
  }, [isMobileOpen]);

  const handleToggleMenu = () => setIsMobileOpen((prev) => !prev);
  const handleCloseMenu = () => setIsMobileOpen(false);

  return {
    selectors: { isScrolled, isMobileOpen, navLinksRef, mobileMenuRef },
    actions: { handleToggleMenu, handleCloseMenu },
  };
}
