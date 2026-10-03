import { ImageResponse } from "next/og";

/**
 * Renders the "AP" monogram as a square PNG. Font size and corner radius scale
 * with the canvas so the mark stays legible at every icon size (browser tab,
 * Apple touch icon, and the favicon Google shows in search results).
 */
export function renderMonogramIcon(px: number, { rounded = true } = {}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        borderRadius: rounded ? Math.round(px * 0.22) : 0,
        fontSize: Math.round(px * 0.46),
        fontWeight: 800,
        color: "#fafafa",
        fontFamily:
          "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
        letterSpacing: "-0.05em",
      }}
    >
      AP
    </div>,
    { width: px, height: px }
  );
}
