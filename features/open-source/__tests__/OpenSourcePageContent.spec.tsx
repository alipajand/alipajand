import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";

import OpenSourcePage, { metadata } from "../../../app/open-source/page";
import { OpenSourcePageContent } from "features/open-source/OpenSourcePageContent";
import { OPEN_SOURCE_CONTRIBUTION_SNAPSHOT } from "data/openSourceActivity";
import {
  OPEN_SOURCE_ACTIVITY_GRAPH_LABEL,
  OPEN_SOURCE_ACTIVITY_HEADING,
  OPEN_SOURCE_ACTIVITY_SNAPSHOT_LEDE,
  OPEN_SOURCE_CTA_CONTACT_HREF,
  OPEN_SOURCE_CTA_CONTACT_LABEL,
  OPEN_SOURCE_CTA_PRIMARY_HREF,
  OPEN_SOURCE_CTA_PRIMARY_LABEL,
  OPEN_SOURCE_CTA_SECONDARY_HREF,
  OPEN_SOURCE_CTA_SECONDARY_LABEL,
  OPEN_SOURCE_HEADER_HEADING,
  OPEN_SOURCE_HERO_PROJECTS_CTA_LABEL,
  OPEN_SOURCE_INSTALL_NOTE,
  OPEN_SOURCE_META_DESCRIPTION,
  OPEN_SOURCE_META_TITLE,
  OPEN_SOURCE_PROJECTS,
  OPEN_SOURCE_PROJECTS_HEADING,
  OPEN_SOURCE_PROJECTS_INDEX_ARIA_LABEL,
  OPEN_SOURCE_SHARED_PRINCIPLES,
  OPEN_SOURCE_SHARED_PRINCIPLES_HEADING,
  OPEN_SOURCE_TECHNOLOGY_BADGES,
  OPEN_SOURCE_TECHNOLOGY_HEADING,
  openSourceCopiedAnnouncement,
  openSourceCopyAriaLabel,
  openSourceInstallAriaLabel,
  openSourceProjectSlug,
  openSourceRepositoryAriaLabel,
  openSourceRouteReadout,
  openSourceSelectedAnnouncement,
} from "data/openSourcePage";
import { CANONICAL_URL } from "data/site";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

beforeEach(() => {
  installMatchMedia(false);
  installObservers();
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderPage = () =>
  render(<OpenSourcePageContent activity={OPEN_SOURCE_CONTRIBUTION_SNAPSHOT} />);

const article = (title: string) =>
  document.getElementById(openSourceProjectSlug(title)) as HTMLElement;

describe("OpenSourcePageContent", () => {
  it("should own the main landmark with a single page title", () => {
    renderPage();

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: OPEN_SOURCE_HEADER_HEADING })
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: OPEN_SOURCE_HEADER_HEADING })).toBeInTheDocument();
  });

  it("should link the hero to the projects and the GitHub profile", () => {
    renderPage();

    const hero = screen.getByRole("region", { name: OPEN_SOURCE_HEADER_HEADING });
    expect(
      within(hero).getByRole("link", { name: OPEN_SOURCE_HERO_PROJECTS_CTA_LABEL })
    ).toHaveAttribute("href", "#projects");
    expect(within(hero).getByRole("link", { name: OPEN_SOURCE_CTA_PRIMARY_LABEL })).toHaveAttribute(
      "href",
      OPEN_SOURCE_CTA_PRIMARY_HREF
    );
    expect(document.getElementById("projects")).not.toBeNull();
  });

  it("should render every project with its release, format, repository and install command", () => {
    renderPage();

    OPEN_SOURCE_PROJECTS.forEach((project) => {
      const entry = article(project.title);
      expect(entry).toHaveAccessibleName(project.title);
      expect(
        within(entry).getByRole("heading", { level: 3, name: project.title })
      ).toBeInTheDocument();
      expect(within(entry).getByText(project.summary)).toBeInTheDocument();
      expect(within(entry).getByText(project.format)).toBeInTheDocument();
      const release = within(entry).getByText(project.releasedOn, { exact: false });
      expect(release.textContent).toBe(
        project.version ? `v${project.version} · ${project.releasedOn}` : project.releasedOn
      );
      expect(
        within(entry).getByRole("link", { name: openSourceRepositoryAriaLabel(project.title) })
      ).toHaveAttribute("href", project.repositoryUrl);
      const install = within(entry).getByLabelText(openSourceInstallAriaLabel(project.title));
      expect(install.textContent).toBe(project.install);
      expect(install).toHaveAttribute("tabindex", "0");
      project.testedCapabilities.forEach((item) => {
        expect(within(entry).getByText(item)).toBeInTheDocument();
      });
      expect(within(entry).getByText(project.contribution)).toBeInTheDocument();
      project.articles?.forEach((post) => {
        expect(within(entry).getByRole("link", { name: post.title })).toHaveAttribute(
          "href",
          post.href
        );
      });
    });
  });

  it("should keep the bot listing date without inventing a release version", () => {
    renderPage();

    const doctor = article("Agent Readiness Doctor");
    expect(within(doctor).getByText("Added to the Library · October 12, 2026")).toBeInTheDocument();
    expect(within(doctor).queryByRole("button")).not.toBeInTheDocument();
    expect(
      within(doctor).getByRole("link", {
        name: "Keeping repository instructions useful with Agent Readiness Doctor",
      })
    ).toHaveAttribute("href", "/writing/agent-readiness-doctor");
  });

  it("should index every project with an in-page link to its entry", () => {
    renderPage();

    const index = screen.getByRole("navigation", { name: OPEN_SOURCE_PROJECTS_INDEX_ARIA_LABEL });
    const links = within(index).getAllByRole("link");
    expect(links).toHaveLength(OPEN_SOURCE_PROJECTS.length);
    links.forEach((link, position) => {
      const target = link.getAttribute("href")?.slice(1) ?? "";
      expect(document.getElementById(target)).toBe(article(OPEN_SOURCE_PROJECTS[position].title));
    });
    expect(within(index).getByText("Library")).toBeInTheDocument();
    expect(screen.getByText(OPEN_SOURCE_INSTALL_NOTE)).toBeInTheDocument();
  });

  it("should render the section headings in the artifact order", () => {
    renderPage();

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)
    ).toEqual([
      OPEN_SOURCE_PROJECTS_HEADING,
      OPEN_SOURCE_SHARED_PRINCIPLES_HEADING,
      OPEN_SOURCE_TECHNOLOGY_HEADING,
      OPEN_SOURCE_ACTIVITY_HEADING,
      "Explore the repositories",
    ]);
  });

  it("should render the working principles and every technology badge", () => {
    renderPage();

    OPEN_SOURCE_SHARED_PRINCIPLES.forEach((principle) => {
      expect(screen.getByRole("heading", { level: 3, name: principle.title })).toBeInTheDocument();
      expect(screen.getByText(principle.body)).toBeInTheDocument();
    });
    const badges = screen.getByRole("list", { name: OPEN_SOURCE_TECHNOLOGY_HEADING });
    expect(
      within(badges)
        .getAllByRole("listitem")
        .map((item) => item.textContent)
    ).toEqual(
      OPEN_SOURCE_TECHNOLOGY_BADGES.map(
        (badge, index) => `${String(index + 1).padStart(2, "0")}${badge}`
      )
    );
  });

  it("should render the contribution snapshot with a text alternative", () => {
    renderPage();

    expect(screen.getByText("16,511")).toBeInTheDocument();
    const graph = screen.getByRole("region", { name: OPEN_SOURCE_ACTIVITY_GRAPH_LABEL });
    expect(graph).toHaveAttribute("tabindex", "0");
    expect(within(graph).getByRole("img")).toHaveAccessibleName(
      "16,511 contributions on GitHub between Oct 26, 2025 and Oct 27, 2026"
    );
    expect(graph.querySelectorAll("rect")).toHaveLength(
      OPEN_SOURCE_CONTRIBUTION_SNAPSHOT.counts.length
    );
    const table = screen.getByRole("table", {
      name: "Contributions per month, Oct 26, 2025 to Oct 27, 2026",
    });
    expect(table).not.toHaveAttribute("class");
    expect(table.parentElement?.className).toMatch(/srOnly/);
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((th) => th.textContent)
    ).toEqual(["Month", "Contributions"]);
    expect(within(table).getByRole("rowheader", { name: "October 2026" })).toBeInTheDocument();
    const total = within(table)
      .getAllByRole("cell")
      .reduce((sum, cell) => sum + Number(cell.textContent?.replace(/,/g, "")), 0);
    expect(total).toBe(OPEN_SOURCE_CONTRIBUTION_SNAPSHOT.total);
    expect(screen.getByText("[ Snapshot · Oct 27, 2026 ]")).toBeInTheDocument();
  });

  it("should call the snapshot contributions and say it includes private ones", () => {
    renderPage();

    const section = screen.getByRole("region", { name: OPEN_SOURCE_ACTIVITY_HEADING });
    expect(within(section).getByText(OPEN_SOURCE_ACTIVITY_SNAPSHOT_LEDE)).toBeInTheDocument();
    expect(OPEN_SOURCE_ACTIVITY_SNAPSHOT_LEDE).toMatch(/private contributions/);
    expect(OPEN_SOURCE_ACTIVITY_SNAPSHOT_LEDE).not.toMatch(/when this page was built/);
    expect(section.textContent).not.toMatch(/\bcommits?\b/i);
  });

  it("should name the day under the pointer in the readout", () => {
    renderPage();

    const graph = screen.getByRole("region", { name: OPEN_SOURCE_ACTIVITY_GRAPH_LABEL });
    const last = graph.querySelector(
      `rect[data-i="${OPEN_SOURCE_CONTRIBUTION_SNAPSHOT.counts.length - 1}"]`
    );
    fireEvent.pointerOver(last as Element);
    expect(screen.getByText("Oct 27, 2026 · 42 contributions")).toBeInTheDocument();
    fireEvent.pointerLeave(graph);
    expect(screen.getByText("[ Snapshot · Oct 27, 2026 ]")).toBeInTheDocument();
  });

  it("should close with the repository, writing and contact links", () => {
    renderPage();

    const cta = screen.getByRole("region", { name: "Explore the repositories" });
    expect(within(cta).getByRole("link", { name: OPEN_SOURCE_CTA_PRIMARY_LABEL })).toHaveAttribute(
      "href",
      OPEN_SOURCE_CTA_PRIMARY_HREF
    );
    expect(
      within(cta).getByRole("link", { name: new RegExp(OPEN_SOURCE_CTA_SECONDARY_LABEL) })
    ).toHaveAttribute("href", OPEN_SOURCE_CTA_SECONDARY_HREF);
    expect(
      within(cta).getByRole("link", { name: new RegExp(OPEN_SOURCE_CTA_CONTACT_LABEL) })
    ).toHaveAttribute("href", OPEN_SOURCE_CTA_CONTACT_HREF);
  });

  it("should keep the decorative display line, tickers and diagram out of the accessibility tree", () => {
    const { container } = renderPage();

    const hidden = Array.from(container.querySelectorAll("main > [aria-hidden='true']"));
    expect(hidden).toHaveLength(3);
    expect(container.querySelector("canvas")?.closest("[aria-hidden='true']")).not.toBeNull();
    expect(screen.getByText(openSourceRouteReadout(0))).toBeInTheDocument();
  });
});

describe("OpenSourcePageContent copy buttons", () => {
  const mcp = OPEN_SOURCE_PROJECTS[0];

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should copy the install command and announce it", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderPage();

    const button = screen.getByRole("button", { name: openSourceCopyAriaLabel(mcp.title) });
    button.focus();
    expect(button).toHaveFocus();
    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeText).toHaveBeenCalledWith(mcp.install);
    expect(button).toHaveTextContent("Copied");
    expect(screen.getByText(openSourceCopiedAnnouncement(mcp.title))).toHaveAttribute(
      "role",
      "status"
    );
  });

  it("should select the command when the clipboard refuses, then reset the label", async () => {
    jest.useFakeTimers();
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockRejectedValue(new Error()) },
    });
    renderPage();

    const button = screen.getByRole("button", { name: openSourceCopyAriaLabel(mcp.title) });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveTextContent("Selected");
    expect(screen.getByText(openSourceSelectedAnnouncement(mcp.title))).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe(mcp.install);
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    expect(button).toHaveTextContent("Copy");
  });

  it("should fall back to selecting when the clipboard API is missing", () => {
    Object.assign(navigator, { clipboard: undefined });
    renderPage();

    const button = screen.getByRole("button", { name: openSourceCopyAriaLabel(mcp.title) });
    fireEvent.click(button);
    expect(button).toHaveTextContent("Selected");
  });
});

describe("OpenSourcePageContent with reduced motion", () => {
  it("should render the still state with nothing lit or hidden", () => {
    installMatchMedia(true);
    const { container } = renderPage();

    expect(container.querySelectorAll("[data-on]")).toHaveLength(0);
    expect(container.querySelectorAll("[data-off]")).toHaveLength(0);
    expect(container.querySelectorAll("[aria-current]")).toHaveLength(0);
  });
});

describe("app/open-source/page", () => {
  it("should keep the canonical metadata", () => {
    expect(metadata.title).toEqual({ absolute: OPEN_SOURCE_META_TITLE });
    expect(metadata.description).toBe(OPEN_SOURCE_META_DESCRIPTION);
    expect(metadata.alternates?.canonical).toBe(`${CANONICAL_URL}/open-source`);
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({ url: `${CANONICAL_URL}/open-source` })
    );
  });

  it("should render the collection and breadcrumb structured data with the page", async () => {
    delete process.env.GITHUB_TOKEN;
    const { container } = render((await OpenSourcePage()) as ReactElement);

    const blocks = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
      (script) => JSON.parse(script.textContent ?? "{}")
    );
    const types = blocks.map((block) => block["@type"]);
    expect(types).toEqual(expect.arrayContaining(["CollectionPage", "BreadcrumbList"]));
    expect(JSON.stringify(blocks)).toContain(OPEN_SOURCE_PROJECTS[0].repositoryUrl);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
