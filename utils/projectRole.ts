export function splitRoleLine(role: string): { title: string; company: string } {
  const idx = role.lastIndexOf(" · ");
  if (idx === -1) {
    return { title: role.trim(), company: "" };
  }
  return {
    title: role.slice(0, idx).trim(),
    company: role.slice(idx + 3).trim(),
  };
}
