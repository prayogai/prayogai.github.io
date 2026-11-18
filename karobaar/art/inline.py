"""Copy the illustrations in website/art/ into website/index.html.

The page inlines its SVGs (so they use the page's fonts and CSS animations). The source of
each illustration is art/<name>.svg; run this after editing one:

    python3 art/inline.py          # from website/

Each card SVG is the <svg> right after `<article ... id="<name>"> <div class="world-art reveal">`.
The hero is the <svg class="street" ...>. Blog pages use <!--art:NAME--><!--/art--> markers. The Google Fonts @import line in each source file
is only for previewing the file on its own and is dropped here.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "art"
PAGE = ROOT / "index.html"
CARDS = ["kirana", "truck", "city", "wedding", "staffing"]


def load(name: str) -> str:
    svg = (ART / f"{name}.svg").read_text(encoding="utf-8").strip()
    svg = re.sub(r"^\s*@import url\([^)]*\);\s*\n", "", svg, flags=re.M)
    svg = svg.replace(' xmlns="http://www.w3.org/2000/svg"', "", 1)
    return svg


def main() -> None:
    html = PAGE.read_text(encoding="utf-8")
    done = []
    for name in CARDS:
        if not (ART / f"{name}.svg").exists():
            continue
        m = re.search(rf'<article class="world[^"]*" id="{name}"[^>]*>\s*<div class="world-art reveal">\s*', html)
        if not m:
            sys.exit(f"card {name} not found")
        start = html.index("<svg", m.end())
        end = html.index("</svg>", start)
        # nested <svg> is not used inside cards, so the first </svg> closes it
        html = html[:start] + load(name) + html[end + len("</svg>"):]
        done.append(name)
    if (ART / "street.svg").exists():
        start = re.search(r'<svg[^>]*class="street[ "]', html).start()
        end = html.index("</svg>", start)
        html = html[:start] + load("street") + html[end + len("</svg>"):]
        done.append("street")
    PAGE.write_text(html, encoding="utf-8")

    # Any other page can pull in an illustration with <!--art:NAME--> ... <!--/art-->.
    for page in ROOT.glob("blog/*.html"):
        text = page.read_text(encoding="utf-8")
        new = re.sub(r"<!--art:([a-z]+)-->.*?<!--/art-->",
                     lambda m: f"<!--art:{m.group(1)}-->{load(m.group(1))}<!--/art-->", text, flags=re.S)
        if new != text:
            page.write_text(new, encoding="utf-8")
            done.append(page.name)
    print("inlined:", ", ".join(done) or "nothing")


if __name__ == "__main__":
    main()
