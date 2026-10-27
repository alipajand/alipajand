"use client";

import styles from "components/hairline/MotionToggle/MotionToggle.module.css";
import { MOTION_TOGGLE_LABEL } from "data/pageChrome";
import { setMotionPaused, useMotionPaused } from "utils/motion/motionPreference";

/**
 * Pauses idle motion site-wide (WCAG 2.2.2). Scroll- and pointer-driven motion keeps working, and
 * the operating-system reduced-motion setting still stops everything on its own.
 */
export const MotionToggle = () => {
  const paused = useMotionPaused();

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={paused}
      onClick={() => setMotionPaused(!paused)}
    >
      <span className={styles.mark} aria-hidden="true" data-paused={paused || undefined} />
      {MOTION_TOGGLE_LABEL}
    </button>
  );
};
