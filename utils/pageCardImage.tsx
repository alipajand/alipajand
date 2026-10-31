import { ImageResponse } from "next/og";

import { PROFILE_IMAGE_DOMAIN } from "data/profileImage";
import { SITE_NAME } from "data/site";
import { loadGeist } from "utils/profileImage";

const BACKGROUND = "#000000";
const FOREGROUND = "#fafafa";
const MUTED = "#a3a3a3";
const BORDER = "#262626";
const ACCENT = "#ea2b2b";

export const PAGE_CARD_SIZE = { width: 1200, height: 630 };

export interface PageCard {
  eyebrow: string;
  title: string;
  subtitle: string;
  tags: readonly string[];
}

const MAX_TAGS = 4;

export async function renderPageCardImage({ eyebrow, title, subtitle, tags }: PageCard) {
  const { width, height } = PAGE_CARD_SIZE;
  const titleSize = title.length > 12 ? 84 : 112;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: BACKGROUND,
        backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
        color: FOREGROUND,
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            width: 18,
            height: 18,
            backgroundColor: ACCENT,
            borderRadius: 4,
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {eyebrow}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1,
          }}
        >
          {title}
        </span>
        <span style={{ fontSize: 36, fontWeight: 500, color: MUTED, lineHeight: 1.25 }}>
          {subtitle}
        </span>
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          {tags.slice(0, MAX_TAGS).map((tag) => (
            <span
              key={tag}
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 500,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 20,
                paddingRight: 20,
                border: `2px solid ${BORDER}`,
                borderRadius: 999,
                backgroundColor: "#0a0a0a",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${BORDER}`,
          paddingTop: 24,
          fontSize: 24,
          color: MUTED,
        }}
      >
        <span style={{ fontWeight: 500, color: FOREGROUND }}>{SITE_NAME}</span>
        <span>{PROFILE_IMAGE_DOMAIN}</span>
      </div>
    </div>,
    { width, height, fonts: await loadGeist() }
  );
}
