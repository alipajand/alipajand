export function splitHtmlAtFirstH2(html: string): { before: string; fromH2: string } {
  const i = html.indexOf("<h2");
  if (i === -1) return { before: html, fromH2: "" };
  return { before: html.slice(0, i), fromH2: html.slice(i) };
}
