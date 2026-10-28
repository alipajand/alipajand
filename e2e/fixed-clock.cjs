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
