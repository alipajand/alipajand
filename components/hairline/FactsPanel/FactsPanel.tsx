import type { ReactNode } from "react";

import styles from "components/hairline/FactsPanel/FactsPanel.module.css";

export interface Fact {
  term: string;
  detail: ReactNode;
}

interface FactsPanelProps {
  facts: readonly Fact[];
  stacked?: boolean;
}

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
