export const BREADCRUMB_HOME_LABEL = "Home";

export const BREADCRUMB_PORTFOLIO_LABEL = "Case studies";

export const BREADCRUMB_WRITING_LABEL = "Writing";

export const BREADCRUMB_ENGINEERING_PRINCIPLES_LABEL = "Engineering Principles";

export const BREADCRUMB_NOW_LABEL = "Now";

export const BREADCRUMB_OPEN_SOURCE_LABEL = "Open source";

export const BREADCRUMB_NOT_FOUND_LABEL = "Page not found";

export type BreadcrumbNavItem = {
  label: string;
  href?: string;
};

export const portfolioIndexBreadcrumbs = (): BreadcrumbNavItem[] => [
  { label: BREADCRUMB_HOME_LABEL, href: "/" },
  { label: BREADCRUMB_PORTFOLIO_LABEL },
];

export const portfolioCaseStudyBreadcrumbs = (projectName: string): BreadcrumbNavItem[] => [
  { label: BREADCRUMB_HOME_LABEL, href: "/" },
  { label: BREADCRUMB_PORTFOLIO_LABEL, href: "/portfolio" },
  { label: projectName },
];

export const writingIndexBreadcrumbs = (): BreadcrumbNavItem[] => [
  { label: BREADCRUMB_HOME_LABEL, href: "/" },
  { label: BREADCRUMB_WRITING_LABEL },
];

export const writingPostBreadcrumbs = (postTitle: string): BreadcrumbNavItem[] => [
  { label: BREADCRUMB_HOME_LABEL, href: "/" },
  { label: BREADCRUMB_WRITING_LABEL, href: "/writing" },
  { label: postTitle },
];

export const engineeringPrinciplesBreadcrumbs = (): BreadcrumbNavItem[] => [
  { label: BREADCRUMB_HOME_LABEL, href: "/" },
  { label: BREADCRUMB_ENGINEERING_PRINCIPLES_LABEL },
];

export const nowBreadcrumbs = (): BreadcrumbNavItem[] => [
  { label: BREADCRUMB_HOME_LABEL, href: "/" },
  { label: BREADCRUMB_NOW_LABEL },
];

export const openSourceBreadcrumbs = (): BreadcrumbNavItem[] => [
  { label: BREADCRUMB_HOME_LABEL, href: "/" },
  { label: BREADCRUMB_OPEN_SOURCE_LABEL },
];

export const notFoundBreadcrumbs = (): BreadcrumbNavItem[] => [
  { label: BREADCRUMB_HOME_LABEL, href: "/" },
  { label: BREADCRUMB_NOT_FOUND_LABEL },
];
