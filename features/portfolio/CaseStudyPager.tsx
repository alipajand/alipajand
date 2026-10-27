import { NextLinks } from "components/hairline/NextLinks/NextLinks";
import type { Project } from "data/projects";
import {
  PROJECT_PAGER_ARIA_LABEL,
  PROJECT_PAGER_INDEX_EYEBROW,
  PROJECT_PAGER_NEXT_EYEBROW,
  PROJECT_SECTION_LINK_BACK,
} from "data/projectsUi";

/** Back to the index, and on to the next case study in portfolio order when there is one. */
export const CaseStudyPager = ({ nextProject }: { nextProject?: Project }) => (
  <NextLinks
    variant="pager"
    label={PROJECT_PAGER_ARIA_LABEL}
    links={[
      {
        eyebrow: PROJECT_PAGER_INDEX_EYEBROW,
        title: PROJECT_SECTION_LINK_BACK,
        href: "/portfolio",
      },
      ...(nextProject
        ? [
            {
              eyebrow: PROJECT_PAGER_NEXT_EYEBROW,
              title: nextProject.name,
              href: `/portfolio/${nextProject.slug}`,
            },
          ]
        : []),
    ]}
  />
);
