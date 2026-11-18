document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sticky nav gets an outline once the page scrolls.
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Count-up numbers in the hero.
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now();
  const dur = 900;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Diverging bars: width is |value| / largest |value| of half the track.
function growBars(root) {
  const bars = [...root.querySelectorAll(".bar")];
  const max = Math.max(...bars.map((b) => Math.abs(Number(b.dataset.v))));
  bars.forEach((b, i) => {
    setTimeout(() => {
      b.style.width = (Math.abs(Number(b.dataset.v)) / max) * 50 + "%";
    }, reduceMotion ? 0 : 150 * i);
  });
}

// Reveal on scroll.
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("in");
    el.querySelectorAll("[data-count]").forEach(countUp);
    if (el.classList.contains("gap")) growBars(el);
    io.unobserve(el);
  });
}, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal, .core-diagram").forEach((el) => io.observe(el));

// The loop: highlight the node the dot is passing (one lap = 8 s, 4 nodes).
const nodes = [...document.querySelectorAll(".loop-node")];
if (nodes.length) {
  let i = 0;
  const step = () => {
    nodes.forEach((n, k) => n.classList.toggle("active", k === i));
    i = (i + 1) % nodes.length;
  };
  step();
  if (!reduceMotion) setInterval(step, 2000);
}

// A little parallax on the street scene.
const street = document.querySelector(".street");
if (street && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const clouds = street.querySelectorAll(".cloud, .kite");
  street.addEventListener("mousemove", (e) => {
    const r = street.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    clouds.forEach((c, k) => {
      c.style.translate = `${dx * -(12 + k * 6)}px 0`;
    });
  });
  street.addEventListener("mouseleave", () => clouds.forEach((c) => (c.style.translate = "")));
}
