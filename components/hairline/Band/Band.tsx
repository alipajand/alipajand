import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "components/hairline/Band/Band.module.css";

interface BandProps extends Omit<ComponentPropsWithoutRef<"section">, "className"> {
  children: ReactNode;
}

/**
 * The one light surface. It breaks out of the frame to both screen edges while staying inside the
 * column's container, so sticky elements above it keep working, and it redefines the surface tones
 * so labels and hairlines inside read on bone.
 */
export const Band = ({ children, ...sectionProps }: BandProps) => (
  <section className={styles.band} {...sectionProps}>
    <div className={styles.inner}>{children}</div>
  </section>
);
