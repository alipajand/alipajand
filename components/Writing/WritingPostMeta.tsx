import { formatDate } from "utils/date";

interface WritingPostMetaProps {
  date: string;
  tags?: string[];
}

export function WritingPostMeta({ date, tags }: WritingPostMetaProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
      <time dateTime={date} className="font-medium tabular-nums">
        {formatDate(date)}
      </time>
      {tags && tags.length > 0 ? (
        <ul aria-label="Post tags" className="flex flex-wrap gap-1.5 list-none p-0 m-0">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center rounded border border-border/80 bg-background/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
