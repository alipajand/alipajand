export interface Testimonial {
  id: string;
  quote: string;
  author?: string;
  label: string;
}

export const TESTIMONIALS_HEADING = "Peer feedback";

export const TESTIMONIALS_INTRO =
  "Names remain withheld publicly unless permission has been granted.";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Ali built high-quality, accessible UIs and helped us ship faster with a solid design system and clear docs.",
    label: "Former engineering colleague · Emplifi",
  },
  {
    id: "2",
    quote:
      "Took ownership from design to deployment. Kept design and engineering in sync and pushed for better UX and performance.",
    label: "Product and engineering collaborator · ControlTech",
  },
];
