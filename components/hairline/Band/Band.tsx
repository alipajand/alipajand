import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "components/hairline/Band/Band.module.css";

interface BandProps extends Omit<ComponentPropsWithoutRef<"section">, "className"> {
  children: ReactNode;
}

export const Band = ({ children, ...sectionProps }: BandProps) => (
  <section className={styles.band} {...sectionProps}>
    <div className={styles.inner}>{children}</div>
  </section>
);
