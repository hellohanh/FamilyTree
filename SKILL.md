---
name: hanh-family-tree
description: >
  Source of truth for HANH'S FAMILY TREE (HFT) — a single-file HTML family tree page built from
  Hanh's own family spreadsheet and published on GitHub Pages (hellohanh/FamilyTree). Use this skill
  for ANY work on the project: the spreadsheet intake and data format, the converter that derives the
  page's data, the tree layout/visual design, person cards, navigation, deploy, and the project's own
  README / ROADMAP / SESSION_LEDGER. Trigger on: Hanh's Family Tree, HFT, family tree, FamilyTree repo,
  family spreadsheet, ancestors, relatives, genealogy page.
---

# Hanh's Family Tree (HFT)

> **Paired skill (read both):**
> - `collaborative-build-method` — HOW to work with Hanh. The load-bearing rules are restated below
>   so this skill is self-contained.
>
> Modeled on the TNCFL Record Book project's file set (SKILL / README / ROADMAP / SESSION_LEDGER,
> Stop Protocol, snapshot zips). Nothing else carries over from TNCFL: no shared data, code or
> ledger numbering.

## What this project is

One HTML page that shows Hanh's family tree, built from a spreadsheet Hanh keeps. Hanh supplies the
facts and Claude builds the page. Every person, date and relationship on the page comes from that
spreadsheet.

## Status

### Current snapshot (as of 2026-10-23, Entry 23, S003)

- **Phase:** design largely locked in `mockups/sunburst-focus.html` (see "Design — LOCKED so far").
- **Next:** full data audit of the Excel sheet with Hanh (Ledger Entry 18, items 8–13), then the data
  format (item 14), then the real `index.html` (Milestones 2, 4–6).
- **Repo:** `hellohanh/FamilyTree` still **not created**; nothing pushed.
- **Deferred:** phone layout (Milestone 8).

## Locked decisions (2026-10-23, Entry 1)

| Decision | Locked value |
|---|---|
| Data source | **Hanh's own spreadsheet** (uploaded). It is the single source of truth |
| Tech approach | **Single self-contained HTML file**: no framework, no build step |
| Hosting | **Public GitHub Pages**, repo `hellohanh/FamilyTree` |
| Living relatives | **Show everything**, including full details (Hanh's call; see note below) |
| Project name | **Hanh's Family Tree** (skill `hanh-family-tree`, zips `S0XX_…_FamilyTree.zip`) |
| Handoff | Repo = source of truth + snapshot zip at each stop + `.md` files mirrored into the claude.ai Project "Hanh's Family Tree" |

**Living-relatives note:** the page is public, so anyone with the URL can read living people's full
names and birth dates. That is a common identity-verification combo. This was raised as a sparring
point; Hanh chose "show everything." Don't re-litigate it. If Hanh ever wants a switch, the
derived-data layer is where a "hide details for living people" filter would go (no data change needed).

## NON-NEGOTIABLE: THE DATA RULE

- **Raw input:** Hanh's spreadsheet is imported **once** (verified with Hanh), then **retired**. After that the
  **tree data file in the repo is the single source of truth** (Entry 12). It changes only via files exported
  from the page's editor that Hanh sends, which Claude reviews and commits. Never hand-edited silently or "cleaned up".
- **Derived data:** a converter (Milestone 1–2) reads the spreadsheet and produces the data the
  page uses. Derived output is regenerated from scratch on every run, never hand-edited.
- **The HTML never contains hand-typed family facts.** Names, dates, places and relationships all
  come from the derived data. Only page chrome (titles, labels, intro prose Hanh approves) is
  hand-written.
- **Never infer family facts.** A blank birth year is blank, not "about 1950." A missing parent is
  missing. Two people with the same name are two people until Hanh says otherwise. Spelling
  (including Vietnamese diacritics) is copied exactly as in the spreadsheet. If something looks
  wrong, ask. Don't fix it.
- **Verify against Hanh's records:** every derived output (person count, generations, who connects
  to whom) is shown back in a form Hanh can check against the spreadsheet before it's trusted.

## NON-NEGOTIABLE: HOW TO ASK QUESTIONS (carried over from TNCFL)

Always use the tappable question tool (`AskUserQuestion` in Claude Code / cloud sessions,
`ask_user_input_v0` in chat) with single-select options. NEVER ask in prose. NEVER ask more than one
question at a time. One question → 2–4 options (include "Let me explain") → wait → proceed.

## STANDING REQUIREMENT: ALWAYS SHOW A RENDERED PREVIEW (carried over from TNCFL)

Hanh wants to SEE a change before reacting to or locking it, not just read a description. After
any visual change, render the page with headless Chromium (pre-installed in the cloud session) and
show the screenshot, the FULL page and not only a close-up, then ask for the react/lock decision.

## Collaboration method (restated from `collaborative-build-method`)

1. **Never infer. Stop and ask** (tappable, one at a time).
2. **Spar honestly.** Argue against weak proposals, including your own, before building.
3. **Derive, don't editorialize.** Counts and facts come from running the converter, not from mental math.
4. **Verify every derived output against Hanh's spreadsheet.**
5. **Build incrementally.** Data format → converter → empty template → one small branch → whole tree.
6. **Lock and document.** Record confirmed decisions here and in `SESSION_LEDGER.md`.

## Deploy & workflow

- **Repo:** `hellohanh/FamilyTree`, branch `main`. Claude works from a cloud clone with push
  access and commits as `Hanh <hello.hanh@outlook.com>` (same identity as TNCFL).
- **NEVER push to `main` without Hanh's explicit "push".** Pushing publishes the live page.
- **Pages:** no build step. GitHub Pages serves the repo directly (Settings → Pages → deploy
  from branch `main`, root). *Not yet configured.*
- **Handoff:** at each stop, build `S0XX_YYYY-MM-DD_FamilyTree.zip` (repo minus `.git`) and mirror
  the four `.md` files into the claude.ai Project docs. See `README.md`'s Stop Protocol.

## Design — LOCKED so far (tweaking view by view with Hanh, Entries 3–5)

- **Navigation model:** sunburst splash (whole tree). Clicking a couple **morphs** (animated
  shape-morph + camera glide) into a focused view of that couple (sideways since Entry 16). Click a card to
  re-focus; "◎ Whole family" / Esc morphs back.
- **Focus-view levels (size / opacity):** grandparents 25/25 · parents 50/50 · **focus 100/100** ·
  children 75/100 · grandchildren 50/100 · great-grandchildren 30/100.
- **Theme: IBM Carbon g100.** Page `#161616`, cards/header `#262626`, borders `#525252`, text
  `#f4f4f4` / `#c6c6c6`.
- **♂/♀ icons: 30px, 12px gap to the name** (names 15px; card units at the 100% level; gap
  measured from the widest icon in the card).
- **Deceased marker: Hanh's angel-wings + halo art, recolored marigold `#F0BC4F`** on transparent,
  48×24 at the right end of the person's row (100% level). Replaces the spreadsheet's purple wings.
- **Sunburst colors: one Carbon categorical color per root-child line** (purple, cyan, teal,
  magenta, red, yellow, green, pink), lightened toward `#f4f4f4` 16%/generation (max 62%); auto label ink.
- **Connector lines level site-wide:** one horizontal bus per generation gap (midpoint between the
  upper level's lowest card bottom and the lower level's highest card top). Cards stay **centred** on their row.
- **Morph timing: 2.0s total; card color fades linearly (Lab) from sunburst color to the card color
  between 0% and 65% of the morph** (done at 1.30s). The way back uses the same window.
- **Editing (Entries 12/17):** a **yellow pencil with a red eraser at the far right of each person's card** (wings sit
  just left of it) opens an add-relative modal (spouse / brother /
  sister / son / daughter, ordered list, draggable new row, name / last name / alternative name, has-passed tick).
  Top of the modal edits the clicked person's own First / Last / Alternative names + has-passed (locked).
  **Saving = export file → Hanh sends it → Claude reviews and commits.** The public site stays read-only.
- **Couples = separate person cards side by side** (**28px** spouse gap + spouse line; 44px between sibling groups).
- **Generation spacing: 150%** of the original row gap (locked, Entry 15). A
  couple's line to their children drops from the spouse line; a parent's line **lands on the blood relative's card**.
- **Reading rule (confirmed by Hanh):** the first-listed person in each spreadsheet box is the blood relative;
  people after them are spouses.
- **Focus view is SIDEWAYS (Entry 16, locked):** generations left → right, siblings stacked top → bottom,
  spouses stacked in their column (blood relative on top). Wheel/trackpad scrolls, Ctrl+scroll/pinch zooms, scrolling
  stops at the tree's edges. Generation spacing 150% is horizontal; spouse gap 28 and family gap 100 are vertical.
  Lines leave a group's right edge and enter the blood relative's left edge. Level labels sit above each column.
- **Names:** fields First / Middle / Last / Alternative (+ Has passed) for the edited and the new person; the edited person also has ♂/♀ chips (Entry 29); a man with two wives is drawn 1st wife / husband / 2nd wife, each wife's children branching from between her and him (Entry 30); kinship: Dad's younger sister = O when the "Miền Trung" toggle is on (default) else Cô, her husband Dượng (Entry 37, from Hanh's Southern chart); phones (≤820 px): all header options in a ☰ menu (Entry 38); uncle/aunt side = the viewer's own blood parent (gen −1) / Ông·Bà + what that parent calls them (gen −2), age from the split (Entry 39, replaces the split-point side rule); sunburst snap button → centre at the left edge, ‹ › step generations (Entry 40); Back steps through visited views, then 3 presses on the sunburst to leave (Entry 41); eye centres on the person with all ancestors + their siblings, ＋/− toggles those siblings' children; Ông/Bà Kỵ = 4 up (Entry 43); sunburst: one panel per person (spouses side by side) — palette A 30% lighter, 12 px text (Entry 51; was 17 px, Entry 48), titles in dark-mustard chips with black text at the inner edge (labels not flipped), tap a name to open the couple, double-tap a name to view the wheel as them (Entry 49; no eyes), wheel sized so the thinnest panel fits a chip, snap on phones = two bands laid out from those two only, 16 px text, ring sizes computed so every name in both bands shows (Entries 54, 61; computers keep the full wheel in snap — Entry 59; computers: whole-wheel names 14 px on screen at any zoom, snap ~55% width, click/double-click same as phones — Entry 56; Entry 53's thinner bands reverted; Entry 52; Entry 47; Entries 44–45 for panels/colours); names 10 px from the inner edge in contrast-picked white/black (spouses match the blood relative), titles marigold with a shadow when low-contrast, marigold eye 5 px from the outer edge (Entry 45); sunburst turns by dragging around its centre, labels upright, angle kept (Entry 35); intro splash: one of two cut-out maple trees at random on #161616, hold 3 s, fade 0.5 s to the Paternal sunburst (Entry 32); two-part names: Vietnamese first, English second (Entry 57), stored as name + alt and shown "Name (Alternate)" (Entry 58); spreadsheet fixes live in data/corrections.json (names) and data/structure.json (who belongs where); full names
  **display in Vietnamese order: Last Middle First** ("Nguyễn Văn Hậu"). Cards show First (+ " / Alternative").
  Pencil is 18px (100% level).
- **Colors (Entry 18):** ♂ `#78a9ff` (Carbon Blue 40), ♀ `#ee5396` (Carbon Magenta 50), focus outline marigold
  `#F0BC4F` (same as the wings).
- **Card width (Entry 19):** auto-fit to the displayed name (+ icon, wings, pencil), **min 250**; each side-view column
  shares its widest card. Header toggle **"Aa Full names"**: off (default) = first name; on = Last Middle First / Alt.
- **Font: Segoe UI everywhere** (Hanh's own files, Regular + Bold, subset WOFF2 embedded as 'HFT Segoe'; ♂/♀ fall back
  to the system symbol font).
- **Depth:** focus view shows the direct line to the left (parents, grandparents only) and **all** generations to the
  right; beyond great-grandchildren (30%) each generation is 5 points smaller (25, 20, … floor 5%).
- **Start zoom:** a focus view fits the branch but never opens below 60% (42% on phones); scroll for the rest.
- **Generation band (Entry 21):** one line pinned under the header, labels over each column, formal capitals:
  Ông Bà Nội / Ông Bà Ngoại (from the blood-relative parent's ♂/♀) · Cha Mẹ · (couple's first names, marigold) · Con ·
  Cháu · Chắt · Chút · Chít (fallback "Đời Thứ N"). Replaces the English per-column captions. Band 40px; text
  = max(11px, 18px × the generation's size %).
- **Site title (Entry 21):** "Gia Phả Họ Trần" with "My Family Tree" underneath (Segoe). Project/skill name stays
  "Hanh's Family Tree".
- **Kinship titles from a viewpoint (Entry 23):** an eye ("View as") on every card sets the viewpoint (a spouse →
  their blood relative); header chip "Seen from X ✕" clears it. Cards show a bold marigold Southern title before the
  name: Ba/Má; Ông/Bà Nội/Ngoại; Ông/Bà Cố Nội/Ngoại (name hidden when it just repeats the title); Bác (older than the
  parent, spouse also Bác) / Chú–Thím, Cô–Dượng (Nội) / Cậu–Mợ, Dì–Dượng (Ngoại); Anh/Chị/Em (siblings; cousins by
  parents' order); Anh Rể/Chị Dâu/Em Rể/Em Dâu; Vợ/Chồng; Con, Con Rể/Con Dâu; Cháu (grandchildren, nieces/nephews,
  cousins' children); Chắt; grandparents' siblings Ông/Bà. **Entry 24: same generation and below on every line:**
  Anh/Chị/Em (spouses Anh Rể/Chị Dâu/Em Rể/Em Dâu); Con (own) / Cháu / Cháu / Chắt / Chút / Chít, spouses + Rể/Dâu.
  **Entries 25/27:** parents' and grandparents' generations (siblings + cousins) use uncle/aunt words, the side coming from
  the **viewpoint's own ancestor at the split**: a man → Bác (older branch) else Chú/Thím, **Cô/Chú (O's (Cô's) husband = Dượng (Entry 37; was Chú))**;
  a woman → **no Bác; Cậu/Mợ, Dì/Dượng at any age**. Grandparents' generation = Ông/Bà + the word (Ông Chú, Bà Cô…).
  grandparents' siblings and cousins Ông/Bà; three up Ông Cố/Bà Cố. Birth order = sheet order (until the
  audit). Typed Ông/Bà titles are stripped from sheet names. The band follows the viewpoint (Ba Má, Bác Chú Cô /
  Bác Cậu Dì, Anh Chị Em, Con/Cháu…).
- **Shared people + viewpoint (Entry 26):** confirmed shared people carry one `pid`; edits sync to every copy;
  "Seen from" follows the same person across sheets (if married-in there → their blood spouse's view, e.g. Hương on
  Huong's trees).
- Still preview-only (not locked): card width/line height, the defaults listed in Ledger Entry 3.

## Import rules confirmed by Hanh (Entry 20)

- DATA sheet = Hanh's cheat sheet → **excluded**.
- Four trees stay **separate sunbursts**. People confirmed to be the same across sheets (5 couples + everyone under them;
  see Ledger Entry 20) share **one ID** and get **"Also in … →" jump links**. An edit to one copy updates all copies.
- First-listed person in a box = blood relative (Entry 14).

## Open decisions (to be settled in order, see ROADMAP)

- Spreadsheet → derived-data format (JSON file next to the page, or embedded in the HTML so it also
  opens by double-click from disk).
- Tree layout and visual direction (top-down generations, fan chart, ancestor vs. descendant view,
  etc.), decided from a rendered mockup.
- Starting point / root person, and which branch proves the template first.
- Languages / name order (Vietnamese vs. Western order, diacritics, nicknames).
