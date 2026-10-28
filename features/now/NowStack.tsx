import { Band } from "components/hairline/Band/Band";
import { Tags } from "components/hairline/Tags/Tags";
import styles from "features/now/NowStack.module.css";
import { NowStackTicker } from "features/now/NowStackTicker";
import { type NowSection, nowStackCountLabel } from "data/now";

interface NowStackProps {
  section: NowSection;
  position: number;
}

export const NowStack = ({ section, position }: NowStackProps) => {
  const tools = section.items.join(" · ").split(" · ");
  const headingId = `now-${section.id}-heading`;

  return (
    <Band id={section.id} aria-labelledby={headingId}>
      <div className={styles.stackHead}>
        <h2 id={headingId} className={styles.stackTitle}>
          {section.title}
        </h2>
        <span className={styles.stackCount}>{nowStackCountLabel(position, tools.length)}</span>
      </div>
      <NowStackTicker items={tools} />
      <div className={styles.stackList}>
        <Tags tags={tools} />
      </div>
    </Band>
  );
};
