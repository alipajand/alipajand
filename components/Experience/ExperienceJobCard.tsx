import { ExperienceJobHighlight } from "components/Experience/ExperienceJobHighlight";
import type { Job } from "data/jobs";

interface ExperienceJobCardProps {
  job: Job;
}

export function ExperienceJobCard({ job }: ExperienceJobCardProps) {
  return (
    <li className="relative pl-10 sm:pl-12 pb-16 last:pb-0">
      <div
        className="absolute left-0 top-1.5 w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full border-2 border-border bg-background flex items-center justify-center"
        aria-hidden
      >
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-foreground/60" />
      </div>
      <article
        data-experience-card
        className="experience-card group rounded-xl border border-border bg-card/50 p-6 sm:p-8 transition-all duration-300 hover:border-foreground/20 hover:bg-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
              {job.role}
            </h3>
            <p className="font-medium mt-0.5 text-foreground/70">{job.company}</p>
          </div>
          <span className="inline-flex items-center shrink-0 text-muted text-sm font-medium tabular-nums">
            {job.period}
          </span>
        </div>
        <ul className="space-y-1 list-none pl-0">
          {job.highlights.map((h, j) => (
            <ExperienceJobHighlight key={j}>{h}</ExperienceJobHighlight>
          ))}
        </ul>
      </article>
    </li>
  );
}
