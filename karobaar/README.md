# Website

The public page for **Karobaar Gym**: an illustrated tour of the businesses (kirana store,
truck fleet, municipal corporation, wedding planning, staffing agency), the shared core,
how the simulator's score becomes the RL reward, and a blog.

Plain HTML, CSS and JavaScript, with no build step and no dependencies except Google Fonts
(Baloo 2 and Nunito).

| File | What it holds |
|---|---|
| `index.html` | Home page: all content and the inline SVG illustrations |
| `styles.css` | Design tokens, layout and every animation |
| `script.js` | Scroll reveals, count-ups, the RL loop highlight, the results bars, light parallax |
| `presentation.html` | Presentation for meetings: the businesses, the standard every environment meets, how we train, where it stands, what is next. One slide per screen; ← → or space to move |
| `presentation.css`, `presentation.js` | Its slide layout (classes prefixed `pz-` where they would clash with `styles.css`), counter, dots and keys |
| `blog/index.html` | Blog listing |
| `blog/kirana-rl.html` | Post: "Teaching a small model to run a kirana shop" (draft, `noindex`) |
| `blog/blog.css` | Article typography, figures, callouts |
| `art/*.svg` | Source of each illustration; `python3 art/inline.py` copies them into `index.html` |

**View it:** open `index.html` in a browser, or serve the folder:

```bash
cd website && python3 -m http.server 8000   # then open http://localhost:8000
```

**Writing style.** Plain, specific, first person plural. Say what happened, with the
number. No slogans, no "not X but Y", no lists of three for rhythm. If a sentence would fit
on any other project's page, rewrite it.

**Keep it true.** Facts on the page come from each environment's `PROGRESS.md` and
`0_rl-training-core/LOG.md`, as of 3 Nov 2026 (Training: imitation + DAgger, dagger3 results). Update the page when they change. The blog
post has `TODO` boxes (dashed, purple) to fill or delete before it is published. Motion is
switched off for visitors who ask for reduced motion.
