# Hanh's Family Tree — Resume Reference

> **How to start a session:** upload the latest `S0XX_…_FamilyTree.zip` (or name the repo, or open a
> chat inside the "Hanh's Family Tree" Claude Project) and say "read the .md files and get caught up."
> Claude reads `SKILL.md`, `SESSION_LEDGER.md` (newest entries first), this file, and `ROADMAP.md`'s
> status table, then attaches `hellohanh/FamilyTree` with push access before changing anything.

This is **Hanh's Family Tree (HFT)**: a single-file HTML family tree built from Hanh's own family
spreadsheet and published on GitHub Pages. Started 2026-10-23, using the TNCFL Record Book's
working method and doc set as the template.

---

## Current State (as of 2026-10-27, S007 → Entry 140)

- **v2 "Trancestry" is live** at https://hellohanh.github.io/FamilyTree/ (Entry 139, 2026-10-27; old /v2/ links
  forward there). v1 is kept in `archive/v1-2026-10-26/`.
- **v2** — splash, sunburst, header, Options pane, search, side / top / Simple views, v1 morph, stone-slab drop, Back
  button, avatars, angel wings, tree name + TREES list are built and locked (SKILL.md → "v2 (Trancestry) — LOCKED";
  Ledger Entries 76–139).
- **Data:** `data/tree.json` (from the spreadsheet + `corrections.json` + `structure.json`); `data/catalog.json` holds
  branches kept for their own sunburst (Tường's family); `data/trees.json` names the trees. The spreadsheet stays git-ignored.
- **Minh's page** (Hanh's cousin Minh fills in Bà Thương's family) is **live and ready for Minh** at
  https://hellohanh.github.io/FamilyTree/minh/ (Entries 126–138): saves live in Supabase with a per-person edit code
  (Code Maker recipe), offers the Bà Thương link (Ông Hai + 44 shared people), ＋ Start a new tree, Rename this tree,
  and Hanh's admin-only **Review changes** list + Code Maker link. Editors: **hanhtran** (admin), **minhtran** (tree `thuong`).
  SQL run in Supabase: `02_minh.sql`, `03_review.sql`, `04_rename.sql`.
- **Backend:** Supabase project "Family Tree" + keep-awake workflow (`supabase/`, `.github/workflows/keep-awake.yml`).
- **Next:** send Minh his message + code (drafted Entries 137–138); Bảo Nguyễn (`baonguyen`) as next editor; fold
  Hanh-confirmed shared-people edits into `data/tree.json`; standardize link names / neutral start page; clean up test
  rows; Bà Lịch's sunburst.
- **Picture page live** (Entry 143): https://hellohanh.github.io/FamilyTree/photo/ — family code (Code Maker name
  "family", stored as a hash only), pictures show at once marked Pending, Hanh confirms / rejects in Review changes
  (main page via `?admin`, or /minh). Printable cards: `/photo/qr.html`. SQL: `05_photos.sql`.

## Working setup

- **Source of truth:** GitHub repo `hellohanh/FamilyTree`, branch `main`. Claude
  clones it into the cloud session, commits as `Hanh <hello.hanh@outlook.com>`, pushes only on "push".
- **Live:** `https://hellohanh.github.io/FamilyTree/` (Pages serving `main` root, no build step).
- **Mirror:** the four `.md` files are also saved as docs in the claude.ai Project
  "Hanh's Family Tree."
- **Local copy (optional):** TBD. Tell Claude the folder path if you keep one.

---

## File Map (repo root)

| Path | Purpose |
|------|---------|
| `SKILL.md` | Working method, locked rules and design, current status |
| `SESSION_LEDGER.md` | Locked change log, every session's entries |
| `README.md` | This file: orientation, resume prompt, stop protocol |
| `ROADMAP.md` | Milestone plan with a status table at the top |
| `data/Family Tree.xlsx` | Hanh's spreadsheet (raw input for the one-time import; never edited by Claude) |
| `data/corrections.json` | Hanh-approved name fixes applied at import (key `Sheet!Cell`, exact `from` → `to`) |
| `data/structure.json` | Hanh-confirmed structure fixes (blood relative, moved children, mothers, stepchild) |
| `data/tree.derived.json` | Prototype converter output (derived; regenerate, don't hand-edit) |
| `tools/parse_tree.py` | Prototype converter: spreadsheet → nested tree JSON per sheet |
| `tools/build_focus_mockup.py` | Builds `mockups/sunburst-focus.html` from the template + d3 + flubber + wings + fonts + JSON |
| `tools/tests/*.js` | Playwright scripts used to screenshot and verify each change (editor, scroll, band, depth…) |
| `fonts/segoeui*.woff2` | Hanh's Segoe UI Regular/Bold, subset (Latin + Vietnamese), embedded in the page |
| `mockups/sunburst-focus.html` | **Current interactive mockup**: sunburst → side focus view, editor, export |
| `mockups/sunburst-focus.template.html` | Its source template (placeholders filled by the build script) |
| `mockups/*.png` | Every preview shown to Hanh, named by topic |
| `index.html` | **The live page** (built by `tools/build_index.py`; loads `data/tree.json`) |
| `data/tree.json` | **The tree data, source of truth** (updated only from Hanh's Export changes file) |
| `future/` | Catalogued ideas not on the live page (3D layered view prototype, split-wheel mock) — see `future/README.md` |
| `assets/` | Splash trees (webp + originals) and the marigold wings |
| `tools/build_index.py` | Builds `index.html` from the mockup template |
| `index.html` · `v2/` | v2 "Trancestry" (live): `v2/src/index.template.html` → `tools/build_v2.py` → `index.html` at the root; `v2/` keeps d3, flubber, avatars and a redirect `v2/index.html` |
| `minh/` | Minh's page: `src/` (kin.js, store.js, editor.html, editor.js) → `tools/build_minh.py` → `minh/index.html` |
| `data/trees.json` | Tree names + links for the header, tab and the pane's TREES list (Entry 129) |
| `data/vn_names.txt` | Name suggestions for the editor (given names with English meanings, family names) |
| `data/catalog.json` | Branches kept for their own sunburst (Tường's family, Entry 98) |

---

## Resume Prompt

Paste this to start the next session:

```
Continuing work on Hanh's Family Tree — v2 "Trancestry" (live at /FamilyTree/ since Entry 139).
Read all .md files to get caught up (SESSION_LEDGER newest first; SKILL.md → "v2 (Trancestry) — LOCKED").

Repo: hellohanh/FamilyTree. Attach it with push access, work from a cloud clone, commit locally as
Hanh <hello.hanh@outlook.com>, and push ONLY when I say "push". My spreadsheet is NOT in the repo (git-ignored).
v2 source: v2/src/index.template.html → python3 tools/build_v2.py . → index.html (root).
Minh's page: python3 tools/build_minh.py . → minh/index.html (patches v2's template; sources in minh/src/).

Status as of 2026-10-26 (S006, Entry 129): v2 splash, sunburst, header, Options pane, search, side / top / Simple views,
morph, stone-slab drop, Back button, avatars and angel wings are built and locked. Minh's page (/minh/) step 1 is built:
v2 engine + pencils + the locked edit pop-up, saving in the browser only.
Next: Minh's page step 2 — live saving in Supabase with Minh's code (I run the SQL), then step 3 (Bà Thương link),
step 4 (my review list).

Ways of working: ask questions as tappable choices, one at a time; never infer a family fact; spar honestly;
show me inline previews (separate pictures, shown before any question) before I lock anything; test on a
1440×900 computer and my Galaxy S25 Ultra (412×891); log every decision in SESSION_LEDGER and mirror the docs.
```

---

## Stop Protocol (run at end of every session)

1. Append new entries to `SESSION_LEDGER.md` (next number after the last one).
2. Update this file's Current State and resume prompt if anything materially changed.
3. Update `ROADMAP.md`'s status table and any milestone headers that changed.
4. Update `SKILL.md` with any newly locked rules or decisions.
5. Commit. **Push to `main` only after Hanh says "push"** (pushing publishes the live page). After
   an approved push, confirm the Pages site updated.
6. Mirror the four `.md` files into the claude.ai Project "Hanh's Family Tree" docs.
7. Build a snapshot zip of the repo (excluding `.git`): `S0XX_YYYY-MM-DD_FamilyTree.zip`. `XX` is
   this project's own sequence (last: **S007**, 2026-10-27 → next is **S008**). Never shared with
   the TNCFL sequences.
