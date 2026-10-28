  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const LINE = "236,236,230";
  const pad = (i) => String(i + 1).padStart(2, "0");
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const fitCanvas = (c) => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  };
  const runPortal = (onFrame) => {
    const tracks = [...document.querySelectorAll(".ticker__track")].map((el) => ({ el, dir: +el.dataset.dir, x: 0 }));
    const name = document.querySelector(".name[data-part]");
    const chevrons = [...document.querySelectorAll("#chevrons svg")];
    const chevBand = document.getElementById("chevrons");
    const progress = document.getElementById("progress");
    let lastY = scrollY, vel = 0;
    const frame = (time) => {
      const y = scrollY, vh = innerHeight;
      vel += ((y - lastY) - vel) * .18; lastY = y;
      const max = document.documentElement.scrollHeight - vh;
      progress.style.setProperty("--p", (max > 0 ? y / max : 0).toFixed(4));
      tracks.forEach((tr) => {
        const half = tr.el.scrollWidth / 2;
        tr.x -= (0.45 + Math.abs(vel) * .35) * tr.dir * (vel < -0.5 ? -1 : 1);
        if (tr.x <= -half) tr.x += half;
        if (tr.x > 0) tr.x -= half;
        tr.el.style.transform = `translate3d(${tr.x.toFixed(1)}px,0,0)`;
      });
      if (name) {
        const [w1, star, w2] = name.children;
        const cs = getComputedStyle(name);
        const free = name.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - w1.offsetWidth - w2.offsetWidth - star.getBoundingClientRect().width;
        const shift = (1 - clamp(y / (vh * .6), 0, 1)) * Math.max(0, free) * .42;
        w1.style.transform = `translateX(${shift.toFixed(1)}px)`;
        w2.style.transform = `translateX(${(-shift).toFixed(1)}px)`;
        star.style.transform = `rotate(${(y * .35).toFixed(1)}deg)`;
      }
      if (chevBand) {
        const cr = chevBand.getBoundingClientRect();
        const lit = Math.round(clamp((vh - cr.top) / (vh * .75), 0, 1) * chevrons.length);
        chevrons.forEach((c, i) => c.classList.toggle("off", i >= lit));
      }
      onFrame(time, { y, vh, vel });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
