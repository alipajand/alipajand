export const SCROLL_PLACE_STORAGE_KEY = "scroll-place";

export const SCROLL_PLACE_LIMIT = 50;

export const SCROLL_PLACE_SCRIPT = `(function () {
  var nav = window.navigation;
  if (!nav || !nav.currentEntry) return;
  var STORAGE_KEY = ${JSON.stringify(SCROLL_PLACE_STORAGE_KEY)};
  var read = function () {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch (error) {
      return {};
    }
  };
  var record = function () {
    if (owed !== undefined || !nav.currentEntry) return;
    try {
      var places = read();
      delete places[nav.currentEntry.key];
      places[nav.currentEntry.key] = Math.round(window.scrollY);
      var keys = Object.keys(places);
      for (var i = 0; i < keys.length - ${SCROLL_PLACE_LIMIT}; i += 1) delete places[keys[i]];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch (error) {}
  };
  var load = performance.getEntriesByType("navigation")[0];
  var owed = load && load.type === "back_forward" ? read()[nav.currentEntry.key] : undefined;
  if (typeof owed !== "number") owed = undefined;
  // The layout can still shift, and scroll the page, while it is being left. Record where the reader
  // was when a navigation away starts, and nothing after it.
  var leaving = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!leaving) record();
    },
    { passive: true }
  );
  nav.addEventListener("navigate", function (event) {
    record();
    if (event.destination && !event.destination.sameDocument) leaving = true;
  });
  window.addEventListener("pageswap", function () {
    leaving = true;
  });
  window.addEventListener("pageshow", function () {
    leaving = false;
  });
  // The reader moving the page settles any owed offset, and shows a navigation away did not happen
  // (a download, say).
  var release = function () {
    owed = undefined;
    leaving = false;
  };
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (type) {
    window.addEventListener(type, release, { passive: true, capture: true });
  });
  window.addEventListener("load", function () {
    window.requestAnimationFrame(function () {
      if (owed !== undefined && Math.abs(window.scrollY - owed) >= 1) {
        window.scrollTo({ top: owed, left: 0, behavior: "instant" });
      }
      release();
      record();
    });
  });
})();`;
