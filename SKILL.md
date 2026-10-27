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

### Current snapshot (as of 2026-10-26, Entry 129, S006)

- **v1** (sideways focus page) is **live** at https://hellohanh.github.io/FamilyTree/ and archived in
  `archive/v1-2026-10-26/` as the reference.
- **v2 "Trancestry"** is **live at /FamilyTree/** (Entry 139; source `v2/src/index.template.html`, built by
  `tools/build_v2.py` to the root `index.html`; d3 / flubber / avatars stay in `v2/`, `v2/index.html` redirects).
- **v2 built so far:** splash, sunburst (whole / snapped / focal titles), header, Options pane (search, whole wheel,
  clear focal, side / top / Simple views, Miền Trung), side view, top view, Simple view, v1 morph, stone-slab drop,
  Back button, avatars. Ông Hai's sunburst only (Tường's branch catalogued out, Entry 98).
- **Minh's page** at **/FamilyTree/minh/** (Entries 126–127): Bà Thương's family, filled in by Hanh's cousin Minh. Step 1
  built — saves in the browser only (don't send Minh the link yet).
- **Next (not built):** Minh's page steps 2–4 (Supabase live saving + code, Bà Thương link, Hanh's review list); photo
  upload page + QR; Bà Lịch's sunburst + tree picker; go-live.

### v2 (Trancestry) — LOCKED (details in SESSION_LEDGER Entries 76–124)

- **Splash:** Trancestry title (Tr fades through colours); bare branches first, warm-wood heads; leaves fall without
  branches and follow the season (6 looks, Feb/Apr/Jun/Aug/Oct/Dec; 7-day mixed transitions; winter always fully white);
  stays until a tap; the tap opens the **whole** sunburst (Entries 76, 87–88, 90, 99).
- **Sunburst:** Ông Cố & Bà Cố in the centre (set 6 avatars), IBM Carbon 25 per child family, 100 px rings; tap →
  snapped two-ring view with ‹ Rings › pill (phones: bold gold "Rings x–y of 4", no names); both rings ≥ 30 px per person
  with a scrolling squeeze; drag rotates / pinch zooms the whole wheel; tap a person → focal (gold outline) with title
  chips (computers also on the whole wheel); generation names "Đời <focal> · Con Cháu", "Đời Ba Má" … (Entries 80–96).
- **Header:** "**Tr**ancestry" (Tr maple red, bold 24 px) over "Our Family Tree"; "Focused on <focal>" (Entry 96).
- **Options pane:** computers — **always open, docked left**; phones — mustard handle on the **left**, slides in below the
  header (Entry 118). Items: search (accent-free, word starts, "con của …" / "vợ/chồng của …", pick → snap + focal),
  Whole wheel, Clear focal (clears every title, Entry 119), Side view, Top view, Simple, Miền Trung (O / Cô).
- **Focal:** any card tap (anywhere on the card, Entry 122) or search sets it; Ông Cố & Bà Cố can be the focal
  (Entry 121); no focal = names only. Married-in focal sees their spouse as Chồng / Vợ (Entry 95).
- **Side / Top views:** v1 layout rebuilt (ancestors' direct line, focal couple, every generation below), v1 sizes,
  straight lines, two wives each over / level with their own children with the husband between; cards as wide as the
  longest name in the column / row and **≥ 250 px on computers** (scaled on phones, Entry 120); generation names pinned
  (top view: lane on the right); stone-slab drop first time per visit, dust on the landing frame (Entries 107–115).
- **Simple view:** focal couple + children in a column (computers: Ông Hai centred, each wife's children under her;
  phones: one-column outline); children's cards include their spouse; equal avatars; width = longest name; drop
  **every time**, each person a separate slab in **random order** (Entries 97, 101–105, 116, 123–124).
- **Transitions:** sunburst → any view uses **v1's morph code** (flubber, camera glide, 2.0 s, colour by 65 %, Entry 113).
- **Avatars:** square; a couple shares a set; Ông Cố & Bà Cố set 6; random each visit; no repeats in a family of ≤ 6
  couples; an uploaded photo will replace the avatar (Entries 102–103, 110).
- **Back button:** v1 logic — every view is a step; 3 presses on the start view to leave (Entry 104).

### Minh's page (/minh/) — LOCKED (Entries 126–127)

- **What:** Bà Thương's family from her first marriage, filled in by Minh. Starts **blank**: Thương's parents in the centre
  (unnamed, shown "??"); Entry 98's 17 catalogued people are NOT pre-filled.
- **Build:** `tools/build_minh.py` patches **v2's own template** (exact matches, asserted) — never fork the engine.
  `minh/src/kin.js` computes titles in the page with v1's rules (matches `v2/src/kin.json` 45,369 / 45,369).
- **Editing:** full v2 + a **v1 pencil on every card** (Simple, Side, Top) → the edit pop-up (v1's editor restyled to v2):
  First / Middle / Last / Nickname, Has passed, Male / Female (the couple's avatars); add Spouse / Brother / Sister / Son /
  Daughter in birth order (drag or ↑↓); a child of someone with 2+ spouses needs "Other parent". **Required = yellow
  #F0BC4F** (First name, Male/Female) + note "Yellow items are required" beside Cancel / Save. No birth / death years.
  **Suggestions** on all four name fields: up to 6 chips, accents ignored, đ = d, from the start, "Name (meaning)", tap
  to use, never forced — list in `data/vn_names.txt` (Hanh reviews; includes every name in Ông Cố's tree + other tones).
  Phones: Cancel / Save pinned to the bottom. Save → stored → page reloads into the same view (no splash / drop).
- **Saving (step 2):** live in Supabase; **Minh edits freely** (no pending state) with a **code asked once per device**
  (given to Hanh in chat — never in the repo; Supabase keeps a hash and checks it server-side); Hanh gets a **review list
  on the site** (admin sign-in) to update / edit / confirm. The workspace can't reach supabase.co — test in Hanh's browser.
- **Bà Thương link (step 3):** when Minh adds a Thương, offer to link; on yes add **Ông Hai (her husband) + their 27 +
  Tường's 17 = 45 shared records** (one record for both trees); her two husbands laid out **mirroring Entry 106**.

### v2 additions (Entries 126–129)

- **Tree names (Entry 129):** `data/trees.json` — Ông Cố & Bà Cố's tree is **Hạnh's Paternal Grandpa & Siblings** (Entry 136; was Hạnh's Paternal Grandpa) (header under
  Trancestry + browser tab). The Options pane ends with **TREES**: a link per tree, the open one gold ("Open now").

- **Angel wings:** v1's marigold wings (48 × 24) at the right end of the card of everyone who has passed — Side, Top, Simple
  (v2 + Minh's page; left of the pencil there). `build_v2.py` carries who has passed (`x`).
- **Clear focal** in Simple / Side / Top only removes the title chips — the same family stays (anchor); no focal from the
  wheel still means Ông Cố & Bà Cố. Generation names follow the family on screen.
- **Bà Thương has passed:** structure op `deceased` (N264), applied to tree.json.

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
- **Names:** fields First / Middle / Last / Nickname (was "Alternative", Entry 65) (+ Has passed) for the edited and the new person; the edited person also has ♂/♀ chips (Entry 29); a man with two wives is drawn 1st wife / husband / 2nd wife, each wife's children branching from between her and him (Entry 30); kinship: Dad's younger sister = O when the "Miền Trung" toggle is on (default) else Cô, her husband Dượng (Entry 37, from Hanh's Southern chart); all option chips in a left panel (220 px; computers: collapsed by default, a mustard handle on the left edge slides it in over the view, « or Esc tucks it away — Entry 73; phones: no ☰ — the panel slides in from the RIGHT from the TNCFL tracker's mustard handle (#D9A521 pill with 3 dots, right edge, mid-height): tap or swipe left to open; swipe right, tap outside, pick an option or Esc to close — Entry 69, replaces Entry 68's ☰ drawer and Entry 38's dropdown), top bar keeps title + "Focused on" note + ♂/♀/deceased key (phones: the note shows under the title); phone/computer test (DESK) goes by window width, not stage width (Entry 68); uncle/aunt side = the viewer's own blood parent (gen −1) / Ông·Bà + what that parent calls them (gen −2), age from the split (Entry 39, replaces the split-point side rule); sunburst snap button → centre at the left edge, ‹ › step generations (Entry 40); Back steps through visited views, then 3 presses on the sunburst to leave (Entry 41); eye centres on the person with all ancestors + their siblings, ＋/− toggles those siblings' children; Ông/Bà Kỵ = 4 up (Entry 43); sunburst: one panel per person (spouses side by side) — palette A 30% lighter, 12 px text (Entry 51; was 17 px, Entry 48), titles in dark-mustard chips with black text at the inner edge (labels not flipped), tap a name to open the couple, double-tap a name to view the wheel as them (Entry 49; no eyes), wheel sized so the thinnest panel fits a chip, snap on phones = two bands laid out from those two only, 16 px text, ring sizes computed so every name in both bands shows (Entries 54, 61; computers keep the full wheel in snap — Entry 59; computers: whole-wheel names 14 px on screen at any zoom, snap ~55% width, click/double-click same as phones — Entry 56; Entry 53's thinner bands reverted; Entry 52; Entry 47; Entries 44–45 for panels/colours); names 10 px from the inner edge in contrast-picked white/black (spouses match the blood relative), titles marigold with a shadow when low-contrast, marigold eye 5 px from the outer edge (Entry 45); family view (flow chart) opens top-down by default with a ⇄ Side view / ⇅ Top view toggle (in ☰ on phones); sunburst → flow chart keeps the morph, flow chart → flow chart (re-focus, toggle, Back, editor save) drops stone slabs seen from above: each person falls on their own, starting 5× size near your eye and shrinking (speeding up) into place with a darkening shadow, a small settle and a dust puff; generation by generation (oldest first, the next once the last has landed), random order inside a generation, blood relative before spouse; each generation's lines draw in after it lands (Entry 67); dust fires on the landing frame from inside the drop, not a timer (Entry 70); top view: the Vietnamese generation names (same as the side band) sit in a strip on the right (150 px; phones 92 px), each beside its row, following pan/zoom — English row captions removed (Entry 70); the top-view names sit in a reserved page-coloured lane the tree can't enter, so cards never show through them (Entry 73); generation labels stand alone — no strip background or border, side or top (Entry 71); parent lines never jog: the line runs straight down onto the middle child (odd count) or exactly between the two middle children (even), children placed to make it so, in both views — only exception: side view two-wives families (Ông Hai) keep a line per wife and those two may jog (Entry 71); family view opens centred on the focused couple: computers at the zoom that makes each focused card 325 px wide, phones zoomed up by the same percentage a 1440×900 computer gets over its fit for that family (not 325 px) — both views (Entry 72); sunburst turns by dragging around its centre, labels upright, angle kept (Entry 35); intro splash: one of two cut-out maple trees at random on #161616, hold 3 s, fade 0.5 s to the Paternal sunburst (Entry 32); two-part names: Vietnamese first, English second (Entry 57), stored as name + alt and shown "Name (Alternate)" (Entry 58); spreadsheet fixes live in data/corrections.json (names) and data/structure.json (who belongs where); full names
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

- v2: photo upload page + QR, family code, photo house rules, admin sign-in, live edits with Hanh's approval log
  (Supabase tables), editor, Bà Lịch's sunburst (waiting on her data) + tree picker, Tường's own sunburst, go-live.
- Open notes: "??" parents in search lines; pinch zoom in the snapped view; Bà Lịch as focal sees Bà Thương through
  Ông Hai's view.
