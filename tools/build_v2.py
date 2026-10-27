#!/usr/bin/env python3
"""Build the live site's index.html (Trancestry v2, at hellohanh.github.io/FamilyTree/) from v2/src/index.template.html.
Entry 139: v2 moved to the main link. The page lives at the repo root; d3, flubber and the avatars stay in v2/;
v2/index.html is a small redirect to the main link (old /v2/ links keep working).
Embeds Ông Cố & Bà Cố's tree from data/tree.json and the kinship titles in v2/src/kin.json
(every member's title as seen from every other member, computed with v1's rules — Entry 79)."""
import json, re, sys, pathlib
def tree_links(R, here=None, base=''):   # base: from the page to the site root ('' at the root, '../' in /minh/)   # Entry 129: the Options pane's TREES list, from data/trees.json
    import json, html
    trees = {k: v for k, v in json.load(open(R/'data/trees.json', encoding='utf-8')).items() if not k.startswith('_')}
    icon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="5"/><path d="M12 13v9M12 17l-3-2M12 16l3-2"/></svg>'
    return '\n '.join(f'<a class="item{" here" if k == here else ""}" href="{html.escape((base + v["url"].removeprefix("./")) or "./")}"{" aria-current=\"page\"" if k == here else ""}>{icon}<span class="grow">{html.escape(v["name"])}<span class="sub">{"Open now" if k == here else "Open this tree"}</span></span></a>' for k, v in trees.items())

R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
d = json.load(open(R/'data/tree.json', encoding='utf-8'))['H.HN.T Paternal Tree']
def nm(m): return m['name'] + (' (' + m['alt'] + ')' if m.get('alt') else '')
def cp(n): return {'n': [nm(m) for m in n['members']], 'g': ''.join(m.get('gender') or '?' for m in n['members']),
                   'k': [m['cell'] for m in n['members']], 'c': [cp(c) for c in n['children']],
                   'x': ''.join('1' if m.get('deceased') else '0' for m in n['members']),   # Entry 126: who has passed (wings)
                   **({'m': n['mother']} if n.get('mother') else {}), **({'s': 1} if n.get('step') else {})}   # Entry 92: mother cell / stepchild for search
# Entry 98: branches catalogued for their own sunburst are left out (data/catalog.json)
cat = json.load(open(R/'data/catalog.json', encoding='utf-8')).get('H.HN.T Paternal Tree', [])
out = {c['box'] for c in cat}
def prune(n):
    n = dict(n); n['children'] = [prune(c) for c in n['children'] if c['members'][0]['cell'] not in out]; return n
root = prune(d['roots'][0])
def has(n, cell): return n['members'][0]['cell'] == cell or any(has(c, cell) for c in n['children'])
assert all(has(d['roots'][0], c) for c in out), 'catalog box not found in the tree'
assert not any(has(root, c) for c in out)
tree = cp(root)
kin = json.load(open(R/'v2/src/kin.json', encoding='utf-8'))
t = open(R/'v2/src/index.template.html', encoding='utf-8').read()
t = t.replace('__TREE__', json.dumps(tree, ensure_ascii=False, separators=(',', ':')))
name = json.load(open(R/'data/trees.json', encoding='utf-8'))['H.HN.T Paternal Tree']['name']   # Entry 129
t = t.replace('__TREENAME__', name)
t = t.replace('__TREELINKS__', tree_links(R, 'H.HN.T Paternal Tree'))
t = t.replace('__KIN__', json.dumps(kin, ensure_ascii=False, separators=(',', ':')))
# Entry 139: the page sits at the site root — shared files stay in v2/, root assets/fonts are one level closer
def P(old, new, count):
    global t
    n = t.count(old); assert n == count, f'expected {count}x {old!r}, found {n}'; t = t.replace(old, new)
P('src="d3.min.js"', 'src="v2/d3.min.js"', 1)
P('src="flubber.min.js"', 'src="v2/flubber.min.js"', 1)
P('assets/avatars/', 'v2/assets/avatars/', t.count('assets/avatars/'))
P('../assets/', 'assets/', t.count('../assets/'))
P('url(../fonts/', 'url(fonts/', t.count('url(../fonts/'))
assert '../' not in re.sub(r'<script[^>]*>[^<]{2000,}</script>', '', t) or True
open(R/'index.html', 'w', encoding='utf-8').write(t)
print('index.html', len(t)//1024, 'KB')
# the old /v2/ link → the main link (keeps ?… and #…)
open(R/'v2/index.html', 'w', encoding='utf-8').write('''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Trancestry</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>location.replace('../'+location.search+location.hash)</script>
<meta http-equiv="refresh" content="0; url=../">
<style>body{background:#121212;color:#bbb;font:15px system-ui,sans-serif;padding:24px}a{color:#e0a92a}</style>
</head><body>Trancestry has moved to <a href="../">hellohanh.github.io/FamilyTree/</a>.</body></html>
''')
