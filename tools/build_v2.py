#!/usr/bin/env python3
"""Build v2/index.html (the Trancestry preview) from v2/src/index.template.html.
Embeds Ông Cố & Bà Cố's tree from data/tree.json and the kinship titles in v2/src/kin.json
(every member's title as seen from every other member, computed with v1's rules — Entry 79)."""
import json, sys, pathlib
def tree_links(R, here=None):   # Entry 129: the Options pane's TREES list, from data/trees.json
    import json, html
    trees = {k: v for k, v in json.load(open(R/'data/trees.json', encoding='utf-8')).items() if not k.startswith('_')}
    icon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="5"/><path d="M12 13v9M12 17l-3-2M12 16l3-2"/></svg>'
    return '\n '.join(f'<a class="item{" here" if k == here else ""}" href="{html.escape(v["url"])}"{" aria-current=\"page\"" if k == here else ""}>{icon}<span class="grow">{html.escape(v["name"])}<span class="sub">{"Open now" if k == here else "Open this tree"}</span></span></a>' for k, v in trees.items())

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
open(R/'v2/index.html', 'w', encoding='utf-8').write(t)
print('v2/index.html', len(t)//1024, 'KB')
