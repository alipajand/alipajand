// The drawing register: the key-plan viewer and the capability marks.
//
// The register works without this file: every row is a plain link and the schedule is a plain
// table. Here, pointing at or focusing a row shows its sheet in the key plan (a wipe of at most
// 280 ms, none under reduced motion), and a capability control marks the sheets that show
// evidence of it, in the register and in the schedule, and says so in a live region.
(function () {
  "use strict";
  var reg = document.querySelector(".reg");
  if (!reg) return;
  var sheets = Array.prototype.slice.call(document.querySelectorAll("[data-view]"));
  var label = document.querySelector("[data-view-label]");
  var status = document.querySelector("[data-cap-status]");
  var rows = Array.prototype.slice.call(reg.querySelectorAll(".row"));

  /* ---------- the key plan ---------- */

  var current = "ledgerguard";
  function show(slug) {
    if (slug === current) return;
    current = slug;
    sheets.forEach(function (s) {
      s.classList.toggle("is-on", s.getAttribute("data-view") === slug);
    });
    var on = document.querySelector('[data-view="' + slug + '"] .strip__code');
    if (label && on) label.textContent = on.textContent;
  }

  // Keyboard focus wins: when focus scrolls the list, rows pass under a resting pointer and
  // would otherwise steal the key plan from the focused row.
  var keyAt = -1e9;
  rows.forEach(function (row) {
    var slug = row.getAttribute("data-row");
    row.addEventListener("pointerenter", function () {
      if (performance.now() - keyAt > 600) show(slug);
    });
    row.addEventListener("focusin", function (e) {
      if (e.target.matches(":focus-visible")) keyAt = performance.now();
      show(slug);
    });
  });

  // Leaving for a sheet: on a narrow screen the key plan is hidden, so the row's own thumbnail
  // carries the shared name into the next page instead.
  window.addEventListener("pageswap", function (e) {
    if (!e.viewTransition || !e.activation || !e.activation.entry) return;
    var url = e.activation.entry.url;
    var row = rows.filter(function (r) {
      var a = r.querySelector(".row__link");
      return a && url.split("#")[0] === a.href.split("#")[0];
    })[0];
    if (!row) return;
    var slug = row.getAttribute("data-row");
    show(slug);
    var view = document.querySelector('[data-view="' + slug + '"]');
    var thumb = row.querySelector(".row__thumb");
    if (thumb && view && !view.offsetParent) {
      view.style.viewTransitionName = "none";
      thumb.style.viewTransitionName = getComputedStyle(view).getPropertyValue("--vt").trim();
    }
  });

  /* ---------- capability marks ---------- */

  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-cap-to]"));
  var cells = Array.prototype.slice.call(document.querySelectorAll(".sched__table [data-col]"));
  var names = {};
  rows.forEach(function (r) {
    names[r.getAttribute("data-row")] = r.querySelector(".row__name").textContent;
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
      rows.forEach(function (r) {
        r.classList.remove("is-match");
      });
      if (status) status.textContent = "";
      return;
    }
    reg.dataset.cap = cap;
    var hits = [];
    rows.forEach(function (r) {
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
        (hits.length === 1 ? " sheet marked, " : " sheets marked, ") +
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
