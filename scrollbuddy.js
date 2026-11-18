// Scroll buddy: a small robot agent walks along a path under the nav as the page scrolls.
// Its position shows how far down the page you are; at the bottom it reaches a flag.
// Self-contained (injects its own CSS) so every page can include it with one <script>.
(() => {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const css = `
  .sb { position: absolute; left: 0; right: 0; top: 100%; height: 30px; pointer-events: none;
        opacity: 0; transition: opacity .3s; margin-top: 3px; }
  .sb.on { opacity: 1; }
  .sb-path { display: none; }
  .sb-trail { position: absolute; left: 12px; bottom: 2px; height: 4px; width: 0; border-radius: 4px;
        background: repeating-linear-gradient(90deg, #ffb020 0 10px, transparent 10px 15px); filter: drop-shadow(0 0 1.5px #fff8ec); }
  .sb-bot { position: absolute; bottom: 3px; left: 0; width: 24px; height: 28px; will-change: transform; }
  .sb-bot svg { width: 24px; height: 28px; display: block; overflow: visible; }
  .sb-face { transition: transform .2s; transform-origin: 12px 14px; }
  .sb.back .sb-face { transform: scaleX(-1); }
  .sb-leg { transform-box: fill-box; transform-origin: 50% 0; }
  .sb.walking .sb-l1 { animation: sbStep .28s ease-in-out infinite alternate; }
  .sb.walking .sb-l2 { animation: sbStep .28s ease-in-out infinite alternate-reverse; }
  .sb.walking .sb-body { animation: sbBob .14s ease-in-out infinite alternate; }
  @keyframes sbStep { from { transform: rotate(-28deg); } to { transform: rotate(28deg); } }
  @keyframes sbBob { from { transform: translateY(0); } to { transform: translateY(-1.5px); } }
  .sb-bulb { animation: sbBlink 1.6s steps(1) infinite; }
  @keyframes sbBlink { 0%, 70% { fill: #e8407a; } 71%, 100% { fill: #ffb020; } }
  .sb-flag { position: absolute; right: 14px; bottom: 3px; width: 22px; height: 28px; }
  .sb-flag .sb-cloth { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform .35s cubic-bezier(.3,1.6,.5,1); }
  .sb.done .sb-flag .sb-cloth { transform: scaleX(1); animation: sbWave .5s ease-in-out .35s infinite alternate; }
  @keyframes sbWave { from { transform: scaleX(1) skewY(-6deg); } to { transform: scaleX(.88) skewY(6deg); } }
  .sb.done .sb-body { animation: sbHop .5s ease-in-out 2; }
  @keyframes sbHop { 50% { transform: translateY(-7px); } }
  @media (prefers-reduced-motion: reduce) { .sb * { animation: none !important; } }
  @media print { .sb { display: none; } }`;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  const ink = "#1f1a2e";
  const sb = document.createElement("div");
  sb.className = "sb";
  sb.setAttribute("aria-hidden", "true");
  sb.innerHTML = `
    <div class="sb-path"></div><div class="sb-trail"></div>
    <div class="sb-flag"><svg viewBox="0 0 22 28"><path d="M3 27 V3" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
      <path class="sb-cloth" d="M4 4 H19 L15 9 L19 14 H4Z" fill="#0f8b8d" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/></svg></div>
    <div class="sb-bot"><svg viewBox="0 0 24 28"><g class="sb-face">
      <g stroke="${ink}" stroke-width="1.6" stroke-linecap="round">
        <path class="sb-leg sb-l1" d="M9.5 21.5 V27"/><path class="sb-leg sb-l2" d="M14.5 21.5 V27"/>
      </g>
      <g class="sb-body" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round">
        <path d="M12 5 V2.5" stroke-linecap="round"/><circle class="sb-bulb" cx="12" cy="2" r="1.8"/>
        <rect x="3.5" y="5" width="17" height="11" rx="4" fill="#e3e5f5"/>
        <rect x="6.5" y="7.5" width="11.5" height="6" rx="2" fill="${ink}"/>
        <rect x="11" y="9" width="2" height="3" rx="1" fill="#8fd6d0" stroke="none"/><rect x="15" y="9" width="2" height="3" rx="1" fill="#8fd6d0" stroke="none"/>
        <rect x="7" y="16" width="10" height="6.5" rx="2.5" fill="#e3e5f5"/>
        <path d="M17 18 L20 16.5" stroke-linecap="round"/>
      </g></g></svg></div>`;
  nav.appendChild(sb);

  const bot = sb.querySelector(".sb-bot");
  const trail = sb.querySelector(".sb-trail");
  let lastY = window.scrollY, idle = 0, ticking = false;

  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    const track = sb.clientWidth - 12 - 40 - 24; // path minus the robot's width, flag room
    const x = 12 + p * Math.max(0, track);
    bot.style.transform = `translateX(${x}px)`;
    trail.style.width = `${Math.max(0, x - 12 + 6)}px`;
    const dy = scrollY - lastY;
    if (dy !== 0) sb.classList.toggle("back", dy < 0);
    lastY = scrollY;
    sb.classList.toggle("done", p > 0.985);
    sb.classList.toggle("on", scrollY > 8);
    if (!reduce && dy !== 0) {
      sb.classList.add("walking");
      clearTimeout(idle);
      idle = setTimeout(() => sb.classList.remove("walking"), 160);
    }
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", req);
  update();
})();
