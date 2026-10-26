// Section A–A · P2 · the motion contract every sheet shares.
//
// Pages are complete without this file. It resolves the reader's motion preference (stored
// choice, then the OS setting), keeps the Motion toggle honest, skips view transitions under
// reduced motion, and runs at most one scene per page.
//
// A scene registers with AA.scene(fn). fn builds its timeline with the helpers it is given;
// if GSAP or ScrollTrigger is missing, or fn throws, the page goes back to its static layout
// and every inline style GSAP set is reverted. The boot script in <head> lays out the live
// version before first paint (.motion-live); .motion-ready confirms it here.
//
// Scene grammar, shared by every project:
//   - one timeline, scrubbed by native scroll over a sticky stage (scrub 0.6);
//   - each step's motion starts as its card enters and settles while the card is read;
//   - the stage is a 1200 x 800 canvas, scaled to fit, never 3D;
//   - the last screen is a match cut: the subject lands in the case study's hero and the
//     stage lets go.
// The stage needs room beside the cards, so it runs from 900 px up. Narrower screens have no
// stage: each step's figure is drawn at a size that reads there, and draws itself in as it
// arrives, piece by piece.
(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "aa-motion2";
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var W = 1200;
  var H = 800;

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

  /* ---------- page transitions ---------- */

  // Under reduced motion, a cross-document view transition is skipped outright. Otherwise the
  // incoming sheet names the one element that continues the picture the reader came from: the
  // case study's hero when they asked for the case study, the stage's subject when they asked
  // for the scene. Only one element per page ever carries the name.
  window.addEventListener("pageswap", function (e) {
    if (e.viewTransition && !motionOn()) {
      // a skipped transition rejects its ready promise; nobody waits on it here
      e.viewTransition.ready.catch(function () {});
      e.viewTransition.skipTransition();
    }
  });

  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    if (!motionOn()) {
      e.viewTransition.ready.catch(function () {});
      e.viewTransition.skipTransition();
      return;
    }
    var hero = document.querySelector("[data-slot]");
    if (!hero) return;
    var name = getComputedStyle(hero).getPropertyValue("--vt").trim();
    var subject = document.querySelector("[data-vt-subject]");
    var staged = root.classList.contains("motion-live") && innerWidth >= 900;
    var target = location.hash === "#case" || !staged ? hero : subject;
    if (name && target) target.style.viewTransitionName = name;
    e.viewTransition.finished.finally(function () {
      if (target) target.style.removeProperty("view-transition-name");
    });
  });

  // When the layout changes under the reader (motion switched, or a failed build reverted),
  // keep the section they were reading at the same height on screen.
  function keepPlace() {
    var el = null;
    var off = 0;
    if (window.scrollY > 4) {
      document.querySelectorAll("[data-place], .step, #case, #contact").forEach(function (n) {
        if (n.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          el = n;
          off = n.getBoundingClientRect().top;
        }
      });
    }
    return function () {
      if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - off);
    };
  }

  /* ---------- the scene ---------- */

  var sceneFn = null;
  var ctx = null;

  function teardown() {
    if (ctx) {
      ctx.revert();
      ctx = null;
    }
    root.classList.remove("motion-live", "motion-ready");
    delete root.dataset.landed;
    var stage = document.querySelector("[data-stage]");
    if (stage) ["--k", "--px", "--py"].forEach((p) => stage.style.removeProperty(p));
  }

  // The picture area, beside the cards.
  function fit(stage) {
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var cs = getComputedStyle(root);
    var gl = parseFloat(cs.getPropertyValue("--gutter")) || 16;
    var card = Math.min(448, vw * 0.31);
    var aw = vw - gl - card - gl - 40;
    var ah = vh - 72 - 28;
    var k = Math.min(aw / W, ah / H);
    var px = gl + (aw - W * k) / 2;
    var py = 72 + (ah - H * k) / 2;
    stage.style.setProperty("--k", k);
    stage.style.setProperty("--px", px + "px");
    stage.style.setProperty("--py", py + "px");
    return { k: k, px: px, py: py, vw: vw, vh: vh };
  }

  function helpers(seq, stage) {
    var f = fit(stage);
    var vh = f.vh;
    var seqTop = seq.getBoundingClientRect().top + window.scrollY;
    var span = Math.max(1, seq.offsetHeight - vh);
    var land = seq.querySelector(".beat--land");
    var updates = [];
    var topOf = function (el) {
      return el.getBoundingClientRect().top + window.scrollY - seqTop;
    };
    var clamp = function (v) {
      return Math.max(0, Math.min(1, v));
    };

    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: seq, start: "top top", end: "bottom bottom", scrub: 0.6 },
      onUpdate: function () {
        var pr = tl.progress();
        // the hand-off happens on the timeline's own frame, not the scroll position, so the
        // stage lets go exactly where its subject meets the hero
        var landed = pr > 0.998;
        if (landed !== root.hasAttribute("data-landed")) {
          if (landed) root.setAttribute("data-landed", "");
          else root.removeAttribute("data-landed");
        }
        for (var i = 0; i < updates.length; i++) updates[i](pr);
      },
    });
    tl.set({}, {}, 1);

    return {
      seq: seq,
      stage: stage,
      tl: tl,
      k: f.k,
      vh: vh,
      // where a step's motion starts: as its card begins to enter
      start: function (el) {
        return clamp((topOf(el) - vh * 0.55) / span);
      },
      // where the match cut starts: the first frame of the shared last screen
      landStart: clamp((topOf(land) - vh) / span),
      // tween between two points of the timeline (progress units)
      at: function (target, vars, t0, t1) {
        var v = Object.assign({ duration: Math.max(0.0001, t1 - t0) }, vars);
        return tl.to(target, v, t0);
      },
      from: function (target, fromVars, vars, t0, t1) {
        var v = Object.assign({ duration: Math.max(0.0001, t1 - t0) }, vars);
        return tl.fromTo(target, fromVars, v, t0);
      },
      onUpdate: function (fn) {
        updates.push(fn);
      },
      // The match cut. base is the subject's untransformed box in canvas units; it travels to
      // the hero's media, arriving a short way before the end while the hero is still rising,
      // then rises with the page for the last stretch so the two are one object at hand-off.
      land: function (el, base, t0) {
        var media = document.querySelector("[data-slot] .slot-media");
        var r = media.getBoundingClientRect();
        var endScroll = seqTop + span;
        var yEnd = r.top + window.scrollY - endScroll;
        var T = { x: (r.left - f.px) / f.k, y: (yEnd - f.py) / f.k, w: r.width / f.k };
        var scale = T.w / base.w;
        var spanPx = span;
        var ride = Math.max(0, Math.min(vh * 0.3, spanPx * (1 - t0) * 0.5));
        var t1 = 1 - ride / spanPx;
        tl.to(
          el,
          {
            x: T.x - base.x,
            y: T.y + ride / f.k - base.y,
            scale: scale,
            duration: Math.max(0.0001, t1 - t0),
            ease: "power2.inOut",
          },
          t0
        );
        tl.to(el, { y: T.y - base.y, duration: 1 - t1, ease: "none" }, t1);
      },
    };
  }

  // Narrow screens: no stage. Each step's figure draws itself in as it arrives: its pieces
  // ([data-in]) in reading order, each fading up while its lines draw, scrubbed by its own
  // position on screen. A figure without pieces draws its lines as one.
  function figures(seq) {
    var shown = function (el) {
      return el && getComputedStyle(el).display !== "none";
    };
    seq.querySelectorAll(".step__fig").forEach(function (fig) {
      var box = [fig.querySelector(".fig-p"), fig.querySelector(".fig-w"), fig].filter(shown)[0];
      var pieces = Array.prototype.slice.call(box.querySelectorAll("[data-in]"));
      (pieces.length ? pieces : [box]).forEach(function (piece) {
        var tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: piece, start: "top 92%", end: "top 55%", scrub: 0.4 },
        });
        if (pieces.length) tl.fromTo(piece, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0);
        var inks = piece.querySelectorAll(".ink");
        if (inks.length) {
          tl.fromTo(
            inks,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.7, stagger: 0.3 / inks.length },
            0
          );
        }
        tl.set({}, {}, 1);
      });
      // lines that run the length of a sheet (a spine, a probe, a bracket) draw as the reader
      // goes down it
      var loose = Array.prototype.filter.call(box.querySelectorAll(".ink"), function (el) {
        return pieces.length && !el.closest("[data-in]");
      });
      if (loose.length) {
        gsap.fromTo(
          loose,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: box, start: "top 85%", end: "bottom 85%", scrub: 0.4 },
          }
        );
      }
    });
  }

  function build() {
    teardown();
    var seq = document.querySelector("[data-scene]");
    var stage = seq && seq.querySelector("[data-stage]");
    if (!sceneFn || !stage || !motionOn() || !window.gsap || !window.ScrollTrigger) {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      return false;
    }
    root.classList.add("motion-live");
    try {
      gsap.registerPlugin(ScrollTrigger);
      var failed = null;
      var h = null;
      // the context is kept even when the build throws, so teardown can revert what it set
      var narrow = document.documentElement.clientWidth < 900;
      ctx = gsap.context(function () {
        try {
          if (narrow) {
            figures(seq);
          } else {
            h = helpers(seq, stage);
            sceneFn(h);
          }
        } catch (err) {
          failed = err;
        }
      });
      if (failed) throw failed;
      root.classList.add("motion-ready");
      // arrivals mid-page (Back, anchors, rebuilds) start at the right frame instead of
      // scrubbing through everything above them
      ScrollTrigger.refresh();
      if (h) h.tl.progress(h.tl.scrollTrigger.progress);
      return true;
    } catch (err) {
      teardown();
      if (window.console) console.warn("Section A–A: motion left off.", err);
      return false;
    }
  }

  var lastWidth = window.innerWidth;
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (!sceneFn || window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var place = keepPlace();
      build();
      place();
    }, 200);
  });

  // every beat is measured from the laid-out page; web fonts change that layout
  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(function () {
      if (!ctx) return;
      var place = keepPlace();
      build();
      place();
    });
  }

  syncToggle();

  window.AA = {
    resolve: resolve,
    motionOn: motionOn,
    rebuild: build,
    get live() {
      return root.classList.contains("motion-live");
    },
    scene: function (fn) {
      sceneFn = fn;
      // an arrival at an anchor was scrolled in the static layout; once the animated layout
      // is live, put the target back at the top
      var target =
        location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (build() && target) target.scrollIntoView();
    },
  };
})();
