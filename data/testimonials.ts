export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Ali built high-quality, accessible UIs and helped us ship faster with a solid design system and clear docs.",
    author: "— Former colleague",
    role: "Engineering",
    company: "Emplifi",
  },
  {
    id: "2",
    quote:
      "Took ownership from design to deployment. Kept design and engineering in sync and pushed for better UX and performance.",
    author: "— Former colleague",
    role: "Product / Engineering",
    company: "ControlTech Startup Studio",
  },
  {
    id: "3",
    quote:
      "Set up our frontend workflow, Storybook, CI/CD, and tooling the whole team could rely on.",
    author: "— Former colleague",
    role: "Engineering",
    company: "ControlTech Startup Studio",
  },
];
