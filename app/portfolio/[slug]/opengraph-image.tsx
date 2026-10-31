import { notFound } from "next/navigation";

import { getDedicatedCaseStudySlugs, getProjectBySlug } from "utils/projects";
import { PAGE_CARD_SIZE, renderPageCardImage } from "utils/pageCardImage";

export const dynamicParams = false;

export const size = PAGE_CARD_SIZE;

export const contentType = "image/png";

export async function generateStaticParams() {
  return getDedicatedCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function PortfolioCaseStudyOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !project.hasDedicatedCaseStudy) notFound();

  return renderPageCardImage({
    eyebrow: "Case study",
    title: project.name,
    subtitle: project.caseStudyTitle,
    tags: project.capabilityTags,
  });
}
