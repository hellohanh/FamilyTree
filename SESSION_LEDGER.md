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

## Entry 52 (2026-10-24) — Snap zoom redone for phones (iPhone 402×874)

- Hanh: "the font size change broke the left snap to rotate function on mobile. The zoom is too much and doesn't show
  the inner part of the name panel. Redo the zoom for an iPhone 18." Cause: the bigger rings (Entries 47–51) made the
  snapped ring wider than the screen, so the inner end of each panel (chip + name) sat off the left edge.
- **Fix (locked by Hanh's request):** snapped zoom = the ring's width fits the screen (W − 24 px → text ≈ 14 px on a
  phone). The wheel's centre is placed so the ring's curved inner edge stays ≥ 12 px from the left even near the top
  and bottom of the screen; the empty outer end of a panel may run off the right. While snapped, one finger anywhere
  (also empty space) turns the wheel; two fingers still pinch.
- Verified on an emulated 402×874 phone: Con / Cháu / Chắt names start on screen; swipe on a panel or empty space turns
  the wheel; rotate, pinch, tap/double-tap, Back tests pass. Preview `mockups/snap-iphone.png`. index.html rebuilt.

## Entry 53 (2026-10-24) — Sunburst: generation bands 30% thinner; snap zoom kept

- Hanh: "let's reduce the width of each generation's band by 30%." Then: "fix the zoom on the left snap to accommodate
  this new width." → **Lock it**.
- **Locked:** band thickness TH = 70% of the Entry 50–51 ring size. The thinnest panels must still hold a chip, so the
  radius that the bands gave up goes into a larger centre disc H0 (inner radius of generation d = H0 + (d−1)·TH,
  computed per sheet). Snap keeps the earlier zoom (ring-before-thinning fits the width), so the chosen band takes ~70%
  of a phone's width and the next generation's names peek in on the right; inner edge still ≥12 px in, curvature-safe.
- Previews `mockups/bands-thinner.png`, `mockups/snap-iphone.png`. Regression tests (kin, rotate, pinch, tap/double-
  tap, Back, eye) pass. index.html rebuilt.

## Entry 54 (2026-10-24) — Snap shows two generation bands, laid out from those two only; 16 px text; bands back to full width

- Hanh: "the name on the sunburst is still really difficult to see… at the snap left to rotate, we only take into
  consideration two generation bands at a time [and don't] use the geometry of outer bands beyond the two. Would this
  make the font bigger?" Answer: yes for Con+Cháu and Cháu+Chắt (thinnest panel ×1.9–2.0), no for the last two
  generations (their thinnest panels are already leaves). Hanh: **"Two bands + 16 px text"**, then **"increase the
  width of each generation band again to the original width"** (undoes Entry 53's 30% cut) → **Lock it**.
- **Locked:** when snapped, the wheel is re-laid-out from the chosen generation and the next one only: each slice's
  angle comes from its people in those two bands; bands further out are hidden; un-snapping (or opening a couple and
  coming back while un-snapped) restores the full wheel. Snapped text is 16 px on screen; a panel too thin for a 16 px
  chip at its inner end hides its name until you turn/zoom. Zoom = both bands across the screen width; the curve guard
  covers the middle 60% of the height (names near the very top/bottom may tuck under the edge until turned). Only the
  two bands carry labels while snapped. Band thickness is back to the full ring size (Entry 53 reverted).
- Verified on an emulated iPhone (402×874): Con / Cháu / Chắt readable at 16 px, swipe turns, un-snap restores 210 labels;
  regression tests (kin, rotate, pinch, tap/double-tap, Back, eye, swipe) pass. Preview `mockups/snap-twoband-fit.png`.

## Entry 55 (2026-10-24) — Snap pill names generations from the selected person

- Hanh: "when clicking on a focal, change the bottom Con, Chắt, Chút etc. to show the generation relative to the focal."
- **Locked:** with a viewpoint set (double-tap a name), the snap pill reads from that person: Ông Bà Kỵ / Ông Bà Cố /
  Ông Bà (+ Nội/Ngoại from their own parent's side), Ba Má, Anh Chị Em, Con (Cháu if they have no children), Cháu,
  Chắt, Chút, Chít. It updates as soon as the viewpoint changes. No viewpoint → Con, Cháu, Chắt… from the root couple.
  "Generation N of M" stays underneath.
- Verified: Hạnh → Ông Bà Nội, Ba Má, Anh Chị Em, Cháu; Sydney → Ông Bà Cố Ngoại, Ông Bà Ngoại, Ba Má, Anh Chị Em.
  Preview `mockups/snap-pill-viewpoint.png`. index.html rebuilt.

## Entry 56 (2026-10-24) — Computers: readable wheel names; click / double-click like phones

- Hanh: "this looks good for the mobile. Can we optimize the font size for the desktop" → then "ensure the click, double
  click on the desktop works just like it does on the mobile" → **Lock it**.
- **Locked (screens wider than 820 px):** the whole wheel's names are **14 px on screen at any zoom**; a panel shows its
  chip + name once it's big enough on screen (redrawn after each zoom), so scrolling in reveals more names (they were
  ≈3 px before). Snap on a computer: the two bands take ~55% of the width, 16 px text. Phones unchanged.
- **Bug fixed:** on a computer, a plain click on a name rebuilt the labels on mouse-up (the turn-the-wheel code), which
  swallowed the click. Labels now rebuild only after a real drag. Click → opens the couple (after 350 ms), double-click →
  view as that person, drag → turns the wheel — on the wheel and in snap; phone taps unchanged.
- Verified at 1440×900 (`mockups/desktop-1.png`, `-2.png`, `-4.png`) and on an emulated phone; regression tests pass.
  index.html rebuilt.

## Entry 57 (2026-10-24) — Two-part names: Vietnamese first, English as the alternate

- Hanh: "for those who have two names, make the Vietnamese name primary and the English name alternate."
- Checked all 29 two-part names: only **Paternal AP325 "Rockii / Cát Linh" → "Cát Linh / Rockii"** had the English name
  first (Hanh: swap). All others already Vietnamese first (Nhàn / Jonathan, Hào / Steven…). Both-Vietnamese pairs left
  as written (Thiện/Xinh, Thương / Tường, Nho / Thu Hằng, Nga / Hiển); Hanh: "Thiên Ý/Na" is fine as is.
- Applied via corrections.json (AP325's `to`); data/tree.json regenerated (no Export-changes edits applied yet).
  **Rule going forward:** in a two-part name the Vietnamese name comes first, the English one second. index.html rebuilt.

## Entry 58 (2026-10-24) — Every "A / B" name: A is the name, B the alternate, shown as "A (B)"

- Hanh: "apply this to all the names that have a /" → display: "show Vietnamese name and then in parenthesis their
  American name."
- **Locked:** the converter now splits all 29 "A / B" names into name = A and alt = B (new step after corrections and
  structure fixes; "two-part names split into name + alt: 29"). Everywhere a name shows (cards, wheel, band tooltips,
  editor title) it reads **"A (B)"**, e.g. Nhàn (Jonathan), Cát Linh (Rockii), Thương (Tường), Thiện (Xinh). The editor
  shows A in First name and B in Alternative name. The generation band and the band's focus label use A only. This
  replaces Entry 17/19's "First / Alternative" display.
- data/tree.json regenerated (no Export-changes edits applied yet). Regression tests (kin, cross-sheet, editor, taps,
  snap, desktop clicks) pass. Preview `mockups/alt-names.png`. index.html rebuilt.

## Entry 59 (2026-10-24) — Two-band snap is for phones only

- Hanh: "don't apply the two generational band restriction to the desktop."
- **Locked:** on screens wider than 820 px, snap keeps the full wheel's geometry (no two-band re-layout, no hidden outer
  bands) and every band gets labels at 14 px on screen (shown when the panel is big enough); zoom as in Entry 56.
  Phones keep Entry 54's two-band snap with 16 px text.
- Verified at 1440×900 (`mockups/desktop-snap-full.png`: Ba Má band with Cháu Nhàn (Jonathan)… in the next band) and
  on an emulated phone (two-band snap unchanged); desktop click / double-click / drag tests pass. index.html rebuilt.

## Entry 60 (2026-10-24) — Bug: names ballooned then shrank when snapping on a computer

- Hanh: "on the desktop, when I snap to left, the text gets smaller — is that a bug?" Yes: on computers the names are
  sized for the zoom they're drawn at; snap drew them at the old zoom, so during the 0.5 s snap zoom they grew to ~70 px
  and then were redrawn at 14 px.
- **Fix:** snapping fades the names out, runs the zoom, then draws them once at the final zoom and fades them in
  (200 ms). Measured: hidden during the zoom, 14 px on screen after. Phone snap and all click/tap tests unchanged.
  index.html rebuilt.

## Entry 61 (2026-10-24) — Phone snap geometry adjusts itself so every name in both bands shows

- Hanh: "Adjust the geometry to show the names of the two generation bands for the mobile display. Make this
  dynamically adjustable." → **Lock it**.
- **Locked (phones, snapped):** the wheel is drawn at zoom 1 in screen pixels with its own ring sizes: each band is as
  wide as its longest title chip + name at 16 px (+ margins); if both bands together exceed the screen width minus the
  ring's curve "sag", they shrink together and long names get "…". The ring radius grows until the thinnest panel in
  either band fits a 16 px chip. The centre is placed so the inner edge stays on screen over the middle of the screen
  and the outer band ends on screen. Ancestor rings are squeezed inside. Recomputed on snap, ‹ ›, viewpoint change,
  rotation/resize. Computers unchanged (Entry 59).
- Verified (402×874, seen from Hạnh): Con 72/72, Cháu 149/149, Chắt 138/138 names shown; 375×667 and 430×932 also fit;
  taps, pinch, swipe, Back, desktop tests pass. Preview `mockups/snap-dynamic.png`. index.html rebuilt.

## Entry 62 (2026-10-24) — Bug: a phone turned sideways used the computer layout (Phong & Trinh hidden)

- Hanh: "This is not working. Phong Trinh (under Lành and Bảy) is not showing up even though they are the generational
  focused band."
- **Cause:** "computer" was decided by width alone (> 820 px). A phone held sideways (e.g. 874 px wide) switched to the
  computer layout, where thin panels like Phong & Trinh hide their names. Upright, they showed (verified).
- **Fix:** a computer = wide screen AND a mouse/trackpad (`pointer: fine`); touch screens always get the phone behaviour
  (two-band snap with self-sized rings, 16 px). Also on computers, a name that doesn't fit at 14 px now shrinks down to
  9 px on screen before it hides.
- Verified on the live build (local server): phone upright 402×874 and sideways 874×402 → Phong & Trinh shown in the
  Cháu and Chắt bands; computer 1440×900 → shown in all three. Regression tests pass.

## Entry 63 (2026-10-24) — Bà Lịch's side: separate tree (waiting for names); 3D layered view catalogued

- Hanh: "how would we incorporate my grandpa's wife's side of the family (Hai's wife Lịch)? Suggest a way to lay out
  before writing code." Options given: A separate tree (like the Maternal sheet; shared people linked; "Also in →"
  links) / B eye-view only / one wheel with a split centre. Mocked the split wheel with placeholder names
  (`future/split-wheel-mock*.png`). **Hanh: a separate tree as the base.** Names: **"Not yet"** — Hanh will gather them.
  Titles from Hạnh will follow Entry 39: her siblings = Ông Cậu / Bà Dì (Ba calls them Cậu/Dì), spouses Bà Mợ / Ông
  Dượng; their children (Ba's cousins) Bác / Chú·O by branch order; their children = Hạnh's second cousins (anh chị em họ).
- Hanh asked "would we be considered 2nd cousins?" — Yes: Ba's cousins' children are Hạnh's second cousins (shared
  great-grandparents); Ba's cousins are Hạnh's first cousins once removed. Offered: show the English relationship
  next to the Vietnamese title (not requested yet).
- 3D layered view: prototyped (discs per tree + gold threads for shared people, three.js). Hanh: **"catalog this for a
  future project."** Moved to `future/3d-layers/` with notes in `future/README.md`; the live page and template are
  unchanged (no 3D button, no three.js).

## Entry 64 (2026-10-24) — Wedding: Vỷ (Jonathan) married Thủy Tiên (Erika)

- Hanh: "We had a wedding today, can you add Jonathan's spouse. Thủy Tiên Erika." → which Jonathan: **Vỷ (Jonathan)**
  (Paternal AF365, son of Hùng & Kim Ánh); name: **Thủy Tiên (Erika)** (first name Thủy Tiên, alternate Erika).
- Added as his wife via a new structure op `add_spouse` (data/structure.json, entry 64) so regenerating keeps it; checked
  that tree.json changed by exactly this one person. From Hạnh: Em Vỷ (Jonathan), **Em Dâu Thủy Tiên (Erika)**.
  Preview `mockups/wedding-vy-erika.png`. index.html rebuilt.

## Entry 65 (2026-10-24) — Editor: "Alternative name" → "Nickname"

- Hanh: "instead of alternative name, change label to nickname." Both name rows in the pencil editor (the person and
  the new person) now say **Nickname**. Same field underneath (`alt`); shown as "Name (Nickname)" (Entry 58).
  Preview `mockups/editor-nickname.png`. index.html rebuilt.

## Entry 66 (2026-10-25) — Computers: whole wheel uses the phone text rule

- Hanh: "can you apply the font logic for mobile devices to the desktop sunburst?" → "Whole wheel" → **Lock it**.
- **Locked:** on a computer the whole wheel draws every name at the fixed wheel text size (12 px on the wheel, like
  phones), growing as you zoom — replaces Entry 56's 14 px-on-screen names that appeared only when their panel was big
  enough. The computer's snap view keeps 14 px-on-screen names (Entries 59–60, 62). Desktop click/double-click/drag
  tests pass. Preview `mockups/desktop-wheel-fixed.png`. index.html rebuilt.

## Entry 67 (2026-10-25) — Family view: side ↔ top toggle + stone-slab drop

- Hanh: "have a toggle to change from side to side to top view" → preview → default **top view**, and "I want the
  animation between the two views to mimic stone slabs falling into position, with a puff of dust/debris when the person
  card falls into place. Oldest generation falls first, the rest fall in like a domino effect." → live inline preview →
  plays **every time a family view opens** → then: "keep the same morphing animation from sunburst to flow chart. Stone
  slabs animation between flow chart views" → **Lock it**.
- **Locked:**
  - Header button **⇄ Side view / ⇅ Top view** (in the ☰ menu on phones) flips the family view's layout; **top-down is
    the default** (`?orient=side` still opens side-to-side). The top generation-name strip shows only in side view.
  - **Sunburst → family view:** the existing morph, unchanged.
  - **Family view → family view** (clicking a card to re-focus, the toggle, Back between family views, saving an edit):
    the old view fades in 0.2 s, then each card drops like a stone slab — falls from above, slightly tilted, squashes on
    impact with a 1.5 px shake and a puff of dust flying out to both sides. Oldest generation first, then a domino across
    each row (top view: left → right; side view: top → bottom), 0.11 s apart (squeezed so big views finish in ~2.4 s).
    Each generation's lines draw in once it has landed; row/band names fade in as their generation starts.
  - Clicks work again 0.2 s in (a new click cancels the drop in progress). "Reduce motion" setting → no drop, plain morph.
- Previews `mockups/stone-slabs.gif`, `mockups/top-view-default.png`, `mockups/toggle-side-view.png`. index.html rebuilt.
- **Revised the same session (still Entry 67):**
  - Hanh: "stagger the drop; meaning, blood relative then spouse, randomize each person panel drop by generation band, I
    don't want the stone drop for each generation to happen all at once" → **every person drops on their own** (couples
    no longer fall as one card), in **random order inside each generation**, a **blood relative always before their
    spouse(s)**; a generation finishes before the next starts (spacing 70–170 ms with a little randomness, a big
    generation ~1.5 s).
  - Hanh: "I want the stone drop animation from my POV - looking down … start large and as it falls into place, get
    smaller until it reaches their position" → **seen from above**: each slab starts close to your eye and shrinks into
    its spot (size = 1/distance, speeding up like gravity), a slight spin straightening out, a shadow darkening under it,
    then a small settle and the dust puff. "Start bigger" → **starts at 5× size**. **Lock it.**
  - Fix found while testing: clicking a card mid-drop now stops the drop in progress cleanly (no leftover cards from
    the old view).

## Entry 68 (2026-10-25) — Left navigation panel

- Hanh: "create a left navigation panel and move all the chips to that panel. Keep the focus note on that top panel"
  → preview → **Lock it**.
- **Locked:** every chip (tree picker, Whole family, Seen from …, Side/Top view, Full names, Miền Trung, Export changes)
  now sits stacked in a left panel headed "Options". The top bar keeps the title, the "Focused on …" note and the
  ♂/♀/deceased key.
  - Computers: the panel is always shown (220 px); the wheel, family view, generation band, dust, hint, snap ‹ › bar and
    toasts all sit to its right.
  - Phones: ☰ moves to the top left and slides the same panel in from the left (replaces Entry 38's dropdown; picking
    an option still closes it). The "Focused on" note now shows on phones too, on its own line under the title.
  - The phone-vs-computer test (Entry 62) now uses the window width, so a narrower stage beside the panel doesn't
    count as a phone.
- Previews `mockups/left-panel-computer.png`, `mockups/left-panel-phone.png`. index.html rebuilt.

## Entry 69 (2026-10-25) — Phones: TNCFL-style handle for the options panel

- Hanh: "for mobile devices; add a handle on the left side to house these chips. Use the same handle I use in my TNCFL
  tracker project" → then "mobile handle to be on the right side" → preview → **Lock it**.
- Copied from hellohanh/TNCFL_TRACKER (its Entry 357 mobile drawer): a mustard (#D9A521) pill, 10×72 px with three dark
  dots and a soft glow, on the right edge at mid-height (22×84 px touch area); a dark scrim behind the open panel; the
  panel has a 3 px mustard edge, a mustard "OPTIONS" heading and a "Swipe right or tap outside to close" footer.
- **Locked:** phones only (≤820 px) — the ☰ button is gone; the chips panel slides in from the **right**. Open: tap
  the handle or swipe left on it (follows your finger). Close: swipe right on the panel, tap outside, pick an option
  (Entry 38) or Esc. Computers keep the always-shown left panel (Entry 68).
- The panel now sits outside the top bar in the page so it can cover everything on phones.
- Preview `mockups/handle-phone.png`. Swipe/tap/close tests pass. index.html rebuilt.

## Entry 70 (2026-10-25) — Dust on time; top view gets the Vietnamese generation names on the right

- Hanh: "the debris animation is delay on every stone drop, fix this. Also, the generational band (children,
  grandchildren) for the top view should mimic the side view in vietnamese. Have these label be on the right side of the
  display" → preview → **Lock it**.
- **Dust fix:** the dust was started by its own timer, which drifted behind the drop; it now fires from inside the drop
  on the exact frame the slab lands (same for the little shake).
- **Top view band:** the English row captions (Grandparents, Parents, Children …) are gone. The same Vietnamese names as
  the side view's band (Entry 21/42; "Seen from" names when a viewpoint is set) now sit in a strip down the right
  edge (150 px on computers, 92 px on phones, kept clear of the phone handle), each name level with its row and
  following pan/zoom. The focused couple's label goes on two lines. Fit-to-screen leaves room on the right for the strip.
- Previews `mockups/stone-slabs.gif`, `mockups/band-top-view.png`. index.html rebuilt.

## Entry 71 (2026-10-25) — Straight parent lines; plain generation labels

- Hanh (screenshot): "for the top view and side view; I don't want staggered connection line. Always have that one line
  that connect from an older generation to new generation to not be staggered. The rule is if there is an odd number of
  newer generation - then center on the middle child. If it is even then the line is center between the split. The
  layout below should follow that layout too." Then: "for the generation band labels, have those labels by itself, no
  borders no background."
- **Locked:**
  - Layout rebuilt so each parent's line runs straight into the next generation: **odd** number of children → straight
    onto the **middle child's** card (the blood relative's card); **even** → straight down to the **exact middle between
    the two middle children**. Each family is shifted sideways to make that true (so families can sit off-centre under
    their parents), all the way down; parents above the focused couple sit straight above their one shown child.
    Same rule in top and side view. Measured on every line: no jog.
  - **Exception (Hanh chose "Keep two lines, allow the jog"):** side view of a man with two wives (Ông Hai) keeps one
    line per wife from between him and her (Entry 30); the two families are too tall to fit straight beside those two
    points, so they're parted evenly and those two lines bend. (Top view already uses one line from Hai.)
  - Also fixed: in top view a couple's child line landed on the blood relative's card using the default card width;
    it now uses the card's real width.
  - Generation labels (side view's top line and top view's right side) now stand alone: no background strip, no border.
- Previews `mockups/straight-lines-hau.png`, `mockups/straight-lines-hai.png`. index.html rebuilt.

## Entry 72 (2026-10-25) — Family view opens closer: focused card 325 px on computers

- Hanh: "for the top down view; zoom in on the focused person by 150% of the current view" → preview → asked the side
  view's focused card width (274 px computer / 105 px iPhone) → "for both top view and side view; increase the panel
  proportionally with a width of 325px. Use this width and scale the mobile view to match" → "the mobile view should
  use the same percentage increase to be clear, not to match the 325 width" → **Lock it** (replaces the 150% idea).
- **Locked:** both views open centred on the focused couple (top view: centred in the space left of the generation
  names). Computers: zoom so each focused card is **325 px** wide on screen. Phones: zoom = the phone's fit × the same
  percentage a computer gets for that family (measured against a 1440 × 900 computer: fit 1220 × 830, min zoom 0.6).
  Hậu & Thường: side +19% (phone card 105 → 124 px), top +54% (105 → 162 px). The rest of the tree spills off-screen;
  drag/scroll to see it.
- Preview `mockups/focus-card-325.png`. index.html rebuilt.

## Entry 73 (2026-10-25) — Top view label lane; left panel collapsed by default

- Hanh: "for the generation band label on top view; do not let person panel show through the label. How would we
  accomplish this" → options → "option one [reserved lane]. Also, have the left navigation panel be collapsed by
  default" → preview → **Lock it**.
- **Locked:**
  - Top view: the generation names on the right sit in a reserved lane the width of the names column (150 px; phones
    92 px). The lane is page colour (#161616) — no strip, no border — and the tree slides under it, so a card is cut off
    at the lane's edge instead of showing through the names.
  - Computers: the left options panel starts **collapsed**. A mustard handle on the left edge (mirror of the phone
    handle, Entry 69) slides it in over the view; the « button in its "Options" heading, or Esc, tucks it away. It stays
    open while you use it (picking an option doesn't close it on computers). The view no longer leaves a 220 px gap
    for the panel. Phones unchanged (right-edge handle).
- Preview `mockups/label-lane-collapsed-panel.png`. index.html rebuilt.

## Entry 74 (2026-10-26) — Start over: v1 archived

- Hanh: "I want to build this site from scratch starting over. Archive the current html and keep it as a reference.
  Once the new site has been approved - we will push it to the same link on github."
- v1 archived to `archive/v1-2026-10-26/` (live index.html, its template, the two build scripts, a README). The live
  link keeps serving v1 until the new site is approved; then the new site replaces index.html at the same link.
- Kept as-is for the rebuild unless Hanh says otherwise: the family data (data/tree.json and its sources), the
  corrections/structure files, fonts and images, and this ledger.
- Hanh chose what carries into the rebuild: **data + assets + kinship rules** — family data (tree.json, corrections,
  structure), fonts and images, and the Vietnamese relationship-title rules (Southern terms, Miền Trung O/Cô toggle,
  Dượng, uncle/aunt side from the viewer's own blood parent — Entry 39, Ông/Bà Kỵ = 4 up). Every page design and
  behaviour is decided fresh.

## Entry 75 (2026-10-26) — v2 scope and backend setup (in progress)

- Hanh: v2 keeps a splash page, the sunburst, side view and top view (all redesigned from the ground up) and adds:
  a QR code leading to an "add a picture" page where people find their card and upload a photo (photos replace the
  ♂/♀ symbols, which become male/female avatars when there's no photo); search; other people's edits showing up in
  real time; a log of every change, with Hanh giving final approval for each to stay.
- Setup decisions (tappable answers):
  - Who can edit/upload: **anyone with a family code** (short passcode printed under the QR).
  - Before approval: **shown live to everyone, marked "pending"**; rejecting removes it.
  - Backend: **Supabase** (Hanh's own account), free plan, kept awake by a GitHub Actions job that reads a heartbeat
    table every 3 days (public repos: GitHub disables scheduled jobs after 60 days without commits — re-enable or push).
  - QR target: **the GitHub Pages link** ("If the repo changes or gets moved I can get another qr code").
- Supabase project created: name `family-tree`, URL `https://quqgwvwijvwshdpwvkrk.supabase.co`, publishable key
  received (public by design; the secret/service_role key is never shared). Claude's workspace can't reach
  supabase.co (proxy allowlist) — testing goes through Hanh's browser unless he allows the domain.
- Walkthrough (step-by-step tappable boxes, Hanh's request): 1 create project ✓ · 2 copy URL + publishable key ✓ ·
  3 SUPABASE_URL / SUPABASE_KEY repo secrets ✓ · 4 heartbeat table (supabase/01_heartbeat.sql) run in the SQL
  Editor ✓ (row 1, 2026-10-26 18:59 UTC) · 5 keep-awake job (.github/workflows/keep-awake.yml, every 3rd day 14:17 UTC)
  pushed and run by hand ✓ (green, 8 s). Setup complete; live site unchanged (still v1).

## Entry 76 (2026-10-26) — v2 splash page: "Trancestry"

- Hanh asked for a clever name along the lines of "Ances-Tree" (English or Vietnamese) → suggestions → **"Trancestry"**.
- Hanh: "ancestry" large and bold under the maple tree, the "Tr" fading in and out; leaves dropping from the top of the
  display, falling and landing to make up the maple tree. Drawn-tree preview → "Built from my two maple pictures".
- **Locked:**
  - Tree: one of Hanh's two red maple pictures (assets/splash1.webp, splash2.webp), at random each visit, on #161616.
    The trunk and branches (the picture's non-red parts) fade in first; then ~200 leaf-shaped pieces cut from the
    picture itself fall from the top of the screen — swaying, spinning, slightly larger while high — lowest branches
    first, and land in their exact spots; the full picture fades in at the end so the finished tree is the original.
  - Title under the tree: **Trancestry** in **Playfair Display** bold (fonts/playfair-display-*-700-normal.woff2,
    latin + vietnamese); "ancestry" cream (#f1ece4) fades in once the tree is complete; "Tr" then pulses in and out
    (2.6 s), taking a **new random colour each time it fades back in** from maple red #d1452b, mustard gold #D9A521,
    warm gold #e8b84a, deep red #a81c1c, autumn orange #e0662f (never the same twice in a row; cream excluded).
  - Hand-off: hold **3 s** on the finished tree, then fade to the sunburst; **a tap skips straight to the sunburst** at
    any time.
- Preview `v2/mockups/splash-preview.html` (self-contained), `v2/mockups/trancestry-splash.gif`.

## Entry 77 (2026-10-26) — v2 avatars: six matched pairs, one size

- Hanh sent avatarsv2.zip (avatarsv1.png: 5 pairs; avatarsv2.png: 1 pair) — transparent PNGs, each portrait in a thin
  black frame. "For spouses the pair of avatars should be used in a set. Lets make all the avatar the same dimension."
- First cut flattened the transparency (the hidden colour in the see-through area showed as a glow) — Hanh caught it;
  re-cut keeping the transparency.
- **Locked:** 12 avatars at **512 × 512** (`v2/assets/avatars/setN-<name>-<male|female>.webp`, ~30 KB each), the
  background transparent, the person solid, and **one uniform 6 px black border** on all 12 (the originals' borders
  varied). Sources kept in `v2/assets/avatars/source/`. Sheet `v2/mockups/avatar-sets.png`.
  Sets: 1 blue · 2 black khăn đóng / white áo dài with nón lá · 3 gold / red · 4 porcelain white-blue / jade ·
  5 purple khăn đóng / lilac · 6 brown with checkered khăn rằn.
- A husband and wife always share one set; a single person uses their gender's avatar from a set.
  **Hanh picks the set for each couple** (starts random; changeable in the editor). A real uploaded photo replaces
  the avatar (Entry 75).

## Entry 78 (2026-10-26) — v2 terminology: generation bands above "Con"

- Hanh: "Using me as an example, give me the vietnamese name of the four generational bands preceding me. I will be
  considered con, my parents will be cha me, etc" → **Locked (Southern everyday wording):**
  **Con** (the viewer's own generation) · **Ba Má** (1 up) · **Ông Bà** (2 up) · **Ông Bà Cố** (3 up) ·
  **Ông Bà Sơ** (4 up). Replaces v1's Cha Mẹ / Ông Bà Kỵ for band names in v2.
- Not decided yet: Nội / Ngoại suffixes, names for 5+ up (Ông Bà Tổ / Tổ Tiên were offered), and the bands below
  (v1: Con · Cháu · Chắt · Chút · Chít).
- Hanh: "we will be adding noi ngoai too" → Nội / Ngoại on every band from Ông Bà up (Nội via the viewer's father,
  Ngoại via the viewer's mother); Ba Má stays as is: Ba Má · Ông Bà Nội · Ông Bà Cố Nội · Ông Bà Sơ Nội.
- Asked how a band showing both sides would be labelled → Hanh: "The website will be a collaboration of many
  sunbursts, for me, my cousins, and my second cousins. We'll start with my grandparents on my dad side. One sunburst
  for my grandpa and one sunburst for my grandma. We have the tree for my grandpa."
  → **v2 structure:** many sunbursts, one per ancestor root, linked together. First two: **Ông Hai** (grandpa; data
  exists — the v1 tree) and **Bà Lịch** (grandma, Hậu's mother; her side — data still needed). Each sunburst follows
  one bloodline, so from any viewer a band is all Nội or all Ngoại — the mixed-band question doesn't arise.
- Hanh: Ông Hai's sunburst is the base and the design for everything; Bà Lịch's side is the next priority once that's
  final (her data later). The splash fades to **Ông Hai's sunburst**.

## Entry 79 (2026-10-26) — v2 sunburst: classic rings from Ông Cố & Bà Cố (in progress)

- Hanh's preview rule (standing): **previews are shown as live inline previews, and never grouped into one picture —
  each one separate.**
- Three directions shown (A classic rings, B avatar orbits, C maple petals) → **A · Classic rings**.
- Hanh: "move the generation back one, and start the sunburst on my Ong Co and Ba Co. I want their avatars to be the
  brown set with the checkered scarves" → centre = **Ông Cố & Bà Cố** with avatar **set 6 (brown, khăn rằn)**; rings
  out from their five children's families (Ông Thiện, Ông Hai, Ông Ba, Bà Thành, Ông Tú) — 146 boxes, 4 rings.
  First inline preview shown; details still being refined.
- **Colours locked — "IBM Carbon 25"** (Hanh: "give me carbon themed color palettes" → "I want the IBM Carbon in pastel
  form" → "lets do Carbon 25"): IBM Carbon's categorical hues, half-way between Carbon's 30 and 20 steps — lavender
  #decaff, sky #9edaff, aqua #6ee6e4, pink #ffc2dd, blush #ffc5c8 — one per Ông Cố & Bà Cố's five children's families
  (in order: Ông Thiện, Ông Hai, Ông Ba, Bà Thành, Ông Tú). **Lighter toward the outer rings** (each ring ~16% closer
  to white); a spouse's panel is a shade darker than the blood relative's. Name text picks dark or light by contrast.
  Preview `v2/mockups/sunburst-carbon25.html` / `.png`. Next: names on the panels, then the centre.
- **Names (in progress):** Hanh — run **around the ring** (curved along each panel, never upside down); each panel shows
  the **Vietnamese name with the nickname in parentheses**, cut with an **ellipsis (…)** when it doesn't fit; the
  **relationship title only appears once someone has been clicked as the focal person**. Preview showed the outer two
  rings' panels are too narrow for any curved text at full-wheel size — asked how to handle it.
- **Names locked (v1 style):** each name starts **8 px in from the panel's inner edge and runs outward** along the
  panel's centre line (Hanh's screenshot of v1); regular weight; **not flipped** on the left half (exactly like v1);
  "Ông/Bà" prefixes dropped from names (they're titles). Shown as **Name (Nickname)**, ending in **…** at the outer
  edge; **where the slice has room for two lines, the nickname sits on a second line** underneath, slightly smaller
  (e.g. Thiện / (Xinh)). Ring text sizes 11 / 10 / 9.5 / 9 px, shrinking on thin slices; text colour by contrast.
- **Centre:** no fixed "Ông Cố · Bà Cố" title — **nothing under the avatars until a focal person is picked**; then the
  pair is titled relative to the focal (Hậu → Ông · Bà; Hạnh → Ông Cố · Bà Cố), since their own names aren't known.
  Avatars are **square** (the 512 px cut with its black border), side by side — no circle crop, no gold ring.
- Centre (square avatars, no title until a focal is picked) — **Lock it**. Colours, names and centre of the v2 sunburst are locked; next: what tapping/clicking does, zoom/rotate, and the focal-person titles.
- **Ring width locked:** all four rings **100 wide** (radii 86 / 186 / 286 / 386 / 486; wheel 972 across), scaled down to fit smaller screens; name sizes 15 / 14 / 13 / 12 px by ring (6 px minimum on thin slices). Look of the v2 sunburst is complete; next: behaviour.
- **Standing rule (Hanh):** "When I ask for stuff to be previewed or listed, make sure it's shown in the inline before
  you ask questions." → every preview/list is delivered to Hanh visibly (inline preview or a direct message) first, and
  only then the question box. (A v1 click-rules list written as in-between text never reached him.)
- **Taps (v2, swapped from v1):** **single tap/click** on a person's panel = **make them the focal person** (titles appear relative to them; centre pair titled too); **double tap/click** = **open their couple in the family view** (side/top). Taps counted by the page (phones = computers).
- Kept from v1: **drag to turn the wheel**, **pinch / Ctrl+scroll zoom**, **snap button with ‹ ›** (phones: two rings, bigger text), **Back steps through views** (3 presses to leave from the wheel).
- **Step back (Hanh):** on a phone it's too hard to pick someone in the outer ring from the whole wheel. **Flow:**
  splash → whole sunburst → **a tap/click anywhere on the wheel snaps it to the half wheel on the left, rotated so the
  spot that was tapped sits in the middle**; a **"‹ generation title ›"** navigator appears to move between rings;
  **only in the snapped half wheel do single tap (focal person) and double tap (family view) apply.** Title style
  (chip / inline / above) still to choose.
- **Snap locked:** tap anywhere on the whole wheel → it turns and zooms so the tapped spot faces right, showing **two
  full rings plus a sliver of the ring inside them** (centre pushed off the left edge); **‹ ›** step one ring in/out
  and the label names the pair (e.g. **Chắt · Chút**; counted from Ông Cố until a focal is set); names grow with the
  space, **capped at 17 px on screen**; **drag up/down turns the wheel**; "Whole wheel" goes back. Single tap = focal
  (gold outline), double tap = family view. Preview `v2/mockups/snap-preview.html`. Next: title display for the focal.
- **Focal titles locked — style A:** once a focal person is picked, every other panel shows its title (v1 kinship
  rules: Ba, Má, Chú, Thím, O, Dượng, Anh, Chị Dâu, Em, Con, Cháu…) in a **dark-mustard chip (#c4961a, black bold
  text) just before the name**, at the panel's inner edge; the focal person's own panel gets a **gold outline** and a
  bold name, no chip. Chip text 85% of the name size.
- **Generation names locked (‹ › navigator, centre, and anywhere a generation is named), counted from the focal
  person** (Hanh: "accommodate the full list; Ông Tổ to Chít"): 5+ up **Ông Bà Tổ** · 4 up **Ông Bà Sơ** · 3 up
  **Ông Bà Cố** · 2 up **Ông Bà** (all four + Nội/Ngoại) · 1 up **Ba Má** · own generation **Con** · 1 down **Cháu** ·
  2 down **Chắt** · 3 down **Chút** · 4 down **Chít**. Before a focal is picked the rings are named from Ông Cố & Bà Cố
  down (Con · Cháu · Chắt · Chút). E.g. Hậu focal: centre Ông Bà Nội, rings Ba Má / Con / Cháu / Chắt; Hạnh focal:
  centre Ông Bà Cố Nội, rings Ông Bà Nội / Ba Má / Con / Cháu.

## Entry 80 (2026-10-26) — v2 preview page pushed (splash + sunburst)

- Hanh: "lets push this and let me see how it looks on a desktop and mobile."
- Built `v2/index.html` (from `v2/src/index.template.html` via `tools/build_v2.py`; d3 copied to `v2/d3.min.js`):
  the Trancestry splash (Entry 76, random maple picture, tap to skip, hold 3 s) → Ông Cố & Bà Cố's sunburst
  (Entry 79 look) → tap to snap (two rings + sliver, ‹ › with generation names, drag up/down to turn, "Whole wheel")
  → single tap = focal (gold outline, mustard title chips from v1's kinship rules, precomputed for every viewer in
  `v2/src/kin.json`), tap the focal again to clear; double tap shows "family view comes next".
- Fitting: the wheel fills the screen (whole view); snapped view uses two rings across the width, capped at 1.1× the
  screen height on wide screens (so computers also show part of the next ring). Names in the whole view scale with
  the wheel.
- Not in this preview yet: pinch zoom, Back-button steps, family views, editor, photos, search, live edits.
- Live site unchanged (v1 at the root); the preview is at **/FamilyTree/v2/**.
- Hanh: "reverse the way the drag works" → dragging now moves the wheel **with the finger** (drag down → panels move down).

## Entry 81 (2026-10-26) — v2: v1's generation pill; sunburst-icon button for the whole wheel

- Hanh: "Copy the way v1 showed the ‹ generation › chip on the bottom of the mobile display. Also, change whole wheel
  to an icon that shows a sunburst icon."
- Generation navigator is now v1's pill (Entry 40): one rounded dark pill with round ‹ › buttons and, between them,
  the ring names in gold bold (e.g. **Con · Cháu**) over a small grey line ("Rings 2–3 of 4"); ‹ / › grey out at the
  ends; **bottom-left on phones, bottom-centre on computers**; only while snapped.
- "Whole wheel" is now a **round 52 px button, bottom-right, with a sunburst icon** (dot + two segmented rings),
  shown while snapped. Preview `v2/mockups/v2-nav-phone.png`.

## Entry 82 (2026-10-26) — v2: dynamic two-ring geometry; titles only when snapped

- Hanh: "if the chip is 22, I want a 3px margin on top and the bottom of that piece of the inner ring… apply to the focal
  ring and the next ring out… dynamically change the geometry so that… Quoc's and Nhung's piece isn't so compressed,
  when Hau is the focal." Answers: **the two rings on screen**, **slide smoothly**, and the 28 px minimum applies
  **whenever snapped, focal or not** (he first said "only once a focal is picked", then changed it to yes, before a focal too).
- Rule: in the snapped view every person's slice in the two rings on screen is **≥ 28 px tall at its inner edge**
  (22 px chip + 3 px above and below). Thin families widen, roomy families give space back, children stay under
  their parents, and outer rings split their parent's space proportionally. Recomputed on snap, ‹ ›, focal tap and resize.
  Slices **slide** into place (0.8 s with ‹ ›/snap, 0.55 s on a focal tap; the tapped person stays put on screen).
  The whole wheel returns to true proportions.
- Hanh: "when the full sunburst is shown, then the title does not show. The title will only show when snapped to the left."
  → title chips appear **only in the snapped view**.
- Phones: Con · Cháu (rings 2–3) has 150 people, and at 28 px they need ~1.4 full circles. Hanh chose
  **"1 · Shrink to fit"** (previewed against "keep 22 px, no margins" and "zoom in, outer ring runs off screen"):
  in a tight slice the chip and name shrink so the 3 px margins hold. Measured: desktop has every slice ≥ 37 px;
  phone Cháu · Chắt has every slice ≥ 30 px. Previews: `v2/mockups/geo-desktop.png`, `v2/mockups/geo-phone-shrink.png`.

## Entry 83 (2026-10-26) — Soeur Trung

- Hanh: "my dad older sister Trung is a nun. Add the Soeur to her first name."
- `data/corrections.json`: `H.HN.T Paternal Tree!W233` "Trung" → **"Soeur Trung"** (Hậu's older sister, daughter of
  Ông Hai; not the other Trung at W317, Văn's husband). `data/tree.json` regenerated and v2 rebuilt; she now shows as
  **Chị · Soeur Trung** when Hậu is the focal. The spreadsheet itself was not edited.

## Entry 84 (2026-10-26) — v2: 30 px on both snapped rings, scrolling layout (supersedes Entry 82's phone shrink)

- Hanh, on his Galaxy S25 Ultra (412×891): "soeur trung's slice chip and font size is smaller than the expected. Its doesn't
  have the 28px height", and "I was expecting that all the displayed ring will have the same size font".
- Hanh first set 30 px for the inner (focal) ring with the next ring shrinking to fit, then corrected: **"I want the two
  focal ring to have the 30px."** Locked: in the snapped view **every person in both rings on screen has at least 30 px**
  at the inner edge of their slice, so names (17 px) and chips are the same size across both rings. Rings beyond them
  (the inner sliver, the edge of the next ring) split their parent's space and shrink to fit.
- When the two rings need more than one full turn (phones: Con · Cháu ≈ 1.4 turns), the part on screen stays full
  size and the part hidden off the left edge is squeezed. **Dragging scrolls the family past the screen** like a
  list, and slices grow to full size as they come into view. Entry 82's shrink-on-phones rule is replaced.
- Measured on the S25 Ultra and a 1440×900 desktop: every on-screen slice in the two rings is ≥ 30 px, before and
  after dragging, at rings 1–2, 2–3 and 3–4. Soeur Trung is 30 px (phone) and 45 px (desktop).

## Entry 85 (2026-10-26) — v2: whole wheel rotate + pinch; generation pill counts from the focal

- Hanh: "when the full sunburst is showing, allow pinch to zoom and drag to rotate. A click on any part of the wheel to
  follow the logic spelled out previously." → whole wheel: **one finger turns it around its centre, two fingers
  pinch-zoom** (0.8× to 4×; mouse wheel on computers). A tap still snaps to the tapped spot.
- Generation pill: with no focal it still counts down from Ông Cố & Bà Cố (Con, Cháu, Chắt, Chút). With a focal:
  the focal's own band is **"Đời <name>"** (e.g. Đời Hậu), the band below is **"Con Cháu"** (Hanh: "Đời Hậu · Con Chau",
  written Con Cháu), and **every band above starts with Đời**: Đời Ba Má, Đời Ông Bà Nội/Ngoại, Đời Ông Bà Cố …
  (Hanh: "Doi Ba Ma"; "Yes, all upper bands"). E.g. Hậu focal: "Đời Hậu · Con Cháu"; after ‹: "Đời Ba Má · Đời Hậu".
- Previews: `v2/mockups/s25-hau-focal.png`, `v2/mockups/s25-hau-left.png`.

## Entry 86 (2026-10-26) — v2: phone pill without generation names; centre titles on two lines

- Hanh: "lets remove the Generational title from the navigation chip on mobile displays" → on phones (≤ 820 px) the
  pill shows only ‹ **Rings 2–3 of 4** ›; computers keep the gold names (e.g. Đời Hậu · Con Cháu).
- Hanh: "have the middle title of my great grand parents be on two lines" → once a focal is picked, the title under
  Ông Cố & Bà Cố is one per line (e.g. Hậu focal: **Ông Nội** / **Bà Nội**).
- Previews: `v2/mockups/s25-pill.png`, `v2/mockups/s25-centre-titles.png`.

## Entry 87 (2026-10-26) — Splash: bare branches first; warm-wood heads

- Hanh: "on the splash page, the image of the tree before the leaves falls should only show branches and no leaves."
  The old in-browser cut (remove bright red) left dark-red leaf shadows and specks. The bare tree is now made ahead
  of time: leaves are removed by colour (red hue), only the tree itself is kept (no stray specks), and the two
  heads are restored as full ovals. Files: `assets/splash1-v2-branches.webp`, `assets/splash2-v2-branches.webp`.
- Hanh: "change the colouring and highlight of the two heads to show up better on a dark background". Previewed
  A · Warm wood, B · Gold rim, C · Golden gloss; Hanh chose **A · Warm wood**: lighter brown with a soft top-left
  highlight and a thin dark edge, on **both trees**, in both the bare branches and the finished leafy tree
  (`assets/splash1-v2.webp`, `assets/splash2-v2.webp`; originals untouched). Recipe: `tools/splash_heads.py`.
- Previews: `v2/mockups/splash-bare-branches.png`, `v2/mockups/splash-heads-warm-wood.png`.

## Entry 88 (2026-10-26) — Splash: falling leaves without branches; stays until a tap

- Hanh: "some of the leaves that fell down have branches attached to them - i don't want that." Falling leaves are now
  cut from a **leaves-only picture** (`assets/splash1-v2-leaves.webp`, `assets/splash2-v2-leaves.webp`, made by
  `tools/splash_leaves.py`: leaf colour only, branches and twigs removed), so no branch or twig rides along.
- Hanh: "also keep the splash page on until a click" → no more auto-advance after 3 s; the finished tree and
  Trancestry (Tr still fading through its colours) stay until a tap/click. Checked: still up after 20 s, one tap opens
  the sunburst.
- Preview: `v2/mockups/splash-leaves-falling.png`.

## Entry 89 (2026-10-26) — v2: navigation pane (empty shell) with handles

- Hanh: "lets add a left navigational pane on the desktop and the handle to on the mobile display." Answers: **empty shell
  for now** (filled item by item), **computers: collapsed with a left handle**, **phones: handle on the right edge**.
- Computers: a mustard handle on the left edge opens a 240 px "OPTIONS" pane over the view; « or Esc closes it.
- Phones (≤ 820 px): v1's TNCFL handle (Entry 69) on the right edge; tap or swipe left to open (follows the finger),
  swipe right, tap outside or Esc to close; mustard edge, dark scrim, "Swipe right or tap outside to close" footer.
- The pane says "Nothing here yet." Tested on 1440×900 and the S25 Ultra: open, close, Esc, swipe; taps on the
  wheel are unaffected. Previews: `v2/mockups/pane-desktop.png`, `v2/mockups/pane-phone.png`.

## Entry 90 (2026-10-26) — Splash tap opens the whole sunburst

- Hanh: "from the splash page to the sunburst on the mobile, make sure it shows the full sunburst when clicking on the
  splash page. Right now clicking on the splash page automatically goes to the snap left view."
- Cause: the splash closed on finger-down, so the same tap's click landed on the wheel and snapped it. Now the splash
  closes on the tap itself and keeps that tap, so the **full sunburst** shows; only the next tap snaps.
- Checked: early tap and late tap on the S25 Ultra, and a click on a computer — none snap.

## Entry 91 (2026-10-26) — Computers: titles on the whole wheel

- Hanh: "on the desktop display, show the title when a focal is picked for the full sunburst." → on computers (> 820 px)
  the title chips also show on the whole wheel once a focal is picked (refines Entry 82's snapped-only rule).
  Phones keep titles in the snapped view only. Preview `v2/mockups/whole-titles-desktop.png`.

## Entry 92 (2026-10-26) — Options pane: search

- Hanh picked **Search** as the pane's first item. Answers: picking a result **snaps the wheel to that person and makes
  them the focal**; typing **ignores accents** and narrows the list as you type; each result shows the name and,
  under it, **"con của <father> & <mother>"** so the right person is picked.
- Rules (Hanh): names only, no Ông/Bà ("con của Hai & Lịch"), except Ông Cố's children read
  **"con của Ông Cố & Bà Cố"**; people who married in show **"vợ của / chồng của <spouse>"**; Tường (Ông Hai's
  stepdaughter) shows **"con của Thương"** (mother only); unknown **"??"** people are left out of search.
- The mother comes from the tree's mother record (Ông Hai's two wives); otherwise the parent couple. Father first.
- Matching: any word of the name or nickname starting with what's typed ("hau" → Hậu, not Cháu/Châu); Enter picks
  the first result. Phones close the pane after a pick; computers keep it open.
- Hanh reviewed the full list of shared names (Châu, Dũng, Hương, Thảo, Tuấn, Vũ …) and their result lines before
  locking. Previews: `v2/mockups/search-desktop.png`, `v2/mockups/search-phone.png`.

## Entry 93 (2026-10-26) — Search pick hides the pane

- Hanh: "on the search, once a person clicks on the name, auto hide the navigational panel." → after picking a search
  result the pane closes on computers too (phones already did); the wheel snaps to the person and makes them focal.

## Entry 94 (2026-10-26) — Options pane: quick items

- Hanh chose "Quick pane items" next, then "add top view, side view to this panel" (placeholders for now).
- Under the search, in order: **Whole wheel** (greyed when already whole), **Clear focal** (shows the focal's name;
  greyed when none), **Side view** and **Top view** (greyed, "Coming next" until the family view is built), then the
  **Miền Trung** switch (on by default: Ba's younger sister = O, Bà O; off: Cô, Bà Cô — v1 Entry 37).
- Whole wheel and Clear focal close the pane after a tap; the Miền Trung switch keeps it open. The round
  whole-wheel button (bottom right) stays.
- Tested on computer and S25 Ultra. Preview `v2/mockups/pane-items.png`.

## Entry 95 (2026-10-26) — Married-in focal: their spouse gets Chồng / Vợ

- Hanh: "when clicking on a spouse that marries into the family, on their focal, add the title of their spouse." Clarified:
  the focal's own slice stays **just their name**; the title goes **on their spouse's slice**.
- Cause: a married-in person sees the family through their spouse, so their spouse came out blank (67 couples).
  Now their spouse shows **Chồng** or **Vợ** (by the spouse's gender), e.g. Thường as focal → **[Chồng] Hậu**.
- Open (noted, not changed): with Ông Hai's two wives, Bà Lịch as focal sees Bà Thương through Ông Hai's view.
- Preview `v2/mockups/inlaw-focal.png`.

## Entry 96 (2026-10-26) — v2: top header

- Hanh: "lets add a top header panel" (showed v1's header). Answers: title **"Trancestry" over "Our Family Tree"**;
  note **"Focused on <focal>"** (blank when no one is picked). Then: "2pts bigger, bold, TR in maple red."
- Locked: a dark bar across the top like v1's — **Trancestry** bold, 24 px (phones 21 px), **"Tr" in maple red
  #d1452b**; "Our Family Tree" small and muted under it; "Focused on **Hậu**" beside it (phones: its own line).
- The wheel, hint and toasts sit below the header; on computers the Options pane opens below it; the phone pane still
  covers the full height. Previews `v2/mockups/header-desktop.png`, `v2/mockups/header-phone.png`.

## Entry 97 (2026-10-26) — Simple view (focal couple + children)

- Hanh: "add a Simple to the left navigation panel. This Simple view will show just the focal couple and their children.
  This is one view to use to edit a family unit." Answers: look like **v1's top-down view**; **view only for now**
  (edit buttons arrive with live edits); "on both desktop and mobile the children will be shown in a column"; with two
  wives, a **line from each child's mother**; "for my grandpa Hai, have [him] in the center and Lịch on the left and
  Tường on the right and have each child on the corresponding wife."
- Pane item **Simple** (under Top view; greyed "Pick a focal first" until there is a focal; its line names the couple).
- Computers: the couple on top in v1-style cards (dark, gold border, thicker on the focal, ♂/♀, title chips from the
  focal); one spouse → a marriage line and the children in a column hanging from it; two wives → husband in the
  centre, first wife left with her children in a column on her left, second wife right with hers on her right.
- Phones: an outline in one column — husband on top, each wife below him, her children under her — so names stay full.
- Tap a child → they become the focal and their own family unit opens; tap a couple card → focal. "‹ Wheel" or Esc
  goes back. Previews `v2/mockups/simple-*.png`.

## Entry 98 (2026-10-26) — Tường's branch catalogued out of Ông Hai's sunburst

- Hanh: "Catalog Thuong (Tuong) from her previous marriage away. Remove her daughter Tuong from this sunburst. We will
  capture this in another sunburst." → confirmed: **the whole branch** — Tường & Kỳ and all their descendants
  (**17 people**: Khánh & Nhung + 3, Duy & Ngọc + 2, Hàng, Vũ, Trang & Vũ + 2).
- New `data/catalog.json` records the branch (box W267) as "Bà Thương / Tường's family from her previous marriage";
  `tools/build_v2.py` leaves catalogued branches out of the v2 tree (asserted). Bà Thương stays as Ông Hai's wife. The
  spreadsheet is untouched. Ông Hai's sunburst now has 196 people.

## Entry 99 (2026-10-26) — Splash: leaves follow the season

- Hanh: "for the splash page, I want the leaves color to follow the season." Done in code (no new PNGs): the leaves are
  recoloured from the leaves-only picture, keeping each leaf's own shading.
- Hanh: "use all 6 and divide them amongst the 12 months … use FEB, APR, JUN, AUG, OCT, DEC"; order "Pink → green → red":
  **Feb–Mar** cherry-blossom pink · **Apr–May** fresh light green · **Jun–Jul** deep green · **Aug–Sep** orange-gold ·
  **Oct–Nov** red and gold mix (each leaf picks red or gold) · **Dec–Jan** frosted white.
- Hanh: "when the time is close to each other, use the random picks between the two versions leaves to signal
  transition" → from 7 days before a switch to 7 days after, each falling leaf picks the old or new look at random, the
  new look's share growing 0 % → 100 %. Hanh: "for anything that has the white leaves - keep it fully white" → no mixing
  into or out of winter: **fully white Nov 24 – Feb 8**.
- One look: the finished tree fades in crisp; mixed looks: the tree stays made of the landed leaves.
- Preview any look with `?season=pink|spring|summer|gold|mix|frost|red` or a day with `?date=YYYY-MM-DD`.
  Previews `v2/mockups/seasons/`.

## Entry 100 (2026-10-26) — Click on the view hides the pane

- Hanh: "if the left panel is open, any click on the tree or sunburst auto hides the left panel." → with the pane open,
  a click/tap on the wheel or the Simple view **only hides the pane** (Hanh chose "hide only"); the next click works as
  usual. Clicks inside the pane are unaffected. Tested on computer and S25 Ultra.

## Entry 101 (2026-10-26) — Simple view: spouses inside the children's cards

- Hanh: "under the simple view; show the wife as part of the children cards." → each child's card also lists their
  wife / husband on a line under the child (♀/♂, title chip from the focal — Con Dâu / Con Rể —, name), separated by a
  thin rule; a child with no spouse keeps a one-line card. Tapping either line makes that person the focal.
  Computers and phones (outline). Previews `v2/mockups/simple-*.png` updated.

## Entry 102 (2026-10-26) — Avatars on the family cards

- Hanh: "under the side, top, and simple views - apply the avatars instead of the icons, with the rules we established
  before." → Simple view cards now show the **square avatar** (Entry 79's square cut) instead of ♂/♀; cards are taller to
  fit (computers 66 px, phones 58 px; spouse lines 80 %).
- Entry 77's rules: a couple shares one set (both of Ông Hai's wives share his set); Ông Cố & Bà Cố are set 6 (brown,
  checkered khăn rằn); until Hanh picks a set per couple, each couple gets a **steady random pick** (from the couple's
  sheet cell — the same set every visit, on every screen); a real uploaded photo will replace it. Unknown gender → "?".
- Side and top views are not built yet; they will use the same avatars. Previews `v2/mockups/simple-*.png`.

## Entry 103 (2026-10-26) — Avatar sets reshuffle each visit; photos win

- Hanh: "these avatars are randomized per open session correct? If a picture is uploaded for a person, then that picture
  supercedes the avatar." → chose **"New random each session"**: each time the site opens, every couple gets a new
  random set (both spouses still share it, and it stays the same for the whole visit); Ông Cố & Bà Cố stay set 6.
  Checked over three visits. Confirmed: an uploaded photo replaces the avatar (comes with the photo-upload page).

## Entry 104 (2026-10-26) — Back button walks back through the views (v1's Entry 41 logic)

- Hanh: "when click back, it should go to the previous views in order. Use the v1 logic for clicking the back button."
- Every view is a browser-history step: the whole wheel, each snapped view (ring + centre + focal), and each Simple view
  (focal). Back walks back through them in order; Forward works too; spinning the wheel is not a step. On the
  starting whole wheel, Back must be pressed 3 times in a row (within 3 s) to leave, with toasts "Press Back 2 more
  times to leave" / "Press Back once more to leave". Guards are added after the first tap (browsers ignore history
  added before the visitor interacts).
- Tested on the S25 Ultra: snap → focal Hậu → ‹ → Simple → Huyền Nhi, then Back ×8 retraced every step, counted down
  and left the site; no errors.

## Entry 105 (2026-10-26) — Simple view: equal avatars, cards as wide as the longest name

- Hanh: "ensure that each of the children boxes in the simple view have the same size avatar, use the longest name of the
  children to extend the width of the card to ensure the font is the same. What is the font size of the parent card?"
- Every line (couple, child, child's spouse) is the same height with the **same 44-unit avatar**; all children's cards
  share **one width**, set by the longest line (avatar + title chip + full name), so names are never cut and every
  name uses **one font size**; the couple cards also widen if a name needs it. Phones: the outline widens the same way.
- Measured: computer 1440 px — names **19.2 px**, title chips 16.3 px, avatars 53 px (zoom at its 1.2× ceiling);
  S25 Ultra — names **15.3 px**, chips 13.0 px, avatars 48 px. Zoom range 0.75×–1.2× (base 16 computers, 14 phones).
- Longest child name with a nickname: **Dịnh Khương (Branden)** (Thu's son) — fits uncut on both. Hanh: **"Keep as is"**
  for the font floor/ceiling. Previews `v2/mockups/simple-longest-*.png`.

## Entry 106 (2026-10-26) — Side / top view layout for a man with two wives (design locked; views not built yet)

- Hanh: "for the side and top view, for Hai Lich and Thuong, show the children by the corresponding wife. Have Hai be in
  the middle." Inline sketches shown; Hanh: "this looks good. Apply the same logic for the connector lines from V1."
- **Locked for when the side/top views are built:**
  - **Top view:** Lịch — Hai — Thương on one row, Hai in the centre; Bà Lịch's children in a row under her, Bà Thương's
    under her. **Side view:** Lịch above Hai, Thương below him; each wife's children in a column to her right.
  - v1's straight-line rule (Entry 71): each wife's line runs straight onto her **middle child** (odd count) or **midway
    between the two middle children** (even). Each wife sits directly over (top) / level with (side) her children's
    middle, so no line jogs — v1's "allow the jog" exception for two wives is no longer needed.
  - Children's cards include their spouse (Entry 101) and avatars (Entries 102–103).

## Entry 107 (2026-10-26) — v2 side view built

- Hanh: "lets build the side view." Answers: **like v1**, "with the logic we set up for the width of the card that is
  dependent on the name"; opens from the **pane's Side view item**; **separate stacked cards**; **stone-slab drop now**.
- **Locked (built):**
  - Generations **left → right**: the direct line of ancestors (each couple level with the child it leads to), the focal
    couple, then every generation below; siblings top → bottom; a couple stacked in its column (blood relative on top,
    spouse below, a short line between). Ông Hai's wives: Lịch above him, Thương below, each level with the middle of her
    own children (Entry 106).
  - Cards: square avatar (Entries 102–103), title chip from the focal, full name; **every card in a column is as wide as
    its longest line** (Entry 105), so names are never cut. The focal family's cards have gold borders (focal thicker).
  - v1 sizes (Entry 20): focal 100 %, Con 75, Cháu 50, Chắt 30, then 5 points less (floor 5); Ba Má 50 % at half
    opacity, older 25 %. Hanh: "Keep v1 sizes, lock it."
  - v1 straight lines (Entry 71): a parent's line runs straight onto the middle child (odd) or midway between the two
    middle children (even).
  - Generation names pinned along the top (Entry 21 style, 18 px × the level, floor 11), following scroll and zoom:
    "Đời <focal>", Con, Cháu …, and Đời Ba Má / Đời Ông Bà Nội … to the left.
  - Opens centred on the focal; computers: focal card 325 px wide (v1 Entry 72); phones: their fit × the computer's
    percentage, at most 45 % of the screen width. Wheel / drag scrolls, Ctrl + wheel / pinch zooms.
  - Tap a card → that person becomes the focal and the view re-drops. Stone-slab drop (v1 Entry 67): oldest generation
    first, random order inside a generation (blood relative before spouse), each card falls from 5× size, settles with a
    small bounce and a dust puff; each generation's lines appear once it has landed. Reduce-motion → no drop.
  - ‹ Wheel, Esc and the Back button (Entry 104) all work; the side view is a history step.
- Tested on computer and S25 Ultra (Hậu, Ông Hai, Ông Thiện); no errors. Previews `v2/mockups/side/`.

## Entry 108 (2026-10-26) — Side / top / Simple without a focal → Ông Cố & Bà Cố

- Hanh: "I should be able to pick side, top, view from sunburst without focal. It will just use my great grandparents as
  the focal." → Side view (and Top view when built) opens on **Ông Cố & Bà Cố** when no one is picked: they take the
  focal spot, titles are from Ông Cố's view, the top row reads Đời Ông Cố · Con · Cháu · Chắt · Chút (196 people).
  Hanh: "Yes, Simple too" → the Simple view does the same (Ông Cố & Bà Cố and their children).
- Their cards read "Ông Cố" / "Bà Cố" (the bare sheet name is just "Cố"). The pane items are always enabled and name the
  couple. Tapping a card picks that person as the focal; tapping Ông Cố / Bà Cố goes back to no focal.

## Entry 109 (2026-10-26) — "‹ Wheel" chips removed

- Hanh: "remove the <- Wheel chip, we can navigate back to the sunburst using the left navigational panel." → the chips
  are gone from the Simple and side views; the pane's **Whole wheel** item now also leaves those views and returns to
  the sunburst (Esc and the Back button still work too).

## Entry 110 (2026-10-26) — No repeated avatar sets inside a family

- Hanh: "for the avatars, for family with less than six couples, do not duplicate the same avatar set." → a family unit
  = a couple and their children's couples; each child's couple gets a different set from its siblings and from the
  parents, so a unit of up to six couples never repeats a set (there are six sets). Bigger units (Ông Hai: 10 couples)
  go round the sets again. Still reshuffled every visit (Entry 103); Ông Cố & Bà Cố stay set 6.
- Checked all 46 family units over three visits: no repeats in any unit of six couples or fewer.

## Entry 111 (2026-10-26) — Stone-slab drop only the first time per visit

- Hanh: "for the drop and debris animation - only show on the first instance of each view per session." → the stone-slab
  drop and dust play only the **first time the side view opens in a visit**; after that (reopening it, tapping a card to
  change the focal, Back) the view just fades in (0.25 s). The top view will follow the same rule when it's built.
  Tested: first open drops all 196 cards; second open and a card tap show the view straight away.

## Entry 112 (2026-10-26) — Sunburst → view morph (v1's morph)

- Hanh: "from the sunburst to any of the three views - use the morph animation like in v1." → going from the sunburst to
  the Side or Simple view (and Top when built), each person's wheel panel changes shape into their card while the rest of
  the wheel fades; the colour runs linearly (Lab) from the panel colour to the card charcoal over the first 65 %
  (v1 Entries 9–10); **2.0 s** in all; then the finished view fades in. Ông Cố & Bà Cố start from their centre avatars.
  Reduce-motion → no morph.
- View → view (e.g. Simple → Side) keeps the stone-slab drop, first time per visit only (Entry 111) — as in v1 Entry 67.
- Filmed on computer and S25 Ultra. Previews `v2/mockups/morph-side-desktop.png`, `v2/mockups/morph-simple-phone.png`.

## Entry 113 (2026-10-26) — v1's morph code (replaces Entry 112's overlay morph)

- Hanh: "lets use the same morphing logic as in v1. The morphing had more of an amoeba shape when morphing." Previews:
  flubber overlay, organic-blob, random-blob, wedge → amoeba → card, and a recording of v1's real morph; Hanh: "keep V1
  with better amoeba shapes" → preview → **"lets keep the v1 morphing code"** → **Lock it**.
- Locked: as in v1, the morph happens **inside the wheel**: each person's panel turns into their card with
  **flubber.interpolate** (from the panel's real outline to the card, maxSegmentLength 6) while the **camera glides and
  zooms** from the wheel to the view; panels not in the view fade out; the centre avatars and wheel names fade. Colour:
  linear Lab from panel colour to card charcoal (gold edge for the focal family) over the first 65 %; 2.0 s, cubic
  in-out (v1 Entries 9–10). Then the finished view fades in and the wheel is quietly put back behind it.
- flubber.min.js now ships beside d3.min.js in `v2/`. Recordings `v2/mockups/morph-v1-desktop.gif`, `morph-v1-phone.gif`.

## Entry 114 (2026-10-26) — v2 top view built

- Hanh: "let generate the top view." Built on the side view's engine turned 90° (as in v1 Entry 67), so every side-view
  rule carries over: v1 sizes (Entry 107), cards as wide as the longest name — here **every card in a row** shares
  that width — avatars and title chips, v1 straight lines, Ông Hai's wives each directly above the middle of her own
  children with Hai between them (Entry 106), opens centred on the focal (computers: focal card 325 px), drag/scroll and
  pinch/Ctrl+scroll, tap a card → new focal, Ông Cố & Bà Cố when no focal (Entry 108), morph in from the sunburst
  (Entry 113), stone-slab drop the first time per visit (Entry 111), Back button step.
- Top-view specifics (v1 Entries 13, 70, 73): generations top → bottom; spouses **side by side** with a marriage line, the
  children's line drops from between them; generation names in a **lane on the right** (150 px computers, 92 px phones;
  page colour, no border; the tree slides under it), the view centres in the space left of the lane. Phones: lane
  labels 13 px × the level (floor 11), kept clear of the mustard handle.
- Pane: the **Top view** item is live (names the couple). Tested on computer and S25 Ultra. Previews `v2/mockups/top/`.

## Entry 115 (2026-10-26) — Dust lands with the slab (no delay)

- Hanh: "make sure the debris animation is not delayed. We had this problem in v1." Measured before the fix: dust came
  ~100 ms after a slab landed (worst 570 ms) because it waited on the fall's end event. Now the fall, the little shake
  and the dust run in one animation, and the dust starts on the very frame the slab lands (v1 Entry 70's fix). Measured
  after: median 16 ms (one frame), worst 42 ms, on computer and S25 Ultra. The drop is one shared routine for all views.

## Entry 116 (2026-10-26) — Simple view: stone-slab drop every time

- Hanh: "apply the falling animation to the simple view. No restrictions on how many time coming back to simple view.
  Show animation every time." → the couple's cards fall first, then the children's; lines fade in once they've landed;
  dust on landing. Plays **every time** the Simple view opens (from Side/Top, tapping a card inside it, the Back button);
  opening it straight from the sunburst keeps the morph (Entry 113). The side/top views keep first-time-per-visit
  (Entry 111).

## Entry 117 (2026-10-26) — Phone pill ring count in bold gold

- Hanh: "for the chip for mobile 'rings 1-2 of 4' make sure this is back to the bolded yellow font." → on phones the
  "Rings x–y of 4" line is bold, gold (#D9A521), 13 px.

## Entry 118 (2026-10-26) — Pane docked open on computers; phone handle on the left

- Hanh: "on desktop; keep the left navigational pane open. Change the handle for the navigation to the left side on the
  mobile view." → computers (> 820 px): the Options pane is **always open**, docked on the left below the header (240 px);
  the wheel, Simple/Side/Top views, the ‹ › pill, hints and toasts sit to its right; no handle and no « button; picks
  and clicks no longer close it. Phones: the mustard handle moves to the **left edge**; the pane slides in from the left
  below the header (gold edge on its right); tap or swipe right to open, swipe left / tap outside / Esc to close
  ("Swipe left or tap outside to close"). Supersedes Entry 89's collapsed-by-default and Entry 69's right-side handle.
  Top view's phone name lane moves back to the edge (handle no longer there).

## Entry 119 (2026-10-26) — Clear focal clears every title

- Hanh: "fix the clear focal chip to really clear the titles." Cause: in the Simple/Side/Top views, Clear focal left
  the view as it was, and with no focal the views showed titles from Ông Cố's view. Now Clear focal redraws the open
  view, and **with no focal picked there are no title chips anywhere** (the views show Ông Cố & Bà Cố and the family
  with names only, like the wheel). Refines Entry 108.

## Entry 120 (2026-10-26) — Side / top cards at least 250 px on computers

- Hanh asked the average card width (computer, as opened: 236 px for Hậu's view, 189 px with no focal; S25 Ultra
  60–110 px), then: "minimum width of all cards 250px for desktop. Scale this width the to mobile devices."
- Locked: in the side and top views every card is **at least 250/325 of the focal card's width** — computers open with
  the focal card at 325 px, so every card is **≥ 250 px**; phones open at their own zoom of the same layout, so the floor
  scales with them (S25 Ultra: ≥ 84 px side / ≥ 66 px top for Hậu's view). Text sizes per generation are unchanged.
  Measured: computer minimum 250 px in both views, focal 325 px.
- Hanh asked how to set the focal in Side / Top / Simple: tap any card (Simple: a child's line opens that child's family,
  a spouse's line makes the spouse the focal); search works from any view; tapping Ông Cố / Bà Cố → no focal.

## Entry 121 (2026-10-26) — Picks in the views light up Clear focal; Ông Cố & Bà Cố can be the focal

- Hanh: "when I click on someone to be a focal in side/top/simple view, make sure the clear focal chip in the
  navigational panel turns so that we can click on it to turn it off. Also, choosing my great grandparent activate them
  as the focal too."
- Every way of picking a focal (a card in Side / Top / Simple, a wheel tap, search, the Back button) now updates the
  pane at once: **Clear focal** turns on and names the person.
- **Ông Cố & Bà Cố are real focals now** (refines Entries 108 and 119): tapping either one makes them the focal — the
  header reads "Focused on Ông Cố", titles come from their view (Bà Cố → Ông Cố is Chồng), and it carries to the wheel
  and the other views. **No focal** (Clear focal) still means names only, shown on Ông Cố & Bà Cố.
- Tested on computer and S25 Ultra in all three views and back on the wheel; no errors.

## Entry 122 (2026-10-26) — Tap anywhere on a card to pick the person

- Hanh: "make sure that clicking anywhere in the person card activates them as the focal." Found: taps on the rounded
  corners (Side / Top) and on the card's top/bottom padding and corners (Simple) did nothing. Now every card has a
  see-through tap area over its whole box; in Simple each line's tap area reaches the card's edges (a child's line
  above, the spouse's line below). Side / Top also allow a small slip of the finger or mouse (6 px click, 12 px tap)
  without it counting as a drag.
- Tested: 9 points per card (4 corners, top and bottom edges, avatar, middle, right edge) in Side, Top and Simple, on
  computer and S25 Ultra — all 54 pick the person.

## Entry 123 (2026-10-26) — Simple view: spouses drop as their own slabs

- Hanh: "for the simple view; separate the spouses card for the animation. Don't drop the couples at the same time." →
  every person drops as their **own slab**: a child's card splits into the child's slab and the spouse's slab, which
  fall separately and join back into the one card once both have landed; the couple's cards fall one at a time.

## Entry 124 (2026-10-26) — Simple view drop order is random

- Hanh: "make sure these drop on the simple view are randomized." → the couple's generation still drops first, then the
  children's, but inside each generation **every slab gets a random turn** (child or spouse, any family), new each time.
  (Side / Top keep v1's order: random families, blood relative before spouse.) Checked over three runs.

## Entry 125 (2026-10-26) — Stop protocol (S005)

Hanh: "stop protocol." Sessions since S004 (Entries 31–124) covered:
- v1 finished, pushed live and archived (`archive/v1-2026-10-26/`); v2 "Trancestry" started from scratch (Entry 75+).
- v2 built and locked: splash (seasonal leaves), sunburst (snapped two-ring view, focal titles, generation pill),
  header, Options pane (docked on computers, left handle on phones), search, side / top / Simple views, v1 morph,
  stone-slab drop, Back button, avatars; Soeur Trung; Tường's branch catalogued for its own sunburst.
- Docs updated: README Current State + resume prompt, ROADMAP v2 status table, SKILL "v2 (Trancestry) — LOCKED".
- Pushed through Entry 124 (commit fc2545f); Pages serving /FamilyTree/v2/. Docs mirrored to the Project.
- Snapshot zip: `S005_2026-10-26_FamilyTree.zip`.

## Entry 126 (2026-10-26, S006) — Cousin's sunburst (Bà Thương's family) + v1 edit pop-up as its template (in progress)

- Hanh: "I want to work on the edit pop up from V1. I want to use this as a template to add people to a new sunburst. I
  want to create a new blank sunburst html that my cousin will be populating."
- Whose tree (Hanh): "the one that includes my Grandpa (Hai) 2nd wife (Thuong/Tuong)" — Bà Thương's family from her
  first marriage (Entry 98). Once created, **link it to Ông Hai's sunburst via Bà Thương**.
- Answers (tappable): starts **completely blank** (Entry 98's 17 catalogued people are NOT pre-filled); centre =
  **Thương's parents** (Bà Thương sits in ring 1 as their child — the link point); saving = **live (Supabase)**;
  approval = **the cousin edits freely; Hanh is alerted, can update/edit and confirm** (differs from Entry 75's
  pending-until-approved rule, for this sunburst); alert = **a review list on the site** (badge + list of unconfirmed
  entries when Hanh signs in as admin).
- Reminder: this workspace can't reach supabase.co (Entry 75) — live saving is tested in Hanh's browser unless the
  domain is allowed.
- **Edit pop-up (from v1, Entries 12/17/29/65) — locked tweaks:**
  - Fields as v1: First / Middle / Last / Nickname, Has passed, ♂/♀ (edited person); new relative: Spouse / Brother /
    Sister / Son / Daughter, ordered list, draggable new row, same name fields + Has passed ("Spouse is ♂/♀" for a spouse).
  - Birth year and Death year were previewed, then **removed** (Hanh).
  - **Required fields highlighted in yellow #F0BC4F:** First name (label bold yellow, box outlined yellow — stays
    yellow while typing) and the ♂/♀ chips (yellow pill outline; for a new person only when adding a Spouse, since
    Son/Daughter/Brother/Sister set it).
  - **Note at the bottom left, beside Cancel / Save:** small yellow box + "Yellow items are required".
- Previews: `mockups/cousin-editor/` (v1-editor-*, year-*, death-*, req-*, note-*, v2-editor-*).
- **Restyled to v2 — locked** (Hanh: "Restyle to v2" → "Lock it"): Trancestry colours (#161616 page, #1e1e1e panel,
  cream #f1ece4 text, gold #D9A521), Segoe UI; the edited person's **square avatar** beside their name in the title;
  ♂/♀ chips become **Male / Female buttons showing that couple's avatar pair** (picked one gold-edged); relation chips
  Spouse · Brother · Sister · Son · Daughter fill gold with black text when picked; the ordered list rows look like the
  Simple-view cards (avatar + title chip e.g. Con / Vợ + name, "& spouse" muted); the new row keeps the dashed gold
  border, shows the avatar for its gender ("?" for a spouse until Male/Female is picked); Save is a gold pill, Cancel
  outlined; yellow #F0BC4F required marks + "Yellow items are required" note as above. **Phones:** two-column fields,
  the note + Cancel / Save **pinned to the bottom** of the pop-up while the form scrolls. Mock:
  `v2/mockups/editor-v2-mock.html` (`?rel=spouse` for the spouse state).
- **Name suggestions — locked** (Hanh: "show the suggested name with proper vietnamese accent. It doesn't have to be
  chosen" → source **a common Vietnamese name list** → "apply this for all name fields … the english translation in
  parenthesis if available"): under **First, Middle, Last and Nickname**, as you type, up to 6 chips under the
  heading "Suggestions" — matched like search (accents ignored, đ = d, from the start of the name, exact match first),
  e.g. "huong" → **Hương (fragrance)**, **Hường (rose, pink)**. Tapping fills in the name only; ignoring them keeps
  what was typed. Given-name list (First / Middle / Nickname) and a family-name list (Last, no meanings), both in
  **`data/vn_names.txt`** (written by Claude — 229 given names, 7 without a meaning; 60 family names) — sent to Hanh for
  review; changes go into that file only.
- **Minh's page — decisions** (Minh = the cousin): own link **/FamilyTree/minh/**; **full Trancestry v2 + editor**
  (splash, sunburst, Options pane, search, Side / Top / Simple, morph, drops) on its own tree; **a pencil on every
  card** in Simple, Side and Top views opens the pop-up; editing needs a **code, asked once per device** (code given to
  Hanh in chat — never stored in the repo; Supabase keeps only a hash and checks it server-side).
- **The Bà Thương link:** when Minh adds a person named Thương, the page **offers to link her** to Bà Thương in Ông Hai's
  tree; on yes it adds **Ông Hai (as her husband), their 5 children's families (27 people: Văn & Trung 11, Chương & Kỳ 4,
  Dương 1, Hùng & Kim Ánh 5, Thanh & Thái 6) and the catalogued Tường & Kỳ branch (17, Entry 98)** — 45 people, as
  **shared records** (one record; an edit in either tree is the same person — Hanh still confirms). Bà Thương's two
  husbands are laid out **mirroring Entry 106**: 1st husband | Bà Thương | Ông Hai, each husband's children with him.
- **Step 1 built — Minh's page with the editor, saving in this browser** (Hanh: "Start step 1"):
  - `tools/build_minh.py` builds **`minh/index.html`** from **v2's own template** with a short list of exact patches
    (each must match or the build stops), so v2 fixes carry over. New sources in `minh/src/`: `kin.js` (v1's kinship
    rules computed in the page — checked against `v2/src/kin.json` on Ông Hai's tree: **45,369 / 45,369 titles match**),
    `store.js` (Minh's tree; starts with Thương's parents, unnamed — shown "??", the sheet's own mark), `editor.html` /
    `editor.js` (the locked pop-up). Shared files (d3, flubber, avatars) load from `v2/`.
  - v1's yellow pencil (red eraser) at the right end of **every card in Simple, Side and Top**; cards widen 30 to fit it.
  - While the wheel is empty, a tap opens the Simple view ("Tap to start adding the family").
  - Save stores the tree and **reloads straight back into the same view and focal** (no splash, no drop); avatar sets
    and drop-once-per-visit are kept across that reload (same visit).
  - Not yet: Minh's code (comes with Supabase, step 2 — the check must run on the server), live saving, the Bà Thương
    link (step 3), Hanh's review list (step 4).
  - Tested on 1440×900 and S25 Ultra (`tools/tests/minh_test.js`): name the parents, add a daughter via the "thuong" →
    Thương suggestion, add a son, Side / Top / wheel — no errors; stored tree correct. Previews `minh/mockups/`.
- **Names list grows** (Hanh: "add to the names list all the names that is currently present in my Ong Co's tree. Add Huong
  (to benefit) and Thuong (to award) etc"): `data/vn_names.txt` gains **87 names from Ông Cố's tree** (every first name
  and nickname in data/tree.json, Ông/Bà/Soeur prefixes dropped, "??"/"TBD" left out; English names without a meaning;
  a few meanings added: Ba three, Hai two, Bảy seven …) and **other tones**: Hưởng (to benefit, enjoy), Thưởng (to award),
  Thượng (high, supreme), Hướng (direction), Tưởng (to think, imagine). Now 321 given names.
- **Angel wings on the cards** (Hanh: "in the side/top/simple view, add the angel wings for those who have passed"): v1's
  marigold wings (`assets/wings_marigold.png`, 48 × 24 at the card's 100 % size) at the right end of the card of everyone
  who has passed — **Side, Top and Simple, in v2 (Ông Hai's tree) and on Minh's page** (there just left of the pencil).
  Cards widen to fit. `tools/build_v2.py` now carries who has passed (`x`) into the page; Minh's "Has passed" tick feeds it.
- **Bà Thương has passed** (Hanh: "Ba Thuong/Tuong has passed. Update this and push"): new Hanh-confirmed fix in
  `data/structure.json` — op **`deceased`** (box N262, person N264, false → true, Entry 126; `tools/parse_tree.py` knows the
  new op), applied to `data/tree.json` (one line: N264 `deceased` true — the spreadsheet is retired, Entry 12); v2 rebuilt —
  she now has wings (preview `v2/mockups/thuong-wings.png`). **Pushed** (v2 wings + /FamilyTree/minh/ step 1).

## Entry 127 (2026-10-26, S006) — Clear focal keeps the family on screen

- Hanh: "on the clear focal chip - just remove the title. Don't revert back to the Ong Co Ba Co. This is happening in the
  simple view. If this also happen in the side/top view - fix it to just remove the title chip." It did (Entry 108's
  no-focal → Ông Cố & Bà Cố rule).
- Now, in **Simple, Side and Top**, Clear focal **only removes the title chips** (and the header's "Focused on"); the same
  family stays on screen (the page remembers it as the view's anchor; Back / Forward keep it). From the wheel, or after
  "Whole wheel", no focal still means Ông Cố & Bà Cố. The generation names along the views follow the family on screen
  (e.g. "Đời Ba Má" over Lịch & Hai, not "Con"). Same in v2 and on Minh's page.
- Tested on 1440×900 and S25 Ultra, Hậu as focal in each view: chips 6 / 13 / 13 → 0, Hậu's family kept; no errors.
  Previews `v2/mockups/clear-*.png`. **Locked and pushed** (Hanh: "Lock + push").

## Entry 128 (2026-10-26) — Stop protocol (S006)

Hanh: "stop protocol." Session S006 (Entries 126–127) covered:
- Minh's page (/FamilyTree/minh/, Bà Thương's family for Hanh's cousin Minh): decisions locked; v1's edit pop-up
  restyled to v2 with required fields, the note and name suggestions (`data/vn_names.txt`); step 1 built and pushed
  (v2 engine via `tools/build_minh.py`, in-page titles, pencils, browser-only saving).
- v2: angel wings in Side / Top / Simple; Clear focal keeps the family; Bà Thương marked as passed.
- Docs updated: README Current State + resume prompt + file map, ROADMAP status table, SKILL (Minh's page + v2 additions).
- Pushed through Entry 127 (commit 8e7f720). This stop's doc commit is local until Hanh says "push". Docs mirrored to the Project.
- Snapshot zip: `S006_2026-10-26_FamilyTree.zip`.

## Entry 129 (2026-10-26, S006) — Tree name "Hạnh's Paternal Grandpa" + TREES list in the Options pane

- Hanh: "name the current tree - Hạnh's Paternal Grandpa" → shown **under Trancestry in the header** (in place of "Our
  Family Tree") **and in the browser tab** ("Trancestry · Hạnh's Paternal Grandpa"); then: "in the navigational panel; add
  Hạnh's Paternal Grandpa as a link. We will keep all the different trees here."
- **Locked:** new `data/trees.json` holds each tree's name and link (Ông Cố & Bà Cố's tree = **Hạnh's Paternal Grandpa**,
  `../v2/`). The Options pane ends with a **TREES** section: one link per tree, the open one marked gold ("Open now"),
  others "Open this tree". Built by `tools/build_v2.py` / `tools/build_minh.py` from that file. Minh's tree is unnamed, so
  its page keeps "Our Family Tree" and isn't listed yet. Previews `v2/mockups/name-*.png`, `v2/mockups/trees-*.png`. Pushed.

## Entry 130 (2026-10-27, S007) — Minh's page: the Bà Thương link offer (design locked, built in step 3)

- Hanh: "show me on an inline when Minh adds Thuong. How will the suggest link show? Also, will I be able to see his tree?"
- Mocked on the real page with the real data (`tools/tests/link_mock.js`; previews `minh/mockups/link-*.png`) → **Lock it**:
  - **When:** right after Save, if the new or edited person's first name folds to **Thương or Tường** (accents ignored).
  - **Offer:** gold-topped dialog "🔗 Already in another tree — Is this Bà Thương from Hạnh's Paternal Grandpa?", her card
    from that tree (Thương (Tường), "vợ của Hai · mẹ của …", wings), the **45 people** who come with her (Ông Hai; Văn &
    Trung 11, Chương & Kỳ 4, Dương 1, Hùng & Kim Ánh 5, Thanh & Thái 6; Tường & Kỳ's family 17), and "These people are
    shared: one record in both trees. A change you make shows in Hạnh's tree too, once Hạnh confirms it."
    Buttons **No, a different Thương** / **Yes, link her** (gold).
  - **Yes:** Minh's card becomes the shared record (same cell IDs as Hạnh's tree); her **first husband appears as "??"**
    (Tường's father) until Minh names him; layout mirrors Entry 106 (1st husband | Bà Thương | Ông Hai). **No:** she stays
    as typed and that card isn't asked again.
- Seeing Minh's tree: not in step 1 (his browser only). From step 2 (Supabase) /FamilyTree/minh/ shows his tree live to
  anyone, Hanh included; step 4 adds Hanh's review list; once named it can join the TREES list.

## Entry 131 (2026-10-27, S007) — Minh can start more trees (option A)

- Hanh: "he will have at least two trees that he will create, how would the /minh enable him to do that" → options shown
  (A one page / many trees · B a page per tree · C one big tree) → **A**, plus: "i want to standardize the name of the link
  - can that be done afterwards?" → **yes**.
- **Locked for step 2:** /FamilyTree/minh/ holds **many trees**, each opened by its own link (`?tree=<link name>`). The
  pane's TREES list shows every tree; code holders also get **＋ Start a new tree** (asks the tree's name and who is in the
  centre — a couple or one person — then opens blank). Supabase stores each tree under a **permanent hidden ID**; the
  **link name is a separate, renameable label**, and old link names are kept so shared links still open the right tree.
  The /minh/ folder itself can be renamed later with a redirect left behind. The naming standard is Hanh's to set later.
- The first tree stays Thương's parents (blank start, Entry 126).

## Entry 132 (2026-10-27, S007) — Minh's page step 2: the Supabase setup (supabase/02_minh.sql)

- Hanh: "okay, lets continue on with /minh. What's next" → step 2, live saving.
- **`supabase/02_minh.sql`** (run once in the SQL Editor; safe to re-run): tables **editors** (name + bcrypt hash of the
  code — the code itself is never in the repo), **trees** (permanent hidden id, renameable `link` + `old_links`, `name`,
  `editor`, `doc` = the tree's shape, `version`), **people** (one record per person, shared by any tree), **changes** (every
  add / edit / shape change / new tree, before → after, `confirmed_at` for Hanh's review list), **code_failures** (30 wrong
  codes in 10 minutes → everyone waits). The public key can only **read** trees and people; all writes go through
  `check_code`, `save_tree` (refuses a stale version instead of overwriting) and `create_tree`, which check the code
  inside Supabase. Seeds Minh's first tree: link `thuong`, Thương's parents unnamed (`minh-p1`, `minh-p2`).
- Tested on a local Postgres 16 set up like Supabase (anon role, extensions schema): runs twice cleanly; as anon — reads
  OK, direct writes refused, editors hidden; wrong code refused; right code works lowercase / with spaces; save → version
  2 and changes logged (edit, add, shape); stale save refused ("changed"); create_tree works, duplicate link refused.

## Entry 133 (2026-10-27, S007) — Minh's page connected to Supabase (step 2 built)

- Setup walkthrough done by Hanh: `02_minh.sql` run (thuong | 1), Minh's code added (thuong | has_editor true), publishable
  key confirmed from the **Family Tree** project (quqgwvwijvwshdpwvkrk; public by design, now in the page).
- **Built:** `minh/src/store.js` loads the tree named by `?tree=<link>` (default `thuong`, old link names too) and the
  list of trees from Supabase, then starts the v2 engine (kept in a `text/hft-engine` block until the data is in).
  **Pencil → "Enter your edit code"** (yellow required field; "You only need to do this once on this device"); Supabase
  checks it; it's remembered on that device only after Supabase says yes. **Save → `save_tree`** (whole tree; Supabase logs
  each difference) → reload into the same view. Wrong / changed code → asked again. **Someone else saved first →** "Someone
  else saved this tree a moment ago. Reloading the latest — then make your change again." (back into the same view).
  **Can't reach the database →** a gold notice, the last copy saved on this device, editing off.
  Tree name (if set) under Trancestry and in the tab. **TREES list** gains every tree in Supabase ("Unnamed tree" until
  named) and, for code holders, **＋ Start a new tree** → name (required), link name (made from the name, accents dropped,
  editable), centre: A couple / One man / One woman → opens blank at `?tree=<link>`.
- Tested end to end on 1440×900 and S25 Ultra against a local copy of the database (same SQL, anon role; the page's
  Supabase calls answered locally — `tools/tests/minh_live.js`): wrong code refused, right code opens the editor, save →
  version 2 + changes logged (edit, add, shape), code remembered, stale save refused + message, new tree "Cây Thử Nghiệm"
  → `?tree=cay-thu-nghiem` with its name in header and tab, offline notice — no page errors. Previews `minh/mockups/live/`.
- **Pushed** (Hanh: "Push") for a real test in Hanh's browser.
- **Live test passed (Hanh, 2026-10-27):** on the real site and database — the code unlocked editing, "＋ Start a new tree"
  made "This is a Test" (`?tree=this-is-a-test`, name in header + tab), people added on the computer showed up on Hanh's
  phone. The test tree and its change log were then deleted in the SQL Editor (its few person records stay, unused).
  **Step 2 done.**

## Entry 134 (2026-10-27, S007) — Edit codes made from a name + Hanh's secret phrase

- Hanh: "write me an algorithm to generate the 6 character passcode. I will be using their full name … i.e. minhtran. The
  next person I want to give this to is baonguyen." Sparred: a code from the name alone could be worked out by anyone who
  knows the rule (public repo) → Hanh chose **name + my secret phrase**.
- **Recipe (locked):** name → lowercase, accents removed, đ → d, letters and digits only (Bảo Nguyễn → `baonguyen`);
  HMAC-SHA256 keyed with Hanh's phrase of `trancestry-code-v1|<name>`; the result as one number in base 31 over
  `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (no 0/O, 1/I/L), first 6 characters. Same name + phrase → same code, every time.
  The phrase is never stored anywhere.
- Tools: **`tools/code-maker.html`** (also published as Hanh's private "Trancestry Code Maker" page — name + phrase → the
  code and the SQL to run: a new person, or changing someone's code) and `tools/make_code.py` (same recipe; cross-checked
  on 3 names with a test phrase — identical).
- Hanh: switch Minh too → Minh's code moves to the recipe (`minhtran`); his editors row is renamed **Minh → Minh Tran** with the
  new hash (SQL given in chat, code not recorded). RQREE5 stops working; devices that remembered it ask again on the next save.
  Next person: **Bảo Nguyễn** (`baonguyen`) — added with the Code Maker's "A new person" SQL; starts his own tree with
  "＋ Start a new tree" (he lands on Minh's tree first — a neutral start page can come with the link-name standard).
- Hanh: "is there a way I can save my personal code, so that I don't have to enter it everytime?" → Code Maker gains
  **"Remember my phrase on this device"**: the phrase becomes a sealed (non-extractable) WebCrypto key kept in that
  browser's IndexedDB for the page only — it makes codes but can't be read back; once per device; **Forget it** removes it.
  Then just type a name. Tested: remembered across a reload (minhtran / baonguyen give the same codes as before), Forget works.
- Hanh: Code Maker as a link in the navigation pane? → **admin-only pane link** (shown only when Hanh is signed in as
  admin) — built with step 4 (admin sign-in + review list). Not on the public pane.

## Entry 135 (2026-10-27, S007) — Step 3 built: the Bà Thương link offer (Entry 130's design)

- Hanh: "Step 3 · Bà Thương link". **Built:** `tools/build_minh.py` packs Bà Thương's branch from Hạnh's Paternal Grandpa
  (data/tree.json, uncut — includes the catalogued Tường branch) into Minh's page: 46 shared records with ids `hp:<cell>`
  (other characters in a cell written `_<hex>`, e.g. `+E64-1` → `hp:_2bE64-1`, to pass the database's id check), Ông Hai's box,
  her 6 children's families with their mothers. Asserted: 46 people, 44 under her.
- **When:** on Save, if the edited or new person is first in their box, named Thương / Tường (accents ignored), not marked
  "different", and the tree doesn't have her yet → the offer (Entry 130's wording, filled from the data) **before** saving.
  **Yes, link her:** that card becomes `hp:N264`; her box = [her, first husband "??" (new, Male), Ông Hai, any spouses Minh
  had added]; children = her 6 families (Tường & Kỳ under the first husband, the rest under Ông Hai) then any children Minh
  had added; one save. **No, a different Thương:** card kept as typed, marked `nolink`, never asked again.
- Save errors now say "the family database refused it (…)" instead of "can't reach" when Supabase answers with an error.
- Tested on 1440×900 and S25 Ultra against the local database copy (`tools/tests/minh_link_live.js`): offer shows with
  "45 people"; Yes → version 3, 49 people in the tree (2 parents + 46 shared + the ?? husband), box
  [hp:N264, ??, hp:N262], changes logged (47 adds, 2 edits, 1 shape); no second offer after linking; on another tree "Tường"
  → offer → No → kept as typed with `nolink`, not asked again; no page errors. Previews `minh/mockups/live/link-*.png`.
- **Pushed** (Hanh: "Push").
- Not yet: Hạnh's Paternal Grandpa (v2) still reads data/tree.json — Minh's edits to the shared people reach it when Hanh
  confirms them (step 4 review list → committed to tree.json).

## Entry 136 (2026-10-27, S007) — Tree renamed "Hạnh's Paternal Grandpa & Siblings"

- Hanh: "change: Hạnh's Paternal Grandpa to Hạnh's Paternal Grandpa & Siblings" → `data/trees.json` (header under
  Trancestry, browser tab, TREES list on both pages). Minh's link offer now takes the tree's name from that file too
  ("Is this Bà Thương from Hạnh's Paternal Grandpa & Siblings?"). The shared records' `src` note now names the sheet
  (`H.HN.T Paternal Tree!<cell>`) so a rename never touches them. Previews `v2/mockups/name-*.png`, `trees-*.png`.
- Hanh: "make sure the Ba Thuong link offer is updated with this new name" → verified on the rebuilt page ("Is this Bà Thương from Hạnh's Paternal Grandpa & Siblings?"). **Locked and pushed.**

## Entry 137 (2026-10-27, S007) — Step 4 built: Hanh's review list + admin-only Code Maker link

- Hanh: "Admin code" for sign-in (asked once per device, checked by Supabase). Undo dropped — Entry 126 asked for
  "update/edit and confirm".
- **`supabase/03_review.sql`** (after 02; safe to re-run): `editors.is_admin`; `check_code` also says admin; `save_tree` lets
  an admin save any tree and **confirms an admin's own changes straight away**; `review_list` (admin only: unconfirmed
  changes, newest first, with editor name + tree) and `confirm_changes` (admin only). Tested locally as anon: Minh's code
  can't list or confirm; admin sees all, saves Minh's tree, confirms.
- **Page:** an admin code entered at any pencil turns on an **ADMIN** section at the end of the Options pane: **Review
  changes** with a gold count of saves waiting, and **Code Maker** (opens Hanh's private page). Not shown to anyone else.
  **Review changes:** grouped by tree, one card per save ("Minh saved 5 min ago" + date/time), lines **Changed** (each
  field before → after, old value struck through), **Added** (name · full name · Male/Female · has passed), **New tree**,
  **Moved** (only when a save changed who-belongs-where without adds/edits); people also in Hạnh's tree get "also in
  Hạnh's tree"; the Bà Thương link shows as one **🔗 Linked** line ("46 shared people added with her …"); saves with many
  lines fold after 6 ("＋ N more"). Each line **Edit** (opens that person's editor; on another tree via `?tree=…&edit=…`);
  each save **Confirm**; **Confirm all**; **Done**.
- Tested end to end on 1440×900 and S25 Ultra (`tools/tests/minh_review_live.js`): Minh's device makes 2 saves (name;
  daughter Thương → link Yes); Minh sees no admin items; Hanh's device: admin code → ADMIN items, badge 2, list shows the
  link line + "Test Mẹ" change + the ?? husband, and the "Test Cha" save; Edit opens Test Cha's editor; Confirm → badge 1,
  database 1 unconfirmed; no page errors. Previews `minh/mockups/live/review-*.png`.
- **Locked and pushed** (Hanh: "Lock + push"). Hanh to run `supabase/03_review.sql` and add his admin code (Code Maker, name "Hanh Tran", then `is_admin = true`).
- Added **Switch edit code** to the pane for code holders ("Now: <name>") — forgets the code on this device and asks for another (so Hanh can swap a remembered test code for his admin code). Tested: Minh's code → no admin items → Switch → admin code → ADMIN items. Pushed.
- **Live (Hanh, 2026-10-27):** 03_review.sql run (ready | 0); admin record added via the Code Maker — stored as name
  **hanhtran** (typed without a space), marked `is_admin = true` with a follow-up update; on the site Switch edit code →
  admin code → ADMIN section shows. **Step 4 done.** Still to do: Minh's code switch (Entry 134 — his row is still
  "Minh" with the random code).
- **Minh switched to the recipe (2026-10-27):** a new `minhtran` row (Code Maker "A new person"), then his tree and any
  past changes moved from `Minh` to `minhtran` and the old `Minh` row deleted. Editors now: **hanhtran** (admin, 0 trees),
  **minhtran** (1 tree: thuong). Old code RQREE5 no longer works. Next person: Bảo Nguyễn (`baonguyen`).

## Entry 138 — /minh: rename a tree (2026-10-27)
- Hanh: "how does minh change his tree's name" → it couldn't be changed (a name is only set by "＋ Start a new tree";
  Minh's seeded `thuong` tree has none — the menu shows "Unnamed tree", the header "Our Family Tree"). Choice: **Minh
  renames it himself**, each rename on Hanh's review list.
- **Menu:** code holders get **Rename this tree** ("Now: <name>") above "＋ Start a new tree". The box ("✎ Tree name ·
  Rename this tree"): one yellow required field (Tree name, ≤ 60), Cancel / **Save name**. Saving updates the header,
  the tab title and the TREES list at once; no reload. The link name (`?tree=…`) does **not** change (standardizing
  links stays a later item, Entry 131).
- **Supabase:** `supabase/04_rename.sql` → `rename_tree(p_code, p_link, p_name)`: code checked; only the tree's editor
  or an admin; empty / > 60 refused; logs a change `kind 'rename'` (before/after name), auto-confirmed for an admin.
- **Review list:** a **Renamed** line ("Tree name: ~~old~~ → new").
- Tested on 1440×900 and S25 Ultra against the local database (`tools/tests/minh_rename_live.js`): Minh's code renames
  (header, tab, database); empty name → "Give the tree a name"; another editor's code → "Only the person who started
  this tree can rename it" (database unchanged); admin review list shows the Renamed line; no page errors. Previews
  `minh/mockups/live/ren*.png`. **Locked and pushed** (Hanh: "Lock + push"). Hanh to run `04_rename.sql`.
- **Live (Hanh, 2026-10-27):** `04_rename.sql` run → "ready | Unnamed tree". Minh can now rename `thuong` from the menu.

## Entry 139 (2026-10-27) — v2 goes live at the main link
- Hanh: "move the v2 version to https://hellohanh.github.io/FamilyTree/".
- `tools/build_v2.py` now writes the root **`index.html`** (was `v2/index.html`), rewriting paths: d3 / flubber /
  avatars → `v2/…` (they stay there; Minh's page uses them too), `../assets/` → `assets/`, `../fonts/` → `fonts/`.
  **`v2/index.html`** is now a small redirect to the main link (keeps `?…` and `#…`), so old /v2/ links keep working.
- `data/trees.json` "url" is now from the site root (`./`); the TREES links are built per page (root `./`, /minh/ `../`).
- v1's root `index.html` was identical to `archive/v1-2026-10-26/index.html` — v1 stays there, unchanged.
- Tested on 1440×900 and S25 Ultra (`tools/tests/golive.js`): splash, wheel, Simple view (avatars, wings), fonts, pane
  — no failed requests, no page errors; `/v2/?x=1#h` → `/?x=1#h`; /minh's TREES link → main link. Previews
  `v2/mockups/golive*.png`. **Locked and pushed** (Hanh: "Lock + push").

## Entry 140 (2026-10-27) — Stop protocol (S007)

Hanh: "stop protocol." Session S007 (Entries 129–139) covered:
- v2: tree name "Hạnh's Paternal Grandpa & Siblings" + TREES list (Entries 129, 136); **v2 live at the main link**,
  v1 archived, /v2/ redirects (Entry 139).
- Minh's page: link offer design (130), more trees (131), Supabase setup + live saving (132–133), Code Maker recipe
  codes (134), Bà Thương link built (135), Hanh's review list + admin (137), rename a tree (138). Live in Supabase:
  02/03/04 SQL run; editors hanhtran (admin) and minhtran (tree `thuong`). Minh's message drafted (EN + VI, [CODE] placeholder).
- Docs updated: README Current State + next-session number, ROADMAP status rows, SKILL snapshot + Minh's page rules
  (codes, admin / review, new trees, rename).
- Pushed through Entry 139 (commit 729ecb1). This stop's doc commit is local until Hanh says "push". Docs mirrored to the Project.
- Snapshot zip: `S007_2026-10-27_FamilyTree.zip`.

## Entry 141 (2026-10-27) — Whole wheel: names 9 px in every ring on computers
- Hanh compared v1 (`sunburst-focus.html`: every name 6.5 px on screen at 1440×900) with v2 (12 px inner → 10 px outer)
  and chose: "make the v2 font size 9px to keep everything consistent from inner to outer ring" (computers).
- `FSD=11.15` (wheel units) → **9.0 px on screen at 1440×900 in every ring** on the whole wheel when the window is wider
  than 820 px; names in very thin slices still shrink to fit; zoom still scales text with the wheel. Phones and the
  snapped two-ring view unchanged. Minh's page inherits it. Measured: 143 names at 9.0 px, 51 shrunk to fit. **Locked.**

## Entry 142 (2026-10-27) — Snapped view: names grow with a computer's screen
- Hanh (screenshot, 2000-wide window): "the font size looks small when snapped" — the snapped wedges grow with the
  screen but names were fixed at 17 px (Entry 84). Previews 17 / 21 / 24 px at 2000 wide; Hanh chose **grow with the screen**.
- `SFS()`: computers (> 820 px) 17 × (window width ÷ 1440), never below 17, capped at 30; phones 17 px (unchanged).
  Title chips follow the name size; thin wedges still shrink to fit. Minh's page inherits it.
- Measured: 2000 wide → 24 px; 1440 → 17 px; S25 Ultra → 17 px; no page errors. **Locked and pushed** (Hanh: "Lock + push").

## Entry 143 (2026-10-27) — Picture page (/photo/): design in progress
- Hanh: "lets work on the link to update pictures… same search parameters so that they can pick the right person".
- Decided so far: **one family code** (printed under the QR, asked once per phone, remembered in that browser);
  pictures show **right away, marked Pending** (Reject brings the drawing back); search covers **every tree**, each
  result tagged with its tree's name; **Review changes on the main page too** (admin code); **sender's name required**
  (remembered on that phone).
- Open: the fit-the-face guide — translucent face oval + neck line over the square crop, tuned by Hanh with sliders in
  `photo/mockups/fitface.html` (reference: set 6 brown-and-checkered-scarf avatar). Mockups in `photo/mockups/`.
- **Fit-the-face guide locked** (Hanh tuned it with the rails, `photo/mockups/fitface.html`): over the square crop, a
  translucent **face oval 60% wide × 75% tall, centred 43% from the top**, with **38% shade outside** it, and a dashed
  **neck line 92% from the top, 90% wide, curve 12** (both guides white dashed). Line: "Line up the face with the
  oval and the shoulders with the curve · drag to move, pinch to zoom". Preview `photo/mockups/flow3_fit.png`.
- **Built (steps 1–3), tested against the local database on 1440×900 and S25 Ultra:**
  - `supabase/05_photos.sql`: `photo_settings` (family code bcrypt hash only), `photos` (person, tree, who, sender, img as a
    512 px data URL, status pending/ok/rejected; public sees pending + ok), `check_family_code`, `send_photo` (family
    code, name required, size ≤ 250 KB, 120/hour cap), admin `photo_review` (with the picture it replaces) and `photo_decide`.
  - `/photo/` (`photo/src/index.template.html` → `tools/build_photo.py`): family code once per phone → search (Hạnh's
    tree built in + every Supabase tree, tree-name tags, dedupe of shared people) → person → photo → fit the face (locked
    guide; drag, pinch, wheel, zoom rail; live card preview) → "Your name" (required, remembered on the phone, no helper
    line — Hanh) → Send → "Picture sent". Bottom note: "The picture shows on the card right away, marked Pending." (Hanh).
  - Cards: main page + Minh's page show the newest not-rejected picture in place of the drawing (wheel centre, Simple,
    Side, Top) with a dark **Pending** band until confirmed. Person ids: `hp:<cell>` on the main page, own ids on /minh.
  - Review changes now has a **Pictures** group (before → after, Reject / Confirm; Confirm all includes pictures) on
    Minh's page and on the **main page** (Admin section shows on a device holding Hanh's admin code — shared with /minh;
    sign in on the main page with `?admin`; non-admin codes refused there). Review code moved to `minh/src/review.js`,
    dialogs to `dialogs.html` / `review.html` (shared by both builds).
  - Printable QR card `photo/qr.html` (4 cards; QR → hellohanh.github.io/FamilyTree/photo/; family code typed in before
    printing, never stored).
  - Tests: `photo_live.js`, `photo_cards_live.js`, `photo_review_live.js` + Minh regressions (rename, review) pass.
- **Live setup (Hanh, 2026-10-27):** pushed (fb8a2db); `05_photos.sql` run in two parts (the first paste was cut off
  mid-function) → "ready | 0 | 0"; family code made with the Code Maker (name "family") and stored as a bcrypt hash
  in `photo_settings` → "family code set | 1". The code itself is not recorded anywhere in the repo.
- **Live test (Hanh):** sent a picture from his phone — it showed on the card marked Pending ("it worked"). Remove =
  Reject while Pending (no remove after Confirm yet — offered). A single QR card PNG with the family code was made for
  the family group, plus a private reference HTML with a download button — both kept out of the repo (they show the
  code). Hanh agreed not to put the QR picture in the public pane. **Locked and pushed** (Hanh: "lock and push").

## Entry 144 (2026-10-27) — "Suggest an update" on the main page (building) + items catalogued for later
- **Catalogued for later (Hanh, verbatim intent):**
  1. Linked trees: will the relative titles show across all linked trees?
  2. Godparents: up to three checkboxes in the edit panel; each checked box gets a name field with the same search
     across all trees. The three are **Baptism, Confirmation and Other** (Hanh).
  3. Suggest how to show the order of siblings in the sunburst.
  4. An "Adopted" checkbox for children.
  5. Titles: show **Mự/Mợ** with a slash — they mean the same thing; Hanh's family used the regional Mự growing up.
- **Decided (tappable answers):** "Suggest an update" item in the left pane → search first (same search) → pick →
  the locked edit pop-up (Hanh: "I want an edit link on the left navigational pane… the first thing they see is a
  search bar"); **same family code** (asked once per phone, shared with /photo/) + **Your name** (required, shared);
  updates show **right away, marked Pending** (new people: dashed outline + Pending tag; changes: Pending tag);
  **Reject undoes**; confirmed updates **apply live**, and Claude folds them into tree.json + lists them for the
  spreadsheet when Hanh asks.
- **Built:** the main page now runs the editor build (`tools/build_minh.py` mode `main`, called by `build_v2.py`):
  `store_main.js` (Hạnh's tree built in, Ông/Bà kept as a title, + `updates` applied in order; save = ops vs the tree
  as loaded), `main_extra.js/.html` (no pencils; Suggest an update + search; family code + name box; `?admin`
  sign-in; Pending tags/outline), `review.js` (Updates group with Changed/Added lines, Reject/Confirm, page redraws
  after decisions). `supabase/06_updates.sql`: `updates` table (ops jsonb), `send_update` (family code, name, ≤ 20 ops),
  admin `update_review` / `update_decide`. `editor.js` split into core / `link.js` / `minh_pane.js`;
  `admin_main.js` retired. Engine template: `RPAD` + `PENDTAG` hooks.
- **Checked:** main page tree identical to the old static page and all 38,416 title pairs equal `kin.json`; tests
  `update_live.js` (phone + desktop) + picture and Minh regressions pass, no page errors.
  **Locked and pushed** (Hanh: "Lock + push"). Hanh to run `06_updates.sql`.
- **Live (Hanh, 2026-10-27):** `06_updates.sql` run in two parts → "part 1 done", "ready | 0". Suggest an update is live.
- **Live test (Hanh):** "everything works." Pushed.

## Entry 145 (2026-10-27) — To-do list, one by one: Mự/Mợ with a slash
- Hanh: "Mự/Mợ shown with a slash" (catalogued Entry 144: they mean the same; the family grew up saying Mự).
- `titleOf` shows every title ending in "Mợ" as "Mự/Mợ" ("Bà Mợ" → "Bà Mự/Mợ") — display only; kin data unchanged;
  main page and Minh's page, all views (wheel chips, Simple, Side / Top, editor rows). Preview: focused on Liên,
  her Cậu Hai's wives Lịch and Hải show "Mự/Mợ". **Locked and pushed** (Hanh: "Lock + push").

## Entry 146 (2026-10-27) — Sibling order in the sunburst: red birth-order badges
- Previews: numbered dots (A) vs an order arrow (B). Hanh: "a small red badge with a number, on the upper left of each
  segment. On full sunburst, show it only on the inner most ring (grandpa and siblings…). For the snap, show these
  badges for the two inner most rings only." Then: snapped = **the two rings on screen**; "a red badge only, no
  borders, the number should be bolded"; full sunburst "on the upper right of the segment too"; snapped badges "on
  the upper right"; "the badge number should follow the same orientation of the name in the corresponding segment".
- **Locked:** a plain red (#d1452b) circle with a bold white number (1 = oldest) at the **upper-right of each child's
  segment** (outer end, first edge), the number turned like that segment's name. Whole wheel: only the innermost
  ring (Ông Cố & Bà Cố's children, 1–5); snapped: both rings shown. Children only (no badge for spouses or an only
  child). Snapped names in thin segments keep clear of the badge. Main page + Minh's page. Previews
  `v2/mockups/sibR_*.png`. **Locked and pushed** (Hanh: "Lock + push").

## Entry 147 (2026-10-27) — Titles across linked trees: on the back burner
- Today: each tree computes titles among its own people (v1 rules: blood relatives + their spouses, one family line);
  shared people (Ông Hai, his and Bà Thương's children, Tường's family) get titles in both trees; people only in the
  other tree have none.
- Hanh wants **"pick a focus from any tree"** (e.g. on Minh's page, view as Hạnh). The v1 rules give no title for
  cross-line in-laws (e.g. Hạnh → Bà Thương's brother) — not to be invented. Hanh chose **define the titles together,
  case by case** — **parked until Minh's tree has real people** ("that way we are working with real life examples").

- **Catalogued (Hanh, 2026-10-27):** an "Add a picture" link in the left pane (opens /photo/; the family code is still asked).
- **Catalogued (Hanh):** an "Edit tree" link (family code still asked) — to check how it differs from the existing "Suggest an update" pane item.

## Entry 148 (2026-10-27) — Adopted checkbox · Edit Tree + Add a picture in the pane
- **Adopted** (Hanh, tappable answers): checkbox beside "Has passed" — **children only** (blood members with parents,
  and a new son / daughter / brother / sister; never someone who married in). Shown in the **title**: parents see
  **Con Nuôi**, grandparents **Cháu Nuôi**; siblings and everyone else unchanged. Hanh: "formal capitalization on all
  title site wide" → `titleOf` capitalises every word of every title. Stored as `adopted` on the person (main-page
  updates: an `edit` / `child` op field; review lines show "Adopted"). A new adopted child's chip reads "Con Nuôi".
- **Pane** (Hanh): "Suggest an update" renamed **Edit Tree** (pane item + dialogs); **Add a picture** right below it →
  `photo/` (the picture page asks for the family code). The separate "Edit tree link" catalogue item is dropped (Hanh:
  "we already have a suggest an update").
- Tests: `tools/tests/adopted_live.js` (phone + desktop: box hidden for spouses / new spouse, shown for children / new
  son; ops saved; Hai→Hiền Con Nuôi, Lịch→Hiền Con Nuôi, Ông Cố→Hiền Cháu Nuôi, Lành→Hiền Anh; test data only) +
  regressions pass. **Locked and pushed** (Hanh: "Lock + push").
- **Catalogued (Hanh):** a **Remove** option in the Edit Tree panel — e.g. someone divorces out of the family, or an errant entry.

## Entry 149 (2026-10-27) — Godparents
- Hanh (tappable answers): Godparents section in the edit panel for **everyone** — **Baptism / Confirmation / Other**;
  ticking one opens a name box with the **same search across every tree** (this page's people + all Supabase trees,
  tree-name tags); **any name can be typed** (e.g. a family friend); **Other** also has a "What kind" box (e.g.
  Wedding). Shown on the tree: **option C** — when the person is focused, their godparent's card shows a **red
  "Đỡ Đầu" chip with white text** beside the usual title chip (Hanh: "add Do Dau along with the relative title chip";
  "use a red chip with white font"). Only for godparents picked from the search (they carry an id); typed names stay in
  the edit panel. Stored as `god:{baptism|confirmation|other:{name,id?,kind?}}` on the person; review lines show
  "Godparents: … → Baptism: Thu · Other (Wedding): …". Main page + Minh's page.
- Hanh first chose "edit panel only for now" (wait for Minh's tree, work it out with his own godfather), then
  revisited → option C.
- Tests: `tools/tests/godparents_live.js` (phone + desktop, test data only) — search, required name, saved op,
  Khánh→Thu "Chị|Đỡ Đầu", editor refill, review line; no page errors. **Locked and pushed** (Hanh: "Lock + push").
- **Catalogued (Hanh):** load the **other three trees from the original upload** (the spreadsheet's other sheets) —
  ask Hanh for each tree's name first.

## Entry 150 (2026-10-27) — The other three trees (in progress): names
- Sheets in `data/tree.json`: H.HN.T Maternal Tree (76 people), Huong's Paternal Tree (91), Huong's Maternal Tree (75).
- **H.HN.T Maternal Tree → "Hạnh's Maternal Grandparents"** (Hanh). Previewed its top two levels (Ông Vinh & Bà Ngâu;
  8 children). Hanh asked whether Ông Vinh's siblings are listed — they are not in the sheet (he and Bà Ngâu are the
  top box; no one beside or above them).
- **Huong's Paternal Tree → "Hương's Paternal Grandparents"** (Lượng & Đào; 6 children) and **Huong's Maternal Tree →
  "Hương's Maternal Grandparents"** (Bài & Tranh; 7 children) (Hanh), after previews of their top two levels.
- **Links (Hanh): one page, `?tree=`** — `/FamilyTree/` (Hạnh's Paternal Grandpa & Siblings, default),
  `?tree=hanh-maternal`, `?tree=huong-paternal`, `?tree=huong-maternal`. `data/trees.json` gained `link`, `prefix`
  (`hm:` / `up:` / `um:`; the paternal sheet keeps bare cells and `hp:` picture ids) and `url`.
- **Built:** `build_v2.py` embeds all four sheets (`v2_tree(R, sheet)` with prefixed ids); `store_main.js` picks the
  tree from `?tree=`, sets PID per tree, applies only that tree's updates (each op carries `t:<link>`; old ops
  without `t` belong to the paternal tree); header / tab / TREES "Open now" follow the open tree; the review list
  groups updates by tree (other trees: summary + "Open this tree"); the picture page searches all four built-in
  trees (+ Supabase trees).
- Checked: paternal tree identical, 38,416 / 38,416 titles; 76 / 91 / 75 people on the others with titles (e.g.
  Hương → Ông Vinh "Ông Ngoại"); `tools/tests/multitree_live.js` (an update on Hương's Maternal stays there, review
  groups it) + regressions pass. **Locked and pushed** (Hanh: "Lock + push").
- Hanh (mid-build): "use this same naming convention for minh's trees" — to settle next.

## Entry 151 (2026-10-27) — Thím/Mự (not Mự/Mợ) · Minh's trees on ?tree= · splash once per session
- Hanh: "remove the Mo/Mu it was suppose to be for Thim/Mu" → **Thím shows "Thím/Mự"** (Bà Thím → "Bà Thím/Mự");
  **Mợ is plain "Mợ" again** (Entry 145 undone).
- Hanh: "use this same naming convention for minh's trees" → **links**: `/FamilyTree/?tree=<link>` for a tree kept
  in the family database (e.g. `?tree=thuong`) opens it on Minh's page (`minh/?tree=…`); the main page's TREES list
  adds the database trees; Minh's page links trees through `../?tree=…`.
- Hanh: "only show the splash page once per session" → the splash shows on the first page of a browser session
  (sessionStorage `hft-splash-seen`); other trees / Minh's page in the same tab open straight to the wheel.
- Tests: `tools/tests/treelinks_live.js` + splash check (first visit yes; other tree / Minh same tab no; new session
  yes) + regressions. **Locked and pushed** (Hanh: "lock").

## Entry 152 (2026-10-27) — Remove from the tree
- Hanh (tappable answers): a divorced spouse is **taken off the tree**; their **children stay** with the blood relative
  (they keep the removed spouse as their other parent — no one else becomes it); a mistaken **blood relative can be
  removed only when nothing is under them** ("Remove their spouse and children first").
- **Built:** "Remove…" button in the edit panel (red outline; hidden for the centre couple) → "Remove <name>?" box with
  a required reason: **Divorced out of the family** (spouses only) / **Added by mistake**. Main page: saved as an update
  op `remove` (reason + the person as they were); until Hanh confirms, the person stays with a **"Removing"** tag;
  Confirm takes them off, Reject keeps them. Review line "Removed · <reason>". Minh's page: removes directly (his saves).
- Tests: `tools/tests/remove_live.js` (phone + desktop, test data only) + regressions. **Locked and pushed.**
- **Catalogued (Hanh):** tap the centre-most avatar of a sunburst to make that person the focal.

## Entry 153 (2026-10-27) — Tap the centre avatar to make that person the focal
- Hanh: "click on the center most avatar on a sunburst to be the focal"; then "any click on the center avatar should
  show the yellow border around both of them. Once they are clicked, the relative title follow the rules we set
  earlier for desktop and mobile."
- **Locked:** tapping Ông Cố's or Bà Cố's avatar (any tree's centre person) makes them the focal without snapping
  (tap again clears); **one gold border around both centre avatars**; titles from the tapped person follow the
  existing rules — computers: chips on the whole wheel and snapped (Entry 91); phones: snapped only (Entries 84, 91);
  centre title line (Entry 86); spouse sees Chồng / Vợ (Entry 95). Other wheel taps unchanged. Previews
  `v2/mockups/centre_*.png`. **Locked and pushed.**
- **Entry 154 (Hanh):** "remove the relative title for the inner most avatars, since both are bordered" → when a
  centre person is the focal, no title line under the centre couple; with any other focal it still shows. **Locked and pushed.**

## Entry 155 (2026-10-27) — Remove / update a confirmed picture
- Hanh: in Edit Tree (Recommended); "have two options, remove and update".
- **Built:** with Hanh's admin code, the edit panel shows a "Picture on the cards" block (picture + Confirmed / Waiting
  for your review) with **Update picture** (→ `photo/?person=<id>`, the picture page opens at that person's photo
  step; the new picture goes through review) and **Remove picture** (`photo_remove`: all that person's pictures marked
  rejected → the drawing comes back at once). Family members don't see the block. `supabase/07_photo_remove.sql`.
- Tests: `tools/tests/photo_remove_live.js` (phone + desktop) + `?person=` check. **Locked and pushed.** Hanh to run 07.
- **Live (Hanh):** `07_photo_remove.sql` run → "ready".

## Entry 156 (2026-10-27) — Folding confirmed updates into the repo
- The workspace can't reach supabase.co (proxy). Hanh chose a **download button**: Review changes (admin) →
  **"Download confirmed updates"** saves `trancestry-confirmed-updates-<date>.json` (every update with status ok);
  Hanh attaches it in the chat; `tools/fold_updates.py <file>` adds new ones to **`data/updates.json`** (by id,
  repeat-safe) and writes **`data/updates_for_spreadsheet.md`** (each change with sheet!cell, for the spreadsheet).
  `tools/build_minh.py fold()` applies data/updates.json to the trees built into the main page (same rules as the
  page; the page re-applies harmlessly). `data/tree.json` (from the spreadsheet) is not rewritten.
- Hanh asked about earlier updates: confirmed → live and in the download (old ops without `t` = paternal tree);
  pending → stay Pending; rejected → ignored. Test changes: reject if pending; if confirmed, put the value back via
  Edit Tree and confirm (later change wins).
- Tested with test data (removed afterwards); titles 38,416 / 38,416; regressions pass. **Locked and pushed.**

## Entry 157 (2026-10-27) — Stop protocol (S008)

Hanh: "stop protocol." Session S008 (Entries 141–156) covered:
- Font sizes: whole wheel 9 px on computers (141); snapped names grow with the screen (142).
- Picture page `/photo/` + QR card, fit-the-face guide, pictures on cards marked Pending, picture review (143);
  Update / Remove picture (155).
- Edit Tree on the main page (144, renamed 148) + Add a picture link; Adopted (148); Godparents + Đỡ Đầu (149);
  Remove (152); birth-order badges (146); Thím/Mự (151, replacing 145's Mự/Mợ); centre-avatar focal (153–154);
  splash once per session (151).
- Four trees on the main page with `?tree=` + names (150); Minh's trees on `?tree=` (151); titles across linked
  trees parked (147); folding confirmed updates via a download (156).
- Supabase: 05_photos, family code, 06_updates, 07_photo_remove run live.
- Docs updated (README Current State + next session S009, ROADMAP, SKILL); mirrored to the Project. Everything pushed.
- Snapshot zip: `S008_2026-10-27_FamilyTree.zip`.

## Entry 158 (2026-10-27) — First fold of confirmed updates
- Hanh attached `trancestry-confirmed-updates-2026-10-27.json` (3 confirmed updates, #2–#4) → `tools/fold_updates.py`
  → `data/updates.json` + `data/updates_for_spreadsheet.md`; rebuilt. Nicknames (as Hanh entered them):
  H.HN.T Maternal Tree!N165 Thường → "Nancy"; H.HN.T Paternal Tree!AF204 Thu → "Lisa"; AF216 Tiên → "Linda".

## Entry 159 (2026-10-27) — Hạnh's Paternal and Maternal trees linked through his mom
- Hanh: "link Hạnh's Maternal Grandparents and Hạnh's Paternal Grandpa & Siblings with my mom as the link". Hanh
  confirmed Thường (paternal W238) and Thường (maternal N165) are the same person; chose **her whole family** linked
  and an **"Also in" button in the edit panel** to jump.
- `data/links.json`: 9 groups (11 people incl. couples) matched in both sheets, same order: Hậu W236=N167, Thường
  W238=N165, Hạnh AF241=W170, Hương AF243=W172, Huyền Nhi AF246=W175, Brian AF248=W177, Sydney AP251=AF180, Sophia
  AP254=AF183, Thảo AF257=W186.
- Build: linked people's details combined (first non-empty value, paternal first) → Thường's nickname "Nancy" shows on
  both sides. Page: updates on a linked person in either tree apply to both (ids translated; additions under them too);
  pictures use one id (the paternal `hp:` one; picture page dedupes); edit panel "Also in <tree> →" opens the other tree
  at `?tree=…&focus=<id>` (that person focal, Simple view).
- Tests: `tools/tests/link_trees_live.js` (phone + desktop, test data) + regressions; titles 38,416 / 38,416.
  **Locked and pushed.**

## Entries 160–169 (2026-10-27) — The Multiverse (3D page) + Hạnh & Hương linked into Hương's trees
- **160** New page `/3d/` (`3d/src/index.template.html`, `tools/build_3d.py`; three.js r149 vendored as `v2/three.min.js`).
  Pick up to 5 trees (checkboxes); built-in trees embedded as the main page shows them (confirmed updates folded,
  links combined); Minh's database trees load at runtime. Each tree is a sunburst disc stacked in space; links join the
  same person (from `data/links.json` and shared `hp:` ids — never guessed). Drag = turn, up/down = tilt, two fingers /
  right-drag = move, wheel / pinch = zoom, Turn on/off, Reset view; tap a link → who and which trees.
- **161** Trees put in order (top = anchor); straight links. **162** Hanh: order is set in a pop-up after "Show in 3D"
  (drag ⠿, numbers, TOP tag, OK draws; one tree skips it).
- **163** Solid discs so links never show through a burst above; a flat dot on each burst; each person's link + dots get
  their own colour (16 bold colours, shuffled each draw); tap → others grey.
- **164** Dots and lines half size; dot at the outer edge of the person's segment.
- **165** Hanh: names use the **v2 rules** (the prototype's flip spilled left-half names outward under the next ring):
  radial from the inner edge, never flipped; one size for every ring (11.15 per 100 of ring), shrink only when thin,
  "…" to fit, nickname on a 2nd line at 90%, v2 colours + text shade, red birth-order badges on the innermost ring;
  names drawn after all segments; solid centre with the couple's names. Computers draw 3072 px, phones 2048.
- **166** (replaced by 168) name-tag drag turned one tree.
- **167** Hanh: link Hạnh and Hương into both of Hương's trees — `data/links.json` groups now Hạnh AF241 = hm:W170 =
  up:W235 = um:W97; Hương AF243 = hm:W172 = up:W233 = um:W95 (matched by spouse + parents; other Hương's left alone).
  Main page / picture page rebuilt (only GROUPS changed). 3D links now chain tree → next tree below that has the
  person, so a link never passes through a burst between.
- **168** Hanh: a ⟲ icon in each burst's centre (names above/below it). Tap → only that burst turns (follows the finger
  round its centre; others dimmed and frozen; bar "Turning … only · tap outside it to finish"; zoom still works). Tap
  outside it → it keeps its position; controls move the whole stack again. Reset view straightens all.
- **169** Left pane link under "Add a picture": **The Multiverse** (stacked-rings icon, "The trees stacked in 3D,
  linked"); page title/header renamed (first "Inception View").
- Tests (desktop 1440×900 + phone 412×891, swiftshader WebGL): order pop-up flow, links, per-burst turn, pane link →
  /3d/; all four main-page trees load clean. Live preview artifact "Trancestry 3D Preview" (private). **Pushed.**

## Entry 170 (2026-10-27) — The Multiverse link on Minh's page
- Hanh: "/minh — I don't see the multiverse link". Minh's page is built without `main_extra.js`, so the link is added in
  `minh/src/minh_pane.js` too (above TREES, `../3d/`). Tested desktop + phone (link → /3d/). **Pushed.**

## Entry 171 (2026-10-27) — Ctrl+Shift+R replays the splash
- Hanh: "a CTRL+SHIFT+R should show the splash page again, only when a CTRL+SHIFT+R is pressed". The engine template
  notes Ctrl/Cmd+Shift+R (keydown, sessionStorage `hft-splash-again`); the next load shows the splash once more. Plain
  reloads still skip it (once per session, Entry 151). Main + Minh rebuilt; tested both. **Pushed.**

## Entry 172 (2026-10-27) — Edit Tree, Add a picture, The Multiverse on Minh's page; to-do updates
- Hanh: "these should be on the /minh site too". The three pane items now live in a shared `minh/src/search_edit.js`
  (both builds; `main_extra.html`'s search dialog included in both). On Minh's page Edit Tree → search → his edit
  pop-up (edit code, saves straight away); links use `../photo/`, `../3d/`. Entry 170's separate link removed.
  Tested Minh (mock tree) + main page, desktop + phone.
- Hanh: Minh's message **sent** (done). Bảo Nguyễn as editor **on hold** until Minh works through his additions and
  any bugs are fixed. Fold check: the 3 confirmed updates (Entry 158) are in the built pages (Nancy, Lisa, Linda).

## Entry 173 (2026-10-27) — Stop protocol (S009)

Hanh: "lets push, and run a stop protocol". Session S009 (Entries 158–172) covered:
- First fold of confirmed updates (158); Hạnh's two trees linked through his mom Thường (159).
- **The Multiverse** 3D page (160–169) + pane link on both pages (169–170, 172); Hạnh & Hương linked into Hương's
  trees (167); Ctrl+Shift+R replays the splash (171).
- To-do: Minh's message sent ✅; Bảo as editor ⏸ (after Minh's additions); titles across linked trees ⏸.
- Docs updated (README Current State + next session S010, ROADMAP, SKILL); mirrored to the Project. Everything pushed.
- Snapshot zip: `S009_2026-10-27_FamilyTree.zip`.

## Entry 174 (2026-10-27) — Zoom buttons on every view
- Hanh: "add zoom toggles on the desktop and mobile for all views. The toggle will scale the view by 10% per click".
  Engine template: a + / − pill bottom-right (above the whole-wheel button when snapped; hidden while the phone menu
  is open). Whole wheel → `zoomAt` around the screen middle (pinch limits); snapped → around the middle, ½×–4× of the
  snapped size; Side / Top → their d3 zoom (`window.SIDEZOOM`); Simple → card size × `window.UZS` (½–3×, scrolls).
  The Multiverse: − / + beside Turn. Main + Minh + 3D rebuilt; tested every view, desktop + phone (exactly ×1.1 per
  click). **Pushed.**

## Entry 175 (2026-10-27) — Mouse wheel no longer zooms the sunburst
- Hanh: on the desktop the mouse wheel changed the sunburst's zoom — remove it. The whole-wheel `wheel` handler now
  only acts with Ctrl (trackpad pinch / Ctrl + scroll, like the Side view); a plain scroll does nothing; + / − stay.
  Main + Minh rebuilt; tested. **Pushed.**

## Entry 176 (2026-10-27) — Inter for every name and label
- Hanh compared sans, serif, condensed and readable font sets (inline previews; all Google Fonts with full Vietnamese),
  then a full preview of the real site in **Inter**, and said "Push" → applied. Inter is kept on the site
  (`fonts/inter-{vietnamese,latin-ext,latin}-{400,700}-normal.woff2`, from @fontsource/inter 5.1.0; 400 serves weights
  100–599, 700 serves 600–900) — no Google request. `"Segoe UI"` stacks → `Inter,"Segoe UI",…` in the engine, Minh's
  dialogs / editor, picture page + QR card, The Multiverse. Engine lays names out again once Inter loads; The Multiverse
  waits for it (≤3 s) before painting the bursts. All pages checked (Inter loaded, no errors). **Pushed.**

## Entry 177 (2026-10-27) — Inter on the sunburst names only
- Hanh: "Only apply inter to the sunbursts names only. Change it back to the original font for every thing else."
  Engine: wheel name text gets `font-family` Inter (measured in Inter via `fitN`); everything else back to
  `"Segoe UI",system-ui,…` (menu, cards, pop-ups, chips, badges). Minh's dialogs / editor and the picture page + QR card
  reverted completely (no Inter loaded). The Multiverse: burst names + centre names in Inter; its UI and badges back.
  Checked every page's text fonts. **Pushed.**

## Entry 178 (2026-10-27) — Sunburst names in Segoe UI Semibold
- Hanh compared heavier weights (Inter 400–550, medium fonts, Segoe UI 400 / Variable 450–500 / Semibold 600 / Bold)
  and chose **Segoe UI Semibold (600) for the sunbursts only**. Engine: wheel names `"Segoe UI"` 600 (focal stays 700),
  measured at 600 (`fitN`, `NW`); The Multiverse burst names 600. Inter removed (font files deleted, no @font-face).
  Everything else unchanged. Checked fonts + weights on every page; 3D flow test clean. **Pushed.**

## Entry 179 (2026-10-27) — Unknown names show as red ~INC~
- Hanh: "all of the TBD, ??, should be changed to ~INC~ … change all of these to red - so that we know we need to fill
  those in". Display only (data keeps "??" / "TBD"): engine `isINC` / `DN` — sunburst names (red #d1452b), Simple /
  Side / Top cards (lighter red #ff6b5b), widths measured on "~INC~"; The Multiverse bursts too. ~INC~ people stay out of
  search (main, Minh, picture page; TBD now excluded as well). Count: 35 "??", 1 "?? (Boy)", 3 "TBD" (39) across the four
  trees; no "???". Tested desktop + phone. **Pushed.**

## Entry 180 (2026-10-27) — Admin → Start a new tree (Hạnh's Maternal Grandpa & Siblings)
- Hanh: under Admin add a link to create a new tree "Hạnh's Maternal Grandpa & Siblings", starting with Ông Cố and Bà
  Cố on his grandma's side as the two centre avatars. `review.js` (shared Admin section): **Start a new tree** → on
  Minh's page opens the new-tree dialog (`window.OPENNEW`; asks the code if needed), on the main page goes to
  `minh/?start=1`. Preset while that tree doesn't exist: name as above, link `hanh-maternal-grandpa`, couple, centre
  names Ông Cố / Bà Cố; afterwards the dialog opens blank. New dialog field: **Names in the centre** (optional; blank
  shows ~INC~). Tested desktop + phone with a mock database (create_tree payload checked). Hanh presses Start tree live.
  **Pushed.**

## Entry 181 (2026-10-27) — Trees in one alphabetical list
- Hanh: "make sure that they are in alpha order" / "have all trees in one section alphabeticalize". Shared
  `window.SORTTREES` (search_edit.js): every tree item in the left menu (built-in + database trees) sorted together,
  Vietnamese-aware (`localeCompare 'vi'`); Minh's page re-sorts when its list rebuilds. The Multiverse list sorted too.

## Entry 182 (2026-10-27) — Admin → Rename a tree (any tree)
- Hanh chose "Admin rename for all". `supabase/08_tree_names.sql` (**run live by Hanh: ready | 0**): `tree_names`
  (public read, no direct writes) + `rename_any_tree(code, link, name)` — admin only; database trees → `rename_tree`,
  built-in trees → `tree_names`. Admin section: **Rename a tree** pop-up (tree list, starts on the open tree; new name;
  link unchanged). Names applied on load (`APPLYNAME`) to the menu, header / tab, The Multiverse list and the picture
  page's tree tags. Tested SQL on local Postgres (admin ok; non-admin / wrong code / empty name / bad link refused; anon
  can't write) and the pages on desktop + phone. **Pushed.**

## Entry 183 (2026-10-27) — The paternal tree opens after the splash
- Hanh: "make sure the default tree opened after the splash is: Hạnh's Paternal Grandpa & Siblings". The main link
  already defaulted to it; a Ctrl+Shift+R replay on another tree (or on Minh's page) now goes back to the main link
  (paternal, whole wheel, history state cleared) before the splash plays. Plain reloads stay on their tree; a direct
  `?tree=` link a family member opens still shows that tree after the splash. Tested. **Pushed.**

## Entry 184 (2026-10-27) — Zoom kept between generations
- Hanh: "when somebody toggles the zoom, keep that zoom value when moving between generations. On the sunbursts - it
  reverts back to the default zoom". Snapped: `SZ` (zoom × the snapped size, set by + / −) is applied in `snapTo`, so
  ‹ › and tapping a segment keep it. Side / Top: `FZ` (user zoom over the fitted size `KB`, from + / − or pinch) is kept
  when the view redraws. Resets on reload. Tested desktop + phone (1.331× kept through next / next / prev). **Pushed.**

## Entry 185 (2026-10-27) — Stop protocol (S010)

Hanh: "stop protocol". Session S010 (Entries 174–184) covered:
- Zoom + / − on every view (174), kept between generations (184); mouse wheel no longer zooms the wheel (175).
- Fonts: Inter tried (176), then sunburst-only (177), then **Segoe UI Semibold 600** for the sunburst names (178).
- Unknown names → red ~INC~ (179); family how-to message drafted (EN + VI).
- Admin: Start a new tree with the Maternal Grandpa preset (180); Rename a tree (182, 08_tree_names.sql run live).
- TREES list alphabetical in one section (181); the paternal tree after the splash (183).
- Docs updated (README Current State + next session S011, ROADMAP, SKILL); mirrored to the Project.
- Snapshot zip: `S010_2026-10-27_FamilyTree.zip`.

## Entry 186 (2026-10-27) — Every box the focal's size
- Hanh asked how the focal and non-focal boxes differ (Side / Top / Simple): same box, but the border is drawn centred on
  the edge, so the focal's 3 px border made it look 2 px bigger than a 1 px grey card (and 1 px bigger than a 2 px gold
  one). Hanh: "i do want all the boxes to remain the same. Lets use the dimension of the focal boxes."
- Now every card's border grows **outward** to the focal's edge (1.5 × the card's scale outside the box), whatever its
  thickness, so every box has the focal's outer size; borders keep their colours and thicknesses. Side / Top and
  Simple, v2 and Minh's page. Tested `tools/tests/box_edge.js` (desktop + phone, all three views): every card 1.5 out
  at 100 %, 1.125 at Con, 0.75 at Cháu; no errors.
- Hanh: "leave the width's dynamic as is" — columns (Side) / rows (Top) still size to their longest line, so they can
  change width when the focal changes (bold name, no chip on the focal). **Pushed.**

## Entry 187 (2026-10-27) — Boxes keep their size after Clear focal
- Hanh (screenshots, Ba & Đỏ in Side view): "the size of the focal and non focal boxes are still different." Measured:
  focal Ba → Ba / Đỏ 325 × 112 px; after Clear focal → 325 × 137. Cause: the view opens with the focal card 325 px wide
  (Entry 72); with a focal, Đỏ's "Vợ" chip widens the column, so the zoom is smaller; with the titles cleared the column
  narrows and the same 325 px zooms everything up (taller box, bigger avatar and text).
- Hanh chose **"Keep chip room"**: a card keeps room for its title chip even when Clear focal hides the titles, so the
  column and every box keep one size. Side, Top and Simple; v2 and Minh's page.
- Tested `tools/tests/clear_size.js`: computer Side / Top 325 × 112 both ways, Simple 252 × 79 both ways; phone Side
  126 × 43, Top 85 × 29, Simple 361 / 346 × 63 both ways; `box_edge.js` (Entry 186) still passes; no errors. **Pushed.**

## Entry 188 (2026-10-27) — Stop protocol (S011)
Hanh: "here's the previous zip. read the .md files and run a stop protocol" (S010 zip attached). Found: S010's stop
protocol docs (Entry 185, README / ROADMAP / SKILL updates) were in the zip but never reached the repo; this session had
logged its own entries as 185–186. Merged: the S010 docs restored as the base, this session's entries renumbered
**186–187** (code unchanged; the zip's code matched the repo's Entry 184 code).
Session S011 (Entries 186–187) covered:
- Every box the focal's outer size — borders grow outward to the focal's 3 px edge (186); widths stay dynamic (Hanh).
- Boxes keep their size after Clear focal — cards keep room for their title chip (187).
- Docs updated (README Current State + next session S012, ROADMAP, SKILL); mirrored to the Project.
- Snapshot zip: `S011_2026-10-27_FamilyTree.zip`.

## Entry 189 (2026-10-27) — Admin → Download a backup
- Hanh asked the Supabase free-plan limits (500 MB database, 1 GB storage, 5 GB egress / month, paused after a week with
  no use, **no backups**). Pictures, Minh's trees, updates and Minh's edit history live only in Supabase. Hanh: "yes,
  please add a way to download a copy of that data, like the confirmed-updates download you already have."
- Hanh chose: **Admin menu item** (not in Review changes); **include rejected** pictures / updates, marked rejected.
- `supabase/09_backup.sql` (**run live by Hanh: ready | 1** — one picture in the database): `backup_all(code)` — admin code only (`_admin_for`), returns trees,
  people, changes, photos (with the picture itself), updates, tree_names, editors (id, name, is_admin, created_at). **No
  codes**: editors' and the family code's hashes are never in it.
- Left menu → Admin → **Download a backup** (after Rename a tree; main page and Minh's page, `minh/src/review.js`): one
  file `trancestry-backup-YYYY-MM-DD.json` (local date; `backup_of`, `exported_at`, built-in tree names, then the tables).
  The item's second line shows "Preparing…", then "Downloaded: 1 tree · 2 people · 2 pictures · 2 updates"; Minh's code →
  "Your admin code was not accepted"; SQL not run yet → "Run 09_backup.sql in Supabase first".
- Tested on local Postgres (all SQL 01–09, anon role; admin / lower-case admin ok; Minh's, family and wrong codes refused;
  no hashes in the output; anon still can't read `changes`) and `tools/tests/backup_live.js` (main + Minh's page, desktop
  + phone: 72 checks, all pass). **Pushed.**

## Entry 190 (2026-10-29) — Left menu: Clear focal first
- Hanh: "Change the order to: Clear Focal, Whole Wheel, Side View, etc." → the menu now reads **Clear focal · Whole wheel ·
  Side view · Top view · Simple** (main page and Minh's page). Nothing else changed.
- Tested `tools/tests/pane_order.js` (both pages, computer + phone): order, Clear focal greyed with no focal / on with one,
  clears the focal and stays in Side view, Whole wheel leaves the view; no errors. Reran box_edge, clear_size, clear,
  backup_live — all still pass.

## Entry 191 (2026-10-29) — Zoom buttons have no limit
- Hanh: "do not limit the zoom toggle." The + / − buttons had a range on every view (whole wheel 0.8×–4×, snapped ½×–4×,
  Side / Top scale 0.15–4, Simple ½×–3×, The Multiverse camera 3–60). Now **no limit** on any view; each click is still
  10 %. Pinch / Ctrl + scroll keep their old range but never snap back if the buttons have gone past it.
- Fixed on the way: in Side / Top, quick clicks interrupted each other's animation and didn't add up — each click now aims
  at a fixed target. Zoom still kept between generations (Entry 184: 5 clicks → 1.61× after picking Hạnh).
- Tested `tools/tests/zoom_free.js` (computer + phone, every view incl. The Multiverse): e.g. Side + ×40 → 62.04
  (exactly 1.1⁴⁰ × the opening size), − ×80 → 0.0303; no errors.

## Entry 192 (2026-10-29) — The Multiverse: instructions in their own panel; turning picks up again
- Hanh: "the instruction panel for this should be a secondary panel next to the navigational panel. Have a toggle to
  collapse/expand … resume the rotation animation after any interaction."
- **How to use** is its own panel (icons + one line each: Turn, Tilt, Turn one tree, Move, Zoom, Who connects the trees).
  ‹ collapses it to a 44 px strip ("How to use"); › or the strip expands it. Remembered on this device. Phones: a
  "How to" button in the header (swaps with "Trees").
- Turning: any drag, tap, scroll or + / − pauses it; it **picks up again 1 s after** the last one (Hanh: "after 1 sec").
  It stays still while a finger is down and while one tree is being turned (⟲). "Turn: off" still stops it for good.

## Entry 193 (2026-10-29) — The Multiverse: navigation pane always there; Pick up to 5 trees collapsible too
- Hanh: "have the pick up 5 tree as a secondary panel too with collapse toggle. The navigational pane should always be
  present." Answers: **same pane as the main page**; both panels **start open**.
- Computers: navigation pane (240) · Pick up to 5 trees (280, collapses to 44) · How to use (250, collapses to 44) · 3D.
  Phones: the pane on the left handle (as on the main page); Trees / How to buttons in the header.
- The pane is copied from the main page's template at build time (`tools/build_3d.py`), so it stays the same. Each item
  goes back to the main page for **the tree you came from** (`3d/?from=`): Whole wheel; Side / Top / Simple (`?open=`);
  Edit Tree; Admin → Review changes / Rename a tree; Start a new tree → Minh's page. Clear focal is greyed (no focal
  here). Search looks in every tree; a result opens that tree with the name already searched (`?q=`). TREES list
  (built-in + database, alphabetical). The Multiverse marked Open now. Download a backup works right on the page.
- **Miền Trung is now remembered on this device** and shared by every page (it used to reset on reload).
- Fixed on the way: opening the pane on a phone froze the page (a watcher re-triggering itself); and a comment had cut
  off the camera update.
- Tested `tools/tests/multiverse_nav.js` (computer 23 checks, phone 13) and `how_panel.js`; reran pane_order,
  backup_live, clear_size, zoom_free — all pass, no errors.

## Entry 194 (2026-10-29) — The focal glows in every view
- Hanh: "the focal in all views should have a glowing animation. Show me different options" → five live options shown
  inline (A breathing halo · B border pulse · C ripple · D light sweep · E halo and name). Hanh: **"Glow option A:
  breathing halo"**, and "use the same glow on the segment in the wheel".
- A soft gold halo swells and fades every **2.4 s** around the focal: the focal's segment on the wheel (halo made
  stronger there, segments being small), the centre border when Ông Cố / Bà Cố is the focal, and the focal's card in
  Side, Top and Simple — main page and Minh's page. Only the focal glows; Clear focal → no glow.
- Built as an SVG filter (`GLOWF`: outline widened, blurred, gold, its opacity animated), so it looks the same in every
  browser. A device set to reduce motion gets a steady soft halo instead.
- Tested `tools/tests/glow.js` (computer + phone: one glow on the wheel, only Hậu's card glows in each view, none after
  Clear focal, centre border glows for Ông Cố; stills at brightest / dimmest); box_edge, clear_size, pane_order still pass.
- Entries 190–194 **pushed** together (2026-10-29).

## Entry 195 (2026-10-29) — ⟲ default zoom on the zoom control
- Hanh: "add a default zoom to the toggle, meaning how we intended the page to look without zooming with proper font
  sizes." Three designs shown inline (A percentage · B reset icon · C Fit below); Hanh: **"Zoom reset option B: reset
  icon"**.
- **⟲ between + and −** on every view (main page, Minh's page; The Multiverse between − and + in its toolbar). Gold when
  you've zoomed; grey (does nothing) when already at the default. One tap puts the open view back at its default size:
  whole wheel fitted to the screen (rotation kept) · snapped size · Side / Top focal card 325 px on computers (phones
  their own fit), centred on the focal · Simple normal size · The Multiverse starting camera distance ("Reset view"
  still resets the turning too).
- Tested `tools/tests/zoom_reset.js` (computer + phone, every view): e.g. Side + ×7 → card 633 px, ⟲ → 325 px and the
  name back to its default size; The Multiverse 6.1 → 13.0; no errors. **Pushed.**

## Entries 196–197 (2026-10-29) — Move the wheel by dragging; rotate rail; only a complete ring turns it
- Hanh: "I want to be able to drag the wheel too" → chose **"Drag moves, edge turns"** (Entry 196). Then (Entry 197):
  "add a rotate rail on top of the zoom toggle … drag up to rotate counterclockwise and drag down to rotate clockwise.
  There is no limit … Once they let go, the button will … bounce back to the center … We can still rotate the wheel by
  using the most outer edge of a complete ring … if [it] does not fully show in the display then the dragging behavior
  will not work on that outer ring."
- **Whole wheel, dragging:** drag anywhere to **move** the wheel (empty space too). Only the **outermost ring that is
  completely on screen** turns it; a ring cut off by the screen edge (zoomed in / moved) doesn't — the next complete ring
  inward does; no complete ring → dragging only moves. Computers: the cursor shows move / grab. Zooming no longer pulls
  the wheel back to the middle; ⟲ re-centres it. Hint: "Tap anywhere on the wheel · drag to move it · drag the outer ring
  or the rail to turn it". A tap still opens that part; the snapped view's drag still scrolls the family.
- **Rotate rail** above + ⟲ − (whole wheel only; hidden when snapped, in Side / Top / Simple, or with the phone pane
  open): a gold knob on a rail, ↺ at the top, ↻ at the bottom. Hold it up = counter-clockwise, down = clockwise; the
  further, the faster (up to 200°/s); keeps turning while held — no limit. Let go → the knob springs back to the middle,
  overshoots a little and settles (~0.55 s). Keyboard: ↑ / ↓ held. It never moves the wheel.
- Tested `tools/tests/rotate_rail.js` (computer + phone, real touch drags) and `wheel_drag.js`: rail turns −200° in 1 s
  up / +160° down, −520° after 2.5 s held, knob path −35 → +4.8 → 0; outer ring turns at the default, after one + click
  ring 3 takes over and the cut-off ring 4 moves instead; far in → no complete ring; glow, zoom_reset still pass. **Pushed.**

## Entry 198 (2026-10-29) — Phones: smaller rail and zoom buttons; no hint
- Hanh: "reduce the size of the toggle and rail on mobile display. Remove the phone hint."
- Phones (≤ 820 px): zoom buttons 36 × 34 (⟲ 28 tall, was 44 × 42 / 34); rail 38 × 124 (was 46 × 150), knob 22 (was
  28), sitting 10 px above the zoom buttons. The wheel's hint line is hidden on phones (the snapped view's hint was
  already hidden everywhere). Computers unchanged.
- Tested: rotate_rail (phone + computer) and zoom_reset (phone) still pass; measured rail 38 × 124, zoom 38 × 106. **Pushed.**

## Entry 199 (2026-10-29) — The rotate rail stays on both sunburst views
- Hanh: "the rotate rail goes away when you change the view on each of the sunburst. Make that rail a constant fixture
  just like the zoom toggle." It was hidden in the snapped view (Entry 197).
- Now on the whole wheel **and** the snapped view (through ‹ › and back to the whole wheel), sitting above + ⟲ −, which
  move up above the whole-wheel button when snapped (computer: rail +196 px from the bottom, phone +180). Snapped, the
  rail scrolls along the ring like a drag (knob up = the family moves up, the same as dragging up). Still hidden in Side /
  Top / Simple (nothing to turn there).
- Tested `rotate_rail.js` (computer + phone): stays when snapped, after › and back; no overlap with the zoom buttons or
  the whole-wheel button; snapped scroll 1.49 → 3.93 and stops when let go. **Pushed.**

## Entry 200 (2026-10-29) — Sơn's (Trung/Văn) Paternal Grandparents linked to Hạnh's Paternal tree
- Hanh: "I want to link Hanh's paternal grandpa tree to son's paternal grandparent via Van/Trung" — **Sơn's** paternal
  grandparents (Trung's parents Tám & Bảy): a tree Hanh started from Admin → Start a new tree (`?tree=son-s-trung-van-paternal-grandparents`,
  63 people). Hanh attached a backup (Entry 189) so Claude could see it. Checked first: the Trung in Hương's Paternal tree
  (son of Hinh & Gọt) is **a different man** (Hanh).
- **Matched 1-to-1, 11 people:** Văn (W315) & Trung (W317) · Sơn (AF320) & Sương (AF322) · Cát Linh (Rockii) (AP325) ·
  Thủy (AF328) · Thảo Huyền (AF331) & Trưởng (AF333) · Vinh (Ryan) (AP336) · Đan Linh (Payton) (AP339) · Hoàng (AF342).
  Only difference: the new tree gave Văn, Trung, Sơn, Thủy, Thảo Huyền, Hoàng the last name **Trần** — Hanh: "Yes, Trần
  for all six" (both trees).
- `supabase/10_link_son_trung_van.sql` (**run live by Hanh: ready | 11 | true**): the 11 become shared records `hp:<cell>` (as Minh's Bà
  Thương link, Entry 135) — the new tree's own copies (m-…) swapped for them in its doc, old rows removed, one confirmed
  "shape" change logged as Hanh's, version + 1. Safe to run again (does nothing the second time).
- Hạnh's tree: Trần added as a Hanh-confirmed update in `data/updates.json` (id 900200, kept clear of the database's
  numbers). Also folded the database's confirmed update 5 (Ông Tú adopted) from the backup.
- `tools/build_minh.py`: the shared records Minh's page packs for the Bà Thương link now carry confirmed updates (last
  name etc.), so linking her later never writes over Trần in the database.
- Tested on a local copy of the database loaded from the backup (`tools/tests/link_son_live.js`, computer + phone): the
  script links 11, second run changes nothing; Minh's page opens the tree with Văn / Trung as hp:W315 / hp:W317, their
  four children, Trần; The Multiverse (Hạnh's Paternal + Sơn's) draws the links for all 11; no errors. **Pushed.**

## Entry 201 (2026-10-29) — Editors' page /editor/; trees private until published; database trees open on the main page
- Hanh: "this is not what I was expecting: …/minh/?tree=son-s-… I was expecting …/?tree=son-s-…" → then: "For people that
  will be building their own tree (editors) lets use … /FamilyTree/editor/?tree=xxx … I only want this tree to show on my
  own admin page at all time. It will only show up on the public page under the trees section in the navigational panel,
  when and only when the editor publishes it." Answers: an unpublished tree's public link → **"Not published yet"** + the
  default tree; **Publish is immediate** (no approval) and the tree lives at /FamilyTree/?tree=xxx; existing trees: Sơn's
  and Hạnh's (Hậu/Thường) Paternal Grandma **published**, Minh's (thuong) **not**; **truly private** (the database itself);
  an editor opening their own tree on the main page → /editor/ (Hanh and everyone else stay on the main page).
- **/editor/** = Minh's page renamed (`tools/build_minh.py` → editor/index.html); **/minh/** forwards there keeping ?… #….
- `supabase/11_publish.sql` (**run live by Hanh: ready | thuong (private) · Hạnh's (Hậu/Thường) … (published) · Sơn's … (published)**): `trees.published` (new trees private); row-level security — the public
  reads only published trees and only the people in them; `get_tree(code, link)` (published: anyone; unpublished: its
  editor / Hanh), `tree_list(code)` (Hanh all; an editor own + published), `set_published(code, link, on)` (its editor /
  Hanh, logged as a confirmed "publish" change). First run sets the starting states; later runs never change them.
- **Editors' page:** loads an unpublished tree with the device's code (otherwise "isn't published yet" + the code prompt);
  TREES = own trees (open there, "Not published" marked) + published ones (open on the main page); **Published** switch
  ("Only you and Hạnh can see it" / "On the family page for everyone") for the tree's editor or Hanh.
- **Main page:** a database tree opens here (no pencils; Edit Tree with the family code as for the built-in trees; Hanh's
  confirmed updates to it are also written into the tree so /editor/ shows them). Shared people (hp:<cell>) carry updates
  both ways between Hạnh's Paternal tree and a database tree; "Also in Hạnh's Paternal…" on them. Hanh (admin): TREES
  lists every tree ("· not published" marked), an unpublished tree opens marked "· not published", Admin → **Published**
  switch. The public: published trees only; an unpublished link → the default tree + "That tree isn’t published yet".
- **The Multiverse:** public = published trees; Hanh also the unpublished ones ("· not published"). Start a new tree →
  /editor/?start=1.
- Fixed on the way: the focal's glow (Entry 194) made Side / Top zooming lag at very high zoom (a blur over a huge card) —
  it's switched off past 3× zoom on every view (it can't be seen there) and back below.
- Tested on a local copy of the database from Hanh's backup (`tools/tests/publish_reset.sh` + `publish_live.js`, shared
  helper `livedb.js` answering as the public so the database's rules apply), computer + phone, 26 checks each: public /
  Minh / Hanh lists, links, redirects, privacy at the database, publish / unpublish both ways, family Edit Tree → Review
  changes → Confirm → written into the tree, shared-person updates both ways, The Multiverse 2 / 3 trees. Earlier tests
  rerun (pane_order, zoom_reset, rotate_rail, glow, box_edge, clear_size, zoom_free, multiverse_nav, link_son_live). **Pushed** (after the SQL).

## Entry 202 (2026-10-29) — Slim scrollbars
- Hanh: "remove the background on the scrollbar. I want reduce the scroll bar's width to 3px. Scale the up and down arrows
  to fit the scroll bar width."
- Every page (main, /editor/, The Multiverse, the picture page and its QR card): scrollbars **3 px** wide (3 px tall for
  sideways ones), **no track background**, a grey thumb (gold on hover), and the arrows shrunk to small 3 px triangles.
  Firefox has no 3 px setting — it gets its thinnest bar, also without a background.
- Tested `tools/tests/scrollbar.js` (scrollbars shown): the pane's bar measures 3 px on the main page, /editor/ and The
  Multiverse; no errors. **Pushed.**

## Entry 203 (2026-10-30) — Rotate rail speed
- Hanh: "I don't want the speed to be crazy when dragging all the way up or down. Give me a live preview so that I can
  set the speed" → an inline tuner (sample wheel + rail, Top speed and Build-up sliders). Hanh: **"Set the rotate rail:
  top speed 60°/s, build-up 1.0"** (was 200°/s, 1.5).
- The rail now turns at most **60°/s** (one full turn in 6 s), in a straight line with the pull (half pull = 30°/s). Same
  in the snapped view.
- Measured: full pull −60.5°/s, half pull +30.2°/s; `rotate_rail.js` passes on computer and phone. **Pushed.**

## Entry 204 (2026-10-30) — Two wives: lines from halfway between husband and wife; rail 40°/s
- Hanh (screenshots: Ông Hai's Simple view vs Hậu & Thường): "where there are multiple spouses; I want the connector line
  to fall between the two like the 2nd picture." Answer: **Simple, Side and Top**.
- Built so far: **Simple** — each wife's children's line drops from the middle of the marriage line between her and the
  husband (as for one spouse). Side / Top — first version (line starts beside the wife, level with her children); Hanh
  then asked for it to start exactly **in the middle** between husband and wife, with a live preview → an inline preview
  showing two layouts ("wives next to Hai" with one bend vs "wives over their children", straight). Hanh: **"wives next
  to Hai, 40 px space, line starts halfway then bends to the children."**
- **Side / Top (built):** the wives sit next to the husband, **40 px** apart at the opening zoom on a computer (scaled
  with the generation's size); each wife's children's line starts **exactly halfway** between her and the husband, then
  steps over to the middle of her children. Same in the direct line above a focal (e.g. Hậu's view of Ông Hai). Measured:
  Side 40.0 px both gaps; Top view matches the preview. (Also fixed a comment that had cut off a line of code.)
- Rotate rail: Hanh set **top speed 40°/s** (was 60, Entry 203) with the tuner; build-up 1.0. Measured −40.0 / +20.0°/s.
- **Pushed.**

## Entry 205 (2026-10-30) — Step between generations: ‹ › in Side / Top, ˄ in Simple
- Hanh: "on the side view and top view — have the toggle to move from one generation to the next. When moving to another
  generation, that generation gets scaled to the full size as if we clicked on that generation to focus on … along with
  their title." Answers: **the same size ladder, re-centred** on that generation; **the focal and titles stay** (from the
  focal's side); **a bottom pill like the wheel's**. Then: "the same for the simple view, add a toggle to move up in
  generation. We don't need a down, because they will have to choose the couple to show them and their children."
- **Side / Top:** a pill at the bottom — ‹ older · the generation's name (e.g. "Đời Ông Bà Nội", "Generation 2 of 4") ·
  › younger; disabled at the ends. The generation stepped to is full size (computer: its card 325 px, like the focal) and
  the v1 ladder is re-centred on it (75 / 50 / 30 % going down, 50 % / 25 % faded going up); the focal keeps its glow,
  titles stay from the focal. Older generations centre on the direct line; younger ones on the person nearest the middle
  of the screen. Your zoom (+ / −) is kept. Picking a new focal or reopening the view starts at the focal's generation.
- **Simple:** a ˄ button with the shown family's generation name ("Up a generation" / "The oldest generation"): each tap
  shows the family one generation up (the parents and their children); titles stay from the focal; tapping a couple goes
  down (new focal, as before). Reopening Simple or a new focal starts at the focal's family.
- Tested `tools/tests/gen_step.js` (computer + phone): focal Hạnh → ‹ ‹ grandparents 325 px with Ông Nội / Bà Nội, glow
  still on Hạnh, ends disabled, reopening resets; Simple ˄ → Hậu & Thường's family, ˄ ˄ → Ông Hai's with Bác … titles, top
  disabled. box_edge, clear_size, glow, zoom_reset, pane_order still pass. **Pushed.**
