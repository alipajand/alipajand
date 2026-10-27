import styles from "features/not-found/NotFoundMessage.module.css";
import {
  NOT_FOUND_CODE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_KEYBOARD_TIP,
  NOT_FOUND_STATUS_LABEL,
  NOT_FOUND_TITLE,
  NOT_FOUND_TITLE_ID,
} from "data/notFound";

/** The status line, the page title, what happened and the keyboard tip. */
export const NotFoundMessage = () => (
  <section className={styles.message} aria-labelledby={NOT_FOUND_TITLE_ID}>
    <p className={styles.status}>
      {NOT_FOUND_STATUS_LABEL} · {NOT_FOUND_CODE}
    </p>
    <h1 id={NOT_FOUND_TITLE_ID} className={styles.title}>
      {NOT_FOUND_TITLE}
    </h1>
    <p className={styles.description}>{NOT_FOUND_DESCRIPTION}</p>
    <p className={styles.tip}>{NOT_FOUND_KEYBOARD_TIP}</p>
  </section>
);
