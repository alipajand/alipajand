import { renderMonogramIcon } from "utils/monogramIcon";

export const dynamic = "force-static";

export function GET() {
  return renderMonogramIcon(512);
}
