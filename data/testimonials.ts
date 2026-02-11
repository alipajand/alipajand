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
      "Ali led delivery of high-quality, accessible UIs and enabled our team to ship faster with a solid design system and clear documentation.",
    author: "— Former colleague",
    role: "Engineering",
    company: "Emplifi",
  },
  {
    id: "2",
    quote:
      "Strong ownership from design to deployment. Drove alignment between design and engineering and consistently raised the bar on UX and performance.",
    author: "— Former colleague",
    role: "Product / Engineering",
    company: "ControlTech Startup Studio",
  },
  {
    id: "3",
    quote:
      "Led structure and automation for our frontend workflow—Storybook, CI/CD, and tooling the whole team could rely on.",
    author: "— Former colleague",
    role: "Engineering",
    company: "ControlTech Startup Studio",
  },
];
