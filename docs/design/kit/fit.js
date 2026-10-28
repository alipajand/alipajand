(() => {
  const TITLES = ".name, [data-fit], h1, h2, h3, .next strong, .pager strong";
  const measure = (el, cs) => {
    if (el.classList.contains("name") && el.children.length) {
      const kids = [...el.children], gap = parseFloat(cs.columnGap) || 0;
      return kids.reduce((w, k) => w + parseFloat(getComputedStyle(k).width), 0) + gap * (kids.length - 1);
    }
    el.style.overflowWrap = "normal";
    const used = el.scrollWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    el.style.overflowWrap = "";
    return used;
  };
  const fit = (el) => {
    el.style.removeProperty("font-size");
    const grow = el.hasAttribute("data-grow");
    for (let i = 0; i < 4; i++) {
      const cs = getComputedStyle(el);
      const room = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const used = measure(el, cs);
      if (room <= 0 || used <= 0) return;
      if (!grow && used <= room + 0.5) return;
      const scale = Math.min(grow ? 1.5 : 1, (room / used) * 0.97);
      const size = parseFloat(cs.fontSize) * scale;
      el.style.fontSize = `${(grow ? Math.min(size, el.clientWidth * 0.16) : size).toFixed(1)}px`;
      if (grow) return;
    }
  };
  const fitAll = () => document.querySelectorAll(TITLES).forEach(fit);
  fitAll();
  document.fonts?.ready.then(fitAll);
  document.fonts?.addEventListener?.("loadingdone", fitAll);
  addEventListener("resize", fitAll);
  let queued = false;
  new MutationObserver((records) => {
    const changed = records.some((r) => (r.target.nodeType === 1 && r.target.matches(TITLES)) || [...r.addedNodes].some((n) => n.nodeType === 1));
    if (queued || !changed) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fitAll(); });
  }).observe(document.body, { childList: true, subtree: true });
})();
