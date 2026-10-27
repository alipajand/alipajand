"use client";

import styles from "components/hairline/MotionToggle/MotionToggle.module.css";
import { MOTION_PAUSE_LABEL, MOTION_REDUCED_LABEL, MOTION_RESUME_LABEL } from "data/pageChrome";
import { setMotionPaused, useMotionPaused } from "utils/motion/motionPreference";
import { useReducedMotion } from "utils/motion/reducedMotion";

const LABELS = [MOTION_PAUSE_LABEL, MOTION_RESUME_LABEL, MOTION_REDUCED_LABEL];

/**
 * Every label shares one grid cell and only the current one is visible, so the control keeps its
 * width when the label flips or when hydration swaps the server's default for the real state. The
 * others are hidden from assistive technology and from the accessible name.
 */
const Label = ({ current }: { current: string }) => (
  <span className={styles.label}>
    {LABELS.map((label) =>
      label === current ? (
        <span key={label}>{label}</span>
      ) : (
        <span key={label} className={styles.sizer} aria-hidden="true">
          {label}
        </span>
      )
    )}
  </span>
);

/**
 * Pauses automatic motion site-wide (WCAG 2.2.2): the status-dot blink and any idle frame loop.
 * Scroll- and pointer-driven motion keeps working.
 *
 * The visible label names the action ("Pause…" / "Resume…") and is the button's whole accessible
 * name, so there is no `aria-pressed`: a changing label plus a pressed state would announce the
 * state twice and contradict itself ("Resume automatic motion, pressed").
 *
 * While the operating system asks for reduced motion, automatic motion is off whatever this choice
 * says, so the control becomes a plain status line. The stored choice is kept for later.
 */
export const MotionToggle = () => {
  const paused = useMotionPaused();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <span className={styles.status} data-motion-control="reduced">
        <span className={styles.mark} aria-hidden="true" data-state="off" />
        <Label current={MOTION_REDUCED_LABEL} />
      </span>
    );
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      data-motion-control={paused ? "paused" : "running"}
      onClick={() => setMotionPaused(!paused)}
    >
      <span className={styles.mark} aria-hidden="true" data-state={paused ? "paused" : "running"} />
      <Label current={paused ? MOTION_RESUME_LABEL : MOTION_PAUSE_LABEL} />
    </button>
  );
};
