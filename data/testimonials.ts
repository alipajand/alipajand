export interface Testimonial {
  id: string;
  quote: string;
  author?: string;
  role: string;
  company: string;
}

export const TESTIMONIALS_HEADING = "Peer feedback";

export const TESTIMONIALS_INTRO =
  "Names withheld publicly; role and company are included with permission.";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Ali built high-quality, accessible UIs and helped us ship faster with a solid design system and clear docs.",
    role: "Engineering",
    company: "Emplifi",
  },
  {
    id: "2",
    quote:
      "Took ownership from design to deployment. Kept design and engineering in sync and pushed for better UX and performance.",
    role: "Product / Engineering",
    company: "ControlTech Startup Studio",
  },
  {
    id: "3",
    quote:
      "Set up our frontend workflow, Storybook, CI/CD, and tooling the whole team could rely on.",
    role: "Engineering",
    company: "ControlTech Startup Studio",
  },
];
