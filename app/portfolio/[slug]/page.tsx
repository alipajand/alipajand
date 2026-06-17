import { notFound } from "next/navigation";

import { BreadcrumbJsonLd } from "components/BreadcrumbJsonLd/BreadcrumbJsonLd";
import { ProjectCaseStudyJsonLd } from "components/ProjectCaseStudyJsonLd/ProjectCaseStudyJsonLd";
import { ProjectCaseStudyPageContent } from "features/portfolio/ProjectCaseStudyPageContent";
import { portfolioCaseStudyBreadcrumbs } from "data/breadcrumbs";
import { CANONICAL_URL } from "data/site";
import { buildPortfolioCaseStudyMetadata } from "utils/metadata";
import { toBreadcrumbJsonLdItems } from "utils/breadcrumbs";
import {
  getDedicatedCaseStudySlugs,
  getNextDedicatedCaseStudyProject,
  getProjectBySlug,
} from "utils/projects";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getDedicatedCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !project.hasDedicatedCaseStudy) return { title: "Not found" };
  return buildPortfolioCaseStudyMetadata(project);
}

export default async function PortfolioCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !project.hasDedicatedCaseStudy) notFound();

  const nextProject = getNextDedicatedCaseStudyProject(slug);
  const caseStudyUrl = `${CANONICAL_URL}/portfolio/${project.slug}`;

  return (
    <>
      <ProjectCaseStudyJsonLd project={project} />
      <BreadcrumbJsonLd
        items={toBreadcrumbJsonLdItems(portfolioCaseStudyBreadcrumbs(project.name), caseStudyUrl)}
      />
      <ProjectCaseStudyPageContent project={project} nextProject={nextProject} />
    </>
  );
}
