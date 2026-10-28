import Link from "next/link";

import { Chev } from "components/hairline/Icons/Icons";
import styles from "features/writing/WritingLaunchBack.module.css";
import { WRITING_BACK_TO_INDEX } from "data/writing";

export const WritingLaunchBack = () => (
  <Link className={styles.back} href="/writing">
    {WRITING_BACK_TO_INDEX}
    <Chev />
  </Link>
);
