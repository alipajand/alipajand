import { render, screen } from "@testing-library/react";

import { Hero } from "components/Hero/Hero";
import { HERO_CTA_DOWNLOAD_RESUME } from "data/site";

jest.mock("data/site", () => ({
  ...jest.requireActual("data/site"),
  RESUME_URL: "/resume.pdf",
}));

jest.mock("components/Hero/HeroBackground", () => ({
  HeroBackground: () => null,
}));

jest.mock("gsap", () => ({
  set: jest.fn(),
  to: jest.fn().mockReturnValue({}),
  fromTo: jest.fn().mockReturnValue({}),
  timeline: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
  })),
}));

describe("Hero with a résumé URL", () => {
  it("renders a downloadable résumé CTA when RESUME_URL is set", () => {
    render(<Hero />);

    const resumeLink = screen.getByRole("link", { name: HERO_CTA_DOWNLOAD_RESUME });
    expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
    expect(resumeLink).toHaveAttribute("download");
  });
});
