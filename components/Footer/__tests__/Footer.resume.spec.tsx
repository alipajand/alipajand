import { render, screen } from "@testing-library/react";

import { Footer } from "components/Footer/Footer";
import { HERO_CTA_DOWNLOAD_RESUME } from "data/site";

jest.mock("data/site", () => ({
  ...jest.requireActual("data/site"),
  RESUME_URL: "/resume.pdf",
}));

describe("Footer with a résumé URL", () => {
  it("should render a downloadable résumé link when RESUME_URL is set", () => {
    render(<Footer latestWritings={[]} />);

    const resumeLink = screen.getByRole("link", {
      name: new RegExp(HERO_CTA_DOWNLOAD_RESUME, "i"),
    });
    expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
    expect(resumeLink).toHaveAttribute("download");
  });
});
