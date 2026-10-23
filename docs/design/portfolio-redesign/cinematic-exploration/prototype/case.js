// Case-study page: the motion preference and the view-transition guard. The page itself is
// static; the only entrance is the section line drawing across the title (CSS, 520 ms).
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

  function sync() {
    document.querySelectorAll("[data-motion-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(motionOn()));
      var label = b.querySelector("[data-motion-label]");
      if (label) label.textContent = motionOn() ? "Motion on" : "Motion off";
    });
  }

  function set(value, persist) {
    root.dataset.motion = value;
    if (persist) {
      try {
        localStorage.setItem(KEY, value);
      } catch {
        /* storage unavailable */
      }
    }
    sync();
  }

  mq.addEventListener("change", function () {
    if (!stored()) set(mq.matches ? "reduce" : "full", false);
  });

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-motion-toggle]")) set(motionOn() ? "reduce" : "full", true);
  });

  ["pageswap", "pagereveal"].forEach(function (type) {
    window.addEventListener(type, function (e) {
      if (e.viewTransition && !motionOn()) e.viewTransition.skipTransition();
    });
  });

  sync();
})();
