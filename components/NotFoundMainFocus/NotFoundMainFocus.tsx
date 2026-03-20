"use client";

import { useEffect } from "react";

/**
 * Moves keyboard focus to `#main-content` on 404 so users land in the landmark
 * after following a bad link (pairs with skip-link + `tabIndex={-1}` on `<main>`).
 */
export function NotFoundMainFocus() {
  useEffect(() => {
    const el = document.getElementById("main-content");
    el?.focus();
  }, []);

  return null;
}
