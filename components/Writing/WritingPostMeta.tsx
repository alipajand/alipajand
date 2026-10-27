import { formatDate } from "utils/date";

interface WritingPostMetaProps {
  date: string;
  tags?: string[];
}

export const WritingPostMeta = ({ date, tags }: WritingPostMetaProps) => {
  return (
    <div>
      <time dateTime={date}>{formatDate(date)}</time>
      {tags && tags.length > 0 ? (
        <ul aria-label="Post tags">
          {tags.map((tag) => (
            <li key={tag}>
              <span>{tag}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
