"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

/** Width at which the primary links no longer fit on one row and fold behind the menu button. */
export const SITE_MENU_QUERY = "(max-width: 520px)";

export interface SiteMenu {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

/**
 * A non-modal disclosure for the primary links on narrow screens. Escape closes it and returns
 * focus to the button; it also closes on route change and when the viewport grows past the
 * breakpoint, so a rotated phone never keeps a stale open menu.
 */
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
