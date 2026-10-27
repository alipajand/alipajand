import type { ReactNode } from "react";

import styles from "components/hairline/Frame/Frame.module.css";

interface FrameProps {
  children: ReactNode;
}

/**
 * The page frame: a safe-area gutter around one bordered column. The column is the inline-size
 * container that display type measures against with `cqi` units.
 */
export const Frame = ({ children }: FrameProps) => (
  <div className={styles.frame}>
    <div className={styles.shell}>{children}</div>
  </div>
);
