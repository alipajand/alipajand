// Concept B: capability highlight on the atlas index.
// One toggle at a time. Matching rows gain a marker; nothing is hidden or reordered, and the
// result is announced in a polite live region.
(function () {
  "use strict";
  var atlas = document.querySelector(".atlas");
  var group = document.querySelector(".hl");
  if (!atlas || !group) return;
  var status = document.querySelector(".hl__status");
  var rows = Array.prototype.slice.call(atlas.querySelectorAll(".row"));
  var buttons = Array.prototype.slice.call(group.querySelectorAll(".hl__btn"));
  group.hidden = false;

  function apply(cap, label) {
    var names = [];
    rows.forEach(function (r) {
      var match = !!cap && r.getAttribute("data-caps").split(" ").indexOf(cap) > -1;
      r.classList.toggle("is-match", match);
      if (match) names.push(r.querySelector(".row__link span").textContent);
    });
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-cap") === cap));
    });
    if (cap) {
      atlas.setAttribute("data-highlight", cap);
      status.textContent =
        label + ": " + names.length + " of " + rows.length + " projects. " + names.join(", ") + ".";
    } else {
      atlas.removeAttribute("data-highlight");
      status.textContent = "Highlight cleared. All " + rows.length + " projects shown equally.";
    }
  }

  group.addEventListener("click", function (e) {
    var b = e.target.closest(".hl__btn");
    if (!b) return;
    var on = b.getAttribute("aria-pressed") === "true";
    apply(on ? null : b.getAttribute("data-cap"), b.textContent);
  });
})();
