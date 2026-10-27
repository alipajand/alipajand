import styles from "components/hairline/Diagram/Diagram.module.css";

export const padIndex = (index: number) => String(index + 1).padStart(2, "0");

interface DiagramHeadProps {
  title: string;
  label?: string;
}

/** "[ Diagram ]" on the left, the diagram's title on the right. */
export const DiagramHead = ({ title, label = "Diagram" }: DiagramHeadProps) => (
  <figcaption className={styles.head}>
    <span>[ {label} ]</span>
    <span>{title}</span>
  </figcaption>
);

export const DiagramCaption = ({ caption }: { caption?: string }) =>
  caption ? <p className={styles.caption}>{caption}</p> : null;

export const diagramFigureClass = styles.figure;
