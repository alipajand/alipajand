// Section A–A: the scroll choreography.
//
// The page is complete without this file: the cover is already cut open and shows the shipped
// interface, and every fact is in the text. The boot script lays out the animated version
// (.motion-live) before first paint, so nothing shifts; it is confirmed by .motion-ready only
// once GSAP and ScrollTrigger are present and the timeline has been built. If any of that
// fails, both classes come off and the page goes back to its static layout.
//
// One timeline, scrubbed by native scroll, plays four beats:
//   A. the cut opens and the interface comes forward;
//   B. it separates into its anatomy (desktop: an exploded stack of five sheets; narrow
//      screens: a drawn section of five bands);
//   C. the review boundary cuts through every layer and uncovers the workspace prototype,
//      whose review states advance with the reader;
//   D. the match cut: the screenshot settles into the story's figure as the dark interior
//      gives way to the story's sheet, and the stage lets go.
// Text never moves with the stage: it scrolls natively. Nothing here touches history; scroll
// position is only restored when a change of layout would otherwise lose the reader's place.
(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "aa-motion2";
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- the motion preference ---------- */

  function osMode() {
    return mq.matches ? "reduce" : "full";
  }

  function stored() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  }

  // A stored choice wins when the OS asks for nothing, or when it was itself made while the OS
  // asked for reduced motion. A choice made before the OS switched to reduced motion does not.
  function resolve() {
    var s = stored();
    var os = osMode();
    if (s && (s.m === "full" || s.m === "reduce")) {
      if (os === "full" || s.os === "reduce") return s.m;
    }
    return os;
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

  function apply(mode) {
    if (root.dataset.motion === mode) return;
    var place = keepPlace();
    root.dataset.motion = mode;
    syncToggle();
    build();
    place();
  }

  mq.addEventListener("change", function () {
    apply(resolve());
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-motion-toggle]")) return;
    var next = motionOn() ? "reduce" : "full";
    try {
      localStorage.setItem(KEY, JSON.stringify({ m: next, os: osMode() }));
    } catch {
      /* storage unavailable: the choice lasts for this page */
    }
    apply(next);
  });

  ["pageswap", "pagereveal"].forEach(function (type) {
    window.addEventListener(type, function (e) {
      if (e.viewTransition && !motionOn()) {
        // a skipped transition rejects its ready promise; nobody waits on it here
        e.viewTransition.ready.catch(function () {});
        e.viewTransition.skipTransition();
      }
    });
  });

  // When the layout changes under the reader (motion switched, or a failed build reverted),
  // keep the section they were reading at the same height on screen.
  function keepPlace() {
    var ids = ["work", "anatomy", "boundary", "project-ledgerguard", "contact"];
    var el = null;
    var off = 0;
    if (window.scrollY > 4) {
      ids.forEach(function (id) {
        var n = document.getElementById(id);
        if (n && n.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          el = n;
          off = n.getBoundingClientRect().top;
        }
      });
    }
    return function () {
      if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - off);
    };
  }

  /* ---------- the workspace states and the layer list (work in every mode) ---------- */

  // The buttons ship disabled, so a page without this file has no controls that do nothing.
  document.querySelectorAll("[data-ws-to], [data-layer-to]").forEach(function (b) {
    b.disabled = false;
  });

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

  document.addEventListener("click", function (e) {
    var ws = e.target.closest("[data-ws-to]");
    if (ws) setWs(ws.dataset.wsTo, true);
    var layer = e.target.closest("[data-layer-to]");
    if (layer) {
      var k = layer.dataset.layerTo;
      var on = root.dataset.focus !== k;
      if (on) root.dataset.focus = k;
      else delete root.dataset.focus;
      document.querySelectorAll("[data-layer-to]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(on && b.dataset.layerTo === k));
      });
    }
  });

  /* ---------- bar tone: read the ground actually under the bar ---------- */

  // While the sticky stage is on screen its own state says what is under the bar: the paper
  // cover, the dark interior, or the story's paper once the interior has faded.
  var stageTone = null;
  var toneQueued = false;
  function tone() {
    toneQueued = false;
    if (stageTone !== null && root.classList.contains("motion-live")) {
      var seq = document.getElementById("sequence");
      if (seq.getBoundingClientRect().bottom > window.innerHeight + 1) {
        if (root.dataset.tone !== stageTone) root.dataset.tone = stageTone;
        return;
      }
    }
    var hits = document.elementsFromPoint(window.innerWidth / 2, 44);
    var t = "";
    for (var i = 0; i < hits.length; i++) {
      if (hits[i].closest(".bar")) continue;
      var host = hits[i].closest("[data-tone]");
      if (host) {
        t = host.dataset.tone === "void" ? "void" : "";
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
  window.addEventListener("scroll", queueTone, { passive: true });

  /* ---------- the sequence ---------- */

  var ctx = null;

  function teardown() {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    root.classList.remove("motion-live", "motion-ready");
    delete root.dataset.landed;
    document.getElementById("sequence").style.removeProperty("--grid-y");
    stageTone = null;
  }

  // The rest pose is written once, in CSS, on .rest-probe: the same values the static cover
  // uses. GSAP starts from them so the first frame does not move when motion goes live.
  function restPose() {
    var cs = getComputedStyle(document.querySelector(".rest-probe"));
    var t = String(cs.translate).split(" ").map(parseFloat);
    var r = String(cs.rotate).match(/(-?[\d.]+)deg/);
    return {
      x: t[0] || 0,
      y: t[1] || 0,
      rotationX: r ? parseFloat(r[1]) : 0,
      rotationZ: 0,
      scale: parseFloat(cs.scale) || 1,
    };
  }

  function build() {
    teardown();
    if (!motionOn() || !window.gsap || !window.ScrollTrigger) {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      tone();
      return false;
    }
    root.classList.add("motion-live");
    try {
      var pose = restPose();
      gsap.registerPlugin(ScrollTrigger);
      // the context is kept even when the build throws, so teardown can revert what it set
      var failed = null;
      ctx = gsap.context(function () {
        try {
          sequence(pose);
        } catch (err) {
          failed = err;
        }
      });
      if (failed) throw failed;
      root.classList.add("motion-ready");
      return true;
    } catch (err) {
      teardown();
      if (window.console) console.warn("Section A–A: motion left off.", err);
      return false;
    } finally {
      tone();
    }
  }

  function sequence(pose) {
    var seq = document.getElementById("sequence");
    var stage = seq.querySelector("[data-stage]");
    var interior = stage.querySelector("[data-interior]");
    var voidEl = stage.querySelector("[data-void]");
    var scene = stage.querySelector(".scene");
    var rig = stage.querySelector("[data-rig]");
    var plates = [1, 2, 3, 4, 5].map(function (k) {
      return rig.querySelector('[data-plate="' + k + '"]');
    });
    var top = stage.querySelector('[data-panel="top"]');
    var bottom = stage.querySelector('[data-panel="bottom"]');
    var heads = stage.querySelectorAll(".panel__head, .panel__foot");
    var cut = stage.querySelector(".cut");
    var tag = stage.querySelector("[data-aperture-tag]");
    var floor = rig.querySelector(".floor");
    var boundary = rig.querySelector("[data-boundary]");
    var ws = stage.querySelector(".ws");
    var strata = stage.querySelector('[data-strata="stage"]');
    var story = document.getElementById("project-ledgerguard");
    var slot = story.querySelector("[data-slot]");
    var ledger = Array.prototype.slice.call(document.querySelectorAll("[data-ledger] li"));

    var vh = window.innerHeight;
    var stageW = stage.offsetWidth;
    var stageH = stage.offsetHeight;
    var wide = stageW >= 900;
    var total = seq.offsetHeight - vh;
    var seqTop = seq.getBoundingClientRect().top + window.scrollY;
    var topOf = function (el) {
      return el.getBoundingClientRect().top + window.scrollY - seqTop;
    };
    var beat = function (name) {
      return seq.querySelector('[data-beat="' + name + '"]');
    };
    var p = function (px) {
      return Math.max(0, Math.min(1, px / total));
    };
    var plateW = rig.offsetWidth;
    // the stack's poses are designed for a sheet of the old width; plates are drawn larger
    // and only ever scaled down, so the screenshot stays sharp
    var u = Math.min(stageW * 0.64, 1040) / plateW;
    var iT = topOf(beat("intro"));
    var aT = topOf(beat("anatomy"));
    var bT = topOf(beat("boundary"));
    var lT = topOf(beat("land"));

    // where the screenshot lands: the story's figure, as it sits when the stage lets go
    var sr = slot.getBoundingClientRect();
    var or = story.getBoundingClientRect();
    var land = {
      x: sr.left + sr.width / 2 - stageW / 2,
      y: sr.top - or.top + sr.height / 2 - stageH / 2,
      scale: sr.width / plateW,
      rotationX: 0,
      rotationZ: 0,
    };

    // the paper behind the stage continues the story's grid without a seam
    seq.style.setProperty("--grid-y", ((story.offsetTop - seq.offsetTop) % 24) + "px");

    gsap.set(rig, pose);
    plates.forEach(function (pl, i) {
      var p0 = { autoAlpha: i === 0 ? 1 : 0 };
      if (!root.classList.contains("depth-flat")) p0.z = -i * 2;
      gsap.set(pl, p0);
    });
    gsap.set(boundary, { opacity: 0, clipPath: "inset(100% 0 0 0)" });
    gsap.set(ws, { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)" });

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: function () {
        // the hand-off: once the scrubbed timeline itself has arrived, the story's own figure
        // takes over from the stage's, in the same place at the same size
        var tp = tl.progress();
        stageTone = tp < toneAt[0] || tp > toneAt[1] ? "" : "void";
        var landed = tp > 0.998;
        if (landed !== root.hasAttribute("data-landed")) {
          if (landed) root.dataset.landed = "";
          else delete root.dataset.landed;
        }
        queueTone();
      },
      scrollTrigger: {
        trigger: seq,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: update,
      },
    });
    tl.set({}, {}, 1);

    /* A · the cut opens: the paper halves part and the interface comes forward */
    var a1 = p(wide ? iT + vh * 0.2 : iT - vh * 0.15);
    tl.to(tag, { autoAlpha: 0, duration: a1 * 0.2 }, 0);
    tl.to(cut, { opacity: 0, duration: a1 * 0.3 }, 0);
    tl.to(heads, { opacity: 0, duration: a1 * 0.4 }, 0);
    tl.to(top, { yPercent: -104, duration: a1 * 0.8, ease: "power2.inOut" }, 0);
    tl.to(bottom, { yPercent: 104, duration: a1 * 0.8, ease: "power2.inOut" }, 0);

    var wsMarks = null;
    var drawMarks = [];
    var toneAt = [a1 * 0.45, 1];
    // the stacked anatomy needs 3D; where depth is flat, wide screens run the drawn section
    var flatDepth = root.classList.contains("depth-flat");
    if (wide && !flatDepth) desktop();
    else narrow();

    function desktop() {
      var GAP = 150 / u;
      var SIN = Math.sin((56 * Math.PI) / 180);
      var baseX = -stageW * 0.19;
      var offsetOf = function (k, scale, twist) {
        var d = (k - 1) * GAP * SIN * scale;
        var r = (twist * Math.PI) / 180;
        return { x: -d * Math.sin(r), y: d * Math.cos(r) };
      };
      var inks = function (k) {
        return plates[k - 1].querySelectorAll(
          ".ink:not(.tenant):not(.store--suggested):not(.wire--red)"
        );
      };
      [2, 3, 4, 5].forEach(function (k) {
        gsap.set(inks(k), { strokeDasharray: "1 1", strokeDashoffset: 1 });
      });

      // A: from the close-up in the cut to the whole interface, moved aside for the text
      tl.to(
        rig,
        { x: baseX, y: 0, rotationX: 0, scale: 0.74 * u, duration: a1, ease: "power2.inOut" },
        0
      );

      // B: the anatomy. One tilt separates all five sheets; the drawings ink in one after
      // another while the list beside them is read. The camera drifts down the stack.
      var b0 = a1;
      var b1 = p(aT + vh * 0.55);
      var bd = b1 - b0;
      var o3 = offsetOf(2.1, 0.54 * u, -32);
      tl.to(
        rig,
        {
          rotationX: 56,
          rotationZ: -36,
          scale: 0.54 * u,
          x: baseX,
          y: -vh * 0.12,
          duration: bd * 0.35,
          ease: "power2.inOut",
        },
        b0
      );
      plates.forEach(function (pl, i) {
        tl.to(pl, { z: -i * GAP, autoAlpha: 1, duration: bd * 0.35, ease: "power2.inOut" }, b0);
      });
      tl.to(floor, { opacity: 1, duration: bd * 0.35 }, b0);
      tl.to(
        rig,
        {
          rotationZ: -32,
          x: baseX - o3.x,
          y: -vh * 0.12 - o3.y * 0.5,
          duration: bd * 0.65,
          ease: "sine.inOut",
        },
        b0 + bd * 0.35
      );
      [2, 3, 4, 5].forEach(function (k, i) {
        tl.to(
          inks(k),
          { strokeDashoffset: 0, duration: bd * 0.22, ease: "power1.out" },
          b0 + bd * (0.3 + i * 0.16)
        );
      });

      // C: the boundary. Pull back, raise the red plane through every sheet, then uncover
      // the workspace in the same direction while the stack recedes behind it.
      var c0 = b1;
      var c1 = p(lT - vh * 1.05);
      var cd = c1 - c0;
      var o4 = offsetOf(3.4, 0.5 * u, -26);
      tl.to(
        rig,
        {
          rotationZ: -26,
          scale: 0.5 * u,
          x: baseX - o4.x,
          y: -o4.y,
          duration: cd * 0.25,
          ease: "power2.inOut",
        },
        c0
      );
      plates.forEach(function (pl, i) {
        tl.to(
          pl,
          { "--shade": i === 0 ? 0 : 0.12 * i, duration: cd * 0.25, ease: "power2.inOut" },
          c0
        );
      });
      tl.to(boundary, { opacity: 1, duration: cd * 0.08 }, c0 + cd * 0.1);
      tl.to(
        boundary,
        { clipPath: "inset(0% 0 0 0)", duration: cd * 0.2, ease: "power2.out" },
        c0 + cd * 0.1
      );
      var w0 = c0 + cd * 0.3;
      tl.set(ws, { autoAlpha: 1 }, w0);
      tl.to(ws, { clipPath: "inset(0% 0% 0% 0%)", duration: cd * 0.14, ease: "power2.out" }, w0);
      tl.to(scene, { opacity: 0.2, duration: cd * 0.14 }, w0);
      tl.to(
        ws,
        { clipPath: "inset(0% 0% 100% 0%)", duration: cd * 0.1, ease: "power2.in" },
        c1 - cd * 0.1
      );
      tl.to(scene, { opacity: 1, duration: cd * 0.1 }, c1 - cd * 0.1);
      tl.set(ws, { autoAlpha: 0 }, c1);
      states(w0 + cd * 0.26, w0 + cd * 0.46);

      // D: the match cut. The sheets close back into the one screenshot, which keeps moving,
      // now flat, into the story's figure while the interior fades to the story's paper.
      var d0 = c1;
      var dd = 1 - d0;
      tl.to(boundary, { opacity: 0, duration: dd * 0.25 }, d0);
      plates.forEach(function (pl, i) {
        tl.to(
          pl,
          {
            z: -i * 2,
            autoAlpha: i === 0 ? 1 : 0,
            "--shade": 0,
            duration: dd * 0.45,
            ease: "power2.inOut",
          },
          d0
        );
      });
      tl.to(floor, { opacity: 0, duration: dd * 0.3 }, d0);
      tl.to(
        rig,
        {
          rotationX: 0,
          rotationZ: 0,
          scale: 0.8 * u,
          // close up already over the figure's column, so the sheet never crosses the story's
          // heading on its way in
          x: land.x,
          y: 0,
          duration: dd * 0.45,
          ease: "power2.inOut",
        },
        d0
      );
      ride(d0 + dd * 0.45);
      tl.to(plates[0], { boxShadow: "0 0 0 0 rgba(0,0,0,0)", duration: dd * 0.3 }, d0 + dd * 0.5);
      tl.to(voidEl, { opacity: 0, duration: dd * 0.35, ease: "power1.inOut" }, d0 + dd * 0.35);
      toneAt[1] = d0 + dd * 0.55;
      drawn(b0, bd);
    }

    // The drawn section: a phone's window at the top of the screen, or, on a wide screen
    // without 3D, the left of the stage beside the cards. Only 2D transforms.
    function narrow() {
      var winH = wide ? stageH : stageH * 0.56;
      var barH = 56;
      var flat = wide
        ? {
            x: -stageW * 0.19,
            y: 20,
            rotationX: 0,
            scale: (stageW * 0.56) / plateW,
          }
        : {
            x: 0,
            y: (barH + winH) / 2 - stageH / 2,
            rotationX: 0,
            scale: (stageW - 32) / plateW,
          };
      var shot = strata.querySelector("[data-band-shot]");
      var hr = shot.getBoundingClientRect();
      var tr = stage.getBoundingClientRect();
      var band = {
        x: hr.left - tr.left + hr.width / 2 - stageW / 2,
        y: hr.top - tr.top + hr.height / 2 - stageH / 2,
        rotationX: 0,
        scale: hr.width / plateW,
      };
      var bands = strata.querySelectorAll(".stratum:not([data-k='1'])");
      var line = strata.querySelector("[data-strata-line]");
      gsap.set(interior, { clipPath: "inset(0px 0px 0px 0px)" });
      gsap.set(strata, { autoAlpha: 0 });
      gsap.set(bands, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(line, { scaleY: 0 });

      // A: the cut opens into a window at the top of the screen; the whole interface fits it
      tl.to(rig, Object.assign({ duration: a1, ease: "power2.inOut" }, flat), 0);
      if (!wide) {
        tl.to(
          interior,
          {
            clipPath: "inset(0px 0px " + (stageH - winH) + "px 0px)",
            duration: a1 * 0.8,
            ease: "power2.inOut",
          },
          0
        );
      }

      // B: the section. The screenshot settles into band LG-01 and the four layers beneath it
      // are drawn in, one band at a time.
      var b0 = wide ? a1 : p(aT - vh * 0.95);
      var b1 = wide ? p(aT + vh * 0.55) : p(aT - vh * 0.1);
      var bd = b1 - b0;
      tl.to(strata, { autoAlpha: 1, duration: bd * 0.2 }, b0);
      tl.to(rig, Object.assign({ duration: bd * 0.3, ease: "power2.inOut" }, band), b0);
      bands.forEach(function (b, i) {
        tl.to(
          b,
          { clipPath: "inset(0% 0% 0% 0%)", duration: bd * 0.18, ease: "power2.out" },
          b0 + bd * (0.25 + i * 0.17)
        );
      });

      // C: the boundary drops through every band, then the workspace slides over the section
      // and its states advance; the thirteen terms below it fill as they are confirmed.
      var c0 = wide ? b1 : p(bT - vh * 0.9);
      var c1 = p(lT - vh * 1.05);
      var cd = c1 - c0;
      tl.to(line, { scaleY: 1, duration: cd * 0.12, ease: "power2.inOut" }, c0);
      var w0 = c0 + cd * 0.2;
      tl.set(ws, { autoAlpha: 1 }, w0);
      tl.to(ws, { clipPath: "inset(0% 0% 0% 0%)", duration: cd * 0.1, ease: "power2.out" }, w0);
      tl.to(strata, { autoAlpha: 0, duration: cd * 0.06 }, w0 + cd * 0.04);
      tl.to(
        ws,
        { clipPath: "inset(0% 0% 100% 0%)", duration: cd * 0.08, ease: "power2.in" },
        c1 - cd * 0.08
      );
      tl.to(strata, { autoAlpha: 1, duration: cd * 0.08 }, c1 - cd * 0.08);
      tl.set(ws, { autoAlpha: 0 }, c1);
      states(w0 + cd * 0.3, w0 + cd * 0.52);

      // D: the match cut. The section lifts away; the screenshot grows out of its band into
      // the story's figure while the window opens to the story's paper.
      var d0 = c1;
      var dd = 1 - d0;
      tl.to(strata, { autoAlpha: 0, duration: dd * 0.3 }, d0);
      tl.to(interior, { clipPath: "inset(0px 0px 0px 0px)", duration: dd * 0.4 }, d0 + dd * 0.2);
      ride(d0 + dd * 0.22);
      tl.to(plates[0], { boxShadow: "0 0 0 0 rgba(0,0,0,0)", duration: dd * 0.3 }, d0 + dd * 0.4);
      tl.to(voidEl, { opacity: 0, duration: dd * 0.35, ease: "power1.inOut" }, d0 + dd * 0.3);
      toneAt[1] = d0 + dd * 0.5;
      drawn(b0, bd);
    }

    // The match cut's last move. The sheet travels to where the story's figure will be a short
    // way before the end, then rises with the page for that last stretch, exactly as the figure
    // itself does, so the two are one object by the time the stage lets go.
    function ride(from) {
      // ride only as far as keeps the path one-directional and the sheet on screen
      var r = Math.max(0, Math.min(vh * 0.3, -land.y));
      var t0 = 1 - p(r);
      tl.to(
        rig,
        {
          x: land.x,
          y: land.y + r,
          scale: land.scale,
          rotationX: 0,
          rotationZ: 0,
          duration: t0 - from,
          ease: "power2.inOut",
        },
        from
      );
      tl.to(rig, { y: land.y, duration: 1 - t0, ease: "none" }, t0);
    }

    // the workspace states follow the reader: ready, then partial, then confirmed
    function states(t1, t2) {
      wsMarks = [t1, t2];
    }

    // progressive detail: each layer in the list reads as drawn once its sheet has inked in
    function drawn(b0, bd) {
      drawMarks = [0.1, 0.4, 0.56, 0.72, 0.88].map(function (f) {
        return b0 + bd * f;
      });
    }

    var seg = -2;
    function update(self) {
      var pr = self.progress;
      if (wsMarks) {
        // everything before the first mark is "ready" and everything after the last is
        // "confirmed", so a jump across the step never leaves a stale state; a state picked by
        // hand stays until the reader crosses a mark
        var k = pr < wsMarks[0] ? 0 : pr < wsMarks[1] ? 1 : 2;
        if (k !== seg) {
          seg = k;
          setWs(WS_KEYS[k], false);
        }
      }
      ledger.forEach(function (li, i) {
        var on = pr >= drawMarks[i];
        if (on !== li.hasAttribute("data-drawn")) {
          if (on) li.setAttribute("data-drawn", "");
          else li.removeAttribute("data-drawn");
        }
      });
      queueTone();
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
    resizeTimer = setTimeout(function () {
      var place = keepPlace();
      build();
      place();
    }, 200);
  });

  // The landing and every beat are measured from the laid-out page; web fonts change that
  // layout, so measure again once they are in.
  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(function () {
      if (!ctx) return;
      var place = keepPlace();
      build();
      place();
    });
  }

  syncToggle();
  // An arrival at an anchor was scrolled in the static layout; once the animated layout is
  // live, put the target back at the top.
  var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (build() && target) target.scrollIntoView();
  window.AA = {
    rebuild: build,
    motionOn: motionOn,
    resolve: resolve,
    get live() {
      return root.classList.contains("motion-live");
    },
  };
})();
