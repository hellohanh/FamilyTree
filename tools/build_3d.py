#!/usr/bin/env python3
"""Build 3d/index.html — the 3D page (Entry 160): pick up to 5 trees, shown as stacked sunburst discs joined by gold
threads where the same person is in two trees. Built-in trees: data/tree.json sheets (as the main page shows them,
confirmed updates folded in); links: data/links.json; database trees (Minh's) load in the page.
Run: python3 tools/build_3d.py ."""
import json, sys, pathlib
R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from build_v2 import v2_tree
import build_minh
TJ = {k: v for k, v in json.load(open(R/'data/trees.json', encoding='utf-8')).items() if not k.startswith('_') and 'link' in v}
def back(B):   # the store's {root, people} → the engine's {n,g,k,c,m?}
    P = B['people']
    nm = lambda i: ((P[i].get('title') + ' ') if P[i].get('title') else '') + (P[i].get('first') or '??') + (f" ({P[i]['alt']})" if P[i].get('alt') else '')
    def cv(n): return {'n': [nm(i) for i in n['k']], 'g': ''.join(P[i].get('g') or '?' for i in n['k']), 'k': n['k'], 'c': [cv(c) for c in n.get('c', [])]}
    return cv(B['root'])
bases = build_minh.linked(R, {v['link']: build_minh.fold(R, v['link'], build_minh.base(v2_tree(R, k))) for k, v in TJ.items()})
trees = [{'link': v['link'], 'name': v['name'], 'tree': back(bases[v['link']])} for k, v in TJ.items()]
t = (R/'3d/src/index.template.html').read_text(encoding='utf-8')
assert t.count('__TREES__') == 1 and t.count('__LINKS__') == 1
# Entry 193 (Hanh): the navigation pane is always there — copied from the main page's template (same look and items);
# 3d/src's own script wires each item to the main page
v = (R/'v2/src/index.template.html').read_text(encoding='utf-8')
c0 = v.index('/* Entry 89 (Hanh): navigation pane'); c1 = v.index('</style>', c0)
h0 = v.index('<nav id="pane"'); h1 = v.index('<script', h0)
pane = v[h0:h1].replace('__TREELINKS__', build_minh.tree_links(R, None, '../'))
assert t.count('__PANECSS__') == 1 and t.count('__PANE__') == 1 and 'id="rHandle"' in pane and 'id="pCentral"' in pane
t = t.replace('__PANECSS__', v[c0:c1]).replace('__PANE__', pane)
t = t.replace('__TREES__', json.dumps(trees, ensure_ascii=False, separators=(',', ':'))).replace('__LINKS__', json.dumps(build_minh.links(R), ensure_ascii=False, separators=(',', ':')))
(R/'3d/index.html').write_text(t, encoding='utf-8')
print('3d/index.html', len(t)//1024, 'KB')
