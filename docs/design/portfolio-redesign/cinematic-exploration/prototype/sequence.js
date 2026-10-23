// Section A–A: the scroll choreography.
//
// The page is complete without this file. With motion on and GSAP loaded, the stage becomes
// sticky and one timeline, scrubbed by native scroll, plays four movements:
//   1. the cut opens: the two halves of the cover sheet part along the section line;
//   2. the camera tilts: the screenshot inside becomes the top sheet of an exploded stack;
//   3. the camera descends: one sheet per layer comes into focus while its text scrolls past;
//   4. the boundary: a red plane rises through every sheet and uncovers the workspace, whose
//      review states play over the rest of the step; then the stack collapses.
// Text never moves with the stage: it scrolls natively in its own column. Nothing here touches
// scroll position, history, or anchors.
(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "aa-motion";
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  function motionOn() {
    return root.dataset.motion === "full";
  }

  function syncToggle() {
    document.querySelectorAll("[data-motion-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(motionOn()));
      var label = b.querySelector("[data-motion-label]");
      if (label) label.textContent = motionOn() ? "Motion on" : "Motion off";
    });
  }

  function setMotion(value, persist) {
    root.dataset.motion = value;
    if (persist) {
      try {
        localStorage.setItem(KEY, value);
      } catch {
        /* storage unavailable: the choice lasts for this page */
      }
    }
    syncToggle();
    build();
  }

  mq.addEventListener("change", function () {
    if (!stored()) setMotion(mq.matches ? "reduce" : "full", false);
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-motion-toggle]")) setMotion(motionOn() ? "reduce" : "full", true);
  });

  ["pageswap", "pagereveal"].forEach(function (type) {
    window.addEventListener(type, function (e) {
      if (e.viewTransition && !motionOn()) e.viewTransition.skipTransition();
    });
  });

  /* ---------- the workspace states (work in every mode) ---------- */

  var WS_KEYS = ["ready", "partial", "confirmed"];

  function setWs(key, announce) {
    document.querySelectorAll("[data-ws]").forEach(function (el) {
      el.dataset.state = key;
    });
    document.querySelectorAll("[data-ws-to]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.wsTo === key));
      if (announce && btn.dataset.wsTo === key) {
        document.querySelector("[data-ws-live]").textContent =
          "Showing " +
          btn.querySelector("span").textContent.toLowerCase() +
          ": " +
          btn.querySelector("small").textContent +
          ".";
      }
    });
  }

  function initWorkspace() {
    var card = document.querySelector("[data-ws-card]");
    if (!card) return;
    card.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-ws-to]");
      if (btn) setWs(btn.dataset.wsTo, true);
    });
  }

  /* ---------- bar tone: read the ground actually under the bar ---------- */

  var toneQueued = false;
  function tone() {
    toneQueued = false;
    var hits = document.elementsFromPoint(window.innerWidth / 2, 44);
    var t = "";
    for (var i = 0; i < hits.length; i++) {
      if (hits[i].closest(".bar")) continue;
      var host = hits[i].closest("[data-tone]");
      if (host) {
        t = host.dataset.tone;
        break;
      }
    }
    if (root.dataset.tone !== t) root.dataset.tone = t;
  }
  function queueTone() {
    if (!toneQueued) {
      toneQueued = true;
      requestAnimationFrame(tone);
    }
  }
  window.addEventListener(
    "scroll",
    function () {
      queueTone();
    },
    { passive: true }
  );

  /* ---------- the sequence ---------- */

  var ctx = null;
  var built = false;

  function build() {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    var live = motionOn() && window.gsap && window.ScrollTrigger;
    root.classList.toggle("motion-live", !!live);
    if (!live) {
      root.dataset.ground = "";
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    ctx = gsap.context(sequence);
    built = true;
  }

  function sequence() {
    var seq = document.getElementById("sequence");
    var stage = seq.querySelector("[data-stage]");
    var rig = stage.querySelector('[data-rig="stage"]');
    var plates = [1, 2, 3, 4, 5].map(function (k) {
      return rig.querySelector('[data-plate="' + k + '"]');
    });
    var top = stage.querySelector('[data-panel="top"]');
    var bottom = stage.querySelector('[data-panel="bottom"]');
    var faces = stage.querySelectorAll(".cutface");
    var cut = stage.querySelector(".cut");
    var floor = rig.querySelector(".floor");
    var boundary = rig.querySelector("[data-boundary]");
    var scene = stage.querySelector(".scene");
    var ws = stage.querySelector(".ws");
    var links = Array.prototype.slice.call(stage.querySelectorAll("[data-layers] a"));

    var vh = window.innerHeight;
    var vw = window.innerWidth;
    var wide = vw >= 900;
    var total = seq.offsetHeight - vh;
    var beat = function (name) {
      return seq.querySelector('[data-beat="' + name + '"]');
    };
    var p = function (px) {
      return Math.max(0, Math.min(1, px / total));
    };
    // scroll distance at which an element's top sits at a fraction of the viewport
    var when = function (el, frac) {
      return p(el.offsetTop - vh * frac);
    };

    var GAP = wide ? 150 : 96;
    var TILT_X = 56;
    var SIN = Math.sin((TILT_X * Math.PI) / 180);
    var baseX = wide ? -vw * 0.19 : 0;
    var baseY = wide ? 0 : -vh * 0.2;

    // Screen offset of sheet k (1-based) from the top sheet, for a given rig scale and twist.
    function offsetOf(k, scale, twist) {
      var d = (k - 1) * GAP * SIN * scale;
      var r = (twist * Math.PI) / 180;
      return { x: -d * Math.sin(r), y: d * Math.cos(r) };
    }

    function inks(k) {
      return plates[k - 1].querySelectorAll(
        ".ink:not(.tenant):not(.store--suggested):not(.wire--red)"
      );
    }

    gsap.set(rig, { rotationX: 0, rotationZ: 0, scale: wide ? 0.84 : 0.92, x: 0, y: baseY * 0.4 });
    plates.forEach(function (pl, i) {
      gsap.set(pl, { z: -i * 2, opacity: i === 0 ? 1 : 0 });
    });
    [2, 3, 4, 5].forEach(function (k) {
      gsap.set(inks(k), { strokeDasharray: "1 1", strokeDashoffset: 1 });
    });
    gsap.set(boundary, { opacity: 0, clipPath: "inset(100% 0 0 0)" });
    gsap.set(ws, { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(scene, { opacity: 1 });

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      // The scrub keeps moving the paper panels after scrolling stops; re-read the ground as it does.
      onUpdate: queueTone,
      scrollTrigger: {
        trigger: seq,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.9,
        onUpdate: update,
      },
    });
    tl.set({}, {}, 1);

    /* 1 · the cut opens */
    var open = beat("open");
    var a1 = p(open.offsetHeight * 0.95);
    var lead = Math.min(0.012, a1 * 0.1);
    tl.to(top, { y: 8, duration: lead, ease: "power1.in" }, 0);
    tl.to(bottom, { y: -8, duration: lead, ease: "power1.in" }, 0);
    tl.to(faces, { opacity: 1, duration: lead }, lead);
    tl.to(cut, { opacity: 0, duration: a1 * 0.2 }, lead);
    tl.to(
      stage.querySelectorAll(".panel__head, .panel__foot"),
      { opacity: 0, duration: a1 * 0.35 },
      lead
    );
    tl.to(top, { y: 0, yPercent: -102, duration: a1 - lead, ease: "power3.inOut" }, lead);
    tl.to(bottom, { y: 0, yPercent: 102, duration: a1 - lead, ease: "power3.inOut" }, lead);
    tl.to(rig, { scale: wide ? 0.94 : 1, y: baseY * 0.4, duration: a1, ease: "power1.out" }, 0);
    // as the cut finishes opening, the interface drifts aside to make room for the reading column
    if (wide)
      tl.to(
        rig,
        { x: baseX * 0.8, scale: 0.84, duration: a1 * 0.45, ease: "power2.inOut" },
        a1 * 0.55
      );

    /* 2 · the camera tilts: the interface becomes the top sheet */
    var intro = beat("intro");
    var t0 = a1;
    var t1 = Math.max(t0 + 0.02, when(intro, 0.25));
    var s1 = wide ? 0.54 : 0.6;
    tl.to(
      rig,
      {
        rotationX: TILT_X,
        rotationZ: -36,
        scale: s1,
        x: baseX,
        y: baseY - vh * 0.12,
        duration: t1 - t0,
        ease: "power2.inOut",
      },
      t0
    );
    plates.forEach(function (pl, i) {
      tl.to(pl, { z: -i * GAP, opacity: 1, duration: t1 - t0, ease: "power2.inOut" }, t0);
    });
    tl.to(floor, { opacity: 1, duration: t1 - t0 }, t0);

    /* 3 · the camera descends, one sheet at a time */
    function focus(k, at, until, twist, scale) {
      var o = offsetOf(k, scale, twist);
      var d = until - at;
      tl.to(
        rig,
        {
          rotationZ: twist,
          scale: scale,
          x: baseX - o.x,
          y: baseY - o.y,
          duration: d,
          ease: "power2.inOut",
        },
        at
      );
      plates.forEach(function (pl, i) {
        var j = i + 1;
        tl.to(
          pl,
          {
            opacity: j < k ? 0.06 : 1,
            "--shade": j > k ? 0.55 : 0,
            z: -i * GAP + (j === k ? 36 : 0),
            duration: d,
            ease: "power2.inOut",
          },
          at
        );
      });
      if (k > 1)
        tl.to(
          inks(k),
          { strokeDashoffset: 0, duration: d * 0.9, ease: "power1.out" },
          at + d * 0.1
        );
    }

    var steps = ["layer-interface", "layer-api", "layer-data", "layer-jobs", "layer-boundary"].map(
      function (id) {
        return document.getElementById(id);
      }
    );
    var sF = wide ? 0.74 : 0.7;
    focus(1, when(steps[0], 0.85), when(steps[0], 0.3), -36, sF);
    focus(2, when(steps[1], 0.85), when(steps[1], 0.3), -34, sF);
    focus(3, when(steps[2], 0.85), when(steps[2], 0.3), -32, sF);
    focus(4, when(steps[3], 0.85), when(steps[3], 0.3), -30, sF);
    // the jobs step covers two sheets: the queue, then the worker beneath it
    var mid = steps[3].offsetTop + steps[3].offsetHeight * 0.5;
    focus(5, p(mid - vh * 0.55), p(mid - vh * 0.1), -29, sF);

    /* 4 · the boundary: pull back, raise the red plane through every sheet */
    var b0 = when(steps[4], 0.85);
    var b1 = when(steps[4], 0.25);
    var s4 = wide ? 0.5 : 0.56;
    var o4 = offsetOf(3.4, s4, -26);
    tl.to(
      rig,
      {
        rotationZ: -26,
        scale: s4,
        x: baseX - o4.x,
        y: baseY - o4.y,
        duration: b1 - b0,
        ease: "power2.inOut",
      },
      b0
    );
    plates.forEach(function (pl, i) {
      tl.to(
        pl,
        {
          opacity: i === 0 ? 0.85 : 1,
          "--shade": i === 0 ? 0 : 0.12 * i,
          z: -i * GAP,
          duration: b1 - b0,
          ease: "power2.inOut",
        },
        b0
      );
    });
    tl.to(boundary, { opacity: 1, duration: (b1 - b0) * 0.3 }, b0 + (b1 - b0) * 0.4);
    tl.to(
      boundary,
      { clipPath: "inset(0% 0 0 0)", duration: (b1 - b0) * 0.6, ease: "power2.out" },
      b0 + (b1 - b0) * 0.4
    );

    /* the plane has risen: it uncovers the workspace, in the same direction, and the stack
       recedes behind it. Its review states then follow the reader through the step. */
    var col = beat("collapse");
    var c0 = p(col.offsetTop - vh * 0.7);
    var cm = p(col.offsetTop + col.offsetHeight * 0.35 - vh * 0.5);
    var w0 = b1;
    var w1 = w0 + (c0 - w0) * 0.18;
    var t1 = w0 + (c0 - w0) * 0.42;
    var t2 = w0 + (c0 - w0) * 0.68;
    tl.set(ws, { autoAlpha: 1 }, w0);
    tl.to(ws, { clipPath: "inset(0% 0% 0% 0%)", duration: w1 - w0, ease: "power2.out" }, w0);
    tl.to(scene, { opacity: 0.22, duration: w1 - w0 }, w0);
    var wx = (cm - c0) * 0.35;
    tl.to(ws, { clipPath: "inset(0% 0% 100% 0%)", duration: wx, ease: "power2.in" }, c0);
    tl.to(scene, { opacity: 1, duration: wx }, c0);
    tl.set(ws, { autoAlpha: 0 }, c0 + wx);

    /* collapse: the sheets come back together into the shipped interface, then the cut closes
       over it, so the sequence ends on paper, where the readable story begins */
    var c1 = 1;
    tl.to(boundary, { opacity: 0, duration: (cm - c0) * 0.3 }, c0);
    tl.to(
      rig,
      {
        rotationX: 0,
        rotationZ: 0,
        scale: wide ? 0.62 : 0.86,
        x: 0,
        y: 0,
        duration: cm - c0,
        ease: "power2.inOut",
      },
      c0
    );
    plates.forEach(function (pl, i) {
      tl.to(
        pl,
        {
          z: -i * 2,
          opacity: i === 0 ? 1 : 0,
          "--shade": 0,
          duration: cm - c0,
          ease: "power2.inOut",
        },
        c0
      );
    });
    tl.to(floor, { opacity: 0, duration: (cm - c0) * 0.6 }, c0);
    tl.set(stage.querySelectorAll(".name"), { opacity: 0 }, cm);
    tl.to(top, { yPercent: 0, duration: c1 - cm, ease: "power3.inOut" }, cm);
    tl.to(bottom, { yPercent: 0, duration: c1 - cm, ease: "power3.inOut" }, cm);
    tl.to(faces, { opacity: 0, duration: (c1 - cm) * 0.25 }, c1 - (c1 - cm) * 0.25);

    var marks = steps.map(function (s) {
      return s.offsetTop;
    });

    var seg = -1;

    function update(self) {
      var y = self.progress * total;
      var k =
        self.progress < w0 || self.progress >= c0
          ? -1
          : self.progress < t1
            ? 0
            : self.progress < t2
              ? 1
              : 2;
      if (k !== seg) {
        seg = k;
        if (k > -1) setWs(WS_KEYS[k], false);
      }
      root.dataset.ground = y > open.offsetHeight * 0.55 && self.progress < cm ? "void" : "";
      tone();
      var current = 0;
      marks.forEach(function (m, i) {
        if (y + vh * 0.5 >= m) current = i + 1;
      });
      links.forEach(function (a) {
        if (Number(a.dataset.to) === current) a.setAttribute("aria-current", "step");
        else a.removeAttribute("aria-current");
      });
    }

    // Arrivals mid-page (Back, anchors, rebuilds) start at the right frame instead of
    // scrubbing through everything above them.
    ScrollTrigger.refresh();
    tl.progress(tl.scrollTrigger.progress);
    update(tl.scrollTrigger);
  }

  var lastWidth = window.innerWidth;
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });

  syncToggle();
  initWorkspace();
  build();
  tone();
  window.AA = {
    rebuild: build,
    motionOn: motionOn,
    get built() {
      return built;
    },
  };
})();
