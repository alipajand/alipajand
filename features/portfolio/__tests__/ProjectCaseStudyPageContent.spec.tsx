import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { ProjectCaseStudyJsonLd } from "components/ProjectCaseStudyJsonLd/ProjectCaseStudyJsonLd";
import { PortfolioWorks } from "features/portfolio/PortfolioWorks";
import { ProjectCaseStudyPageContent } from "features/portfolio/ProjectCaseStudyPageContent";
import { PORTFOLIO_CASE_STUDY_ORDER, PROJECTS } from "data/projects";
import { buildCaseSections } from "utils/caseStudySections";
import {
  installManualFrames,
  installMatchMedia,
  installObservers,
} from "utils/motion/testEnvironment";
import {
  getDedicatedCaseStudyProjects,
  getNextDedicatedCaseStudyProject,
  getProjectBySlug,
} from "utils/projects";

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img data-priority={priority ? "true" : undefined} {...props} />
  ),
}));

const HELD_BACK = /(^|[^\d.])[89]0%/;

const renderCase = (slug: string) => {
  const project = getProjectBySlug(slug)!;
  return render(
    <ProjectCaseStudyPageContent
      project={project}
      nextProject={getNextDedicatedCaseStudyProject(slug)}
    />
  );
};

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
  Object.assign(HTMLDialogElement.prototype, {
    showModal(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
    close(this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    },
  });
});

describe.each(PORTFOLIO_CASE_STUDY_ORDER.map((slug) => [slug]))("/portfolio/%s", (slug) => {
  const project = getProjectBySlug(slug)!;

  it("names the page with one h1 carrying the project name", () => {
    renderCase(slug);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(project.name);
    expect(screen.getByRole("heading", { level: 2, name: project.caseStudyTitle })).toBeVisible();
  });

  it("numbers every section and links each one from the chapter rail", () => {
    renderCase(slug);
    const sections = buildCaseSections(project);
    const rail = screen.getByRole("navigation", { name: `Table of contents for ${project.name}` });
    const links = within(rail).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      sections.map((section) => `#${section.id}`)
    );
    sections.forEach((section, index) => {
      const region = screen.getByRole("region", { name: section.title });
      expect(region).toHaveAttribute("id", section.id);
      expect(region).toHaveTextContent(`[ ${String(index + 1).padStart(2, "0")} ]`);
    });
  });

  it("draws each flow diagram as a band after the section it belongs to", () => {
    const { container } = renderCase(slug);
    for (const section of buildCaseSections(project).filter((s) => s.flow)) {
      const band = container.querySelector(`[data-chapter-for="${section.id}"]`);
      expect(band).not.toBeNull();
      expect(document.getElementById(section.id)!.nextElementSibling).toBe(band);
    }
  });

  it("links the next case study in portfolio order", () => {
    renderCase(slug);
    const pager = screen.getByRole("navigation", { name: "Case studies" });
    const hrefs = within(pager)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    const next = getNextDedicatedCaseStudyProject(slug);
    expect(hrefs).toEqual(["/portfolio", ...(next ? [`/portfolio/${next.slug}`] : [])]);
  });

  it("opens live and external links in the same tab, like any other link", () => {
    const { container } = renderCase(slug);
    const external = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="http"]'));
    for (const link of external) {
      expect(link).not.toHaveAttribute("target");
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link.getAttribute("aria-label") ?? "").not.toMatch(/new tab/);
    }
  });

  it("prioritises only the hero screenshot", () => {
    const { container } = renderCase(slug);
    const images = Array.from(container.querySelectorAll("figure > div img"));
    const figures = project.caseStudy.interfaceEvidence ?? [];
    expect(images).toHaveLength(figures.length);
    images.forEach((image, index) => {
      if (index === 0) expect(image).toHaveAttribute("data-priority", "true");
      else expect(image).toHaveAttribute("loading", "lazy");
    });
  });

  it("renders none of the held-back figures", () => {
    const { container } = render(
      <>
        <ProjectCaseStudyJsonLd project={project} />
        <ProjectCaseStudyPageContent project={project} />
      </>
    );
    expect(container.innerHTML).not.toMatch(HELD_BACK);
  });
});

/** Unedited dashboard captures that showed the signed-in account; only the redacted copies ship. */
const UNREDACTED_ORIGINALS = [
  "/portfolio-media/ledgerguard-dashboard.png",
  "/portfolio-media/mapbylaw-dashboard.png",
];

describe("case-study screenshots", () => {
  const pngSize = (src: string) => {
    const buffer = readFileSync(join(process.cwd(), "public", src));
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  };

  it("declares each image's real pixel size", () => {
    for (const project of PROJECTS) {
      for (const figure of project.caseStudy.interfaceEvidence ?? []) {
        expect({ src: figure.src, ...pngSize(figure.src!) }).toEqual({
          src: figure.src,
          width: figure.width,
          height: figure.height,
        });
      }
    }
  });

  it("uses fictional or redacted dashboards and no longer ships the originals", () => {
    const sources = PROJECTS.flatMap((p) => p.caseStudy.interfaceEvidence ?? []).map((f) => f.src);
    expect(sources).toContain("/portfolio-media/ledgerguard-dashboard-sample.png");
    expect(sources).toContain("/portfolio-media/mapbylaw-dashboard-redacted.png");
    for (const original of UNREDACTED_ORIGINALS) {
      expect(sources).not.toContain(original);
      expect(existsSync(join(process.cwd(), "public", original))).toBe(false);
    }
  });

  it("says which screenshot details are edited or sample data, in caption and alt text", () => {
    const figure = (slug: string, src: string) =>
      getProjectBySlug(slug)!.caseStudy.interfaceEvidence!.find((f) => f.src === src)!;
    for (const src of [
      "/portfolio-media/ledgerguard-dashboard-sample.png",
      "/portfolio-media/ledgerguard-contracts-sample.png",
      "/portfolio-media/ledgerguard-review-sample.png",
    ]) {
      const ledgerguard = figure("ledgerguard", src);
      expect(ledgerguard.provenance).toBe("Redesign, fictional data");
      expect(ledgerguard.captionBody).toMatch(/redesign with a fictional (workspace|contract)/);
      expect(ledgerguard.alt).toMatch(/fictional/);
    }
    const mapbylaw = figure("mapbylaw", "/portfolio-media/mapbylaw-dashboard-redacted.png");
    expect(mapbylaw.provenance).toBe("Account row blurred");
    expect(mapbylaw.captionBody).toMatch(/account name and email are blurred/);
    expect(mapbylaw.alt).toMatch(/account name and email in the sidebar are blurred/);
    const tallyfolio = figure("tallyfolio", "/portfolio-media/tallyfolio-dashboard.png");
    expect(tallyfolio.provenance).toBe("Sample data");
    expect(tallyfolio.alt).toMatch(/with sample data/);
  });

  it("shows the provenance note beside each edited or sample screenshot", () => {
    for (const [slug, note] of [
      ["tallyfolio", "Sample data"],
      ["ledgerguard", "Redesign, fictional data"],
      ["mapbylaw", "Account row blurred"],
    ] as const) {
      const { unmount } = renderCase(slug);
      const evidence = screen.getByRole("region", { name: "Interface evidence" });
      for (const label of within(evidence).getAllByText(note)) expect(label).toBeVisible();
      unmount();
    }
  });

  it("frames each screenshot with its own host", () => {
    renderCase("alwaysgeeky");
    const evidence = screen.getByRole("region", { name: "Interface evidence" });
    expect(evidence.querySelector("figure")).toHaveTextContent("login.voxies.io");
    const intro = document.getElementById("intro")!;
    expect(intro.querySelector("figure")).toHaveTextContent("market.voxies.io");
  });

  it("opens the lightbox from the keyboard and returns focus when it closes", () => {
    renderCase("ledgerguard");
    const opener = screen.getByRole("button", { name: "Enlarge: Dashboard" });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Dashboard", hidden: true });
    expect(dialog).toHaveAttribute("open");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close", hidden: true }));
    expect(dialog).not.toHaveAttribute("open");
    expect(opener).toHaveFocus();
  });
});

describe("case-study motion", () => {
  it("keeps the hero flat and every flow step passed under reduced motion", () => {
    installMatchMedia(true);
    const { container } = renderCase("ledgerguard");
    const tilted = container.querySelector<HTMLElement>("#intro figure > div")!;
    expect(tilted.style.transform).toBe("");
    for (const step of container.querySelectorAll("[data-chapter-for] li")) {
      expect(step).toHaveAttribute("data-done");
    }
  });

  it("eases the hero tilt on display frames while idle motion is allowed", () => {
    const frames = installManualFrames();
    const { container } = renderCase("ledgerguard");
    const tilted = container.querySelector<HTMLElement>("#intro figure > div")!;
    act(() => {
      frames.flush();
    });
    expect(tilted.style.transform).toMatch(
      /^rotateX\(14\.00deg\) rotateY\(0\.00deg\) scale\(0\.940\)$/
    );
    act(() => {
      frames.flush();
    });
    expect(frames.pending()).toBeGreaterThan(0);
  });
});

describe("portfolio index", () => {
  it("lists every case study without the held-back figures", () => {
    const { container } = render(<PortfolioWorks />);
    expect(container.innerHTML).not.toMatch(HELD_BACK);
    expect(screen.getAllByRole("link")).toHaveLength(getDedicatedCaseStudyProjects().length);
  });
});
