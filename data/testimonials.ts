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
      "Ali consistently delivered high-quality, accessible UIs and helped our team ship faster with a solid design system and clear documentation.",
    author: "— Former colleague",
    role: "Engineering",
    company: "Emplifi",
  },
  {
    id: "2",
    quote:
      "Strong ownership from design to deployment. Great at bridging design and engineering and caring about both UX and performance.",
    author: "— Former colleague",
    role: "Product / Engineering",
    company: "ControlTech Startup Studio",
  },
  {
    id: "3",
    quote:
      "Brought structure and automation to our frontend workflow, from Storybook to CI/CD and tooling that the whole team could rely on.",
    author: "— Former colleague",
    role: "Engineering",
    company: "ControlTech Startup Studio",
  },
];
