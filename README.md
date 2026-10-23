# Hanh's Family Tree — Resume Reference

> **How to start a session:** upload the latest `S0XX_…_FamilyTree.zip` (or name the repo, or open a
> chat inside the "Hanh's Family Tree" Claude Project) and say "read the .md files and get caught up."
> Claude reads `SKILL.md`, `SESSION_LEDGER.md` (newest entries first), this file, and `ROADMAP.md`'s
> status table, then attaches `hellohanh/FamilyTree` with push access before changing anything.

This is **Hanh's Family Tree (HFT)**: a single-file HTML family tree built from Hanh's own family
spreadsheet and published on GitHub Pages. Started 2026-10-23, using the TNCFL Record Book's
working method and doc set as the template.

---

## Current State (as of 2026-10-23, S003 → Entry 30)

- **Phase:** design. The interactive mockup `mockups/sunburst-focus.html` holds almost every locked visual
  and interaction decision (see `SKILL.md` → Design — LOCKED). It runs on the real spreadsheet data via the
  prototype converter.
- **Spreadsheet:** received (`data/Family Tree.xlsx`) and **audited with Hanh (Entries 28–30)**. Fixes live in
  `data/corrections.json` (11 names) and `data/structure.json` (Ông Hai's two families); the sheet itself is never
  edited. Birth order = oldest first. **Data format locked: separate `data/tree.json` next to `index.html`.**
- **Next:** build the real `index.html` + `data/tree.json` from the locked mockup, then deploy when the repo exists.
- **Kinship titles:** "View as" (eye) sets a viewpoint; cards and the band show Southern Vietnamese titles from
  that person (Entry 23, locked).
- **Editor:** design-locked in the mockup (pencil → modal → Save → "Export changes" file for Claude to commit).
- **Repo:** https://github.com/hellohanh/FamilyTree (created and pushed 2026-10-23). The original spreadsheet is
  git-ignored (public repo). No live site yet: Pages goes on once `index.html` exists.
- **Deferred:** phone layout (Milestone 8).

## Working setup

- **Source of truth:** GitHub repo `hellohanh/FamilyTree`, branch `main` (once created). Claude
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
| `assets/` | Splash trees (webp + originals) and the marigold wings |
| `tools/build_index.py` | Builds `index.html` from the mockup template |

---

## Resume Prompt

Paste this to start the next session:

```
Continuing work on Hanh's Family Tree ("Gia Phả Họ Trần" / "My Family Tree"): a single-file HTML family tree,
eventually public on GitHub Pages. Read all .md files to get caught up (SESSION_LEDGER newest first).

Repo: hellohanh/FamilyTree (exists). Attach it with push access, work from a cloud clone, commit locally,
and push ONLY when I say "push". My original spreadsheet is NOT in the repo (git-ignored); ask me for it if needed.

Status as of 2026-10-23 (S004, Entry 30): visual + editor decisions are locked in mockups/sunburst-focus.html,
and the data audit is done (corrections.json + structure.json). Data format: separate data/tree.json.
Next: build the real index.html + data/tree.json from the mockup, verify, then deploy.

Ways of working: ask questions as tappable choices, one at a time; never infer a family fact; spar honestly;
show me a rendered preview before I lock anything.

Data rule: the spreadsheet is imported once, verified with me, then retired. After that the tree data file
is the source of truth, changed only via the page's "Export changes" file that I send you.
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
   this project's own sequence (last: **S004**, 2026-10-23 → next is **S005**). Never shared with
   the TNCFL sequences.
