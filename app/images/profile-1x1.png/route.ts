import { PROFILE_IMAGE_VARIANTS } from "data/profileImage";
import { renderProfileImage } from "utils/profileImage";

export const dynamic = "force-static";

export function GET() {
  return renderProfileImage(PROFILE_IMAGE_VARIANTS["1x1"]);
}
