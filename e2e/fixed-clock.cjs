/*
 * Preloaded into the e2e build and server (`NODE_OPTIONS=--require`) so code that reads the clock
 * runs as of E2E_NOW instead of the wall clock. Publication is decided when pages are built, so
 * without this the home and writing screenshots would change on the day a scheduled post goes live.
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
