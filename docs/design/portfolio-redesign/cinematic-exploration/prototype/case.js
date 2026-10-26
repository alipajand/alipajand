// Case-study page: the motion preference and the view-transition guard. The page itself is
// static; the only entrance is the section line drawing across the title (CSS, 520 ms).
// The preference follows the same rule as the sequence page (see sequence.js).
(function () {
  "use strict";
  var root = document.documentElement;
  var KEY = "aa-motion2";
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  function sync() {
    document.querySelectorAll("[data-motion-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(motionOn()));
      var label = b.querySelector("[data-motion-label]");
      if (label) label.textContent = motionOn() ? "Motion on" : "Motion off";
    });
  }

  mq.addEventListener("change", function () {
    root.dataset.motion = resolve();
    sync();
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-motion-toggle]")) return;
    var next = motionOn() ? "reduce" : "full";
    try {
      localStorage.setItem(KEY, JSON.stringify({ m: next, os: osMode() }));
    } catch {
      /* storage unavailable */
    }
    root.dataset.motion = next;
    sync();
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

  sync();
})();
