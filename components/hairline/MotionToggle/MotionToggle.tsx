"use client";

import styles from "components/hairline/MotionToggle/MotionToggle.module.css";
import { MOTION_PAUSE_LABEL, MOTION_REDUCED_LABEL, MOTION_RESUME_LABEL } from "data/pageChrome";
import { setMotionPaused, useMotionPaused } from "utils/motion/motionPreference";
import { useReducedMotion } from "utils/motion/reducedMotion";

const LABELS = [MOTION_PAUSE_LABEL, MOTION_RESUME_LABEL, MOTION_REDUCED_LABEL];

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
