# Hanh's Family Tree — Resume Reference

> **How to start a session:** upload the latest `S0XX_…_FamilyTree.zip` (or name the repo, or open a
> chat inside the "Hanh's Family Tree" Claude Project) and say "read the .md files and get caught up."
> Claude reads `SKILL.md`, `SESSION_LEDGER.md` (newest entries first), this file, and `ROADMAP.md`'s
> status table, then attaches `hellohanh/FamilyTree` with push access before changing anything.

This is **Hanh's Family Tree (HFT)**: a single-file HTML family tree built from Hanh's own family
spreadsheet and published on GitHub Pages. Started 2026-10-23, using the TNCFL Record Book's
working method and doc set as the template.

---

## Current State (as of 2026-10-31, S012 → Entry 221)

- **Live:** https://hellohanh.github.io/FamilyTree/ — v2 "Trancestry": the four built-in trees (`?tree=` hanh-paternal
  (default) · hanh-maternal · huong-paternal · huong-maternal) and the **database trees** (Sơn's (Trung/Văn) Paternal
  Grandparents, Hạnh's (Hậu/Thường) Paternal Grandma & Siblings, Minh's) — all open on the main page with `?tree=<link>`.
- **Editors' page** `/FamilyTree/editor/?tree=<link>` (Entry 201; old `/minh/` forwards there): editors build their own
  trees; a tree is **private until its editor turns on Published** (truly private in the database); Hanh (admin) sees
  every tree. "Same person?" offer (206) and **"Already in another tree"** suggestions while typing a name (210) link the
  same person from any other tree and bring their family.
- **Editing (both pages):** Admin **Edit** switch → pencil on every card, saves go straight in (207); drag ⠿ to put
  children / siblings in birth order (208); ~INC~ in the First name dropdown (209); **Born** month / year (211).
- **Titles across trees:** the focal follows you from tree to tree **for this visit only** (211, 219); a tree without
  them shows "Titles for Hạnh · through O Văn ✕" and titles from **every** tree they're in (212); their spouse's family
  by age (birth year). Rule (213): **vai** for blood relatives (branch seniority from birth order, oldest first), a
  spouse takes their partner's rank, the spouse's own family **by age**. Clear focal works there too (216).
- **Views:** the focal glows everywhere (194); drag to move the wheel, the outer complete ring or the **rotate rail**
  turns it (196–197; rail reversed 217: knob up = clockwise; 40°/s); ⟲ default zoom, no zoom limit (191, 195); zoomed-in
  generation bands: **one chip ‹ generation › + whole wheel** beside the zoom buttons (220); two wives (204); ‹ › step
  between generations in Side / Top, ˄ in Simple (205); Options search also lists **other published trees** (215);
  slim scrollbars (202).
- **The Multiverse** (`/3d/`): navigation pane always there; Pick up to 5 trees and Instructions are collapsible
  panels; turning resumes after 1 s (192–193). People made in a database tree link across trees (210).
- **Hanh (admin):** `?admin` → Admin: Published · Review changes · Start a new tree · Rename a tree · **Download a
  backup** (189) · Code Maker. Supabase SQL run: 02–11 (09_backup, 10_link_son_trung_van, 11_publish).
- **Builds:** `python3 tools/build_v2.py .` (main page) · `tools/build_minh.py .` (editors' page) ·
  `tools/build_photo.py .` · `tools/build_3d.py .`. Tests: `tools/tests/*.js` (local Postgres copy of a backup at
  /var/tmp/hftpg; `publish_reset.sh <load.sql>`).
- **Next:** Hanh removes the stray ~INC~ child under Lucia Xuan (Entry 218); add birth years (Hạnh, Trung's brothers
  and sisters) so by-age titles show; Bảo Nguyễn as editor still on hold; fold confirmed updates when Hanh attaches a
  download (also brings database-made people into The Multiverse's built-in trees).

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
| `minh/` · `editor/` | Editors' page: `minh/src/` (kin.js, store*.js, editor.*, link.js, xlink.js, focal.js, review.js …) → `tools/build_minh.py` → `editor/index.html` (+ the main page's editing parts); `minh/index.html` forwards to `editor/` |
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
Editors' page: python3 tools/build_minh.py . → editor/index.html (patches v2's template; sources in minh/src/).

Status as of 2026-10-31 (S012, Entry 221): see README "Current State" — four built-in trees + database trees on the
main page, editors' page /editor/ with Published, admin Edit switch, titles across trees (vai / by age), The Multiverse.

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
   this project's own sequence (last: **S012**, 2026-10-31 → next is **S013**). Never shared with
   the TNCFL sequences.
