// Sheet 00: the opening's transition into the register, the discipline marks, and the name the
// next sheet continues.
//
// The page works without this file: the opening and the register are one static column, every
// project is a plain link and the schedule is a plain table.
//
// With motion on, the opening pins while it condenses. First the identity block slides up under
// the bar; then the three bays close toward the A–A cut (the screenshot keeps its lower edge,
// the drawing keeps its upper edge) until they are the register's top row.
//
// Nothing in the page's layout moves while this runs. At build time the opening keeps its full
// height and the stage is given its condensed height, so everything after the opening is laid
// out exactly where it was; the stage's open composition overflows that box and is closed with
// transforms and clipping only. The stage closes exactly as fast as the page scrolls, so what
// follows it rises at reading speed and is never covered or left behind, and when the pin
// releases there is nothing left to move. Under reduced motion none of this runs.
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
  var D = 0;

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
    if (stage) stage.style.removeProperty("height");
    D = 0;
  }

  function all(sel) {
    return Array.prototype.slice.call(sect.querySelectorAll(sel));
  }

  function build() {
    teardown();
    if (!op || !window.AA || !AA.motionOn() || !window.gsap || !window.ScrollTrigger) return;
    try {
      gsap.registerPlugin(ScrollTrigger);
      var dA = px(sect, "--ab") - px(sect, "--ab-b");
      var dB = px(sect, "--bl") - px(sect, "--bl-b");
      // what the identity block gives up, margins included
      var idH = sect.getBoundingClientRect().top - id.getBoundingClientRect().top;
      D = idH + dA + dB;
      if (D < 40) return;
      var H0 = stage.offsetHeight;
      root.classList.add("op-live");
      // one layout change, made before anything is animated: the opening keeps its height and
      // the stage takes its condensed one, so nothing on the page moves
      op.style.height = H0 + "px";
      stage.style.height = H0 - D + "px";
      // the identity block and the bays share the scroll in proportion to the height each
      // gives up, so the stage always closes at exactly the scroll rate
      var a = idH / D;
      var b = 1 - a;
      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: op, start: "top top", end: "+=" + D, scrub: true },
      });
      tl.fromTo([id, sect], { y: 0 }, { y: -idH, duration: a }, 0);
      tl.fromTo(id, { autoAlpha: 1 }, { autoAlpha: 0, duration: a * 0.8 }, 0);
      // above the cut: the pane is clipped from the top and lifted by the same amount, so its
      // lower edge rides the cut up; the picture inside drifts down by half, so the strip that
      // stays is the middle of the picture, not its foot
      tl.fromTo(
        all(".bay__above"),
        { y: 0, clipPath: "inset(0px 0px 0px 0px)" },
        { y: -dA, clipPath: "inset(" + dA + "px 0px 0px 0px)", duration: b },
        a
      );
      tl.fromTo(
        all(".bay__img, .bay__above .drawing"),
        { y: 0, scale: 1.08 },
        { y: dA / 2, scale: 1, duration: b },
        a
      );
      // wide screens set the datums beside the cut, where the condensed row has no room for
      // them; narrow screens keep them as a legend, and every width keeps the timeframes
      var side = all(".datum").filter(function (d) {
        return getComputedStyle(d).position === "absolute";
      });
      // the cut and everything hung from it rise with the closing pane
      tl.fromTo(
        all(".bay__cut, .sect__line, .sect__a").concat(side),
        { y: 0 },
        { y: -dA, duration: b },
        a
      );
      // below the cut: the pane rises and is clipped from the bottom, keeping its upper edge
      tl.fromTo(
        all(".bay__below"),
        { y: 0, clipPath: "inset(0px 0px 0px 0px)" },
        { y: -dA, clipPath: "inset(0px 0px " + dB + "px 0px)", duration: b },
        a
      );
      tl.fromTo(all(".bay__title"), { y: 0 }, { y: -(dA + dB), duration: b }, a);
      if (side.length) {
        // the key column's end of the cut goes with them: the condensed row's line would run
        // through the column's own text
        side.push(sect.querySelector(".sect__a--l"));
        tl.fromTo(side, { autoAlpha: 1 }, { autoAlpha: 0, duration: b * 0.4 }, a);
        var line = sect.querySelector(".sect__line");
        tl.fromTo(line, { "--key-line": 1 }, { "--key-line": 0, duration: b * 0.4 }, a);
      }
      tl.set({}, {}, 1);
      ScrollTrigger.refresh();
    } catch (err) {
      teardown();
      if (window.console) console.warn("Section A–A: opening motion left off.", err);
    }
  }

  // A project anchor (#project-alwaysgeeky, from a case study's way back) lands on the register:
  // with the opening live, that is the condensed row, where every bay sits with its brief.
  // Without motion the anchor is an ordinary one.
  function toProject() {
    var hash = location.hash.slice(1);
    var t = hash && document.getElementById(decodeURIComponent(hash));
    if (!t || !tl || !op.contains(t)) return;
    window.scrollTo(0, op.getBoundingClientRect().top + window.scrollY + D);
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
  window.addEventListener("hashchange", toProject);
  // the browser's own fragment scroll can run until load, so the arrival is placed after it;
  // a Back or Forward visit keeps the position the browser restores
  var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  if (!nav || nav.type !== "back_forward") {
    if (document.readyState === "complete") toProject();
    else
      window.addEventListener("load", function () {
        requestAnimationFrame(toProject);
      });
  }

  /* ---------- leaving for a scene or a case study ---------- */

  // The bay's upper picture carries the sheet's shared name, so the scene's subject, or the
  // case study's hero, grows out of it. LedgerGuard's pages (P1) name their own pictures and
  // are left to cross-fade.
  window.addEventListener("pageswap", function (e) {
    if (!e.viewTransition || !e.activation || !e.activation.entry) return;
    var url = e.activation.entry.url;
    document.querySelectorAll(".bay[data-vt]").forEach(function (b) {
      var page = b.querySelector(".bay__go").href.split("#")[0];
      if (url.split("#")[0] === page) {
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
