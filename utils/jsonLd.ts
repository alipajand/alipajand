const JSON_LD_ESCAPES: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

const JSON_LD_UNSAFE_RE = /[<>&\u2028\u2029]/g;

export const serializeJsonLd = (value: unknown): string =>
  JSON.stringify(value).replace(JSON_LD_UNSAFE_RE, (char) => JSON_LD_ESCAPES[char]);
