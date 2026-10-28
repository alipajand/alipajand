import { render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";

import WritingPage, { metadata as indexMetadata } from "../writing/page";
import PostPage, { generateMetadata, generateStaticParams } from "../writing/[slug]/page";
import { CANONICAL_URL, SITE_NAME } from "data/site";
import { WRITING_LAUNCH_ARTICLES } from "data/writing";
import { getAllPosts, getPostBySlug, getPublishedPosts } from "utils/posts";
import { isPublished, publicationTimestamp } from "utils/publication";
import { installMatchMedia, installObservers } from "utils/motion/testEnvironment";

jest.mock("marked", () =>
  jest.requireActual(
    jest
      .requireActual<typeof import("path")>("path")
      .join(process.cwd(), "node_modules/marked/lib/marked.umd.js")
  )
);

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

const TODAY = new Date("2026-10-27T16:00:00Z");
const slugs = getAllPosts().map((post) => post.slug);
const published = getPublishedPosts(TODAY).map((post) => post.slug);
const scheduled = getAllPosts().filter((post) => !isPublished(post, TODAY));

const renderPost = async (slug: string) =>
  render((await PostPage({ params: Promise.resolve({ slug }) })) as ReactElement);

const jsonLd = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map((script) =>
    JSON.parse(script.textContent ?? "{}")
  );

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
  jest.setSystemTime(TODAY);
  installMatchMedia(false);
  installObservers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("/writing", () => {
  it("should keep the index metadata canonical", () => {
    expect(indexMetadata.alternates?.canonical).toBe(`${CANONICAL_URL}/writing`);
    expect(indexMetadata.description).toBeTruthy();
  });

  it("should render one h1, every published post and the topic filters", async () => {
    const { container } = render((await WritingPage()) as ReactElement);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelector("main#main-content")).not.toBeNull();
    const list = container.querySelector("#posts ul") as HTMLElement;
    for (const post of getPublishedPosts(TODAY)) {
      expect(within(list).getByRole("heading", { level: 3, name: post.title })).toBeInTheDocument();
    }
    expect(screen.getByRole("group", { name: "Filter by topic" })).toBeInTheDocument();
  });
});

describe("/writing/[slug]", () => {
  it("should statically generate every post that is not a draft", async () => {
    expect((await generateStaticParams()).map(({ slug }) => slug).sort()).toEqual(
      [...slugs].sort()
    );
  });

  it.each(published)("should keep the metadata for %s", async (slug) => {
    const post = getPostBySlug(slug)!;
    const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
    const url = `${CANONICAL_URL}/writing/${slug}`;

    expect(meta.title).toEqual({ absolute: post.seoTitle ?? `${post.title} | ${SITE_NAME}` });
    expect(meta.description).toBe(post.seoDescription ?? post.excerpt);
    expect(meta.alternates?.canonical).toBe(url);
    expect(meta.openGraph).toEqual(
      expect.objectContaining({
        type: "article",
        url,
        publishedTime: publicationTimestamp(post.date),
        images: [expect.objectContaining({ url: `/writing/${slug}/opengraph-image` })],
      })
    );
  });

  it("should not invent metadata for an unknown slug", async () => {
    expect(await generateMetadata({ params: Promise.resolve({ slug: "missing" }) })).toEqual({
      title: "Not found",
    });
  });

  it.each(published)(
    "should render %s with one h1, its Article JSON-LD and a contents entry per heading",
    async (slug) => {
      const post = getPostBySlug(slug)!;
      const { container } = await renderPost(slug);

      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(post.title);

      const article = jsonLd(container).find((data) => data["@type"] === "Article");
      expect(article).toEqual(
        expect.objectContaining({
          headline: post.title,
          datePublished: publicationTimestamp(post.date),
          url: `${CANONICAL_URL}/writing/${slug}`,
        })
      );
      expect(jsonLd(container).some((data) => data["@type"] === "BreadcrumbList")).toBe(true);

      const toc = screen.queryByRole("complementary", { name: "Table of contents" });
      if (post.headings.length === 0) {
        expect(toc).toBeNull();
        return;
      }
      const links = within(toc!)
        .getAllByRole("link")
        .slice(0, post.headings.length)
        .map((link) => link.getAttribute("href"));
      expect(links).toEqual(post.headings.map((heading) => `#${heading.id}`));
      for (const heading of post.headings) {
        expect(container.querySelectorAll(`[id="${heading.id}"]`)).toHaveLength(1);
      }
    }
  );

  it("should give the launch post its own layout", async () => {
    const [slug] = WRITING_LAUNCH_ARTICLES;
    await renderPost(slug);
    expect(
      screen.getByRole("region", { name: /Illustration: instructions drifting/ })
    ).toBeInTheDocument();
  });

  it("should list the other posts under More writing and mark the current one", async () => {
    const slug = published.find((value) => !WRITING_LAUNCH_ARTICLES.includes(value))!;
    await renderPost(slug);
    const more = screen.getByRole("region", { name: "More writing" });
    const current = within(more)
      .getAllByRole("link")
      .find((link) => link.getAttribute("aria-current") === "page");
    expect(current).toHaveAttribute("href", `/writing/${slug}`);
  });
});

describe("heading ids", () => {
  it("should stay stable for every post so shared section links keep working", () => {
    const ids = Object.fromEntries(
      slugs.map((slug) => [slug, getPostBySlug(slug)!.headings.map((heading) => heading.id)])
    );
    expect(ids).toMatchSnapshot();
  });

  it("should be unique and identical between builds", () => {
    for (const slug of slugs) {
      const first = getPostBySlug(slug)!.headings.map((heading) => heading.id);
      expect(new Set(first).size).toBe(first.length);
      expect(getPostBySlug(slug)!.headings.map((heading) => heading.id)).toEqual(first);
    }
  });
});

describe("scheduled posts", () => {
  it("should leave them off the index and out of the CollectionPage JSON-LD", async () => {
    expect(scheduled.length).toBeGreaterThan(0);
    const { container } = render((await WritingPage()) as ReactElement);
    const listed = JSON.stringify(
      jsonLd(container).find((data) => data["@type"] === "CollectionPage")
    );
    for (const post of scheduled) {
      expect(container.querySelector(`a[href="/writing/${post.slug}"]`)).toBeNull();
      expect(listed).not.toContain(`/writing/${post.slug}"`);
    }
    for (const slug of published) expect(listed).toContain(`/writing/${slug}"`);
  });

  it("should answer 404 for the article and keep it out of More writing", async () => {
    for (const post of scheduled) {
      await expect(renderPost(post.slug)).rejects.toThrow();
      expect(await generateMetadata({ params: Promise.resolve({ slug: post.slug }) })).toEqual({
        title: "Not found",
      });
    }
    await renderPost(published.find((slug) => !WRITING_LAUNCH_ARTICLES.includes(slug))!);
    const more = screen.getByRole("region", { name: "More writing" });
    for (const post of scheduled) {
      expect(more.querySelector(`a[href="/writing/${post.slug}"]`)).toBeNull();
    }
  });
});
