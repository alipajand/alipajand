import { LitList } from "components/hairline/LitList/LitList";
import styles from "features/now/NowSnapshot.module.css";
import { NowSectionBlock } from "features/now/NowSectionBlock";
import type { NowSection } from "data/now";

interface NowSnapshotProps {
  sections: readonly NowSection[];
}

export const NowSnapshot = ({ sections }: NowSnapshotProps) => (
  <LitList className={styles.cells} window={0.5}>
    {sections.map((section, index) => (
      <NowSectionBlock key={section.id} section={section} position={index + 1} />
    ))}
  </LitList>
);
