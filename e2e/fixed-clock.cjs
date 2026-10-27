/*
 * Preloaded into the e2e server (`NODE_OPTIONS=--require`) so pages that read the server clock
 * render as of E2E_NOW instead of the wall clock. The home page and /writing are rendered per
 * request and flag posts dated after "today" in Toronto as upcoming, so without this their
 * screenshots change on the day a scheduled post goes live.
 *
 * The clock is shifted, not frozen: it starts at E2E_NOW and keeps ticking, so timers, cookies and
 * request timing behave as usual. Only `Date.now()` and `new Date()` without arguments move.
 */
const target = Date.parse(process.env.E2E_NOW ?? "");

if (Number.isFinite(target)) {
  const RealDate = Date;
  const realNow = RealDate.now.bind(RealDate);
  const offset = target - realNow();

  RealDate.now = () => realNow() + offset;

  globalThis.Date = new Proxy(RealDate, {
    construct(DateClass, args, newTarget) {
      return args.length === 0
        ? Reflect.construct(DateClass, [realNow() + offset], newTarget)
        : Reflect.construct(DateClass, args, newTarget);
    },
    apply(DateClass) {
      return new DateClass(realNow() + offset).toString();
    },
  });
}
