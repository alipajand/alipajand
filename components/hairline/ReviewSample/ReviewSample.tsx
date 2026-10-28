"use client";

import { useId, useState } from "react";

import {
  DiagramCaption,
  diagramFigureClass,
  DiagramHead,
} from "components/hairline/Diagram/Diagram";
import styles from "components/hairline/ReviewSample/ReviewSample.module.css";
import type { ReviewSample as ReviewSampleData, ReviewSampleContract } from "data/projects";

interface ReviewSampleProps extends ReviewSampleData {
  label?: string;
  countedLabel?: string;
  pendingLabel?: string;
  contractsLabel?: string;
  termsLabel?: string;
  sourceLabel?: string;
  confirmedLabel?: string;
  suggestedLabel?: string;
  resetLabel?: string;
}

const key = (contractId: string, termId: string) => `${contractId}:${termId}`;

const initiallyConfirmed = (contracts: ReviewSampleContract[]) =>
  new Set(
    contracts.flatMap((contract) =>
      contract.terms.filter((t) => t.status === "confirmed").map((t) => key(contract.id, t.id))
    )
  );

const firstTermId = (contract: ReviewSampleContract, confirmed: Set<string>) =>
  (contract.terms.find((t) => !confirmed.has(key(contract.id, t.id))) ?? contract.terms[0]).id;

const startContract = (contracts: ReviewSampleContract[], confirmed: Set<string>) =>
  contracts.find((c) => c.terms.some((t) => !confirmed.has(key(c.id, t.id)))) ?? contracts[0];

export const ReviewSample = ({
  title,
  caption,
  currency,
  contracts,
  label = "Interactive sample",
  countedLabel = "Counted in totals",
  pendingLabel = "Not counted until confirmed",
  contractsLabel = "Contracts",
  termsLabel = "Extracted terms",
  sourceLabel = "Source",
  confirmedLabel = "Confirmed",
  suggestedLabel = "Suggested",
  resetLabel = "Reset sample",
}: ReviewSampleProps) => {
  const id = useId();
  const [confirmed, setConfirmed] = useState(() => initiallyConfirmed(contracts));
  const [contractId, setContractId] = useState(() => startContract(contracts, confirmed).id);
  const [termId, setTermId] = useState(() =>
    firstTermId(startContract(contracts, confirmed), confirmed)
  );

  const contract = contracts.find((c) => c.id === contractId) ?? contracts[0];
  const term = contract.terms.find((t) => t.id === termId) ?? contract.terms[0];
  const isConfirmed = (c: ReviewSampleContract, termKey: string) =>
    confirmed.has(key(c.id, termKey));
  const counts = (c: ReviewSampleContract) => isConfirmed(c, c.commitmentTermId);

  const money = (amount: number) => `${currency} ${amount.toLocaleString("en-US")}`;
  const total = (counted: boolean) =>
    contracts.filter((c) => counts(c) === counted).reduce((sum, c) => sum + c.annual, 0);
  const reviewed = (c: ReviewSampleContract) => c.terms.filter((t) => isConfirmed(c, t.id)).length;

  const selectContract = (next: ReviewSampleContract) => {
    setContractId(next.id);
    setTermId(firstTermId(next, confirmed));
  };

  const confirmTerm = () => {
    if (isConfirmed(contract, term.id)) return;
    setConfirmed((current) => new Set(current).add(key(contract.id, term.id)));
  };

  const reset = () => {
    const fresh = initiallyConfirmed(contracts);
    const start = startContract(contracts, fresh);
    setConfirmed(fresh);
    setContractId(start.id);
    setTermId(firstTermId(start, fresh));
  };

  const termConfirmed = isConfirmed(contract, term.id);

  return (
    <figure className={diagramFigureClass}>
      <DiagramHead title={title} label={label} />
      <div className={styles.frame}>
        <dl className={styles.totals} aria-live="polite">
          <div>
            <dt className={styles.totalLabel}>{countedLabel}</dt>
            <dd>{money(total(true))}</dd>
          </div>
          <div>
            <dt className={styles.totalLabel}>{pendingLabel}</dt>
            <dd>{money(total(false))}</dd>
          </div>
        </dl>

        <div className={styles.panes}>
          <section aria-labelledby={`${id}-contracts`}>
            <h3 id={`${id}-contracts`} className={styles.paneHead}>
              {contractsLabel}
            </h3>
            <ul className={styles.list}>
              {contracts.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={styles.row}
                    aria-pressed={c.id === contract.id}
                    onClick={() => selectContract(c)}
                  >
                    <span className={styles.rowMain}>
                      <b>{c.vendor}</b>
                      <span className={styles.meta}>{c.document}</span>
                    </span>
                    <span className={styles.rowSide}>
                      <span className={styles.amount}>{money(c.annual)}</span>
                      <span className={styles.meta}>
                        {reviewed(c)}/{c.terms.length} {confirmedLabel.toLowerCase()}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby={`${id}-terms`}>
            <h3 id={`${id}-terms`} className={styles.paneHead}>
              {termsLabel} · {contract.vendor}
            </h3>
            <ul className={styles.list}>
              {contract.terms.map((t) => {
                const done = isConfirmed(contract, t.id);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={styles.row}
                      aria-pressed={t.id === term.id}
                      onClick={() => setTermId(t.id)}
                    >
                      <span className={styles.rowMain}>
                        <span className={styles.meta}>{t.label}</span>
                        <b>{t.value}</b>
                      </span>
                      <span className={done ? styles.confirmed : styles.suggested}>
                        <span aria-hidden="true">{done ? "✓" : "–"}</span>{" "}
                        {done ? confirmedLabel : suggestedLabel}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={styles.source} aria-labelledby={`${id}-source`}>
            <h3 id={`${id}-source`} className={styles.paneHead}>
              {sourceLabel} · {term.source}
            </h3>
            <blockquote className={styles.clause}>
              <p>
                {term.clause.before}
                <mark>{term.clause.match}</mark>
                {term.clause.after}
              </p>
            </blockquote>
            <p className={styles.reading}>
              {term.label}: <b>{term.value}</b>
            </p>
            <button
              type="button"
              className={styles.confirm}
              aria-disabled={termConfirmed}
              onClick={confirmTerm}
            >
              {termConfirmed ? `✓ ${confirmedLabel}` : `Confirm ${term.label.toLowerCase()}`}
            </button>
          </section>
        </div>
      </div>
      <div className={styles.foot}>
        <DiagramCaption caption={caption} />
        <button type="button" className={styles.reset} onClick={reset}>
          {resetLabel}
        </button>
      </div>
    </figure>
  );
};
