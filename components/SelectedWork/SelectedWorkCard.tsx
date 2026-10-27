import Image from "next/image";
import Link from "next/link";

import { ProjectCardBadge } from "components/Projects/ProjectCardBadge";
import type { HomepageCaseStudy } from "data/homepage";
import { SELECTED_WORK_CARD_CTA, SELECTED_WORK_CARD_CTA_SR } from "data/selectedWork";

export const SelectedWorkCard = ({ caseStudy }: { caseStudy: HomepageCaseStudy }) => {
  return (
    <article>
      <div>
        <p>{caseStudy.label}</p>
        <h3>{caseStudy.title}</h3>
        <p>{caseStudy.summary}</p>
        {caseStudy.supportingLine ? <p>{caseStudy.supportingLine}</p> : null}
      </div>

      {caseStudy.image ? (
        <figure>
          <div>
            <Image
              src={caseStudy.image.src}
              alt={caseStudy.image.alt}
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {caseStudy.image.caption ? <figcaption>{caseStudy.image.caption}</figcaption> : null}
        </figure>
      ) : (
        <figure>
          <div>
            <div>
              <span>{caseStudy.illustrativeLabel}</span>
              {caseStudy.illustrativeBody ? <p>{caseStudy.illustrativeBody}</p> : null}
            </div>
          </div>
          <figcaption>{caseStudy.illustrativeLabel}</figcaption>
        </figure>
      )}

      <ul aria-label={`${caseStudy.title} tags`}>
        {caseStudy.tags.map((tag) => (
          <ProjectCardBadge key={tag}>{tag}</ProjectCardBadge>
        ))}
      </ul>

      <div>
        <Link
          href={caseStudy.href}
          aria-label={`${SELECTED_WORK_CARD_CTA}${SELECTED_WORK_CARD_CTA_SR}`}
        >
          {SELECTED_WORK_CARD_CTA}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
};
