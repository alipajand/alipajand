import type { ReactNode } from "react";

import styles from "components/hairline/Frame/Frame.module.css";

interface FrameProps {
  children: ReactNode;
}

export const Frame = ({ children }: FrameProps) => (
  <div className={styles.frame}>
    <div className={styles.shell}>{children}</div>
  </div>
);
