// Progressive enhancement shared by the three concept prototypes.
// Every page is complete without this file: it adds the motion preference, diagram walkthroughs,
// and the "current section" marker in case-study outlines. It never hides content and never
// touches scroll position, history, or anchor behaviour.
(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "p1-motion";
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

  function applyMotion(value, persist) {
    root.dataset.motion = value;
    if (persist) {
      try {
        localStorage.setItem(KEY, value);
      } catch {
        /* storage unavailable: the choice lasts for this page only */
      }
    }
    document.querySelectorAll("[data-motion-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(value === "full"));
      var label = b.querySelector("[data-motion-label]");
      if (label) label.textContent = value === "full" ? "Motion on" : "Motion off";
    });
    if (value !== "full") stopAllFlows();
    document.dispatchEvent(new CustomEvent("p1:motion", { detail: value }));
  }

  // Follow the system setting live unless the visitor chose explicitly on this site.
  mq.addEventListener("change", function () {
    if (!stored()) applyMotion(mq.matches ? "reduce" : "full", false);
  });

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-motion-toggle]");
    if (b) applyMotion(motionOn() ? "reduce" : "full", true);
  });

  // Cross-document view transitions: skipped when motion is off.
  ["pageswap", "pagereveal"].forEach(function (type) {
    window.addEventListener(type, function (e) {
      if (e.viewTransition && !motionOn()) e.viewTransition.skipTransition();
    });
  });

  /* ---------- flow walkthroughs ---------- */

  var flows = [];

  function stopAllFlows() {
    flows.forEach(function (f) {
      f.stop();
    });
  }

  function button(text, cls) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "dg__btn " + cls;
    b.textContent = text;
    return b;
  }

  function initFlow(fig) {
    var steps = Array.prototype.slice.call(fig.querySelectorAll(".dg__step"));
    if (!steps.length) return;
    var title = (fig.querySelector(".dg__title") || {}).textContent || "Flow";
    var tempo = Number(fig.getAttribute("data-tempo")) || 1700;
    var index = -1;
    var timer = null;

    var bar = document.createElement("div");
    bar.className = "dg__controls";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Walk through " + title);
    var play = button("Play walkthrough", "dg__btn--play");
    var prev = button("Previous step", "dg__btn--prev");
    var next = button("Next step", "dg__btn--next");
    var status = document.createElement("p");
    status.className = "dg__status";
    status.setAttribute("aria-live", "polite");
    status.textContent = steps.length + " steps. Use Next step to walk through them.";
    bar.append(play, prev, next, status);
    fig.querySelector(".dg__steps").after(bar);

    function set(n) {
      index = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach(function (s, k) {
        s.classList.toggle("is-active", k === index);
        s.classList.toggle("is-done", k < index);
        if (k === index) s.setAttribute("aria-current", "step");
        else s.removeAttribute("aria-current");
      });
      fig.dataset.step = String(index);
      var label = steps[index].querySelector(".dg__label").textContent;
      status.textContent = "Step " + (index + 1) + " of " + steps.length + ": " + label;
      prev.disabled = index === 0;
      next.disabled = index === steps.length - 1;
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      fig.classList.remove("is-playing");
      play.textContent = index >= steps.length - 1 ? "Replay walkthrough" : "Play walkthrough";
      play.setAttribute("aria-pressed", "false");
    }

    function start() {
      if (index >= steps.length - 1 || index < 0) set(0);
      fig.classList.add("is-playing");
      play.textContent = "Pause walkthrough";
      play.setAttribute("aria-pressed", "true");
      timer = window.setInterval(function () {
        if (index >= steps.length - 1) return stop();
        set(index + 1);
      }, tempo);
    }

    play.addEventListener("click", function () {
      if (timer) stop();
      else start();
    });
    prev.addEventListener("click", function () {
      stop();
      set(index < 0 ? 0 : index - 1);
    });
    next.addEventListener("click", function () {
      stop();
      set(index + 1);
    });
    fig.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && timer) stop();
    });
    prev.disabled = true;
    play.setAttribute("aria-pressed", "false");

    flows.push({ stop: stop, set: set, fig: fig });
  }

  document.querySelectorAll("[data-flow]").forEach(initFlow);

  /* ---------- outlines ---------- */

  var wide = window.matchMedia("(min-width: 1024px)");
  function syncDisclosures() {
    document.querySelectorAll("details[data-open-wide]").forEach(function (d) {
      if (wide.matches) d.open = true;
    });
  }
  wide.addEventListener("change", syncDisclosures);
  syncDisclosures();

  var outlineLinks = Array.prototype.slice.call(document.querySelectorAll("[data-outline] a"));
  if (outlineLinks.length && "IntersectionObserver" in window) {
    var visible = {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          visible[en.target.id] = en.isIntersecting;
        });
        var current = outlineLinks.find(function (a) {
          return visible[a.getAttribute("href").slice(1)];
        });
        outlineLinks.forEach(function (a) {
          if (a === current) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    outlineLinks.forEach(function (a) {
      var s = document.getElementById(a.getAttribute("href").slice(1));
      if (s) io.observe(s);
    });
  }

  applyMotion(root.dataset.motion || (mq.matches ? "reduce" : "full"), false);
  window.P1 = { flows: flows, motionOn: motionOn };
})();
