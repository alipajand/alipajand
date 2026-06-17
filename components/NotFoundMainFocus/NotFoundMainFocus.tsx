"use client";

import { useEffect } from "react";

export const NotFoundMainFocus = () => {
  useEffect(() => {
    const el = document.getElementById("main-content");
    el?.focus();
  }, []);

  return null;
};
