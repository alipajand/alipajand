"use client";

import { useEffect, useRef, useState } from "react";

import styles from "features/open-source/OpenSourceProjects.module.css";
import {
  OPEN_SOURCE_COPIED_LABEL,
  OPEN_SOURCE_COPY_LABEL,
  OPEN_SOURCE_SELECTED_LABEL,
  openSourceCopiedAnnouncement,
  openSourceCopyAriaLabel,
  openSourceSelectedAnnouncement,
} from "data/openSourcePage";

const RESET_MS = 1600;

interface OpenSourceCopyButtonProps {
  title: string;
  text: string;
  targetId: string;
}

export const OpenSourceCopyButton = ({ title, text, targetId }: OpenSourceCopyButtonProps) => {
  const [state, setState] = useState<"idle" | "copied" | "selected">("idle");
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const finish = (next: "copied" | "selected") => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), RESET_MS);
  };

  const select = () => {
    const target = document.getElementById(targetId);
    const selection = window.getSelection();
    if (target && selection) {
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    finish("selected");
  };

  const onClick = () => {
    try {
      navigator.clipboard.writeText(text).then(() => finish("copied"), select);
    } catch {
      select();
    }
  };

  const label =
    state === "copied"
      ? OPEN_SOURCE_COPIED_LABEL
      : state === "selected"
        ? OPEN_SOURCE_SELECTED_LABEL
        : OPEN_SOURCE_COPY_LABEL;
  const announcement =
    state === "copied"
      ? openSourceCopiedAnnouncement(title)
      : state === "selected"
        ? openSourceSelectedAnnouncement(title)
        : "";

  return (
    <>
      <button
        type="button"
        className={styles.copy}
        aria-label={openSourceCopyAriaLabel(title)}
        onClick={onClick}
      >
        {label}
      </button>
      <span className={styles.srOnly} role="status" aria-live="polite">
        {announcement}
      </span>
    </>
  );
};
