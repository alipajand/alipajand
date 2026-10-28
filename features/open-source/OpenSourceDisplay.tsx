import { DisplayWord } from "components/hairline/DisplayWord/DisplayWord";
import styles from "features/open-source/OpenSourceDisplay.module.css";
import { OPEN_SOURCE_DISPLAY_WORDS } from "data/openSourcePage";

export const OpenSourceDisplay = () => (
  <div className={styles.display} aria-hidden="true">
    <DisplayWord words={OPEN_SOURCE_DISPLAY_WORDS} variant="hero" motion="scroll" reach={0.42} />
  </div>
);
