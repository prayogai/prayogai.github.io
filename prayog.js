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
