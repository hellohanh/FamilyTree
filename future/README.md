# Future projects (catalogued, not on the live page)

## 3D layered view of all the trees — `3d-layers/` (Entry 63)
- Idea (Hanh): "a 3D animation layout to show layers of trees and how they connect to each other."
- Prototype: each tree is a see-through disc (its own sunburst, drawn to a canvas texture) floating in a stack; the
  same person on two trees (same `pid`) is joined by a gold thread. Discs fan out on open and slowly turn. Drag =
  orbit, scroll/pinch = zoom, tap a thread = who it is + which trees, double-tap a disc = open that tree's wheel. Tree
  titles stay pinned to each disc's edge.
- Built with three.js r149 (`three.min.js`, ~600 KB, inlined via a `__THREE__` placeholder; `tools/build_focus_mockup.py`
  already fills it if present). Page grows from ~1.7 MB to ~2.5 MB.
- Files: `sunburst-3d.template.html` (the full template with the 3D code — diff against
  `mockups/sunburst-focus.template.html` to see just the 3D part), `family-tree-3d-prototype.html` (built, opens by
  double-click), `3d-layers.png`, `3d-layers-top.png`, `v3.js` (headless screenshot test; needs
  `--use-angle=swiftshader`).
- Open ideas when resumed: tapping a thread lights up that person's threads and dims the rest; phone pass (☰ menu
  button, touch orbit); add Bà Lịch's tree as a fifth disc; maybe start from the viewpoint person.

## One wheel with Bà Lịch's family (split centre) — mock only (Entry 63)
- `split-wheel-mock.png`, `split-wheel-mock-zoom.png`, `lichmock.js`: Bà Lịch's parents in the same ring as Ông Cố &
  Bà Cố, her siblings' families as a blue wedge, her own slice "Lịch ↗ Ông Hai". Hanh chose a **separate tree** as the
  base instead; this stays here as a reference.
