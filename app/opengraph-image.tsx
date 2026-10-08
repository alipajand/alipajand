import { SITE_NAME, TAGLINE } from "data/site";
import { renderProfileImage } from "utils/profileImage";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export const alt = `${SITE_NAME} | ${TAGLINE}`;

export default function OpenGraphImage() {
  return renderProfileImage(size);
}
