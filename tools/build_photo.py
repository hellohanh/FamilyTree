#!/usr/bin/env python3
"""Build photo/index.html — the picture page (Entry 143) — from photo/src/index.template.html.
Hạnh's tree is the same tree the main page shows (taken from the built root index.html, so run build_v2.py first);
other trees load from Supabase in the page.
Run: python3 tools/build_v2.py . && python3 tools/build_photo.py ."""
import json, re, sys, pathlib
R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
main = (R/'index.html').read_text(encoding='utf-8')
m = re.search(r'const T=(\{.*?\}), KIN=', main, re.S)
assert m, 'tree not found in index.html — run tools/build_v2.py first'
tree = m.group(1)
name = json.load(open(R/'data/trees.json', encoding='utf-8'))['H.HN.T Paternal Tree']['name']
t = (R/'photo/src/index.template.html').read_text(encoding='utf-8')
assert t.count('__TREE__') == 1 and t.count('__TREENAME__') == 1
t = t.replace('__TREE__', tree).replace('__TREENAME__', json.dumps(name, ensure_ascii=False))
(R/'photo/index.html').write_text(t, encoding='utf-8')
print('photo/index.html', len(t)//1024, 'KB')
