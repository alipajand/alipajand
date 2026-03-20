import { ImageResponse } from "next/og";

import { CANONICAL_URL, SITE_NAME } from "data/site";
import { getAllPosts, getPostBySlug } from "utils/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export default async function BlogPostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Writing";
  const excerpt = post
    ? truncate(post.excerpt, 220)
    : `${SITE_NAME} — notes on product engineering and DX.`;
  const label = post ? "Article" : "Writing";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#000000",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
        <div
          style={{
            display: "flex",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#a3a3a3",
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            maxHeight: 280,
          }}
        >
          <span>{truncate(title, 120)}</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#737373",
            lineHeight: 1.45,
            maxWidth: 1000,
          }}
        >
          <span>{excerpt}</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #262626",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", fontSize: 22, color: "#a3a3a3", fontWeight: 500 }}>
          {SITE_NAME}
        </div>
        <img
          src={`${CANONICAL_URL}/icon.png`}
          alt=""
          width={72}
          height={72}
          style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }}
        />
      </div>
    </div>,
    { ...size }
  );
}
