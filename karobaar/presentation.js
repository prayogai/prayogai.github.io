// Presentation (presentation.html): slide counter, dots, keyboard navigation,
// and the entrance of each slide as it comes into view.
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const now = document.getElementById("slide-now");
  document.getElementById("slide-all").textContent = slides.length;

  const dots = document.querySelector(".deck-dots");
  slides.forEach((s, i) => {
    const a = document.createElement("a");
    a.href = "#" + s.id;
    a.title = s.getAttribute("aria-label") || "Slide " + (i + 1);
    a.setAttribute("aria-label", a.title);
    dots.appendChild(a);
  });
  const dotLinks = Array.from(dots.children);

  let current = 0;
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      current = slides.indexOf(e.target);
      now.textContent = current + 1;
      dotLinks.forEach((d, i) => d.classList.toggle("on", i === current));
    });
  }, { threshold: 0.55 });
  slides.forEach((s) => seen.observe(s));

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, [contenteditable]")) return;
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(current + 1); }
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(current - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(slides.length - 1); }
  });

  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 10), { passive: true });
})();
