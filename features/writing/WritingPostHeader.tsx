import styles from "features/writing/WritingPostHeader.module.css";
import { titleFitStyle } from "features/writing/titleFit";
import { WRITING_ARTICLE_PUBLISHED, WRITING_ARTICLE_TOPICS } from "data/writing";
import { formatShortDate } from "utils/date";

interface WritingPostHeaderProps {
  titleId: string;
  title: string;
  excerpt: string;
  date: string;
  tags: readonly string[];
}

export const WritingPostHeader = ({
  titleId,
  title,
  excerpt,
  date,
  tags,
}: WritingPostHeaderProps) => (
  <header className={styles.head}>
    <div className={styles.meta}>
      <dl>
        <div>
          <dt>{WRITING_ARTICLE_PUBLISHED}</dt>
          <dd>
            <time dateTime={date}>{formatShortDate(date)}</time>
          </dd>
        </div>
        {tags.length > 0 ? (
          <div>
            <dt>{WRITING_ARTICLE_TOPICS}</dt>
            <dd>
              <ul className={styles.tags}>
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
    <div className={styles.titleCell}>
      <h1 id={titleId} className={styles.title} style={titleFitStyle(title, "reader")}>
        {title}
      </h1>
      <p className={styles.lede}>{excerpt}</p>
    </div>
  </header>
);
