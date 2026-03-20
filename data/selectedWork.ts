export type SelectedWorkType = "ui" | "dashboard" | "diagram";

export interface SelectedWorkItem {
  id: string;
  type: SelectedWorkType;
  title: string;
  caption: string;
  imageSrc?: string;
  blurData?: boolean;
}

export const SELECTED_WORK_ITEMS: SelectedWorkItem[] = [
  {
    id: "ui-component",
    type: "ui",
    title: "Pixel-perfect UI",
    caption: "Component from the design system accessible, consistent, built in Storybook.",
    imageSrc: undefined,
  },
  {
    id: "d3-dashboard",
    type: "dashboard",
    title: "Complex dashboards",
    caption: "D3.js charts and GSAP motion. Data blurred for confidentiality.",
    imageSrc: undefined,
    blurData: true,
  },
  {
    id: "ai-workflow",
    type: "diagram",
    title: "AI-driven automation",
    caption: "Workflow: from trigger to model to action. Built for reliability and observability.",
    imageSrc: undefined,
  },
];

/** Items with a configured `imageSrc` appear in the on-page gallery; others are ignored. */
export function getSelectedWorkItemsWithImages(
  items: SelectedWorkItem[] = SELECTED_WORK_ITEMS
): SelectedWorkItem[] {
  return items.filter((item) => Boolean(item.imageSrc?.trim()));
}
