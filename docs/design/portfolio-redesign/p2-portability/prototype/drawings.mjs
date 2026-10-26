// Editorial drawings for the P2 portability exploration. Every label is a term from the
// project's entry in data/projects.ts. None of these are product UI: each sheet carries a title
// strip that names its material, and only screenshots of shipped products are called shipped.
//
// Paths that draw in carry pathLength="1" and the class "ink". Project inks: "ag" (blueprint
// blue, AlwaysGeeky's detail callouts) and "em" (ochre, Emplifi's measuring lines). Red is not
// used in these drawings: it belongs to the A–A identity and to LedgerGuard's review boundary.

const svg = (w, h, body, label, cls = "", fit = "xMidYMid meet") =>
  `<svg class="drawing ${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${fit}" aria-hidden="true" focusable="false" data-label="${label}">${body}</svg>`;

const strip = (w, h, code, title, kind) => `
  <g class="strip">
    <rect x="0" y="${h - 50}" width="${w}" height="50" class="strip__bg"/>
    <line x1="0" y1="${h - 50}" x2="${w}" y2="${h - 50}" class="hair"/>
    <text x="24" y="${h - 19}" class="t-code">${code}</text>
    <text x="${24 + code.length * 13 + 22}" y="${h - 19}" class="t-strip">${title}</text>
    <text x="${w - 24}" y="${h - 19}" class="t-kind" text-anchor="end">${kind}</text>
  </g>`;

// The sheet's frame, with registration ticks just inside each corner.
const frame = (w, h) => {
  const b = h - 62;
  const t = (x, y, dx, dy) => `<path d="M${x + dx},${y} H${x} V${y + dy}" class="reg-tick"/>`;
  return `<rect x="12" y="12" width="${w - 24}" height="${h - 74}" class="frame"/>${t(20, 20, 14, 14)}${t(w - 20, 20, -14, 14)}${t(20, b - 8, 14, -14)}${t(w - 20, b - 8, -14, -14)}`;
};

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
/* AlwaysGeeky                                                                                 */
/* ---------------------------------------------------------------------------------------- */

// AG-03 · the contract and its enforcement, as one chain hanging from the library: a blue
// spine runs down from the shared library through what Storybook records for each component,
// then into the gates that run the same scripts from the editor to the merge. One drawing, so
// the scene needs one camera move and the reader holds one picture. It is not a Storybook
// screen and names no tool, check count or pass rate.
export const agChain = (contract, gates, loop) => {
  const W = 1000;
  const H = 780;
  const sx = 500;
  const rows = contract.map((r, i) => ({ ...r, y: 150 + i * 64 }));
  const gy = 470;
  const bw = 230;
  const gap = 40;
  const g0 = (W - (3 * bw + 2 * gap)) / 2;
  return svg(
    W,
    H,
    `${frame(W, H)}
    <path d="M${sx},12 V${gy}" class="spine ink ag" pathLength="1"/>
    <text x="${sx - 32}" y="128" class="t-title" text-anchor="end">Storybook contract</text>
    ${lines(sx - 32, 160, "What each shared component is documented to own, written down where engineers look first.", 34, 22, "t-note", "end")}
    ${rows
      .map(
        (r, i) => `
      <g class="clause" data-clause="${i}">
        <path d="M${sx},${r.y} H${sx + 36}" class="branch ink ag" pathLength="1"/>
        <circle cx="${sx + 46}" cy="${r.y}" r="9" class="tick ink ag" pathLength="1"/>
        ${lines(sx + 68, r.y + 6, r.part, 34, 22, "t-cell")}
      </g>`
      )
      .join("")}
    <g class="gates">
      <path d="M${g0 + bw / 2},${gy} H${g0 + 2 * (bw + gap) + bw / 2}" class="bus ink ag" pathLength="1"/>
      <text x="${g0}" y="${gy - 16}" class="t-title">CI enforcement</text>
      <text x="${W - g0}" y="${gy - 16}" class="t-ag" text-anchor="end">one set of lint, type and test scripts</text>
      ${gates
        .map((g, i) => {
          const x = g0 + i * (bw + gap);
          return `
        <g class="gate" data-gate="${i}">
          <path d="M${x + bw / 2},${gy} V${gy + 34}" class="bus bus--drop ink ag" pathLength="1"/>
          <rect x="${x}" y="${gy + 34}" width="${bw}" height="78" class="box ink" pathLength="1"/>
          <text x="${x + 16}" y="${gy + 62}" class="t-code">${String(i + 1).padStart(2, "0")}</text>
          <text x="${x + 16}" y="${gy + 92}" class="t-box">${esc(g)}</text>
          ${i < gates.length - 1 ? `<path d="M${x + bw},${gy + 73} H${x + bw + gap} M${x + bw + gap - 8},${gy + 67} L${x + bw + gap},${gy + 73} L${x + bw + gap - 8},${gy + 79}" class="wire ink" pathLength="1"/>` : ""}
        </g>`;
        })
        .join("")}
    </g>
    ${lines(g0, H - 104, loop, 88, 20, "t-small")}
    ${strip(W, H, "AG-03", "Storybook contract and CI enforcement", "Editorial diagram")}`,
    "ag-chain"
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
        ${lines(x0 + 64, y + 54, l.detail, 108, 18, "t-small")}
      </g>`;
      })
      .join("")}
    ${strip(W, H, "AG-02", "Assembly · four surfaces, one library", "Editorial diagram · screenshots are shipped")}`,
    "ag-assembly"
  );
};

// AG-01's two callouts, as an overlay in the screenshot's own coordinates (1200 x 752), with
// the numbers the key under it reads.
export const agMarks = () =>
  `<svg class="drawing ag-marks" viewBox="0 0 1200 752" aria-hidden="true" focusable="false">
    <circle cx="180.6" cy="663.9" r="150" class="callout ink ag" pathLength="1"/>
    <circle cx="1086" cy="30" r="60" class="callout ink ag" pathLength="1"/>
    <circle cx="372" cy="560" r="44" class="mark-n"/><text x="372" y="578" class="mark-t" text-anchor="middle">1</text>
    <circle cx="960" cy="104" r="44" class="mark-n"/><text x="960" y="122" class="mark-t" text-anchor="middle">2</text>
  </svg>`;

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
// webview the dashboard module runs in. With crop, only the top of the phone is drawn, anchored
// to the bottom edge of its box (the opening's bays show it standing on the section line).
export const emWebview = ({ crop = 0 } = {}) => {
  const W = 420;
  const H = 820;
  return svg(
    W,
    crop || H,
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
    ${crop ? "" : `<text x="${W / 2}" y="${H - 44}" class="t-kind" text-anchor="middle">EM-01 · Editorial diagram · illustrative data</text>`}`,
    "em-webview",
    "drawing--em",
    crop ? "xMidYMax meet" : "xMidYMid meet"
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

// EM-02 · the render path of one chart update, as stations of equal width. The boxes are
// stages, not durations: nothing in this drawing has a length that stands for time.
export const emRenderPath = () => {
  const W = 1000;
  const H = 540;
  const STATIONS = [
    { label: "Input to the module", sub: "Data or interaction" },
    { label: "React re-render", sub: "Product composition" },
    { label: "D3 chart update", sub: "Chart behavior" },
    { label: "Style and layout", sub: "Browser work" },
    { label: "Paint", sub: "Browser work" },
  ];
  const bw = 160;
  const gap = 30;
  const x0 = 40;
  const y = 196;
  const bh = 124;
  const find = { 1: "unnecessary re-renders", 4: "chart-update paint work" };
  return svg(
    W,
    H,
    `${frame(W, H)}
    <text x="40" y="58" class="t-title">The render path of one chart update</text>
    <text x="40" y="88" class="t-note">Equal boxes: the stages of an update, not how long each one takes.</text>
    <text x="${x0}" y="132" class="t-small t-em">Profiled where the cost showed up first: in the embedded webview</text>
    <path d="M${x0},146 H${W - 40} M${x0},138 V154 M${W - 40},138 V154" class="probe em ink" pathLength="1"/>
    ${STATIONS.map((st, i) => {
      const x = x0 + i * (bw + gap);
      return `
      <g class="station" data-station="${i}">
        <path d="M${x + bw / 2},146 V${y - 8}" class="probe probe--drop em ink" pathLength="1"/>
        <rect x="${x}" y="${y}" width="${bw}" height="${bh}" class="box ink" pathLength="1"/>
        <text x="${x + 14}" y="${y + 28}" class="t-code">${String(i + 1).padStart(2, "0")}</text>
        ${lines(x + 14, y + 54, st.label, 13, 22, "t-box")}
        <text x="${x + 14}" y="${y + bh - 12}" class="t-small">${esc(st.sub)}</text>
        ${i < STATIONS.length - 1 ? `<path d="M${x + bw},${y + bh / 2} H${x + bw + gap} M${x + bw + gap - 8},${y + bh / 2 - 6} L${x + bw + gap},${y + bh / 2} L${x + bw + gap - 8},${y + bh / 2 + 6}" class="wire ink" pathLength="1"/>` : ""}
        ${find[i] ? `<g class="find" data-find="${i}"><path d="M${x},${y + bh + 16} V${y + bh + 28} H${x + bw} V${y + bh + 16}" class="em ink" pathLength="1"/><text x="${x + bw / 2}" y="${y + bh + 54}" class="t-cell t-em-ink" text-anchor="middle">${find[i]}</text></g>` : ""}
      </g>`;
    }).join("")}
    <text x="40" y="${H - 108}" class="t-small">The two marked stages are what the profiling targeted, as the case study names them.</text>
    <text x="40" y="${H - 84}" class="t-small">Schematic. No profile, timing or measured value is shown.</text>
    ${strip(W, H, "EM-02", "The render path of one chart update", "Editorial diagram · schematic")}`,
    "em-path",
    "drawing--em"
  );
};

// EM-04 · designing within the frame budget. The ruler is a reference: one frame of a 60 Hz
// display. The tree is illustrative, drawn to show the approach, not the production code.
export const emBudget = (approach) => {
  const W = 1000;
  const H = 640;
  const fx = 40;
  const fw = 120;
  const ry = 196;
  const node = (x, y, w, label, cls = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="40" class="box ink ${cls}" pathLength="1"/><text x="${x + w / 2}" y="${y + 26}" class="t-box t-box--s" text-anchor="middle">${esc(label)}</text>`;
  return svg(
    W,
    H,
    `${frame(W, H)}
    <text x="40" y="58" class="t-title">Designing within the frame budget</text>
    <g class="ref">
      <text x="${fx}" y="122" class="t-col">Reference budget</text>
      <path d="M${fx},${ry} H${fx + fw * 3}" class="axis"/>
      ${[0, 1, 2, 3].map((i) => `<line x1="${fx + i * fw}" y1="${ry - 12}" x2="${fx + i * fw}" y2="${ry + 12}" class="${i ? "frame-tick" : "frame-tick frame-tick--0"}"/>`).join("")}
      <path d="M${fx},${ry - 30} V${ry - 22} H${fx + fw} V${ry - 30}" class="em dim-ref ink" pathLength="1"/>
      <text x="${fx + fw / 2}" y="${ry - 40}" class="t-cell t-em-ink" text-anchor="middle">16.7 ms</text>
      ${[0, 1, 2].map((i) => `<text x="${fx + i * fw + fw / 2}" y="${ry + 32}" class="t-small" text-anchor="middle">frame</text>`).join("")}
      ${lines(fx, ry + 76, "One frame of a 60 Hz display lasts about 16.7 ms. This is a reference budget, not a measurement; other refresh rates set other budgets.", 40, 22, "t-small")}
    </g>
    <g class="tree">
      <text x="500" y="122" class="t-col">Illustrative module tree</text>
      ${node(610, 140, 220, "Dashboard module")}
      <path d="M720,180 V204 H585 V228 M720,204 H835 V228" class="wire ink" pathLength="1"/>
      ${node(500, 228, 170, "Controls")}
      ${node(735, 228, 200, "Chart container", "box--em")}
      <path d="M585,268 V292" class="wire ink" pathLength="1"/>
      ${node(500, 292, 170, "Legend, filters")}
      <rect x="715" y="300" width="240" height="96" class="d3-own"/>
      <text x="729" y="322" class="t-small t-em">D3.js owns the chart's marks</text>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${733 + i * 27}" y="${386 - (16 + ((i * 37) % 44))}" width="16" height="${16 + ((i * 37) % 44)}" class="mark-d3"/>`).join("")}
      <path d="M965,104 V160 M965,160 C965,190 900,200 880,228 M835,268 V300" class="update em ink" pathLength="1"/>
      <path d="M959,112 L965,100 L971,112" class="update em"/>
      <text x="955" y="96" class="t-small t-em" text-anchor="end">a chart update</text>
      <text x="500" y="356" class="t-small">Not re-rendered</text>
      <text x="500" y="376" class="t-small">by a chart update</text>
    </g>
    <line x1="40" y1="438" x2="${W - 40}" y2="438" class="hair"/>
    <text x="40" y="468" class="t-col">The approach, from the case study</text>
    ${approach
      .slice(0, 4)
      .map((a, i) => {
        const x = 40 + (i % 2) * 470;
        const y = 500 + Math.floor(i / 2) * 26;
        return `<text x="${x}" y="${y}" class="t-small"><tspan class="t-em-ink">${String(i + 1).padStart(2, "0")}</tspan>  ${esc(a)}</text>`;
      })
      .join("")}
    ${strip(W, H, "EM-04", "Designing within the frame budget", "Editorial diagram · schematic")}`,
    "em-budget",
    "drawing--em"
  );
};

/* ---------------------------------------------------------------------------------------- */
/* Phone sheets. The same drawings, recomposed for a 360-unit-wide sheet drawn at about its own */
/* size on a phone: one column, short vertical runs, labels at 13–15 px. Every label is the one */
/* the wide drawing uses; nothing is added and nothing measured.                               */
/* ---------------------------------------------------------------------------------------- */

const PW = 360;

// A phone sheet has no frame or strip of its own: it sits in an HTML plate, whose strip wraps.
const psvg = (h, body, label, cls = "") => svg(PW, h, body, label, `drawing--p ${cls}`);

// AG-02 on a phone: the four surfaces in two rows, held in one blue bracket by the library.
export const agAssemblyPhone = (surfaces, library, media) => {
  const cw = 152;
  const ch = 95;
  const x0 = 22;
  const gx = 16;
  let y = 44;
  const title = lines(22, y, "One library under four product surfaces", 26, 30, "t-title");
  y += 30 + 26;
  const top = y - 10;
  const cells = surfaces
    .map((s, i) => {
      const x = x0 + (i % 2) * (cw + gx);
      const cy = y + Math.floor(i / 2) * (ch + 74);
      const img = media[i];
      return `
      <g class="surf" data-in>
        ${img ? `<image href="${img}" x="${x}" y="${cy}" width="${cw}" height="${ch}" preserveAspectRatio="xMidYMid slice"/><rect x="${x}" y="${cy}" width="${cw}" height="${ch}" class="shot-edge"/>` : `<rect x="${x}" y="${cy}" width="${cw}" height="${ch}" class="void-box"/><line x1="${x}" y1="${cy}" x2="${x + cw}" y2="${cy + ch}" class="hair"/><line x1="${x + cw}" y1="${cy}" x2="${x}" y2="${cy + ch}" class="hair"/>`}
        <text x="${x}" y="${cy + ch + 21}" class="t-cell">${esc(s)}</text>
        ${lines(x, cy + ch + 39, img ? "Screenshot · shipped product" : "No screenshot in this portfolio", 22, 15, "t-small")}
      </g>`;
    })
    .join("");
  y += 2 * (ch + 74) - 6;
  const lib = `
    <path d="M10,${top} V${y} M350,${top} V${y}" class="drop ink ag" pathLength="1"/>
    <rect x="10" y="${y}" width="340" height="64" class="band__box band__box--lib ink" pathLength="1"/>
    <text x="24" y="${y + 26}" class="t-code">01</text>
    ${lines(56, y + 26, library, 30, 20, "t-cell")}`;
  const h = y + 64 + 18;
  return psvg(h, `${title}${cells}${lib}`, "ag-assembly-p");
};

// AG-03 on a phone: the spine runs down the left edge; each clause, then each gate, hangs off it.
export const agChainPhone = (contract, gates, loop) => {
  const sx = 24;
  let y = 46;
  let body = `<text x="${sx}" y="${y}" class="t-title">Storybook contract</text>`;
  y += 26;
  const note = wrap(
    "What each shared component is documented to own, written down where engineers look first.",
    42
  );
  body += lines(sx, y, note.join(" "), 42, 18, "t-small");
  y += note.length * 18 + 14;
  const spineTop = y - 6;
  for (const [i, r] of contract.entries()) {
    const ls = wrap(r.part, 30);
    body += `
      <g class="clause" data-clause="${i}" data-in>
        <path d="M${sx},${y + 2} H${sx + 18}" class="branch ink ag" pathLength="1"/>
        <circle cx="${sx + 26}" cy="${y + 2}" r="7" class="tick ink ag" pathLength="1"/>
        ${lines(sx + 42, y + 7, r.part, 30, 20, "t-cell")}
      </g>`;
    y += ls.length * 20 + 18;
  }
  y += 18;
  body += `<text x="${sx + 18}" y="${y}" class="t-title">CI enforcement</text>`;
  y += 22;
  body += `<text x="${sx + 18}" y="${y}" class="t-small t-ag">one set of lint, type and test scripts</text>`;
  y += 18;
  const gh = 46;
  for (const [i, g] of gates.entries()) {
    body += `
      <g class="gate" data-gate="${i}" data-in>
        <path d="M${sx},${y + gh / 2} H${sx + 18}" class="branch ink ag" pathLength="1"/>
        <rect x="${sx + 18}" y="${y}" width="${PW - sx - 18 - 14}" height="${gh}" class="box ink" pathLength="1"/>
        <text x="${sx + 32}" y="${y + 28}" class="t-code">${String(i + 1).padStart(2, "0")}</text>
        <text x="${sx + 64}" y="${y + 29}" class="t-box">${esc(g)}</text>
        ${i < gates.length - 1 ? `<path d="M${(PW + sx) / 2},${y + gh} V${y + gh + 14} M${(PW + sx) / 2 - 5},${y + gh + 8} L${(PW + sx) / 2},${y + gh + 14} L${(PW + sx) / 2 + 5},${y + gh + 8}" class="wire ink" pathLength="1"/>` : ""}
      </g>`;
    y += gh + (i < gates.length - 1 ? 14 : 0);
  }
  const spine = `<path d="M${sx},${spineTop} V${y - gh / 2}" class="spine ink ag" pathLength="1"/>`;
  y += 28;
  const ll = wrap(loop, 44);
  body += lines(sx, y, loop, 44, 18, "t-small");
  y += ll.length * 18;
  const h = y + 14;
  return psvg(h, `${spine}${body}`, "ag-chain-p");
};

const EM_STATIONS = [
  { label: "Input to the module", sub: "Data or interaction" },
  { label: "React re-render", sub: "Product composition", find: "unnecessary re-renders" },
  { label: "D3 chart update", sub: "Chart behavior" },
  { label: "Style and layout", sub: "Browser work" },
  { label: "Paint", sub: "Browser work", find: "chart-update paint work" },
];

// EM-02 on a phone: the stations run down the sheet under the probe, which runs down its edge.
export const emRenderPathPhone = () => {
  const px = 20;
  let y = 46;
  let body = lines(px, y, "The render path of one chart update", 22, 30, "t-title");
  y += 30 + 26;
  body += lines(
    px,
    y,
    "Equal boxes: the stages of an update, not how long each one takes.",
    44,
    18,
    "t-small"
  );
  y += 2 * 18 + 10;
  body += lines(
    px,
    y,
    "Profiled where the cost showed up first: in the embedded webview",
    44,
    18,
    "t-small t-em"
  );
  y += 2 * 18 + 6;
  const probeTop = y;
  const bx = 44;
  const bw = PW - bx - 16;
  const bh = 58;
  let last = y;
  for (const [i, st] of EM_STATIONS.entries()) {
    body += `
      <g class="station" data-station="${i}" data-in>
        <path d="M${px},${y + bh / 2} H${bx - 6}" class="probe probe--drop em ink" pathLength="1"/>
        <rect x="${bx}" y="${y}" width="${bw}" height="${bh}" class="box ink" pathLength="1"/>
        <text x="${bx + 12}" y="${y + 24}" class="t-code">${String(i + 1).padStart(2, "0")}</text>
        <text x="${bx + 42}" y="${y + 24}" class="t-box">${esc(st.label)}</text>
        <text x="${bx + 42}" y="${y + 45}" class="t-small">${esc(st.sub)}</text>
        ${st.find ? `<g class="find" data-find="${i}"><path d="M${bx},${y + bh + 8} V${y + bh + 14} H${bx + bw} V${y + bh + 8}" class="em ink" pathLength="1"/><text x="${bx + bw / 2}" y="${y + bh + 34}" class="t-cell t-em-ink" text-anchor="middle">${st.find}</text></g>` : ""}
      </g>`;
    last = y + bh / 2;
    const after = st.find ? 48 : 0;
    if (i < EM_STATIONS.length - 1)
      body += `<path d="M${bx + bw / 2},${y + bh + after} V${y + bh + after + 16} M${bx + bw / 2 - 5},${y + bh + after + 10} L${bx + bw / 2},${y + bh + after + 16} L${bx + bw / 2 + 5},${y + bh + after + 10}" class="wire ink" pathLength="1"/>`;
    y += bh + after + (i < EM_STATIONS.length - 1 ? 16 : 0);
  }
  const probe = `<path d="M${px},${probeTop} V${last}" class="probe em ink" pathLength="1"/>`;
  y += 30;
  body += lines(
    px,
    y,
    "The two marked stages are what the profiling targeted, as the case study names them.",
    44,
    18,
    "t-small"
  );
  y += 2 * 18 + 6;
  body += lines(
    px,
    y,
    "Schematic. No profile, timing or measured value is shown.",
    44,
    18,
    "t-small"
  );
  y += 2 * 18;
  const h = y + 10;
  return psvg(h, `${probe}${body}`, "em-path-p", "drawing--em");
};

// EM-03 on a phone: the layers stacked and stepped, with the React and D3 split marked in ochre.
export const emLayersPhone = (layers) => {
  let y = 46;
  let body = lines(20, y, "How a dashboard module is composed", 22, 30, "t-title");
  y += 30 + 24;
  const tops = [];
  for (const [i, l] of layers.entries()) {
    const dx = i * 8;
    const ls = wrap(l.detail, 36);
    const hh = 34 + ls.length * 17 + 10;
    tops.push([y, y + hh]);
    body += `
      <g class="lyr" data-lyr="${i}" data-in>
        <rect x="${16 + dx}" y="${y}" width="${PW - 56}" height="${hh}" class="lyr__face ink" pathLength="1"/>
        <text x="${30 + dx}" y="${y + 24}" class="t-cell">${esc(l.label)}</text>
        ${lines(30 + dx, y + 44, l.detail, 36, 17, "t-small")}
      </g>`;
    y += hh + 10;
  }
  const [a0] = tops[0];
  const [, b1] = tops[1];
  body += `<path d="M${PW - 22},${a0} V${b1} M${PW - 28},${a0} H${PW - 16} M${PW - 28},${b1} H${PW - 16}" class="dim em"/>`;
  y += 14;
  const note = "React owns the composition around the chart; D3 owns the chart's own behavior.";
  body += lines(20, y, note, 38, 20, "t-cell t-em-ink");
  y += wrap(note, 38).length * 20;
  const h = y + 14;
  return psvg(h, `${body}`, "em-layers-p", "drawing--em");
};

// EM-04 on a phone: the reference ruler, then the tree, then the approach, one under the other.
export const emBudgetPhone = (approach) => {
  let y = 46;
  let body = lines(20, y, "Designing within the frame budget", 22, 30, "t-title");
  y += 30 + 30;
  const fw = 100;
  const fx = 20;
  body += `<text x="${fx}" y="${y}" class="t-col">Reference budget</text>`;
  y += 64;
  const ry = y;
  body += `<g class="ref" data-in>
    <path d="M${fx},${ry} H${fx + fw * 3}" class="axis"/>
    ${[0, 1, 2, 3].map((i) => `<line x1="${fx + i * fw}" y1="${ry - 10}" x2="${fx + i * fw}" y2="${ry + 10}" class="${i ? "frame-tick" : "frame-tick frame-tick--0"}"/>`).join("")}
    <path d="M${fx},${ry - 26} V${ry - 19} H${fx + fw} V${ry - 26}" class="em dim-ref ink" pathLength="1"/>
    <text x="${fx + fw / 2}" y="${ry - 34}" class="t-cell t-em-ink" text-anchor="middle">16.7 ms</text>
    ${[0, 1, 2].map((i) => `<text x="${fx + i * fw + fw / 2}" y="${ry + 28}" class="t-small" text-anchor="middle">frame</text>`).join("")}
  </g>`;
  y += 58;
  const ref =
    "One frame of a 60 Hz display lasts about 16.7 ms. This is a reference budget, not a measurement; other refresh rates set other budgets.";
  body += lines(fx, y, ref, 44, 18, "t-small");
  y += wrap(ref, 44).length * 18 + 30;
  body += `<text x="${fx}" y="${y}" class="t-col">Illustrative module tree</text>`;
  y += 18;
  const node = (x, yy, w, label, cls = "") =>
    `<rect x="${x}" y="${yy}" width="${w}" height="38" class="box ink ${cls}" pathLength="1"/><text x="${x + w / 2}" y="${yy + 24}" class="t-box t-box--s" text-anchor="middle">${esc(label)}</text>`;
  const t0 = y;
  body += `<g class="tree" data-in>
    ${node(80, t0, 180, "Dashboard module")}
    <path d="M170,${t0 + 38} V${t0 + 56} H95 V${t0 + 74} M170,${t0 + 56} H255 V${t0 + 74}" class="wire ink" pathLength="1"/>
    ${node(20, t0 + 74, 150, "Controls")}
    ${node(180, t0 + 74, 160, "Chart container", "box--em")}
    <path d="M95,${t0 + 112} V${t0 + 130}" class="wire ink" pathLength="1"/>
    ${node(20, t0 + 130, 150, "Legend, filters")}
    <text x="20" y="${t0 + 192}" class="t-small">Not re-rendered</text>
    <text x="20" y="${t0 + 210}" class="t-small">by a chart update</text>
    <rect x="180" y="${t0 + 130}" width="160" height="96" class="d3-own"/>
    <text x="190" y="${t0 + 150}" class="t-small t-em">D3.js owns the</text>
    <text x="190" y="${t0 + 167}" class="t-small t-em">chart's marks</text>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${192 + i * 24}" y="${t0 + 216 - (14 + ((i * 37) % 36))}" width="14" height="${14 + ((i * 37) % 36)}" class="mark-d3"/>`).join("")}
  </g>
  <g data-in>
    <path d="M350,${t0 - 16} V${t0 + 50} M350,${t0 + 50} C350,${t0 + 62} 300,${t0 + 62} 290,${t0 + 74} M260,${t0 + 112} V${t0 + 130}" class="update em ink" pathLength="1"/>
    <text x="342" y="${t0 - 22}" class="t-small t-em" text-anchor="end">a chart update</text>
  </g>`;
  y = t0 + 226 + 34;
  body += `<line x1="16" y1="${y - 14}" x2="${PW - 16}" y2="${y - 14}" class="hair"/>`;
  y += 10;
  body += `<text x="${fx}" y="${y}" class="t-col">The approach, from the case study</text>`;
  y += 26;
  for (const [i, a] of approach.slice(0, 4).entries()) {
    const ls = wrap(a, 38);
    body += `<text x="${fx}" y="${y}" class="t-small t-em-ink">${String(i + 1).padStart(2, "0")}</text>${lines(fx + 28, y, a, 38, 18, "t-small")}`;
    y += ls.length * 18 + 8;
  }
  const h = y + 8;
  return psvg(h, `${body}`, "em-budget-p", "drawing--em");
};

/* ---------------------------------------------------------------------------------------- */
/* Sheet 00 · the opening. Each featured bay is cut by the A–A line: the shipped interface      */
/* above it, the system behind it below, drawn in light line on the dark interior. Sized for    */
/* any bay: the drawing hangs from the cut (xMidYMin slice), so a short bay keeps its top.      */
/* ---------------------------------------------------------------------------------------- */

const interior = (body, label, cls) =>
  svg(400, 240, body, label, `drawing--void ${cls}`, "xMidYMin slice");

export const lgInterior = (layers) =>
  interior(
    `<defs><pattern id="lg-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" class="v-hatch"/></pattern></defs>
    ${layers
      .map((l, i) => {
        const y = 16 + i * 36 + (i === 4 ? 10 : 0);
        return `<g class="v-slab">
        <rect x="24" y="${y}" width="352" height="26" class="${i === 4 ? "v-box v-box--prob" : "v-box"} ink" pathLength="1"/>
        <text x="36" y="${y + 17}" class="v-code">${String(i + 1).padStart(2, "0")}</text>
        <text x="64" y="${y + 17}" class="v-lab">${esc(l.label)}</text>
      </g>`;
      })
      .join("")}
    <path d="M12,165 H388" class="v-line lg ink" pathLength="1"/>
    <text x="388" y="160" class="v-note lg" text-anchor="end">review boundary</text>`,
    "LG-02",
    "drawing--lg"
  );

export const agInterior = (surfaces, layers) =>
  interior(
    `${surfaces
      .map((s, i) => {
        const x = 24 + i * 89;
        return `<rect x="${x}" y="16" width="81" height="36" class="v-box ink" pathLength="1"/>
        <text x="${x + 40.5}" y="38" class="v-lab v-lab--s" text-anchor="middle">${esc(s)}</text>
        <path d="M${x + 40.5},52 V82" class="v-line ag ink" pathLength="1"/>`;
      })
      .join("")}
    <rect x="24" y="82" width="352" height="38" class="v-box v-box--lib ag ink" pathLength="1"/>
    <text x="38" y="106" class="v-lab">${esc(layers[1].label)}</text>
    <path d="M200,120 V230" class="v-line ag ink" pathLength="1"/>
    <rect x="88" y="142" width="224" height="30" class="v-box v-box--dash ink" pathLength="1"/>
    <text x="200" y="162" class="v-lab" text-anchor="middle">${esc(layers[2].label)}</text>
    <path d="M88,196 H312 M88,190 V202 M163,190 V202 M237,190 V202 M312,190 V202" class="v-line ag ink" pathLength="1"/>
    <text x="200" y="222" class="v-lab" text-anchor="middle">${esc(layers[4].label)}</text>`,
    "AG-02",
    "drawing--ag"
  );

export const emInterior = () =>
  interior(
    `<rect x="24" y="16" width="352" height="134" class="v-box ink" pathLength="1"/>
    <text x="36" y="36" class="v-lab">React product composition</text>
    ${[0, 1, 2].map((i) => `<rect x="36" y="${50 + i * 30}" width="68" height="20" class="v-box v-box--s"/>`).join("")}
    <rect x="120" y="48" width="244" height="92" class="v-box v-box--dash em ink" pathLength="1"/>
    <text x="132" y="66" class="v-lab v-lab--em">D3.js chart behavior</text>
    <path d="${pathOf(series(40, 7, 50, 3.2), 132, 352, 74, 132, 18, 84)}" class="v-chart ink" pathLength="1"/>
    <path d="M24,166 H376 M24,160 V172 M120,160 V172 M376,160 V172" class="v-line em ink" pathLength="1"/>
    <text x="72" y="186" class="v-note em" text-anchor="middle">React</text>
    <text x="248" y="186" class="v-note em" text-anchor="middle">D3</text>
    <path d="M24,212 H376" class="v-rule"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${24 + i * 58.67},206 V218" class="v-rule"/>`).join("")}
    <text x="24" y="234" class="v-note">16.7 ms reference · 60 Hz · not a measurement</text>`,
    "EM-02",
    "drawing--em"
  );
