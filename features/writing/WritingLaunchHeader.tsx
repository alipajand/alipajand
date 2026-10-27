import styles from "features/writing/WritingLaunchHeader.module.css";
import { titleFitStyle } from "features/writing/titleFit";
import {
  WRITING_ARTICLE_PUBLISHED,
  WRITING_ARTICLE_SUMMARY,
  WRITING_ARTICLE_TOPICS,
} from "data/writing";
import { formatDate } from "utils/date";

interface WritingLaunchHeaderProps {
  titleId: string;
  title: string;
  excerpt: string;
  date: string;
  tags: readonly string[];
}

/** The launch article's wide display title over a boxed row of date, topics and summary. */
export const WritingLaunchHeader = ({
  titleId,
  title,
  excerpt,
  date,
  tags,
}: WritingLaunchHeaderProps) => (
  <header>
    <div className={styles.titleBox}>
      <h1 id={titleId} className={styles.title} style={titleFitStyle(title, "launch")}>
        {title}
      </h1>
    </div>
    <dl className={styles.meta}>
      <div>
        <dt>{WRITING_ARTICLE_PUBLISHED}</dt>
        <dd>
          <time dateTime={date}>{formatDate(date)}</time>
        </dd>
      </div>
      <div>
        <dt>{WRITING_ARTICLE_TOPICS}</dt>
        <dd>{tags.join(" · ")}</dd>
      </div>
      <div>
        <dt>{WRITING_ARTICLE_SUMMARY}</dt>
        <dd className={styles.dek}>{excerpt}</dd>
      </div>
    </dl>
  </header>
);
