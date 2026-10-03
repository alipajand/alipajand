import { renderMonogramIcon } from "utils/monogramIcon";

// Google requires a square favicon that is a multiple of 48px; browsers
// downscale it cleanly for tabs.
export const size = { width: 192, height: 192 };

export const contentType = "image/png";

export default function Icon() {
  return renderMonogramIcon(size.width);
}
