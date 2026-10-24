// AlwaysGeeky · from the interface to the shared component system under it.
//
// AlwaysGeeky's drafting move is the detail callout. Four beats over one 2D canvas:
//   1. Detail: blue callouts mark two parts of the shipped marketplace screenshot, and a lens
//      lifts one of them out, enlarged. The lens holds a crop of the same screenshot.
//   2. Assembly: the screenshot steps back into one of four surfaces, all standing on one
//      shared library. Two surfaces have shipped screenshots; two are marked as openings.
//   3. Contract and gates: the camera follows the blue line down, to the Storybook contract,
//      then to the CI gates.
//   4. Match cut: the marketplace screenshot lands in the case study's hero.
AA.scene(function (S) {
  var stage = S.stage;
  var q = function (sel) {
    return stage.querySelector(sel);
  };
  var qa = function (sel) {
    return Array.prototype.slice.call(stage.querySelectorAll(sel));
  };

  var world = q("[data-world]");
  var plate = q("[data-plate]");
  var dim = q("[data-dim]");
  var lens = q("[data-lens]");
  var lensL = q("[data-lens-label]");
  var callSvg = q(".ag-callouts");
  var calls = qa(".ag-callouts .ink");
  var tags = qa("[data-tag]");
  var plateL = q("[data-plate-l]");
  var surfs = qa("[data-surf]");
  var surfL = qa("[data-surf-l]");
  var band = q("[data-band]");
  var wires = q(".ag-wires");
  var drops = qa("[data-drop]");
  var bus = qa("[data-bus]");
  var contract = q("[data-sheet=contract]");
  var gates = q("[data-sheet=gates]");
  var ticks = qa("[data-sheet=contract] .ink");
  var gateInk = qa("[data-sheet=gates] .ink");
  var win = q("[data-win]");

  gsap.set([world, plate], { transformOrigin: "0 0" });
  gsap.set([lens, lensL, tags, surfs, surfL, band, contract, gates], { autoAlpha: 0 });
  gsap.set([callSvg, wires], { autoAlpha: 1 });
  gsap.set(calls.concat(drops, bus, ticks, gateInk), { strokeDashoffset: 1 });

  var steps = ["#detail", "#assembly", "#gates"].map(function (id) {
    return S.start(document.querySelector(id));
  });
  var L0 = S.landStart;
  var ends = steps.slice(1).concat(L0);
  // a fraction of a step's span: motion happens while the card arrives, then holds
  var f = function (i, x) {
    return steps[i] + (ends[i] - steps[i]) * x;
  };

  // the lens sits exactly over the listing card, at the screenshot's own scale
  var LENS = { cx: 180.6, cy: 687.9 };
  var SLAB = { cx: 597.5, cy: 476 };
  var SURF = { x: 60, y: 120, w: 250 };
  // the assembly is framed a little closer: its group (60–1135 by 120–522) centred on canvas
  var CLOSE = { scale: 1.1, x: 600 - 597.5 * 1.1, y: 400 - 321 * 1.1 };

  /* 1 · detail */
  S.at(calls.slice(0, 2), { strokeDashoffset: 0 }, f(0, 0), f(0, 0.25));
  S.at(tags[0], { autoAlpha: 1 }, f(0, 0.2), f(0, 0.3));
  S.at(calls.slice(2), { strokeDashoffset: 0 }, f(0, 0.12), f(0, 0.34));
  S.at(tags[1], { autoAlpha: 1 }, f(0, 0.3), f(0, 0.4));
  S.at(lens, { autoAlpha: 1 }, f(0, 0.4), f(0, 0.41));
  S.at(
    lens,
    { x: 600 - LENS.cx, y: 400 - LENS.cy, scale: 2.2, ease: "power2.inOut" },
    f(0, 0.4),
    f(0, 0.75)
  );
  S.at(dim, { opacity: 0.74 }, f(0, 0.4), f(0, 0.7));
  S.at([callSvg].concat(tags), { opacity: 0.4 }, f(0, 0.45), f(0, 0.7));
  S.at(lensL, { autoAlpha: 1 }, f(0, 0.66), f(0, 0.78));

  /* 2 · assembly */
  S.at(lensL, { autoAlpha: 0 }, f(1, 0), f(1, 0.08));
  S.at([callSvg, plateL].concat(tags), { autoAlpha: 0 }, f(1, 0), f(1, 0.12));
  S.at(
    lens,
    { x: SLAB.cx - LENS.cx, y: SLAB.cy - LENS.cy, scale: 0.3, ease: "power2.in" },
    f(1, 0),
    f(1, 0.42)
  );
  S.at(lens, { autoAlpha: 0 }, f(1, 0.36), f(1, 0.44));
  S.at(dim, { opacity: 0 }, f(1, 0.05), f(1, 0.35));
  S.at(
    plate,
    { x: SURF.x, y: SURF.y - 24, scale: SURF.w / 1200, ease: "power2.inOut" },
    f(1, 0.04),
    f(1, 0.46)
  );
  S.at(world, Object.assign({ ease: "power2.inOut" }, CLOSE), f(1, 0.04), f(1, 0.46));
  S.at(band, { autoAlpha: 1 }, f(1, 0.3), f(1, 0.31));
  S.from(band, { scaleX: 0 }, { scaleX: 1, ease: "power2.out" }, f(1, 0.3), f(1, 0.5));
  surfs.forEach(function (s, i) {
    S.from(
      s,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0 },
      f(1, 0.42 + i * 0.06),
      f(1, 0.56 + i * 0.06)
    );
  });
  S.at(surfL, { autoAlpha: 1 }, f(1, 0.5), f(1, 0.62));
  S.at(drops, { strokeDashoffset: 0 }, f(1, 0.56), f(1, 0.74));

  /* 3 · contract, then gates: the camera follows the blue line down; both sheets are drawn
     while the card is still being read */
  S.at(bus[0], { strokeDashoffset: 0 }, f(2, 0), f(2, 0.14));
  S.at(world, { scale: 1, x: 0, y: -823, ease: "power2.inOut" }, f(2, 0.02), f(2, 0.22));
  S.at([plate, band].concat(surfs, surfL), { autoAlpha: 0 }, f(2, 0.08), f(2, 0.18));
  S.at(contract, { autoAlpha: 1 }, f(2, 0.08), f(2, 0.16));
  S.at(ticks, { strokeDashoffset: 0, stagger: 0.015 }, f(2, 0.16), f(2, 0.28));
  S.at(bus[1], { strokeDashoffset: 0 }, f(2, 0.32), f(2, 0.4));
  S.at(world, { y: -1563, ease: "power2.inOut" }, f(2, 0.32), f(2, 0.52));
  S.at(contract, { autoAlpha: 0 }, f(2, 0.4), f(2, 0.5));
  S.at(gates, { autoAlpha: 1 }, f(2, 0.36), f(2, 0.44));
  S.at(gateInk, { strokeDashoffset: 0, stagger: 0.003 }, f(2, 0.44), f(2, 0.62));

  /* 4 · the match cut */
  var w = 1 - L0;
  S.at([gates, wires], { autoAlpha: 0 }, L0, L0 + w * 0.14);
  if (win) S.at(win, { autoAlpha: 0 }, L0, L0 + w * 0.3);
  S.tl.set(world, { x: 0, y: 0, scale: 1 }, L0 + w * 0.15);
  S.at(plate, { autoAlpha: 1 }, L0 + w * 0.16, L0 + w * 0.26);
  S.land(plate, { x: 0, y: 24, w: 1200 }, L0 + w * 0.2);
});
