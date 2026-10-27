import { DisplayWord } from "components/hairline/DisplayWord/DisplayWord";
import styles from "features/now/NowDisplay.module.css";
import { NOW_PAGE_TITLE } from "data/now";

interface NowDisplayProps {
  year: number;
}

/** The page title as the display line: "Now", the spark, then the current year. */
export const NowDisplay = ({ year }: NowDisplayProps) => (
  <div className={styles.display}>
    <DisplayWord
      words={[NOW_PAGE_TITLE, String(year)]}
      as="h1"
      variant="hero"
      motion="scroll"
      reach={0.42}
    />
  </div>
);
