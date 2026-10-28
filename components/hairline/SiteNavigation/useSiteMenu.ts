"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

export const SITE_MENU_QUERY = "(max-width: 520px)";

export interface SiteMenu {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useSiteMenu = (
  pathname: string,
  buttonRef: RefObject<HTMLButtonElement | null>
): SiteMenu => {
  const [isOpen, setIsOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState<string | null>(null);

  // Closing on navigation is derived from the pathname instead of synchronised in an effect.
  const open = isOpen && openedAt === pathname;

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    setOpenedAt(pathname);
    setIsOpen((previous) => !previous);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, buttonRef]);

  useEffect(() => {
    if (!open || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(SITE_MENU_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setIsOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  return { isOpen: open, toggle, close };
};
