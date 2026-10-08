import { readFile } from "fs/promises";
import { join } from "path";

import { ImageResponse } from "next/og";

import { PROFILE_IMAGE_DOMAIN, PROFILE_IMAGE_FOCUS, PROFILE_IMAGE_STACK } from "data/profileImage";
import { LOCATION, PERSON_SCHEMA_JOB_TITLE, SITE_NAME } from "data/site";

const BACKGROUND = "#000000";
const FOREGROUND = "#fafafa";
const MUTED = "#a3a3a3";
const BORDER = "#262626";
const ACCENT = "#ea2b2b";

const GEIST_DIR = join(process.cwd(), "node_modules", "geist", "dist", "fonts", "geist-sans");

const loadGeist = async () => {
  const [regular, medium, bold] = await Promise.all(
    ["Geist-Regular.ttf", "Geist-Medium.ttf", "Geist-Bold.ttf"].map((file) =>
      readFile(join(GEIST_DIR, file))
    )
  );
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: bold, weight: 700 as const, style: "normal" as const },
  ];
};

/**
 * Name-first card used for search-result thumbnails and social previews.
 * Everything is centered and scaled from the short edge, so the name stays
 * readable when Google crops the image down to a small square.
 */
export async function renderProfileImage({ width, height }: { width: number; height: number }) {
  const unit = Math.min(width, height) / 100;
  const isSquare = width === height;
  const gridSize = Math.round(unit * 8);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BACKGROUND,
        backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: "center center",
        color: FOREGROUND,
        fontFamily: "Geist",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: unit * 3.2,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: unit * 1.6 }}>
          <div
            style={{
              display: "flex",
              width: unit * 1.8,
              height: unit * 1.8,
              backgroundColor: ACCENT,
              borderRadius: unit * 0.4,
            }}
          />
          <span
            style={{
              fontSize: unit * 3.4,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {PERSON_SCHEMA_JOB_TITLE}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isSquare ? "column" : "row",
            alignItems: "center",
            gap: isSquare ? 0 : unit * 4,
            fontSize: isSquare ? unit * 22 : unit * 19,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          {SITE_NAME.split(" ").map((part) => (
            <span key={part}>{part}</span>
          ))}
        </div>

        <span
          style={{
            fontSize: isSquare ? unit * 3 : unit * 3.8,
            color: MUTED,
            textAlign: "center",
            maxWidth: width * 0.86,
          }}
        >
          {PROFILE_IMAGE_FOCUS}
        </span>

        <div style={{ display: "flex", gap: unit * 1.6, marginTop: unit * 1.2 }}>
          {PROFILE_IMAGE_STACK.map((item) => (
            <span
              key={item}
              style={{
                display: "flex",
                fontSize: unit * 3,
                fontWeight: 500,
                color: FOREGROUND,
                paddingTop: unit * 1,
                paddingBottom: unit * 1,
                paddingLeft: unit * 2.2,
                paddingRight: unit * 2.2,
                border: `${Math.max(2, Math.round(unit * 0.25))}px solid ${BORDER}`,
                borderRadius: 999,
                backgroundColor: "#0a0a0a",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: unit * 5,
          display: "flex",
          gap: unit * 2,
          fontSize: unit * 2.8,
          color: MUTED,
          letterSpacing: "0.04em",
        }}
      >
        <span>{PROFILE_IMAGE_DOMAIN}</span>
        <span style={{ color: BORDER }}>/</span>
        <span>{LOCATION}</span>
      </div>
    </div>,
    { width, height, fonts: await loadGeist() }
  );
}
