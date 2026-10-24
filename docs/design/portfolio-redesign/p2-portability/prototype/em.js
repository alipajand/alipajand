// Emplifi · the cost of drawing a dense chart in a mobile webview.
//
// Emplifi's drafting move is the measuring line and the time axis, in ochre. There are no
// screenshots: every drawing is editorial, with illustrative data. Four beats:
//   1. The webview: a dense chart inside a host app; an ochre cursor reads across it.
//   2. Profiling: the phone steps aside and one update unfolds on a frame timeline. The work
//      spills past its frame; the frames it spills into are marked.
//   3. Composition: the module comes apart into its four layers, React around D3.
//   4. The decision: the same update with the unnecessary work cut. The spill closes, and
//      release monitoring follows.
// Then the match cut: the webview drawing lands in the case study's hero.
AA.scene(function (S) {
  var stage = S.stage;
  var q = function (sel) {
    return stage.querySelector(sel);
  };
  var qa = function (sel) {
    return Array.prototype.slice.call(stage.querySelectorAll(sel));
  };

  var phone = q("[data-phone]");
  var cursor = q("[data-phone] .cursor");
  var webview = q("[data-phone] .webview");
  var tlSheet = q("[data-tl]");
  var tlSvg = q("[data-tl] svg");
  var blocks = qa("[data-tl] .blk__box");
  var misses = qa("[data-tl] .miss > *");
  var layers = q("[data-layers]");
  var lyrs = qa("[data-layers] .lyr");
  var dims = qa("[data-layers] .dim, [data-layers] .t-em-ink");
  var stamp = q("[data-stamp]");
  var win = q("[data-win]");

  gsap.set([phone, tlSheet], { transformOrigin: "0 0" });
  gsap.set([tlSheet, layers, stamp], { autoAlpha: 0 });

  // the after layout of the timeline, read from the drawing itself: each block shrinks to its
  // illustrative share and the blocks close up behind it
  var gap = 6;
  var x = parseFloat(blocks[0].getAttribute("x"));
  var before = blocks.map(function (b) {
    return { x: parseFloat(b.getAttribute("x")), w: parseFloat(b.getAttribute("width")) };
  });
  var after = blocks.map(function (b, i) {
    var k = parseFloat(b.parentNode.getAttribute("data-k"));
    var out = { x: x, w: before[i].w * k };
    x += out.w + gap;
    return out;
  });

  var steps = ["#chart", "#cost", "#composition", "#after"].map(function (id) {
    return S.start(document.querySelector(id));
  });
  var L0 = S.landStart;
  var ends = steps.slice(1).concat(L0);
  var f = function (i, t) {
    return steps[i] + (ends[i] - steps[i]) * t;
  };
  var CURSOR = 210;
  var ASIDE = { x: -400, y: 140, scale: 0.5 };

  /* 1 · the webview */
  S.from(
    cursor,
    { attr: { x1: CURSOR, x2: CURSOR } },
    { attr: { x1: 66, x2: 66 }, ease: "power1.inOut" },
    f(0, 0),
    f(0, 0.2)
  );
  S.at(cursor, { attr: { x1: 354, x2: 354 }, ease: "power1.inOut" }, f(0, 0.2), f(0, 0.7));
  S.at(webview, { stroke: "#a8670a", strokeWidth: 3 }, f(0, 0.1), f(0, 0.3));

  /* 2 · profiling */
  S.at(phone, Object.assign({ ease: "power2.inOut" }, ASIDE), f(1, 0), f(1, 0.3));
  S.from(tlSheet, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0 }, f(1, 0.16), f(1, 0.32));
  blocks.forEach(function (b, i) {
    S.from(
      b,
      { attr: { width: 0 } },
      { attr: { width: before[i].w }, ease: "power1.out" },
      f(1, 0.3 + i * 0.08),
      f(1, 0.4 + i * 0.08)
    );
  });
  S.from(misses, { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.01 }, f(1, 0.62), f(1, 0.78));

  /* 3 · composition */
  S.at(tlSheet, { autoAlpha: 0, y: -30 }, f(2, 0), f(2, 0.14));
  S.at(phone, { autoAlpha: 0 }, f(2, 0), f(2, 0.14));
  S.at(layers, { autoAlpha: 1 }, f(2, 0.1), f(2, 0.2));
  lyrs.forEach(function (g, i) {
    S.from(
      g,
      { y: (lyrs.length - 1 - i) * 112 },
      { y: 0, ease: "power2.out" },
      f(2, 0.18),
      f(2, 0.5 + i * 0.04)
    );
  });
  S.from(dims, { autoAlpha: 0 }, { autoAlpha: 1 }, f(2, 0.56), f(2, 0.7));

  /* 4 · the decision */
  S.at(layers, { autoAlpha: 0 }, f(3, 0), f(3, 0.12));
  S.at(phone, { autoAlpha: 1 }, f(3, 0.08), f(3, 0.2));
  S.at(tlSheet, { autoAlpha: 1, y: 0 }, f(3, 0.08), f(3, 0.2));
  var swap = f(3, 0.2);
  S.onUpdate(function (pr) {
    var on = pr >= swap && pr < L0 + (1 - L0) * 0.2;
    if (on !== tlSvg.classList.contains("is-after")) tlSvg.classList.toggle("is-after", on);
  });
  blocks.forEach(function (b, i) {
    S.at(
      b,
      { attr: { x: after[i].x, width: after[i].w }, ease: "power2.inOut" },
      f(3, 0.24),
      f(3, 0.56)
    );
  });
  S.at(misses, { autoAlpha: 0 }, f(3, 0.4), f(3, 0.56));
  S.from(stamp, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0 }, f(3, 0.62), f(3, 0.76));

  /* the match cut: the drawing is returned to its first state, then lands */
  var w = 1 - L0;
  S.at([tlSheet, stamp], { autoAlpha: 0 }, L0, L0 + w * 0.14);
  if (win) S.at(win, { autoAlpha: 0 }, L0, L0 + w * 0.3);
  S.at(cursor, { attr: { x1: CURSOR, x2: CURSOR } }, L0, L0 + w * 0.2);
  S.at(webview, { stroke: "#4b463c", strokeWidth: 1.5 }, L0, L0 + w * 0.2);
  S.land(phone, { x: 420, y: 40, w: 360 }, L0 + w * 0.12);
});
