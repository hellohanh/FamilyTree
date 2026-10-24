# Hanh's Family Tree — Session Ledger

Locked change log for Hanh's Family Tree only. Numbering starts at Entry 1 and is independent of
every TNCFL ledger.

---

## Entry 1 (2026-10-23) — Project created; working docs written; setup decisions locked

**Context:** Hanh wants an HTML page showing the family tree. Hanh uploaded
`S042_2026-10-17_TNCFL_RecordBook.zip` as the **model** for the project's file set and working
method. Read: its `SKILL.md`, `README.md`, `ROADMAP.md`, `SESSION_LEDGER.md`, plus the
`collaborative-build-method` skill. Only the *structure and method* carry over (skill + ledger +
README with resume prompt and Stop Protocol + roadmap with status table, snapshot zips, tappable
questions, rendered previews, push-only-on-"push"). No TNCFL data, code or numbering carries over.

**Decisions locked (Hanh's answers, asked one at a time):**
1. **Data source:** a spreadsheet Hanh has. It is the single source of truth.
2. **Tech:** single self-contained HTML file, no build step (recommended; Hanh agreed).
3. **Hosting:** first answered "Local file only," then Hanh went back and changed it to
   **public GitHub Pages**.
4. **Living relatives:** **show everything**. Sparring note recorded in `SKILL.md`: on a public
   page, full names + birth dates of living people are an identity-verification risk. Hanh's call
   stands, and a "hide living details" filter can be added later in the derived-data layer.
5. **Repo:** `hellohanh/FamilyTree`. Tried to attach it: **not found on GitHub**, so Hanh needs to create it.
6. **Name:** "Hanh's Family Tree" (skill `hanh-family-tree`, zips `S0XX_…_FamilyTree.zip`).
7. **Handoff:** repo is source of truth + snapshot zip at each stop + `.md` files mirrored into
   the claude.ai Project "Hanh's Family Tree" docs.

**Written this entry:** `SKILL.md`, `README.md`, `ROADMAP.md`, `SESSION_LEDGER.md`. The skill was
offered to Hanh as a skill proposal to save. The docs were mirrored into the Project docs.
Snapshot zip: `S001_2026-10-23_FamilyTree.zip`.

**Status at end of entry:** 🟡 Milestone 0 docs done. Waiting on (a) Hanh creating the repo and
(b) the spreadsheet upload for Milestone 1.

---

## Entry 2 (2026-10-23, cont.) — Spreadsheet received; prototype converter; five layout mockups

**Input:** `Family_Tree_.zip` → `Family Tree .xlsx`. Five sheets: `H.HN.T Paternal Tree` (212
people), `H.HN.T Maternal Tree` (76), `Huong's Paternal Tree` (91), `Huong's Maternal Tree` (75),
and `DATA` (an older draft typed in VIQR-style accents, e.g. `Tha'i`, and it contains a phone number).
Counts are from the converter, not hand-counted. **`DATA` was ignored** pending Hanh's call.

**How the sheets encode the tree (as read, NOT yet confirmed by Hanh):** each person is a ♂/♀
cell with the name two columns right. The column gives the generation. Entries exactly 2 rows apart
in the same column share a box (couple, or one person + two spouses: `Bà Li.ch / Ông Hai / Bà
Tường`). A box's parent is the nearest box above it one column to the left. The angel-wings picture
on a name cell means deceased (all 5 drawings use the same wings image). Other text in a symbol
column (`Any kids?`, `4 kids?`, `Let's find about kids`) is a note on that box.

**Prototype converter:** `tools/parse_tree.py`, which outputs one nested tree per sheet. No
cross-sheet merging; names copied exactly.

**Mockups (Milestone 3, pulled forward at Hanh's request "show me different layouts"):**
`mockups/layouts.html` (interactive, all 4 tree sheets) + screenshots `layout-A..E.png`:
A Top-down · B Sideways collapsible · C Radial · D Sunburst · E Outline (phone).

**Open questions queued (ask one at a time):** layout pick; is the first-listed person in a box
always the blood relative; `DATA` sheet keep or drop; same people appear on several sheets (e.g.
Hạnh & Hương, Hậu & Thường): link them or keep the trees separate; `Hường + Lục` (Maternal L80/L82)
read as a couple, so confirm; `Preggo` (Paternal AP460, no symbol) shown as a person; two blank-name ♀
with wings (Maternal L206/L209); leftover VIQR spellings in tree sheets (`Bà Li.ch`, `Ky``).

---

## Entry 3 (2026-10-23, cont.) — Layout direction: sunburst splash that morphs into a focused top-down view

**Hanh's call (Milestone 3):** the splash is the **sunburst** (D). Clicking a couple **morphs it with
animation** into a top-down view focused on that couple. Sizes and opacities by level, relative to
the clicked couple:

| Level | Size | Opacity |
|---|---|---|
| Grandparents | 25% | 25% |
| Parents | 50% | 50% |
| **Focused couple** | 100% | 100% |
| Children | 75% | 100% |
| Grandchildren | 50% | 100% |
| Great-grandchildren | 30% | 100% |

**Built as a mockup:** `mockups/sunburst-focus.html` (d3 + flubber shape-morph, inlined; data from
`tools/parse_tree.py`). Arcs morph into cards while the camera glides; non-included arcs fade.
Clicking any card re-focuses. "◎ Whole family" or Esc morphs back to the sunburst.

**Defaults Claude chose (not yet confirmed by Hanh):**
- Only the direct line is shown above (no aunts/uncles or siblings of the focused couple).
- Nothing is shown below great-grandchildren.
- On wide branches the camera won't zoom out past 60% (42% on phones), so the focused couple stays
  readable and the rest spills off-screen for panning.
- Level captions sit at the left.

**Seen in preview:** wide branches (e.g. Ông Thiện/Xinh & Bà Hải, 8 children) make the 30%
great-grandchildren unreadably small. That's the cost of the spec, flagged to Hanh. Phone sunburst
is small (phone pass deferred to Milestone 8). Zero console errors.

---

## Entry 4 (2026-10-23, cont.) — Dark theme: IBM Carbon g100 locked; bigger ♂/♀ icons

Hanh: "I want this on a dark background, I think Carbon was the name of the theme. I want the female
and male icons to be bigger. Let's start with background, and we'll go through each of the pages
and tweak as we go."

- Read "Carbon" as **IBM Carbon Design System**. Previewed g100 (#161616) vs g90 (#262626).
  **LOCKED: g100.** Tokens: page `#161616`, header/cards (layer-01) `#262626`, borders `#525252`,
  text `#f4f4f4`, secondary text `#c6c6c6`. ♂ `#6cc3cc` / ♀ `#e889b5` / focus accent `#e0907f`
  are not changed yet. Sunburst ring browns are unchanged.
- **Icons (preview, not locked):** card ♂/♀ symbols 13px → 23px; name column shifted right; line
  height 21 → 27; card width 200 → 210. Header legend symbols enlarged.
- **Wings fix (Claude's call, flagged):** the dark-purple wings PNG nearly vanished on g100, so it's
  brightened with a CSS filter (no change to Hanh's image).
- **Working mode (Hanh):** go through each page/view and tweak as we go, one thing at a time.

---

## Entry 5 (2026-10-23, cont.) — ♂/♀ icon size: 30px, 12px gap to the name

Hanh asked what size the icons were. Answered: 23px on a full-size card (names 15px), scaled by
level, then by the camera zoom (2× in the Hậu & Thường view). **Hanh's call: icons 30px, 12px
between icon and name.** Built: `ICON=30`, `ICON_GAP=12`, `NAME=15` (card units at 100% level).
The gap is measured from the widest icon in each card so names line up. Verified in the DOM:
icon x −103 + width 22.5 + 12 = name x −68.5. Card line height 27 → 36, card width 210 → 230 to fit.
Preview `mockups/icons30-g100-2-focus.png`. **LOCKED by Hanh.**

---

## Entry 6 (2026-10-23, cont.) — Hanh's angel-wing art for everyone who has passed, recolored pale yellow

Hanh supplied a new angel-wings + halo line drawing (black on white, 1072×537) to replace the
spreadsheet's purple wings on every deceased person. Asked: change the black to pale yellow.
- Recolored with transparency kept: darkness → alpha, color **pale yellow `#F8E9A1`** (Claude's pick for
  "pale yellow", not yet confirmed), white → transparent, cropped, half-size (535×268) embedded.
  Files: `mockups/angel-wings-original.png` (Hanh's), `mockups/angel-wings-pale-yellow.png`.
- Placed at the right end of the deceased person's own row: **48×24 at the 100% level**, scaled by level
  like everything else. The old brighten-filter workaround was removed.
- Preview `mockups/wings-card.png` (Hậu & Thường card, matching Hanh's example) +
  `mockups/wings-focus.png`. Awaiting lock.

**Update (same entry):** Hanh wanted it warmer, saw six shades (`mockups/wings-yellow-swatches.png`:
A #F8E9A1 · B #F7DC8C · C #F3D27A · D #EEC46A · E #F0BC4F · F #E6AA45) and chose **E Marigold
`#F0BC4F`. LOCKED.** Asset: `mockups/angel-wings-marigold.png`. Size 48×24 at the 100% level is unchanged.

---

## Entry 7 (2026-10-23, cont.) — Sunburst colors: one color per family line (Carbon categorical)

Showed 5 schemes on g100 (`mockups/sunburst-palettes.png`): 1 current browns · 2 marigold ramp ·
3 Carbon grays · 4 Carbon blue ramp · 5 color per branch. Sparred: only 5 adds information (which line
a slice belongs to); 2 is heavy and competes with the marigold wings. **Hanh: 5. LOCKED.**
- Each child-couple of the root gets its own Carbon categorical color, in sheet order:
  purple `#8a3ffc`, cyan `#1192e8`, teal `#007d79`, magenta `#d02670`, red `#fa4d56`, yellow `#b28600`,
  green `#198038`, pink `#ee538b` (cycles after 8). Each ring outward is mixed toward `#f4f4f4` in Lab
  space by 16% per generation, capped at 62%. Root center `#393939`.
- Label ink is chosen automatically per slice: `#161616` on light fills, white on dark.
- Default in `mockups/sunburst-focus.html` is now `branch` (other schemes stay reachable with
  `?pal=` for reference).

---

## Entry 8 (2026-10-23, cont.) — Connector lines level site-wide

Hanh (screenshot of Hậu & Thường): the line to Thảo dropped lower than the line to Hạnh / Huyền Nhi.
"I want the lines to be even site-wide. Each branch stemming from the parent should be level, not above or below."
- **Cause:** each elbow's horizontal was at the midpoint between its own parent bottom and its own child
  top, so a shorter (one-person) card pulled its line down.
- **Fix:** the horizontal "bus" is now set **per generation** (`busY`): the midpoint between the lowest card
  bottom of the upper level and the highest card top of the lower level. Every branch between the same two
  generations shares one line, whatever the card sizes.
- **Verified in the DOM** (Lành & Bảy view, 4 generation gaps): exactly 4 distinct bus heights, one per
  gap. Previews `mockups/lines-hau.png`, `mockups/lines-lanh.png`. Zero console errors. **LOCKED.**
- Asked whether to top-align the cards in a row too (one-person cards sit lower because they're centred). **Hanh: keep centred.**

---

## Entry 9 (2026-10-23, cont.) — Morph color fades evenly from sunburst color to charcoal

Hanh: "When morphing, have the color fade from the sunburst color to the final color over the length of
the animation. I don't want a sudden change to the charcoal after the morph completes."
- **Measured first** (focal path fill sampled during the morph): the fill rode the shape's ease-in-out
  curve. It held the branch color until ~0.6s, then dropped to `#262626` between ~0.6s and ~0.9s, which reads as a snap.
- **Fix:** color now runs on its own transition (`colorFade`): **linear over the full 1.2s, blended in
  Lab space**, for both fill and outline. The same applies on the way back (card → sunburst color).
- **Re-measured:** an even decline at 0.1 / 0.3 / 0.6 / 0.9 / 1.15s → `#262626` at 1.3s. Filmstrip
  `mockups/morph-color-fade.png`. Awaiting Hanh's react.

---

## Entry 10 (2026-10-23, cont.) — Color must reach the top-down color before the morph ends; timing tuning panel

Hanh (screenshot of the finished Ông Thiện/Xinh focus): fade from the purple to the final card color
**before** the animation finishes, and show a preview with tweaks for animation length and for when the
color changes.
- **Noticed:** Hanh's screenshot reads darker than the file (page ≈ `#040506`, cards ≈ `#101213` vs the
  locked `#161616` / `#262626`), most likely the display or screenshot. **Locked colors left unchanged;**
  flagged to Hanh.
- **Built:** the color change now has its own window inside the morph: starts at `COLOR_START`,
  finishes at `COLOR_END` (fractions of the morph). Morph length `DUR` is now variable. Mockup-only **Timing
  panel** (bottom-right, desktop) with sliders for morph length (0.4–3.0s), color start % and color end %,
  a window bar, and "▶ Replay on Hậu & Thường". URL params `?dur=&cs=&ce=`. Default **1.2s, color 0% → 75%**.
- **Verified** (focal card fill sampled at 0/20/40/60/80/100%): it reaches `#262626` by the 80% sample in
  all three presets, i.e. before the morph ends. Presets A 1.2s 0→75 · B 1.6s 0→60 · C 2.0s 20→70.
  Filmstrip `mockups/timing-presets.png`.
- **Hanh's numbers: morph 2.0s, color 0% → 65%** (charcoal by 1.30s, then 0.7s of shape settling). **LOCKED** as the defaults. The Entry 9 linear Lab fade is locked with it.

---

## Entry 11 (2026-10-23, cont.) — Timing panel removed

Hanh: "remove the timing panel." Removed its markup, styles and script from `mockups/sunburst-focus.html`.
The locked timing (2.0s, color 0% → 65%) stays as the built-in default. The `?dur=&cs=&ce=` URL overrides
are kept for testing only (invisible to viewers). Verified: no panel, zero console errors (`mockups/no-panel.png`).

---

## Entry 12 (2026-10-23, cont.) — Edit/add relatives: "+" and add-relative modal (inline preview)

Hanh's spec: a faint **+** to the left of each ♂/♀ icon. Clicking + on a person (e.g. Hậu) opens a modal: add
**spouse, brother, sister, son or daughter**. Picking one lists the current siblings/children **in order**, plus
a **name field that can be dragged into the right place**. A **"has passed" tick**, and fields for **last name**
and **alternative name**.

**Inline preview built** (chat widget, not yet in `sunburst-focus.html`): the Hậu & Thường card with a dashed,
55%-opacity + per row (gold on hover). The modal has relation chips; ordered list (Hậu's siblings from the Paternal
sheet with "this card" marked; children of Hậu & Thường; current spouse); a gold dashed draggable new-person row
with ↑/↓ buttons as a keyboard/touch fallback; Name / Last name / Alternative name; "Has passed" with wings.
Validation: name required.

**Claude's defaults (flagged, not confirmed):** gender comes from the relation (brother/son ♂, sister/daughter ♀);
for spouse Hanh picks ♂/♀ (not inferred). Sibling order = sheet order. A new spouse is listed after the current one.

**Open — raised to Hanh:** where edits are saved. The site is a static public GitHub Pages page with no
server, and the data rule makes the spreadsheet the single source of truth.
- **Hanh's call: "Export file → I commit." LOCKED.** The public site stays read-only. Edits made in the page
  produce a data file Hanh downloads and sends to Claude; Claude reviews the diff and commits/pushes (only on "push").
- **Source of truth after import — Hanh: the tree data file. LOCKED.** The spreadsheet is imported **once**,
  verified with Hanh, then retired. From then on every change goes through the page (export → Claude commits).
  This makes the one-time import (Milestone 1–2 reading rules + verification) the critical step.
- **Modal v2 (Hanh):** the top of the modal now edits **the clicked person's own First / Last / Alternative
  names** (prefilled; Hậu has first name only today), above "Add to Hậu's family". Typing updates the title
  and the card live. The button is now "Save" (saves the person's edits and, if filled, the new relative).
  Validation: first name can't be empty; a new relative needs a first name; a new spouse needs ♂/♀.
  Inline preview shown; awaiting react.
- **LOCKED (Hanh): modal v2 + a "has passed" tick for the person being edited** (next to their F/L/A fields;
  toggles their wings). Spec for the build: top = edited person (First / Last / Alternative / Has passed);
  below = "Add to X's family" (relation chips, ordered list, draggable new row with ↑/↓, First / Last /
  Alternative, Has passed, ♂/♀ for spouse); one Save.

---

## Entry 13 (2026-10-23, cont.) — Spouses on separate cards, side by side

Hanh: husband and wife should be **two separate cards right beside each other**, to handle multiple spouses
and their children. Preview requested on Hậu & Thường.
- **Built:** each box is now a row of person cards (`PW=230` each), with a **14px** gap between spouses joined
  by a short spouse line. The gap between sibling groups grew 22 → 44 so couples read as couples. Card height
  is one row. Wings sit at the right end of each person's own card. The 3-person group (Bà Lịch / Ông Hai /
  Bà Tường) shows as three cards in a row.
- **Morph:** one sunburst slice now **splits** into the couple's two cards (`flubber.separate`) and **combines**
  back on return (`flubber.combine`). Mid-morph frame: `mockups/split-morph-mid.png`.
- **Lines:** a couple's line to their children drops from the spouse link between the two cards; singles and
  3-person groups drop from the card bottom. The per-generation bus (Entry 8) is unchanged. Re-verified: one
  bus height per generation gap (4 in the Lành & Bảy view), zero console errors.
- Previews `mockups/split-hau.png`, `mockups/split-lanh.png`. The pre-change template is kept as
  `focus.template.pre13.html` in Claude's scratch area.
- **Open (raised to Hanh):** a child's line currently lands between a married child's two cards (e.g. between
  Hạnh and Hương). For multiple spouses it should land on the blood relative, which depends on the
  unconfirmed "first-listed person is the blood relative" reading rule.

---

## Entry 14 (2026-10-23, cont.) — Reading rule confirmed: first-listed = blood relative; child lines land on them

Shown side by side inline: now (line lands between Hạnh | Hương) vs proposed (line lands on Hạnh). **Hanh: "Yes,
first = blood relative." LOCKED reading rule:** in every spreadsheet box, the first-listed person is the blood
relative and anyone after is a spouse. This settles one of the Entry 2 open reading questions.
- **Built:** a parent's line now lands on the first card of a married child's group (`linkPath` `mc>1`).
  Re-verified: Lành ← Ông Thiện/Xinh & Bà Hải, Phong / Tiên ← Lành & Bảy; one bus per generation gap; zero errors.
  Previews `mockups/blood-line-hau.png`, `mockups/blood-line-lanh.png`.
- Shown in the proposal but **not built** (not asked for yet): dashed border and "son"/"spouse" tags on cards.

---

## Entry 15 (2026-10-23, cont.) — Generation spacing 150%, with a temporary tuning rail

Hanh: increase the space between generations, today's = 100% → 150%, and show a preview with a rail to adjust it.
- **Built:** `GEN_SP` multiplies the vertical gap between generation rows (still scaled per level as before).
  Default **150%**. A temporary **Spacing rail** (bottom-right) runs 100–250% in 5% steps and re-lays out the
  current focus view live (0.35s). URL `?gen=` for testing.
- **Verified:** 100% / 150% renders and the rail driven to 200% re-lays out correctly; level-matched lines intact; zero
  console errors. Note: the camera re-fits after each change, so on a short branch the on-screen difference
  is smaller than the %. Previews `mockups/gen-100.png`, `gen-150.png`, `gen-200-rail.png`. Awaiting Hanh's value.
- **Hanh: lock 150%. LOCKED.** The rail was removed (markup, styles, script). `?gen=` is kept for testing only.
- **Hanh: double the spacing between spouses: 14 → 28.** Built. Preview `mockups/spouse-gap-28-hau.png`.
  Spar raised: the gap between sibling groups is still 44, so a couple (28) and the space between two families
  (44) now look close (e.g. Hương ↔ Huyền Nhi).
- **Hanh: gap between sibling families → 100** (was 44). Built. Previews `mockups/family-gap-100-hau.png`, `-lanh.png`.
- **Side fix (Claude, flagged):** at the wider spacing the "CHILDREN" caption overlapped Phong's card. Level captions
  now sit just left of **each row's own leftmost card**, so they stagger with the tree and never overlap. Zero errors.

---

## Entry 16 (2026-10-23, cont.) — Focus view turned sideways (better for scrolling)

Hanh (instead of locking the top-down spacing): "morph it to a side view rather than a top-down view; this is better
for scrolling."
- **Built:** generations now run **left → right** (grandparents · parents · focus · children · grandchildren ·
  great-grandchildren), and siblings stack **top → bottom**. Same layout engine with the axes swapped (`ORIENT`;
  `?orient=top` still shows the old view). All locked numbers carry over on their new axes: generation spacing 150%
  (now horizontal), spouse gap 28 (now vertical), sibling-family gap 100 (now vertical), level sizes/opacities, wings,
  icons, color fade, timing.
- **Spouses (Claude's call, flagged):** in the side view a couple stacks **vertically** in its generation column
  (blood relative on top, spouse below, short spouse line between). Side by side would make every column two cards
  wide.
- **Lines:** out of a group's right edge (a couple's line leaves from between the two cards), along one vertical
  bus per generation gap, into the blood relative's left edge (Entry 14 kept). Level labels sit above each column.
- **Scrolling:** in the focus view the mouse wheel / trackpad now **scrolls** (vertical and horizontal); Ctrl+scroll
  or pinch zooms. Scrolling stops at the tree's edges (+200 margin). On wide branches the view opens centered on the
  focused couple. Verified with a scripted wheel test on Ông Thiện/Xinh & Bà Hải: it scrolls down and stops at the
  last family (Hậu & Thường), and 40 extra wheel steps don't move it further. Zero console errors.
- Previews `mockups/side-hau.png`, `side-lanh.png`, `side-wide-top.png`, `side-wide-scrolled.png`.
- **Hanh: "Stacked is right." LOCKED:** side view; spouses stacked in their generation column; wheel scroll / Ctrl+scroll
  zoom; scroll stops at the tree's edges. Supersedes the top-down layout from Entries 3/13 for the focus view (all the
  locked spacing numbers carry over on the new axes).

---

## Entry 17 (2026-10-23, cont.) — Pencil replaces the "+"; editor wired into the real page

Hanh: instead of the small + left of the icon, **each person gets a pencil (yellow with a red eraser) at the far right of
their card**, opening the same modal.
- **Pencil:** drawn in SVG at 45° (eraser `#fa4d56`, ferrule `#a8a8a8`, body `#f1c21b`, wood tip, graphite),
  24px at the 100% level, scaled by level like everything else. It sits at the far right of every person card; the
  marigold wings moved to just left of it. Names now **trim to fit** before the wings/pencil (full name on hover)
  instead of a fixed 16-character cut, which fixed "Ông Thiện/Xinh" running under the wings.
- **Editor wired into `mockups/sunburst-focus.html`:** pencil → modal with the locked v2 layout (person's First / Last /
  Alternative + Has passed; then "Add to X's family": Spouse / Brother / Sister / Son / Daughter, ordered list from the
  real tree, draggable new row with ↑/↓, new person's F/L/A + Has passed, ♂/♀ for a spouse). Esc / ✕ / Cancel /
  backdrop click closes it.
- **Save** writes into the page's data and re-renders the focus view. A gold **"⤓ Export changes (N)"** button
  appears in the header and downloads `family-tree-changes-YYYY-MM-DD.json` (change list + full data) for Hanh to send
  to Claude (locked save model, Entry 12).
- **Claude's calls (flagged):** for a spouse who married in, only Son/Daughter are enabled (their own family isn't in
  this tree). Brother/Sister are disabled for the root couple. Cards show First (+ " / Alternative"); Last name is kept
  in the data and the modal title, not on the card.
- **Verified end to end (scripted):** pencil on Hậu → modal; set last name "Nguyễn"; add son "Minh" and move him up
  to #2 → Save. Tree shows Hạnh | **Minh** | Huyền Nhi | Thảo; export downloaded with 2 changes (edit + add, position 2).
  Zero console errors. Previews `mockups/pencil-view.png`, `editor-filled.png`, `editor-saved.png`.
- **Hanh: pencil to 75% → 24 → 18px** (100% level). Built; it stays pinned at the far right and the wings follow it.
  Editor end-to-end test re-run clean. Preview `mockups/pencil-75-zoom.png`.
- **Hanh: add a Middle name field to both the person being edited and the new person.** Built: First · Middle ·
  Last · Alternative in one row (modal widened to 640px), saved as `middle` and included in the export. Tested:
  Hậu → middle "Văn", new son Minh → middle "Đức"; export carries both. Zero errors. Preview `mockups/editor-middle.png`.
- **Raised:** the modal title currently reads First Middle Last ("Hậu Văn Nguyễn"); Vietnamese order would be
  Last Middle First ("Nguyễn Văn Hậu").
- **Hanh: full names display in Vietnamese order — Last · Middle · First** ("Nguyễn Văn Hậu"). Built in the modal title;
  the input fields stay First / Middle / Last / Alternative. **LOCKED.** Preview `mockups/name-order-vn.png`.
- **Hanh: editor LOCKED** — pencil 18px at the far right of each card; modal with First / Middle / Last / Alternative +
  Has passed for the edited and new person; Vietnamese name order in the title; Save updates the tree; "Export changes"
  downloads the file for Claude to commit. Milestone 9 (editor) is design-locked in the mockup.

---

## Entry 18 (2026-10-23, cont.) — Going through the unlocked items one by one

Hanh asked which items weren't locked. Claude listed 17 (look/layout 1–5, spreadsheet import 6–14, setup 15–17), and
Hanh chose to go through them one at a time.
- **1a ♂/♀ colors — Hanh: C, Carbon blue / magenta. LOCKED:** ♂ `#78a9ff` (Carbon Blue 40), ♀ `#ee5396` (Carbon
  Magenta 50). Applied in the page (was teal `#6cc3cc` / pink `#e889b5`).
- **1b focus outline — Hanh: B, marigold `#F0BC4F`. LOCKED** (was salmon `#e0907f`). Claude noted it shares the wings'
  color; Hanh chose it anyway. `--accent` also drives "this card" in the modal list.
- **2 card size — Hanh: "Auto fit name. I'll have a toggle to display full name. Default is just the first name."**
  Built:
  - Card width is **measured from the displayed name** (+ icon, wings if passed, pencil, padding; minimum 170). In the
    side view every card in a generation column shares that column's widest width, so columns stay aligned and lines
    meet a straight edge. Nothing is trimmed any more (verified on Lành & Bảy: zero "…").
  - New header toggle **"Aa Full names"** (off by default). Off = first name. On = Vietnamese-order full name (Last Middle
    First / Alternative); cards re-fit and the focus view re-lays out. Verified: after editing Hậu (middle Văn, last
    Nguyễn), the toggle shows **"Nguyễn Văn Hậu"** and the card widens; off shows "Hậu".
  - **Flag (import question):** unedited spreadsheet names are shown exactly as typed, so ones like "Dịnh Khương /
    Branden" still show both parts in first-name mode until the "X / Y" pattern is settled in the import.
  - Previews `mockups/fit-lanh.png`, `fit-first.png`, `fit-full.png`.
- **Hanh: minimum card width 250** (card units, 100% level; was 170). Built and re-verified (no trimmed names, zero
  errors). Previews `mockups/min250-lanh.png`, `min250-first.png`, `min250-full.png`.
- **Item 2 LOCKED (Hanh):** auto-fit card width, minimum 250, each side-view generation column shares its widest card,
  "Aa Full names" toggle off by default (first name), on = Vietnamese-order full name.
- **Item 3 font — Hanh: Segoe UI; Hanh will upload the font files as a zip.** Claude raised that Segoe UI's license
  generally doesn't allow bundling it on a public site and offered Selawik (Microsoft's open-licensed Segoe UI
  stand-in). **Hanh's call: use her Segoe files anyway.** Waiting on the zip; will embed them as @font-face in the page.
- **Hanh: Segoe everywhere**, including the title (Georgia removed from the header and the sunburst center labels). Applied; the embedded font files are still pending Hanh's zip.

---

## Entry 20 (2026-10-23, cont.) — Segoe UI embedded; all generations shown below

**Fonts:** Hanh uploaded `fonts.zip`: `segoeui.ttf` (Regular), `segoeuib.ttf` (Bold), `seguibl.ttf` / `seguibli.ttf`
(Black / Black Italic). Embedded **Regular + Bold** as subset WOFF2 (Latin, Latin Extended, combining marks,
**Vietnamese U+1E00–1EFF**, punctuation, arrows, ₫): about 80 KB each, as `@font-face 'HFT Segoe'` first in every
stack. Card widths are measured after the font loads. Black / Black Italic aren't used yet, so they aren't embedded.
**Note:** Segoe UI has no ♂ / ♀ glyphs; those keep falling back to the system symbol font, as before. Verified:
`document.fonts.check('15px "HFT Segoe"')` is true; header renders in Segoe. Subset files are in `fonts/`.
License concern raised earlier (Entry 19); Hanh's call stands.

**Depth — Hanh: "show all generations; drop the size by 5% each generation beyond great-grandchildren."**
Built as **5 percentage points per generation**: great-great-grandchildren 25%, 3× great 20%, 4× great 15%, …, floor
5%, all 100% opacity, captions "Great-great-grandchildren", "3× great-grandchildren", …. Verified on Huong's Paternal
from the top couple (Lượng & Đào): all 6 generations render, with 5 level captions. Zero console errors.
Previews `mockups/deep-huong.png`, `mockups/font-segoe-hau.png`.
- **Hanh: lock both. LOCKED:** Segoe UI (Regular + Bold embedded, "Segoe everywhere"); all generations shown below the
  focus, each one past great-grandchildren 5 points smaller (25, 20, … floor 5%). Item 4a (direct line only on the left)
  was LOCKED earlier in this pass. Item 4c (minimum zoom 60% / 42% on phones) is still open.
- **4c start zoom — Hanh: keep the 60% minimum (42% on phones). LOCKED.** Item 4 complete.
- **5 phones — Hanh: later (Milestone 8 polish).** Deferred.
- **6 DATA sheet — Hanh: "that was my cheat sheet; we can ignore." LOCKED:** DATA is excluded from the import (its phone number with it).
- **7 shared people — Hanh: separate trees + jump links. LOCKED:** keep 4 sunbursts; a person who appears in more than one sheet gets an "Also in … →" link that jumps to the same person there. Which entries are the *same* person must be confirmed by Hanh, not matched by name alone.
- **Confirmed same people (Hanh: "Yes, all of them"):** Hậu & Thường (Paternal W236 = Maternal N165); Hạnh & Hương
  (Paternal AF241 = Maternal W170 = Huong's Paternal W233 = Huong's Maternal W95); Huyền Nhi & Brian (Paternal AF246 =
  Maternal W175); Hoạc & Thọ (Huong's Paternal N228 = Huong's Maternal N90); Hải & Bomp (Huong's Paternal W238 = Huong's
  Maternal W100). **Plus everyone listed under them** (Thảo, Sydney, Sophia; Adam, Noah). These get jump links; an edit to
  one copy must update every copy (the converter will give them one shared ID). Not built yet; goes into the real page.
- **Items 8–13 (Hường + Lục, Preggo, blank names, VIQR spellings, multi-wife children, notes) — Hanh: deferred to a full data audit against the current Excel sheet.** Item 14 (data format) is also still open.
- **Column labels — Hanh: change to Vietnamese generation names (nội/ngoại, cha/mẹ, con, cháu, chắt, chít…), all on one line along the top.** Inline preview requested.

---

## Entry 21 (2026-10-23, cont.) — Vietnamese generation names in one pinned line along the top

- Inline preview shown, then **Hanh picked the descendant terms: Con · Cháu · Chắt · Chút · Chít.**
- **Built:** the side view's per-column captions are replaced by a **label band pinned under the header** (one line,
  Carbon layer color). Each label sits over its generation column and follows horizontal scroll and zoom; it stays put on
  vertical scroll.
  - Above: **Cha mẹ**; grandparents **Ông bà nội** if the focused person's blood-relative parent is their father,
    **Ông bà ngoại** if their mother (derived from the parent box's first-listed person's ♂/♀).
  - The focused column shows the couple's first names in marigold.
  - Below: Con, Cháu, Chắt, Chút, Chít (then "Đời thứ N" if a tree ever goes deeper; none do today).
  - Label opacity follows the level (minimum 45%).
- Verified: Paternal / Hậu & Thường → Ông bà nội · Cha mẹ · Hậu & Thường · Con · Cháu; Huong's Paternal top couple →
  Lượng & Đào · Con · Cháu · Chắt · Chút · Chít; Maternal / Thường & Hậu → Cha mẹ · … (no grandparents in that sheet).
  The band stays pinned while scrolling. Zero console errors. Previews `mockups/band-*.png`.
- Note: deep columns get close together (Chút / Chít) because the cards shrink 5 points per generation.
- **Hanh: formal capitalization.** Band now reads **Ông Bà Nội / Ông Bà Ngoại · Cha Mẹ · (couple) · Con · Cháu · Chắt · Chút · Chít** (fallback "Đời Thứ N"). Preview `mockups/band-formal-hau.png`.
- **Generation band LOCKED (Hanh)** with formal capitals.
- **Hanh: band text 18px** (was 13px); band height 34 → 40px. Fixed size at every zoom. Previews `mockups/band-18-hau.png`, `band-18-deep.png`.
- Hanh asked what "family tree" is in Vietnamese. Claude listed gia phả / cây gia phả / phả hệ / cây gia đình.
  **Hanh: both languages, "Cây Gia Phả của Hạnh" large with "Hanh's Family Tree" small underneath. Built** (page
  `<title>` too). The "Mockup · sunburst → focus" eyebrow was removed. Preview `mockups/title-bilingual.png`.
- Still open: lock 18px band text, and how to handle crowding on deep trees (Chút / Chít).
- **Hanh: title → "Gia Phả Họ Tra^`n"**, read as VIQR for **"Gia Phả Họ Trần"** (the Trần family genealogy). Built (page `<title>` too); English line "Hanh's Family Tree" kept underneath. Preview `mockups/title-tran.png`.
- **Hanh: English line → "My Family Tree"** (first chose "The Trần Family Tree", then changed it before it was applied; confirmed the spelling). **LOCKED title: "Gia Phả Họ Trần" / "My Family Tree"**; page `<title>` "Gia Phả Họ Trần · My Family Tree". Project/skill name stays "Hanh's Family Tree".
- **Hanh: band text scales with the generation, same % as the cards:** 18px × level size (couple 18 · Con 13.5 · Cháu 9 · Chắt 5.4 · Chút 4.5 · Chít 3.6; Cha Mẹ 9 · Ông Bà 4.5). Labels are centered vertically in the 40px band. Built. Claude flagged that the deep and grandparent labels are too small to read; previews `mockups/band-hau-scaled.png`, `band-deep-scaled.png`.
- **Hanh: floor at 11px.** Band text = max(11px, 18px × level size). LOCKED band: 40px, Vietnamese labels, formal capitals, scaled with floor. Previews `mockups/band-hau-floor.png`, `band-deep-floor.png`.

---

## Entry 22 (2026-10-23) — Stop protocol (S002)

Session 2026-10-23 (S001 → S002) covered:
- Project setup (Entry 1).
- Spreadsheet intake and a prototype converter (Entry 2).
- The whole visual direction, built and locked step by step (Entries 3–21): sunburst splash with an animated
  morph into a sideways focus view; Carbon g100; 30px ♂/♀ in Carbon blue/magenta; marigold wings and focus outline;
  per-branch sunburst colors; color fade and timing; level-matched lines; spouses on separate stacked cards;
  generation spacing; all generations; auto-fit cards (min 250); Full-names toggle; Segoe UI; pinned Vietnamese
  generation band; title "Gia Phả Họ Trần / My Family Tree".
- The editor, designed and working in the mockup: pencil → modal (F/M/L/Alt, has passed, add relatives, ordering)
  → Save → Export file. Save model: export → Claude commits; the spreadsheet is retired after a one-time import.

Open: data audit (items 8–13), data format (14), create the repo (15), save the `hanh-family-tree` skill card (16),
phone layout (Milestone 8). Nothing pushed (no repo).
Files: `data/` (spreadsheet + derived JSON), `tools/` (converter, mockup builder, test scripts), `fonts/`,
`mockups/`. Docs mirrored to the Project. Snapshot zip: `S002_2026-10-23_FamilyTree.zip`.

---

## Entry 23 (2026-10-23) — Kinship titles from a chosen viewpoint (questions answered)

Hanh: "When I select a focal, such as Hạnh, I want the relationship name of his relatives in front of their names:
Ba Hậu, Má Thường, Bác Lành…" Questions asked one at a time; answers:
- **Q1:** the left side stays **direct line only**. Titles show on whoever is on screen, and stay as Hạnh would call
  them when you click back a generation (e.g. at Ông Thiện, Lành shows "Bác Lành").
- **Q2:** the viewpoint is set with a **"View as" button** on the cards; normal clicks still navigate.
- **Q3:** treat **sheet order as birth order (oldest first)** for now; may change in the audit.
- **Q4:** **Southern terms:** Ba/Má; Ông/Bà Nội, Ông/Bà Ngoại; Bác (parent's older sibling, spouse also Bác);
  father's younger brother Chú / wife Thím; father's younger sister Cô / husband Dượng; mother's younger brother Cậu /
  wife Mợ; mother's younger sister Dì / husband Dượng; Anh/Chị/Em; Vợ/Chồng; Con; Cháu (grandchildren, nieces and nephews).
- **Q5:** cousins are Anh/Chị or Em **by the parents' order**, not their own ages.
- **Q6:** **remove the Ông/Bà titles typed into names** and keep clean first names (e.g. "Ông Nội Thiện/Xinh").
- **Q7:** title-only or nickname names keep the nickname (Ông Cố → "Cố", Ông Hai → "Hai", Ông Ba → "Ba").
- **Q8:** also great-grandparents Ông Cố/Bà Cố (+ Nội/Ngoại), grandparents' siblings Ông/Bà, siblings' spouses Anh
  Rể/Chị Dâu/Em Rể/Em Dâu, children's spouses Con Rể/Con Dâu, great-grandchildren Chắt. **Anyone further out: no title.**
- **Q9:** viewpoint = **blood relatives only**. **Hanh: "View as" on a spouse uses the blood relative's viewpoint**
  (View as Hương → seen from Hạnh).
- **Built:**
  - An **eye ("View as") icon** on every card, between the wings and the pencil. It's gray by default and filled
    marigold on the viewpoint person. Clicking it sets the viewpoint; clicking it again clears it. On a spouse it sets
    their blood relative.
  - A header chip **"Seen from Hạnh ✕"** clears the viewpoint.
  - Each card shows the **kinship title in bold marigold in front of the name** (computed by `relTitle()`). The titles
    persist while you navigate.
  - Typed Ông/Bà titles are stripped from sheet names when displayed; the data itself isn't changed yet (that happens at
    import).
  - Card auto-fit now includes the title and the eye.
- **Verified (scripted, View as Hạnh):**
  - At Hậu & Thường: Ba Hậu · Má Thường · Hạnh (no title) · Vợ Hương · Em Huyền Nhi · Em Rể Brian · Cháu Sydney/Sophia ·
    Em Thảo · Ông Nội Thiện/Xinh · Bà Nội Hải · Ông Cố Nội Cố / Bà Cố Nội Cố.
  - At Thiện/Xinh & Hải: Bác Thái, Bác Bàng, Bác Hòa & Bác Thịnh, Bác Hợp & Bác Thủy, Bác Hiền & Bác Cháu, **Bác
    Lành** & Bác Bảy, Bác Trung (all older than Hậu, who is last). Cousins Anh/Chị by parents' order (Anh Đạt, Chị Ánh,
    Anh Phong…). Cousins' spouses and children have no title ("further out").
  - View as Hương → chip shows Hạnh. Zero console errors. Previews `mockups/kin-hau.png`, `kin-thien.png`.
- **Flags for Hanh:** "Ông Cố Nội Cố" reads oddly (the nickname "Cố" after the title Ông Cố). Unknown-name spouses show
  "Bác ??". A father with two wives would show "Má" for both. Labels on the generation band are still relative to the
  focused couple, not the viewpoint.
- **Hanh: great-grandparents show the title only: "Ông Cố Nội" / "Bà Cố Nội".** Rule built: a name that only repeats a word of its title is hidden. Verified.
- **Hanh: the generation band follows the viewpoint.** Built (`genNameV`): when a viewpoint is set, each column is named
  by its generation relative to that person:
  - −3 Ông Bà Cố Nội/Ngoại · −2 Ông Bà Nội/Ngoại.
  - −1 **Ba Má** if the column holds the viewpoint's parents, otherwise Bác Chú Cô (Nội side) / Bác Cậu Dì (Ngoại side).
  - 0 Anh Chị Em · +1 Con (own children) or Cháu · +2 Cháu · +3 Chắt · +4 Chút · +5 Chít.
  - No viewpoint → the Entry 21 band, relative to the focused couple.
  - The focus column stays marigold.
  - Verified from Hạnh: at Hậu & Thường "Ông Bà Cố Nội · Ông Bà Nội · Ba Má · Anh Chị Em · Cháu"; at Thiện/Xinh & Hải
    the same; at Lành & Bảy "… · Bác Chú Cô · Anh Chị Em · Cháu". Previews `mockups/bandv-*.png`.
  - Flag: cousins' children sit under a "Cháu" column but their cards have no title (Q8: further out = no title).
- **Hanh: LOCKED the viewpoint feature, and cousins' children are titled "Cháu".** Built; verified from Hạnh at
  Thiện/Xinh & Hải (e.g. Cháu Minh Ý, Cháu Thiên Ý/Na).
- Snapshot after this feature: `S003_2026-10-23_FamilyTree.zip` (docs mirrored).

---

## Entry 24 (2026-10-23) — Spouse titles for every blood relative, same generation and below

Hanh: "As seen from Hạnh, the spouses of my blood relatives get their corresponding title. Extend this to my cousins,
down to my nieces and nephews, great-, etc."
- **Built (general rule in `relTitle`):** for any line (own, siblings, cousins, second cousins…):
  - **Same generation:** Anh/Chị (older branch) or Em (younger branch), decided by the order at the shared box. Their
    spouses are **Anh Rể / Chị Dâu / Em Rể / Em Dâu**.
  - **Below:** own children Con, everyone else's +1 Cháu; +2 Cháu; +3 Chắt; +4 Chút; +5 Chít. Their spouses get the same
    word + **Rể** (husband) / **Dâu** (wife): Con Rể/Dâu, Cháu Rể/Dâu, Chắt Rể/Dâu…
  - Generations above are unchanged.
- **Verified from Hạnh** at Thiện/Xinh & Hải: Anh Rể Hòa, Anh Rể Cường, Anh Rể Doanh, Chị Dâu Tiffany, Chị Dâu Thảo,
  Chị Dâu Trinh, Chị Dâu Luật… and every cousin's child Cháu. Zero console errors. Preview `mockups/kin-spouses-thien.png`.
- **Hanh: LOCKED** (extended spouse titles).

---

## Entry 25 (2026-10-23) — Titles for parents' and grandparents' cousins

Hanh (screenshot: Huong's Paternal, seen from Uyên, focused on Hoạc & Thọ): "why doesn't the title show for the Bác Cậu
Dì here?" **Cause:** Hương / Hạnh / Hải / Bomp are Uyên's *parent's cousins* (Hoạc is her grandfather Hinh's brother).
Entry 23 only covered parents' own siblings.
- **Built (general rule, by generation relative to the viewpoint):**
  - **One up (parents' siblings and cousins):** Bác if their branch is older at the shared box, otherwise Chú/Cô (Nội)
    or Cậu/Dì (Ngoại); spouses Bác / Thím, Dượng / Mợ, Dượng.
  - **Two up (grandparents' siblings and cousins):** Ông/Bà.
  - **Three up:** Ông Cố / Bà Cố.
- **Verified from Uyên** at Hoạc & Thọ: Ông Hoạc · Bà Thọ · **Dì Hương · Dượng Hạnh · Cậu Hải · Mợ Bomp** · Em Adam ·
  Em Noah · Ông Cố Ngoại Lượng · Bà Cố Ngoại Đào. From Hạnh on Maternal at Vinh & Ngâu: Bác Hứa, Bác Hường, Bác Đường,
  Cậu Thượng, Dì Thương, Dượng Tính… Zero errors. Previews `mockups/kin-uyen.png`, `kin-maternal.png`.
- **Found while testing:** switching sheets clears the viewpoint, because the same person is a separate entry per
  sheet until the shared-ID import (Entry 20) links them.
- Hanh asked to see how titles differ between the sides; Claude posted a Nội vs Ngoại table. **Hanh's family rule: on
  the mother's side there is no Bác — Má's sisters are Dì (husbands Dượng) and Má's brothers are Cậu (wives Mợ), at
  any age.** The father's side keeps Bác (older) / Chú–Thím, Cô–Dượng (younger). Built; the band's mother-side label is
  now "Cậu Dì". Verified from Hạnh on Maternal: Dì Hứa, Dượng Hướng, Dì Hường, Dượng Lục, Cậu Đường, Mợ Nho / Thu Hằng,
  Cậu Thượng, Dì Thương, Dượng Tính. Preview `mockups/kin-maternal-ngoai.png`.
- **Hanh: titles LOCKED** (Entries 23–25).

---

## Entry 26 (2026-10-23) — Shared people linked across sheets; viewpoint carries over

Hanh: keep the viewpoint when switching trees.
- **Built:** the confirmed shared people (Entry 20) are now linked in the page: anchor boxes Hậu & Thường (Paternal W236
  = Maternal N165), Hạnh & Hương (4 sheets), Hoạc & Thọ (Huong's two sheets), plus everyone under them, matched box by
  box by the blood relative's name. Each person gets one shared id (`pid`) → **15 people, each linked across 2 or 4
  sheets.**
- **Viewpoint across trees:** switching sheets re-finds the same person. If they are married-in on the new sheet, the
  Entry 23 rule applies (their blood spouse's view). So: Seen from Hạnh → Maternal: Hạnh → Huong's Paternal: **Hương**
  (Hạnh married in there) → back to Paternal: Hạnh.
- **Edits sync across copies:** the pencil editor's name / passed changes update every copy of that person (tested: Hậu's
  last name on Paternal W236 and Maternal N167).
- Zero console errors. Test script `tools/tests/cross_test.js`. The "Also in … →" jump links themselves are not built yet.
- **Hanh: yes, Hương's view on Huong's trees. LOCKED** (viewpoint carry-over and shared-person linking).

---

## Entry 27 (2026-10-23) — Titles decided at the split point; grandparents' generation gets Ông/Bà + uncle words

Hanh (screenshot: Huong's Paternal, seen from Chương, child of Trinh & Mikey): Chương calls Hạnh / Hương **Ông Chú /
Bà Cô**. "This tree is my wife's focus, so how Chương calls anyone is based on the relationship off his
great-grandparents." Questions asked one at a time:
- **Q1:** Hải & Bomp → **Ông Chú Hải / Bà Thím Bomp.**
- **Q2:** Cô's husband is **Chú everywhere** (replaces Dượng on the father's side; the mother's side keeps Dì / Dượng).
- **Q3:** the side comes from **the viewpoint's own ancestor at the split** (the child of the shared couple on the
  viewpoint's line): a man → father's-side words (Bác if the other branch is older, else Chú/Thím, Cô/Chú); a woman →
  mother's-side words at any age (Cậu/Mợ, Dì/Dượng). This keeps Hạnh's existing titles.
- **Built:** the same rule for the parents' and grandparents' generations (siblings and cousins). The grandparents'
  generation gets **Ông/Bà + the word** (Ông Chú, Bà Cô, Bà Thím, Ông Bác, Ông Cậu, Bà Dì…). The great-grandparents'
  generation keeps Ông Cố / Bà Cố.
- **Verified:**
  - From Chương at Hoạc & Thọ: Ông Cố Hoạc · Bà Cố Thọ · **Bà Cô Hương · Ông Chú Hạnh · Ông Chú Hải · Bà Thím Bomp** ·
    Chú Adam · Chú Noah.
  - Regressions from Hạnh are unchanged: Paternal all Bác (Lành etc.); Maternal Dì / Dượng / Cậu / Mợ.
  - Zero errors. Preview `mockups/kin-chuong.png`.
- **Hanh: LOCKED** (split-point rule, Ông/Bà + uncle words, Cô's husband = Chú).

---

## Entry 28 (2026-10-23) — Data audit begins: spell check

Hanh: "Let's do spell checks first. Any instance like Ca't Linh should change to the proper spelling Cát Linh."
- **Scanned all four tree sheets** for typed-out accents (' ` . ? ~ ^ * and "dd"). Only three found.
  **Hanh approved all three:**
  - Paternal N260 "Bà Li.ch" → **Bà Lịch**
  - Paternal W269 "Ky`" → **Kỳ**
  - Paternal AP325 "Rockii / Ca't Linh" → **Rockii / Cát Linh**
- **How it's applied:** the new `data/corrections.json` (key `Sheet!NameCell`, with `from` / `to` / entry) is applied by
  `tools/parse_tree.py` at import. Each fix must match the sheet text exactly, and the count must match (asserted).
  The spreadsheet itself is untouched. Regenerated `data/tree.derived.json` and rebuilt the mockup (zero errors).
- **Second pass, Hanh approved each (one question at a time):**
  - Paternal AF479 "Trầm (sp??)" → **Trầm** (Hoa & Hải's son; shown to Hanh in the sunburst, `mockups/find-tram.png`)
  - Paternal AF416 "Tuan" → **Tuấn** (Tiên's husband)
  - Maternal W87 "Hung" → **Hùng** (Kim Cúc's husband)
  - Huong's Maternal W23 "Hoang" → **Hoàng**
  - Paternal N264 "Bà Tường / Thuong" → **Bà Thương / Tường** (Hanh: Thương is the primary name, Tường the alternative;
    first answered "Thường", then corrected to "Thương")
  - corrections.json now holds 8 fixes; converter reports "corrections applied: 8"; old spellings gone from the data.
- **Left as is:** "Rev. Thanh" (Huong's Paternal W222, a title).

## Entry 29 (2026-10-23) — Data audit: Hường + Lục

- Maternal L80 Hường / L82 Lục: **Hanh confirmed they are a couple** (Dì Hường, Dượng Lục from Hạnh's view).
  Their children are missing from the sheet. **Hanh will add them later with the editor** (pencil → Son/Daughter →
  Export changes file → Claude commits). No data change now; no note shown on their card.
- **"Preggo" (Paternal AP460, under Tú & Michael):** Tú & Michael are still expecting. Hanh: the placeholder child
  card reads **"TBD"** (corrections.json, 9 fixes now). It has no ♂/♀ yet (shows "·"). Preview `mockups/preggo-tbd.png`. **Locked.**
- **Editor: ♂/♀ for the person being edited (locked).** The pencil modal now has ♂/♀ chips next to "Has passed"
  for the card's own person, so a newborn (or a wrong symbol) can be fixed in the page. The modal header symbol
  updates live; Save writes `gender` to every copy of that person and to the export file's edit record.
  Selected chip = outlined in its own colour (♂ blue / ♀ magenta) on #393939; the spouse ♂/♀ chips got the same look.
  Tested TBD → Lily ♀ (test only, not saved). Previews `mockups/gender-edit-zoom.png`, `gender-edit-saved.png`.
- **Two blank-name ♀ with wings (Maternal N206, N209, last two children of Ông Vinh & Bà Ngâu):** Hanh: show
  **"TBD"** (corrections.json now accepts a blank `from`; 11 fixes). Wings kept. Preview `mockups/tbd-women.png`. **Locked.**
- Audit items left: see Entry 30.

## Entry 30 (2026-10-23) — Data audit: Ông Hai's family (two wives), restructured

Hanh (shown the box in the sunburst, `mockups/find-hai.png`): "Ông Hai is my grandpa. He married Lịch and had
Hiền/Lành/Trung/Hậu. Lịch passed and he married Thương (Tường) and had Tường, Văn, Chương, Dương, Hùng, Thanh."
Then: "Ông Thiện is Ông Hai's older brother." "Tường is Bà Thương's daughter from her first marriage."
- **The sheet had Hiền, Lành, Trung, Hậu under Ông Thiện/Xinh & Bà Hải. That was wrong.** They are Ông Hai & Bà Lịch's
  children. Thái, Bàng, Hòa, Hợp stay with Ông Thiện & Bà Hải (Hanh confirmed).
- **Ông Hai is the blood relative** (Ông Cố & Bà Cố's son); Bà Lịch = 1st wife, Bà Thương / Tường = 2nd wife.
- **Mothers:** Lịch → Hiền, Lành, Trung, Hậu. Thương → Tường, Văn, Chương, Dương, Hùng, Thanh.
- **Tường** is Bà Thương's daughter from her first marriage (Ông Hai's stepdaughter). Hanh: **show as normal** (no
  mark); recorded in the data only (`step` note). Hạnh calls her **Cô Tường** (husband **Chú Kỳ**) — confirmed.
- **Bà Thương / Tường** is **Bà Nội** from Hạnh's view, same as Bà Lịch — confirmed.
- **How it's applied:** new `data/structure.json`, applied by `tools/parse_tree.py` after the spelling fixes. Ops:
  `blood_first`, `move_children`, `mothers`, `stepchild`; boxes and children are named by the sheet cell of their
  first-listed name; every reference is asserted. The spreadsheet itself is untouched. ("structure fixes applied: 4")
- **Layout (locked, Hanh picked "Husband in the middle"):** a man with two wives is drawn 1st wife / husband / 2nd
  wife, stacked. Each wife's children's line leaves from between her card and the husband's. Data order stays blood
  relative first; the drawing maps it with `SLOT`. The band's focus label uses main names only ("Hai & Lịch &
  Thương") so it doesn't run into "Cha Mẹ".
- **Verified:** from Hạnh: Ông Nội Hai, Bà Nội Lịch, Bà Nội Thương / Tường, Bác Lành, Bác Trung, Ba Hậu, Cô Tường,
  Chú Kỳ; at Ông Thiện: Ông Bác Thiện/Xinh, Bà Bác Hải, Bác Thái, Bác Hòa, cousins Anh/Chị by branch. Regression tests
  kin/cross/edit pass with zero errors. Previews `mockups/hai-two-wives.png`, `hai-two-wives-hanh.png`.
- **Research notes (14 on the Paternal sheet: "Any kids?", "2 kids?", "Let's find about kids"…):** Hanh: **show them on
  the cards** on the public page. Look locked as is: marigold italics under the bottom card of the box
  (`mockups/notes-now.png`, Liên & Giáo "4 kids?").
- **Birth order (locked):** Hanh: siblings are listed **oldest first** on all four sheets. No longer provisional.
- **Data format (item 14, locked):** Hanh chose a **separate data file**: `index.html` + `data/tree.json`. The page
  loads tree.json, so it must be opened from the web (GitHub Pages), not by double-clicking it on disk. An
  "Export changes" file from Hanh replaces tree.json after Claude reviews it.
- **Data audit complete** (Entries 28–30). Milestone 1 done. Next: build the real `index.html` + `data/tree.json`
  from the locked mockup (Milestones 2/4–6), then deploy once the repo exists.

## Entry 31 (2026-10-23) — Push requested; repo setup

- Hanh: "push to github and give me the link to work on this on my other computer."
- `hellohanh/FamilyTree` doesn't exist yet, and this session can't create repos. **Hanh creates it** (public, empty).
- **Hanh: leave the original spreadsheet out of the public repo** (its DATA sheet has a phone number). `.gitignore`
  excludes `data/Family Tree.xlsx` / `*.xlsx`; it lives only in the snapshot zips. Scanned the committed files: no
  phone numbers. The derived data, corrections and structure fixes are enough to rebuild the page.
- Hanh created the repo; **pushed to `main`** (https://github.com/hellohanh/FamilyTree). Hanh will continue from another
  computer using the README resume prompt. GitHub Pages isn't turned on yet (no `index.html` yet).

## Entry 32 (2026-10-23) — Intro splash: red maple tree

- Hanh: "Use this as my index page, 3 seconds and fade to my paternal sunburst." The first picture had a red glow
  baked in; Hanh: "do not have the glow on the splash page pic", then sent two cut-out versions
  (`Family Tree.png`, `Family Tree v2.png`): **"randomize between these two pics as the splash page."**
- **Locked:** on load, one of the two trees (random each visit) shows centred on the site charcoal **#161616**
  (Hanh's pick over grey #555656), sized min(88vw, 88vh). **Hold 3 s, fade 1 s** (Hanh: "1 s, lock it") to the
  Paternal sunburst (the first sheet). Click or any key skips. Reduced motion → no fade. Test hooks:
  `?nointro`, `?pic=1|2`, `?hold=`, `?fade=`.
- Files: `assets/splash1.webp`, `assets/splash2.webp` (embedded as data URIs; WebP with transparency) and the
  originals `assets/splash*-original.png`. Previews `mockups/intro-sequence.png`, `mockups/splash-pair.png`.
- **Fade changed to 0.5 s** (Hanh: "change the duration for 1s to .5sec"). Splash = hold 3 s + fade 0.5 s.

## Entry 33 (2026-10-23) — The live page: index.html + data/tree.json

- Hanh: "do we have everything needed to have this as a live website?" → "Yes, build it now".
- **`index.html`** (repo root) is built by `tools/build_index.py` from `mockups/sunburst-focus.template.html`: the same
  locked page, but the tree data is **not** embedded. It loads **`data/tree.json`** (locked format, Entry 30). d3,
  flubber, fonts, wings and both splash trees stay embedded, so `index.html` + `data/tree.json` are the whole site.
  The splash starts at once; the tree builds when tree.json arrives.
- `data/tree.json` = the audited data (copy of the converter output, corrections + structure applied). From now on
  it is the source of truth; Hanh's "Export changes" file updates it.
- Opened from disk (file://), the page shows a plain message that it must be opened from the website.
- `.nojekyll` added so GitHub Pages serves the files as they are.
- Tested on a local web server: splash → sunburst → focus, zero page errors (one harmless 404 for a missing favicon).
  Previews `mockups/live-splash.png`, `mockups/live-focus.png`.
- To go live: push, then turn on GitHub Pages (main, root) → https://hellohanh.github.io/FamilyTree/

## Entry 34 (2026-10-23) — Commit identity changed; pushed; Pages on

- Hanh: "change to made by you to: hello.hanh@outlook.com. Push". Commits are now made as
  **`Hanh <hello.hanh@outlook.com>`** (SKILL/README updated). The three unpushed commits (splash, fade, live page)
  were re-authored to it; the two already on GitHub were left alone (no history rewrite).
- Pushed to `main` (0242cb9). This session can't turn on GitHub Pages (blocked), so **Hanh turns it on**:
  Settings → Pages → Deploy from a branch → `main` / `(root)`. Site: https://hellohanh.github.io/FamilyTree/

## Entry 35 (2026-10-23) — Sunburst: drag to rotate

- Hanh: "enable the user to rotate the sunburst around the center focal point" → **"Drag around the center"** (no buttons).
- **Locked:** in the sunburst, press on any slice and drag in a circle to turn the wheel around its centre. A click
  without dragging (under 4 px) still opens that couple. Dragging the empty background still pans. Labels stay
  upright as the wheel turns. The angle is kept when you go into a focus view and back, across sheet changes and
  after edits. Cursor: grab / grabbing. Hint line now ends "· drag the wheel to turn it".
- How: the angle `ROT` is added to every arc's start/end angle and the arcs are redrawn, so the morph into the focus
  view starts from the turned wheel. Test `tools/tests/rotate.js`: quarter turn → ROT = π/2, click → focus, Esc →
  same angle, zero errors. Preview `mockups/rotate.png`. index.html rebuilt.

## Entry 36 (2026-10-23) — Phones: pinch-zoom on the sunburst

- Hanh: "On mobile devices, I want pinch and zoom to work on the sunburst. Currently pinch to zoom only works outside
  of the sunburst." Cause: the rotate gesture (Entry 35) claimed the first finger on the wheel, so the zoom never saw
  a two-finger pinch.
- **Fix:** mouse rotation still uses d3.drag. Touch rotation is now its own one-finger handler that doesn't block
  events. When a second finger lands anywhere, the turn stops and d3.zoom takes both fingers as a pinch. A one-finger
  drag of 6 px+ turns the wheel (and the tap that follows is ignored); a plain tap still opens the couple.
- Verified on an emulated phone (390×844, touch): pinch on the wheel zoomed 0.28 → 0.85 with no rotation; one finger
  rotated; tap → focus; desktop mouse rotate test still passes; zero errors. Preview `mockups/pinch.png`.

## Entry 37 (2026-10-23) — Southern chart rules; O for Dad's younger sister; Miền Trung toggle

- Hanh shared a "Vietnam Family Tree — Southern edition" chart: "use this to set rules on how to address relatives.
  This supersedes current established rules." Compared rule by rule: everything already matched (Bác for Dad's older
  siblings; Chú/Thím; Cậu/Mợ and Dì/Dượng on Mom's side regardless of age; Ông/Bà Nội/Ngoại; Ba/Má; Anh/Chị/Em)
  **except Cô's husband**: chart = **Dượng**. Hanh: "Yes, Dượng". **Replaces Entry 25's "Chú everywhere"**:
  Chú Kỳ → Dượng Kỳ; from Chương: Ông Chú Hạnh → Ông Dượng Hạnh.
- Hanh: "For the younger sister on my dad side I call her O." (O = Central Vietnamese word for Cô.) Hanh picked O,
  then: **"Have a toggle for central and non central. Default for this site is central on."**
- **Locked:** header toggle **"Miền Trung"**, ON by default. On → Dad's younger sister = **O** (Bà O a generation up;
  band "Bác Chú O"). Off → **Cô**. Her husband is **Dượng** either way. Only Cô ↔ O switches; every other term stays
  Southern (Hanh: lock as is, no Mạ/Ôn/Mệ).
- Verified from Hạnh at Ông Hai: O Tường, Dượng Kỳ, O Văn, Dượng Trung, O Chương, O Dương, O Thanh, Dượng Thái;
  Chú Hùng & Thím Kim Ánh unchanged; from Chương: Bà O Hương, Ông Dượng Hạnh, Ông Chú Hải, Bà Thím Bomp; off → Cô.
  Previews `mockups/o-duong.png`, `mockups/central-toggle.png`. index.html rebuilt.

## Entry 38 (2026-10-23) — Phones: ☰ menu for all options

- Hanh: "For mobile devices have all the options in a hamburger to choose from."
- **Locked:** at 820 px wide or less the header shows only the title and a ☰ button (44 px). Tapping it opens a
  panel under the header with every option as a full-width row: tree picker, Whole family, Seen from ✕, Full
  names, Miền Trung, Export changes (whichever apply in the current view). ☰ becomes ✕ while open. Picking an
  option, tapping outside, or Esc closes it. The "Focused on…" text is hidden on phones. Desktop unchanged.
- Verified on an emulated 390×844 phone, in the sunburst and in a focus view; zero errors. Preview
  `mockups/mobile-menu.png`. index.html rebuilt.
- Noted for Milestone 8 (phone layout): generation-band labels can overlap on narrow screens.

## Entry 39 (2026-10-23) — Uncle/aunt side follows the viewer's own blood parent (replaces the split-point rule)

- Hanh: "Change the rule that focused on the grandparent level. It is how the person is related via the blood family
  relative. Show me the results for my niece Sydney with my cousin Sơn and Thủy."
- **New rule (locked, "New rule everywhere"):** for the parents' generation, the side comes from the viewer's OWN blood
  parent (father → Bác / Chú·Thím / O·Dượng; mother → Cậu·Mợ / Dì·Dượng, any age). For the grandparents' generation it
  is Ông/Bà + what that parent calls them (side = the parent's own blood parent). Older/younger (Bác vs Chú/O) still
  comes from the branch order where the families split. **Replaces Entry 27's split-point side rule.**
- Sydney (via her mom Huyền Nhi): Paternal Sơn **Cậu Sơn** (was Chú), Sương **Mợ** (was Thím), Thủy **Dì Thủy** (was O);
  Maternal Sơn/Thủy unchanged (Cậu/Dì); Bà O Văn, Ông Dượng Trung unchanged.
- Chương (via his mom Trinh, whose blood parent is her mom Vinh) — Hanh accepted the change: **Bà Dì Hương** (was
  Bà Cô/O), Ông Dượng Hạnh, **Ông Cậu Hải** (was Ông Chú), **Bà Mợ Bomp** (was Bà Thím), **Cậu Adam / Cậu Noah** (was Chú).
- Hạnh's own titles unchanged (verified: Ông Hai view still Bác Lành, Ba Hậu, O Tường, Dượng Kỳ…). index.html rebuilt.

## Entry 40 (2026-10-24) — Sunburst: snap to the left edge + generation arrows

- Hanh: "an option to snap the sunburst to the left edge so that we can scroll the wheel to the right family members.
  Give me an icon to snap, and then arrows left and right to move from generation to generation… snap to show the
  generation chosen. Show me … for an iPhone 18 screen." Previewed at 402×874 pt (current 6.3" iPhone size; iPhone 18
  size assumed the same).
- **Locked:** a round snap button (bottom-right, 52 px; icon = edge line + half rings) on the sunburst. Tap → the
  wheel's centre moves to the left edge and the chosen generation's ring sits mid-screen as a tall band (scale
  min(1.6, 0.42 × width / ring); animated 0.5 s). A pill bottom-left (phones) / bottom-centre (wider) shows ‹ name ›,
  e.g. "Con · Generation 2 of 5" (names counted down from the root couple: Con, Cháu, Chắt, Chút, Chít); arrows step
  one ring in/out and re-snap. Turning the wheel (drag / one finger) scrolls that generation's people past.
  Button turns marigold while snapped; tap again → the whole wheel. Snap state survives a focus view and back,
  sheet changes and resizes. Hidden in focus views. The hint line stays clear of the button.
- Verified on an emulated iPhone (402×874, touch): snap, › twice, one-finger swipe turns the wheel; zero errors.
  Preview `mockups/snap-iphone.png`. index.html rebuilt.

## Entry 41 (2026-10-24) — Back button: step back through views; 3 presses to leave from the sunburst

- Hanh: "when I click on the back button on the mobile it drops me out of the site. Can we make it that they have to
  press back three times…" → then: "when people are pressing the back button they want to go back to a previous view
  in the site. So from the top down back to the sunburst." → on the sunburst: **"3 presses to leave"**.
- **Locked:** every couple you open, and "Whole family" / Esc, is a step in the browser history. Back walks back
  through them (couple → previous couple → … → the sunburst), switching sheets if needed; Forward works too. On the
  sunburst, Back shows a toast "Press Back 2 more times to leave", then "Press Back once more to leave", then leaves.
  A pause over 3 s re-arms the count. (Guards are added after the first tap, since browsers skip history entries
  added before the visitor interacts.)
- Verified: Sunburst → Hai → Hậu; Back → Hai, Back → sunburst, Back ×2 toasts, Back → leaves; zero errors; live
  index.html still loads. Preview `mockups/back-toast.png`.

## Entry 42 (2026-10-24) — Band: two-line focus label when it's too wide

- Hanh: "if the label in the generation band is too wide, have the name of the blood relative on the first line then
  the spouse on the second line."
- **Locked:** the focus couple's label (no viewpoint) is checked against its neighbours every time the view moves.
  If it would overlap, it becomes two lines: blood relative on line 1, spouse(s) joined with "&" on line 2 at 78%
  size. Otherwise one line as before. Viewpoint labels (Ông Bà Nội…) are unchanged.
- Verified: desktop Hai & Lịch & Thương = one line; phone 402 px = "Hai" / "Lịch & Thương"; phone Hậu & Thường = one
  line; zero errors. Preview `mockups/band-two-lines.png`. index.html rebuilt.

## Entry 43 (2026-10-24) — Eye ("View as"): centre on the person with every generation before them

- Hanh: "when clicking on the eye on person badge, I want all the generations before them to show on the correct
  generation column." Then (seeing Sydney's preview): "show her parent's siblings and her grandparents' siblings. Add a
  plus sign to toggle the children of those older generations."
- **Locked:** tapping a person's eye sets the viewpoint AND centres the page on them. When the focus is the person you
  view as, the layout runs from the top of the tree: every ancestor in its own column, each ancestor's brothers and
  sisters beside them (with spouses), and the person's own descendants. Older relatives off the direct line who have
  children get a marigold **＋** (constant size on screen) that shows their children; it turns into **−** to hide them
  (works at any depth). In this view the older columns are drawn larger: parents 60%, grandparents 50%, older 45%,
  85% opacity. The normal focus view is unchanged (direct line, parents 50% / grandparents 25%).
- **Great-great-grandparents = Ông Kỵ / Bà Kỵ** (+ Nội/Ngoại), band "Ông Bà Kỵ …" (Hanh's pick over Ông Sơ).
- Verified with Sydney (from Huyền Nhi & Brian → eye): band Ông Bà Kỵ Ngoại · Ông Bà Cố Ngoại · Ông Bà Ngoại · Ba Má
  · Anh Chị Em; Ông Bác Lành ＋ → Cậu Phong, Dì Thu, Cậu Tiên, Cậu Phú; regression tests (kin, edit, back, snap) pass;
  zero errors. Previews `mockups/eye-ancestors.png`, `mockups/eye-siblings.png`. index.html rebuilt.
- Note: the root couple's sheet name is just "Cố", so their cards read "Ông Kỵ Ngoại Cố".

## Entry 44 (2026-10-24) — Sunburst: one panel per person, titles, and an eye on every panel

- Hanh: "I want to show how to address the relatives on the sunburst too. Add an eye icon to each panel name. Keep the
  sunburst but have spouses on a different part of the pie." Previewed A (side by side) vs B (outer band) → **A**.
- **Locked:** every couple's slice is split side by side into one panel per person (spouse panels a shade darker; a man
  with two wives reads 1st wife | husband | 2nd wife, as in Entry 30). Each panel shows the name, and when a viewpoint
  is set, the viewpoint's title for that person in marigold (e.g. Bác Lành, Ba Hậu, O Tường, Dượng Kỳ). A small eye
  sits at the inner end of each label: tap → the whole wheel is seen from that person (stays on the wheel; the
  "Seen from" chip updates); tap the filled marigold eye again to clear. The centre shows titles too (Ông Cố Nội…).
  Labels redraw when you come back from a focus view.
- Verified from Hạnh (`mockups/sunburst-spouses-a.png`, `-whole.png`); eye on Huyền Nhi switches the view; regression
  tests (kin, rotate, snap, back, eye) pass; zero errors. index.html rebuilt.

## Entry 45 (2026-10-24) — Sunburst panels: eye at the outer edge, names at the inner edge, readable colours

- Hanh, in steps: "have the eye icon at the outer edge of their panel. Analyze the generation color and adapt the font
  color for readability." → "have the name … at the inner edge of their panel with a 10px margin" → "keep the yellow
  title; if it goes on a color that is hard to see, then add a drop shadow" → "keep the spouse the same color font as
  the blood relative, add 5px to the right of the eye icon. Make the eye icon yellow." → **Lock it**.
- **Locked:** in each person's panel the name starts 10 px from the inner edge (on the flipped left half it ends 10 px
  from the inner edge). Name colour = white or near-black, whichever has more contrast (WCAG) on the blood
  relative's panel colour; spouses use that same colour. Titles always marigold #f0bc4f, bold; where marigold falls
  under 4.5:1 contrast on the panel it gets a soft dark drop shadow. The eye is always marigold (filled when it's the
  current viewpoint), 5 px in from the outer edge, with the same shadow rule.
- Preview `mockups/sunburst-panels-final.png`. Regression tests pass. index.html rebuilt.

## Entry 46 (2026-10-24) — Data fix: Tiên is Lành & Bảy's daughter, Luật her husband

- Hanh: "under Lành and Bảy, Tiên is their daughter and Luật is Tiên's husband." The sheet had the ♂/♀ swapped
  (Tiên ♂, Luật ♀ → shown as Anh Tiên / Chị Dâu Luật).
- New structure op `gender` (asserts the old value): Paternal AF216 Tiên → ♀, AF218 Luật → ♂. Tiên stays the blood
  relative. From Hạnh: **Chị Tiên, Anh Rể Luật**; their daughters Cháu Thy Ân / Katelyn, Cháu Thy Bình / Lauren…
- data/tree.json regenerated (no Export-changes edits had been applied yet, so regenerating is safe).
  Preview `mockups/tien-luat.png`. index.html rebuilt.

## Entry 47 (2026-10-24) — Sunburst: palette, title chips, tap a name to change the view, wheel sized to fit

- Hanh: "give me … a few different color palettes for the sunburst along with the text. I want to remove the eye icon
  from the sunburst … clicking on the person's name will trigger this functionality." Previewed A Current, B Lacquer,
  C Jewel, D Earth, E Dusk (`mockups/palettes-whole.png`, `palettes-zoom.png`).
- Hanh's picks, in steps: **A, 30% lighter**; text **+1 pt** (11 px); title in a chip — first dark cherry/white, then
  **dark mustard #c4961a with black text**; **all chips at the inner edge** (labels are no longer flipped on the left
  half — they read upside down there until the wheel is turned); **wheel enlarged so the thinnest one-person panel
  holds a chip with 2 px above and below**.
- **Locked:** no eye icons on the wheel. Tapping a person's name or chip views the whole wheel from them (chip gets a
  black outline, name underlined); tap again to clear. Tapping elsewhere on a slice still opens the couple; dragging a
  label turns the wheel like the slice (labels ride along while turning and are redrawn upright-to-the-edge after).
  Names in white/black by contrast on the blood relative's colour (Entry 45). Ring thickness is computed per sheet:
  110 × max(1, 21 ÷ thinnest panel) → Paternal ×2.2, the other sheets unchanged. Text is 11 px everywhere; centre text
  scales with the wheel. Snap (Entry 40) still zooms to readable chips. The focus-view cards keep marigold titles.
- Verified: thinnest panel Chị Hân / Anh Rể Khang fits (`mockups/sunburst-thinnest.png`); name tap sets the view;
  regression tests (kin, rotate, back, eye, pinch, snap) pass. index.html rebuilt.

## Entry 48 (2026-10-24) — Sunburst text 17 px

- Hanh: "give me an inline preview of the sunburst with different font size." Previewed 11 / 13 / 15 / 17 px
  (`mockups/sunburst-fontsizes.png`). With the Entry 47 rule (thinnest panel must fit a chip + 2 px), the wheel grows
  with the text: Paternal ×2.2 / 2.5 / 2.8 / 3.0. Hanh: **17 px**.
- **Locked:** sunburst labels and chips 17 px (chip 23 px tall); the wheel is sized from that (Paternal ×3.0). Snap
  still zooms to readable chips. Preview `mockups/sunburst-thinnest-17.png`. index.html rebuilt.

## Entry 49 (2026-10-24) — Sunburst names: single tap opens the couple, double tap changes the view

- Hanh: "pressing to click once triggers the side to side view. To trigger the focal, make it a double click on the
  name. Ensure this action works on mobile."
- **Locked:** on the wheel, ONE tap/click on a person's name or chip opens their couple in the side view (same as the
  rest of the slice, after a 350 ms wait to rule out a second tap). A DOUBLE tap/click on the name views the whole
  wheel from that person (double again to clear). Taps are counted by the page itself, so phones behave the same; the
  browser's own double-tap zoom doesn't fire there. Each label has an invisible tap area covering chip + name (rotated
  text alone was too easy to miss).
- Verified on an emulated iPhone (402×874, touch): double tap on Huyền Nhi → stays on the wheel, Seen from Huyền Nhi;
  single tap → opens Huyền Nhi & Brian. Rotate, pinch, Back, snap tests pass. index.html rebuilt.

## Entry 50 (2026-10-24) — Sunburst text really 17 px (bug fix); sizing measured at the chip

- Hanh (screenshot): "the font is too small to read… what can make this more readable."
- **Root cause (bug):** a leftover CSS rule `.arclabel{font-size:9.5px}` overrode every label's size, so the wheel text
  was 9.5 px all along (Entries 47–48's 11/17 px never applied). Removed; labels now get their own size.
- Previewed three ways (`mockups/label-readability.png`): Now 17 px fixed / A text grows to fill big panels / B 15 px on
  screen at any zoom. **Hanh: keep 17 px fixed.**
- With real 17 px chips the thinnest panels overflowed, so the wheel size is now measured where the chip sits (inner
  radius + 8 px), needing chip height + 4 px: Paternal ×3.77, Maternal ×1.76, Huong's Paternal ×2.06, Huong's Maternal
  ×1.63. Chị Hân / Anh Rể Khang fit (`mockups/sunburst-thinnest-17.png`). Regression tests pass. index.html rebuilt.
- (The ?lbl=fit / ?lbl=screen preview modes stay in the code but are off.)

## Entry 51 (2026-10-24) — Sunburst text 12 px

- Hanh: "let's reduce the font size to 12pt." Applied as **12 px** (the unit used for every size on this page; 12 pt
  would be 16 px). Chips shrink with it, and the wheels shrink to match: Paternal ×2.94, Maternal ×1.37, Huong's
  Paternal ×1.59, Huong's Maternal ×1.26. Thinnest panels still fit (`mockups/sunburst-thinnest-12.png`). Snap and
  tap/double-tap tests pass. index.html rebuilt.
