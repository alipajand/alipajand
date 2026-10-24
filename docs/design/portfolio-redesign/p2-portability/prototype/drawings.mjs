// Editorial drawings for the P2 portability exploration. Every label is a term from the
// project's entry in data/projects.ts. None of these are product UI: each sheet carries a title
// strip that names its material, and only screenshots of shipped products are called shipped.
//
// Paths that draw in carry pathLength="1" and the class "ink". Project inks: "ag" (blueprint
// blue, AlwaysGeeky's detail callouts) and "em" (ochre, Emplifi's measuring lines). Red is not
// used in these drawings: it belongs to the A–A identity and to LedgerGuard's review boundary.

const svg = (w, h, body, label, cls = "") =>
  `<svg class="drawing ${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" data-label="${label}">${body}</svg>`;

const strip = (w, h, code, title, kind) => `
  <g class="strip">
    <rect x="0" y="${h - 50}" width="${w}" height="50" class="strip__bg"/>
    <line x1="0" y1="${h - 50}" x2="${w}" y2="${h - 50}" class="hair"/>
    <text x="24" y="${h - 19}" class="t-code">${code}</text>
    <text x="${24 + code.length * 13 + 22}" y="${h - 19}" class="t-strip">${title}</text>
    <text x="${w - 24}" y="${h - 19}" class="t-kind" text-anchor="end">${kind}</text>
  </g>`;

const frame = (w, h) => `<rect x="12" y="12" width="${w - 24}" height="${h - 74}" class="frame"/>`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Breaks a label into lines of at most n characters, for SVG text.
const wrap = (s, n) => {
  const out = [];
  let line = "";
  for (const w of String(s).split(" ")) {
    if ((line + " " + w).trim().length > n && line) {
      out.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) out.push(line);
  return out;
};

const lines = (x, y, s, n, lh, cls, anchor = "start") =>
  wrap(s, n)
    .map(
      (l, i) =>
        `<text x="${x}" y="${y + i * lh}" class="${cls}" text-anchor="${anchor}">${esc(l)}</text>`
    )
    .join("");

/* ---------------------------------------------------------------------------------------- */
/* Universal: a sheet with nothing to show. The drafting convention for an opening (a box     */
/* with its diagonals) marks where a screenshot would go when none is published.              */
/* ---------------------------------------------------------------------------------------- */

export const noShot = (code, name, kind, note) => {
  const W = 1000;
  const H = 626;
  return svg(
    W,
    H,
    `${frame(W, H)}
    <rect x="70" y="70" width="${W - 140}" height="${H - 220}" class="void-box"/>
    <line x1="70" y1="70" x2="${W - 70}" y2="${H - 150}" class="hair"/>
    <line x1="${W - 70}" y1="70" x2="70" y2="${H - 150}" class="hair"/>
    <rect x="${W / 2 - 230}" y="${(H - 150) / 2 + 2}" width="460" height="${note ? 96 : 64}" class="label-bg"/>
    <text x="${W / 2}" y="${(H - 150) / 2 + 44}" class="t-title" text-anchor="middle">${esc(name)}</text>
    ${note ? `<text x="${W / 2}" y="${(H - 150) / 2 + 78}" class="t-note" text-anchor="middle">${esc(note)}</text>` : ""}
    ${strip(W, H, code, "No screenshot in this portfolio", kind)}`,
    code,
    "drawing--noshot"
  );
};

/* ---------------------------------------------------------------------------------------- */
/* AlwaysGeeky                                                                                 */
/* ---------------------------------------------------------------------------------------- */

// AG-03 · the component contract: what the Storybook documentation recorded for each
// component, drawn as a schedule. It is not a Storybook screen.
export const agContract = (rows) => {
  const W = 1000;
  const H = 646;
  const top = 132;
  const rh = 78;
  return svg(
    W,
    H,
    `${frame(W, H)}
    <text x="48" y="74" class="t-title">Component contract</text>
    <text x="48" y="104" class="t-note">What each shared component was documented to own, written down in Storybook.</text>
    <line x1="48" y1="${top - 8}" x2="${W - 48}" y2="${top - 8}" class="rule-strong"/>
    <text x="48" y="${top + 20}" class="t-col">Part of the contract</text>
    <text x="440" y="${top + 20}" class="t-col">Where it is enforced</text>
    ${rows
      .map(
        (r, i) => `
      <g class="row" data-row="${i}">
        <line x1="48" y1="${top + 36 + i * rh}" x2="${W - 48}" y2="${top + 36 + i * rh}" class="hair"/>
        <circle cx="66" cy="${top + 36 + i * rh + 38}" r="9" class="tick ink ag" pathLength="1"/>
        ${lines(92, top + 36 + i * rh + 32, r.part, 28, 22, "t-cell")}
        ${lines(440, top + 36 + i * rh + 32, r.where, 44, 22, "t-cell t-cell--soft")}
      </g>`
      )
      .join("")}
    ${strip(W, H, "AG-03", "Storybook as the component contract", "Editorial diagram")}`,
    "ag-contract"
  );
};

// AG-04 · the gates: the same scripts from the editor to the merge.
export const agGates = (steps, loop) => {
  const W = 1000;
  const H = 646;
  const bw = 196;
  const gap = 32;
  const x0 = 48;
  const y = 200;
  return svg(
    W,
    H,
    `${frame(W, H)}
    <text x="48" y="74" class="t-title">The same checks from editor to merge</text>
    <text x="48" y="104" class="t-note">Frontend conventions held by CI, not by memory.</text>
    ${steps
      .map((s, i) => {
        const x = x0 + i * (bw + gap);
        return `
      <g class="gate" data-gate="${i}">
        <rect x="${x}" y="${y}" width="${bw}" height="132" class="box ink" pathLength="1"/>
        <text x="${x + 16}" y="${y + 34}" class="t-code">${String(i + 1).padStart(2, "0")}</text>
        ${lines(x + 16, y + 66, s.label, 16, 24, "t-box")}
        ${i < steps.length - 1 ? `<line x1="${x + bw}" y1="${y + 66}" x2="${x + bw + gap}" y2="${y + 66}" class="wire ink" pathLength="1"/><path d="M${x + bw + gap - 9},${y + 60} L${x + bw + gap},${y + 66} L${x + bw + gap - 9},${y + 72}" class="wire ink" pathLength="1"/>` : ""}
        ${lines(x, y + 172, s.detail, 26, 20, "t-small")}
      </g>`;
      })
      .join("")}
    <!-- the shared scripts sit above the first three gates, clear of their notes -->
    <path d="M${x0 + bw / 2},${y - 34} H${x0 + 2 * (bw + gap) + bw / 2}" class="bus ink ag" pathLength="1"/>
    ${[0, 1, 2].map((i) => `<line x1="${x0 + i * (bw + gap) + bw / 2}" y1="${y - 34}" x2="${x0 + i * (bw + gap) + bw / 2}" y2="${y}" class="bus bus--drop ink ag" pathLength="1"/>`).join("")}
    <text x="${x0 + bw / 2}" y="${y - 46}" class="t-ag">one set of lint, type and test scripts</text>
    ${lines(48, H - 112, loop, 92, 20, "t-small")}
    ${strip(W, H, "AG-04", "CI quality gates", "Editorial diagram")}`,
    "ag-gates"
  );
};

// AG-02 for static and narrow layouts: the assembly as a flat elevation. Four surfaces over one
// library, then the contract, the conventions and the gates. Shipped screenshots sit in the two
// surfaces that have them; the other two are openings.
export const agAssembly = (surfaces, layers, media) => {
  const W = 1000;
  const H = 760;
  const sw = 205;
  const sh = 128;
  const gap = 26;
  const x0 = 48;
  const y0 = 92;
  const ly = 300;
  return svg(
    W,
    H,
    `${frame(W, H)}
    <text x="48" y="62" class="t-title">One library under four product surfaces</text>
    ${surfaces
      .map((s, i) => {
        const x = x0 + i * (sw + gap);
        const img = media[i];
        return `
      <g class="surf">
        ${img ? `<image href="${img}" x="${x}" y="${y0}" width="${sw}" height="${sh}" preserveAspectRatio="xMidYMid slice"/><rect x="${x}" y="${y0}" width="${sw}" height="${sh}" class="shot-edge"/>` : `<rect x="${x}" y="${y0}" width="${sw}" height="${sh}" class="void-box"/><line x1="${x}" y1="${y0}" x2="${x + sw}" y2="${y0 + sh}" class="hair"/><line x1="${x + sw}" y1="${y0}" x2="${x}" y2="${y0 + sh}" class="hair"/>`}
        <text x="${x}" y="${y0 + sh + 24}" class="t-cell">${esc(s)}</text>
        <text x="${x}" y="${y0 + sh + 44}" class="t-small">${img ? "Screenshot · shipped product" : "No screenshot in this portfolio"}</text>
        <line x1="${x + sw / 2}" y1="${y0 + sh + 58}" x2="${x + sw / 2}" y2="${ly}" class="drop ink ag" pathLength="1"/>
        <path d="M${x + sw / 2 - 6},${ly - 10} L${x + sw / 2},${ly} L${x + sw / 2 + 6},${ly - 10}" class="drop ink ag" pathLength="1"/>
      </g>`;
      })
      .join("")}
    ${layers
      .map((l, i) => {
        const y = ly + i * 84;
        return `
      <g class="band" data-band="${i}">
        <rect x="${x0}" y="${y}" width="${W - 2 * x0}" height="70" class="${i === 0 ? "band__box band__box--lib" : "band__box"}"/>
        <text x="${x0 + 18}" y="${y + 30}" class="t-code">${String(i + 1).padStart(2, "0")}</text>
        <text x="${x0 + 64}" y="${y + 30}" class="t-cell">${esc(l.label)}</text>
        ${lines(x0 + 64, y + 54, l.detail, 92, 18, "t-small")}
      </g>`;
      })
      .join("")}
    ${strip(W, H, "AG-02", "Assembly · four surfaces, one library", "Editorial diagram · screenshots are shipped")}`,
    "ag-assembly"
  );
};

/* ---------------------------------------------------------------------------------------- */
/* Emplifi · illustrative data only. No value here is a measurement.                          */
/* ---------------------------------------------------------------------------------------- */

// A deterministic pseudo-random series, so the drawing is the same on every build.
const series = (n, seed, base, amp) => {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const out = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += rnd() * amp + Math.sin(i / 5 + seed) * amp * 0.4;
    v = Math.max(base - amp * 6, Math.min(base + amp * 6, v));
    out.push(v);
  }
  return out;
};

const pathOf = (vals, x0, x1, y0, y1, lo, hi) =>
  vals
    .map((v, i) => {
      const x = x0 + ((x1 - x0) * i) / (vals.length - 1);
      const y = y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

// The dense chart: three series, an area and a bar strip, in the plain style of an editorial
// figure. Drawn into any box; used inside the webview drawing and on its own.
const chart = (x0, y0, w, h) => {
  const a = series(64, 7, 50, 3.2);
  const b = series(64, 19, 40, 2.6);
  const c = series(64, 31, 62, 2.2);
  const lo = 18;
  const hi = 84;
  const cy1 = y0 + h * 0.66;
  const area = `${pathOf(a, x0, x0 + w, y0, cy1, lo, hi)} L${x0 + w},${cy1} L${x0},${cy1} Z`;
  const bars = series(32, 43, 30, 5)
    .map((v, i) => {
      const bw = w / 32;
      const bh = Math.max(4, ((v - 8) / 50) * (h * 0.24));
      return `<rect x="${(x0 + i * bw + 1).toFixed(1)}" y="${(y0 + h - bh).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${bh.toFixed(1)}" class="bar"/>`;
    })
    .join("");
  const grid = [0, 1, 2, 3, 4]
    .map(
      (i) =>
        `<line x1="${x0}" y1="${(y0 + (cy1 - y0) * (i / 4)).toFixed(1)}" x2="${x0 + w}" y2="${(y0 + (cy1 - y0) * (i / 4)).toFixed(1)}" class="grid"/>`
    )
    .join("");
  return `
    <g class="chart">
      ${grid}
      <path d="${area}" class="area"/>
      <path d="${pathOf(a, x0, x0 + w, y0, cy1, lo, hi)}" class="line ink" pathLength="1"/>
      <path d="${pathOf(b, x0, x0 + w, y0, cy1, lo, hi)}" class="line line--2 ink" pathLength="1"/>
      <path d="${pathOf(c, x0, x0 + w, y0, cy1, lo, hi)}" class="line line--3 ink" pathLength="1"/>
      <g class="bars">${bars}</g>
    </g>`;
};

// EM-01 · a dense chart in an embedded mobile webview: a phone, the host app's chrome, and the
// webview the dashboard module runs in.
export const emWebview = () => {
  const W = 420;
  const H = 820;
  return svg(
    W,
    H,
    `<rect x="18" y="14" width="${W - 36}" height="${H - 92}" rx="46" class="phone ink" pathLength="1"/>
    <rect x="34" y="30" width="${W - 68}" height="${H - 124}" rx="32" class="phone__glass"/>
    <rect x="${W / 2 - 46}" y="40" width="92" height="22" rx="11" class="phone__notch"/>
    <rect x="34" y="78" width="${W - 68}" height="58" class="host"/>
    <text x="54" y="114" class="t-small">Host app</text>
    <rect x="${W - 112}" y="96" width="58" height="20" rx="10" class="host__pill"/>
    <rect x="44" y="148" width="${W - 88}" height="${H - 252}" class="webview ink" pathLength="1"/>
    <text x="58" y="176" class="t-small t-em">Embedded webview</text>
    <text x="58" y="206" class="t-cell">Dashboard module</text>
    ${chart(58, 226, W - 116, 300)}
    <line x1="58" y1="556" x2="${W - 58}" y2="556" class="hair"/>
    ${[0, 1, 2].map((i) => `<rect x="58" y="${572 + i * 42}" width="${W - 116}" height="30" class="row-box"/><rect x="66" y="${582 + i * 42}" width="${90 + i * 40}" height="10" class="row-ink"/>`).join("")}
    <line x1="210" y1="226" x2="210" y2="526" class="cursor em"/>
    <text x="${W / 2}" y="${H - 44}" class="t-kind" text-anchor="middle">EM-01 · Editorial diagram · illustrative data</text>`,
    "em-webview",
    "drawing--em"
  );
};

// EM-02 and EM-04 · the cost of one update, as a schematic frame timeline. Frames are the 60 Hz
// budget (a property of the display, not a measurement). Block lengths are illustrative.
const WORK = [
  { key: "render", before: "All re-renders", after: "Needed re-renders", w: 1.0, k: 0.32 },
  { key: "d3", before: "D3 chart update", after: "D3 chart update", w: 0.62, k: 0.55 },
  { key: "layout", before: "Layout", after: "Layout", w: 0.5, k: 0.5 },
  { key: "paint", before: "Chart-update paint", after: "Chart-update paint", w: 0.56, k: 0.48 },
];

export const emTimeline = (state = "both") => {
  const W = 1000;
  const H = 470;
  const x0 = 210;
  const fw = 128;
  const frames = 6;
  const y0 = 120;
  const rh = 44;
  const ticks = Array.from({ length: frames + 1 }, (_, i) => {
    const x = x0 + i * fw;
    return `<line x1="${x}" y1="${y0 - 26}" x2="${x}" y2="${y0 + WORK.length * rh + 8}" class="${i ? "frame-tick" : "frame-tick frame-tick--0"}"/>`;
  }).join("");
  const blocks = (() => {
    let x = x0 + 8;
    return WORK.map((b, i) => {
      const w = b.w * 250;
      const r = `<g class="blk" data-k="${b.k}" data-blk="${b.key}">
        <rect x="${x.toFixed(1)}" y="${y0 + i * rh + 6}" width="${(state === "after" ? w * b.k : w).toFixed(1)}" height="${rh - 14}" class="blk__box blk__box--${b.key}"/>
      </g>
      <text x="${x0 - 14}" y="${y0 + i * rh + 28}" class="t-small t-before" text-anchor="end">${esc(b.before)}</text>
      <text x="${x0 - 14}" y="${y0 + i * rh + 28}" class="t-small t-after" text-anchor="end">${esc(b.after)}</text>`;
      x += (state === "after" ? w * b.k : w) + 6;
      return r;
    }).join("");
  })();
  return svg(
    W,
    H,
    `${frame(W, H)}
    <text x="40" y="58" class="t-title"><tspan class="t-before">One update, before</tspan><tspan class="t-after">One update, after</tspan></text>
    <text x="${x0}" y="${y0 - 34}" class="t-small">frame budget at 60 Hz · 16.7 ms each</text>
    ${ticks}
    <g class="miss">
      ${[2, 3, 4].map((i) => `<rect x="${x0 + i * fw + 2}" y="${y0 - 18}" width="${fw - 4}" height="12" class="miss__box"/>`).join("")}
      <text x="${x0 + 2 * fw + 4}" y="${y0 + WORK.length * rh + 30}" class="t-small t-em">frames the update spills into</text>
    </g>
    ${blocks}
    <line x1="${x0}" y1="${y0 + WORK.length * rh + 8}" x2="${x0 + frames * fw}" y2="${y0 + WORK.length * rh + 8}" class="axis"/>
    <text x="40" y="${H - 84}" class="t-small">Schematic. Block lengths are illustrative; no profile or measured value is shown.</text>
    ${strip(W, H, state === "after" ? "EM-04" : "EM-02", "The cost of one chart update", "Editorial diagram · schematic")}`,
    "em-timeline",
    `drawing--em drawing--tl drawing--${state}`
  );
};

// EM-03 · how a dashboard module is composed: an exploded section of four layers, with the
// line between what D3 owns and what React owns.
export const emLayers = (layers) => {
  const W = 1000;
  const H = 646;
  const x0 = 64;
  const w = 600;
  return svg(
    W,
    H,
    `${frame(W, H)}
    <text x="40" y="58" class="t-title">How a dashboard module is composed</text>
    ${layers
      .map((l, i) => {
        const y = 100 + i * 112;
        const dx = i * 26;
        return `
      <g class="lyr" data-lyr="${i}">
        <path d="M${x0 + dx},${y + 22} L${x0 + dx + 40},${y} L${x0 + dx + w + 40},${y} L${x0 + dx + w},${y + 22} Z" class="lyr__top"/>
        <rect x="${x0 + dx}" y="${y + 22}" width="${w}" height="80" class="lyr__face ink" pathLength="1"/>
        <text x="${x0 + dx + 18}" y="${y + 48}" class="t-cell">${esc(l.label)}</text>
        ${lines(x0 + dx + 18, y + 70, l.detail, 78, 18, "t-small")}
      </g>`;
      })
      .join("")}
    <path d="M${x0 + w + 64},${100 + 22} V${100 + 112 + 102}" class="dim em"/>
    <path d="M${x0 + w + 56},${100 + 22} H${x0 + w + 72} M${x0 + w + 56},${100 + 112 + 102} H${x0 + w + 72}" class="dim em"/>
    ${lines(x0 + w + 84, 168, "React owns the composition around the chart; D3 owns the chart's own behavior.", 24, 22, "t-cell t-em-ink")}
    ${strip(W, H, "EM-03", "Composition of a dashboard module", "Editorial diagram")}`,
    "em-layers",
    "drawing--em"
  );
};
