// Emplifi · rendering a dense chart in an embedded webview.
//
// Emplifi's drafting move is the measuring line, in ochre. There are no screenshots: every
// drawing is editorial, with fictional, unmeasured data, and nothing in the scene has a length
// that stands for a time or a saving. Four beats:
//   1. The webview: a dense chart inside a host app; an ochre cursor reads across it.
//   2. Profiling: the phone steps aside and the render path of one update is drawn station by
//      station, under a profiling line; the two stages the case study names are marked.
//   3. Composition: the module comes apart into its layers, React around D3.
//   4. The approach: a reference frame budget (one frame at 60 Hz, labelled as a reference),
//      an illustrative module tree, and a chart update that stays inside the chart's branch.
// Then the match cut: the webview drawing lands in the case study's hero.
AA.scene(function (S) {
  var stage = S.stage;
  // inks come from the page's tokens, so the timeline follows the palette
  var ink = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };
  var q = function (sel) {
    return stage.querySelector(sel);
  };
  var qa = function (sel) {
    return Array.prototype.slice.call(stage.querySelectorAll(sel));
  };

  var phone = q("[data-phone]");
  var cursor = q("[data-phone] .cursor");
  var webview = q("[data-phone] .webview");
  var path = q("[data-path]");
  var probe = qa("[data-path] .probe:not(.probe--drop)");
  var stations = qa("[data-path] .station");
  var finds = qa("[data-path] .find");
  var layers = q("[data-layers]");
  var lyrs = qa("[data-layers] .lyr");
  var dims = qa("[data-layers] .dim, [data-layers] .t-em-ink");
  var budget = q("[data-budget]");
  var refInk = qa("[data-budget] .ref .ink");
  var treeInk = qa("[data-budget] .tree .ink:not(.update)");
  var update = qa("[data-budget] .update");
  var stamp = q("[data-stamp]");
  var win = q("[data-win]");

  gsap.set([phone, path, budget], { transformOrigin: "0 0" });
  gsap.set([path, layers, budget, stamp], { autoAlpha: 0 });
  gsap.set(finds, { autoAlpha: 0 });
  gsap.set(probe.concat(refInk, treeInk, update, qa("[data-path] .station .ink")), {
    strokeDashoffset: 1,
  });

  var steps = ["#chart", "#path", "#composition", "#budget"].map(function (id) {
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
  S.at(webview, { stroke: ink("--em"), strokeWidth: 3 }, f(0, 0.1), f(0, 0.3));

  /* 2 · profiling: the line goes down first, then each station in order along the path */
  S.at(phone, Object.assign({ ease: "power2.inOut" }, ASIDE), f(1, 0), f(1, 0.28));
  S.from(path, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, f(1, 0.14), f(1, 0.28));
  S.at(probe, { strokeDashoffset: 0 }, f(1, 0.24), f(1, 0.36));
  stations.forEach(function (g, i) {
    S.at(
      g.querySelectorAll(".ink"),
      { strokeDashoffset: 0 },
      f(1, 0.3 + i * 0.07),
      f(1, 0.4 + i * 0.07)
    );
  });
  S.from(
    finds,
    { autoAlpha: 0, y: 8 },
    { autoAlpha: 1, y: 0, stagger: 0.01 },
    f(1, 0.66),
    f(1, 0.78)
  );

  /* 3 · composition */
  S.at(path, { autoAlpha: 0, y: -24 }, f(2, 0), f(2, 0.14));
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

  /* 4 · the approach: the reference ruler, then the tree, then the update's own route */
  S.at(layers, { autoAlpha: 0 }, f(3, 0), f(3, 0.12));
  S.from(budget, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0 }, f(3, 0.08), f(3, 0.2));
  S.at(refInk, { strokeDashoffset: 0 }, f(3, 0.18), f(3, 0.3));
  S.at(treeInk, { strokeDashoffset: 0, stagger: 0.004 }, f(3, 0.28), f(3, 0.48));
  S.at(update, { strokeDashoffset: 0 }, f(3, 0.5), f(3, 0.64));
  S.from(stamp, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0 }, f(3, 0.66), f(3, 0.78));

  /* the match cut: the drawing returns to its first state and lands in the hero */
  var w = 1 - L0;
  S.at([budget, stamp], { autoAlpha: 0 }, L0 + w * 0.12, L0 + w * 0.24);
  if (win) S.at(win, { autoAlpha: 0 }, L0 + w * 0.24, L0 + w * 0.36);
  S.at(cursor, { attr: { x1: CURSOR, x2: CURSOR } }, L0 + w * 0.12, L0 + w * 0.22);
  S.at(webview, { stroke: ink("--ink-2"), strokeWidth: 1.5 }, L0 + w * 0.12, L0 + w * 0.22);
  S.at(phone, { autoAlpha: 1 }, L0 + w * 0.18, L0 + w * 0.28);
  S.land(phone, { x: 420, y: 40, w: 360 }, L0 + w * 0.24);
});
