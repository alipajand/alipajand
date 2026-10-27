import { NotFoundMainFocus } from "components/NotFoundMainFocus/NotFoundMainFocus";
import { NotFoundMessage } from "features/not-found/NotFoundMessage";
import styles from "features/not-found/NotFoundPageContent.module.css";
import { NotFoundRoute } from "features/not-found/NotFoundRoute";
import { NotFoundWays } from "features/not-found/NotFoundWays";
import { NOT_FOUND_CODE, NOT_FOUND_TITLE_ID } from "data/notFound";

/**
 * The 404 page: the status code over a route with one missing segment, then the message and two
 * boxed ways back. Focus moves into the main region on load so keyboard users start beside the links.
 */
export const NotFoundPageContent = () => (
  <>
    <NotFoundMainFocus />
    <NotFoundRoute code={NOT_FOUND_CODE} />
    <main
      id="main-content"
      tabIndex={-1}
      className={styles.main}
      aria-labelledby={NOT_FOUND_TITLE_ID}
    >
      <NotFoundMessage />
      <NotFoundWays />
    </main>
  </>
);
