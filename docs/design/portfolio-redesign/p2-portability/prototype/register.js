// Sheet 00: the opening's transition into the register, the discipline marks, and the name the
// next sheet continues.
//
// The page works without this file: the opening and the register are one static column, every
// project is a plain link and the schedule is a plain table.
//
// With motion on, the opening pins while it condenses. First the identity block slides up under
// the bar; then the three bays shorten toward the A–A cut (the screenshot keeps its lower edge,
// the drawing keeps its upper edge) until they are the register's top row. The stage loses
// height exactly as fast as the page scrolls, so what follows it rises at reading speed and is
// never covered or left behind. Under reduced motion none of this runs.
(function () {
  "use strict";
  var root = document.documentElement;
  var reg = document.querySelector(".reg");
  if (!reg) return;

  /* ---------- the opening ---------- */

  var op = document.querySelector("[data-opening]");
  var stage = op && op.querySelector("[data-op-stage]");
  var id = op && op.querySelector("[data-op-id]");
  var sect = op && op.querySelector("[data-sect]");
  var tl = null;

  // the bay heights are CSS lengths (clamp() on wide screens): measure them, don't parse them
  function px(el, prop) {
    var probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:var(" + prop + ")";
    el.appendChild(probe);
    var h = probe.offsetHeight;
    el.removeChild(probe);
    return h;
  }

  function teardown() {
    if (tl) {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.revert();
      tl = null;
    }
    root.classList.remove("op-live");
    if (op) op.style.removeProperty("height");
  }

  function build() {
    teardown();
    if (!op || !window.AA || !AA.motionOn() || !window.gsap || !window.ScrollTrigger) return;
    try {
      gsap.registerPlugin(ScrollTrigger);
      var abA = px(sect, "--ab");
      var blA = px(sect, "--bl");
      var abB = px(sect, "--ab-b");
      var blB = px(sect, "--bl-b");
      var idH = id.getBoundingClientRect().height;
      var bays = abA - abB + (blA - blB);
      var D = idH + bays;
      if (D < 40) return;
      root.classList.add("op-live");
      op.style.height = stage.offsetHeight + "px";
      // the identity block and the bays share the scroll in proportion to the height each
      // gives up, so the stage always shrinks at exactly the scroll rate
      var a = idH / D;
      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: op, start: "top top", end: "+=" + D, scrub: true },
      });
      tl.fromTo(id, { marginTop: 0 }, { marginTop: -idH, duration: a }, 0);
      tl.fromTo(id, { opacity: 1 }, { opacity: 0, duration: a * 0.8 }, 0);
      tl.fromTo(
        sect,
        { "--ab": abA + "px", "--bl": blA + "px" },
        { "--ab": abB + "px", "--bl": blB + "px", duration: 1 - a },
        a
      );
      // depth, not layout: the pictures settle onto the cut as the bays close in
      tl.fromTo(
        sect.querySelectorAll(".bay__img, .bay__above .drawing"),
        { scale: 1.08 },
        { scale: 1, duration: 1 - a },
        a
      );
      // wide screens set the datums beside the cut, where the condensed row has no room for
      // them; narrow screens keep them as a legend, and every width keeps the timeframes
      var side = Array.prototype.filter.call(sect.querySelectorAll(".datum"), function (d) {
        return getComputedStyle(d).position === "absolute";
      });
      if (side.length) {
        // the key column's end of the cut goes with them: the condensed row's line would run
        // through the column's own text
        side.push(sect.querySelector(".sect__a--l"));
        tl.fromTo(side, { autoAlpha: 1 }, { autoAlpha: 0, duration: (1 - a) * 0.4 }, a);
        tl.fromTo(sect, { "--key-line": 1 }, { "--key-line": 0, duration: (1 - a) * 0.4 }, a);
      }
      tl.set({}, {}, 1);
      ScrollTrigger.refresh();
    } catch (err) {
      teardown();
      if (window.console) console.warn("Section A–A: opening motion left off.", err);
    }
  }

  // Keyboard focus that lands in the identity block once it has slid away brings it back.
  if (id) {
    id.addEventListener("focusin", function () {
      if (tl && window.scrollY > 0) window.scrollTo(0, 0);
    });
  }

  // The motion toggle and the OS setting both change data-motion on the root.
  new MutationObserver(build).observe(root, { attributes: true, attributeFilter: ["data-motion"] });
  var lastWidth = window.innerWidth;
  var timer = null;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(build, 200);
  });
  if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(build);
  build();

  /* ---------- leaving for a scene ---------- */

  // The bay's upper picture carries the scene's shared name, so the scene's subject grows out
  // of it. LedgerGuard's scene (P1) names its own pictures and is left to cross-fade.
  window.addEventListener("pageswap", function (e) {
    if (!e.viewTransition || !e.activation || !e.activation.entry) return;
    var url = e.activation.entry.url.split("#")[0];
    document.querySelectorAll(".bay[data-vt]").forEach(function (b) {
      var a = b.querySelector(".bay__sect");
      if (a && a.href.split("#")[0] === url && e.activation.entry.url.indexOf("#") < 0) {
        b.querySelector(".bay__above").style.viewTransitionName = b.getAttribute("data-vt");
      }
    });
  });

  /* ---------- discipline marks ---------- */

  var status = document.querySelector("[data-cap-status]");
  var marked = Array.prototype.slice.call(reg.querySelectorAll("[data-caps]"));
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-cap-to]"));
  var cells = Array.prototype.slice.call(document.querySelectorAll(".sched__table [data-col]"));
  var names = {};
  marked.forEach(function (r) {
    var n = r.querySelector(".bay__nm, .srow__name");
    if (n) names[r.getAttribute("data-row")] = n.textContent;
  });

  function mark(cap) {
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-cap-to") === cap));
    });
    cells.forEach(function (c) {
      c.classList.toggle("is-col", c.getAttribute("data-col") === cap);
    });
    if (!cap) {
      delete reg.dataset.cap;
      marked.forEach(function (r) {
        r.classList.remove("is-match");
      });
      if (status) status.textContent = "";
      return;
    }
    reg.dataset.cap = cap;
    var hits = [];
    marked.forEach(function (r) {
      var on = (" " + r.getAttribute("data-caps") + " ").indexOf(" " + cap + " ") > -1;
      r.classList.toggle("is-match", on);
      if (on) hits.push(names[r.getAttribute("data-row")]);
    });
    var title = buttons.filter(function (b) {
      return b.getAttribute("data-cap-to") === cap;
    })[0].textContent;
    if (status) {
      status.textContent =
        title +
        ": " +
        hits.length +
        (hits.length === 1 ? " project marked, " : " projects marked, ") +
        hits.join(", ") +
        ".";
    }
  }

  buttons.forEach(function (b) {
    b.disabled = false;
    b.addEventListener("click", function () {
      var cap = b.getAttribute("data-cap-to");
      mark(b.getAttribute("aria-pressed") === "true" ? null : cap);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && reg.dataset.cap) mark(null);
  });
})();
