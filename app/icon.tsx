import { renderMonogramIcon } from "utils/monogramIcon";

export const size = { width: 192, height: 192 };

export const contentType = "image/png";

export default function Icon() {
  return renderMonogramIcon(size.width);
}
