  const dgHead = (title, label = "Diagram") => `<figcaption class="dg__head mono"><span>[ ${esc(label)} ]</span><span>${esc(title)}</span></figcaption>`;
  const dgCap = (caption) => caption ? `<p class="dg__cap">${esc(caption)}</p>` : "";
  const loopIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4"/></svg>`;

  const renderLayers = (s) => `
    <figure class="dg dg--layers">${dgHead(s.title)}
      <ol class="layers" data-light>${s.layers.map((l, i) => `<li><span class="mono">${pad(i)}</span><b>${esc(l.label)}</b>${l.detail ? `<span>${esc(l.detail)}</span>` : ""}</li>`).join("")}</ol>
      ${dgCap(s.caption)}
    </figure>`;

  const renderCompare = (s) => `
    <figure class="dg dg--compare">${dgHead(s.title)}
      <div class="compare" style="--cols:${s.columns.length}">${s.columns.map((c) => `<div><h4>${esc(c.label)}</h4><ul>${c.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
      ${dgCap(s.caption)}
    </figure>`;

  const renderFlow = (s, label = "Diagram") => `
    <figure class="dg dg--flow" data-flow>
      <figcaption class="dg__band-head"><span class="mono">[ ${esc(label)} ]</span><span class="dg__title">${esc(s.title)}</span></figcaption>
      <ol class="flow" style="--steps:${s.steps.length}">${s.steps.map((st, i) => `<li><span class="mono">Step ${pad(i)}</span><b>${esc(st.label)}</b>${st.detail ? `<p>${esc(st.detail)}</p>` : ""}</li>`).join("")}</ol>
      ${s.loop ? `<div class="flow__loop">${loopIcon}<span>${esc(s.loop)}</span></div>` : ""}
      ${s.caption ? `<p class="flow__cap">${esc(s.caption)}</p>` : ""}
    </figure>`;

  const renderDiagram = (s, label) =>
    s.type === "layers" ? renderLayers(s) : s.type === "compare" ? renderCompare(s) : renderFlow(s, label);

  let fontGen = 0;
  document.fonts?.addEventListener?.("loadingdone", () => { fontGen++; });
  document.fonts?.ready.then(() => { fontGen++; });
  const fitFlowLabels = (ol) => {
    const key = `${ol.clientWidth}:${fontGen}`;
    if (ol.dataset.fit === key) return;
    ol.dataset.fit = key;
    const labels = [...ol.querySelectorAll("li b")];
    if (!labels.length) return;
    labels.forEach((b) => { b.style.fontSize = ""; b.style.overflowWrap = "normal"; });
    let size = parseFloat(getComputedStyle(labels[0]).fontSize);
    while (size > 14 && labels.some((b) => b.scrollWidth > b.clientWidth + 1)) {
      size -= 1;
      labels.forEach((b) => { b.style.fontSize = `${size}px`; });
    }
    labels.forEach((b) => { b.style.overflowWrap = ""; });
  };

  const lightDiagrams = (vh) => {
    document.querySelectorAll(".dg--flow .flow").forEach(fitFlowLabels);
    document.querySelectorAll("[data-light]").forEach((box) => {
      const r = box.getBoundingClientRect(), items = box.children;
      const t = clamp((vh * .75 - r.top) / (r.height + vh * .2), 0, .999);
      const on = r.top < vh && r.bottom > 0 ? Math.floor(t * items.length) : -1;
      [...items].forEach((el, i) => el.classList.toggle("on", i === on));
    });
    document.querySelectorAll("[data-flow]").forEach((fig) => {
      const r = fig.getBoundingClientRect(), steps = fig.querySelectorAll(".flow li");
      const t = clamp((vh * .8 - r.top) / (r.height + vh * .1), 0, .999);
      const on = r.bottom <= 0 ? steps.length : r.top < vh ? Math.floor(t * steps.length) : -1;
      steps.forEach((el, i) => { el.classList.toggle("on", i === on); el.classList.toggle("done", i < on); });
    });
  };
