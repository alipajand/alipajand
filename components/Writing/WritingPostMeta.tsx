import { formatDate } from "utils/date";

interface WritingPostMetaProps {
  date: string;
  tags?: string[];
}

export function WritingPostMeta({ date, tags }: WritingPostMetaProps) {
  return (
    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-muted">
      <time dateTime={date} className="font-medium tabular-nums">
        {formatDate(date)}
      </time>
      {tags && tags.length > 0 ? (
        <>
          <span className="text-border select-none" aria-hidden>
            ·
          </span>
          <span className="text-[13px] sm:text-sm text-muted/90">{tags.join(" · ")}</span>
        </>
      ) : null}
    </div>
  );
}
