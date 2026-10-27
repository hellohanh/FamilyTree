#!/usr/bin/env python3
"""Build v2/index.html (the Trancestry preview) from v2/src/index.template.html.
Embeds Ông Cố & Bà Cố's tree from data/tree.json and the kinship titles in v2/src/kin.json
(every member's title as seen from every other member, computed with v1's rules — Entry 79)."""
import json, sys, pathlib
R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
d = json.load(open(R/'data/tree.json', encoding='utf-8'))['H.HN.T Paternal Tree']
def nm(m): return m['name'] + (' (' + m['alt'] + ')' if m.get('alt') else '')
def cp(n): return {'n': [nm(m) for m in n['members']], 'g': ''.join(m.get('gender') or '?' for m in n['members']),
                   'k': [m['cell'] for m in n['members']], 'c': [cp(c) for c in n['children']],
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
t = t.replace('__KIN__', json.dumps(kin, ensure_ascii=False, separators=(',', ':')))
open(R/'v2/index.html', 'w', encoding='utf-8').write(t)
print('v2/index.html', len(t)//1024, 'KB')
