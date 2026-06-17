import { render, screen } from "@testing-library/react";

import { Nav } from "components/Nav/Nav";
import { HERO_CTA_DOWNLOAD_RESUME } from "data/site";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

jest.mock("data/site", () => ({
  ...jest.requireActual("data/site"),
  RESUME_URL: "/resume.pdf",
}));

describe("Nav with a résumé URL", () => {
  it("should render desktop and mobile résumé download links", () => {
    render(<Nav />);

    const desktopResume = screen.getByRole("link", { name: HERO_CTA_DOWNLOAD_RESUME });
    expect(desktopResume).toHaveAttribute("href", "/resume.pdf");
    expect(desktopResume).toHaveAttribute("download");

    const mobileResume = document.querySelector("#mobile-nav a[download]");
    expect(mobileResume).toHaveAttribute("href", "/resume.pdf");
    expect(mobileResume).toHaveTextContent(HERO_CTA_DOWNLOAD_RESUME);
  });
});
