"use client";

import { useRef } from "react";

import styles from "features/writing/WritingLaunchScene.module.css";
import { ARD_SCENE } from "data/writing";
import { clamp } from "utils/motion/canvas";
import { useMotion } from "utils/motion/useMotion";

const STEP_COUNT = 3;

export const launchSceneStep = (t: number): 1 | 2 | 3 => (t < 0.3 ? 1 : t < 0.64 ? 2 : 3);

const stepLabel = (step: number) => `0${step} / 0${STEP_COUNT}`;

export const WritingLaunchScene = () => {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, ({ element, reducedMotion }) => {
    const wires = element.querySelector<SVGSVGElement>("[data-wires]");
    const counter = element.querySelector<HTMLElement>("[data-scene-n]");
    const marks = Array.from(element.querySelectorAll<HTMLElement>("[data-mark]"));
    const guideRows = Array.from(element.querySelectorAll<HTMLElement>("[data-guide-row]"));
    const repoRows = Array.from(element.querySelectorAll<HTMLElement>("[data-repo-row]"));
    if (!wires || !counter) return;

    const drawWires = () => {
      const box = wires.getBoundingClientRect();
      if (!box.width) return;
      wires.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      Array.from(wires.children).forEach((path, index) => {
        const guide = guideRows[index]?.getBoundingClientRect();
        const repo = repoRows[index]?.getBoundingClientRect();
        if (!guide || !repo) return;
        const y1 = guide.top + guide.height / 2 - box.top;
        const y2 = repo.top + repo.height / 2 - box.top;
        const mx = box.width / 2;
        path.setAttribute("d", `M0 ${y1} C${mx} ${y1} ${mx} ${y2} ${box.width} ${y2}`);
        if (marks[index]) marks[index].style.top = `${(y1 + y2) / 2}px`;
      });
    };

    const setStep = (step: number) => {
      if (element.dataset.step === String(step)) return;
      element.dataset.step = String(step);
      counter.textContent = stepLabel(step);
      drawWires();
    };

    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) drawWires();
    });

    if (reducedMotion) {
      setStep(STEP_COUNT);
      return {
        onResize: drawWires,
        destroy: () => {
          cancelled = true;
        },
      };
    }

    element.setAttribute("data-ready", "");
    return {
      onResize: drawWires,
      onScroll: ({ vh }) => {
        const box = element.getBoundingClientRect();
        setStep(launchSceneStep(clamp(-box.top / Math.max(1, box.height - vh), 0, 1)));
      },
      destroy: () => {
        cancelled = true;
        element.removeAttribute("data-ready");
        setStep(STEP_COUNT);
      },
    };
  });

  const { guide, repo } = ARD_SCENE;

  return (
    <section ref={ref} className={styles.scene} data-step={STEP_COUNT} aria-label={ARD_SCENE.label}>
      <div className={styles.stick}>
        <ol className={styles.steps}>
          {ARD_SCENE.steps.map((step) => (
            <li key={step.eyebrow}>
              <span>{step.eyebrow}</span>
              <b>{step.title}</b>
            </li>
          ))}
        </ol>
        <div className={styles.stage}>
          <div className={`${styles.panel} ${styles.guide}`}>
            <div className={styles.panelHead}>
              <span>{guide.title}</span>
              <span>{guide.kind}</span>
            </div>
            {guide.rows.map((row, index) => (
              <div key={row.label} className={styles.row} data-guide-row="">
                <span className={styles.n}>{`0${index + 1}`}</span>
                <span className={styles.diff}>
                  {row.label} <span className={styles.stale}>{row.before}</span>
                  <del className={styles.del}>{row.before}</del>
                  <ins className={styles.add}>{row.after}</ins>
                </span>
              </div>
            ))}
            <div className={styles.status}>
              {guide.status.map((status, index) => (
                <span key={status} data-s={index + 1}>
                  {status}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.links} aria-hidden="true">
            <svg data-wires="">
              <path />
              <path />
            </svg>
            <span className={styles.x} data-mark="">
              ×
            </span>
            <span className={styles.x} data-mark="">
              ×
            </span>
          </div>
          <div className={`${styles.panel} ${styles.repo}`}>
            <div className={styles.panelHead}>
              <span>{repo.title}</span>
              <span>{repo.kind}</span>
            </div>
            {repo.rows.map((row, index) => (
              <div key={row.note} className={styles.row} data-repo-row="">
                <span className={styles.n}>{`0${index + 1}`}</span>
                <span>
                  <span className={styles.val}>
                    <span className={styles.old}>{row.before}</span>
                    <span className={styles.new}>{row.after}</span>
                  </span>
                  <small>{row.note}</small>
                </span>
              </div>
            ))}
            <div className={styles.status}>
              {repo.status.map((status, index) => (
                <span key={`${status}-${index}`} data-s={index + 1}>
                  {status}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.foot}>
          <span>{ARD_SCENE.footnote}</span>
          <span data-scene-n="">{stepLabel(STEP_COUNT)}</span>
        </div>
      </div>
    </section>
  );
};
