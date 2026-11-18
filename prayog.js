// Prayog AI: the station board cycles the name through ten Indian scripts.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const board = document.querySelector(".board");
  if (!board) return;
  const lines = [...board.querySelectorAll(".board-line")];
  const tag = board.querySelector(".board-lang");
  if (!lines.length) return;
  let i = 0;
  const show = () => {
    lines.forEach((l, k) => l.classList.toggle("on", k === i));
    if (tag) tag.textContent = lines[i].dataset.tag;
  };
  show();
  if (reduce) return;
  board.classList.add("cycling");
  setInterval(() => {
    if (document.hidden) return;
    const prev = lines[i];
    prev.classList.add("out");
    setTimeout(() => prev.classList.remove("out"), 700);
    i = (i + 1) % lines.length;
    show();
  }, 2600);
})();

// Phone menu: the ☰ button opens the links as a panel under the top bar.
(() => {
  const nav = document.getElementById("nav");
  const btn = nav && nav.querySelector(".menu-btn");
  if (!btn) return;
  const set = (open) => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close the menu" : "Open the menu");
  };
  btn.addEventListener("click", () => set(!nav.classList.contains("open")));
  nav.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  matchMedia("(min-width: 721px)").addEventListener("change", (m) => { if (m.matches) set(false); });
})();

// Phone swipe strip: light the dot of the building in view.
(() => {
  const strip = document.querySelector(".town-swipe .swipe-track");
  if (!strip || !("IntersectionObserver" in window)) return;
  const slides = [...strip.querySelectorAll(".slide")];
  const dots = [...document.querySelectorAll(".town-swipe .swipe-dots i")];
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) dots.forEach((d, k) => d.classList.toggle("on", slides[k] === en.target));
  }), { root: strip, threshold: 0.6 });
  slides.forEach((s) => io.observe(s));
})();
