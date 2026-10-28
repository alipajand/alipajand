import styles from "components/hairline/DecisionCard/DecisionCard.module.css";

export interface DecisionCardLabels {
  decision: string;
  why: string;
  tradeOff: string;
  result: string;
}

interface DecisionCardProps {
  index: number;
  decision: string;
  why: string;
  tradeOff: string;
  result: string;
  labels: DecisionCardLabels;
}

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const DecisionCard = ({
  index,
  decision,
  why,
  tradeOff,
  result,
  labels,
}: DecisionCardProps) => (
  <article className={styles.card}>
    <div className={styles.head}>
      <span className={styles.label}>
        {labels.decision} {pad(index)}
      </span>
      <p>{decision}</p>
    </div>
    <dl className={styles.details}>
      <div>
        <dt>{labels.why}</dt>
        <dd>{why}</dd>
      </div>
      <div>
        <dt>{labels.tradeOff}</dt>
        <dd>{tradeOff}</dd>
      </div>
      <div>
        <dt>{labels.result}</dt>
        <dd>{result}</dd>
      </div>
    </dl>
  </article>
);
