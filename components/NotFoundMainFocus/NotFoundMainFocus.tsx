"use client";

import { useEffect } from "react";

export function NotFoundMainFocus() {
  useEffect(() => {
    const el = document.getElementById("main-content");
    el?.focus();
  }, []);

  return null;
}
