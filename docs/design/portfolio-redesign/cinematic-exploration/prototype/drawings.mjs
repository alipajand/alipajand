// Editorial drawings for the exploded LedgerGuard stack. Every label is a term from the
// LedgerGuard entry in data/projects.ts. None of these are product UI: each sheet carries a
// title strip that says "Editorial diagram", and only sheet LG-01 holds a real screenshot.
//
// All drawings share one 1000 x 646 viewBox (the screenshot's aspect ratio). Paths that should
// draw in on focus carry pathLength="1" and the class "ink".

const W = 1000;
const H = 646;

const strip = (code, title, kind) => `
  <g class="strip">
    <rect x="0" y="${H - 54}" width="${W}" height="54" class="strip__bg"/>
    <line x1="0" y1="${H - 54}" x2="${W}" y2="${H - 54}" class="hair"/>
    <text x="28" y="${H - 21}" class="t-code">${code}</text>
    <text x="150" y="${H - 21}" class="t-strip">${title}</text>
    <text x="${W - 28}" y="${H - 21}" class="t-kind" text-anchor="end">${kind}</text>
  </g>`;

const frame = `<rect x="14" y="14" width="${W - 28}" height="${H - 28}" class="frame"/>`;

const box = (x, y, w, h, label, cls = "") => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" class="box ink ${cls}" pathLength="1"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 7}" text-anchor="middle" class="t-box">${label}</text>`;

const arrow = (x1, y1, x2, y2) => `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="wire ink" pathLength="1"/>
  <path d="M${x2 - 10},${y2 - 6} L${x2},${y2} L${x2 - 10},${y2 + 6}" class="wire ink" pathLength="1"/>`;

const svg = (body, label) =>
  `<svg class="drawing" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" data-label="${label}">${body}</svg>`;

// LG-02 · the API: one request path through the rules the API owns.
export const api = () =>
  svg(
    `${frame}
    <text x="56" y="92" class="t-title">Request path</text>
    <text x="56" y="122" class="t-note">Deterministic contract data and API rules live here.</text>
    ${box(56, 236, 150, 92, "request")}
    ${arrow(206, 282, 262, 282)}
    ${box(262, 236, 150, 92, "auth")}
    ${arrow(412, 282, 468, 282)}
    ${box(468, 236, 176, 92, "tenant scope", "box--strong")}
    ${arrow(644, 282, 700, 282)}
    ${box(700, 236, 230, 92, "contract rules")}
    <path d="M815,328 V430 H330" class="wire ink" pathLength="1"/>
    <path d="M340,424 L330,430 L340,436" class="wire ink" pathLength="1"/>
    ${box(150, 392, 180, 76, "contract data")}
    <line x1="56" y1="520" x2="930" y2="520" class="dim"/>
    <line x1="56" y1="510" x2="56" y2="530" class="dim"/>
    <line x1="930" y1="510" x2="930" y2="530" class="dim"/>
    <text x="493" y="550" text-anchor="middle" class="t-dim">Node.js / Fastify · owns authentication and tenant scoping</text>
    ${strip("LG-02", "Node.js / Fastify API", "Editorial diagram")}`,
    "api"
  );

// LG-03 · the data model: tenant boundaries, and the two places a value can live.
const field = (y, key, label) => `
  <g class="chip" data-chip="${key}" data-state="suggested">
    <rect x="96" y="${y}" width="220" height="40" class="chip__box"/>
    <rect x="232" y="${y + 13}" width="70" height="14" class="chip__bar"/>
    <text x="110" y="${y + 26}" class="t-chip">${label}</text>
  </g>`;

export const data = () =>
  svg(
    `${frame}
    <defs>
      <pattern id="hatch-red" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="10" class="hatch-red"/>
      </pattern>
      <pattern id="hatch-ink" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="10" class="hatch-ink"/>
      </pattern>
    </defs>
    <rect x="56" y="70" width="600" height="440" class="tenant ink" pathLength="1"/>
    <text x="72" y="100" class="t-title">Tenant A</text>
    <rect x="76" y="130" width="292" height="340" class="store store--suggested ink" pathLength="1"/>
    <text x="90" y="160" class="t-store t-red">suggested</text>
    <rect x="388" y="130" width="248" height="340" class="store store--confirmed ink" pathLength="1"/>
    <text x="402" y="160" class="t-store">confirmed</text>
    ${field(196, "notice", "notice window")}
    ${field(256, "renewal", "renewal date")}
    ${field(316, "autorenew", "auto-renew")}
    <rect x="690" y="70" width="254" height="440" class="tenant ink" pathLength="1"/>
    <text x="706" y="100" class="t-title">Tenant B</text>
    <rect x="710" y="130" width="214" height="340" class="store ink" pathLength="1" fill="url(#hatch-ink)" fill-opacity="0.18"/>
    <text x="817" y="306" text-anchor="middle" class="t-note">out of scope</text>
    <text x="56" y="550" class="t-dim">Supabase PostgreSQL, Auth, Storage · suggested and confirmed values stored differently</text>
    ${strip("LG-03", "PostgreSQL data model", "Editorial diagram")}`,
    "data"
  );

// LG-04 · orchestration: the job contract between the API and the worker.
export const jobs = () =>
  svg(
    `${frame}
    <text x="56" y="92" class="t-title">Job contract</text>
    <text x="56" y="122" class="t-note">Document processing can retry or fail independently.</text>
    ${box(56, 250, 170, 92, "API")}
    ${arrow(226, 296, 300, 296)}
    <rect x="300" y="236" width="420" height="120" class="queue ink" pathLength="1"/>
    <line x1="384" y1="236" x2="384" y2="356" class="hair"/>
    <line x1="468" y1="236" x2="468" y2="356" class="hair"/>
    <line x1="552" y1="236" x2="552" y2="356" class="hair"/>
    <line x1="636" y1="236" x2="636" y2="356" class="hair"/>
    <rect x="316" y="268" width="52" height="56" class="job"/>
    <rect x="400" y="268" width="52" height="56" class="job"/>
    <rect x="484" y="268" width="52" height="56" class="job job--failed"/>
    <text x="510" y="384" text-anchor="middle" class="t-note t-red">failed · retry</text>
    <text x="510" y="214" text-anchor="middle" class="t-box">Redis / BullMQ</text>
    ${arrow(720, 296, 790, 296)}
    ${box(790, 250, 154, 92, "worker")}
    <path d="M867,342 V450 H510 V392" class="wire wire--red ink" pathLength="1"/>
    <path d="M504,402 L510,392 L516,402" class="wire wire--red ink" pathLength="1"/>
    <text x="56" y="550" class="t-dim">Redis/BullMQ orchestration · explicit job contracts</text>
    ${strip("LG-04", "Redis / BullMQ orchestration", "Editorial diagram")}`,
    "jobs"
  );

// LG-05 · extraction: where probabilistic output is produced, and why it stays suggested.
export const worker = () =>
  svg(
    `${frame}
    <text x="56" y="92" class="t-title">Extraction</text>
    <text x="56" y="122" class="t-note">Isolated from deterministic contract state.</text>
    <path d="M86,200 H206 L236,230 V420 H86 Z" class="doc ink" pathLength="1"/>
    <path d="M206,200 V230 H236" class="doc ink" pathLength="1"/>
    <line x1="106" y1="262" x2="214" y2="262" class="hair"/>
    <line x1="106" y1="290" x2="214" y2="290" class="hair"/>
    <line x1="106" y1="318" x2="190" y2="318" class="hair"/>
    <line x1="106" y1="346" x2="214" y2="346" class="hair"/>
    <text x="161" y="452" text-anchor="middle" class="t-note">contract PDF</text>
    ${arrow(250, 310, 320, 310)}
    ${box(320, 264, 190, 92, "AWS Textract")}
    ${arrow(510, 310, 580, 310)}
    ${box(580, 264, 190, 92, "OpenAI")}
    ${arrow(770, 310, 820, 310)}
    <rect x="820" y="250" width="124" height="120" class="store store--suggested ink" pathLength="1"/>
    <text x="882" y="316" text-anchor="middle" class="t-store t-red">suggested</text>
    <text x="56" y="550" class="t-dim">Python worker · AWS Textract and OpenAI extraction</text>
    ${strip("LG-05", "Python extraction worker", "Editorial diagram")}`,
    "worker"
  );
