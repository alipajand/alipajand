"use client";

import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { onScrollFrame } from "utils/cinematic";
import { SCROLL_TARGET_OFFSET, scrollToElement } from "utils/scrollToTop";

/** How long scroll-spy defers to a heading the reader just clicked. */
const CLICK_LOCK_MS = 1200;

export const findActiveHeadingId = (ids: string[]): string | null => {
  const doc = document.documentElement;
  const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
  if (atBottom && ids.length > 0 && window.scrollY > 0) return ids[ids.length - 1];

  let active: string | null = null;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= SCROLL_TARGET_OFFSET + 16) active = id;
    else break;
  }
  return active;
};

export const useActiveHeading = (
  ids: string[]
): {
  selectors: { activeId: string | null };
  actions: { handleNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void };
} => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const lockedUntil = useRef(0);
  const idsKey = ids.join("|");

  useEffect(() => {
    const list = idsKey ? idsKey.split("|") : [];
    if (list.length === 0) return;
    return onScrollFrame(() => {
      if (Date.now() < lockedUntil.current) return;
      setActiveId(findActiveHeadingId(list));
    });
  }, [idsKey]);

  const handleNavigate = useCallback((event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();

    lockedUntil.current = Date.now() + CLICK_LOCK_MS;
    setActiveId(id);
    scrollToElement(target);
    window.history.replaceState(null, "", `#${id}`);

    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, []);

  return { selectors: { activeId }, actions: { handleNavigate } };
};
