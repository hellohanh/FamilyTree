# Hanh's Family Tree — Roadmap

Milestone plan, sequenced per the collaborative-build-method: data format before converter,
converter before template, template proven on one small branch before the whole tree. Each
milestone is about one session's worth of scope, small enough to fully verify and lock.

---

## v2 "Trancestry" status (as of 2026-10-26, S006 → Entry 129)

| Piece | Status |
|-------|--------|
| Splash (seasonal leaves, tap to enter) | ✅ Locked (Entries 76, 87–88, 90, 99) |
| Sunburst (whole, snapped, focal titles, pill) | ✅ Locked (Entries 80–96, 117) |
| Header + Options pane (docked on computers, left handle on phones) | ✅ Locked (Entries 89, 94, 96, 118) |
| Search | ✅ Locked (Entries 92–93) |
| Side view · Top view · Simple view | ✅ Locked (Entries 97–124) |
| Morph + stone-slab drop + Back button | ✅ Locked (Entries 104, 111–116, 123–124) |
| Avatars (sets per couple) | ✅ Locked (Entries 77, 102–103, 110) |
| Angel wings in Side / Top / Simple · Clear focal keeps the family | ✅ Locked (Entries 126–127) |
| Tree names + TREES list in the Options pane ("Hạnh's Paternal Grandpa & Siblings", Entry 136) | ✅ Locked (Entry 129) |
| **Minh's page /minh/ — step 1:** v2 engine + pencils + edit pop-up (browser only) | ✅ Built (Entry 126) |
| Minh's page — step 2: live saving (Supabase) + Minh's code checked on the server · ＋ Start a new tree | ✅ Live, tested by Hanh (Entries 132–133) |
| Minh's page — step 3: link Bà Thương → Ông Hai + 44 shared people; two husbands laid out like Entry 106 | ✅ Built + pushed (Entry 135) |
| Minh's page — step 4: Hanh's review list (admin sign-in, badge, edit / confirm) + admin-only Code Maker link | ✅ Live (Entry 137): admin hanhtran, Minh on minhtran |
| Minh's page — rename a tree (`04_rename.sql`) | ✅ Live (Entry 138) |
| Photo upload page + QR (photo replaces avatar) | ✅ Live (Entry 143): /photo/, family code, Pending, review on both pages |
| Live family edits + Hanh's approval log (Supabase, family code, admin sign-in) | ⬜ (Supabase project + keep-awake ready) |
| Editor (Simple view is the family-unit editing view) | ⏳ Built for Minh's page (Entry 126); v2 later |
| Bà Lịch's sunburst + tree picker; Tường's own sunburst | ⬜ (waiting on data) |
| Main page — Suggest an update (search → edit pop-up, family code, Pending, review) | ✅ Built + pushed (Entry 144) — run 06_updates.sql |
| Pane: Edit Tree (was Suggest an update) + Add a picture link | ✅ Entry 148 |
| Remove option in Edit Tree (divorce / mistaken entry) | ✅ Entry 152 |
| Tap the centre avatar → focal (gold border around both) | ✅ Entry 153 |
| The other three trees: Hạnh's Maternal Grandparents · Hương's Paternal / Maternal Grandparents (`?tree=`) | ✅ Entry 150 |
| Catalogued (Entry 144): titles across linked trees (⏸ Entry 147: wait for Minh's tree, define titles case by case) · ~~godparents~~ ✅ Entry 149 · ~~sibling order~~ ✅ Entry 146 · ~~adopted checkbox~~ ✅ Entry 148 · ~~Thím/Mự with a slash~~ ✅ Entry 151 | ⬜ |
| Go live: v2 replaces v1 at the main link | ✅ Live (Entry 139, 2026-10-27) |

---

## v1 status at a glance (as of 2026-10-23, S003 → Entry 30 — v1 since finished, live and archived)


| Milestone | Status |
|-----------|--------|
| 0 — Project setup (docs, decisions, repo) | ✅ Repo created and pushed (Entry 31) |
| 1 — Spreadsheet intake & data format lock | ✅ Audit done (Entries 28–30): 11 name fixes in `data/corrections.json`, Ông Hai restructure in `data/structure.json`; birth order = oldest first; format = separate `data/tree.json` |
| 2 — Converter (spreadsheet → derived data) + verification report | ⏳ Prototype converter works with corrections + structure fixes; final tree.json + report next |
| 3 — Visual direction (rendered mockups, pick one) | ✅ Locked in `mockups/sunburst-focus.html` (Entries 3–21); phone layout deferred to 8 |
| 4 — Empty template (layout, person card, navigation; no real data) | ⬜ |
| 5 — Prove it on one branch (real data, small) | ⬜ |
| 6 — Whole tree | ⬜ |
| 7 — Deploy to GitHub Pages | ⬜ |
| 8 — Polish (mobile, search, print, accessibility) | ⬜ Phone layout explicitly deferred here (Entry 18) |
| 9 — In-page editor (pencil → modal + export file) | ✅ Design locked in the mockup (Entry 17); carry into the real page |

---

## Milestone 0 — Project setup

- ✅ `SKILL.md`, `README.md`, `ROADMAP.md`, `SESSION_LEDGER.md` written (Entry 1).
- ✅ Decisions locked: spreadsheet source, single HTML file, public GitHub Pages, show everything
  for living relatives, name "Hanh's Family Tree," repo + zip + Project-docs handoff.
- ⬜ Hanh creates `hellohanh/FamilyTree` on GitHub; Claude attaches it with push access, commits
  the docs, and pushes on "push."
- ⬜ Hanh saves the `hanh-family-tree` skill from the proposal card.

## Milestone 1 — Spreadsheet intake & data format lock

- Hanh uploads the spreadsheet. Claude reads it **as-is**: sheets, columns, row count, how
  relationships are expressed (parent columns? spouse columns? IDs or names?), blanks, oddities.
- Claude reflects the structure back and flags every ambiguity as a tappable question (duplicate
  names, missing parents, multiple spouses, adoptions, date formats, name order/diacritics).
- **Lock:** what each column means, how a person is uniquely identified, how relationships are
  read. No data is changed in this milestone.

## Milestone 2 — Converter + verification report

- A script in `tools/` reads the spreadsheet and produces the derived data the page reads.
- Format decision lands here: separate JSON file vs. embedded in `index.html` (embedding also
  lets the file open by double-click from disk; a JSON file keeps data and page cleanly separate).
- Produces a **verification report** Hanh can check against the spreadsheet: person count,
  generations, each person's parents/spouses/children, and anyone disconnected from the tree.
- **Lock:** report matches Hanh's records.

## Milestone 3 — Visual direction

- 2–3 rendered mockups (screenshots), e.g. top-down generations, horizontal pedigree, fan chart,
  with a person card style. Hanh picks; we spar on trade-offs (wide families, many generations, phones).
- **Lock:** layout model, colors/type, what a person card shows, how you navigate (pan/zoom,
  click to re-center, expand/collapse).

## Milestone 4 — Empty template

- Build `index.html` on placeholder data only: layout, cards, navigation. Full-page preview.
- **Lock:** template.

## Milestone 5 — Prove it on one branch

- Real derived data for one small branch Hanh chooses. Verify every card against the spreadsheet.
- **Lock:** template + data path end to end.

## Milestone 6 — Whole tree

- Add the rest, a branch at a time if the tree is large. Watch for edge cases (remarriage,
  half-siblings, same-name people, unknown parents).

## Milestone 7 — Deploy

- Turn on GitHub Pages (`main`, root). Push on Hanh's "push." Confirm the live URL.

## Milestone 8 — Polish

- Phone layout, search by name, print/PDF view, keyboard navigation, contrast.
- Done (Entry 67): side ↔ top-down toggle for the family view (top-down default) + stone-slab transition between family views.

## Future projects (catalogued — see `future/README.md`)
- 3D layered view of all trees with threads between shared people (prototype in `future/3d-layers/`).
- Bà Lịch's family as a separate tree — **waiting for Hanh's list of names**.
- Optional: English relationship next to the Vietnamese title ("Anh Đạt · 2nd cousin").
