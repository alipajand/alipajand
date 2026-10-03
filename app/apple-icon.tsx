import { renderMonogramIcon } from "utils/monogramIcon";

export const size = { width: 180, height: 180 };

export const contentType = "image/png";

// iOS applies its own corner mask, so the source stays square.
export default function AppleIcon() {
  return renderMonogramIcon(size.width, { rounded: false });
}
