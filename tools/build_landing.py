#!/usr/bin/env python3
"""Build the landing page (S017, Entry 242) — welcome/src/landing.template.html + welcome/src/splash.js → welcome/index.html.

The plain main link (hellohanh.github.io/FamilyTree/) shows it over the wheel once per visit (v2/src/index.template.html,
"S017 landing"): it plays the site's splash, the tree glides beside the heading, and "Open the family tree" lifts it
away. /FamilyTree/welcome/ also opens on its own.

Tree names and the tree count come from data/trees.json (never typed by hand). Fonts (Geist; Playfair for the splash
title), icons (Phosphor, welcome/src/icons) and pictures are files in the repo.

  python3 tools/build_landing.py .                      → welcome/index.html (files referenced from ../)
  python3 tools/build_landing.py . --mockup <out.html>  → one self-contained file to send as a preview
"""
import base64, json, re, sys, html
from pathlib import Path

R = Path(sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else '.')
mock = sys.argv[sys.argv.index('--mockup') + 1] if '--mockup' in sys.argv else None
S = R / 'welcome/src'
t = (S / 'landing.template.html').read_text(encoding='utf-8')

def uri(p, mime):
    return f'data:{mime};base64,' + base64.b64encode(Path(p).read_bytes()).decode()
def ref(rel, mime):   # a repo file: a ../ link on the site, embedded in the mockup
    return uri(R / rel, mime) if mock else '../' + rel

# Entry 242: the season calendar, recolouring and leaf builder are shared with the site's splash — they must match
_sp, _v2 = (S / 'splash.js').read_text(encoding='utf-8'), (R / 'v2/src/index.template.html').read_text(encoding='utf-8')
for _a, _b in (('const CALENDAR', 'c.putImageData(im,0,0)}'), ('function build(aw,ah){', '\n// the finished tree')):
    _x = _sp[_sp.index(_a):_sp.index(_b, _sp.index(_a))]
    assert _x in _v2, f'welcome/src/splash.js and v2/src/index.template.html differ in the block starting {_a!r}: copy it across'

# fonts
ranges = json.loads((S / 'geist-ranges.json').read_text())
faces = [f"@font-face{{font-family:'Geist';font-style:normal;font-weight:{w};font-display:swap;"
         f"src:url({ref(f'fonts/geist-{s}-{w}-normal.woff2', 'font/woff2')}) format('woff2');unicode-range:{ranges[s]}}}"
         for w in (400, 500, 600) for s in ('latin', 'latin-ext', 'vietnamese')]
vn = ranges['vietnamese']
faces += [f'@font-face{{font-family:"Playfair Display";font-weight:700;src:url({ref("fonts/playfair-display-vietnamese-700-normal.woff2", "font/woff2")}) format("woff2");unicode-range:{vn}}}',
          f'@font-face{{font-family:"Playfair Display";font-weight:700;src:url({ref("fonts/playfair-display-latin-700-normal.woff2", "font/woff2")}) format("woff2")}}']

# icons (Phosphor regular), drawn in currentColor
def icon(name):
    s = (S / 'icons' / f'{name}.svg').read_text()
    s = re.sub(r'<svg[^>]*>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">', s, count=1)
    return s.replace('<svg ', '<svg class="plus" ', 1) if name == 'plus' else s
t = re.sub(r'__I_([a-z-]+)__', lambda m: icon(m.group(1)), t)

# the splash: its script + the two trees' pictures
pics = ','.join("{b:'%s',l:'%s'}" % (ref(f'assets/splash{n}-v2-branches.webp', 'image/webp'), ref(f'assets/splash{n}-v2-leaves.webp', 'image/webp')) for n in (1, 2))
t = t.replace('__SPLASH_JS__', (S / 'splash.js').read_text(encoding='utf-8').replace('__TREE_PICS__', pics))
t = t.replace('__WHEEL__', ref('assets/landing-wheel.webp', 'image/webp'))
t = t.replace('__WINGS__', ref('assets/wings_marigold.png', 'image/png'))
t = t.replace('__FAVICON__', ref('assets/favicon-32.png?v=2', 'image/png') if not mock else uri(R / 'assets/favicon-32.png', 'image/png'))

# trees (from data/trees.json)
site = 'https://hellohanh.github.io/FamilyTree/' if mock else '../'
trees = [v for k, v in json.loads((R / 'data/trees.json').read_text(encoding='utf-8')).items() if not k.startswith('_')]
words = {1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight'}
t = t.replace('__TREECOUNT_WORD__', words.get(len(trees), str(len(trees))))
t = t.replace('__DEFAULT_TREE__', html.escape(trees[0]['name']))
cards = []
for v in sorted(trees, key=lambda v: v['name']):
    href = site + v['url'].removeprefix('./')
    cards.append(f'      <a class="tree reveal" href="{html.escape(href)}"><span class="ic">{icon("tree")}</span>'
                 f'<span class="grow"><span class="title-3" style="display:block">{html.escape(v["name"])}</span>'
                 f'<span class="caption-5 faint">Open this tree</span></span><span class="go">{icon("arrow-right")}</span></a>')
t = t.replace('__TREES__', '\n'.join(cards))
t = t.replace('__SITE__', site)
t = t.replace('__FONTS__', '\n'.join(faces))

left = re.findall(r'__[A-Z_]+__', t)
assert not left, left
out = Path(mock) if mock else R / 'welcome/index.html'
out.write_text(t, encoding='utf-8')
print(out, f'{out.stat().st_size / 1024:.0f} KB', len(trees), 'trees')
