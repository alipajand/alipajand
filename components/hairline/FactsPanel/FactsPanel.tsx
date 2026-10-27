import type { ReactNode } from "react";

import styles from "components/hairline/FactsPanel/FactsPanel.module.css";

export interface Fact {
  term: string;
  detail: ReactNode;
}

interface FactsPanelProps {
  facts: readonly Fact[];
  /** One fact per row instead of the two-column grid, for narrow columns. */
  stacked?: boolean;
}

/**
 * Boxed key facts for a case study: role, timeframe, stack. Pairs sit two across and the last fact
 * spans the full width.
 */
export const FactsPanel = ({ facts, stacked = false }: FactsPanelProps) => (
  <dl className={stacked ? `${styles.facts} ${styles.stacked}` : styles.facts}>
    {facts.map((fact) => (
      <div key={fact.term}>
        <dt>{fact.term}</dt>
        <dd>{fact.detail}</dd>
      </div>
    ))}
  </dl>
);
